'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { X } from 'lucide-react';
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
import { usePathname } from 'next/navigation';
import apiCall from '@/lib/axios';
import {
  createRefundSchema,
  createRefundSchemaType
} from 'schema/company-panel';
import { useEffect, useState } from 'react';
import { ToastAtTopRight } from '@/lib/sweetalert';

export interface RefundFormProps {
  data?: createRefundSchemaType | null;
  isLoading?: boolean;
  isHotel?: boolean;
  mode?: 'create' | 'edit';
  onClose?: () => void;
  onSuccess?: () => void;
  HotelId?: string;
  GuestId?: string;
}

const CreateRefundForm: React.FC<RefundFormProps> = ({
  mode,
  onClose,
  onSuccess,
  data,
  HotelId,
  GuestId
}) => {
  const pathname = usePathname();

  const SuperRefundPage = pathname?.startsWith(
    '/super-admin/refund-management'
  );
  const HotelRefundPage = pathname?.startsWith(
    '/hotel-panel/refund-management'
  );

  // const form = useForm<createRefundSchemaType>({
  //   resolver: zodResolver(createRefundSchema),
  //   defaultValues: {
  //     GuestId: '',
  //     hotelId: '',
  //     amount: undefined,
  //     refundReason: '',
  //     refundStatus: 'Initiated',
  //     message: '',
  //     assignedStaff: '',
  //     serviceDepartment: '',
  //     dateAndTime: ''
  //   }
  // });
  const form = useForm<createRefundSchemaType>({
    resolver: zodResolver(createRefundSchema),
    defaultValues: {
      HotelId: '',
      transactionId: '',
      mode: '',
      userID: '',
      GuestId: '',
      amount: undefined,
      refundReason: '',
      phoneNumber: '',
      refundStatus: 'Initiated',
      rejectreason: '',
      feedback: ''
    }
  });

  const [status, setStatus] = useState('Initiated');
  useEffect(() => {
    if (mode === 'edit' && HotelId) {
      const fetchRefundData = async () => {
        try {
          const response = await apiCall('get', `/api/refund/${HotelId}`);
          const refundData = response?.refund;
          console.log('ssssss', refundData); // should now print your refund object
          if (refundData) {
            form.reset({
              HotelId: refundData.hotel?._id || '',
              amount: refundData.amount || undefined,
              //GuestId: HotelRefundPage ? refundData.guest || '' : '',
              refundReason: refundData.reason || '',
              refundStatus: refundData.status || ''
            });

            setStatus(refundData.status || 'Initiated');
          }
        } catch (error) {
          console.error('Error fetching refund data:', error);
        }
      };

      fetchRefundData();
    }
  }, [mode, HotelId]);
  const [hotelstatus, setHotelStatus] = useState('Initiated');

  useEffect(() => {
    if (mode === 'edit' && GuestId) {
      const fetchRefundData = async () => {
        try {
          const response = await apiCall('get', `/api/refund/${GuestId}`);
          const refundData = response?.refund;
          console.log('Hotel Panel Refund Data:', refundData);

          if (refundData) {
            form.reset({
              amount: refundData.amount || undefined,
              phoneNumber: refundData.guest.phoneNumber || undefined,
              GuestId: refundData.guest || '',
              refundReason: refundData.reason || '',
              transactionId: refundData.orderId || '',
              rejectreason: refundData.rejectReason || '',
              feedback: refundData.feedback || '', // ✅ ensure this is included
              refundStatus: refundData.status || ''
            });

            setStatus(refundData.status || 'Initiated');
          }
        } catch (error) {
          console.error('Error fetching refund data (Hotel Panel):', error);
        }
      };

      fetchRefundData();
    }
  }, [mode, GuestId]);
  const [isManuallySelectedRejected, setIsManuallySelectedRejected] =
    useState(false);

  // const onSubmit = async (data: createRefundSchemaType) => {
  //   try {
  //     let payload;
  //     let endpoint;

  //     if (mode === 'edit') {
  //       if (HotelRefundPage) {
  //         // ✅ Hotel Panel edit mode using GuestId for PUT
  //         payload = {
  //           GuestId: data.GuestId,
  //           amount: data.amount,
  //           reason: data.refundReason,
  //           status: data.refundStatus,
  //           feedback: data.feedback,
  //           rejectreason: data.rejectreason
  //         };
  //         endpoint = `/api/refund/${GuestId}`; // use same `hotelId` param which is actually refund _id
  //         await apiCall('PUT', endpoint, payload);
  //         ToastAtTopRight.fire({
  //           icon: 'success',
  //           title: 'Refund updated successfully'
  //         });
  //       } else {
  //         // ✅ Super Admin Panel edit mode using HotelId
  //         payload = {
  //           hotelID: data.HotelId,
  //           amount: data.amount,
  //           reason: data.refundReason,
  //           status: data.refundStatus,
  //           feedback: data.feedback,
  //           rejectreason: data.rejectreason
  //         };
  //         endpoint = `/api/refund/${HotelId}`;
  //         await apiCall('PUT', endpoint, payload);
  //       }
  //       ToastAtTopRight.fire({
  //         icon: 'success',
  //         title: 'Refund updated successfully'
  //       });
  //     } else {
  //       if (SuperRefundPage) {
  //         payload = {
  //           HotelId: data.HotelId,
  //           transactionId: data.transactionId,
  //           amount: data.amount,
  //           reason: data.refundReason,
  //           mode: data.mode,
  //           phoneNumber: data.phoneNumber
  //         };
  //         endpoint = '/api/refund/hotel';
  //       } else {
  //         payload = {
  //           amount: data.amount,
  //           mode: data.mode,
  //           transactionId: data.transactionId,
  //           reason: data.refundReason,
  //           phoneNumber: data.phoneNumber
  //         };
  //         endpoint = 'api/refund/guest';
  //       }
  //       await apiCall('POST', endpoint, payload);
  //       ToastAtTopRight.fire({
  //         icon: 'success',
  //         title: 'Refund created successfully'
  //       });
  //     }

  //     form.reset();
  //     onSuccess?.();
  //   } catch (error) {
  //     console.error('Refund submission failed:', error);
  //     ToastAtTopRight.fire({
  //       icon: 'error',
  //       title: 'Refund submission failed'
  //     });
  //   }
  // };
  const onSubmit = async (data: createRefundSchemaType) => {
    try {
      // ✅ phone guard for create
      if (mode !== 'edit') {
        const raw = (data.phoneNumber ?? '').trim();
        if (!raw) {
          ToastAtTopRight.fire({
            icon: 'error',
            title: 'Guest phone is required'
          });
          return;
        }
        // very light normalization: remove spaces/-, drop leading 0 or +91, then re-add +91 if 10 digits
        const digits = raw.replace(/[^\d]/g, '').replace(/^0+/, '');
        // .replace(/^91(?=\d{10}$)/, '');
        const local = digits.replace(/^91(?=\d{10}$)/, '');
        const phoneToSend =
          digits.length === 10
            ? `+91${digits}`
            : raw.startsWith('+')
              ? raw
              : `+${digits}`;

        data.phoneNumber = local;
      }

      let payload: any;
      let endpoint: string;

      if (mode === 'edit') {
        if (HotelRefundPage) {
          payload = {
            GuestId: data.GuestId, // if your API supports it
            amount: data.amount,
            reason: data.refundReason,
            status: data.refundStatus,
            feedback: data.feedback,
            rejectreason: data.rejectreason,
            guestPhone: data.phoneNumber || undefined // optional, if editing phone
          };
          endpoint = `/api/refund/${GuestId}`;
          await apiCall('PUT', endpoint, payload);
          ToastAtTopRight.fire({
            icon: 'success',
            title: 'Refund updated successfully'
          });
        } else {
          payload = {
            hotelID: data.HotelId,
            amount: data.amount,
            reason: data.refundReason,
            status: data.refundStatus,
            feedback: data.feedback,
            rejectreason: data.rejectreason,
            guestPhone: data.phoneNumber || undefined
          };
          endpoint = `/api/refund/${HotelId}`;
          await apiCall('PUT', endpoint, payload);
          ToastAtTopRight.fire({
            icon: 'success',
            title: 'Refund updated successfully'
          });
        }
      } else {
        // ✅ CREATE
        if (SuperRefundPage) {
          payload = {
            HotelId: data.HotelId,
            transactionId: data.transactionId,
            amount: data.amount,
            reason: data.refundReason,
            mode: data.mode,
            guestPhone: data.phoneNumber // ✅ now guaranteed
          };
          endpoint = '/api/refund/hotel';
        } else {
          payload = {
            amount: data.amount,
            mode: data.mode,
            transactionId: data.transactionId,
            reason: data.refundReason,
            guestPhone: data.phoneNumber // ✅ present for guest
          };
          endpoint = '/api/refund/guest'; // ✅ add leading slash
        }
        await apiCall('POST', endpoint, payload);
        ToastAtTopRight.fire({
          icon: 'success',
          title: 'Refund created successfully'
        });
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Refund submission failed:', error);
      ToastAtTopRight.fire({
        icon: 'error',
        title: 'Refund submission failed'
      });
    }
  };

  return (
    <FormWrapper title="">
      <Form {...form}>
        <form
          // onSubmit={(e) => {
          //   console.log('Native form submit triggered');
          //   form.handleSubmit(onSubmit)(e);
          // }}
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full relative h-full max-w-4xl mx-auto p-4 sm:px-6 md:px-8 rounded-lg"
        >
          {/* <button
            type="button"
            onClick={onClose}
            className="absolute top-1 right-1 text-black hover:text-yellow-950"
          >
            <X className="w-6 h-6" />
          </button> */}
          {/* Main Grid: Two Sides */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Left Side */}
            <div className="flex flex-col gap-3">
              {/* <FormField
                control={form.control}
                name="refundID"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                      Refund ID
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-xs mt-1" />
                    </div>
                  </FormItem>
                )}
              /> */}
              {/* Show User ID only on Hotel Panel */}
              {HotelRefundPage && (
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                        Guest Phone
                      </FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] text-xs mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {/* Show Hotel ID only on Super Admin Refund Page */}
              {SuperRefundPage && (
                <FormField
                  control={form.control}
                  name="HotelId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                        Hotel ID
                      </FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] text-xs mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                      Transaction ID
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-xs mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                      Mode
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <select
                          {...field}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        >
                          {/* Example dropdown options */}
                          <option value="CashFree">CashFree</option>
                          <option value="Cash">Cash</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-[10px] text-xs mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Refund Status */}
              {/* <FormField
                control={form.control}
                name="refundStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row gap-2">
                    <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 pt-1 shrink-0">
                      Refund Status
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            setIsManuallySelectedRejected(value === 'Rejected');
                          }}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          {['Initiated'].map((value) => (
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
                      <FormMessage className="text-[10px] text-xs mt-1" />
                    </div>
                  </FormItem>
                )}
              /> */}

              {form.watch('refundStatus') === 'Completed' && (
                <FormField
                  control={form.control}
                  name="completionNote"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-start gap-2">
                      <FormLabel className="w-full sm:w-36 2xl:w-40 pt-1 text-xs 2xl:text-sm font-medium  shrink-0">
                        Feedback
                      </FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <textarea
                            {...field}
                            rows={4}
                            placeholder="Add note for completion"
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm resize-none"
                            //className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border  outline-none focus:ring-0 text-xs 2xl:text-sm resize-none"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] text-xs mt-1 " />
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {/* ⬇️ Conditional Rejection Reason (just below refund status) */}
              {isManuallySelectedRejected && (
                <FormField
                  control={form.control}
                  name="rejectreason"
                  render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-start gap-2">
                      <FormLabel className="w-full sm:w-36 2xl:w-40 pt-1 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                        Reason for Rejection
                      </FormLabel>
                      <div className="w-full">
                        <FormControl>
                          <textarea
                            {...field}
                            rows={4}
                            placeholder="Specify reason for rejection"
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm resize-none"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] text-xs mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Right Side */}
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <FormLabel className="w-full sm:w-36 2xl:w-40 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                      Refund Amount
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          value={field.value ?? ''}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-xs mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="refundReason"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <FormLabel className="w-full sm:w-36 2xl:w-40 pt-1 text-xs 2xl:text-sm font-medium text-gray-700 shrink-0">
                      Reason for Refund
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <textarea
                          {...field}
                          rows={4}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm resize-none"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-xs mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              {/* {isRefundPage && (
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Your message here..."
                          rows={10}
                          cols={50}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-3 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm resize-none"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-xs mt-1" />
                    </FormItem>
                  )}
                />
              )} */}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <Button type="submit" className="md:ml-24 btn-primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
};

export default CreateRefundForm;
