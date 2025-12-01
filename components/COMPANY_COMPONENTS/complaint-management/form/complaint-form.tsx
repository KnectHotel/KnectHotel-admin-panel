'use client';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  complaintFormSchema,
  ComplaintFormSchemaType
} from 'schema/company-panel';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FormWrapper from './form-wrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';
import apiCall from '@/lib/axios';

// Toasts
import type { SweetAlertIcon } from 'sweetalert2';
import { ToastAtTopRight } from '@/lib/sweetalert';

const showToast = (icon: SweetAlertIcon, title: string, ms = 2200) =>
  ToastAtTopRight.fire({
    icon,
    title,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: ms,
    timerProgressBar: true
  });

const fmtDateTime = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  // en-IN format, date + time (24h/AM-PM handled by locale)
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

type FeedbackBlock = {
  complaintFeedback: string;
  complaintRating: number;
  agentFeedback: string;
  agentRating: number;
};

// ⭐ Editable star input (used when canEdit = true), else read-only
const StarInput: React.FC<{
  value?: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
}> = ({ value = 0, onChange, readOnly }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex gap-1">
      {stars.map((n) => {
        const active = n <= value;
        const common = 'cursor-pointer select-none text-base';
        const cls = active ? 'text-yellow-500' : 'text-gray-300';
        if (readOnly) {
          return (
            <span key={n} className={`${common} ${cls}`}>
              ★
            </span>
          );
        }
        return (
          <button
            type="button"
            key={n}
            onClick={() => onChange?.(n)}
            className="p-0 leading-none"
            aria-label={`Rate ${n}`}
            title={`Rate ${n}`}
          >
            <span className={`${common} ${cls}`}>★</span>
          </button>
        );
      })}
    </div>
  );
};

const STATUS_OPTIONS = ['Open', 'Resolved', 'In-Progress'] as const;
type UIStatus = (typeof STATUS_OPTIONS)[number];

function normalizeStatus(input?: string): UIStatus {
  const key = (input ?? '').replace(/[\s_-]/g, '').toLowerCase();
  if (key === 'resolved') return 'Resolved';
  if (key === 'inprogress') return 'In-Progress';
  return 'Open';
}

