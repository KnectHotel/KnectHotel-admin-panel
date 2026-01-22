'use client';
import React, { useEffect, useState } from 'react';
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity
} from 'country-state-city';

import { useParams, useRouter } from 'next/navigation';
import FormWrapper from './form-wrapper';



import { zodResolver } from '@hookform/resolvers/zod';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
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
import Image from 'next/image';
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, Trash } from 'lucide-react';
import { Heading } from '@/components/ui/heading';
import apiCall from '@/lib/axios';
import { ToastAtTopRight } from '@/lib/sweetalert';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { GuestDataType } from '@/components/tables/guest-table/columns';
import {
  useForm,
  useFieldArray,
  Controller,
  useWatch,
  FieldErrors
} from 'react-hook-form';









import { ParsedCountry, PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { guestSchema, GuestSchemaType } from 'schema';
import DateTimeField from './DateTimeField';
import { AxiosError } from 'axios';
import AnimatedSelect from '@/components/ui/AnimatedSelect';
import { useHotelRoomTypes } from '@/hooks/useHotelRoomTypes';
import { useHotelRooms } from '@/hooks/useHotelRooms';

interface Props {
  guestId?: string;
  isEnabled?: boolean;
  isEditMode?: boolean;
  id?: string;
  mode: 'add' | 'edit' | 'view' | 'pending';
}
type GuestType = 'adult' | 'children' | 'infant';
type Gender = 'Male' | 'Female' | 'Others' | 'Prefer not to say';
type VerificationStatus = 'PENDING' | 'VALID' | 'FAILED';

export type GuestPayloadType = {
  guestType: 'adult' | 'children' | 'infant';
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  countryCode?: string;
  gender: 'Male' | 'Female' | 'Others' | 'Prefer not to say';
  idProof?: {
    url: string;
    type: 'PASSPORT' | 'AADHAAR' | 'DRIVING_LICENSE' | 'VOTER_ID';
    verification: { status: 'PENDING' | 'APPROVED' | 'REJECTED' };
  };
};

interface ServiceRequest {
  _id: string;
  __t: string;
  uniqueId: string;
}






interface Service {
  _id: string;
  amount: number;
  requestName?: string;
  serviceRequestId?: {
    _id: string;
    uniqueId: string;
    __t: string;
  } | null;
}

const getBorderColorClass = (status?: string) => {
  switch (status) {
    case 'VALID':
      return 'border-2 border-green-500';
    case 'FAILED':
      return 'border-2 border-red-500';
    case 'PENDING':
      return 'border-2 border-yellow-500';
    default:
      return 'border border-gray-300';
  }
};


const GuestForm: React.FC<Props> = ({ guestId, isEnabled, mode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [images, setImages] = useState<(string | null)[]>(Array(6).fill(null));
  const [showDropdown, setShowDropdown] = useState(false);
  const [status, setStatus] = useState<'PENDING' | 'APPROVE'>('PENDING');
  const [loading, setLoading] = useState(false);

  const { availableRooms, loading: roomsLoading } = useHotelRooms();
  const [isExistingGuest, setIsExistingGuest] = useState(false);
  const [isGuestDataFetched, setIsGuestDataFetched] = useState(false);
  const [isRejectFormVisible, setIsRejectFormVisible] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const lastFetchedPhoneRef = React.useRef<string | null>(null);
  const [fetchingByPhone, setFetchingByPhone] = useState(false);

  const [preCheckInRejectionMessage, setPreCheckInRejectionMessage] = useState<
    string | null
  >(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveRoomNumber, setApproveRoomNumber] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();
  const id = guestId;
  const [guest, setGuest] = useState<GuestDataType | null>(null);
  const [showAllowModal, setShowAllowModal] = useState(false);
  type GuestPayloadType = {
    guestType: 'adult' | 'children' | 'infant';
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    countryCode?: string;
    gender: 'male' | 'female' | 'others' | 'prefer not to say';
    idProof?: {
      url: string;
      type: string;
      verification: { status: string };
    };
  };

  const [secondaryGuests, setSecondaryGuests] = useState<GuestPayloadType[]>(
    []
  );

  const { roomTypes, loading: roomTypesLoading, error: roomTypesError } = useHotelRoomTypes(true);
  const uploadToS3 = async (file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) throw new Error('File size exceeds 5MB');
    if (!/(image\/.*|application\/pdf)/i.test(file.type))
      throw new Error('Only images or PDF allowed');
    const fd = new FormData();
    fd.append('file', file, file.name);
    const res = await apiCall('POST', 'api/upload/admin', fd);
    const url = res?.data?.url;
    if (!url) throw new Error('Upload failed');
    return url;
  };

  const isPdf = (u?: string) => !!u && u.toLowerCase().endsWith('.pdf');

  const handleGuestImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const url = await uploadToS3(file);
      setImages((prev) => {
        const next = [...prev];
        next[index] = url;
        return next;
      });
      ToastAtTopRight.fire('Image uploaded successfully', 'success');
    } catch (err: any) {
      ToastAtTopRight.fire(err?.message || 'Failed to upload image', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSecondaryIdProofUpload =
    (index: number) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        setLoading(true);
        const url = await uploadToS3(file);

        const currentGuests = addGuestForm.getValues('guests') || [];
        if (!currentGuests[index]) {
          const blank: GuestPayloadType = {
            guestType: 'adult',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            countryCode: '+91',
            gender: 'male'
          };
          while (currentGuests.length <= index) currentGuests.push(blank);
          addGuestForm.setValue('guests', currentGuests, { shouldDirty: true });
        }
        const currentGuest = addGuestForm.getValues(`guests.${index}`);
        if (!currentGuest?.idProof?.type) {
          addGuestForm.setValue(`guests.${index}.idProof`, {
            type: 'PASSPORT',
            url: url,
            verification: { status: 'PENDING' }
          }, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        } else {
          addGuestForm.setValue(`guests.${index}.idProof.url` as any, url, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
          });
        }

        ToastAtTopRight.fire('Document uploaded', 'success');
      } catch (err: any) {
        ToastAtTopRight.fire(err?.message || 'Upload failed', 'error');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const allowedPaymentStatuses = ['paid', 'unpaid'] as const;

    const isValidPaymentStatus = (
      status: any
    ): status is (typeof allowedPaymentStatuses)[number] =>
      allowedPaymentStatuses.includes(status);

    const allowedStatuses = [
      'Pending',
      'Confirmed',
      'Checked-In',
      'Checked-Out',
      'Cancelled'
    ] as const;

    const isValidStatus = (
      status: any
    ): status is (typeof allowedStatuses)[number] =>
      allowedStatuses.includes(status);

    const fetchGuestById = async () => {
      if (id && (mode === 'view' || mode === 'pending')) {
        try {
          setLoading(true);
          const res = await apiCall('GET', `/api/booking/hotel/${guestId}`);
          console.log('Fetched guest data:', res.booking);
          const guest = res.booking;
          console.log('aaabbcc', res.booking.paymentStatus);


          console.debug('[BOOKING_FETCH] bookingId:', guest?._id, 'roomStaysCount:', guest?.roomStays?.length || 0, 'roomStays:', guest?.roomStays);

          if (guest) {
            if (guest.preCheckInRejectionMessage) {
              setPreCheckInRejectionMessage(guest.preCheckInRejectionMessage);
              addGuestForm.setValue(
                'preCheckInRejectionMessage',
                guest.preCheckInRejectionMessage
              );
            }
            if (guest.specialRequests) {
              setRejectionMessage(guest.specialRequests);
              addGuestForm.setValue('specialRequests', guest.specialRequests);
            }
            setIsExistingGuest(true);
            const normalizedGuests = (guest.guests ?? [])
              .slice(1)
              .map((g: any) => ({
                firstName: g.firstName || '',
                lastName: g.lastName || '',
                phoneNumber: g.phoneNumber || '',
                countryCode: g.countryCode || '+91',
                gender: g.gender ?? '',
                guestType: g.guestType ?? 'adult',
                idProof: {
                  type: g.idProof?.type || '',
                  url: g.idProof?.url || '',
                  verification: {
                    status: g.idProof?.verification?.status || 'PENDING'
                  }
                }
              }));

            const nat = String(guest.phoneNumber || '')
              .replace(/\D/g, '')
              .slice(-10);
            const cc = guest.countryCode || '+91';
            const e164 = toE164(nat, cc);

            const { countryISO, stateISO, cityName } = normalizeLocation(
              guest.country,
              guest.state,
              guest.city
            );
            addGuestForm.reset({
              firstName: guest.firstName,
              lastName: guest.lastName,
              phoneE164: e164,
              phoneNumber: nat,
              countryCode: cc,
              email: guest.email,
              address: guest.address,
              country: countryISO,
              state: stateISO,
              city: cityName,
              pinCode: guest.pincode,
              sources: guest.sources,
              receivedAmt: guest.receivedAmt || 0,
              roomTariffDue: guest.roomTariffDue || 0,
              serviceDue: guest.serviceDue || 0,
              assignedRoomNumber: guest.assignedRoomNumber ?? null,
              adultGuestsCount: guest.adultGuestsCount,
              paymentMode: guest.paymentMode || '',
              gstIn: guest.gstIn || '',
              businessName: guest.businessName || '',
              roomCategory: guest.roomCategory || '',
              checkInDate: guest.checkInDate || null,
              checkOutDate: guest.checkOutDate || null,
              status: isValidStatus(guest.status) ? guest.status : 'Pending',
              guests: normalizedGuests,
              paymentStatus: guest.paymentStatus,
              childrenGuestsCount: guest.childrenGuestsCount,
              infantGuestsCount: guest.infantGuestsCount,
              roomTariff: guest.roomTariff,
              gst: guest.gst,
              specialRequests: guest.specialRequest || '',
              preCheckInRejectionMessage:
                guest.preCheckInRejectionMessage ?? '',
              wifi: {
                wifiName: guest?.wifi?.wifiName || '',
                password: guest?.wifi?.password || '',
                scanner: guest?.wifi?.scanner || ''
              },
              idProof: {
                type: guest?.idProof?.type || '',
                url: guest?.idProof?.url || '',
                verification: {
                  status: guest?.idProof?.verification?.status || 'PENDING',
                  message: guest?.idProof?.verification?.message ?? null,
                  timestamp: guest?.idProof?.verification?.timestamp ?? null,
                  requestId: guest?.idProof?.verification?.requestId ?? null
                }
              },

              paymentDetails: guest?.paymentDetails || {
                sellRate: 300,
                netRate: 0,
                paymentMade: 0,
                currency: 'INR',
                totalTaxes: 0,
                otaCommission: 0,
                tcs: 0,
                tds: 0,
                payAtHotel: false,
                billingName: guest?.paymentDetails?.billingName || '',
                billingEmail: guest?.paymentDetails?.billingEmail || '',
                billingMobile: guest?.paymentDetails?.billingMobile || '',
                companyName: guest?.paymentDetails?.companyName || '',
                gstNumber: guest?.paymentDetails?.gstNumber || '',
                corporateCode: guest?.paymentDetails?.corporateCode || '',
                invoiceRequired: guest?.paymentDetails?.invoiceRequired || false
              },

              promoInfo: guest?.promoInfo || {},
              ratePlanId: guest?.ratePlanId,
              roomTypeId: guest?.roomTypeId,
              roomTypeName: guest?.roomTypeName,
              payAtHotel: guest?.payAtHotel || false,
              roomStays: guest?.roomStays || []
            });

            console.debug('[BOOKING_RESET] roomStays set to form:', guest?.roomStays?.length || 0, 'items');

            if (guest.images) {
              setImages(guest.images);
            }

            if (guest.services) {
              setServices(guest.services);
              console.log('Fetched services:', guest.services);
            }
          }
        } catch (err) {
          console.error('Error fetching guest by ID:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGuestById();
  }, [id, mode]);

  const rejectRequest = async (message: string) => {
    try {
      const response = await apiCall(
        'PUT',
        `api/booking/reject-precheckin/${guestId}`,
        {
          rejectionMessage: message
        }
      );
      console.log('Response', response);

      if (response.status === 200 || response.success) {
        toast.success('Request rejected successfully');
        setShowRejectModal(false);
        setRejectionReason('');
        router.push('/hotel-panel/guest-management');
      } else {
        if (response.statusCode === 404) {
          toast.error('Pre-checkin request not found or already processed');
        } else {
          toast.error('Failed to reject request');
        }
      }
    } catch (error: any) {
      console.error('Reject error:', error);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const addGuestForm = useForm<GuestSchemaType>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneE164: '',
      countryCode: '+91',
      phoneNumber: '',
      email: '',
      businessName: '',
      gstIn: '',
      streetAddress: '',
      address: '',
      guests: [],
      landmark: '',
      country: 'IN',
      state: '',
      city: '',
      pinCode: '',
      gst: undefined,
      sources: 'Walk-In',
      adultGuestsCount: 1,
      childrenGuestsCount: 0,
      infantGuestsCount: 0,
      receivedAmt: 0,
      roomTariffDue: 0,
      serviceDue: 0,
      paymentMode: '',
      roomCategory: '',
      assignedRoomNumber: '',
      roomNumber: '',
      roomTariff: 0,
      checkInDate: null,
      checkOutDate: null,
      status: 'Pending',
      paymentStatus: 'paid',
      wifi: {
        wifiName: '',
        password: '',
        scanner: ''
      },
      preCheckInRejectionMessage: '',
      specialRequests: '',
      idProof: {
        type: '',
        url: '',
        verification: {
          status: 'PENDING',
          message: null,
          timestamp: null,
          requestId: null
        }
      },
      paymentDetails: {
        sellRate: 300,
        netRate: 0,
        paymentMade: 0,
        currency: 'INR',
        totalTaxes: 0,
        otaCommission: 0,
        tcs: 0,
        tds: 0,
        payAtHotel: false
      },
      promoInfo: {},

      ratePlanId: undefined,
      roomTypeId: undefined,
      roomTypeName: undefined,
      payAtHotel: false,
      roomStays: [],
      externalRatePlanId: '',
      externalRoomTypeId: '',
      externalRoomIds: []
    }
  });

  const {
    fields: extraChargeFields,
    append: appendExtraCharge,
    remove: removeExtraCharge
  } = useFieldArray({
    control: addGuestForm.control,
    name: 'extraCharges'
  });

  const {
    fields: roomStaysFields,
    append: appendRoomStay,
    remove: removeRoomStay
  } = useFieldArray({
    control: addGuestForm.control,
    name: 'roomStays'
  });

  const [idProofDetails, setIdProofDetails] = useState<{
    type: string;
    url: string;
    status: string;
  } | null>(null);


  const fetchAndPrefillByPhone = async (digits10: string): Promise<void> => {
    const onlyDigits = String(digits10 || '').replace(/\D/g, '');
    if (!/^\d{10}$/.test(onlyDigits)) return;

    if (lastFetchedPhoneRef.current === onlyDigits) return;

    try {
      setFetchingByPhone(true);
      console.log("[DEBUG] Fetching guest by phone:", onlyDigits);

      const response = await apiCall(
        'GET',
        `api/booking/fetch-guest/${onlyDigits}`
      );
      console.log("[DEBUG] Fetch Guest Response:", response);
      const guest = response?.guest;

      if (!guest) {

        setIsGuestDataFetched(false);
        lastFetchedPhoneRef.current = onlyDigits;
        return;
      }


      setIsGuestDataFetched(true);
      lastFetchedPhoneRef.current = onlyDigits;


      addGuestForm.setValue('firstName', guest.firstName || '', {
        shouldDirty: true
      });
      addGuestForm.setValue('lastName', guest.lastName || '', {
        shouldDirty: true
      });
      addGuestForm.setValue('email', guest.email || '', { shouldDirty: true });









      if (guest?.idProof?.url) {
        setIdProofDetails({
          type: guest.idProof?.type || '',
          url: guest.idProof?.url || '',
          status: guest.idProof?.verification?.status || 'PENDING'
        });

        setImages([guest.idProof.url, ...Array(5).fill(null)]);
      } else {
        setIdProofDetails(null);
        setImages(Array(6).fill(null));
      }
    } catch (err: unknown) {
      const error: any = err;

      if (error?.isAxiosError) {

        if (error.response?.status === 404) {

          setIsGuestDataFetched(false);
          return;
        }

        console.error('Error fetching guest by phone:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        ToastAtTopRight.fire(
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch guest by phone',
          'error'
        );
      } else {

        try {
          console.error(
            'Error fetching guest by phone:',
            JSON.stringify(error, Object.getOwnPropertyNames(error))
          );
        } catch {
          console.error(
            'Error fetching guest by phone (non-serializable):',
            error
          );
        }
        ToastAtTopRight.fire('Failed to fetch guest by phone', 'error');
      }

      setIsGuestDataFetched(false);
    } finally {
      setFetchingByPhone(false);
    }
  };

  const toUtcIso = (val: string | Date | null | undefined): string | null => {
    if (!val) return null;
    const date = typeof val === 'string' ? new Date(val) : val;
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  };

  const toDatetimeLocal = (dateStr: string | Date): string => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const fetchGuestById = async () => {
    if (id && mode === 'edit') {
      try {
        setLoading(true);
        const res = await apiCall('GET', `/api/booking/hotel/${id}`);
        const guest = res.booking;
        console.log(guest);
        const normalizedGuests = (guest.guests ?? [])
          .slice(1)
          .map((g: any) => ({
            firstName: g.firstName || '',
            lastName: g.lastName || '',
            phoneNumber: g.phoneNumber || '',
            countryCode: g.countryCode || '+91',
            gender: g.gender ?? '',
            guestType: g.guestType ?? 'adult',
            idProof: {
              type: g.idProof?.type || '',
              url: g.idProof?.url || '',
              verification: {
                status: g.idProof?.verification?.status || 'PENDING'
              }
            }
          }));

        const nat = String(guest.phoneNumber || '')
          .replace(/\D/g, '')
          .slice(-10);
        const cc = guest.countryCode || '+91';
        const e164 = toE164(nat, cc);

        if (guest) {

          addGuestForm.reset({
            firstName: guest.firstName || '',
            lastName: guest.lastName || '',

            phoneE164: e164,
            phoneNumber: nat,
            countryCode: cc,
            email: guest.email || '',
            address: guest.address || '',
            country: guest.country || 'IN',
            city: guest.city,
            state: guest.state || '',
            pinCode: guest.pincode || '',
            gst: guest.gst,
            gstIn: guest.gstIn || '',
            businessName: guest.businessName || '',
            guests: normalizedGuests,
            childrenGuestsCount: guest.childrenGuestsCount,
            roomTariff: guest.roomTariff,
            infantGuestsCount: guest.infantGuestsCount,
            assignedRoomNumber: guest.assignedRoomNumber || '',
            adultGuestsCount: guest.adultGuestsCount,

            sources: guest.sources ?? 'Walk-In',
            receivedAmt: guest.receivedAmt || 0,
            roomTariffDue: guest.roomTariffDue || 0,
            serviceDue: guest.serviceDue || 0,
            paymentMode: guest.paymentMode || '',
            roomCategory: guest.roomCategory || '',
            checkInDate: guest.checkInDate || null,
            checkOutDate: guest.checkOutDate || null,
            status: guest.status || 'Pending',
            paymentStatus: guest.paymentStatus || '',
            wifi: {
              wifiName: guest?.wifi?.wifiName || '',
              password: guest?.wifi?.password || '',
              scanner: guest?.wifi?.scanner || ''
            },
            idProof: {
              type: guest?.idProof?.type || '',
              url: guest?.idProof?.url || '',
              verification: {
                status: guest?.idProof?.verification?.status || 'PENDING',
                message: guest?.idProof?.verification?.message ?? null,
                timestamp: guest?.idProof?.verification?.timestamp ?? null,
                requestId: guest?.idProof?.verification?.requestId ?? null
              }
            },

            paymentDetails: guest?.paymentDetails || {
              sellRate: 300,
              netRate: 0,
              paymentMade: 0,
              currency: 'INR',
              totalTaxes: 0,
              otaCommission: 0,
              tcs: 0,
              tds: 0,
              payAtHotel: false,
              billingName: guest?.paymentDetails?.billingName || '',
              billingEmail: guest?.paymentDetails?.billingEmail || '',
              billingMobile: guest?.paymentDetails?.billingMobile || '',
              companyName: guest?.paymentDetails?.companyName || '',
              gstNumber: guest?.paymentDetails?.gstNumber || '',
              corporateCode: guest?.paymentDetails?.corporateCode || '',
              invoiceRequired: guest?.paymentDetails?.invoiceRequired || false
            },

            promoInfo: guest?.promoInfo || {},

            ratePlanId: guest?.ratePlanId,
            roomTypeId: guest?.roomTypeId,
            roomTypeName: guest?.roomTypeName,
            payAtHotel: guest?.payAtHotel || false,

            roomStays: guest?.roomStays || [],

            externalRatePlanId: guest?.externalRatePlanId || '',
            externalRoomTypeId: guest?.externalRoomTypeId || '',
            externalRoomIds: guest?.externalRoomIds || []
          });

          if (guest?.idProof?.url) {
            setImages([guest.idProof.url]);
          }

          if (guest.images) {
            setImages(guest.images);
          }
          if (guest?.idProof?.url) {
            setIdProofDetails({
              type: guest.idProof?.type || '',
              url: guest.idProof?.url || '',
              status: guest.idProof?.verification?.status || 'PENDING'
            });
            setImages([guest.idProof.url]);
          }


          if (guest.services) {
            setServices(guest.services);
            console.log('Services:', guest.services);
          }
        }
      } catch (err) {
        console.error('Failed to fetch guest:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data: GuestSchemaType) => {
    console.log("[DEBUG] onSubmit called with data:", data);

    console.log('[Validation] Checking roomTypeId:', data.roomTypeId);
    if (!data.roomTypeId || data.roomTypeId.trim() === '') {
      console.error('[Validation] roomTypeId is missing or empty');
      ToastAtTopRight.fire({
        icon: 'error',
        title: 'Room type is required',
        text: 'Please select a room type before creating the booking.'
      });
      return;
    }

    console.log('[Validation] Checking roomStays:', data.roomStays);
    if (data.roomStays && data.roomStays.length > 0) {
      const invalidRoomStay = data.roomStays.find(rs => !rs.roomTypeId || rs.roomTypeId.trim() === '');
      if (invalidRoomStay) {
        console.error('[Validation] Found room stay without roomTypeId:', invalidRoomStay);
        ToastAtTopRight.fire({
          icon: 'error',
          title: 'All room stays must have a room type selected'
        });
        return;
      }
    }
    console.log('[Validation] All checks passed');

    if (!data.checkInDate) {
      data.checkInDate = null;
    }
    if (!data.checkOutDate) {
      data.checkOutDate = null;
    }








    const guestsFromForm = (data.guests ?? []).map((g) => ({
      ...g,
      phoneNumber: g.phoneNumber
        ? String(g.phoneNumber).replace(/\D/g, '')
        : undefined,
      countryCode: g.countryCode || data.countryCode || ''
    }));
    const normalizedSource = isWalkIn(data.sources)
      ? 'Walk-In'
      : (data.sources ?? '').trim();

    const payload = {

      countryCode: data.countryCode || '',
      phoneNumber: data.phoneNumber
        ? String(data.phoneNumber).replace(/\D/g, '')
        : '',
      phoneE164: data.phoneE164 || undefined

    };


    const guests = data.guests ?? [];
    const addedSecondary = guests.length;


    if (addedSecondary === 0) {

    } else {

      const anyTouched = guests.some(isGuestRowFilled);


      if (!anyTouched) {
        ToastAtTopRight.fire({
          icon: 'error',
          title: `Please remove the empty secondary guest rows or fill all ${requiredSecondary}.`
        });
        return;
      }


      if (addedSecondary !== requiredSecondary) {
        ToastAtTopRight.fire({
          icon: 'error',
          title: `Please add exactly ${requiredSecondary} secondary guest${requiredSecondary === 1 ? '' : 's'}.`,
          text: `You have added ${addedSecondary}.`
        });
        return;
      }


      const firstIncomplete = guests.findIndex((g) => !isGuestRowComplete(g));
      if (firstIncomplete !== -1) {
        addGuestForm.setError(`guests.${firstIncomplete}.firstName` as any, {
          type: 'required',
          message: 'Please complete this secondary guest.'
        });
        ToastAtTopRight.fire({
          icon: 'error',
          title: 'Please complete all secondary guest details.'
        });
        return;
      }
    }








    {
      const totalGuestsPlanned =
        (data.adultGuestsCount ?? 0) +
        (data.childrenGuestsCount ?? 0) +
        (data.infantGuestsCount ?? 0);
      const requiredSecondary = Math.max(0, totalGuestsPlanned - 1);
      const addedSecondary = data.guests?.length ?? 0;

      const anySecondaryTouched = (data.guests ?? []).some((g) =>
        [
          g.firstName,
          g.lastName,
          g.gender,
          g.guestType,
          g.phoneNumber

        ].some((v) => (typeof v === 'string' ? v.trim() !== '' : !!v))
      );

      if (!anySecondaryTouched && addedSecondary === 0) {

      } else {

        if (addedSecondary !== requiredSecondary) {
          ToastAtTopRight.fire({
            icon: 'error',
            title: `Please add ${requiredSecondary} secondary guest${requiredSecondary === 1 ? '' : 's'}.`,
            text: `You have added ${addedSecondary}.`
          });
          return;
        }


        let invalidIndex = -1;
        for (let i = 0; i < addedSecondary; i++) {
          const g = data.guests![i];
          if (
            !g.firstName?.trim() ||
            !g.lastName?.trim() ||
            !g.gender ||
            !g.guestType
          ) {
            invalidIndex = i;
            break;
          }
        }
        if (invalidIndex !== -1) {
          addGuestForm.setError(`guests.${invalidIndex}.firstName` as any, {
            type: 'required',
            message: 'Please complete all fields for this guest.'
          });
          ToastAtTopRight.fire({
            icon: 'error',
            title: 'Please complete all secondary guest details.'
          });
          return;
        }
      }
    }




    try {

      const baseData = {
        firstName: data.firstName,
        lastName: data.lastName,

        email: data.email,
        address: data.address,
        state: data.state,
        city: data.city,


        sources: normalizedSource,
        country: data.country,
        adultGuestsCount: data.adultGuestsCount,
        childrenGuestsCount: data.childrenGuestsCount,
        infantGuestsCount: data.infantGuestsCount,
        assignedRoomNumber: data.assignedRoomNumber,
        pincode: data.pinCode,
        checkIn: toUtcIso(data.checkInDate),
        checkOut: toUtcIso(data.checkOutDate),
        gst: data.gst,
        businessName: data.businessName || undefined,
        gstIn: data.gstIn || undefined,
        status: data.status,
        guests: guestsFromForm,
        guestsCount: 1,
        preCheckIn: false,
        paymentStatus: data.paymentStatus,
        receivedAmt: data.receivedAmt || 0,

        serviceDue: data.serviceDue || 0,
        paymentMode: data.paymentMode || '',
        roomCategory: data.roomCategory || '',
        roomTariff: data.roomTariff || '',
        roomTariffDue: data.roomTariffDue,
        wifi: {
          wifiName: data?.wifi?.wifiName || '',
          password: data?.wifi?.password || '',
          scanner: data?.wifi?.scanner || ''
        },

        paymentDetails: data.paymentDetails || {
          sellRate: 300,
          netRate: 0,
          paymentMade: 0,
          currency: 'INR',
          totalTaxes: 0,
          otaCommission: 0,
          tcs: 0,
          tds: 0,
          payAtHotel: false
        },

        promoInfo: data.promoInfo || {},

        ratePlanId: data.ratePlanId,
        roomTypeId: data.roomTypeId,
        roomTypeName: data.roomTypeName,
        payAtHotel: data.payAtHotel || false,

        roomStays: data.roomStays || [],

        externalRatePlanId: data.externalRatePlanId,
        externalRoomTypeId: data.externalRoomTypeId,
        externalRoomIds: data.externalRoomIds
      };

      if (mode === 'edit' && id) {

        const payload = {
          updates: baseData
        };

        const res = await apiCall('PUT', `/api/booking/hotel/${id}`, payload);
        ToastAtTopRight.fire({
          icon: 'success',
          title: 'Guest booking saved!'
        });
        addGuestForm.setValue('sources', normalizedSource, {
          shouldDirty: false
        });
        setSourceMode(isWalkIn(normalizedSource) ? 'select' : 'input');
        setSelectValue(isWalkIn(normalizedSource) ? 'Walk-In' : 'others');

        fetchGuestById();
      } else {
        const guestsFromForm = (data.guests ?? []).map((g) => ({
          ...g,

          phoneNumber: g.phoneNumber
            ? String(g.phoneNumber).replace(/\D/g, '').slice(-10)
            : undefined,
          countryCode: g.countryCode || '+91',
          idProof: g.idProof?.type ? g.idProof : undefined
        }));
        const payload = {
          phoneNumber: data.phoneNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          address: data.address,
          country: data.country,
          state: data.state,
          city: data.city,
          businessName: data.businessName || undefined,
          gstIn: data.gstIn || undefined,

          sources: normalizedSource,
          pincode: data.pinCode,


          hotelId: (function () {
            try {
              const item = sessionStorage.getItem('admin');
              if (item) {
                const adminData = JSON.parse(item);

                const hotelId = adminData?.user?.HotelId || adminData?.HotelId || adminData?._id;
                console.log('[DEBUG] Hotel context (FULL):', {
                  'adminData.user.HotelId': adminData?.user?.HotelId,
                  'adminData.HotelId': adminData?.HotelId,
                  'adminData._id': adminData?._id,
                  'resolved': hotelId
                });
                return hotelId;
              }
            } catch (e) {
              console.error('[DEBUG] Failed to get hotelId from session:', e);
              return undefined;
            }
          })(),
          paymentStatus: data.paymentStatus,
          adultGuestsCount: data.adultGuestsCount,
          childrenGuestsCount: data.childrenGuestsCount,
          infantGuestsCount: data.infantGuestsCount,

          checkIn: toUtcIso(data.checkInDate),
          checkOut: toUtcIso(data.checkOutDate),
          assignedRoomNumber: data.assignedRoomNumber,
          roomTariffDue: data.roomTariffDue,
          serviceDue: data.serviceDue,
          receivedAmt: data.receivedAmt,
          paymentMode: data.paymentMode,
          wifi: data.wifi,
          gst: data.gst,
          status: data.status,
          roomTariff: data.roomTariff,
          roomCategory: data.roomCategory,

          paymentDetails: data.paymentDetails || {
            sellRate: 300,
            netRate: 0,
            paymentMade: 0,
            currency: 'INR',
            totalTaxes: 0,
            otaCommission: 0,
            tcs: 0,
            tds: 0,
            payAtHotel: false,
            billingName: '',
            billingEmail: '',
            billingMobile: '',
            companyName: '',
            gstNumber: '',
            corporateCode: '',
            invoiceRequired: false
          },

          promoInfo: data.promoInfo || {},


          roomTypeId: data.roomTypeId,
          roomTypeName: data.roomTypeName,
          payAtHotel: data.payAtHotel || false,


          roomStays: data.roomStays || [],

          countryCode: data.countryCode || '+91',
          idProof: data.idProof?.type ? data.idProof : undefined,
          guests: guestsFromForm,

          externalRatePlanId: data.externalRatePlanId,
          externalRoomTypeId: data.externalRoomTypeId,
          externalRoomIds: data.externalRoomIds
        };

        console.log('Submit data', data);
        console.log('[DEBUG] Sending AddBooking Payload:', JSON.stringify(payload, null, 2));


        if (!payload.hotelId) {
          console.error('[CRITICAL] hotelId is missing - booking blocked');
          ToastAtTopRight.fire({
            icon: 'error',
            title: 'Hotel context not loaded',
            text: 'Please refresh the page and try again.'
          });
          return;
        }


        const res = await apiCall('POST', '/api/booking/external/addBooking', payload);
        console.log('[DEBUG] AddBooking Response:', res);

        ToastAtTopRight.fire({
          icon: 'success',
          title: 'Guest booking saved!'
        });
      }

      addGuestForm.reset();
      router.push('/hotel-panel/guest-management');
    } catch (err) {
      console.error('Booking Save/Update Failed:', err);
      const { title, fieldErrors } = parseApiError(err);


      ToastAtTopRight.fire({ icon: 'error', title });


      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([path, msg]) => {

          addGuestForm.setError(path as any, {
            type: 'server',
            message: String(msg || 'Invalid')
          });
        });
      }
    }
  };
  const isGuestRowFilled = (g: any) =>
    [
      g?.firstName,
      g?.lastName,
      g?.gender,
      g?.guestType,
      g?.phoneNumber

    ].some((v) => (typeof v === 'string' ? v.trim() !== '' : !!v));

  const isGuestRowComplete = (g: any) =>
    !!(
      g?.firstName?.trim() &&
      g?.lastName?.trim() &&
      g?.gender &&
      g?.guestType
    );
  const receivedWatch = useWatch({
    control: addGuestForm.control,
    name: 'receivedAmt'
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = reader.result as string;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);

  const approveRequest = async (roomNumber: string) => {
    if (!roomNumber || roomNumber.trim() === '') {
      toast.error('Invalid room number');
      return;
    }

    try {
      const response = await apiCall(
        'PUT',
        `/api/booking/approve-precheckin/${guestId}`,
        { assignedRoomNumber: roomNumber }
      );
      console.log('yyyyyy', response);
      if (response.status === 200 || response.success) {
        toast.success('Request approved successfully');

        addGuestForm.setValue('assignedRoomNumber', roomNumber);

        setShowApproveModal(false);
        setApproveRoomNumber('');
        router.push('/hotel-panel/guest-management');
      } else {
        toast.error(response.message || 'Failed to approve request');
      }
    } catch (error: any) {
      console.error('Approve error:', error);
      toast.error(
        error?.response?.data?.message || 'An unexpected error occurred'
      );
    }
  };

  useEffect(() => {
    const fetchDefaultCheckInOut = async () => {
      try {
        const res = await apiCall('GET', '/api/hotel/check-In-Out-Time');

        if (res.success) {
          const { checkInTime, checkOutTime } = res;

          const convertToDateTimeLocal = (baseDate: Date, timeStr: string) => {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);

            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;

            const result = new Date(baseDate);
            result.setHours(hours);
            result.setMinutes(minutes);
            result.setSeconds(0);
            result.setMilliseconds(0);
            return result.toISOString();
          };

          const today = new Date();

          const checkInBase = new Date(today);
          checkInBase.setDate(today.getDate() + 1);

          const checkOutBase = new Date(today);
          checkOutBase.setDate(today.getDate() + 2);

          const checkInISO = convertToDateTimeLocal(checkInBase, checkInTime);
          const checkOutISO = convertToDateTimeLocal(
            checkOutBase,
            checkOutTime
          );

          if (!addGuestForm.getValues('checkInDate')) {
            addGuestForm.setValue('checkInDate', checkInISO);
          }
          if (!addGuestForm.getValues('checkOutDate')) {
            addGuestForm.setValue('checkOutDate', checkOutISO);
          }
        }
      } catch (err: any) {
        console.error(
          'Failed to fetch default check-in/check-out times:',
          err.message || err
        );
      }
    };

    if (mode === 'add') {
      fetchDefaultCheckInOut();
    }
  }, [mode]);
  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      fetchGuestById();
    }
  }, [id, mode]);

  const allowPreCheckIn = async () => {
    try {
      const response = await apiCall(
        'PUT',
        `/api/booking/allow-precheckin/${guestId}`
      );

      if (response.status === 200 || response.success) {
        toast.success('Pre-checkin allowed successfully!');
        setShowAllowModal(false);
        router.push('/hotel-panel/guest-management');
      } else {
        toast.error(response.message || 'Failed to allow pre-checkin');
      }
    } catch (error: any) {
      console.error('Allow Pre-checkin error:', error);
      toast.error(
        error?.response?.data?.message || 'An unexpected error occurred'
      );
    }
  };

  const { watch, setValue } = addGuestForm;

  const adults = Number(watch('adultGuestsCount') ?? 0);
  const children = Number(watch('childrenGuestsCount') ?? 0);
  const infants = Number(addGuestForm.watch('infantGuestsCount') ?? 0);




  const requiredSecondary = Math.max(0, adults + children + infants - 1);


  const { fields, append, remove, replace } = useFieldArray({
    control: addGuestForm.control,
    name: 'guests'
  });

  const blankGuest: GuestPayloadType = {
    guestType: 'adult',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    countryCode: '+91',
    gender: 'male',

  };

  const selectAllOnFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    e.currentTarget.select();


  const ensureGuestCount = (count: number) => {
    const current = addGuestForm.getValues('guests')?.length ?? 0;
    if (count <= 0) {
      replace([]);
      return;
    }
    if (current < count) {
      for (let i = current; i < count; i++) append({ ...blankGuest });
    } else if (current > count) {
      for (let i = current - 1; i >= count; i--) remove(i);
    }
  };

  const countryISO2 = watch('country') || 'IN';
  const stateISO2 = watch('state');


  const countries: ICountry[] = Country.getAllCountries();


  const states: IState[] = countryISO2
    ? State.getStatesOfCountry(countryISO2)
    : [];


  const cities: ICity[] =
    countryISO2 && stateISO2
      ? City.getCitiesOfState(countryISO2, stateISO2)
      : [];











  const [showGuestForm, setShowGuestForm] = useState(false);
  const [wifiUploading, setWifiUploading] = useState(false);


  const maxExtraGuests = requiredSecondary;
  const currentExtraGuests = fields.length;
  const remainingGuests = Math.max(0, maxExtraGuests - currentExtraGuests);
  const canAddMoreGuests = remainingGuests > 0;

  const handleAddGuestClick = () => {
    if (!canAddMoreGuests) {
      const msg =
        maxExtraGuests <= 0
          ? 'No additional guests are allowed for this booking.'
          : `Only ${maxExtraGuests} ${maxExtraGuests === 1 ? 'guest is' : 'guests are'} allowed`;


      ToastAtTopRight.fire({
        icon: 'warning',
        title: msg
      });
      return;
    }

    append({ ...blankGuest });
  };

  const toNum = (v: unknown) => {
    if (v === null || v === undefined) return 0;
    const s = String(v).replace(/[^0-9.]/g, '');
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };


  const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;


  const assignedRoomNumber = addGuestForm.watch('assignedRoomNumber');

  const mustKeep =
    typeof assignedRoomNumber === 'string' &&
    assignedRoomNumber.trim().length > 0 &&
    fields.length <= requiredSecondary;

  const tariffWatch = useWatch({
    control: addGuestForm.control,
    name: 'roomTariff'
  });
  const dueWatch = useWatch({
    control: addGuestForm.control,
    name: 'roomTariffDue'
  });
  const extraChargesWatch = useWatch({
    control: addGuestForm.control,
    name: 'extraCharges'
  });
  const serviceDueWatch = useWatch({
    control: addGuestForm.control,
    name: 'serviceDue'
  });
  const discountTypeWatch = useWatch({
    control: addGuestForm.control,
    name: 'discountType'
  });
  const discountAmountWatch = useWatch({
    control: addGuestForm.control,
    name: 'discountAmount'
  });
  const lateCheckoutWatch = useWatch({
    control: addGuestForm.control,
    name: 'lateCheckout'
  });



































  useEffect(() => {
    const t =
      typeof tariffWatch === 'number' ? tariffWatch : toNum(tariffWatch);
    const r =
      typeof receivedWatch === 'number' ? receivedWatch : toNum(receivedWatch);

    if (r > t) {








    }

    addGuestForm.clearErrors('receivedAmt');


    const discountType = addGuestForm.getValues('discountType');
    const discountAmount = toNum(addGuestForm.getValues('discountAmount'));
    const extraCharges = addGuestForm.getValues('extraCharges') || [];
    const lateCheckoutAmount = toNum(
      addGuestForm.getValues('lateCheckout.amount')
    );
    const serviceDue = toNum(addGuestForm.getValues('serviceDue'));

    let totalVal = t;


    let discountVal = 0;
    if (discountType === 'percentage') {
      discountVal = (t * discountAmount) / 100;
    } else {
      discountVal = discountAmount;
    }
    totalVal -= discountVal;


    const extraChargesTotal = extraCharges.reduce(
      (acc, curr) => acc + toNum(curr.amount),
      0
    );
    totalVal += extraChargesTotal;


    totalVal += lateCheckoutAmount;


    totalVal += serviceDue;

    const due = round2(Math.max(0, totalVal - r));

    addGuestForm.setValue('roomTariffDue', due, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [
    tariffWatch,
    receivedWatch,
    addGuestForm.watch('discountType'),
    addGuestForm.watch('discountAmount'),
    addGuestForm.watch('extraCharges'),
    addGuestForm.watch('lateCheckout.amount'),
    addGuestForm.watch('serviceDue')
  ]);


  useEffect(() => {
    if (assignedRoomNumber) {

      const room = availableRooms.find((r) => r.roomNumber === assignedRoomNumber);
      if (room) {

        addGuestForm.setValue('roomCategory', room.roomTypeName);
        addGuestForm.setValue('roomTariff', room.baseRate || 0);

        ToastAtTopRight.fire({
          icon: 'success',
          title: `Room ${room.roomNumber} (${room.roomTypeName}) selected`,
          timer: 1500
        });
      }
    }
  }, [assignedRoomNumber, availableRooms]);

  const isWalkIn = (v?: string | null) => {
    const s = (v ?? '').trim().toLowerCase();
    return s === 'walk-in' || s === 'walkin' || s === 'walk in';
  };


  const [sourceMode, setSourceMode] = useState<'select' | 'input'>('select');
  const [selectValue, setSelectValue] = useState<'Walk-In' | 'others'>(
    'Walk-In'
  );


  const sourceValue = useWatch({
    control: addGuestForm.control,
    name: 'sources'
  });



  useEffect(() => {
    if (isWalkIn(sourceValue) || !sourceValue) {
      setSourceMode('select');
      setSelectValue('Walk-In');
    } else {
      setSourceMode('input');
      setSelectValue('others');
    }
  }, [sourceValue]);
  const toE164 = (phoneNumber?: string, countryCode?: string) => {
    const nat = String(phoneNumber || '')
      .replace(/\D/g, '')
      .slice(-10);
    const cc = String(countryCode || '+91').replace(/^\+/, '');
    return nat ? `+${cc}${nat}` : '';
  };
  function normalizeLocation(
    countryVal?: string,
    stateVal?: string,
    cityVal?: string
  ) {

    const countries = Country.getAllCountries();
    const country =
      countries.find((c) => c.isoCode === countryVal) ||
      countries.find(
        (c) => c.name.toLowerCase() === String(countryVal || '').toLowerCase()
      );

    const countryISO = country?.isoCode || 'IN';


    const states = State.getStatesOfCountry(countryISO);
    const state =
      states.find((s) => s.isoCode === stateVal) ||
      states.find(
        (s) => s.name.toLowerCase() === String(stateVal || '').toLowerCase()
      );

    const stateISO = state?.isoCode || '';


    const cities = stateISO ? City.getCitiesOfState(countryISO, stateISO) : [];
    const city =
      cities.find(
        (ci) => ci.name.toLowerCase() === String(cityVal || '').toLowerCase()
      )?.name || '';

    return { countryISO, stateISO, cityName: city };
  }
  useEffect(() => {
    const c = addGuestForm.getValues('country') || 'IN';
    const s = addGuestForm.getValues('state') || '';
    const currentCity = addGuestForm.getValues('city') || '';
    if (!c || !s) return;

    const list = City.getCitiesOfState(c, s).map((ci) => ci.name);
    if (currentCity && !list.includes(currentCity)) {
      addGuestForm.setValue('city', '');
    }
  }, [countryISO2, stateISO2]);


  const onInvalid = (errors: FieldErrors<GuestSchemaType>) => {

    console.warn('[FORM VALIDATION] Validation errors:', errors);
    Object.entries(errors).forEach(([key, val]) => {
      console.warn('[FORM VALIDATION] Field failed:', key, '→', val?.message || val);
    });


    const firstKey = Object.keys(errors)[0];
    const firstError = firstKey ? errors[firstKey as keyof typeof errors] : null;
    const errorMessage = firstError?.message
      ? `Please fix: ${firstError.message}`
      : firstKey
        ? `Please fill required field: ${firstKey}`
        : 'Please fill the required field';

    ToastAtTopRight.fire({
      icon: 'error',
      title: errorMessage
    });

    if (firstKey) {


      addGuestForm.setFocus(firstKey as any);
    }
  };

  type FieldErrs = Record<string, string>;

  function parseApiError(err: unknown): {
    title: string;
    fieldErrors?: FieldErrs;
  } {
    const fallback = { title: 'Failed to save booking' };
    const ax = err as AxiosError<any>;
    const data = ax?.response?.data;


    const title =
      data?.message || data?.error?.message || ax?.message || fallback.title;


    const fieldErrors: FieldErrs | undefined =
      typeof data?.errors === 'object'
        ? data.errors
        : typeof data?.fieldErrors === 'object'
          ? data.fieldErrors
          : undefined;

    return { title, fieldErrors };
  }

  return (
    <>
      <FormWrapper title="">
        <div className="flex items-center justify-between w-full mb-4">
          <h2 className="text-3xl text-gray-700 font-semibold whitespace-nowrap">
            {mode === 'view' ? 'Edit Guest Details' : 'Guest Details'}
          </h2>
          <div className="w-full flex flex-col gap-6">
            {mode === 'pending' && (
              <div className="flex justify-end w-full mb-4 gap-4">
                <Button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                >
                  Reject
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowApproveModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAllowModal(true)}
                  className="bg-[rgb(160,125,61)] text-white px-6 py-3 rounded-lg text-lg hover:opacity-90 focus:ring-2 focus:ring-[rgb(160,125,61)]"
                >
                  Allow
                </Button>
              </div>
            )}

            { }
            {mode === 'pending' && showRejectModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-lg font-semibold mb-4">
                    Reason for Rejection
                  </h2>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    placeholder="Enter reason..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-coffee resize-none"
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    { }
                    <Button
                      onClick={() => {
                        setShowRejectModal(false);
                        setRejectionReason('');
                      }}
                      className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </Button>
                    { }
                    <Button
                      onClick={() => {
                        rejectRequest(rejectionReason);
                      }}
                      disabled={!rejectionReason.trim()}
                      className="px-4 py-2 rounded text-white bg-[rgb(160,125,61)] hover:opacity-90 disabled:opacity-50"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {mode === 'pending' && showApproveModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-lg font-semibold mb-4">
                    Assign Room Number
                  </h2>
                  <Input
                    value={approveRoomNumber}
                    onChange={(e) => setApproveRoomNumber(e.target.value)}
                    placeholder="Enter room number"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-coffee"
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      onClick={() => {
                        setShowApproveModal(false);
                        setApproveRoomNumber('');
                      }}
                      className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        await approveRequest(approveRoomNumber);
                      }}
                      disabled={!approveRoomNumber.trim()}
                      className="px-4 py-2 rounded text-white bg-[rgb(160,125,61)] hover:opacity-90 disabled:opacity-50"
                    >
                      Save & Approve
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {mode === 'pending' && showAllowModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Confirm Allow Pre-checkin
                  </h2>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to allow pre-checkin for this guest?
                  </p>
                  <div className="mt-6 flex justify-end gap-2">
                    <Button
                      onClick={() => setShowAllowModal(false)}
                      className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={allowPreCheckIn}
                      className="px-4 py-2 rounded text-white bg-[rgb(160,125,61)] hover:opacity-90"
                    >
                      Yes, Allow
                    </Button>
                  </div>
                </div>
              </div>
            )}

            { }
          </div>
        </div>
        <Form {...addGuestForm}>
          { }
          <form
            onSubmit={addGuestForm.handleSubmit(onSubmit, onInvalid)}
            className="space-y-6"
          >
            <div className="flex flex-col gap-4">
              { }
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <FormField
                  control={addGuestForm.control}
                  name="phoneE164"
                  rules={{ required: true }}
                  render={({ field }) => {
                    const [debounceTimer, setDebounceTimer] = useState<
                      number | null
                    >(null);

                    const handleChange = (
                      phone: string,
                      meta: { country: ParsedCountry; inputValue: string }
                    ) => {

                      field.onChange(phone);


                      const dial = (meta?.country?.dialCode ?? '').replace(
                        /\D/g,
                        ''
                      );
                      const national = phone
                        .replace(/^\+/, '')
                        .replace(new RegExp(`^${dial}`), '')
                        .replace(/\D/g, '');


                      addGuestForm.setValue('phoneNumber', national, {
                        shouldDirty: true
                      });


                      if (debounceTimer) window.clearTimeout(debounceTimer);
                      const t = window.setTimeout(() => {
                        if (national.length === 10)
                          fetchAndPrefillByPhone(national);
                      }, 400);
                      setDebounceTimer(t);
                    };

                    const handleBlur = () => {
                      const national = String(
                        addGuestForm.getValues('phoneNumber') || ''
                      )
                        .replace(/\D/g, '')
                        .slice(-10);
                      if (national.length === 10)
                        fetchAndPrefillByPhone(national);
                    };

                    return (
                      <FormItem className="w-full">
                        <FormLabel className="text-black text-sm after:content-['*'] after:ml-1 after:text-red-600">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-2 items-center">
                            <PhoneInput
                              defaultCountry="in"
                              value={field.value || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={!isEnabled || mode === 'view'}
                              required
                              aria-required="true"
                              inputClassName="bg-[#F6EEE0] text-gray-700 p-2 rounded-md text-sm border border-gray-300 w-full"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={addGuestForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black text-sm">
                        First Name <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="First Name"
                          disabled={isGuestDataFetched || !isEnabled}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addGuestForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black text-sm">
                        Last Name <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Last Name"
                          disabled={isGuestDataFetched || !isEnabled}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              { }
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <FormField
                  control={addGuestForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black text-[0.8rem]">
                        Email ID <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isGuestDataFetched || !isEnabled}
                          type="email"
                          placeholder="Email ID"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addGuestForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black text-[0.8rem]">
                        Street Address <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!isEnabled}
                          type="text"
                          placeholder="Street Address"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addGuestForm.control}
                  name="landmark"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black text-[0.8rem]">
                        Landmark
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!isEnabled}
                          type="text"
                          placeholder="Landmark"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              { }
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                { }
                <FormField
                  control={addGuestForm.control}
                  name="country"
                  render={({ field }) => {
                    const countries = Country.getAllCountries();

                    React.useEffect(() => {
                      if (!field.value) {
                        const india = countries.find((c) => c.isoCode === 'IN');
                        if (india) {
                          addGuestForm.setValue('country', india.isoCode, {
                            shouldValidate: true
                          });
                          addGuestForm.setValue('state', '');
                          addGuestForm.setValue('city', '');
                        }
                      }

                    }, []);

                    const selectedCountryCode =
                      addGuestForm.watch('country') || 'IN';

                    return (
                      <FormItem className="w-full">
                        <FormLabel className="text-black text-[0.8rem]">
                          Country <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={selectedCountryCode}
                            onValueChange={(val) => {
                              field.onChange(val);
                              addGuestForm.setValue('state', '');
                              addGuestForm.setValue('city', '');
                            }}
                            disabled={!isEnabled}
                          >
                            <SelectTrigger className="relative bg-[#F6EEE0] text-gray-700 p-2 rounded-md border border-gray-300 text-xs 2xl:text-sm">
                              <SelectValue placeholder="Select Country" />
                              <ChevronDown
                                size={14}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                              />
                            </SelectTrigger>
                            <SelectContent className="max-h-64">
                              {countries.map((c) => (
                                <SelectItem key={c.isoCode} value={c.isoCode}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                { }
                <FormField
                  control={addGuestForm.control}
                  name="state"
                  render={({ field }) => {
                    const countryCode = addGuestForm.watch('country') || 'IN';
                    const states = countryCode
                      ? State.getStatesOfCountry(countryCode)
                      : [];

                    return (
                      <FormItem className="w-full">
                        <FormLabel className="text-black text-[0.8rem]">
                          State <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value || ''}
                            onValueChange={(val) => {
                              field.onChange(val);
                              addGuestForm.setValue('city', '');
                            }}
                            disabled={!isEnabled || !countryCode}
                          >
                            <SelectTrigger className="relative bg-[#F6EEE0] text-gray-700 p-2 rounded-md border border-gray-300 text-xs 2xl:text-sm">
                              <SelectValue placeholder="Select State" />
                              <ChevronDown
                                size={14}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                              />
                            </SelectTrigger>
                            <SelectContent className="max-h-64">
                              {states.length === 0 ? (
                                <div className="p-2 text-xs text-gray-500">
                                  No states found
                                </div>
                              ) : (
                                states.map((s) => (
                                  <SelectItem key={s.isoCode} value={s.isoCode}>
                                    {s.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                { }
                { }
                <FormField
                  control={addGuestForm.control}
                  name="city"
                  render={({ field }) => {
                    const countryCode = addGuestForm.watch('country') || 'IN';
                    const stateCode = addGuestForm.watch('state') || '';
                    const cities =
                      countryCode && stateCode
                        ? City.getCitiesOfState(countryCode, stateCode)
                        : [];

                    return (
                      <FormItem className="w-full">
                        <FormLabel className="text-black text-[0.8rem]">
                          City <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            key={`${countryCode}-${stateCode}`}
                            value={field.value || ''}
                            onValueChange={field.onChange}
                            disabled={!isEnabled || !countryCode || !stateCode}
                          >
                            <SelectTrigger className="relative bg-[#F6EEE0] text-gray-700 p-2 rounded-md border border-gray-300 text-xs 2xl:text-sm">
                              <SelectValue placeholder="Select City" />
                              <ChevronDown
                                size={14}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                              />
                            </SelectTrigger>
                            <SelectContent className="max-h-64">
                              {cities.length === 0 ? (
                                <div className="p-2 text-xs text-gray-500">
                                  No cities found
                                </div>
                              ) : (
                                cities.map((city) => (
                                  <SelectItem key={city.name} value={city.name}>
                                    {city.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              { }
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <FormField
                  control={addGuestForm.control}
                  name="pinCode"
                  render={({ field }) => (
                    <FormItem className="w_full">
                      <FormLabel className="text-black text-[0.8rem]">
                        Pin Code <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!isEnabled}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          placeholder="Pin Code"
                          {...field}
                          onInput={(e) => {
                            const value = e.currentTarget.value.replace(
                              /\D/g,
                              ''
                            );
                            if (value.length <= 6) field.onChange(value);
                          }}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                { }
                <FormField
                  control={addGuestForm.control}
                  name="sources"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black text-[0.8rem]">
                        Source
                      </FormLabel>
                      <FormControl>
                        {sourceMode === 'select' ? (
                          <Select
                            value={selectValue}
                            onValueChange={(val) => {
                              if (val === 'Walk-In') {
                                setSelectValue('Walk-In');
                                field.onChange('Walk-In');
                                setSourceMode('select');
                              } else {

                                setSelectValue('others');
                                setSourceMode('input');

                              }
                            }}
                            disabled={!isEnabled}
                          >
                            <SelectTrigger className="relative bg-[#F6EEE0] text-gray-700 p-2 rounded-md border border-gray-300 text-xs 2xl:text-sm">
                              <SelectValue placeholder="Select Source" />
                              <ChevronDown
                                size={14}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                              />
                            </SelectTrigger>
                            <SelectContent className="max-h-64">
                              <SelectItem value="Walk-In">Walk-In</SelectItem>
                              <SelectItem value="others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex gap-2 items-center">
                            <Input
                              disabled={!isEnabled}
                              type="text"
                              placeholder="Type source (e.g., Website, OTA, Referral)"
                              value={
                                field.value === 'Walk-In'
                                  ? ''
                                  : field.value || ''
                              }
                              onChange={(e) => field.onChange(e.target.value)}
                              className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={!isEnabled}
                              onClick={() => {

                                field.onChange('Walk-In');
                                setSelectValue('Walk-In');
                                setSourceMode('select');
                              }}
                              className="h-7 px-2 text-xs text-black bg-[#F6EEE0]"
                            >
                              Back
                            </Button>
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addGuestForm.control}
                  name="adultGuestsCount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black text-[0.8rem]">
                        Total No. of Adults{' '}
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={!isEnabled}
                          min={1}
                          step={1}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === '' ? '' : parseInt(value, 10)
                            );
                          }}
                          placeholder=""
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              { }
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <FormField
                  control={addGuestForm.control}
                  name="childrenGuestsCount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black text-[0.8rem]">
                        Total No. of Children{' '}
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          disabled={!isEnabled}
                          step={1}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === '' ? '' : parseInt(value, 10)
                            );
                          }}
                          placeholder=""
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addGuestForm.control}
                  name="infantGuestsCount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black text-[0.8rem]">
                        Total No. of Infants{' '}
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          disabled={!isEnabled}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === '' ? '' : parseInt(value, 10)
                            );
                          }}
                          placeholder=""
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addGuestForm.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black text-sm">
                        Business/Firm Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Business or Firm Name"
                          disabled={!isEnabled}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md text-sm border border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                { }
                <FormField
                  control={addGuestForm.control}
                  name="gstIn"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black text-sm">
                        GSTIN
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          maxLength={15}
                          placeholder="GSTIN Number"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          disabled={!isEnabled}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md text-sm border border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              { }
              <div className="flex flex-col gap-4 2xl:gap-5 bg-[#FAF6EF] shadow-custom p-6 2xl:p-8 rounded-lg mt-4">
                <h2 className="text-base 2xl:text-lg font-semibold text-gray-800">
                  Stay Details & Billing
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full">

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    { }
                    <FormField
                      control={addGuestForm.control}
                      name="checkInDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black text-[0.8rem]">
                            Check-in Date&Time{' '}
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <DateTimeField
                              value={field.value}
                              disabled={!isEnabled}
                              onChange={(iso) => field.onChange(iso)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    { }
                    <FormField
                      control={addGuestForm.control}
                      name="checkOutDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black text-[0.8rem]">
                            Check-out Date&Time{' '}
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <DateTimeField
                              value={field.value}
                              disabled={!isEnabled}
                              onChange={(iso) => field.onChange(iso)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    { }
                    <div className="flex flex-col gap-4">
                      <FormField
                        control={addGuestForm.control}
                        name="roomCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black text-[0.8rem]">
                              Room Category{' '}
                              <span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Enter Room Category"
                                disabled={!isEnabled}
                                className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md text-sm  focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    { }
                    <FormField
                      control={addGuestForm.control}
                      name="assignedRoomNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black text-[0.8rem]">
                            Assign Room Number
                          </FormLabel>
                          <FormControl>
                            <AnimatedSelect
                              label=""
                              name="assignedRoomNumber"
                              options={availableRooms.map((room) => `${room.roomNumber} (${room.roomTypeName})`)}
                              value={
                                field.value
                                  ? (() => {
                                    const room = availableRooms.find(r => r.roomNumber === field.value);
                                    return room ? `${room.roomNumber} (${room.roomTypeName})` : field.value;
                                  })()
                                  : ''
                              }
                              onChange={(e) => {

                                const selectedLabel = e.target.value;
                                const roomNumMatch = selectedLabel.match(/^([^(]+)/);
                                const roomNum = roomNumMatch ? roomNumMatch[1].trim() : selectedLabel;
                                field.onChange(roomNum);
                              }}
                              searchable={true}
                              dropdownPosition="auto"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-1">
                      <FormLabel className="text-black text-[0.8rem]">
                        Discount
                      </FormLabel>
                      <div className="flex gap-2">
                        <FormField
                          control={addGuestForm.control}
                          name="discountType"
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!isEnabled}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-[#F6EEE0] w-[110px] text-xs">
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">%</SelectItem>
                                <SelectItem value="flat">Flat</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FormField
                          control={addGuestForm.control}
                          name="discountAmount"
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Amt"
                                disabled={!isEnabled}
                                className="bg-[#F6EEE0] text-xs p-2 rounded-md"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(toNum(e.target.value))
                                }
                              />
                            </FormControl>
                          )}
                        />
                      </div>
                    </div>

                    { }
                    { }

                    <FormField
                      control={addGuestForm.control}
                      name="roomTariff"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black text-[0.8rem]">
                            Room Tariff (Including GST){' '}
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              inputMode="decimal"
                              placeholder="Room Tariff"
                              disabled={!isEnabled}
                              value={
                                field.value === undefined
                                  ? ''
                                  : String(field.value)
                              }
                              onChange={(e) =>
                                field.onChange(toNum(e.target.value))
                              }
                              className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    { }
                    <FormField
                      control={addGuestForm.control}
                      name="gst"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black text-[0.8rem]">
                            GST %{ }
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              disabled={!isEnabled}
                              placeholder="percent type (e.g., 0, 5, 12, 18)"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(toNum(e.target.value))}
                              className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    { }

                    { }
                    { }
                    { }
                    <FormField
                      control={addGuestForm.control}
                      name="roomTariffDue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black text-[0.8rem]">
                            Room Tariff Due
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              inputMode="decimal"
                              placeholder="0"
                              disabled={!isEnabled}
                              readOnly
                              value={
                                field.value === undefined
                                  ? ''
                                  : String(field.value)
                              }
                              className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    { }

                    { }
                    <FormField
                      control={addGuestForm.control}
                      name="receivedAmt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black text-[0.8rem]">
                            Received Amount
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              inputMode="decimal"
                              placeholder="0"
                              disabled={!isEnabled}
                              value={
                                field.value === undefined
                                  ? ''
                                  : String(field.value)
                              }
                              onChange={(e) =>
                                field.onChange(toNum(e.target.value))
                              }
                              className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    { }
                    <FormField
                      className="w-full"
                      control={addGuestForm.control}
                      name="serviceDue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black text-[0.8rem]">
                            Service Due
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              inputMode="decimal"
                              placeholder="0"
                              disabled={!isEnabled}
                              value={
                                field.value === undefined
                                  ? ''
                                  : String(field.value)
                              }
                              onChange={(e) =>
                                field.onChange(toNum(e.target.value))
                              }
                              className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    { }
                    <FormField
                      className="w-full"
                      control={addGuestForm.control}
                      name="paymentMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black text-[0.8rem]">
                            Payment Mode
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!isEnabled}
                            >
                              <SelectTrigger className="relative bg-[#F6EEE0] text-gray-700 p-2 rounded-md border border-gray-300 text-xs 2xl:text-sm">
                                <SelectValue placeholder="Select Payment Mode" />
                                <ChevronDown
                                  size={14}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                />
                              </SelectTrigger>
                              <SelectContent className="max-h-64">
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="PayLater">
                                  Pay Later
                                </SelectItem>
                                <SelectItem value="Cashfree">Online</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    { }
                    <FormField
                      control={addGuestForm.control}
                      name="paymentStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black text-[0.8rem]">
                            Payment Status
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!isEnabled}
                            >
                              <SelectTrigger className="relative bg-[#F6EEE0] text-gray-700 p-2 rounded-md border border-gray-300 text-xs 2xl:text-sm">
                                <SelectValue placeholder="Select Payment Status" />
                                <ChevronDown
                                  size={14}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />



                  </div>
                  <div className='w-full flex gap-4'>

                    { }
                    <div className="w-full mt-4 border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                          control={addGuestForm.control}
                          name="paymentDetails.currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-black text-[0.8rem]">
                                Currency
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="INR"
                                  disabled={!isEnabled}
                                  {...field}
                                  className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addGuestForm.control}
                          name="paymentDetails.totalTaxes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-black text-[0.8rem]">
                                Total Taxes
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  disabled={!isEnabled}
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                  className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addGuestForm.control}
                          name="paymentDetails.otaCommission"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-black text-[0.8rem]">
                                OTA Commission
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  disabled={!isEnabled}
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                  className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addGuestForm.control}
                          name="paymentDetails.tcs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-black text-[0.8rem]">
                                TCS
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  disabled={!isEnabled}
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                  className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addGuestForm.control}
                          name="paymentDetails.tds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-black text-[0.8rem]">
                                TDS
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  disabled={!isEnabled}
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                  className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addGuestForm.control}
                          name="paymentDetails.payAtHotel"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value || false}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                  disabled={!isEnabled}
                                  className="form-checkbox"
                                />
                              </FormControl>
                              <FormLabel className="text-black text-[0.8rem]">
                                Pay At Hotel
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        { }
                        <FormField
                          control={addGuestForm.control}
                          name="paymentDetails.sellRate"
                          render={({ field }) => (
                            <input type="hidden" {...field} value={field.value ?? 300} />
                          )}
                        />
                        <FormField
                          control={addGuestForm.control}
                          name="paymentDetails.netRate"
                          render={({ field }) => (
                            <input type="hidden" {...field} value={field.value ?? 0} />
                          )}
                        />
                        <FormField
                          control={addGuestForm.control}
                          name="paymentDetails.paymentMade"
                          render={({ field }) => (
                            <input type="hidden" {...field} value={field.value ?? 0} />
                          )}
                        />
                      </div>
                    </div>
                    { }
                    <div className="w-full mt-4 border-t pt-4">
                      <FormWrapper title="Billing & Company Details">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          { }
                          <FormField
                            control={addGuestForm.control}
                            name="paymentDetails.billingName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black text-[0.8rem]">Billing Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Billing Name" {...field} value={field.value ?? ''} disabled={!isEnabled} className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          { }
                          <FormField
                            control={addGuestForm.control}
                            name="paymentDetails.billingEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black text-[0.8rem]">Billing Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Billing Email" {...field} value={field.value ?? ''} disabled={!isEnabled} className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          { }
                          <FormField
                            control={addGuestForm.control}
                            name="paymentDetails.billingMobile"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black text-[0.8rem]">Billing Mobile</FormLabel>
                                <FormControl>
                                  <Input placeholder="Billing Mobile" {...field} value={field.value ?? ''} disabled={!isEnabled} className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          { }
                          <FormField
                            control={addGuestForm.control}
                            name="paymentDetails.companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black text-[0.8rem]">Company Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Company Name" {...field} value={field.value ?? ''} disabled={!isEnabled} className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          { }
                          <FormField
                            control={addGuestForm.control}
                            name="paymentDetails.gstNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black text-[0.8rem]">GST Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="GST Number" {...field} value={field.value ?? ''} disabled={!isEnabled} className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          { }
                          <FormField
                            control={addGuestForm.control}
                            name="paymentDetails.corporateCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black text-[0.8rem]">Corporate Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="Corporate Code" {...field} value={field.value ?? ''} disabled={!isEnabled} className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          { }
                          <FormField
                            control={addGuestForm.control}
                            name="paymentDetails.invoiceRequired"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2 mt-6">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value || false}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    disabled={!isEnabled}
                                    className="form-checkbox"
                                  />
                                </FormControl>
                                <FormLabel className="text-black text-[0.8rem] mb-0">Invoice Required</FormLabel>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormWrapper>
                    </div>
                    { }
                    <div className="w-full mt-4 border-t pt-4">
                      <FormWrapper title="Room Type">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          { }
                          <FormField
                            control={addGuestForm.control}
                            name="roomTypeId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black text-[0.8rem]">
                                  Room Type *
                                </FormLabel>
                                <FormControl>
                                  {roomTypesLoading ? (
                                    <div className="bg-[#F6EEE0] text-gray-500 p-2 rounded-md text-xs 2xl:text-sm">
                                      Loading room types...
                                    </div>
                                  ) : roomTypesError ? (
                                    <div className="bg-red-50 text-red-600 p-2 rounded-md text-xs 2xl:text-sm">
                                      {roomTypesError}
                                    </div>
                                  ) : roomTypes.length === 0 ? (
                                    <div className="bg-yellow-50 text-yellow-700 p-2 rounded-md text-xs 2xl:text-sm">
                                      No room types configured for this hotel
                                    </div>
                                  ) : (
                                    <Select
                                      value={field.value || ''}
                                      onValueChange={(value) => {
                                        const selectedRoomType = roomTypes.find(rt => rt.roomTypeId === value);
                                        field.onChange(value);
                                        addGuestForm.setValue('roomTypeName', selectedRoomType?.roomTypeName || '');
                                      }}
                                      disabled={!isEnabled}
                                    >
                                      <SelectTrigger className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm h-auto">
                                        <SelectValue placeholder="Select a room type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {roomTypes.map((rt) => (
                                          <SelectItem key={rt.roomTypeId} value={rt.roomTypeId}>
                                            {rt.roomTypeName} ({rt.roomCount} rooms)
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          { }
                          <Controller
                            control={addGuestForm.control}
                            name="roomTypeName"
                            render={({ field }) => (
                              <input type="hidden" {...field} value={field.value ?? ''} />
                            )}
                          />
                          <FormField
                            control={addGuestForm.control}
                            name="payAtHotel"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value || false}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    disabled={!isEnabled}
                                    className="form-checkbox"
                                  />
                                </FormControl>
                                <FormLabel className="text-black text-[0.8rem]">
                                  Pay At Hotel
                                </FormLabel>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormWrapper>
                    </div>
                  </div>
                  { }
                  <div className="w-full mt-4 border-t pt-4">
                    <FormWrapper title="Room Stays">
                      <div className="flex justify-between items-center mb-2">
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Room Stays
                        </FormLabel>
                        <div className="flex items-center gap-2">
                          {roomTypes.length === 0 && !roomTypesLoading && (
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                              Room types must be configured before creating bookings
                            </span>
                          )}
                          {roomTypesLoading && (
                            <span className="text-xs text-gray-500">
                              Loading room types...
                            </span>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log('[AddRoomStay] Button clicked, roomTypes.length:', roomTypes.length);
                              if (roomTypes.length === 0) {
                                ToastAtTopRight.fire({
                                  icon: 'error',
                                  title: 'Room types required',
                                  text: 'Please configure room types for this hotel before creating bookings.'
                                });
                                return;
                              }
                              const defaultRoomType = roomTypes[0];
                              console.log('[AddRoomStay] Adding room stay with roomTypeId:', defaultRoomType?.roomTypeId);
                              appendRoomStay({
                                roomTypeId: defaultRoomType?.roomTypeId || '',
                                ratePlanId: '',
                                roomTypeName: defaultRoomType?.roomTypeName || '',
                                numAdults: 1,
                                numChildren: 0,
                                roomId: ''
                              });
                            }}
                            className="h-7 text-xs"
                            disabled={!isEnabled || roomTypes.length === 0}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Room Stay
                          </Button>
                        </div>
                      </div>
                      <div className="w-[100%] gap-4">
                        {roomStaysFields.map((field, index) => (
                          <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-sm font-semibold text-gray-700">Room Stay {index + 1}</h4>
                              {roomStaysFields.length > 1 && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeRoomStay(index)}
                                  className="h-7 text-xs text-red-600"
                                  disabled={!isEnabled}
                                >
                                  <Trash className="h-3 w-3 mr-1" /> Remove
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              { }
                              <FormField
                                control={addGuestForm.control}
                                name={`roomStays.${index}.roomTypeId`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-black text-[0.8rem]">
                                      Room Type *
                                    </FormLabel>
                                    <FormControl>
                                      {roomTypes.length === 0 ? (
                                        <div className="bg-yellow-50 text-yellow-700 p-2 rounded-md text-xs 2xl:text-sm">
                                          No room types available
                                        </div>
                                      ) : (
                                        <Select
                                          value={field.value || ''}
                                          onValueChange={(value) => {
                                            const selectedRoomType = roomTypes.find(rt => rt.roomTypeId === value);
                                            field.onChange(value);
                                            addGuestForm.setValue(`roomStays.${index}.roomTypeName`, selectedRoomType?.roomTypeName || '');
                                          }}
                                          disabled={!isEnabled}
                                        >
                                          <SelectTrigger className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm h-auto">
                                            <SelectValue placeholder="Select room type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {roomTypes.filter(rt => rt.roomTypeName).map((rt) => (
                                              <SelectItem key={rt.roomTypeId} value={rt.roomTypeId}>
                                                {rt.roomTypeName} ({rt.roomCount} rooms)
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      )}
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              { }
                              <Controller
                                control={addGuestForm.control}
                                name={`roomStays.${index}.roomTypeName`}
                                render={({ field }) => (
                                  <input type="hidden" {...field} value={field.value ?? ''} />
                                )}
                              />
                              { }
                              <Controller
                                control={addGuestForm.control}
                                name={`roomStays.${index}.ratePlanId`}
                                render={({ field }) => (
                                  <input type="hidden" {...field} value={field.value ?? ''} />
                                )}
                              />
                              <FormField
                                control={addGuestForm.control}
                                name={`roomStays.${index}.numAdults`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-black text-[0.8rem]">
                                      Number of Adults
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                        disabled={!isEnabled}
                                        {...field}
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 1)}
                                        className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addGuestForm.control}
                                name={`roomStays.${index}.numChildren`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-black text-[0.8rem]">
                                      Number of Children
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        disabled={!isEnabled}
                                        {...field}
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                        className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              { }
                              <Controller
                                control={addGuestForm.control}
                                name={`roomStays.${index}.roomId`}
                                render={({ field }) => (
                                  <input type="hidden" {...field} value={''} />
                                )}
                              />
                            </div>
                          </div>
                        ))}
                        {roomStaysFields.length === 0 && (
                          <div className="text-center text-gray-500 py-4">
                            No room stays added. Click "Add Room Stay" to add one.
                          </div>
                        )}
                      </div>
                    </FormWrapper>
                  </div>
                  { }
                  <div className="w-full mt-4 border-t pt-4 flex flex-col gap-6">
                    { }
                    <div className="w-full grid grid-cols-3 gap-6">
                      { }
                      <div className="col-span-3">
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Extra Charges
                          </FormLabel>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              appendExtraCharge({
                                title: '',
                                amount: 0,
                                reason: ''
                              })
                            }
                            className="h-7 text-xs"
                            disabled={!isEnabled}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Charge
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {extraChargeFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center">
                              <FormField
                                control={addGuestForm.control}
                                name={`extraCharges.${index}.title`}
                                render={({ field }) => (
                                  <Input
                                    placeholder="Title (e.g. Damage)"
                                    {...field}
                                    disabled={!isEnabled}
                                    className="bg-[#F6EEE0] text-xs h-8"
                                  />
                                )}
                              />
                              <FormField
                                control={addGuestForm.control}
                                name={`extraCharges.${index}.amount`}
                                render={({ field }) => (
                                  <Input
                                    type="number"
                                    placeholder="Amount"
                                    {...field}
                                    disabled={!isEnabled}
                                    onChange={(e) =>
                                      field.onChange(toNum(e.target.value))
                                    }
                                    className="bg-[#F6EEE0] text-xs h-8 w-24"
                                  />
                                )}
                              />
                              <FormField
                                control={addGuestForm.control}
                                name={`extraCharges.${index}.reason`}
                                render={({ field }) => (
                                  <Input
                                    placeholder="Reason"
                                    {...field}
                                    disabled={!isEnabled}
                                    className="bg-[#F6EEE0] text-xs h-8"
                                  />
                                )}
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500"
                                onClick={() => removeExtraCharge(index)}
                                disabled={!isEnabled}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          {extraChargeFields.length === 0 && (
                            <div className="text-center text-gray-500 py-2 text-xs">
                              No extra charges added
                            </div>
                          )}
                        </div>
                      </div>

                      { }
                      <div className="col-span-1">
                        <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                          Late Checkout
                        </FormLabel>
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={addGuestForm.control}
                            name="lateCheckout.hours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[0.7rem] text-gray-600">
                                  Hours Delayed
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Hours"
                                    {...field}
                                    value={field.value ?? ''}
                                    disabled={!isEnabled}
                                    onChange={(e) =>
                                      field.onChange(toNum(e.target.value))
                                    }
                                    className="bg-[#F6EEE0] text-xs h-9"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addGuestForm.control}
                            name="lateCheckout.amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[0.7rem] text-gray-600">
                                  Charge Amount
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Amount"
                                    {...field}
                                    value={field.value ?? ''}
                                    disabled={!isEnabled}
                                    onChange={(e) =>
                                      field.onChange(toNum(e.target.value))
                                    }
                                    className="bg-[#F6EEE0] text-xs h-9"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addGuestForm.control}
                            name="lateCheckout.reason"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[0.7rem] text-gray-600">
                                  Notes/Reason
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Reason"
                                    {...field}
                                    value={field.value ?? ''}
                                    disabled={!isEnabled}
                                    className="bg-[#F6EEE0] text-xs h-9"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      { }
                      <div className="col-span-2">
                        <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                          <h3 className="font-semibold text-gray-800 mb-3 text-sm border-b pb-2">
                            Billing Breakdown
                          </h3>
                          <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Room Tariff</span>
                              <span>₹{toNum(tariffWatch).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-red-500">
                              <span>
                                Discount (
                                {addGuestForm.watch('discountType') === 'percentage'
                                  ? `${addGuestForm.watch('discountAmount')}%`
                                  : 'Flat'}
                                )
                              </span>
                              <span>
                                - ₹
                                {(addGuestForm.watch('discountType') === 'percentage'
                                  ? (toNum(tariffWatch) *
                                    toNum(addGuestForm.watch('discountAmount'))) /
                                  100
                                  : toNum(addGuestForm.watch('discountAmount'))
                                ).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-blue-600">
                              <span>Extra Charges</span>
                              <span>
                                + ₹
                                {(addGuestForm.watch('extraCharges') || [])
                                  .reduce((acc, curr) => acc + toNum(curr.amount), 0)
                                  .toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-blue-600">
                              <span>Late Checkout</span>
                              <span>
                                + ₹
                                {toNum(
                                  addGuestForm.watch('lateCheckout.amount')
                                ).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-blue-600">
                              <span>Service Due</span>
                              <span>
                                + ₹
                                {toNum(addGuestForm.watch('serviceDue')).toFixed(2)}
                              </span>
                            </div>
                            <div className="border-t my-1"></div>
                            <div className="flex justify-between font-bold text-lg text-black">
                              <span>Total Payable</span>
                              <span>
                                ₹
                                {(
                                  toNum(tariffWatch) -
                                  (addGuestForm.watch('discountType') === 'percentage'
                                    ? (toNum(tariffWatch) *
                                      toNum(addGuestForm.watch('discountAmount'))) /
                                    100
                                    : toNum(addGuestForm.watch('discountAmount'))) +
                                  (addGuestForm.watch('extraCharges') || []).reduce(
                                    (acc, curr) => acc + toNum(curr.amount),
                                    0
                                  ) +
                                  toNum(addGuestForm.watch('lateCheckout.amount')) +
                                  toNum(addGuestForm.watch('serviceDue'))
                                ).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-green-600 font-medium">
                              <span>Received Amount</span>
                              <span>- ₹{toNum(receivedWatch).toFixed(2)}</span>
                            </div>
                            <div className="border-t my-1"></div>
                            <div className="flex justify-between font-bold text-base text-red-600">
                              <span>Outstanding Balance</span>
                              <span>
                                ₹
                                {toNum(addGuestForm.watch('roomTariffDue')).toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    { }
                    <div className="w-44">
                      <FormField
                        control={addGuestForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black text-[0.8rem]">
                              Booking Status
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={!isEnabled}
                              >
                                <SelectTrigger className="relative bg-[#F6EEE0] text-gray-700 p-2 rounded-md border border-gray-300 text-xs 2xl:text-sm">
                                  <SelectValue placeholder="Select Booking Status" />
                                  <ChevronDown
                                    size={14}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Confirmed">
                                    Confirmed
                                  </SelectItem>
                                  <SelectItem value="Checked-In">
                                    Checked-In
                                  </SelectItem>
                                  <SelectItem value="Checked-Out">
                                    Checked-Out
                                  </SelectItem>
                                  <SelectItem value="Cancelled">
                                    Cancelled
                                  </SelectItem>
                                  <SelectItem value="No-Show">No Show</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    { }
                    <div className="w-full p-4 border-t border-dashed border-gray-400 pt-4">
                      {(mode === 'view' || mode === 'edit') &&
                        (() => {

                          const servicesList = Array.isArray(services)
                            ? services
                            : [];


                          const payLaterServices = servicesList.filter(
                            (srv) => !srv?.serviceRequestId
                          );

                          const withRequest = servicesList.filter(
                            (srv) => !!srv?.serviceRequestId
                          );


                          const paymentMode = addGuestForm.watch('paymentMode');
                          const roomTariff = toNum(addGuestForm.watch('roomTariff') || 0);
                          const serviceDue = toNum(addGuestForm.watch('serviceDue') || 0);
                          const extraCharges = addGuestForm.watch('extraCharges') || [];
                          const lateCheckout = addGuestForm.watch('lateCheckout') || {};
                          const lateCheckoutAmount = toNum(lateCheckout?.amount || 0);


                          const payLaterItems: Array<{ _id: string; requestName: string; amount: number }> = [];


                          payLaterServices.forEach((srv) => {
                            payLaterItems.push({
                              _id: srv._id || `service-${Date.now()}-${Math.random()}`,
                              requestName: srv.requestName || 'Service',
                              amount: Number(srv.amount || 0)
                            });
                          });


                          if (paymentMode === 'PayLater') {

                            if (roomTariff > 0) {
                              payLaterItems.push({
                                _id: `room-tariff-${Date.now()}`,
                                requestName: 'Room Tariff',
                                amount: roomTariff
                              });
                            }


                            if (serviceDue > 0) {
                              payLaterItems.push({
                                _id: `service-due-${Date.now()}`,
                                requestName: 'Service Due',
                                amount: serviceDue
                              });
                            }


                            extraCharges.forEach((charge: any, index: number) => {
                              const chargeAmount = toNum(charge?.amount || 0);
                              if (chargeAmount > 0) {
                                payLaterItems.push({
                                  _id: `extra-charge-${index}-${Date.now()}`,
                                  requestName: charge?.title || `Extra Charge ${index + 1}`,
                                  amount: chargeAmount
                                });
                              }
                            });


                            if (lateCheckoutAmount > 0) {
                              payLaterItems.push({
                                _id: `late-checkout-${Date.now()}`,
                                requestName: 'Late Checkout',
                                amount: lateCheckoutAmount
                              });
                            }
                          }

                          return (
                            <>
                              { }
                              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                                Pay later
                              </h2>

                              {payLaterItems.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {payLaterItems.map((item) => (
                                    <div
                                      key={item._id}
                                      className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                                    >
                                      <div className="flex flex-col">
                                        <div className="mb-4">
                                          <h3 className="text-lg font-semibold text-gray-800">
                                            {item.requestName}
                                          </h3>
                                        </div>
                                        <div className="mb-2">
                                          <p className="text-lg text-gray-900 font-semibold">
                                            Amount: ₹
                                            {Number(item.amount).toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center text-gray-500 py-4">
                                  No pay-later items.
                                </div>
                              )}

                              { }
                              {withRequest.length > 0 && (
                                <>
                                  <h2 className="text-2xl font-semibold text-gray-700 mt-10 mb-6">
                                    Linked service requests
                                  </h2>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {withRequest.map((srv) => (
                                      <div
                                        key={srv._id}
                                        className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                                      >
                                        <div className="flex flex-col">
                                          <div className="mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                              {srv.requestName ||
                                                srv?.serviceRequestId?.__t ||
                                                'Service'}
                                            </h3>
                                            {srv?.serviceRequestId?.uniqueId && (
                                              <p className="text-xs text-gray-500">
                                                ID: {srv.serviceRequestId.uniqueId}
                                              </p>
                                            )}
                                          </div>
                                          <p className="text-lg text-gray-900 font-semibold">
                                            Amount: ₹
                                            {Number(srv.amount ?? 0).toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </>
                          );
                        })()}
                    </div>

                    { }
                    <div className="w-full flex flex-col items-start pb-4">
                      <FormWrapper
                        title={
                          mode === 'edit'
                            ? 'Upload Document'
                            : 'Identification Document'
                        }
                      >
                        <h2 className="text-3xl text-gray-700 font-semibold mb-4">
                          {mode === 'edit'
                            ? 'Upload Document'
                            : 'Identification Document'}
                        </h2>

                        {idProofDetails?.url ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            { }
                            <div className="w-full flex flex-col">
                              <a
                                href={idProofDetails.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`relative rounded-sm w-full h-40 md:h-56 overflow-hidden ${getBorderColorClass(idProofDetails.status)}`}
                              >
                                {idProofDetails.url.endsWith('.pdf') ? (
                                  <iframe
                                    src={idProofDetails.url}
                                    title="Uploaded PDF"
                                    className="w-full h-full object-cover pointer-events-none"
                                  />
                                ) : (
                                  <Image
                                    src={idProofDetails.url}
                                    alt="Uploaded Document"
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </a>
                              <div className="mt-1 text-sm text-gray-700 font-medium text-center">
                                Status: {idProofDetails.status}
                              </div>
                            </div>

                            { }
                            {mode === 'edit' && (
                              <div className="relative rounded-sm w-full h-40 md:h-56 overflow-hidden border border-gray-300">
                                <label className="w-full h-full block cursor-pointer">
                                  <input
                                    type="file"
                                    disabled={!isEnabled}
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                    onChange={(e) => handleImageChange(e, 1)}
                                  />
                                  {images[1] ? (
                                    typeof images[1] === 'string' &&
                                      images[1].endsWith('.pdf') ? (
                                      <iframe
                                        src={images[1]}
                                        title="PDF Preview"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Image
                                        src={images[1] as string}
                                        alt="Uploaded"
                                        fill
                                        className="object-cover"
                                      />
                                    )
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-600">
                                      Upload Image
                                    </div>
                                  )}
                                </label>
                              </div>
                            )}
                          </div>
                        ) : (

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {[0, 1, 2].map((index) => (
                              <div
                                key={index}
                                className="relative rounded-sm w-full h-40 md:h-56 overflow-hidden border border-gray-300"
                              >
                                <label className="w-full h-full block cursor-pointer">
                                  <input
                                    type="file"
                                    disabled={!isEnabled}
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                    onChange={(e) => handleImageChange(e, index)}
                                  />
                                  {images[index] ? (
                                    typeof images[index] === 'string' &&
                                      (images[index] as string)
                                        .toLowerCase()
                                        .endsWith('.pdf') ? (
                                      <iframe
                                        src={images[index] as string}
                                        title={`PDF ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Image
                                        src={images[index] as string}
                                        alt={`Uploaded ${index + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                    )
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-600">
                                      Upload Image
                                    </div>
                                  )}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}

                        { }
                        {addGuestForm.formState.errors.guests && (
                          <p className="text-red-600 text-sm mt-3">
                            {(addGuestForm.formState.errors.guests as any)?.message ??
                              'Please complete additional guest details.'}
                          </p>
                        )}

                        { }
                        <div className="mt-8">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm text-gray-700"></div>
                            <button
                              type="button"
                              aria-disabled={!canAddMoreGuests}
                              onClick={handleAddGuestClick}
                              className={`px-3 py-1.5 text-sm rounded-md border transition
                          ${canAddMoreGuests
                                  ? 'border-[#8B5E3C] bg-[#A67B5B] hover:bg-[#8B5E3C] text-white cursor-pointer'
                                  : 'border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                              Add Guest
                            </button>
                          </div>

                          {fields.length > 0 && (
                            <div className="space-y-4">
                              {fields.map((f, index) => (
                                <div
                                  key={f.id}
                                  className="relative border rounded-lg p-4 bg-[#FAF6EF] shadow-sm"
                                >
                                  { }
                                  <button
                                    type="button"
                                    onClick={() => !mustKeep && remove(index)}
                                    disabled={mustKeep}
                                    className={`absolute top-2 right-2 bg-white border rounded-full w-6 h-6 text-xs flex items-center justify-center shadow
                                ${mustKeep
                                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                        : 'border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-600'
                                      }`}
                                    aria-label="Remove guest"
                                  >
                                    ✕
                                  </button>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    { }
                                    <FormField
                                      control={addGuestForm.control}
                                      name={`guests.${index}.firstName`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm text-gray-700">
                                            First Name{' '}
                                            <span className="text-red-600">*</span>
                                          </FormLabel>
                                          <FormControl>
                                            <Input
                                              {...field}
                                              placeholder="Enter first name"
                                              disabled={!isEnabled}
                                              className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md text-sm border border-gray-300"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    { }
                                    <FormField
                                      control={addGuestForm.control}
                                      name={`guests.${index}.lastName`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm text-gray-700">
                                            Last Name{' '}
                                            <span className="text-red-600">*</span>
                                          </FormLabel>
                                          <FormControl>
                                            <Input
                                              {...field}
                                              placeholder="Enter last name"
                                              disabled={!isEnabled}
                                              className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md text-sm border border-gray-300"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    { }
                                    <Controller
                                      control={addGuestForm.control}
                                      name={`guests.${index}.phoneNumber`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm text-gray-700">
                                            Phone Number
                                          </FormLabel>
                                          <FormControl>
                                            <PhoneInput
                                              defaultCountry="in"
                                              disabled={!isEnabled}
                                              value={
                                                field.value
                                                  ? `+91${String(field.value).replace(/\D/g, '').slice(-10)}`
                                                  : ''
                                              }
                                              onChange={(val) => {
                                                const digits = val.replace(/\D/g, '');
                                                const withoutCountry =
                                                  digits.startsWith('91')
                                                    ? digits.slice(2)
                                                    : digits;
                                                field.onChange(
                                                  withoutCountry.slice(0, 10)
                                                );
                                                addGuestForm.setValue(
                                                  `guests.${index}.countryCode` as const,
                                                  '+91'
                                                );
                                              }}
                                              inputClassName="bg-[#F6EEE0] text-gray-700 p-2 rounded-md text-sm border border-gray-300 w-full"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    { }
                                    <FormField
                                      control={addGuestForm.control}
                                      name={`guests.${index}.gender`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm text-gray-700">
                                            Gender{' '}
                                            <span className="text-red-600">*</span>
                                          </FormLabel>
                                          <FormControl>
                                            <Select
                                              value={field.value}
                                              disabled={!isEnabled}
                                              onValueChange={(v) =>
                                                field.onChange(v as any)
                                              }
                                            >
                                              <SelectTrigger className="relative bg-[#F6EEE0] text-gray-700 p-2 rounded-md border border-gray-300 text-sm">
                                                <SelectValue placeholder="Select gender" />
                                                <ChevronDown
                                                  size={14}
                                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                                />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="male">
                                                  Male
                                                </SelectItem>
                                                <SelectItem value="female">
                                                  Female
                                                </SelectItem>
                                                <SelectItem value="others">
                                                  Others
                                                </SelectItem>
                                                <SelectItem value="prefer not to say">
                                                  Prefer not to say
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    { }
                                    <FormField
                                      control={addGuestForm.control}
                                      name={`guests.${index}.guestType`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm text-gray-700">
                                            Guest Type{' '}
                                            <span className="text-red-600">*</span>
                                          </FormLabel>
                                          <FormControl>
                                            <Select
                                              value={field.value}
                                              disabled={!isEnabled}
                                              onValueChange={(v) =>
                                                field.onChange(v as any)
                                              }
                                            >
                                              <SelectTrigger className="relative bg-[#F6EEE0] text-gray-700 p-2 rounded-md border border-gray-300 text-sm">
                                                <SelectValue placeholder="Select guest type" />
                                                <ChevronDown
                                                  size={14}
                                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                                />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="adult">
                                                  Adult
                                                </SelectItem>
                                                <SelectItem value="children">
                                                  Children
                                                </SelectItem>
                                                <SelectItem value="infant">
                                                  Infant
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    { }
                                    <FormField
                                      control={addGuestForm.control}
                                      name={`guests.${index}.idProof.type`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm text-gray-700">
                                            ID Proof Type
                                          </FormLabel>
                                          <FormControl>
                                            <Select
                                              value={field.value}
                                              disabled={!isEnabled}
                                              onValueChange={(v) =>
                                                field.onChange(
                                                  v as
                                                  | 'PASSPORT'
                                                  | 'AADHAAR'
                                                  | 'DRIVING_LICENSE'
                                                  | 'VOTER_ID'
                                                )
                                              }
                                            >
                                              <SelectTrigger className="relative bg-[#F6EEE0] text-gray-700 p-2 rounded-md border border-gray-300 text-sm">
                                                <SelectValue placeholder="Select ID Proof type" />
                                                <ChevronDown
                                                  size={14}
                                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                                />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="PASSPORT">
                                                  Passport
                                                </SelectItem>
                                                <SelectItem value="AADHAAR">
                                                  Aadhaar
                                                </SelectItem>
                                                <SelectItem value="DRIVING_LICENSE">
                                                  Driving License
                                                </SelectItem>
                                                <SelectItem value="VOTER_ID">
                                                  Voter ID
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    { }
                                    <FormField
                                      control={addGuestForm.control}
                                      name={`guests.${index}.idProof.url`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm text-gray-700">
                                            ID Proof Document
                                          </FormLabel>

                                          <div className="flex items-center gap-3">
                                            <div
                                              className={[
                                                'w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center rounded-md border',
                                                'border-gray-300',
                                                !isEnabled
                                                  ? 'cursor-not-allowed opacity-50'
                                                  : 'cursor-pointer'
                                              ].join(' ')}
                                              onClick={() => {
                                                if (!isEnabled) return;
                                                const el = document.getElementById(
                                                  `guest-id-file-${index}`
                                                ) as HTMLInputElement | null;
                                                el?.click();
                                              }}
                                            >
                                              {field.value ? (
                                                (field.value as string)
                                                  .toLowerCase()
                                                  .endsWith('.pdf') ? (
                                                  <span className="text-xs">
                                                    PDF Uploaded
                                                  </span>
                                                ) : (
                                                  <img
                                                    src={field.value as string}
                                                    alt="ID Proof"
                                                    className="w-full h-full object-cover rounded-md"
                                                  />
                                                )
                                              ) : (
                                                <span className="text-xs text-black">
                                                  Upload
                                                </span>
                                              )}
                                            </div>

                                            <input
                                              id={`guest-id-file-${index}`}
                                              type="file"
                                              accept="image/*,application/pdf"
                                              className="hidden"
                                              disabled={!isEnabled}
                                              onChange={(e) => {

                                                field.onChange(field.value);

                                                handleSecondaryIdProofUpload(index)(
                                                  e
                                                );
                                              }}
                                            />
                                          </div>

                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        { }
                      </FormWrapper>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3">
                    <FormField
                      className="w-full"
                      control={addGuestForm.control}
                      name="preCheckInRejectionMessage"
                      render={({ field }) => (
                        <>
                          {preCheckInRejectionMessage && (
                            <FormItem>
                              <FormLabel className="text-black text-[0.8rem]">
                                Pre-Check In Rejection Message
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Rejection message"
                                  value={preCheckInRejectionMessage ?? ''}
                                  disabled
                                  className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        </>
                      )}
                    />
                  </div>
                  <FormField
                    className="w-full"
                    control={addGuestForm.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <>
                        {mode === 'pending' && (
                          <FormItem>
                            <FormLabel className="text-black text-[0.8rem]">
                              Special Requests
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Enter special requests"
                                value={field.value || ''}
                                onChange={field.onChange}
                                className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 2xl:gap-5 bg-[#FAF6EF] shadow-custom p-6 2xl:p-8 rounded-lg">
                <h2 className="text-base 2xl:text-lg font-semibold text-gray-800">
                  Wi-Fi Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  { }
                  <FormField
                    control={addGuestForm.control}
                    name="wifi.wifiName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                          WiFi Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter WiFi name"
                            disabled={!isEnabled}
                            {...field}

                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none text-xs 2xl:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  { }
                  <FormField
                    control={addGuestForm.control}
                    name="wifi.password"
                    render={({ field }) => {
                      const [showWifiPassword, setShowWifiPassword] =
                        useState(false);

                      return (
                        <FormItem>
                          <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                            WiFi Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative w-full">
                              <Input
                                placeholder="Enter WiFi password"
                                disabled={!isEnabled}
                                type={showWifiPassword ? 'text' : 'password'}
                                {...field}

                                className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none text-xs 2xl:text-sm pr-10"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowWifiPassword((prev) => !prev)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black focus:outline-none"
                                tabIndex={-1}
                              >
                                {showWifiPassword ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      );
                    }}
                  />

                  { }
                  <FormField
                    control={addGuestForm.control}
                    name="wifi.scanner"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                          Upload WiFi Scanner Image
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <Input
                              type="file"
                              disabled={!isEnabled || wifiUploading}
                              accept="image/*,application/pdf"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  setWifiUploading(true);

                                  const url = await uploadToS3(file);

                                  onChange(url as any);
                                  ToastAtTopRight.fire(
                                    'Image uploaded successfully',
                                    'success'
                                  );
                                } catch (err: any) {
                                  ToastAtTopRight.fire(
                                    err?.message || 'Failed to upload image',
                                    'error'
                                  );
                                  console.error(
                                    'WiFi scanner upload failed:',
                                    err
                                  );
                                } finally {
                                  setWifiUploading(false);
                                }
                              }}
                              className="bg-[#F6EEE0] p-2 rounded-md border-none text-black text-xs 2xl:text-sm w-full"
                              {...rest}
                            />

                            { }
                            {value && typeof value === 'string' && (
                              <img
                                src={value}
                                alt="Preview"
                                className="h-10 w-10 rounded object-cover border"
                              />
                            )}
                            {value && typeof value !== 'string' && (
                              <img
                                src={URL.createObjectURL(value)}
                                alt="Preview"
                                className="h-10 w-10 rounded object-cover border"
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 py-8 justify-end w-full">
              <Button
                type="button"
                disabled={!isEnabled}
                onClick={() => router.back()}
                className="btn-secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isEnabled}
                className="btn-primary"
              >
                Save Changes
              </Button>
            </div>
          </form >
        </Form >
      </FormWrapper >
    </>
  )
};
export default GuestForm;

