'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FieldErrors, useForm } from 'react-hook-form';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import {
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Upload
} from 'lucide-react';
import { CiCamera } from 'react-icons/ci';
import { useFieldArray } from 'react-hook-form';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner'; 

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
import { Switch } from '@/components/ui/switch';
import FormWrapper from './form-wrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ToastAtTopRight } from '@/lib/sweetalert';
import apiCall from '@/lib/axios';
import { HotelSchemaType } from 'schema';
import { indiaCities, indiaStates } from 'app/static/Type';
import { getRoomSyncData, convertToRoomConfigs, clearRoomSyncData } from '@/utils/roomSync';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { parseISO } from 'date-fns';
import { format } from 'path';
import { AxiosError } from 'axios';

interface SubscriptionPlan {
  _id: string;
  planName: string;
  cost: number;
  planType?: string;
}

type ImageFieldName =
  | 'logoImage'
  | 'additionalImage'
  | 'roomImage'
  | 'hotelLicenseImage'
  | 'legalBusinessLicenseImage'
  | 'touristLicenseImage'
  | 'tanNumberImage'
  | 'dataPrivacyGdprImage';

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  value: number;
}

const HotelForm = ({
  mode = 'add',
  hotelId
}: {
  mode: 'add' | 'edit' | 'view' | 'pending';
  hotelId?: string;
}) => {
  const isMode = (modes: string | string[]) => {
    if (Array.isArray(modes)) {
      return modes.includes(mode);
    }
    return mode === modes;
  };
  const isDisabled = mode === 'view' || mode === 'pending';
  const router = useRouter();
  const [isBrandedHotelChecked, setIsBrandedHotelChecked] = useState(false);
  const [isChainHotelChecked, setIsChainHotelChecked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [status, setStatus] = useState<'PENDING' | 'APPROVE'>('PENDING');
  const [hotelName, setHotelName] = useState('');
  const [subHotelName, setSubHotelName] = useState('');
  const [fetchedHotelData, setFetchedHotelData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const gstImageRef = useRef<HTMLInputElement>(null);
  
  const roomImageRef = useRef<HTMLInputElement>(null);
  const hotelLicenseImageRef = useRef<HTMLInputElement>(null);
  const legalBusinessLicenseImageRef = useRef<HTMLInputElement>(null);
  const touristLicenseImageRef = useRef<HTMLInputElement>(null);
  const tanNumberImageRef = useRef<HTMLInputElement>(null);
  const dataPrivacyGdprImageRef = useRef<HTMLInputElement>(null);
  const logoImageRef = useRef<HTMLInputElement>(null);
  const additionalImageRef = useRef<HTMLInputElement>(null);

  const servingDepartmentOptions = [
    { label: 'Reception', value: 'reception' },
    { label: 'Housekeeping', value: 'housekeeping' },
    { label: 'In-Room Dining', value: 'inroomdining' },
    { label: 'Gym / Community / Conference Hall', value: 'gym' },
    { label: 'Spa', value: 'spa' },
    { label: 'Swimming Pool', value: 'swimmingpool' },
    { label: 'Concierge Service', value: 'conciergeservice' },
    { label: 'In-Room Control', value: 'in_room_control' },
    { label: 'Order Management', value: 'ordermanagement' },
    { label: 'Sos Management', value: 'sos' },
    { label: 'Chat With Staff', value: 'chat' }
  ];

  const handleStateChange = (state: string) => {
    form.setValue('state', state);
    setSelectedState(state);
    form.setValue('city', '');
  };
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const rejectRequest = async (message: string) => {
    try {
      const response = await apiCall('POST', `api/hotel/reject-request`, {
        requestId: hotelId,
        message: message
      });

      if (response.status === 200 || response.success) {
        toast.success('Request rejected successfully');
        
        router.push('/super-admin/hotel-management');
      } else {
        toast.error('Failed to reject request');
      }
    } catch (error: any) {
      console.error('Reject error:', error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };
  
  const [imagePreviews, setImagePreviews] = useState<{
    [key: string]: string[];
  }>({
    logoImage: [],
    additionalImage: [],
    roomImage: [],
    hotelLicenseImage: [],
    legalBusinessLicenseImage: [],
    touristLicenseImage: [],
    tanNumberImage: [],
    dataPrivacyGdprImage: [],
    gstImage: []
  });

  
  const form = useForm<HotelSchemaType & { merchantId?: string }>({
    defaultValues: {
      name: '',
      number: '',
      email: '',
      merchantId: fetchedHotelData?.merchantId || '',
      address: '',
      address2: '',
      centre: {
        lat: undefined,
        lng: undefined
      },
      propertyAmenities: [],
      roomIds: [],
      pricingAndOccupancy: {
        defaultOccupancy: 2,
        maxOccupancy: 3,
        maxChildren: 1,
        defaultPrice: 1000,
        minPrice: 500,
        extraAdultPrice: 500,
        childPrice: 300
      },
      roomTypeAmenities: [],
      sendToStayflexi: true,
      hotelCategory: '5 Star',
      gstPercentage: undefined,
      city: '',
      country: 'India',
      state: '',
      pinCode: '',
      parentHotelId: '',
      roomImage: undefined,
      
      roomConfigs: [{ roomType: 'Single', features: ['Sea Side'] }],
      numberOfRooms: 0,
      checkInTime: '12:00',
      checkOutTime: '11:00',
      servingDepartment: [],
      totalStaff: 0,
      hotelLicenseCertifications: '',
      hotelLicenseImage: undefined,
      legalBusinessLicense: '',
      legalBusinessLicenseImage: undefined,
      touristLicense: '',
      touristLicenseImage: undefined,
      tanNumber: '',
      gst: '',
      status: 'Active',
      tanNumberImage: undefined,
      dataPrivacyGdprCompliances: '',
      dataPrivacyGdprImage: undefined,
      internetConnectivity: false,
      softwareCompatibility: false,
      subscriptionPlan: { _id: '', planName: '', cost: 0, planType: '' },
      subscriptionPrice: 0,
      netPrice: 0,
      couponCode: 'Choose coupon',
      subscriptionStartDate: '',
      subscriptionEndDate: '',
      about: fetchedHotelData?.about || '',
      roomTypes: fetchedHotelData?.roomTypes || [{ roomTypeName: 'Single', roomCount: 1, amenities: [] }],
      wifi: {
        wifiName: fetchedHotelData?.wifi?.wifiName || '',
        password: fetchedHotelData?.wifi?.password || '',
        scanner: fetchedHotelData?.wifi?.scanner || ''
      }
    }
  });

  const [selectedState, setSelectedState] = useState(
    form.getValues('state') || ''
  );

  const rawNetRef = useRef<number>(0);
  
  const MAX_IMAGE_SIZE = 100 * 1024;

  const handleMultiImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: ImageFieldName 
  ) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    const validFiles = Array.from(files).filter((f) => {
      if (!f.type.startsWith('image/')) {
        ToastAtTopRight.fire('Only image files are allowed.', 'error');
        return false;
      }
      if (f.size > MAX_IMAGE_SIZE) {
        ToastAtTopRight.fire('Each image must be ≤ 100KB.', 'error');
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    setIsLoading(true);
    try {
      const uploads = await Promise.all(
        validFiles.map(async (file) => {
          const fd = new FormData();
          fd.append('file', file, file.name);
          const res = await apiCall('POST', 'api/upload/admin', fd);
          return res?.data?.url as string; 
        })
      );

      
      setImagePreviews((prev) => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] || []), ...uploads]
      }));

      
      if (fieldName === 'roomImage') {
        const existing = (form.getValues('roomImage') as string[]) || [];
        form.setValue('roomImage', [...existing, ...uploads], {
          shouldDirty: true
        });
      }

      ToastAtTopRight.fire('Images uploaded successfully', 'success');
    } catch (err) {
      console.error(err);
      ToastAtTopRight.fire('Failed to upload images', 'error');
    } finally {
      setIsLoading(false);
      
      if (e.target) e.target.value = '';
    }
  };
  const to12hHourOnly = (t?: string) => {
    if (!t) return '';
    const [H] = t.split(':').map(Number);
    if (isNaN(H)) return '';
    const ampm = H >= 12 ? 'PM' : 'AM';
    const hh = ((H + 11) % 12) + 1;
    return `${hh}:00 ${ampm}`;
  };
  const handleImageUpload = async (file: File, fieldName: ImageFieldName) => {
    if (!file.type.startsWith('image/')) {
      ToastAtTopRight.fire('Please upload an image file.', 'error');
      return;
    }

    if (file.size > 100 * 1024) {
      
      ToastAtTopRight.fire('File size exceeds 5MB.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file, file.name);

    setIsLoading(true);
    try {
      const res = await apiCall('POST', 'api/upload/admin', formData);
      const { url } = res.data;

      if (url) {
        
        setImagePreviews((prev) => ({
          ...prev,
          [fieldName]: [url] 
        }));

        
        form.setValue(fieldName, url);

        ToastAtTopRight.fire('Image uploaded successfully', 'success');
      }
    } catch (err: any) {
      ToastAtTopRight.fire('Failed to upload image', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  const ensureNonEmpty = (v?: string | number | null) =>
    !(v === undefined || v === null || String(v).trim() === '');

  function requireFieldsOrToast(keys: (keyof HotelSchemaType)[]) {
    for (const k of keys) {
      const val = form.getValues(k as any);
      if (!ensureNonEmpty(val)) {
        
        
        form.setError(k, { type: 'required', message: 'Required' });
        ToastAtTopRight.fire('Please fill the required field', 'error');
        return false;
      }
    }
    return true;
  }

  const onSubmit = async (data: HotelSchemaType) => {
    const subscriptionStartDate = new Date(data.subscriptionStartDate);
    const subscriptionEndDate = new Date(data.subscriptionEndDate);

    if (isNaN(subscriptionStartDate.getTime())) {
      ToastAtTopRight.fire('Invalid Subscription Start Date', 'error');
      return;
    }
    
    const ok = requireFieldsOrToast([
      'name',
      'address',
      'email',
      'number',
      'city',
      'state',
      'pinCode',
      'subscriptionPlan',
      'subscriptionStartDate',
      'roomTypes'
    ]);
    if (!ok) return;

    
    if (
      isChainHotelChecked &&
      !ensureNonEmpty(form.getValues('parentHotelId'))
    ) {
      form.setError('parentHotelId' as any, {
        type: 'required',
        message: 'Required'
      });
      ToastAtTopRight.fire(
        'Please enter Parent Hotel ID when Chain Hotel is selected',
        'error'
      );
      return;
    }

    const formattedStartDate = subscriptionStartDate
      .toISOString()
      .split('T')[0];
    

    const payload = {
      name: data.name,
      address: data.address,
      address2: data.address2 || '',
      centre: data.centre || { lat: undefined, lng: undefined },
      propertyAmenities: data.propertyAmenities || [],
      roomIds: data.roomIds || [],
      pricingAndOccupancy: data.pricingAndOccupancy || {},
      roomTypeAmenities: data.roomTypeAmenities || [],
      email: data.email,
      phoneNo: data.number,
      password: 'Miss@123',
      hotelCategory: data.hotelCategory,
      rawNetPrice: rawNetRef.current,
      gstPercentage: data.gstPercentage,
      totalStaff: data.totalStaff,
      city: data.city,
      country: data.country,
      numberOfRooms: data.numberOfRooms,
      state: data.state,
      couponCode:
        data.couponCode && data.couponCode !== 'Choose coupon'
          ? data.couponCode
          : '',
      pincode: data.pinCode,
      status: normalizeStatus(data.status),
      chainHotel: isChainHotelChecked,
      parentHotel: isChainHotelChecked ? data.parentHotelId : undefined,
      parentHotelId: data.parentHotelId || '',
      checkInTime: data.checkInTime,
      subscriptionStartDate: formattedStartDate,
      
      subscriptionPrice: data.subscriptionPrice,
      subscriptionPlanName: data.subscriptionPlanName,

      netPrice: data.netPrice,
      checkOutTime: data.checkOutTime,
      brandedHotel: isBrandedHotelChecked,
      subscriptionPlan: data.subscriptionPlan,

      
      servingDepartment: data.servingDepartment,
      logo: imagePreviews.logoImage?.[0] || '',
      images: imagePreviews.roomImage,
      
      gstImage: {
        gstValue: data.gst || '',
        imageUrl:
          imagePreviews.gstImage?.[0] ||
          fetchedHotelData?.gstImage?.imageUrl ||
          ''
      },
      hotelLicenseAndCertification: {
        certificateValue: data.hotelLicenseCertifications,
        imageUrl: imagePreviews.hotelLicenseImage?.[0] || ''
      },
      legalAndBusinessLicense: {
        licenseValue: data.legalBusinessLicense,
        imageUrl: imagePreviews.legalBusinessLicenseImage?.[0] || ''
      },
      touristLicense: {
        licenseValue: data.touristLicense,
        imageUrl: imagePreviews.touristLicenseImage?.[0] || ''
      },
      panNumber: {
        numberValue: data.tanNumber,
        imageUrl: imagePreviews.tanNumberImage?.[0] || ''
      },
      dataPrivacyAndGDPRCompliance: {
        complianceValue: data.dataPrivacyGdprCompliances,
        imageUrl: imagePreviews.dataPrivacyGdprImage?.[0] || ''
      },
      internetConnectivity: data.internetConnectivity,
      softwareCompatibility: data.softwareCompatibility,
      
      
      
      
      
      
      
      
      rooms: data.roomConfigs
        ? data.roomConfigs.map((room: any) => ({
          roomName: room.roomType,
          roomType: room.roomType,
          features: Array.isArray(room.features) ? room.features : [] 
        }))
        : [],
      wifi: {
        wifiName: data?.wifi?.wifiName || '',
        password: data?.wifi?.password || '',
        scanner: data?.wifi?.scanner || ''
      },
      sendToStayflexi: data.sendToStayflexi,
      roomTypes: data.roomTypes || [],
      about: data?.about || ''
    };
    console.log('Payload:', payload);
    console.log('imagePreviews:', imagePreviews);

    
    if (
      isChainHotelChecked &&
      (!data.parentHotelId || data.parentHotelId.trim() === '')
    ) {
      ToastAtTopRight.fire(
        'Please enter Parent Hotel ID when Chain Hotel is selected',
        'error'
      );
      return;
    }

    
    const url =
      mode === 'edit'
        ? `api/hotel/update-hotel/${hotelId}`
        : 'api/hotel/add-hotel';

    const method = mode === 'edit' ? 'PUT' : 'POST';

    console.log('hotel id', url);

    try {
      const response = await apiCall(method, url, payload);

      
      if (response.status) {
        ToastAtTopRight.fire(
          mode === 'edit'
            ? 'Profile updated successfully'
            : 'Hotel created successfully',
          'success'
        );
        if (mode === 'add' || mode === 'edit') {
          router.push('/super-admin/guest-management');
        }
        console.log('Hotel data:', response);
      } else {
        ToastAtTopRight.fire(response.message || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error(error);
      const { title, fieldErrors } = parseApiError(error);
      ToastAtTopRight.fire(title, 'error');

      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([path, msg]) => {
          
          
          form.setError(path, {
            type: 'server',
            message: String(msg || 'Invalid')
          });
        });
      }
    }
  };

  const normalizeStatus = (s?: string): 'Active' | 'Inactive' => {
    const v = (s ?? 'Active').trim().toLowerCase();
    return v === 'inactive' ? 'Inactive' : 'Active';
  };

  useEffect(() => {
    
    if ((mode === 'edit' || mode === 'view') && hotelId) {
      const fetchHotel = async () => {
        try {
          const res = await apiCall('GET', `api/hotel/get-hotel/${hotelId}`);
          console.log(res);
          if (!res?.hotel) {
            ToastAtTopRight.fire('Hotel not found', 'error');
            return;
          }
          setFetchedHotelData(res.hotel);
          setIsBrandedHotelChecked(!!res.hotel.brandedHotel);
          setIsChainHotelChecked(!!res.hotel.chainHotel);
          console.log('reeeee', res.hotel.subscriptionPlan);
          form.reset({
            name: res.hotel.name || '',
            address: res.hotel.address || '',
            address2: res.hotel.address2 || '',
            centre: res.hotel.centre || { lat: undefined, lng: undefined },
            propertyAmenities: res.hotel.propertyAmenities || [],
            roomIds: res.hotel.roomIds || [],
            pricingAndOccupancy: res.hotel.pricingAndOccupancy || {
              defaultOccupancy: 2,
              maxOccupancy: 3,
              maxChildren: 1,
              defaultPrice: 1000,
              minPrice: 500,
              extraAdultPrice: 500,
              childPrice: 300
            },
            roomTypeAmenities: res.hotel.roomTypeAmenities || [],
            sendToStayflexi: res.hotel.sendToStayflexi !== false,
            planName: res.hotel.subscriptionPlan.planName || '',
            email: res.hotel.email || '',
            number: res.hotel.phoneNo || '',
            hotelCategory: res.hotel.hotelCategory || '',
            totalStaff: res.hotel.totalStaff || '',
            city: res.hotel.city || '',
            merchantId: res.hotel.merchantId || '',
            state: res.hotel.state || '',
            country: res.hotel.country || '',
            couponCode:
              res.hotel.coupon?.code ??
              res.hotel.couponCode ??
              res.hotel.applyCoupon ??
              '',
            subscriptionPlan: res.hotel.subscriptionPlan ?? {
              _id: '',
              planName: '',
              cost: 0,
              planType: ''
            },
            subscriptionPrice: res.hotel.subscriptionPlan?.cost ?? 0,
            subscriptionPlanName: res.hotel.subscriptionPlan?.planName ?? '',
            gstPercentage: res.hotel.gstPercentage || 18,
            status: normalizeStatus(res.hotel.status),
            pinCode: res.hotel.pincode || '',
            parentHotelId: res.hotel.parentHotelId || '',
            checkInTime: res.hotel.checkInTime || '',
            checkOutTime: res.hotel.checkOutTime || '',
            numberOfRooms: res.hotel.numberOfRooms || '',
            subscriptionEndDate:
              res.hotel.subscriptionEndDate?.split('T')[0] || '',
            subscriptionStartDate:
              res.hotel.subscriptionStartDate?.split('T')[0] || '',
            
            
            
            netPrice: res.hotel.netPrice || 0,
            
            
            about: res.hotel.about || '',
            servingDepartment: res.hotel.servingDepartment || [],
            roomTypes: res.hotel.roomTypes || [{ roomTypeName: 'Single', roomCount: 1, amenities: [] }],
            internetConnectivity: res.hotel.internetConnectivity || false,
            softwareCompatibility: res.hotel.softwareCompatibility || false,
            wifi: res.hotel.wifi || { wifiName: '', password: '', scanner: {} },
            
            
            
            
            
            roomConfigs: Array.isArray(res?.hotel?.rooms)
              ? res.hotel.rooms.map((room: any) => ({
                roomType: room?.roomType ?? '',
                
                features: Array.isArray(room?.features)
                  ? Array.from(
                    new Set(
                      room.features
                        .map((s: any) => String(s ?? '').trim())
                        .filter(Boolean)
                    )
                  )
                  : []
              }))
              : [],

            hotelLicenseCertifications:
              res.hotel.hotelLicenseAndCertification?.certificateValue || '',
            legalBusinessLicense:
              res.hotel.legalAndBusinessLicense?.licenseValue || '',
            touristLicense: res.hotel.touristLicense?.licenseValue || '',
            dataPrivacyGdprCompliances:
              res.hotel.dataPrivacyAndGDPRCompliance?.complianceValue || '',
            tanNumber: res.hotel.panNumber?.numberValue || '',
            gst: res.hotel?.gstImage?.gstValue || res.hotel?.gst || ''
          });

          
          setImagePreviews({
            logoImage: res.hotel.logo ? [res.hotel.logo] : [],
            roomImage: res.hotel.images || [],
            hotelLicenseImage: res.hotel.hotelLicenseAndCertification?.imageUrl
              ? [res.hotel.hotelLicenseAndCertification.imageUrl]
              : [],
            legalBusinessLicenseImage: res.hotel.legalAndBusinessLicense
              ?.imageUrl
              ? [res.hotel.legalAndBusinessLicense.imageUrl]
              : [],
            touristLicenseImage: res.hotel.touristLicense?.imageUrl
              ? [res.hotel.touristLicense.imageUrl]
              : [],
            tanNumberImage: res.hotel.panNumber?.imageUrl
              ? [res.hotel.panNumber.imageUrl]
              : [],
            dataPrivacyGdprImage: res.hotel.dataPrivacyAndGDPRCompliance
              ?.imageUrl
              ? [res.hotel.dataPrivacyAndGDPRCompliance.imageUrl]
              : [],
            gstImage: res.hotel?.gstImage?.imageUrl
              ? [res.hotel.gstImage.imageUrl]
              : []
            
          });
        } catch (err: any) {
          console.error(
            '❌ Error loading hotel:',
            err?.response || err?.message || err
          );
          ToastAtTopRight.fire('Failed to load hotel', 'error');
        }
      };

      fetchHotel();
    }
  }, [mode, hotelId]);

  useEffect(() => {
    if (mode !== 'pending' || !hotelId) return;

    const to12h = (t?: string) => {
      if (!t) return '';
      const [H, M] = t.split(':').map(Number);
      const ampm = H >= 12 ? 'PM' : 'AM';
      const hh = ((H + 11) % 12) + 1;
      return `${hh}:${String(M ?? 0).padStart(2, '0')} ${ampm}`;
    };

    const fetchPendingHotelData = async () => {
      try {
        const res = await apiCall(
          'GET',
          `api/hotel/pending-request/${hotelId}`
        );
        console.log('Pending', res);
        const d = res?.request?.hotelData;
        if (!d) {
          ToastAtTopRight.fire('Hotel not found or empty response', 'error');
          return;
        }

        setFetchedHotelData(d);
        setIsBrandedHotelChecked(!!d.brandedHotel);
        setIsChainHotelChecked(!!d.chainHotel);

        form.reset({
          name: d.name || '',
          address: d.address || '',
          address2: d.address2 || '',
          centre: d.centre || { lat: undefined, lng: undefined },
          propertyAmenities: d.propertyAmenities || [],
          roomIds: d.roomIds || [],
          pricingAndOccupancy: d.pricingAndOccupancy || {
            defaultOccupancy: 2,
            maxOccupancy: 3,
            maxChildren: 1,
            defaultPrice: 1000,
            minPrice: 500,
            extraAdultPrice: 500,
            childPrice: 300
          },
          roomTypeAmenities: d.roomTypeAmenities || [],
          sendToStayflexi: d.sendToStayflexi !== false,
          email: d.email || '',
          number: d.phoneNo || '',
          hotelCategory: d.hotelCategory || '',
          gstPercentage: d.gstPercentage,
          gst: d.gst || '',
          totalStaff: d.totalStaff ?? 0,
          city: res?.request?.hotelData?.city || 'na',
          merchantId: d.merchantId || '',
          state: d.state || '',
          country: d.country || '',
          pinCode: d.pincode || '',
          parentHotelId: d.parentHotel || '',

          checkInTime: to12h(d.checkInTime),
          checkOutTime: to12h(d.checkOutTime),

          couponCode: d.couponCode || 'Choose coupon',
          numberOfRooms: Array.isArray(d.rooms) ? d.rooms.length : 0,

          subscriptionStartDate: d.subscriptionStartDate?.split('T')[0] || '',
          subscriptionPlan: d.subscriptionPlan || '',
          subscriptionPlanName: d.subscriptionPlanName || '',
          subscriptionPrice: d.subscriptionPrice ?? 0,
          netPrice: d.netPrice ?? 0,

          about: d.about || '',
          roomTypes: d.roomTypes || [{ roomTypeName: 'Single', roomCount: 1, amenities: [] }],
          servingDepartment: d.servingDepartment || [],
          internetConnectivity: !!d.internetConnectivity,
          softwareCompatibility: !!d.softwareCompatibility,

          roomConfigs: Array.isArray(d.rooms)
            ? d.rooms.map((room: any) => ({
              roomType: room.roomType ?? '',
              feature: room.features?.[0] ?? ''
            }))
            : []
        });
        setSelectedState(d.state || '');
        
        
        setImagePreviews({
          logoImage: d.logo ? [d.logo] : [],
          additionalImage: Array.isArray(d.images) ? d.images : [],
          hotelLicenseImage: d.hotelLicenseAndCertification?.imageUrl
            ? [d.hotelLicenseAndCertification.imageUrl]
            : [],
          legalBusinessLicenseImage: d.legalAndBusinessLicense?.imageUrl
            ? [d.legalAndBusinessLicense.imageUrl]
            : [],
          touristLicenseImage: d.touristLicense?.imageUrl
            ? [d.touristLicense.imageUrl]
            : [],
          tanNumberImage: d.panNumber?.imageUrl ? [d.panNumber.imageUrl] : [],

          gstImage: d?.gstImage?.imageUrl ? [d.gstImage.imageUrl] : [],

          dataPrivacyGdprImage: d.dataPrivacyAndGDPRCompliance?.imageUrl
            ? [d.dataPrivacyAndGDPRCompliance.imageUrl]
            : [],
          roomImage:
            Array.isArray(d.rooms) && d.rooms[0]?.images
              ? d.rooms[0].images
              : []
        });
      } catch (err) {
        console.error('Error fetching pending hotel data:', err);
        ToastAtTopRight.fire('Failed to load hotel data', 'error');
      }
    };

    fetchPendingHotelData();
  }, [mode, hotelId, form]);

  const approveRequest = async () => {
    if (!hotelId) {
      ToastAtTopRight.fire('Hotel request ID missing', 'error');
      return;
    }

    try {
      
      const subscriptionPlan = form.getValues('subscriptionPlan');
      const subscriptionStartDate = form.getValues('subscriptionStartDate');
      const couponCode =
        form.getValues('couponCode') === 'Choose coupon'
          ? ''
          : form.getValues('couponCode');
      const gstPercentage = form.getValues('gstPercentage');

      
      if (!subscriptionPlan || !subscriptionStartDate) {
        ToastAtTopRight.fire(
          'Subscription Plan and Start Date are required',
          'error'
        );
        return;
      }

      
      const subscriptionPlanId = typeof subscriptionPlan === 'object' && subscriptionPlan?._id
        ? subscriptionPlan._id
        : subscriptionPlan;

      const payload = {
        requestId: hotelId,
        subscriptionPlan: subscriptionPlanId,
        couponCode: couponCode || '',
        subscriptionStartDate: subscriptionStartDate,
        gstPercentage: gstPercentage || 18,
      };

      console.log('Approval Payload:', payload);

      
      const response = await apiCall(
        'POST',
        'api/hotel/approve-request',
        payload
      );

      if (response.success) {
        ToastAtTopRight.fire('Hotel approved successfully', 'success');
        router.push('/super-admin/hotel-management/pending');
      } else {
        ToastAtTopRight.fire(
          response.message || 'Failed to approve hotel',
          'error'
        );
      }
    } catch (error: any) {
      console.error('Approval error:', error);
      ToastAtTopRight.fire(
        error?.response?.data?.message || 'Server error during approval',
        'error'
      );
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    fieldOnChange?: (file: File | undefined) => void
  ) => {
    const file = e.target.files?.[0];

    if (fieldOnChange) {
      fieldOnChange(file); 
    }

    if (file) {
      
      const formData = new FormData();
      formData.append('file', file, file.name); 

      try {
        
        setIsLoading(true); 

        
        const response = await apiCall('POST', 'api/upload/admin', formData);

        if (response.data.url) {
          
          const uploadedImageUrl = response.data.url;

          
          setImagePreviews((prevState) => ({
            ...prevState,
            [fieldName]: [uploadedImageUrl] 
          }));

          
          fieldOnChange && fieldOnChange(uploadedImageUrl);

          ToastAtTopRight.fire('Image uploaded successfully', 'success');
        }
      } catch (error) {
        ToastAtTopRight.fire('Failed to upload image', 'error');
      } finally {
        setIsLoading(false); 
      }
    }
  };

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  const handleBrandedHotelChange = (checked: boolean) => {
    setIsBrandedHotelChecked(checked);
    if (checked) setIsChainHotelChecked(false);
  };

  const handleChainHotelChange = (checked: boolean) => {
    setIsChainHotelChecked(checked);
  };

  const handleImageRemove = (index: number, fieldName: string) => {
    setImagePreviews((prev) => {
      const updatedImages = prev[fieldName].filter((_, i) => i !== index);
      return { ...prev, [fieldName]: updatedImages };
    });
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'roomConfigs'
  });

  const { fields: roomTypeFields, append: appendRoomType, remove: removeRoomType } = useFieldArray({
    control: form.control,
    name: 'roomTypes'
  });

  const fetchSubscriptionPlans = async () => {
    setIsLoading(true);
    try {
      const response = await apiCall('GET', 'api/subscription?status=Active');
      if (response.success && response.data) {
        console.log('Subscription plans:', response.data);
        setSubscriptionPlans(response.data);
      } else {
        console.error('Failed to fetch subscription plans:', response);
        setSubscriptionPlans([]);
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      setSubscriptionPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  
  const syncRoomData = useCallback(() => {
    if (mode === 'add') {
      const roomSyncData = getRoomSyncData();
      if (roomSyncData && roomSyncData.roomType) {
        const roomConfig = convertToRoomConfigs(roomSyncData);
        
        if (!roomConfig.roomType || !Array.isArray(roomConfig.features)) {
          return;
        }

        const currentRoomConfigs = form.getValues('roomConfigs') || [];

        
        const existingIndex = currentRoomConfigs.findIndex(
          (rc: any) => rc && rc.roomType === roomConfig.roomType
        );

        if (existingIndex >= 0) {
          
          form.setValue(`roomConfigs.${existingIndex}.roomType`, roomConfig.roomType || '');
          form.setValue(`roomConfigs.${existingIndex}.features`, roomConfig.features || []);
        } else {
          
          const currentConfigs = form.getValues('roomConfigs') || [];
          if (currentConfigs.length === 0 || (currentConfigs.length === 1 && currentConfigs[0]?.roomType === 'Single')) {
            
            form.setValue('roomConfigs', [roomConfig], { shouldValidate: false });
          } else {
            
            append(roomConfig, { shouldFocus: false });
          }
        }
      }
    }
  }, [mode, form, append]);

  useEffect(() => {
    
    const timeoutId = setTimeout(() => {
      syncRoomData();
    }, 100);

    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'room_management_sync_data') {
        syncRoomData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    
    const intervalId = setInterval(() => {
      syncRoomData();
    }, 2000); 

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [syncRoomData]);

  const handleSubscriptionPlanChange = (value: string) => {
    const selectedPlan = subscriptionPlans.find((plan) => plan._id === value);

    if (selectedPlan) {
      form.setValue('subscriptionPrice', selectedPlan.cost);
      
      form.setValue('subscriptionPlanName', selectedPlan.planName);
    }
  };

  const round2 = (n: number) => Math.round(n * 100) / 100;

  const calculateNetPrice = async () => {
    const planId = form.getValues('subscriptionPlan');
    const price = Number(form.getValues('subscriptionPrice') || 0);
    const code = form.getValues('couponCode');
    const gstPct = Number(form.getValues('gstPercentage') || 18);

    if (!planId) return;

    
    let discounted = price;

    
    if (code && code !== 'Choose coupon') {
      try {
        const res = await apiCall('POST', 'api/hotel/calculateNetPrice', {
          subscriptionPlan: planId,
          gstPercentage: gstPct,
          couponCode: code
        });
        
        if (res?.success && typeof res.netPrice === 'number') {
          discounted = Number(res.netPrice);
        } else {
          
          const c = coupons.find((c) => c.code === code);
          if (c) {
            discounted =
              c.discountType === 'percentage'
                ? price * (1 - c.value / 100)
                : Math.max(0, price - c.value);
          }
        }
      } catch {
        
        const c = coupons.find((c) => c.code === code);
        if (c) {
          discounted =
            c.discountType === 'percentage'
              ? price * (1 - c.value / 100)
              : Math.max(0, price - c.value);
        }
      }
    }

    
    rawNetRef.current = round2(discounted);

    
    const total = round2(discounted * (1 + gstPct / 100));
    form.setValue('netPrice', total, { shouldDirty: true });
  };

  useEffect(() => {
    calculateNetPrice();
  }, [
    form.watch('subscriptionPlan'),
    form.watch('subscriptionPrice'),
    form.watch('couponCode'),
    form.watch('gstPercentage'),
    coupons.length
  ]);

  useEffect(() => {
    const subId = form.watch('subscriptionPlan');
    const coupon = form.watch('couponCode');

    if (subId) {
      calculateNetPrice();
    }
  }, [form.watch('subscriptionPlan'), form.watch('couponCode')]);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await apiCall('GET', 'api/coupon/hotels?status=Active');
      if (response.success && response.coupons) {
        setCoupons(response.coupons); 
      } else {
        console.error('Failed to fetch coupons:', response);
        setCoupons([]); 
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setCoupons([]); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCouponChange = (value: string) => {
    const selectedCoupon = coupons.find((coupon) => coupon.code === value);
    if (selectedCoupon) {
      
      form.setValue('couponCode', selectedCoupon.code);
    }
  };
  const percentageCoupons = coupons.filter(
    (c) => c.discountType === 'percentage'
  );
  const fixedCoupons = coupons.filter((c) => c.discountType === 'fixed');

  const generateHourlyOptions = () => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const suffix = hour < 12 ? 'AM' : 'PM';
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      options.push(`${formattedHour}:00 ${suffix}`);
    }
    return options;
  };

  function formatYMDLocal(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`; 
  }
  function ymdToLocalDate(ymd: string) {
    
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1); 
  }
  const [merchantSaving, setMerchantSaving] = useState(false);

  const saveMerchantId = async () => {
    const mId = (form.getValues('merchantId') || '').trim();
    if (!hotelId) {
      ToastAtTopRight.fire(
        'Hotel ID missing. Create/Select a hotel first.',
        'error'
      );
      return;
    }
    if (!mId) {
      ToastAtTopRight.fire('Please enter a Merchant ID.', 'error');
      return;
    }

    try {
      setMerchantSaving(true);
      const resp = await apiCall(
        'POST',
        `api/hotel/cashfree-merchant/${hotelId}`,
        { merchantId: mId }
      );

      if (resp?.success) {
        ToastAtTopRight.fire(resp?.message || 'Merchant ID saved!', 'success');
        
        setFetchedHotelData((prev: any) => ({
          ...(prev || {}),
          merchantId: mId
        }));
      } else {
        ToastAtTopRight.fire(
          resp?.message || 'Failed to save Merchant ID',
          'error'
        );
      }
    } catch (err: any) {
      ToastAtTopRight.fire(
        err?.response?.data?.message || 'Server error',
        'error'
      );
    } finally {
      setMerchantSaving(false);
    }
  };
  useEffect(() => {
    if (!hotelId) return;

    const fetchMerchantId = async () => {
      try {
        const resp = await apiCall(
          'GET',
          `api/hotel/cashfree-merchant/${hotelId}`
        );
        if (resp?.success) {
          form.setValue('merchantId', resp?.merchantId || '');
        } else {
          form.setValue('merchantId', '');
        }
      } catch (e) {
        console.error('Failed to fetch merchant id', e);
        form.setValue('merchantId', '');
      }
    };

    
    if (mode === 'view') {
      fetchMerchantId();
    }
  }, [mode, hotelId]);
  useEffect(() => {
    if (!hotelId) return;
    const fetchMerchantId = async () => {
      try {
        const resp = await apiCall(
          'GET',
          `api/hotel/cashfree-merchant/${hotelId}`
        );
        form.setValue(
          'merchantId',
          resp?.success ? resp?.merchantId || '' : ''
        );
      } catch {
        form.setValue('merchantId', '');
      }
    };
    if (mode === 'view' || mode === 'edit') fetchMerchantId();
  }, [mode, hotelId]);
  
  const onInvalid = (
    errors: FieldErrors<HotelSchemaType & { merchantId?: string }>
  ) => {
    ToastAtTopRight.fire('Please fill the required field', 'error');
    const firstKey = Object.keys(errors)[0];
    if (firstKey) {
      
      
      form.setFocus(firstKey);
    }
  };
  type FieldErrs = Record<string, string>;

  function parseApiError(err: unknown): {
    title: string;
    fieldErrors?: FieldErrs;
  } {
    const ax = err as AxiosError<any>;
    const data = ax?.response?.data;

    const title =
      data?.message ||
      data?.error?.message ||
      ax?.message ||
      'Operation failed';

    const fieldErrors: FieldErrs | undefined =
      (data?.errors && typeof data.errors === 'object' && data.errors) ||
      (data?.fieldErrors &&
        typeof data.fieldErrors === 'object' &&
        data.fieldErrors) ||
      undefined;

    return { title, fieldErrors };
  }

  return (
    <FormWrapper title="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="w-full flex flex-col gap-3 bg-inherit mx-auto"
        >
          {mode !== 'pending' && (
            <div className="flex gap-4">
              {}
              <div>
                {}
                <FormField
                  control={form.control}
                  name="roomImage" 
                  render={() => (
                    <FormItem className="w-fit relative">
                      <FormLabel className="text-coffee font-medium">
                        Room Images
                      </FormLabel>

                      <div className="flex items-center gap-2">
                        {}
                        <div
                          className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${isDisabled
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                            } rounded-md border border-gray-100`}
                          onClick={() =>
                            !isDisabled && triggerFileInput(roomImageRef)
                          }
                          aria-label="Upload room images"
                          role="button"
                        >
                          {imagePreviews.roomImage?.length ? (
                            <img
                              src={
                                imagePreviews.roomImage[
                                imagePreviews.roomImage.length - 1
                                ]
                              }
                              alt="Last uploaded room"
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <CiCamera className="w-8 h-8 text-coffee opacity-50" />
                          )}
                        </div>

                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={roomImageRef}
                            onChange={(e) =>
                              handleMultiImageUpload(e, 'roomImage')
                            }
                            className="hidden"
                          />
                        </FormControl>

                        {}
                        <Upload
                          className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${!isDisabled
                            ? 'text-black cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                            }`}
                          onClick={() =>
                            !isDisabled && triggerFileInput(roomImageRef)
                          }
                          aria-label="Add more room images"
                        />
                      </div>

                      <FormMessage className="text-[10px]" />

                      {}
                      {!!imagePreviews.roomImage?.length && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          {imagePreviews.roomImage.map((image, index) => (
                            <div
                              key={index}
                              className="relative w-24 h-24 2xl:w-28 2xl:h-28"
                            >
                              <img
                                src={image}
                                alt={`Room ${index + 1}`}
                                className="w-full h-full object-cover rounded-md"
                              />
                              {!isDisabled && (
                                <button
                                  type="button"
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                  onClick={() =>
                                    handleImageRemove(index, 'roomImage')
                                  }
                                  aria-label={`Remove image ${index + 1}`}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="logoImage"
                render={({ field }) => (
                  <FormItem className="w-fit relative">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Hotel Image
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} rounded-md border border-gray-100`}
                        onClick={() =>
                          !isDisabled && triggerFileInput(logoImageRef)
                        }
                      >
                        {imagePreviews.logoImage?.length > 0 ? (
                          <img
                            src={imagePreviews.logoImage[0]} 
                            alt="Logo Preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <CiCamera className="w-8 h-8 text-coffee opacity-50" />
                        )}
                      </div>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          ref={logoImageRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, 'logoImage'); 
                            }
                          }}
                          className="hidden"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="w-full flex flex-col gap-6">
            {}
            <div className="flex flex-col gap-4 2xl:gap-5 bg-[#FAF6EF] shadow-custom p-6 2xl:p-8 rounded-lg">
              <div className="flex justify-end">
                {mode === 'pending' ? (
                  <>
                    <div className="w-fit mb-4 cursor-pointer">
                      <div className="relative z-50">
                        <DropdownMenu.Root
                          open={showDropdown}
                          onOpenChange={setShowDropdown}
                        >
                          <DropdownMenu.Trigger asChild>
                            <button
                              className={`flex items-center gap-2 px-4 py-2 rounded-md border ${status === 'PENDING'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                                }`}
                            >
                              {status}
                              {showDropdown ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          </DropdownMenu.Trigger>

                          <DropdownMenu.Content
                            align="end"
                            className="bg-white border rounded-md shadow-lg p-1 z-50"
                          >
                            <DropdownMenu.Item
                              onClick={approveRequest}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                            >
                              Approve
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onClick={() => setShowRejectModal(true)}
                              className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer rounded"
                            >
                              Reject
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Hotel Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter hotel name"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setHotelName(e.target.value);
                          }}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter phone number"
                          {...field}
                          maxLength={10}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email"
                          {...field}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Complete Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter address"
                          {...field}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Address Line 2
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter additional address"
                          {...field}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="centre.lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Latitude
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Enter latitude"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="centre.lng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Longitude
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Enter longitude"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="hotelCategory"
                  render={({ field }) => (
                    <FormItem className="w-fit">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Hotel Category <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isDisabled}
                        >
                          <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm relative pr-8">
                            <SelectValue placeholder="Select category" />
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                          </SelectTrigger>

                          <SelectContent className="bg-coffee">
                            {['3 Star', '4 Star', '5 Star', '7 Star'].map(
                              (value) => (
                                <SelectItem
                                  key={value}
                                  value={value}
                                  className="text-white"
                                >
                                  {value}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        State <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        {}
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            handleStateChange(value);
                            field.onChange(value);
                          }}
                          disabled={isDisabled}
                        >
                          <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm relative pr-8">
                            <SelectValue placeholder="Select state" />
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                          </SelectTrigger>

                          {}
                          <SelectContent
                            position="popper"
                            className="max-h-60 overflow-y-auto"
                          >
                            {indiaStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        City <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!selectedState || isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Country <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isDisabled}
                        >
                          <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm relative pr-8">
                            <SelectValue placeholder="Select country" />
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                          </SelectTrigger>
                          <SelectContent>
                            {['India', 'United States', 'United Kingdom'].map(
                              (value) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pinCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Pincode <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          placeholder="Enter pincode"
                          {...field}
                          onInput={(e) => {
                            const value = e.currentTarget.value.replace(
                              /\D/g,
                              ''
                            ); 
                            if (value.length <= 6) field.onChange(value); 
                          }}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem className="col-span-1 sm:col-span-2">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        About Us
                      </FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={5}
                          placeholder="Write something about the hotel..."
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm resize-none"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-5 w-fit">
                <FormField
                  control={form.control}
                  name="brandedHotel"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Branded Hotel
                      </FormLabel>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={isBrandedHotelChecked}
                          onChange={(e) =>
                            handleBrandedHotelChange(e.target.checked)
                          }
                          disabled={isDisabled}
                          className="form-checkbox"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chainHotel"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Chain Hotel
                      </FormLabel>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={isChainHotelChecked}
                          onChange={(e) =>
                            handleChainHotelChange(e.target.checked)
                          }
                          disabled={isDisabled || isBrandedHotelChecked}
                          className="form-checkbox"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {}
              {isChainHotelChecked && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <>
                    <FormField
                      control={form.control}
                      name="parentHotelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                            Parent Hotel ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Parent Hotel ID"
                              {...field}
                              className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </>
                </div>
              )}
            </div>

            {}
            <div className="flex flex-col gap-4 2xl:gap-5 bg-[#FAF6EF] shadow-custom p-6 2xl:p-8 rounded-lg">
              <div className="flex flex-col gap-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-3">
                    <FormField
                      control={form.control}
                      name={`roomConfigs.${index}.roomType`}
                      render={({ field }) => (
                        <FormItem className="w-40">
                          <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                            Room Types <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              value={field.value || ''} 
                              onChange={field.onChange} 
                              disabled={isDisabled}
                              placeholder="Room Type"
                              className="w-40 bg-[#F6EEE0] text-gray-700 p-2 rounded-md"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`roomConfigs.${index}.features`}
                      render={({ field }) => {
                        const features: string[] = Array.isArray(field.value)
                          ? field.value
                          : [];

                        const add = (raw: string) => {
                          const v = raw.trim();
                          if (!v) return;
                          const next = Array.from(
                            new Set([...(features || []), v])
                          );
                          field.onChange(next);
                        };

                        const removeAt = (i: number) => {
                          const next = (features || []).filter(
                            (_, idx) => idx !== i
                          );
                          field.onChange(next);
                        };

                        const onKeyDown: React.KeyboardEventHandler<
                          HTMLInputElement
                        > = (e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const input = e.currentTarget as HTMLInputElement;
                            add(input.value);
                            input.value = ''; 
                          }
                        };

                        const onPaste: React.ClipboardEventHandler<
                          HTMLInputElement
                        > = (e) => {
                          
                          const text = e.clipboardData.getData('text');
                          if (!text) return;
                          e.preventDefault();
                          const parts = text
                            .split(/[,\n]/g)
                            .map((s) => s.trim())
                            .filter(Boolean);
                          if (!parts.length) return;
                          const next = Array.from(
                            new Set([...(features || []), ...parts])
                          );
                          field.onChange(next);
                        };

                        return (
                          <FormItem className="w-72">
                            <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                              Add Features{' '}
                              <span className="text-red-500">*</span>
                            </FormLabel>

                            {}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {features?.map((f, i) => (
                                <span
                                  key={`${f}-${i}`}
                                  className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-[#F6EEE0] text-gray-700 text-xs"
                                >
                                  {f}
                                  {!isDisabled && (
                                    <button
                                      type="button"
                                      className="text-red-600"
                                      onClick={() => removeAt(i)}
                                      aria-label={`remove ${f}`}
                                    >
                                      ×
                                    </button>
                                  )}
                                </span>
                              ))}
                              {!features?.length && (
                                <span className="text-[11px] text-gray-400">
                                  No features added
                                </span>
                              )}
                            </div>

                            {}
                            <Input
                              type="text"
                              onKeyDown={onKeyDown}
                              onPaste={onPaste}
                              disabled={isDisabled}
                              placeholder="Type a feature, press Enter"
                              className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md text-xs 2xl:text-sm"
                            />

                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        );
                      }}
                    />

                    {}
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => !isDisabled && remove(index)}
                        className={`text-red-500 text-sm pt-6 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isDisabled}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}

                {}
                <button
                  type="button"
                  
                  
                  
                  
                  onClick={() =>
                    !isDisabled &&
                    append({ roomType: 'Single', features: ['Sea Side'] })
                  }
                  className={`mt-2 text-blue-600 flex items-center gap-1 text-sm ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isDisabled}
                >
                  <Plus className="w-4 h-4" /> Add Room & Features
                </button>
              </div>

              {}
              <FormField
                control={form.control}
                name="propertyAmenities"
                render={({ field }) => {
                  const amenities: string[] = Array.isArray(field.value) ? field.value : [];
                  const propertyAmenityOptions = [
                    'Currency Exchange',
                    'Shuttle/Cab Service',
                    'Hot Tub/Jacuzzi',
                    'Breakfast',
                    'Room Service'
                  ];

                  const toggleAmenity = (value: string) => {
                    const newValue = amenities.includes(value)
                      ? amenities.filter((v) => v !== value)
                      : [...amenities, value];
                    field.onChange(newValue);
                  };

                  return (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Property Amenities
                      </FormLabel>
                      <div className="flex flex-wrap gap-3 text-sm">
                        {propertyAmenityOptions.map((option) => (
                          <label
                            key={option}
                            className="inline-flex text-gray-700 items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={amenities.includes(option)}
                              onChange={() => toggleAmenity(option)}
                              disabled={isDisabled}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  );
                }}
              />

              {}
              <FormField
                control={form.control}
                name="roomTypeAmenities"
                render={({ field }) => {
                  const amenities: string[] = Array.isArray(field.value) ? field.value : [];
                  const roomTypeAmenityOptions = [
                    "Wardrobe/Closet",
                    "Air conditioning",
                    "Trash cans",
                    "Dryer",
                    "Sofa bed"
                  ];

                  const toggleAmenity = (value: string) => {
                    const newValue = amenities.includes(value)
                      ? amenities.filter((v) => v !== value)
                      : [...amenities, value];
                    field.onChange(newValue);
                  };

                  return (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Room Type Amenities
                      </FormLabel>
                      <div className="flex flex-wrap gap-3 text-sm">
                        {roomTypeAmenityOptions.map((option) => (
                          <label
                            key={option}
                            className="inline-flex text-gray-700 items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={amenities.includes(option)}
                              onChange={() => toggleAmenity(option)}
                              disabled={isDisabled}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="roomIds"
                render={({ field }) => {
                  const roomIds: string[] = Array.isArray(field.value) ? field.value : [];

                  const add = (raw: string) => {
                    const v = raw.trim();
                    if (!v) return;
                    const next = Array.from(new Set([...(roomIds || []), v]));
                    field.onChange(next);
                  };

                  const removeAt = (i: number) => {
                    const next = (roomIds || []).filter((_, idx) => idx !== i);
                    field.onChange(next);
                  };

                  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const input = e.currentTarget as HTMLInputElement;
                      add(input.value);
                      input.value = '';
                    }
                  };

                  return (
                    <FormItem>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {roomIds?.map((id, i) => (
                          <span
                            key={`${id}-${i}`}
                            className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-[#F6EEE0] text-gray-700 text-xs"
                          >
                            {id}
                            {!isDisabled && (
                              <button
                                type="button"
                                className="text-red-600"
                                onClick={() => removeAt(i)}
                                aria-label={`remove ${id}`}
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  );
                }}
              />


              <div className="flex flex-col gap-4 bg-[#F9F4EA] p-5 rounded-lg border border-[#E8DCC4] mt-4">
                <div className="flex justify-between items-center border-b border-[#E8DCC4] pb-3 mb-2">
                  <h3 className="text-sm 2xl:text-base font-semibold text-gray-800">Room Types Configuration</h3>
                  {!isDisabled && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendRoomType({ roomTypeName: 'Single', roomCount: 1, amenities: [] })}
                      className="flex items-center gap-2 border-coffee text-coffee hover:bg-coffee hover:text-white h-8 text-xs"
                    >
                      <Plus size={14} /> Add Room Type
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {roomTypeFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 bg-white/50 rounded-md border border-[#F0E6D2] relative group">
                      <div className="md:col-span-4">
                        <FormField
                          control={form.control}
                          name={`roomTypes.${index}.roomTypeName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Room Type Name</FormLabel>
                              <FormControl>
                                <div className="flex flex-col gap-2">
                                  <Select
                                    onValueChange={(val) => {
                                      if (val !== 'Custom') {
                                        field.onChange(val);
                                      } else {
                                        field.onChange(''); 
                                      }
                                    }}
                                    value={['Single', 'Double', 'Deluxe', 'Suite'].includes(field.value) ? field.value : (field.value === '' ? 'Custom' : 'Custom')}
                                    disabled={isDisabled}
                                  >
                                    <SelectTrigger className="w-full bg-[#F6EEE0] border-none text-xs text-black">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {['Single', 'Double', 'Deluxe', 'Suite', 'Custom'].map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {(!['Single', 'Double', 'Deluxe', 'Suite'].includes(field.value)) && (
                                    <Input
                                      placeholder="Ex: Presidential Suite"
                                      value={field.value}
                                      onChange={field.onChange}
                                      disabled={isDisabled}
                                      className="bg-[#F6EEE0] border-none text-xs h-9 text-black"
                                    />
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`roomTypes.${index}.roomCount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Count</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  disabled={isDisabled}
                                  className="bg-[#F6EEE0] border-none text-xs h-9 text-black"
                                />
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-5">
                        <FormField
                          control={form.control}
                          name={`roomTypes.${index}.amenities`}
                          render={({ field }) => {
                            const currentAmenities = Array.isArray(field.value) ? field.value : [];
                            const common = ['AC', 'WiFi', 'TV', 'Mini Bar', 'Bathtub'];

                            const toggle = (val: string) => {
                              if (currentAmenities.includes(val)) {
                                field.onChange(currentAmenities.filter((a: string) => a !== val));
                              } else {
                                field.onChange([...currentAmenities, val]);
                              }
                            };

                            return (
                              <FormItem>
                                <FormLabel className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Amenities</FormLabel>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {common.map((a) => (
                                    <button
                                      key={a}
                                      type="button"
                                      onClick={() => !isDisabled && toggle(a)}
                                      className={cn(
                                        "px-2 py-1 text-[10px] rounded transition-all",
                                        currentAmenities.includes(a)
                                          ? "bg-coffee text-white"
                                          : "bg-[#F6EEE0] text-gray-600 hover:bg-[#EBDCC4]"
                                      )}
                                      disabled={isDisabled}
                                    >
                                      {a}
                                    </button>
                                  ))}
                                </div>
                                {!isDisabled && (
                                  <Input
                                    placeholder="Add other..."
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = e.currentTarget.value.trim();
                                        if (val && !currentAmenities.includes(val)) {
                                          field.onChange([...currentAmenities, val]);
                                          e.currentTarget.value = '';
                                        }
                                      }
                                    }}
                                    className="mt-2 bg-[#F6EEE0] border-none text-xs h-7 text-black"
                                  />
                                )}
                              </FormItem>
                            );
                          }}
                        />
                      </div>

                      {!isDisabled && roomTypeFields.length > 1 && (
                        <div className="md:col-span-1 pt-7">
                          <button
                            type="button"
                            onClick={() => removeRoomType(index)}
                            className="text-red-400 hover:text-red-600 transition-colors p-2"
                            title="Remove Room Type"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="pricingAndOccupancy.defaultOccupancy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Default Occupancy
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Default occupancy"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricingAndOccupancy.maxOccupancy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Max Occupancy
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Max occupancy"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricingAndOccupancy.maxChildren"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Max Children
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Max children"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricingAndOccupancy.defaultPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Default Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Default price"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricingAndOccupancy.minPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Min Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Min price"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricingAndOccupancy.extraAdultPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Extra Adult Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Extra adult price"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricingAndOccupancy.childPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Child Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Child price"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="servingDepartment"
                  render={({ field }) => {
                    const selectedDepartments = field.value || [];

                    const toggleOption = (value: string) => {
                      const newValue = selectedDepartments.includes(value)
                        ? selectedDepartments.filter((v) => v !== value)
                        : [...selectedDepartments, value];
                      field.onChange(newValue);
                    };

                    return (
                      <FormItem>
                        <FormLabel>Serving Departments</FormLabel>
                        <div className="flex flex-wrap gap-3 text-sm">
                          {servingDepartmentOptions.map((option) => (
                            <label
                              key={option.value}
                              className="inline-flex text-gray-700 items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={selectedDepartments.includes(
                                  option.value
                                )}
                                onChange={() => toggleOption(option.value)}
                                disabled={isDisabled}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="numberOfRooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Total Number of Rooms
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Enter number of rooms"
                          {...field}
                          disabled={isDisabled}
                          
                          
                          
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalStaff"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Total Staff
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Enter total staff"
                          {...field}
                          disabled={isDisabled}
                          
                          
                          
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="checkInTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Check-in Time
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={isDisabled}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm relative pr-8">
                            <SelectValue placeholder="Select check-in time" />
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {generateHourlyOptions().map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkOutTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Check-out Time
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            disabled={isDisabled}
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm relative pr-8"
                          >
                            <SelectValue placeholder="Select check-out time" />
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {generateHourlyOptions().map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {}
                <FormField
                  control={form.control}
                  name="subscriptionPlan"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Allocate Subscription{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        {mode === 'view' ? (
                          <input
                            type="text"
                            value={field.value?.planName ?? ''}
                            disabled
                            className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm w-full"
                          />
                        ) : (
                          <Select
                            value={field.value?._id ?? ''}
                            onValueChange={(id) => {
                              const plan = subscriptionPlans.find(
                                (p) => p._id === id
                              );
                              if (!plan) return;
                              
                              field.onChange({
                                _id: plan._id,
                                planName: plan.planName,
                                cost: plan.cost,
                                planType: plan.planType ?? ''
                              });
                              form.setValue('subscriptionPrice', plan.cost);
                              form.setValue(
                                'subscriptionPlanName',
                                plan.planName
                              );
                            }}
                            disabled={isDisabled && mode !== 'pending'}
                          >
                            <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm relative pr-8">
                              <SelectValue placeholder="Select plan" />
                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                            </SelectTrigger>
                            <SelectContent className="bg-coffee max-h-80 max-w-60 overflow-y-auto">
                              {subscriptionPlans.map((plan) => (
                                <SelectItem
                                  key={plan._id}
                                  value={plan._id}
                                  className="text-white"
                                >
                                  {plan.planName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {}
                <FormField
                  control={form.control}
                  name="subscriptionPrice"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Subscription Price (Excluding GST){' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Enter Subscription Price"
                          {...field} 
                          disabled={
                            mode === 'view' || mode === 'edit' || isDisabled
                          }
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gstPercentage"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        GST Percentage
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const safe = isNaN(val)
                              ? 18
                              : Math.max(0, Math.min(100, val));
                            field.onChange(safe);
                          }}
                          disabled={isDisabled}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="couponCode"
                  render={({ field }) => (
                    <FormItem className="w-full relative">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Apply Coupon
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleCouponChange(value);
                            }}
                            disabled={mode === 'view' || mode === 'edit'}
                          >
                            <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm pr-8 relative">
                              <SelectValue placeholder="Choose coupon" />
                              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                            </SelectTrigger>
                            <SelectContent className="bg-coffee max-h-80 max-w-100 overflow-y-auto">
                              {percentageCoupons.length > 0 && (
                                <>
                                  <div className="text-xs text-gray-300 px-3 py-1 uppercase tracking-wide">
                                    Percentage Coupons
                                  </div>
                                  {percentageCoupons.map((coupon) => (
                                    <SelectItem
                                      key={coupon._id}
                                      value={coupon.code}
                                      className="text-white"
                                    >
                                      {coupon.code} - {coupon.value}% off
                                    </SelectItem>
                                  ))}
                                </>
                              )}
                              {fixedCoupons.length > 0 && (
                                <>
                                  <div className="text-xs text-gray-300 px-3 py-1 uppercase tracking-wide">
                                    Fixed Coupons
                                  </div>
                                  {fixedCoupons.map((coupon) => (
                                    <SelectItem
                                      key={coupon._id}
                                      value={coupon.code}
                                      className="text-white"
                                    >
                                      {coupon.code}- ₹{coupon.value} off
                                    </SelectItem>
                                  ))}
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        {field.value && field.value !== 'Choose coupon' && (
                          <button
                            type="button"
                            onClick={() => {
                              field.onChange('Choose coupon');
                              handleCouponChange('Choose coupon');
                            }}
                            className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 text-xs"
                            disabled={
                              mode === 'view' ||
                              mode === 'edit' ||
                              isDisabled ||
                              isLoading
                            }
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {form.watch('couponCode') !== 'Choose coupon' && (
                  <FormField
                    control={form.control}
                    name="netPrice"
                    render={({ field }) => (
                      <FormItem className="w-fit">
                        <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                          Net Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            readOnly
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                            disabled={
                              mode === 'view' || mode === 'edit' || isDisabled
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="subscriptionStartDate"
                  render={({ field }) => {
                    const [open, setOpen] = React.useState(false);

                    
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    
                    const valueAsDate = field.value
                      ? ymdToLocalDate(field.value)
                      : undefined;

                    
                    const outerIsDisabled = isDisabled;
                    const computedDisabled = mode === 'view' || mode === 'edit';

                    return (
                      <FormItem className="w-full">
                        <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                          Subscription Start Date{' '}
                          <span className="text-red-500">*</span>
                        </FormLabel>

                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              disabled={computedDisabled}
                              className={`w-full justify-between bg-[#F6EEE0] text-gray-700 border-none ${!valueAsDate ? 'text-muted-foreground' : ''
                                }`}
                            >
                              <span>
                                {valueAsDate
                                  ? valueAsDate.toLocaleDateString(undefined, {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })
                                  : 'Pick a date'}
                              </span>
                              <CalendarIcon className="h-4 w-4 opacity-70" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={valueAsDate}
                              onSelect={(d) => {
                                if (!d) return;
                                field.onChange(formatYMDLocal(d)); 
                                setOpen(false);
                              }}
                              
                              showOutsideDays={false} 
                              weekStartsOn={0} 
                              disabled={(date) => {
                                const d = new Date(date);
                                d.setHours(0, 0, 0, 0);
                                return d < today; 
                              }}
                              
                              className="p-2"
                              classNames={{
                                
                                months: 'space-y-2',
                                month: 'space-y-2',
                                caption:
                                  'flex justify-between items-center px-2 pt-2',
                                caption_label:
                                  'text-[#8B4513] font-semibold text-sm',
                                nav: 'flex items-center gap-1',
                                nav_button:
                                  'h-8 w-8 rounded-md hover:bg-[#8B4513]/10',
                                
                                head_row: 'grid grid-cols-7',
                                head_cell:
                                  'text-[11px] font-semibold text-[#8B4513]/80 h-8 w-8 grid place-items-center',
                                
                                table: 'w-full border-collapse',
                                row: 'grid grid-cols-7 gap-0',
                                cell: 'h-10 w-10 text-center p-0',
                                
                                day: [
                                  'h-9 w-9 rounded-full p-0 grid place-items-center',
                                  'text-[13px] font-medium',
                                  'hover:bg-[#8B4513]/10 hover:text-[#2a1a0d]',
                                  'focus:outline-none focus:ring-2 focus:ring-[#8B4513]/40'
                                ].join(' '),
                                
                                day_selected:
                                  'bg-[#8B4513] text-white hover:bg-[#7a3e10] hover:text-white',
                                
                                day_today:
                                  "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-[#8B4513]",
                                
                                day_outside: 'hidden', 
                                day_disabled:
                                  'text-gray-300 opacity-70 cursor-not-allowed'
                              }}
                              
                              modifiers={{
                                weekend: (d) =>
                                  d.getDay() === 0 || d.getDay() === 6 
                              }}
                              modifiersClassNames={{
                                weekend: 'text-[#8B4513]/70'
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    );
                  }}
                />
                {(mode === 'view' || mode === 'edit') && (
                  <FormField
                    control={form.control}
                    name="subscriptionEndDate"
                    render={({ field }) => (
                      <FormItem className="w-fit">
                        <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                          Subscription End Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)} 
                            
                            disabled
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                )}
                {(mode === 'view' || mode === 'edit') && (
                  <FormField
                    control={form.control}
                    name="subscriptionEndDate"
                    render={({ field }) => (
                      <FormItem className="w-fit">
                        <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                          Next Payment Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)} 
                            
                            disabled
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-fit">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Status
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {showRejectModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-lg font-semibold mb-4">
                    Reason for Rejection
                  </h2>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    placeholder="Enter reason..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-coffee resize-none"
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowRejectModal(false);
                        setRejectionReason('');
                      }}
                      className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        rejectRequest(rejectionReason); 
                        setShowRejectModal(false);
                        setRejectionReason('');
                      }}
                      disabled={!rejectionReason.trim()}
                      className="px-4 py-2 rounded text-white hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: '#A07D3D' }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-5 bg-[#FAF6EF] shadow-custom p-6 2xl:p-8 rounded-lg">
              <FormField
                control={form.control}
                name="hotelLicenseCertifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Hotel License & Certifications{' '}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter license details"
                        {...field}
                        disabled={isDisabled}
                        className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              {(!isDisabled ||
                (imagePreviews.hotelLicenseImage &&
                  imagePreviews.hotelLicenseImage.length > 0)) && (
                  <FormField
                    control={form.control}
                    name="hotelLicenseImage"
                    render={({ field }) => (
                      <FormItem className="w-fit relative">
                        <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                          Hotel License Image{' '}
                        </FormLabel>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} rounded-md border border-gray-100`}
                            onClick={
                              () =>
                                !isDisabled &&
                                triggerFileInput(hotelLicenseImageRef) 
                            }
                          >
                            {imagePreviews.hotelLicenseImage &&
                              imagePreviews.hotelLicenseImage.length > 0 ? (
                              <img
                                src={imagePreviews.hotelLicenseImage[0]} 
                                alt="Hotel License Preview"
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <CiCamera className="w-8 h-8 text-coffee opacity-50" />
                            )}
                          </div>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              ref={hotelLicenseImageRef}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, 'hotelLicenseImage'); 
                                }
                              }}
                              className="hidden"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                )}

              <FormField
                control={form.control}
                name="legalBusinessLicense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Legal and Business License{' '}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter business license"
                        {...field}
                        disabled={isDisabled}
                        className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              {}
              {(!isDisabled ||
                (imagePreviews.legalBusinessLicenseImage &&
                  imagePreviews.legalBusinessLicenseImage.length > 0)) && (
                  <FormField
                    control={form.control}
                    name="legalBusinessLicenseImage"
                    render={({ field }) => (
                      <FormItem className="w-fit relative">
                        <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                          Business License Image{' '}
                        </FormLabel>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} rounded-md border border-gray-100`}
                            onClick={
                              () =>
                                !isDisabled &&
                                triggerFileInput(legalBusinessLicenseImageRef) 
                            }
                          >
                            {imagePreviews.legalBusinessLicenseImage &&
                              imagePreviews.legalBusinessLicenseImage.length > 0 ? (
                              <img
                                src={imagePreviews.legalBusinessLicenseImage[0]} 
                                alt="Business License Preview"
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <CiCamera className="w-8 h-8 text-coffee opacity-50" />
                            )}
                          </div>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              ref={legalBusinessLicenseImageRef}
                              disabled={isDisabled}
                              onChange={
                                (e) =>
                                  handleImageChange(
                                    e,
                                    'legalBusinessLicenseImage',
                                    field.onChange
                                  ) 
                              }
                              className="hidden"
                            />
                          </FormControl>
                          <Upload
                            className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${imagePreviews.legalBusinessLicenseImage && !isDisabled
                              ? 'text-black cursor-pointer'
                              : 'text-gray-400 cursor-not-allowed'
                              }`}
                            onClick={
                              () =>
                                imagePreviews.legalBusinessLicenseImage &&
                                !isDisabled &&
                                triggerFileInput(legalBusinessLicenseImageRef) 
                            }
                          />
                        </div>
                        <FormMessage className="text-[10px]" />

                        {}
                        <div className="flex flex-wrap gap-3 mt-4">
                          {imagePreviews.legalBusinessLicenseImage?.map(
                            (image, index) => (
                              <div
                                key={index}
                                className="relative w-24 h-24 2xl:w-28 2xl:h-28"
                              >
                                <img
                                  src={image}
                                  alt={`Business License Preview ${index + 1}`}
                                  className="w-full h-full object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                  onClick={() =>
                                    handleImageRemove(
                                      index,
                                      'legalBusinessLicenseImage'
                                    )
                                  } 
                                >
                                  X
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                )}

              <FormField
                control={form.control}
                name="touristLicense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Tourist License
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tourist license"
                        {...field}
                        disabled={isDisabled}
                        className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              {}
              {(!isDisabled ||
                (imagePreviews.touristLicenseImage &&
                  imagePreviews.touristLicenseImage.length > 0)) && (
                  <FormField
                    control={form.control}
                    name="touristLicenseImage"
                    render={({ field }) => (
                      <FormItem className="w-fit relative">
                        <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                          Tourist License Image{' '}
                        </FormLabel>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} rounded-md border border-gray-100`}
                            onClick={
                              () =>
                                !isDisabled &&
                                triggerFileInput(touristLicenseImageRef) 
                            }
                          >
                            {imagePreviews.touristLicenseImage &&
                              imagePreviews.touristLicenseImage.length > 0 ? (
                              <img
                                src={imagePreviews.touristLicenseImage[0]} 
                                alt="Tourist License Preview"
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <CiCamera className="w-8 h-8 text-coffee opacity-50" />
                            )}
                          </div>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              ref={touristLicenseImageRef}
                              onChange={
                                (e) =>
                                  handleImageChange(
                                    e,
                                    'touristLicenseImage',
                                    field.onChange
                                  ) 
                              }
                              className="hidden"
                            />
                          </FormControl>
                          <Upload
                            className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${imagePreviews.touristLicenseImage && !isDisabled
                              ? 'text-black cursor-pointer'
                              : 'text-gray-400 cursor-not-allowed'
                              }`}
                            onClick={
                              () =>
                                imagePreviews.touristLicenseImage &&
                                !isDisabled &&
                                triggerFileInput(touristLicenseImageRef) 
                            }
                          />
                        </div>
                        <FormMessage className="text-[10px]" />

                        {}
                        <div className="flex flex-wrap gap-3 mt-4">
                          {imagePreviews.touristLicenseImage?.map(
                            (image, index) => (
                              <div
                                key={index}
                                className="relative w-24 h-24 2xl:w-28 2xl:h-28"
                              >
                                <img
                                  src={image}
                                  alt={`Tourist License Preview ${index + 1}`}
                                  className="w-full h-full object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                  onClick={() =>
                                    handleImageRemove(
                                      index,
                                      'touristLicenseImage'
                                    )
                                  } 
                                >
                                  X
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                )}

              <FormField
                control={form.control}
                name="tanNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      TAN Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter TAN number"
                        {...field}
                        disabled={isDisabled}
                        className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tanNumberImage"
                render={({ field }) => (
                  <FormItem className="w-fit relative">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      TAN Number Image
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} rounded-md border border-gray-100`}
                        onClick={
                          () =>
                            !isDisabled && triggerFileInput(tanNumberImageRef) 
                        }
                      >
                        {imagePreviews.tanNumberImage &&
                          imagePreviews.tanNumberImage.length > 0 ? (
                          <img
                            src={imagePreviews.tanNumberImage[0]} 
                            alt="TAN Number Preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <CiCamera className="w-8 h-8 text-coffee opacity-50" />
                        )}
                      </div>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          ref={tanNumberImageRef}
                          onChange={
                            (e) =>
                              handleImageChange(
                                e,
                                'tanNumberImage',
                                field.onChange
                              ) 
                          }
                          className="hidden"
                        />
                      </FormControl>
                      <Upload
                        className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${imagePreviews.tanNumberImage && !isDisabled
                          ? 'text-black cursor-pointer'
                          : 'text-gray-400 cursor-not-allowed'
                          }`}
                        onClick={
                          () =>
                            imagePreviews.tanNumberImage &&
                            !isDisabled &&
                            triggerFileInput(tanNumberImageRef) 
                        }
                      />
                    </div>
                    <FormMessage className="text-[10px]" />

                    {}
                    <div className="flex flex-wrap gap-3 mt-4">
                      {imagePreviews.tanNumberImage?.map((image, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 2xl:w-28 2xl:h-28"
                        >
                          <img
                            src={image}
                            alt={`TAN Number Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            onClick={() =>
                              handleImageRemove(index, 'tanNumberImage')
                            } 
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataPrivacyGdprCompliances"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Data Privacy & GDPR Compliances{' '}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter GDPR details"
                        {...field}
                        disabled={isDisabled}
                        className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              {}
              <FormField
                control={form.control}
                name="dataPrivacyGdprImage"
                render={({ field }) => (
                  <FormItem className="w-fit relative">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      GDPR Compliance Image{' '}
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} rounded-md border border-gray-100`}
                        onClick={
                          () =>
                            !isDisabled &&
                            triggerFileInput(dataPrivacyGdprImageRef) 
                        }
                      >
                        {imagePreviews.dataPrivacyGdprImage &&
                          imagePreviews.dataPrivacyGdprImage.length > 0 ? (
                          <img
                            src={imagePreviews.dataPrivacyGdprImage[0]} 
                            alt="GDPR Compliance Preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <CiCamera className="w-8 h-8 text-coffee opacity-50" />
                        )}
                      </div>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          ref={dataPrivacyGdprImageRef}
                          onChange={
                            (e) =>
                              handleImageChange(
                                e,
                                'dataPrivacyGdprImage',
                                field.onChange
                              ) 
                          }
                          className="hidden"
                        />
                      </FormControl>
                      <Upload
                        className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${imagePreviews.dataPrivacyGdprImage && !isDisabled
                          ? 'text-black cursor-pointer'
                          : 'text-gray-400 cursor-not-allowed'
                          }`}
                        onClick={
                          () =>
                            imagePreviews.dataPrivacyGdprImage &&
                            !isDisabled &&
                            triggerFileInput(dataPrivacyGdprImageRef) 
                        }
                      />
                    </div>
                    <FormMessage className="text-[10px]" />

                    {}
                    <div className="flex flex-wrap gap-3 mt-4">
                      {imagePreviews.dataPrivacyGdprImage?.map(
                        (image, index) => (
                          <div
                            key={index}
                            className="relative w-24 h-24 2xl:w-28 2xl:h-28"
                          >
                            <img
                              src={image}
                              alt={`GDPR Compliance Preview ${index + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                              onClick={() =>
                                handleImageRemove(index, 'dataPrivacyGdprImage')
                              } 
                            >
                              X
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </FormItem>
                )}
              />

              {}
              <FormField
                control={form.control}
                name="gst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      GST Number / Details
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter GST number/details"
                        {...field}
                        disabled={isDisabled}
                        className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gstImage"
                render={({ field }) => (
                  <FormItem className="w-fit relative">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      GST Certificate Image{' '}
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${isDisabled
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer'
                          } rounded-md border border-gray-100`}
                        onClick={() =>
                          !isDisabled && triggerFileInput(gstImageRef)
                        }
                      >
                        {imagePreviews.gstImage &&
                          imagePreviews.gstImage.length > 0 ? (
                          <img
                            src={imagePreviews.gstImage[0]}
                            alt="GST Certificate Preview"
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <CiCamera className="w-8 h-8 text-coffee opacity-50" />
                        )}
                      </div>

                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          ref={gstImageRef}
                          onChange={(e) =>
                            handleImageChange(e, 'gstImage', field.onChange)
                          }
                          className="hidden"
                        />
                      </FormControl>

                      <Upload
                        className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${imagePreviews.gstImage && !isDisabled
                          ? 'text-black cursor-pointer'
                          : 'text-gray-400 cursor-not-allowed'
                          }`}
                        onClick={() =>
                          imagePreviews.gstImage &&
                          !isDisabled &&
                          triggerFileInput(gstImageRef)
                        }
                      />
                    </div>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              {}
              <FormField
                control={form.control}
                name="merchantId"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Cashfree Merchant ID
                    </FormLabel>

                    {mode === 'view' ? (
                      
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          disabled
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                    ) : (
                      
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter Cashfree Merchant ID"
                            disabled={!hotelId || mode === 'pending'}
                            className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(/\s+/g, ''))
                            }
                          />
                        </FormControl>
                        <Button
                          type="button"
                          onClick={saveMerchantId}
                          disabled={
                            !hotelId || mode === 'pending' || merchantSaving
                          }
                          className="btn-primary text-xs 2xl:text-sm whitespace-nowrap"
                          title={
                            !hotelId ? 'Create/Select a hotel first' : 'Save'
                          }
                        >
                          {merchantSaving ? 'Saving…' : 'Save'}
                        </Button>
                      </div>
                    )}

                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {}

              {}
              {}
              {}

              <FormField
                control={form.control}
                name="sendToStayflexi"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 sm:col-span-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={isDisabled}
                        className="form-checkbox"
                      />
                    </FormControl>
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700 m-0">
                      Send to Stayflexi
                    </FormLabel>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row justify-end gap-4 2x:gap-5">
            <Button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary text-xs 2xl:text-sm"
            >
              Cancel
            </Button>
            {mode !== 'pending' && (
              <Button
                type="submit"
                disabled={isDisabled || roomTypeFields.length === 0}
                className="btn-primary text-xs 2xl:text-sm"
              >
                {isMode(['edit', 'view']) ? 'Save Changes' : 'Create'}
              </Button>
            )}
          </div>
        </form>
      </Form>

      {}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Hotel Request</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border border-gray-300 rounded-md p-3 mb-4 min-h-[120px] focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (!rejectionReason.trim()) {
                    ToastAtTopRight.fire('Please enter a rejection reason', 'error');
                    return;
                  }
                  rejectRequest(rejectionReason);
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </FormWrapper >
  );
};

export default HotelForm;