const ComplaintForm = ({
  mode = 'view',
  complaintID,
  source = 'hotel-toUser'
}: {
  mode: 'add' | 'edit' | 'view' | 'pending';
  complaintID?: string;
  source: 'hotel-toUser' | 'hotel-toSuper' | 'superadmin';
}) => {
  const [feedbackBlock, setFeedbackBlock] = useState<FeedbackBlock>({
    complaintFeedback: '',
    complaintRating: 0,
    agentFeedback: '',
    agentRating: 0
  });
  const [hasFeedback, setHasFeedback] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hotelDetails, setHotelDetails] = useState({
    hotelId: '',
    hotelName: ''
  });

  // Only hotel-toSuper can edit (incl. feedback)
  const canEdit = source === 'hotel-toSuper';
  const isDisabled = useMemo(() => !canEdit && mode !== 'add', [canEdit, mode]);

  const form = useForm<ComplaintFormSchemaType>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      complaintID: '',
      userID: '',
      hotelID: '',
      complaintCategory: 'Subscription',
      description: '',
      feedback: '', // schema keeps a string – we won't use this field for object feedback
      status: 'Open',
      assignedStaff: '',
      dateAndTime: '',
      uniqueId: '',
      firstName: '',
      lastName: '',
      email: '',
      assignedRoomNumber: '',
      complaintType: '',
      estimatedDeliveryTime: '',
      remark: '',
      hotelName: ''
    }
  });

  // Fetch complaint and hydrate
  useEffect(() => {
    if (!complaintID) return;

    const fetchComplaint = async () => {
      try {
        const res = await apiCall(
          'GET',
          source === 'hotel-toUser' || source === 'hotel-toSuper'
            ? `/api/complaint/hotel/complaints/${complaintID}`
            : `/api/complaint/platform/complaints/${complaintID}`
        );

        const complaint = res?.complaint;
        console.log(complaint);
        if (!complaint) {
          showToast('warning', 'Complaint details not found.');
          return;
        }

        setHotelDetails({
          hotelId: complaint.HotelId?.HotelId || '',
          hotelName: complaint.HotelId?.name || ''
        });

        const isHotelComplaint = complaint.scope === 'Hotel';
        const raiser = isHotelComplaint
          ? complaint.raisedByGuest
          : complaint.raisedByAdmin;

        // Feedback normalize
        const fb = complaint.feedback;
        if (fb && typeof fb === 'object') {
          const normalized: FeedbackBlock = {
            complaintFeedback: fb.complaintFeedback ?? '',
            complaintRating: Number(fb.complaintRating ?? 0),
            agentFeedback: fb.agentFeedback ?? '',
            agentRating: Number(fb.agentRating ?? 0)
          };
          setFeedbackBlock(normalized);
          setHasFeedback(
            !!(
              normalized.complaintFeedback ||
              normalized.agentFeedback ||
              normalized.complaintRating ||
              normalized.agentRating
            )
          );
        } else {
          setFeedbackBlock({
            complaintFeedback: '',
            complaintRating: 0,
            agentFeedback: '',
            agentRating: 0
          });
          setHasFeedback(false);
        }

        form.reset({
          complaintID: complaint._id || '',
          hotelID: complaint.HotelId?.HotelId || complaint.HotelId || '',
          uniqueId: complaint.uniqueId || '',
          firstName: raiser?.firstName || '',
          lastName: raiser?.lastName || '',
          assignedRoomNumber: raiser?.assignedRoomNumber || '',
          email: raiser?.email || '',
          userID: raiser?._id || '',
          complaintCategory: complaint.complaintType || 'Subscription',
          complaintType: complaint.complaintType || '',
          description: complaint.description || '',
          feedback: '',
          status: normalizeStatus(complaint.status) ?? 'Open',
          assignedStaff: complaint.assignedTo
            ? `${complaint.assignedTo.firstName} ${complaint.assignedTo.lastName} (${complaint.assignedTo.mobileNumber})`
            : '',
          dateAndTime: complaint.createdAt
            ? new Date(complaint.createdAt).toLocaleString()
            : '',
          estimatedDeliveryTime: complaint.estimatedDeliveryTime
            ? fmtDateTime(complaint.estimatedDeliveryTime)
            : '',
          remark: complaint.remark || '',
          hotelName: complaint.HotelId?.name || ''
        });
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch complaint';
        showToast('error', msg);
      }
    };

    fetchComplaint();
  }, [complaintID, form, source]);

  const onSubmit = async (data: ComplaintFormSchemaType) => {
    setIsSaving(true);
    try {
      if (mode === 'add') {
        // Build payload for add
        if (source === 'hotel-toUser') {
          await apiCall('POST', `api/complaint/hotel/complaints`, {
            complaintType: data.complaintCategory,
            description: data.description
          });
          showToast('success', 'Hotel complaint submitted successfully');
        } else {
          await apiCall('POST', `/api/complaint/platform/complaints/platform`, {
            complaintType: data.complaintCategory,
            description: data.description,
            HotelId: data.hotelID
          });
          showToast('success', 'Platform complaint submitted successfully');
        }
        form.reset();
        setIsSaving(false);
        return;
      }

      // EDIT / UPDATE
      const id = data.complaintID;
      if (!id) {
        showToast('error', 'Complaint ID missing.');
        setIsSaving(false);
        return;
      }

      const updatePath =
        source === 'hotel-toUser' || source === 'hotel-toSuper'
          ? `/api/complaint/hotel/complaints/${id}`
          : `/api/complaint/platform/complaints/${id}`;

      // Minimal safe payload – include feedback object
      const payload: any = {
        complaintType: data.complaintType || data.complaintCategory,
        description: data.description,
        status: data.status,
        assignedStaff: data.assignedStaff, // if backend ignores, safe to send
        feedback: {
          complaintFeedback: feedbackBlock.complaintFeedback,
          complaintRating: feedbackBlock.complaintRating,
          agentFeedback: feedbackBlock.agentFeedback,
          agentRating: feedbackBlock.agentRating
        },
        remark: data.remark
      };

      await apiCall('PUT', updatePath, payload);
      showToast('success', 'Complaint updated successfully');
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong!';
      showToast('error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchHotelData = async (hotelId: string) => {
    try {
      const res = await apiCall('GET', `/api/hotel/HotelId/${hotelId}`);
      if (res?.hotel) {
        setHotelDetails({
          hotelId: res.hotel.HotelId,
          hotelName: res.hotel.name
        });
      }
    } catch (err) {
      console.error('Failed to fetch hotel data:', err);
      setHotelDetails({ hotelId: '', hotelName: '' });
    }
  };

  return (
    <FormWrapper title="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            (data) => onSubmit(data),
            (errors) => {
              const firstErrorMsg = (Object.values(errors)[0]?.message ??
                'Please fix the highlighted fields.') as string;
              showToast('error', firstErrorMsg);
            }
          )}
          className="w-full h-full rounded-lg"
        >
          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {/* Left */}
            <div className="flex flex-col gap-3">
              {source === 'hotel-toUser' && (
                <>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <FormLabel className="w-full sm:w-32 text-xs 2xl:text-sm font-medium text-gray-700">
                          FirstName
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled
                              className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                        <FormLabel className="w-full sm:w-32 text-xs 2xl:text-sm font-medium text-gray-700">
                          LastName
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled
                              className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assignedRoomNumber"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <FormLabel className="w-full sm:w-32 text-xs 2xl:text-sm font-medium text-gray-700">
                          Assigned Room Number
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled
                              placeholder="—"
                              className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Complaint Unique ID (always view) */}
              <FormField
                control={form.control}
                name="uniqueId"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <FormLabel className="w-full sm:w-32 text-xs 2xl:text-sm font-medium text-gray-700">
                      Complaint ID
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          disabled
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedDeliveryTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <FormLabel className="w-full sm:w-32 text-xs 2xl:text-sm font-medium text-gray-700">
                      Estimated Resolution Time
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          disabled
                          placeholder="—"
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Hotel ID */}
              {(mode === 'view' ||
                (mode === 'add' && source === 'superadmin') ||
                (mode !== 'add' && source !== 'hotel-toUser')) && (
                <div className="flex flex-col gap-3">
                  {/* Hotel ID - Editable only for superadmin or hotel-toSuper */}
                  {(mode === 'add' || mode === 'edit') &&
                    source === 'superadmin' && (
                      <FormField
                        control={form.control}
                        name="hotelID"
                        render={({ field }) => (
                          <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <FormLabel className="w-full sm:w-32 text-xs 2xl:text-sm font-medium text-gray-700">
                              Hotel ID
                            </FormLabel>
                            <div className="w-full">
                              <FormControl>
                                <Input
                                  type="text"
                                  {...field}
                                  value={field.value}
                                  onBlur={async () =>
                                    fetchHotelData(field.value ?? '')
                                  }
                                  className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                                />
                              </FormControl>
                              <FormMessage className="text-[10px] mt-1" />
                            </div>
                          </FormItem>
                        )}
                      />
                    )}
                  {/* Display Hotel Name */}
                  <FormField
                    control={form.control}
                    name="hotelName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <FormLabel className="w-full sm:w-32 text-xs 2xl:text-sm font-medium text-gray-700">
                          Hotel Name
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              value={hotelDetails.hotelName}
                              // disabled
                              className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <FormLabel className="w-full sm:w-32 text-xs 2xl:text-sm font-medium text-gray-700">
                      Remark
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Complaint Type: Select in ADD, Input otherwise */}
              {mode === 'add' &&
              (source === 'superadmin' || source === 'hotel-toSuper') ? (
                // <FormField
                //   control={form.control}
                //   name="complaintCategory"
                //   render={({ field }) => (
                //     <FormItem className="relative">
                //       <FormLabel>Complaint Type</FormLabel>
                //       <FormControl>
                //         <Select
                //           onValueChange={field.onChange}
                //           value={field.value}
                //         >
                //           <SelectTrigger className="min-w-32 bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none">
                //             <SelectValue placeholder="Select type" />
                //           </SelectTrigger>
                //           <SelectContent className="bg-[#362913] rounded-2xl text-white border-2 shadow-md border-white">
                //             {[
                //               'Subscription',
                //               'Payment',
                //               ' Account',
                //               'Booking',
                //               'Refund',
                //               'Coupon',
                //               'Other'
                //             ].map((value) => (
                //               <SelectItem key={value} value={value}>
                //                 {value}
                //               </SelectItem>
                //             ))}
                //           </SelectContent>
                //         </Select>
                //       </FormControl>
                //       <FormMessage />
                //       <ChevronDown className="absolute right-1 top-[2.2rem] text-black w-4 h-4" />
                //     </FormItem>
                //   )}
                // />
                <FormField
                  control={form.control}
                  name="complaintCategory"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Complaint Type</FormLabel>
                      <FormControl>
                        <Select
                          // 👇 trim the selected value to be safe
                          onValueChange={(v) => field.onChange(v.trim())}
                          value={field.value}
                        >
                          <SelectTrigger className="min-w-32 bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#362913] rounded-2xl text-white border-2 shadow-md border-white">
                            {[
                              'Subscription',
                              'Payment',
                              'Account', // 👈 fixed (no leading space)
                              'Booking',
                              'Refund',
                              'Coupon',
                              'Other'
                            ].map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                      <ChevronDown className="absolute right-1 top-[2.2rem] text-black w-4 h-4" />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="complaintType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <FormLabel className="w-full sm:w-32 text-xs 2xl:text-sm font-medium text-gray-700">
                        Complaint Type
                      </FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            disabled={isDisabled}
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <FormLabel className="w-full sm:w-32 text-xs 2xl:text-sm font-medium text-gray-700">
                      Complaint Description
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row gap-2">
                    <FormLabel className="w-full sm:w-32 text-xs 2xl:text-sm font-medium text-gray-700 pt-1">
                      Status
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isDisabled}
                          className="flex flex-col space-y-2"
                        >
                          {STATUS_OPTIONS.map((value) => (
                            <div
                              key={value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem value={value} id={value} />
                              <label
                                htmlFor={value}
                                className="text-xs 2xl:text-sm text-gray-700 capitalize"
                              >
                                {value}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Right */}
            <div className="flex flex-col items-center md:items-start space-y-8 w-full">
              {/* Assigned Staff (editable only for hotel-toSuper) */}

              <FormField
                control={form.control}
                name="assignedStaff"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                    <FormLabel className="w-full sm:w-36 text-xs 2xl:text-sm font-medium text-gray-700">
                      Assigned Staff
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              {/* —— Feedback & Ratings —— */}
              <div className="w-full rounded-xl border border-[#E7D9C4] bg-[#F6EEE0] p-4 shadow-sm">
                <h3 className="text-sm 2xl:text-base font-semibold text-[#362913] mb-3">
                  Feedback & Ratings
                </h3>

                {/* Complaint rating + feedback */}
                <div className="mb-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs 2xl:text-sm text-gray-700">
                      Complaint Rating
                    </span>
                    <StarInput
                      value={feedbackBlock.complaintRating}
                      onChange={(v) =>
                        setFeedbackBlock((p) => ({ ...p, complaintRating: v }))
                      }
                      readOnly={!canEdit}
                    />
                  </div>
                  <textarea
                    value={feedbackBlock.complaintFeedback}
                    onChange={(e) =>
                      setFeedbackBlock((p) => ({
                        ...p,
                        complaintFeedback: e.target.value
                      }))
                    }
                    disabled={!canEdit}
                    rows={3}
                    className="mt-2 w-full rounded-md border border-[#E7D9C4] bg-white p-2 text-sm outline-none disabled:opacity-60"
                    placeholder="Write complaint feedback..."
                  />
                </div>

                <div className="h-px bg-[#E7D9C4] my-3" />

                {/* Agent rating + feedback */}
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs 2xl:text-sm text-gray-700">
                      Agent Rating
                    </span>
                    <StarInput
                      value={feedbackBlock.agentRating}
                      onChange={(v) =>
                        setFeedbackBlock((p) => ({ ...p, agentRating: v }))
                      }
                      readOnly={!canEdit}
                    />
                  </div>
                  <textarea
                    value={feedbackBlock.agentFeedback}
                    onChange={(e) =>
                      setFeedbackBlock((p) => ({
                        ...p,
                        agentFeedback: e.target.value
                      }))
                    }
                    disabled={!canEdit}
                    rows={3}
                    className="mt-2 w-full rounded-md border border-[#E7D9C4] bg-white p-2 text-sm outline-none disabled:opacity-60"
                    placeholder="Write agent feedback..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {mode === 'add' ? (
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <Button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </div>
          ) : canEdit ? (
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <Button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          ) : null}
        </form>
      </Form>
    </FormWrapper>
  );
};

export default ComplaintForm;
