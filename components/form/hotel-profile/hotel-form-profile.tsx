'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { hotelSchema, HotelSchemaType } from 'schema';
import {
  ChevronDown,
  ChevronUp,
  Upload,
  Plus,
  Trash2,
  Download
} from 'lucide-react';
import { CiCamera } from 'react-icons/ci';
import { useFieldArray } from 'react-hook-form';

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
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import InvoiceExactA4, { InvoiceExactProps } from 'app/(protected)/invoice';
import {
  DropdownMenuItem,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu';

const INVOICE_ID = '68c8fba6e1c648fdbb63d281';
const HotelFormProfile = ({
  mode = 'add',
  hotelId
}: {
  mode: 'add' | 'edit' | 'view' | 'pending';
  hotelId?: string;
}) => {
  const isMode = (modes: string | string[]) => {
    if (Array.isArray(modes)) return modes.includes(mode);
    return mode === modes;
  };
  const isDisabled = mode === 'view' || mode === 'pending';
  const router = useRouter();
  const [isBrandedHotelChecked, setIsBrandedHotelChecked] = useState(false);
  const [isChainHotelChecked, setIsChainHotelChecked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [status, setStatus] = useState<'PENDING' | 'APPROVE'>('PENDING');
  const [hotelName, setHotelName] = useState('');
  const [fetchedHotelData, setFetchedHotelData] = useState<any>(null);

  // File input refs
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
  // -------- Invoice render target --------
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoiceProps, setInvoiceProps] = useState<InvoiceExactProps | null>(
    null
  );
  const handleStateChange = (state: string) => {
    form.setValue('state', state);
    setSelectedState(state);
    form.setValue('city', '');
  };

  // ---------- Image previews (arrays, even singles use index 0)
  const [imagePreviews, setImagePreviews] = useState<Record<string, string[]>>({
    logoImage: [],
    additionalImage: [],
    roomImage: [],
    hotelLicenseImage: [],
    legalBusinessLicenseImage: [],
    touristLicenseImage: [],
    tanNumberImage: [],
    dataPrivacyGdprImage: []
  });

  const form = useForm<HotelSchemaType>({
    defaultValues: {
      name: '',
      number: '',
      email: '',
      address: '',
      hotelCategory: '5 Star',
      city: '',
      country: 'India',
      gstPercentage: 18,
      state: 'Maharashtra',
      pinCode: '',
      parentHotelId: '',
      roomImage: undefined,
      // roomConfigs: [{ roomType: 'Single', feature: 'Sea Side' }],
      roomConfigs: [{ roomType: 'Single', features: ['Sea Side'] }],
      numberOfRooms: 1,
      checkInTime: '',
      checkOutTime: '',
      servingDepartment: [''],
      subscriptionPlanType: '',
      totalStaff: 1,
      hotelLicenseCertifications: '',
      subscriptionPlanName: '',
      hotelLicenseImage: undefined,
      legalBusinessLicense: '',
      legalBusinessLicenseImage: undefined,
      touristLicense: '',
      touristLicenseImage: undefined,
      tanNumber: '',
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
      wifi: { wifiName: '', password: '', scanner: '' },
      about: ''
    }
  });

  const [selectedState, setSelectedState] = useState(
    form.getValues('state') || ''
  );

  // --------------------- IMAGE UPLOAD HELPERS ---------------------
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  const validateImage = (file?: File) => {
    if (!file) return 'No file selected';
    if (!file.type.startsWith('image/')) return 'Only image files are allowed.';
    if (file.size > MAX_IMAGE_SIZE) return 'File size exceeds 5MB.';
    return null;
  };

  const uploadToS3 = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file, file.name);
    const res = await apiCall('POST', 'api/upload/admin', fd);
    // If backend returns { url } directly, change the next line to: const url = res?.url;
    const url = res?.data?.url;
    if (!url) throw new Error('Upload failed: url missing');
    return url;
  };

  // single image (logo/license/pan/gdpr/etc.)
  const uploadSingleImage = async (
    file: File,
    fieldName: keyof typeof imagePreviews
  ) => {
    const err = validateImage(file);
    if (err) return ToastAtTopRight.fire(err, 'error');
    try {
      const url = await uploadToS3(file);
      setImagePreviews((prev) => ({ ...prev, [fieldName]: [url] }));
      ToastAtTopRight.fire('Image uploaded successfully', 'success');
    } catch (e) {
      console.error(e);
      ToastAtTopRight.fire('Failed to upload image', 'error');
    }
  };

  // multi images (rooms)
  const handleMultiImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof typeof imagePreviews // 'roomImage'
  ) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    const valids: File[] = [];
    for (const f of Array.from(files)) {
      const err = validateImage(f);
      if (err) {
        ToastAtTopRight.fire(err, 'error');
      } else {
        valids.push(f);
      }
    }
    if (!valids.length) return;

    try {
      const urls = await Promise.all(valids.map(uploadToS3));
      setImagePreviews((prev) => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...urls]
      }));
      // keep RHF array if you want (optional)
      if (fieldName === 'roomImage') {
        const existing = (form.getValues('roomImage') as string[]) || [];
        form.setValue('roomImage', [...existing, ...urls], {
          shouldDirty: true
        });
      }
      ToastAtTopRight.fire('Images uploaded successfully', 'success');
    } catch (err) {
      console.error(err);
      ToastAtTopRight.fire('Failed to upload images', 'error');
    } finally {
      e.currentTarget.value = '';
    }
  };

  const removeImageAt = (
    index: number,
    fieldName: keyof typeof imagePreviews
  ) => {
    setImagePreviews((prev) => {
      const next = [...prev[fieldName]];
      next.splice(index, 1);
      return { ...prev, [fieldName]: next };
    });
  };

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  const handleBrandedHotelChange = (checked: boolean) => {
    setIsBrandedHotelChecked(checked);
    if (checked) setIsChainHotelChecked(false);
  };
  const handleChainHotelChange = (checked: boolean) =>
    setIsChainHotelChecked(checked);

  // --------------------- FETCH EXISTING (pending/edit/view) ---------------------
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        let res;
        if (mode === 'pending') {
          res = await apiCall('GET', `api/hotel/pending-request/${hotelId}`);
        } else if (mode === 'edit' || mode === 'view') {
          res = await apiCall('GET', `api/hotel/get-hotel/${hotelId}`);
        } else {
          return;
        }
        const data = mode === 'pending' ? res?.request?.hotelData : res?.hotel;
        if (!data) {
          console.error('Hotel data not found:', res);
          return;
        }

        setSelectedState(data.state || '');
        setFetchedHotelData(data);

        // reset form fields
        form.reset({
          hotelId: data._id || '',
          name: data.name || '',
          number: data.phoneNo || '',
          email: data.email || '',
          address: data.address || '',
          hotelCategory: data.hotelCategory || '3 Star',
          servingDepartment: data?.servingDepartment || [],
          subscriptionPlanType: data.subscriptionPlanType || '',
          city: data.city || '',
          country: data.country || '',
          gstPercentage: data.gstPercentage ?? 18,
          state: data.state || '',
          pinCode: data.pincode || '',
          gst: '',
          subscriptionPlanName: data.subscriptionPlanName || '',
          brandedHotel: !!data.brandedHotel,
          chainHotel: data.chainHotel === 'true' || !!data.chainHotel,
          parentHotelId: data.parentHotel || data.parentHotelId || '',

          roomConfigs: (data.rooms || []).map((room: any) => ({
            roomType: room.roomType || 'Single',
            feature: room.features?.[0] || 'Sea Side'
          })) || [{ roomType: 'Single', feature: 'Sea Side' }],

          numberOfRooms: data?.numberOfRooms || 1,
          checkInTime: data.checkInTime || '',
          checkOutTime: data.checkOutTime || '',
          totalStaff: data.totalStaff || 1,

          hotelLicenseCertifications:
            data.hotelLicenseAndCertification?.certificateValue || '',
          hotelLicenseImage: undefined,

          legalBusinessLicense:
            data.legalAndBusinessLicense?.licenseValue || '',
          legalBusinessLicenseImage: undefined,

          touristLicense: data.touristLicense?.licenseValue || '',
          touristLicenseImage: undefined,

          tanNumber: data.panNumber?.numberValue || '',
          tanNumberImage: undefined,

          dataPrivacyGdprCompliances:
            data.dataPrivacyAndGDPRCompliance?.complianceValue || '',
          dataPrivacyGdprImage: undefined,

          logoImage: undefined,
          additionalImage: undefined,

          internetConnectivity: !!data.internetConnectivity,
          softwareCompatibility: !!data.softwareCompatibility,

          subscriptionPlan: data.subscriptionPlan || 'Premium',
          subscriptionPrice: data.subscriptionPrice || 0,
          netPrice: data.netPrice ?? data.subscriptionPrice ?? 0,
          couponCode: data.applyCoupon || 'Choose coupon',
          subscriptionStartDate: data.subscriptionStartDate
            ? data.subscriptionStartDate.split('T')[0]
            : '',
          subscriptionEndDate: data.subscriptionEndDate
            ? data.subscriptionEndDate.split('T')[0]
            : '',
          wifi: data?.wifi || { wifiName: '', password: '', scanner: '' },
          about: data.about || ''
        });

        // image previews from S3 URLs
        setImagePreviews({
          logoImage: data.logo ? [data.logo] : [],
          roomImage: Array.isArray(data.images) ? data.images : [],
          hotelLicenseImage: data.hotelLicenseAndCertification?.imageUrl
            ? [data.hotelLicenseAndCertification.imageUrl]
            : [],
          legalBusinessLicenseImage: data.legalAndBusinessLicense?.imageUrl
            ? [data.legalAndBusinessLicense.imageUrl]
            : [],
          touristLicenseImage: data.touristLicense?.imageUrl
            ? [data.touristLicense.imageUrl]
            : [],
          tanNumberImage: data.panNumber?.imageUrl
            ? [data.panNumber.imageUrl]
            : [],
          dataPrivacyGdprImage: data.dataPrivacyAndGDPRCompliance?.imageUrl
            ? [data.dataPrivacyAndGDPRCompliance.imageUrl]
            : [],
          additionalImage: data?.additionalImage ? [data.additionalImage] : []
        });
      } catch (error) {
        console.error('Failed to fetch hotel data', error);
      }
    };

    if (hotelId) fetchHotelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, hotelId]);
  const fmtDate = (value?: string | number | Date) => {
    if (value === undefined || value === null || value === '') return '-';
    let dt: Date;
    if (value instanceof Date) dt = value;
    else if (typeof value === 'number')
      dt = new Date(value > 1e12 ? value : value * 1000);
    else {
      const parsed = new Date(value);
      if (isNaN(parsed.getTime())) return String(value);
      dt = parsed;
    }
    return dt.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  // --------------------- SUBMIT (UPDATE) ---------------------
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roomConfigs'
  });

  const handleUpdate = async (data: HotelSchemaType) => {
    // transform roomConfigs -> rooms
    const roomsData = (data.roomConfigs || []).map((roomConfig: any) => ({
      roomName: roomConfig.roomType,
      roomType: roomConfig.roomType,
      features: [roomConfig.feature]
    }));

    // payload uses preview URLs (S3) so edit changes persist
    const updatedData = {
      ...data,
      rooms: roomsData,

      // images mapping expected by backend
      logo: imagePreviews.logoImage[0] || fetchedHotelData?.logo || '',
      images: imagePreviews.roomImage, // array
      additionalImage:
        imagePreviews.additionalImage[0] ||
        fetchedHotelData?.additionalImage ||
        '',

      hotelLicenseAndCertification: {
        certificateValue: data.hotelLicenseCertifications || '',
        imageUrl:
          imagePreviews.hotelLicenseImage[0] ||
          fetchedHotelData?.hotelLicenseAndCertification?.imageUrl ||
          ''
      },
      legalAndBusinessLicense: {
        licenseValue: data.legalBusinessLicense || '',
        imageUrl:
          imagePreviews.legalBusinessLicenseImage[0] ||
          fetchedHotelData?.legalAndBusinessLicense?.imageUrl ||
          ''
      },
      touristLicense: {
        licenseValue: data.touristLicense || '',
        imageUrl:
          imagePreviews.touristLicenseImage[0] ||
          fetchedHotelData?.touristLicense?.imageUrl ||
          ''
      },
      panNumber: {
        numberValue: data.tanNumber || '',
        imageUrl:
          imagePreviews.tanNumberImage[0] ||
          fetchedHotelData?.panNumber?.imageUrl ||
          ''
      },
      dataPrivacyAndGDPRCompliance: {
        complianceValue: data.dataPrivacyGdprCompliances || '',
        imageUrl:
          imagePreviews.dataPrivacyGdprImage[0] ||
          fetchedHotelData?.dataPrivacyAndGDPRCompliance?.imageUrl ||
          ''
      }
    };

    try {
      const response = await apiCall(
        'PUT',
        'api/hotel/update-profile',
        updatedData
      );
      if (response?.data || response?.status) {
        ToastAtTopRight.fire('Hotel updated successfully!', 'success');
      } else {
        ToastAtTopRight.fire('Failed to update hotel', 'error');
      }
    } catch (err) {
      console.error('Update Error:', err);
      ToastAtTopRight.fire('Something went wrong!', 'error');
    }
  };

  // --------------------- UI ---------------------
  const generateHourlyOptions = () => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const suffix = hour < 12 ? 'AM' : 'PM';
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      options.push(`${formattedHour}:00 ${suffix}`);
    }
    return options;
  };

  const approveRequest = async () => {
    if (!hotelId) {
      ToastAtTopRight.fire('Hotel request ID missing', 'error');
      return;
    }
    try {
      const payload = {
        requestId: hotelId,
        subscriptionPlan: form.getValues('subscriptionPlan'),
        subscriptionPrice: form.getValues('subscriptionPrice'),
        couponCode:
          form.getValues('couponCode') === 'Choose coupon'
            ? ''
            : form.getValues('couponCode')
      };
      const response = await apiCall(
        'POST',
        'api/hotel/approve-request',
        payload
      );
      if (response.status) {
        ToastAtTopRight.fire('Hotel approved successfully', 'success');
        router.push('/super-admin/hotel-management/pending');
      } else {
        ToastAtTopRight.fire(
          response.message || 'Failed to approve hotel',
          'error'
        );
      }
    } catch (error) {
      console.error(error);
      ToastAtTopRight.fire('Server error during approval', 'error');
    }
  };
  const mapSubscriptionApiToInvoice = (d: any): InvoiceExactProps => {
    const items = (d.charges ?? []).map((c: any) => ({
      description: c.description,
      rate: Number(c.rate) || 0,
      qty: Number(c.duration) || 1,
      total: Number(c.total) || 0
    }));

    // ✅ Consistent date-time formatter (used for ackDate, arrival, departure, createdAt, etc.)
    // const fmtDateTime = (value?: string | number | Date) => {
    //   if (value === undefined || value === null || value === '') return '-';

    //   // Normalize to Date (supports ISO string, epoch (ms/sec), or Date)
    //   let dt: Date;
    //   if (value instanceof Date) {
    //     dt = value;
    //   } else if (typeof value === 'number') {
    //     // Handle seconds vs milliseconds
    //     dt = new Date(value > 1e12 ? value : value * 1000);
    //   } else {
    //     const parsed = new Date(value);
    //     if (isNaN(parsed.getTime())) return String(value);
    //     dt = parsed;
    //   }

    //   // Format like "08 Oct 2025, 02:15 PM" (India time)
    //   return dt.toLocaleString('en-IN', {
    //     timeZone: 'Asia/Kolkata',
    //     day: '2-digit',
    //     month: 'short',
    //     year: 'numeric',
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     hour12: true
    //   });
    // };
    const handleInvoicePdf = async () => {
      try {
        const current = invoiceProps ?? (await fetchInvoice());
        // wait a frame for the hidden component to render with data
        await new Promise((r) => requestAnimationFrame(() => r(null)));

        const [{ default: html2canvas }, { default: jsPDF }] =
          await Promise.all([import('html2canvas'), import('jspdf')]);

        const el = invoiceRef.current;
        if (!el) return;

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: el.scrollWidth,
          windowHeight: el.scrollHeight
        });

        const img = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');

        const pageW = pdf.internal.pageSize.getWidth(); // 595.28pt
        const pageH = pdf.internal.pageSize.getHeight(); // 841.89pt
        const margin = 24; // pt
        const usableW = pageW - margin * 2;

        const imgW = usableW;
        const imgH = (canvas.height * imgW) / canvas.width;

        // Multi-page clip
        let remaining = imgH;
        let shift = 0;
        while (remaining > 0) {
          pdf.addImage(
            img,
            'PNG',
            margin,
            margin - shift,
            imgW,
            imgH,
            undefined,
            'FAST'
          );
          remaining -= pageH - margin * 2;
          if (remaining > 0) {
            pdf.addPage();
            shift += pageH - margin * 2;
          }
        }

        pdf.save(
          `${current.invoiceNo || 'Invoice'}_${new Date().toISOString().slice(0, 10)}.pdf`
        );
      } catch (e) {
        console.error(e);
      }
    };
    return {
      // Ack / invoice
      acknowledgementNumber: d.acknowledgementNumber || '-',
      ackDate: fmtDate(d.acknowledgementDate),
      irnNo: d.irn || '-',
      invoiceNo: d.invoiceNo || 'INV',

      // FROM API for the “Hotel Name / Address & Details” section
      hotelName: d.hotelName || '-',
      hotelAddress: d.hotelAddress || '-',
      hotelPhone: d.hotelPhone || '—',
      hotelEmail: d.hotelEmail || '—',
      gstin: d.hotelGST || '—',
      pan: d.hotelPAN || '—',

      // other dynamic fields
      bookingThrough: d.couponCode || '-',
      mobile: d.hotelPhone || '—',
      arrival: fmtDate(d.subsctiptionStart),
      departure: fmtDate(d.subscriptionEnd),

      items,
      sgst: Number(d.sgstAmount) || 0,
      cgst: Number(d.cgstAmount) || 0,
      total: Number(d.grandTotal) || 0,
      amountWords: d.inWords || '-'
    };
  };

  const fetchInvoice = useCallback(async () => {
    const res = await apiCall(
      'GET',
      `/api/invoice/subscription/${INVOICE_ID}`,
      {}
    );
    if (!res?.success || !res?.data)
      throw new Error('Failed to fetch invoice.');
    const mapped = mapSubscriptionApiToInvoice(res.data);
    setInvoiceProps(mapped);
    return mapped;
  }, []);
  const handleInvoicePdf = async () => {
    try {
      const current = invoiceProps ?? (await fetchInvoice());
      // wait a frame for the hidden component to render with data
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      const el = invoiceRef.current;
      if (!el) return;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight
      });

      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');

      const pageW = pdf.internal.pageSize.getWidth(); // 595.28pt
      const pageH = pdf.internal.pageSize.getHeight(); // 841.89pt
      const margin = 24; // pt
      const usableW = pageW - margin * 2;

      const imgW = usableW;
      const imgH = (canvas.height * imgW) / canvas.width;

      // Multi-page clip
      let remaining = imgH;
      let shift = 0;
      while (remaining > 0) {
        pdf.addImage(
          img,
          'PNG',
          margin,
          margin - shift,
          imgW,
          imgH,
          undefined,
          'FAST'
        );
        remaining -= pageH - margin * 2;
        if (remaining > 0) {
          pdf.addPage();
          shift += pageH - margin * 2;
        }
      }

      pdf.save(
        `${current.invoiceNo || 'Invoice'}_${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <FormWrapper title="">
      <div
        aria-hidden
        className="fixed -left-[99999px] -top-[99999px] pointer-events-none select-none"
      >
        {invoiceProps && (
          <InvoiceExactA4
            ref={invoiceRef}
            {...invoiceProps}
            logoSrc="/Frame.svg"
          />
        )}
      </div>
      {/* <DropdownMenuItem
        onClick={async () => {
          if (!invoiceProps) await fetchInvoice();
          handleInvoicePdf();
        }}
      >
        <Download className="mr-2 h-4 w-4" />
        Download Invoice (PDF)
        <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
      </DropdownMenuItem> */}
      <div className="flex justify-end">
        <Button
          onClick={async () => {
            if (!invoiceProps) await fetchInvoice();
            handleInvoicePdf();
          }}
          className="btn-primary text-xs 2xl:text-sm"
          // className="flex items-center gap-2 p-2 bg-coffee text-white rounded-md hover:bg-coffee/90 transition-all duration-200"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Invoice (PDF)
          {/* <span className="ml-2 text-xs">⇧⌘D</span>{' '} */}
          {/* Optional shortcut text */}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdate)}
          className="w-full flex flex-col gap-3 bg-inherit mx-auto"
        >
          {mode !== 'pending' && (
            <div className="flex gap-4">
              {/* Room Image Uploader (multi) */}
              <div>
                <FormField
                  control={form.control}
                  name="roomImage"
                  render={() => (
                    <FormItem className="w-fit relative">
                      <FormLabel className="text-coffee font-medium">
                        Room Image
                      </FormLabel>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
                            isDisabled
                              ? 'cursor-not-allowed opacity-50'
                              : 'cursor-pointer'
                          } rounded-md border border-gray-100`}
                          onClick={() =>
                            !isDisabled && triggerFileInput(roomImageRef)
                          }
                        >
                          {imagePreviews.roomImage?.length ? (
                            <img
                              src={
                                imagePreviews.roomImage[
                                  imagePreviews.roomImage.length - 1
                                ]
                              }
                              alt="Room Preview"
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
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <Upload
                          className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
                            imagePreviews.roomImage && !isDisabled
                              ? 'text-black cursor-pointer'
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() =>
                            imagePreviews.roomImage &&
                            !isDisabled &&
                            triggerFileInput(roomImageRef)
                          }
                        />
                      </div>
                      <FormMessage className="text-[10px]" />
                      {/* Thumbs */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        {imagePreviews.roomImage?.map((image, index) => (
                          <div
                            key={image + index}
                            className="relative w-24 h-24 2xl:w-28 2xl:h-28"
                          >
                            <img
                              src={image}
                              alt={`Room ${index + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                              onClick={() => removeImageAt(index, 'roomImage')}
                              disabled={isDisabled}
                              title="Remove"
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Logo Uploader (single) */}
              <FormField
                control={form.control}
                name="logoImage"
                render={() => (
                  <FormItem className="w-fit relative">
                    <FormLabel className="text-coffee font-medium">
                      Hotel Image
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
                          isDisabled
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        } rounded-md border border-gray-100`}
                        onClick={() =>
                          !isDisabled && triggerFileInput(logoImageRef)
                        }
                      >
                        {imagePreviews.logoImage?.length ? (
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
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) await uploadSingleImage(f, 'logoImage');
                            e.currentTarget.value = '';
                          }}
                          className="hidden"
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <Upload
                        className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
                          imagePreviews.logoImage && !isDisabled
                            ? 'text-black cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() =>
                          imagePreviews.logoImage &&
                          !isDisabled &&
                          triggerFileInput(logoImageRef)
                        }
                      />
                    </div>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="w-full flex flex-col gap-6">
            {/* Chunk 1: Basic Hotel Info */}
            <div className="flex flex-col gap-4 2xl:gap-5 bg-[#FAF6EF] shadow-custom p-6 2xl:p-8 rounded-lg">
              <div className="flex justify-end">
                {mode === 'pending' ? (
                  <div className="w-fit mb-4 cursor-pointer">
                    <DropdownMenu.Root
                      open={showDropdown}
                      onOpenChange={setShowDropdown}
                    >
                      <DropdownMenu.Trigger asChild className="w-full">
                        <button
                          className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                            status === 'PENDING'
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
                      <DropdownMenu.Content className="bg-white rounded w-32 shadow-lg space-y-1 mt-1">
                        <DropdownMenu.Item
                          onSelect={() => setStatus('APPROVE')}
                          className="text-sm px-4 pt-1 hover:bg-gray-100 rounded"
                        >
                          <Button type="button" onClick={approveRequest}>
                            Approve
                          </Button>
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </div>
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
                          disabled={true}
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
                          disabled={true}
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
                          disabled={true}
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
                          disabled={true}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
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
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={true}
                        >
                          <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm">
                            <SelectValue placeholder="Select category" />
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
                        <Input
                          {...field}
                          disabled={true}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
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
                          disabled={true}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
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
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={true}
                        >
                          <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm">
                            <SelectValue placeholder="Select country" />
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
                          disabled={true}
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

              {mode === 'add' && (
                <div className="flex flex-col md:flex-row gap-5 w-fit">
                  <FormField
                    control={form.control}
                    name="brandedHotel"
                    render={() => (
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
                    render={() => (
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
              )}

              {isChainHotelChecked && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                </div>
              )}
            </div>

            {/* Chunk 2: Room Details */}
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
                              placeholder="Enter Room Type"
                              value={field.value || ''}
                              onChange={field.onChange}
                              disabled={isDisabled}
                              className="w-40 bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    {/* <FormField
                      control={form.control}
                      name={`roomConfigs.${index}.feature`}
                      render={({ field }) => (
                        <FormItem className="w-40">
                          <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                            Select Features <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Feature"
                              value={field.value || ''}
                              onChange={field.onChange}
                              disabled={isDisabled}
                              className="w-40 bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    /> */}
                    <FormField
                      control={form.control}
                      name={`roomConfigs.${index}.features`} // ✅ array field
                      render={({ field }) => {
                        const features: string[] = Array.isArray(field.value)
                          ? field.value
                          : [];
                        const [pending, setPending] = React.useState('');

                        const add = () => {
                          const v = pending.trim();
                          if (!v) return;
                          const next = Array.from(
                            new Set([...(features || []), v])
                          );
                          field.onChange(next);
                          setPending('');
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
                            add();
                          }
                        };

                        return (
                          <FormItem className="w-72">
                            <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                              Add Features{' '}
                              <span className="text-red-500">*</span>
                            </FormLabel>

                            {/* chips */}
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

                            {/* input + add */}
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                value={pending}
                                onChange={(e) => setPending(e.target.value)}
                                onKeyDown={onKeyDown}
                                disabled={isDisabled}
                                placeholder="Type & press Enter"
                                className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md text-xs 2xl:text-sm"
                              />
                              <Button
                                type="button"
                                onClick={add}
                                disabled={isDisabled || !pending.trim()}
                                className="text-xs 2xl:text-sm"
                                variant="secondary"
                              >
                                Add
                              </Button>
                            </div>
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        );
                      }}
                    />
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
                <button
                  type="button"
                  // onClick={() => !isDisabled && append({ roomType: 'Single', feature: 'Sea Side' })}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="servingDepartment"
                  render={({ field }) => {
                    const selectedDepartments = field.value || [];
                    const toggleOption = (option: string) => {
                      const newValue = selectedDepartments.includes(option)
                        ? selectedDepartments.filter(
                            (v: string) => v !== option
                          )
                        : [...selectedDepartments, option];
                      field.onChange(newValue);
                    };
                    return (
                      <FormItem>
                        <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                          Serving Departments
                        </FormLabel>
                        <div className="flex flex-wrap gap-3 text-sm">
                          {servingDepartmentOptions.map(({ label, value }) => (
                            <label
                              key={value}
                              className="inline-flex text-gray-700 items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={selectedDepartments.includes(value)}
                                onChange={() => toggleOption(value)}
                                disabled={isDisabled}
                              />
                              <span>{label}</span>
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
                          min="1"
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
                          min="1"
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
                          disabled={isDisabled}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm relative pr-8">
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
                <FormField
                  control={form.control}
                  name="subscriptionPlanName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Subscription Plan
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Basic / Premium"
                          {...field}
                          disabled={true}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="netPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Net Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 1500"
                          {...field}
                          disabled={true}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Subscription Price{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Auto-filled from plan"
                          {...field}
                          disabled={true}
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
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        GST Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter GST Number"
                          {...field}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionStartDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Subscription Start Date{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ''}
                          disabled={true}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionEndDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Subscription End Date{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ''}
                          disabled={true}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionEndDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Next Payment Date{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ''}
                          disabled={true}
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriptionPlanType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Subscription Plan Type
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Chunk 3: Licenses and Certifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-5 bg-[#FAF6EF] shadow-custom p-6 2xl:p-8 rounded-lg">
              <FormField
                control={form.control}
                name="hotelLicenseCertifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Hotel License & Certifications
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
              <FormField
                control={form.control}
                name="hotelLicenseImage"
                render={() => (
                  <FormItem className="w-fit relative">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Hotel License Image
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
                          isDisabled
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        } rounded-md border border-gray-100`}
                        onClick={() =>
                          !isDisabled && triggerFileInput(hotelLicenseImageRef)
                        }
                      >
                        {imagePreviews.hotelLicenseImage?.length ? (
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
                          disabled={isDisabled}
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f)
                              await uploadSingleImage(f, 'hotelLicenseImage');
                            e.currentTarget.value = '';
                          }}
                          className="hidden"
                        />
                      </FormControl>
                      <Upload
                        className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
                          imagePreviews.hotelLicenseImage && !isDisabled
                            ? 'text-black cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() =>
                          imagePreviews.hotelLicenseImage &&
                          !isDisabled &&
                          triggerFileInput(hotelLicenseImageRef)
                        }
                      />
                    </div>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="legalBusinessLicense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Legal and Business License
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
              <FormField
                control={form.control}
                name="legalBusinessLicenseImage"
                render={() => (
                  <FormItem className="w-fit relative">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Business License Image
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
                          isDisabled
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        } rounded-md border border-gray-100`}
                        onClick={() =>
                          !isDisabled &&
                          triggerFileInput(legalBusinessLicenseImageRef)
                        }
                      >
                        {imagePreviews.legalBusinessLicenseImage?.length ? (
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
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f)
                              await uploadSingleImage(
                                f,
                                'legalBusinessLicenseImage'
                              );
                            e.currentTarget.value = '';
                          }}
                          className="hidden"
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <Upload
                        className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
                          imagePreviews.legalBusinessLicenseImage && !isDisabled
                            ? 'text-black cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() =>
                          imagePreviews.legalBusinessLicenseImage &&
                          !isDisabled &&
                          triggerFileInput(legalBusinessLicenseImageRef)
                        }
                      />
                    </div>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

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
              <FormField
                control={form.control}
                name="touristLicenseImage"
                render={() => (
                  <FormItem className="w-fit relative">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Tourist License Image
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
                          isDisabled
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        } rounded-md border border-gray-100`}
                        onClick={() =>
                          !isDisabled &&
                          triggerFileInput(touristLicenseImageRef)
                        }
                      >
                        {imagePreviews.touristLicenseImage?.length ? (
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
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f)
                              await uploadSingleImage(f, 'touristLicenseImage');
                            e.currentTarget.value = '';
                          }}
                          className="hidden"
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <Upload
                        className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
                          imagePreviews.touristLicenseImage && !isDisabled
                            ? 'text-black cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() =>
                          imagePreviews.touristLicenseImage &&
                          !isDisabled &&
                          triggerFileInput(touristLicenseImageRef)
                        }
                      />
                    </div>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

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
                render={() => (
                  <FormItem className="w-fit relative">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      TAN Number Image
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
                          isDisabled
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        } rounded-md border border-gray-100`}
                        onClick={() =>
                          !isDisabled && triggerFileInput(tanNumberImageRef)
                        }
                      >
                        {imagePreviews.tanNumberImage?.length ? (
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
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) await uploadSingleImage(f, 'tanNumberImage');
                            e.currentTarget.value = '';
                          }}
                          className="hidden"
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <Upload
                        className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
                          imagePreviews.tanNumberImage && !isDisabled
                            ? 'text-black cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() =>
                          imagePreviews.tanNumberImage &&
                          !isDisabled &&
                          triggerFileInput(tanNumberImageRef)
                        }
                      />
                    </div>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataPrivacyGdprCompliances"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Data Privacy & GDPR Compliances
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
              <FormField
                control={form.control}
                name="dataPrivacyGdprImage"
                render={() => (
                  <FormItem className="w-fit relative">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      GDPR Compliance Image
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
                          isDisabled
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        } rounded-md border border-gray-100`}
                        onClick={() =>
                          !isDisabled &&
                          triggerFileInput(dataPrivacyGdprImageRef)
                        }
                      >
                        {imagePreviews.dataPrivacyGdprImage?.length ? (
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
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f)
                              await uploadSingleImage(
                                f,
                                'dataPrivacyGdprImage'
                              );
                            e.currentTarget.value = '';
                          }}
                          className="hidden"
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <Upload
                        className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
                          imagePreviews.dataPrivacyGdprImage && !isDisabled
                            ? 'text-black cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() =>
                          imagePreviews.dataPrivacyGdprImage &&
                          !isDisabled &&
                          triggerFileInput(dataPrivacyGdprImageRef)
                        }
                      />
                    </div>
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
            {mode === 'edit' && (
              <Button
                type="submit"
                disabled={isDisabled}
                className="btn-primary text-xs 2xl:text-sm"
              >
                Update Profile
              </Button>
            )}
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
};

export default HotelFormProfile;
// 'use client';
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// // import { hotelSchema, HotelSchemaType } from 'schema';
// import {
//   ChevronDown,
//   ChevronUp,
//   Upload,
//   Plus,
//   Trash2,
//   Download
// } from 'lucide-react';
// import { CiCamera } from 'react-icons/ci';
// import { useFieldArray } from 'react-hook-form';

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
// import FormWrapper from './form-wrapper';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import { ToastAtTopRight } from '@/lib/sweetalert';
// import apiCall from '@/lib/axios';
// import { HotelSchemaType } from 'schema';
// import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

// // 🔽 Add your invoice component + types
// import InvoiceExactA4, { InvoiceExactProps } from 'app/(protected)/invoice';

// const HotelFormProfile = ({
//   mode = 'add',
//   hotelId
// }: {
//   mode: 'add' | 'edit' | 'view' | 'pending';
//   hotelId?: string;
// }) => {
//   const isMode = (modes: string | string[]) => {
//     if (Array.isArray(modes)) return modes.includes(mode);
//     return mode === modes;
//   };
//   const isDisabled = mode === 'view' || mode === 'pending';
//   const router = useRouter();
//   const [isBrandedHotelChecked, setIsBrandedHotelChecked] = useState(false);
//   const [isChainHotelChecked, setIsChainHotelChecked] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [status, setStatus] = useState<'PENDING' | 'APPROVE'>('PENDING');
//   const [hotelName, setHotelName] = useState('');
//   const [fetchedHotelData, setFetchedHotelData] = useState<any>(null);

//   // File input refs
//   const roomImageRef = useRef<HTMLInputElement>(null);
//   const hotelLicenseImageRef = useRef<HTMLInputElement>(null);
//   const legalBusinessLicenseImageRef = useRef<HTMLInputElement>(null);
//   const touristLicenseImageRef = useRef<HTMLInputElement>(null);
//   const tanNumberImageRef = useRef<HTMLInputElement>(null);
//   const dataPrivacyGdprImageRef = useRef<HTMLInputElement>(null);
//   const logoImageRef = useRef<HTMLInputElement>(null);
//   const additionalImageRef = useRef<HTMLInputElement>(null);

//   const servingDepartmentOptions = [
//     { label: 'Reception', value: 'reception' },
//     { label: 'Housekeeping', value: 'housekeeping' },
//     { label: 'In-Room Dining', value: 'inroomdining' },
//     { label: 'Gym / Community / Conference Hall', value: 'gym' },
//     { label: 'Spa', value: 'spa' },
//     { label: 'Swimming Pool', value: 'swimmingpool' },
//     { label: 'Concierge Service', value: 'conciergeservice' },
//     { label: 'In-Room Control', value: 'in_room_control' },
//     { label: 'Order Management', value: 'ordermanagement' },
//     { label: 'Sos Management', value: 'sos' },
//     { label: 'Chat With Staff', value: 'chat' }
//   ];

//   const handleStateChange = (state: string) => {
//     form.setValue('state', state);
//     setSelectedState(state);
//     form.setValue('city', '');
//   };

//   // ---------- Image previews (arrays, even singles use index 0)
//   const [imagePreviews, setImagePreviews] = useState<Record<string, string[]>>({
//     logoImage: [],
//     additionalImage: [],
//     roomImage: [],
//     hotelLicenseImage: [],
//     legalBusinessLicenseImage: [],
//     touristLicenseImage: [],
//     tanNumberImage: [],
//     dataPrivacyGdprImage: []
//   });

//   const form = useForm<HotelSchemaType>({
//     defaultValues: {
//       name: '',
//       number: '',
//       email: '',
//       address: '',
//       hotelCategory: '5 Star',
//       city: '',
//       country: 'India',
//       gstPercentage: 18,
//       state: 'Maharashtra',
//       pinCode: '',
//       parentHotelId: '',
//       roomImage: undefined,
//       // roomConfigs: [{ roomType: 'Single', feature: 'Sea Side' }],
//       roomConfigs: [{ roomType: 'Single', features: ['Sea Side'] }],
//       numberOfRooms: 1,
//       checkInTime: '',
//       checkOutTime: '',
//       servingDepartment: [''],
//       subscriptionPlanType: '',
//       totalStaff: 1,
//       hotelLicenseCertifications: '',
//       subscriptionPlanName: '',
//       hotelLicenseImage: undefined,
//       legalBusinessLicense: '',
//       legalBusinessLicenseImage: undefined,
//       touristLicense: '',
//       touristLicenseImage: undefined,
//       tanNumber: '',
//       tanNumberImage: undefined,
//       dataPrivacyGdprCompliances: '',
//       dataPrivacyGdprImage: undefined,
//       internetConnectivity: false,
//       softwareCompatibility: false,
//       subscriptionPlan: { _id: '', planName: '', cost: 0, planType: '' },
//       subscriptionPrice: 0,
//       netPrice: 0,
//       couponCode: 'Choose coupon',
//       subscriptionStartDate: '',
//       subscriptionEndDate: '',
//       wifi: { wifiName: '', password: '', scanner: '' },
//       about: ''
//     }
//   });

//   const [selectedState, setSelectedState] = useState(
//     form.getValues('state') || ''
//   );

//   // --------------------- IMAGE UPLOAD HELPERS ---------------------
//   const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

//   const validateImage = (file?: File) => {
//     if (!file) return 'No file selected';
//     if (!file.type.startsWith('image/')) return 'Only image files are allowed.';
//     if (file.size > MAX_IMAGE_SIZE) return 'File size exceeds 5MB.';
//     return null;
//   };

//   const uploadToS3 = async (file: File) => {
//     const fd = new FormData();
//     fd.append('file', file, file.name);
//     const res = await apiCall('POST', 'api/upload/admin', fd);
//     // If backend returns { url } directly, change the next line to: const url = res?.url;
//     const url = res?.data?.url;
//     if (!url) throw new Error('Upload failed: url missing');
//     return url;
//   };

//   // single image (logo/license/pan/gdpr/etc.)
//   const uploadSingleImage = async (
//     file: File,
//     fieldName: keyof typeof imagePreviews
//   ) => {
//     const err = validateImage(file);
//     if (err) return ToastAtTopRight.fire(err, 'error');
//     try {
//       const url = await uploadToS3(file);
//       setImagePreviews((prev) => ({ ...prev, [fieldName]: [url] }));
//       ToastAtTopRight.fire('Image uploaded successfully', 'success');
//     } catch (e) {
//       console.error(e);
//       ToastAtTopRight.fire('Failed to upload image', 'error');
//     }
//   };

//   // multi images (rooms)
//   const handleMultiImageUpload = async (
//     e: React.ChangeEvent<HTMLInputElement>,
//     fieldName: keyof typeof imagePreviews // 'roomImage'
//   ) => {
//     const files = e.target.files;
//     if (!files || !files.length) return;

//     const valids: File[] = [];
//     for (const f of Array.from(files)) {
//       const err = validateImage(f);
//       if (err) {
//         ToastAtTopRight.fire(err, 'error');
//       } else {
//         valids.push(f);
//       }
//     }
//     if (!valids.length) return;

//     try {
//       const urls = await Promise.all(valids.map(uploadToS3));
//       setImagePreviews((prev) => ({
//         ...prev,
//         [fieldName]: [...prev[fieldName], ...urls]
//       }));
//       // keep RHF array if you want (optional)
//       if (fieldName === 'roomImage') {
//         const existing = (form.getValues('roomImage') as string[]) || [];
//         form.setValue('roomImage', [...existing, ...urls], {
//           shouldDirty: true
//         });
//       }
//       ToastAtTopRight.fire('Images uploaded successfully', 'success');
//     } catch (err) {
//       console.error(err);
//       ToastAtTopRight.fire('Failed to upload images', 'error');
//     } finally {
//       e.currentTarget.value = '';
//     }
//   };

//   const removeImageAt = (
//     index: number,
//     fieldName: keyof typeof imagePreviews
//   ) => {
//     setImagePreviews((prev) => {
//       const next = [...prev[fieldName]];
//       next.splice(index, 1);
//       return { ...prev, [fieldName]: next };
//     });
//   };

//   const triggerFileInput = (ref: React.RefObject<HTMLInputElement | null>) => {
//     ref.current?.click();
//   };

//   const handleBrandedHotelChange = (checked: boolean) => {
//     setIsBrandedHotelChecked(checked);
//     if (checked) setIsChainHotelChecked(false);
//   };
//   const handleChainHotelChange = (checked: boolean) =>
//     setIsChainHotelChecked(checked);

//   // --------------------- FETCH EXISTING (pending/edit/view) ---------------------
//   useEffect(() => {
//     const fetchHotelData = async () => {
//       try {
//         let res;
//         if (mode === 'pending') {
//           res = await apiCall('GET', `api/hotel/pending-request/${hotelId}`);
//         } else if (mode === 'edit' || mode === 'view') {
//           res = await apiCall('GET', `api/hotel/get-hotel/${hotelId}`);
//         } else {
//           return;
//         }
//         const data = mode === 'pending' ? res?.request?.hotelData : res?.hotel;
//         if (!data) {
//           console.error('Hotel data not found:', res);
//           return;
//         }

//         setSelectedState(data.state || '');
//         setFetchedHotelData(data);

//         // reset form fields
//         form.reset({
//           hotelId: data._id || '',
//           name: data.name || '',
//           number: data.phoneNo || '',
//           email: data.email || '',
//           address: data.address || '',
//           hotelCategory: data.hotelCategory || '3 Star',
//           servingDepartment: data?.servingDepartment || [],
//           subscriptionPlanType: data.subscriptionPlanType || '',
//           city: data.city || '',
//           country: data.country || '',
//           gstPercentage: data.gstPercentage ?? 18,
//           state: data.state || '',
//           pinCode: data.pincode || '',
//           gst: '',
//           subscriptionPlanName: data.subscriptionPlanName || '',
//           brandedHotel: !!data.brandedHotel,
//           chainHotel: data.chainHotel === 'true' || !!data.chainHotel,
//           parentHotelId: data.parentHotel || data.parentHotelId || '',

//           roomConfigs: (data.rooms || []).map((room: any) => ({
//             roomType: room.roomType || 'Single',
//             feature: room.features?.[0] || 'Sea Side'
//           })) || [{ roomType: 'Single', feature: 'Sea Side' }],

//           numberOfRooms: data?.numberOfRooms || 1,
//           checkInTime: data.checkInTime || '',
//           checkOutTime: data.checkOutTime || '',
//           totalStaff: data.totalStaff || 1,

//           hotelLicenseCertifications:
//             data.hotelLicenseAndCertification?.certificateValue || '',
//           hotelLicenseImage: undefined,

//           legalBusinessLicense:
//             data.legalAndBusinessLicense?.licenseValue || '',
//           legalBusinessLicenseImage: undefined,

//           touristLicense: data.touristLicense?.licenseValue || '',
//           touristLicenseImage: undefined,

//           tanNumber: data.panNumber?.numberValue || '',
//           tanNumberImage: undefined,

//           dataPrivacyGdprCompliances:
//             data.dataPrivacyAndGDPRCompliance?.complianceValue || '',
//           dataPrivacyGdprImage: undefined,

//           logoImage: undefined,
//           additionalImage: undefined,

//           internetConnectivity: !!data.internetConnectivity,
//           softwareCompatibility: !!data.softwareCompatibility,

//           subscriptionPlan: data.subscriptionPlan || 'Premium',
//           subscriptionPrice: data.subscriptionPrice || 0,
//           netPrice: data.netPrice ?? data.subscriptionPrice ?? 0,
//           couponCode: data.applyCoupon || 'Choose coupon',
//           subscriptionStartDate: data.subscriptionStartDate
//             ? data.subscriptionStartDate.split('T')[0]
//             : '',
//           subscriptionEndDate: data.subscriptionEndDate
//             ? data.subscriptionEndDate.split('T')[0]
//             : '',
//           wifi: data?.wifi || { wifiName: '', password: '', scanner: '' },
//           about: data.about || ''
//         });

//         // image previews from S3 URLs
//         setImagePreviews({
//           logoImage: data.logo ? [data.logo] : [],
//           roomImage: Array.isArray(data.images) ? data.images : [],
//           hotelLicenseImage: data.hotelLicenseAndCertification?.imageUrl
//             ? [data.hotelLicenseAndCertification.imageUrl]
//             : [],
//           legalBusinessLicenseImage: data.legalAndBusinessLicense?.imageUrl
//             ? [data.legalAndBusinessLicense.imageUrl]
//             : [],
//           touristLicenseImage: data.touristLicense?.imageUrl
//             ? [data.touristLicense.imageUrl]
//             : [],
//           tanNumberImage: data.panNumber?.imageUrl
//             ? [data.panNumber.imageUrl]
//             : [],
//           dataPrivacyGdprImage: data.dataPrivacyAndGDPRCompliance?.imageUrl
//             ? [data.dataPrivacyAndGDPRCompliance.imageUrl]
//             : [],
//           additionalImage: data?.additionalImage ? [data.additionalImage] : []
//         });
//       } catch (error) {
//         console.error('Failed to fetch hotel data', error);
//       }
//     };

//     if (hotelId) fetchHotelData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [mode, hotelId]);

//   // --------------------- SUBMIT (UPDATE) ---------------------
//   const { control } = form;
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: 'roomConfigs'
//   });

//   const handleUpdate = async (data: HotelSchemaType) => {
//     // transform roomConfigs -> rooms
//     const roomsData = (data.roomConfigs || []).map((roomConfig: any) => ({
//       roomName: roomConfig.roomType,
//       roomType: roomConfig.roomType,
//       features: [roomConfig.feature]
//     }));

//     // payload uses preview URLs (S3) so edit changes persist
//     const updatedData = {
//       ...data,
//       rooms: roomsData,

//       // images mapping expected by backend
//       logo: imagePreviews.logoImage[0] || fetchedHotelData?.logo || '',
//       images: imagePreviews.roomImage, // array
//       additionalImage:
//         imagePreviews.additionalImage[0] ||
//         fetchedHotelData?.additionalImage ||
//         '',

//       hotelLicenseAndCertification: {
//         certificateValue: data.hotelLicenseCertifications || '',
//         imageUrl:
//           imagePreviews.hotelLicenseImage[0] ||
//           fetchedHotelData?.hotelLicenseAndCertification?.imageUrl ||
//           ''
//       },
//       legalAndBusinessLicense: {
//         licenseValue: data.legalBusinessLicense || '',
//         imageUrl:
//           imagePreviews.legalBusinessLicenseImage[0] ||
//           fetchedHotelData?.legalAndBusinessLicense?.imageUrl ||
//           ''
//       },
//       touristLicense: {
//         licenseValue: data.touristLicense || '',
//         imageUrl:
//           imagePreviews.touristLicenseImage[0] ||
//           fetchedHotelData?.touristLicense?.imageUrl ||
//           ''
//       },
//       panNumber: {
//         numberValue: data.tanNumber || '',
//         imageUrl:
//           imagePreviews.tanNumberImage[0] ||
//           fetchedHotelData?.panNumber?.imageUrl ||
//           ''
//       },
//       dataPrivacyAndGDPRCompliance: {
//         complianceValue: data.dataPrivacyGdprCompliances || '',
//         imageUrl:
//           imagePreviews.dataPrivacyGdprImage[0] ||
//           fetchedHotelData?.dataPrivacyAndGDPRCompliance?.imageUrl ||
//           ''
//       }
//     };

//     try {
//       const response = await apiCall(
//         'PUT',
//         'api/hotel/update-profile',
//         updatedData
//       );
//       if (response?.data || response?.status) {
//         ToastAtTopRight.fire('Hotel updated successfully!', 'success');
//       } else {
//         ToastAtTopRight.fire('Failed to update hotel', 'error');
//       }
//     } catch (err) {
//       console.error('Update Error:', err);
//       ToastAtTopRight.fire('Something went wrong!', 'error');
//     }
//   };

//   // --------------------- INVOICE: API mapping + fallback-from-form + PDF ---------------------
//   // ref & state to render hidden invoice for capture
//   const invoiceRef = useRef<HTMLDivElement>(null);
//   const [invoiceProps, setInvoiceProps] = useState<InvoiceExactProps | null>(
//     null
//   );
//   const DEFAULT_INVOICE_ID = '68c8fba6e1c648fdbb63d281';

//   const fmtDateTime = (value?: string | number | Date) => {
//     if (value === undefined || value === null || value === '') return '-';
//     let dt: Date;
//     if (value instanceof Date) dt = value;
//     else if (typeof value === 'number')
//       dt = new Date(value > 1e12 ? value : value * 1000);
//     else {
//       const parsed = new Date(value);
//       if (isNaN(parsed.getTime())) return String(value);
//       dt = parsed;
//     }
//     return dt.toLocaleString('en-IN', {
//       timeZone: 'Asia/Kolkata',
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   // Map backend subscription invoice → InvoiceExactProps (same as Navbar style)
//   const mapSubscriptionApiToInvoice = (d: any): InvoiceExactProps => {
//     const items = (d.charges ?? []).map((c: any) => ({
//       description: c.description,
//       rate: Number(c.rate) || 0,
//       qty: Number(c.duration) || 1,
//       total: Number(c.total) || 0
//     }));

//     return {
//       acknowledgementNumber: d.acknowledgementNumber || '-',
//       ackDate: fmtDateTime(d.acknowledgementDate),
//       irnNo: d.irn || '-',
//       invoiceNo: d.invoiceNo || 'INV',

//       hotelName: d.hotelName || '-',
//       hotelAddress: d.hotelAddress || '-',
//       hotelPhone: d.hotelPhone || '—',
//       hotelEmail: d.hotelEmail || '—',
//       gstin: d.hotelGST || '—',
//       pan: d.hotelPAN || '—',

//       bookingThrough: d.couponCode || '-',
//       mobile: d.hotelPhone || '—',
//       arrival: fmtDateTime(d.subsctiptionStart),
//       departure: fmtDateTime(d.subscriptionEnd),

//       items,
//       sgst: Number(d.sgstAmount) || 0,
//       cgst: Number(d.cgstAmount) || 0,
//       total: Number(d.grandTotal) || 0,
//       amountWords: d.inWords || '-',
//       logoSrc: '/Frame.svg',
//       autoScaleToA4: true
//     };
//   };

//   // Build invoice from current form as fallback if API is missing
//   const buildInvoiceFromForm = (): InvoiceExactProps => {
//     const subscriptionPrice = Number(
//       form.getValues('subscriptionPrice') ||
//         fetchedHotelData?.subscriptionPrice ||
//         0
//     );
//     const gstPct = Number(form.getValues('gstPercentage') ?? 18);
//     const sgst = (subscriptionPrice * gstPct) / 200;
//     const cgst = (subscriptionPrice * gstPct) / 200;
//     const total = subscriptionPrice + (subscriptionPrice * gstPct) / 100;

//     return {
//       acknowledgementNumber: fetchedHotelData?.acknowledgementNumber || '-',
//       ackDate: fmtDateTime(fetchedHotelData?.ackDate),
//       irnNo: fetchedHotelData?.irnNo || '-',
//       invoiceNo:
//         fetchedHotelData?.invoiceNo ||
//         `INV-${(hotelId || '').slice(-6) || Date.now()}`,

//       hotelName: form.getValues('name') || fetchedHotelData?.name || '-',
//       hotelAddress:
//         form.getValues('address') || fetchedHotelData?.address || '-',
//       hotelPhone: form.getValues('number') || fetchedHotelData?.phoneNo || '—',
//       hotelEmail: form.getValues('email') || fetchedHotelData?.email || '—',
//       // If your GSTIN lives elsewhere, point to that field
//       gstin:
//         fetchedHotelData?.gstNumber || (form.getValues('gst') as any) || '—',
//       pan: fetchedHotelData?.panNumber?.numberValue || '—',

//       bookingThrough:
//         form.getValues('couponCode') || fetchedHotelData?.applyCoupon || '-',
//       mobile: form.getValues('number') || fetchedHotelData?.phoneNo || '—',
//       arrival: form.getValues('subscriptionStartDate') || '-',
//       departure: form.getValues('subscriptionEndDate') || '-',

//       items: [
//         {
//           description:
//             form.getValues('subscriptionPlanName') ||
//             fetchedHotelData?.subscriptionPlanName ||
//             'Subscription',
//           rate: subscriptionPrice,
//           qty: 1,
//           total: subscriptionPrice
//         }
//       ],
//       sgst,
//       cgst,
//       total,
//       amountWords: fetchedHotelData?.inWords || '-',
//       logoSrc:
//         imagePreviews.logoImage[0] || fetchedHotelData?.logo || '/Frame.svg',
//       autoScaleToA4: true
//     };
//   };

//   // Fetch invoice from backend (same route pattern as Navbar) with sensible fallbacks
//   const fetchInvoice = useCallback(
//     async (id?: string) => {
//       const key =
//         id ||
//         fetchedHotelData?.invoiceId ||
//         fetchedHotelData?._id ||
//         hotelId ||
//         DEFAULT_INVOICE_ID;

//       const res = await apiCall('GET', `/api/invoice/subscription/${key}`, {});
//       if (!res?.success || !res?.data)
//         throw new Error('Failed to fetch invoice.');
//       const mapped = mapSubscriptionApiToInvoice(res.data);
//       setInvoiceProps(mapped);
//       return mapped;
//     },
//     [fetchedHotelData, hotelId]
//   );

//   // Export to PDF (html2canvas + jsPDF), API-first then fallback to form data
//   const handleInvoicePdf = async () => {
//     try {
//       const current =
//         invoiceProps ||
//         (await fetchInvoice().catch(() => null)) ||
//         buildInvoiceFromForm();

//       setInvoiceProps(current);

//       // wait a frame for hidden component to render/update
//       await new Promise((r) => requestAnimationFrame(() => r(null)));

//       const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
//         import('html2canvas'),
//         import('jspdf')
//       ]);

//       const el = invoiceRef.current;
//       if (!el) return;

//       const canvas = await html2canvas(el, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: '#ffffff',
//         logging: false,
//         windowWidth: el.scrollWidth,
//         windowHeight: el.scrollHeight
//       });

//       const img = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'pt', 'a4');

//       const pageW = pdf.internal.pageSize.getWidth(); // ~595pt
//       const pageH = pdf.internal.pageSize.getHeight(); // ~842pt
//       const margin = 24;
//       const usableW = pageW - margin * 2;

//       const imgW = usableW;
//       const imgH = (canvas.height * imgW) / canvas.width;

//       let remaining = imgH;
//       let shift = 0;
//       while (remaining > 0) {
//         pdf.addImage(
//           img,
//           'PNG',
//           margin,
//           margin - shift,
//           imgW,
//           imgH,
//           undefined,
//           'FAST'
//         );
//         remaining -= pageH - margin * 2;
//         if (remaining > 0) {
//           pdf.addPage();
//           shift += pageH - margin * 2;
//         }
//       }

//       pdf.save(
//         `${current.invoiceNo || 'Invoice'}_${new Date().toISOString().slice(0, 10)}.pdf`
//       );
//     } catch (e) {
//       console.error(e);
//       ToastAtTopRight.fire('Failed to generate PDF', 'error');
//     }
//   };
//   const generateHourlyOptions = () => {
//     const options: string[] = [];
//     for (let hour = 0; hour < 24; hour++) {
//       const suffix = hour < 12 ? 'AM' : 'PM';
//       const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
//       options.push(`${formattedHour}:00 ${suffix}`);
//     }
//     return options;
//   };

//   const approveRequest = async () => {
//     if (!hotelId) {
//       ToastAtTopRight.fire('Hotel request ID missing', 'error');
//       return;
//     }
//     try {
//       const payload = {
//         requestId: hotelId,
//         subscriptionPlan: form.getValues('subscriptionPlan'),
//         subscriptionPrice: form.getValues('subscriptionPrice'),
//         couponCode:
//           form.getValues('couponCode') === 'Choose coupon'
//             ? ''
//             : form.getValues('couponCode')
//       };
//       const response = await apiCall(
//         'POST',
//         'api/hotel/approve-request',
//         payload
//       );
//       if (response.status) {
//         ToastAtTopRight.fire('Hotel approved successfully', 'success');
//         router.push('/super-admin/hotel-management/pending');
//       } else {
//         ToastAtTopRight.fire(
//           response.message || 'Failed to approve hotel',
//           'error'
//         );
//       }
//     } catch (error) {
//       console.error(error);
//       ToastAtTopRight.fire('Server error during approval', 'error');
//     }
//   };
//   return (
//     <FormWrapper title="">
//       {/* Hidden/off-screen invoice for PDF capture */}
//       <div
//         aria-hidden
//         className="fixed -left-[99999px] -top-[99999px] pointer-events-none select-none"
//       >
//         {invoiceProps && <InvoiceExactA4 ref={invoiceRef} {...invoiceProps} />}
//       </div>

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(handleUpdate)}
//           className="w-full flex flex-col gap-3 bg-inherit mx-auto"
//         >
//           {/* 🔽 Top-of-form Download button (kept independent; nothing else removed) */}
//           <div className="flex justify-end">
//             <Button
//               type="button"
//               onClick={handleInvoicePdf}
//               className="btn-primary text-xs 2xl:text-sm"
//               title="Download invoice PDF"
//             >
//               <Download className="mr-2 h-4 w-4" />
//               Download Invoice
//             </Button>
//           </div>

//           {mode !== 'pending' && (
//             <div className="flex gap-4">
//               {/* Room Image Uploader (multi) */}
//               <div>
//                 <FormField
//                   control={form.control}
//                   name="roomImage"
//                   render={() => (
//                     <FormItem className="w-fit relative">
//                       <FormLabel className="text-coffee font-medium">
//                         Room Image
//                       </FormLabel>
//                       <div className="flex items-center gap-2">
//                         <div
//                           className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
//                             isDisabled
//                               ? 'cursor-not-allowed opacity-50'
//                               : 'cursor-pointer'
//                           } rounded-md border border-gray-100`}
//                           onClick={() =>
//                             !isDisabled && triggerFileInput(roomImageRef)
//                           }
//                         >
//                           {imagePreviews.roomImage?.length ? (
//                             <img
//                               src={
//                                 imagePreviews.roomImage[
//                                   imagePreviews.roomImage.length - 1
//                                 ]
//                               }
//                               alt="Room Preview"
//                               className="w-full h-full object-cover rounded-md"
//                             />
//                           ) : (
//                             <CiCamera className="w-8 h-8 text-coffee opacity-50" />
//                           )}
//                         </div>
//                         <FormControl>
//                           <Input
//                             type="file"
//                             accept="image/*"
//                             multiple
//                             ref={roomImageRef}
//                             onChange={(e) =>
//                               handleMultiImageUpload(e, 'roomImage')
//                             }
//                             className="hidden"
//                             disabled={isDisabled}
//                           />
//                         </FormControl>
//                         <Upload
//                           className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
//                             imagePreviews.roomImage && !isDisabled
//                               ? 'text-black cursor-pointer'
//                               : 'text-gray-400 cursor-not-allowed'
//                           }`}
//                           onClick={() =>
//                             imagePreviews.roomImage &&
//                             !isDisabled &&
//                             triggerFileInput(roomImageRef)
//                           }
//                         />
//                       </div>
//                       <FormMessage className="text-[10px]" />
//                       {/* Thumbs */}
//                       <div className="flex flex-wrap gap-3 mt-4">
//                         {imagePreviews.roomImage?.map((image, index) => (
//                           <div
//                             key={image + index}
//                             className="relative w-24 h-24 2xl:w-28 2xl:h-28"
//                           >
//                             <img
//                               src={image}
//                               alt={`Room ${index + 1}`}
//                               className="w-full h-full object-cover rounded-md"
//                             />
//                             <button
//                               type="button"
//                               className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
//                               onClick={() => removeImageAt(index, 'roomImage')}
//                               disabled={isDisabled}
//                               title="Remove"
//                             >
//                               X
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Logo Uploader (single) */}
//               <FormField
//                 control={form.control}
//                 name="logoImage"
//                 render={() => (
//                   <FormItem className="w-fit relative">
//                     <FormLabel className="text-coffee font-medium">
//                       HomeScreen Image(Hotel Image)
//                     </FormLabel>
//                     <div className="flex items-center gap-2">
//                       <div
//                         className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
//                           isDisabled
//                             ? 'cursor-not-allowed opacity-50'
//                             : 'cursor-pointer'
//                         } rounded-md border border-gray-100`}
//                         onClick={() =>
//                           !isDisabled && triggerFileInput(logoImageRef)
//                         }
//                       >
//                         {imagePreviews.logoImage?.length ? (
//                           <img
//                             src={imagePreviews.logoImage[0]}
//                             alt="Logo Preview"
//                             className="w-full h-full object-cover rounded-md"
//                           />
//                         ) : (
//                           <CiCamera className="w-8 h-8 text-coffee opacity-50" />
//                         )}
//                       </div>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           ref={logoImageRef}
//                           onChange={async (e) => {
//                             const f = e.target.files?.[0];
//                             if (f) await uploadSingleImage(f, 'logoImage');
//                             e.currentTarget.value = '';
//                           }}
//                           className="hidden"
//                           disabled={isDisabled}
//                         />
//                       </FormControl>
//                       <Upload
//                         className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
//                           imagePreviews.logoImage && !isDisabled
//                             ? 'text-black cursor-pointer'
//                             : 'text-gray-400 cursor-not-allowed'
//                         }`}
//                         onClick={() =>
//                           imagePreviews.logoImage &&
//                           !isDisabled &&
//                           triggerFileInput(logoImageRef)
//                         }
//                       />
//                     </div>
//                     <FormMessage className="text-[10px]" />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           )}

//           <div className="w-full flex flex-col gap-6">
//             {/* Chunk 1: Basic Hotel Info */}
//             <div className="flex flex-col gap-4 2xl:gap-5 bg-[#FAF6EF] shadow-custom p-6 2xl:p-8 rounded-lg">
//               <div className="flex justify-end">
//                 {mode === 'pending' ? (
//                   <div className="w-fit mb-4 cursor-pointer">
//                     <DropdownMenu.Root
//                       open={showDropdown}
//                       onOpenChange={setShowDropdown}
//                     >
//                       <DropdownMenu.Trigger asChild className="w-full">
//                         <button
//                           className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
//                             status === 'PENDING'
//                               ? 'bg-red-100 text-red-700'
//                               : 'bg-green-100 text-green-700'
//                           }`}
//                         >
//                           {status}
//                           {showDropdown ? (
//                             <ChevronUp size={16} />
//                           ) : (
//                             <ChevronDown size={16} />
//                           )}
//                         </button>
//                       </DropdownMenu.Trigger>
//                       <DropdownMenu.Content className="bg-white rounded w-32 shadow-lg space-y-1 mt-1">
//                         <DropdownMenu.Item
//                           onSelect={() => setStatus('APPROVE')}
//                           className="text-sm px-4 pt-1 hover:bg-gray-100 rounded"
//                         >
//                           <Button type="button" onClick={approveRequest}>
//                             Approve
//                           </Button>
//                         </DropdownMenu.Item>
//                       </DropdownMenu.Content>
//                     </DropdownMenu.Root>
//                   </div>
//                 ) : null}
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Hotel Name <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter hotel name"
//                           {...field}
//                           onChange={(e) => {
//                             field.onChange(e);
//                             setHotelName(e.target.value);
//                           }}
//                           disabled={true}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="number"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Phone Number <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter phone number"
//                           {...field}
//                           disabled={true}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Email <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="email"
//                           placeholder="Enter email"
//                           {...field}
//                           disabled={true}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <FormField
//                   control={form.control}
//                   name="address"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Complete Address <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter address"
//                           {...field}
//                           disabled={true}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="hotelCategory"
//                   render={({ field }) => (
//                     <FormItem className="w-fit">
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Hotel Category <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Select
//                           value={field.value}
//                           onValueChange={field.onChange}
//                           disabled={true}
//                         >
//                           <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm">
//                             <SelectValue placeholder="Select category" />
//                           </SelectTrigger>
//                           <SelectContent className="bg-coffee">
//                             {['3 Star', '4 Star', '5 Star', '7 Star'].map(
//                               (value) => (
//                                 <SelectItem
//                                   key={value}
//                                   value={value}
//                                   className="text-white"
//                                 >
//                                   {value}
//                                 </SelectItem>
//                               )
//                             )}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//                 <FormField
//                   control={form.control}
//                   name="state"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         State <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           disabled={true}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="city"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         City <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           disabled={true}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="country"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Country <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Select
//                           value={field.value}
//                           onValueChange={field.onChange}
//                           disabled={true}
//                         >
//                           <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm">
//                             <SelectValue placeholder="Select country" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {['India', 'United States', 'United Kingdom'].map(
//                               (value) => (
//                                 <SelectItem key={value} value={value}>
//                                   {value}
//                                 </SelectItem>
//                               )
//                             )}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="pinCode"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Pincode <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="text"
//                           inputMode="numeric"
//                           pattern="[0-9]*"
//                           maxLength={6}
//                           placeholder="Enter pincode"
//                           {...field}
//                           onInput={(e) => {
//                             const value = e.currentTarget.value.replace(
//                               /\D/g,
//                               ''
//                             );
//                             if (value.length <= 6) field.onChange(value);
//                           }}
//                           disabled={true}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="about"
//                   render={({ field }) => (
//                     <FormItem className="col-span-1 sm:col-span-2">
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         About Us
//                       </FormLabel>
//                       <FormControl>
//                         <textarea
//                           {...field}
//                           rows={5}
//                           placeholder="Write something about the hotel..."
//                           disabled={isDisabled}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm resize-none"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {mode === 'add' && (
//                 <div className="flex flex-col md:flex-row gap-5 w-fit">
//                   <FormField
//                     control={form.control}
//                     name="brandedHotel"
//                     render={() => (
//                       <FormItem className="flex items-center gap-4">
//                         <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                           Branded Hotel
//                         </FormLabel>
//                         <FormControl>
//                           <input
//                             type="checkbox"
//                             checked={isBrandedHotelChecked}
//                             onChange={(e) =>
//                               handleBrandedHotelChange(e.target.checked)
//                             }
//                             disabled={isDisabled}
//                             className="form-checkbox"
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="chainHotel"
//                     render={() => (
//                       <FormItem className="flex items-center gap-4">
//                         <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                           Chain Hotel
//                         </FormLabel>
//                         <FormControl>
//                           <input
//                             type="checkbox"
//                             checked={isChainHotelChecked}
//                             onChange={(e) =>
//                               handleChainHotelChange(e.target.checked)
//                             }
//                             disabled={isDisabled || isBrandedHotelChecked}
//                             className="form-checkbox"
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               )}

//               {isChainHotelChecked && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <FormField
//                     control={form.control}
//                     name="parentHotelId"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                           Parent Hotel ID
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Enter Parent Hotel ID"
//                             {...field}
//                             className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                           />
//                         </FormControl>
//                         <FormMessage className="text-[10px]" />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Chunk 2: Room Details */}
//             <div className="flex flex-col gap-4 2xl:gap-5 bg-[#FAF6EF] shadow-custom p-6 2xl:p-8 rounded-lg">
//               <div className="flex flex-col gap-3">
//                 {fields.map((field, index) => (
//                   <div key={field.id} className="flex items-center gap-3">
//                     <FormField
//                       control={form.control}
//                       name={`roomConfigs.${index}.roomType`}
//                       render={({ field }) => (
//                         <FormItem className="w-40">
//                           <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                             Room Types <span className="text-red-500">*</span>
//                           </FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="Enter Room Type"
//                               value={field.value || ''}
//                               onChange={field.onChange}
//                               disabled={isDisabled}
//                               className="w-40 bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                             />
//                           </FormControl>
//                           <FormMessage className="text-[10px]" />
//                         </FormItem>
//                       )}
//                     />
//                     {/* <FormField
//                       control={form.control}
//                       name={`roomConfigs.${index}.feature`}
//                       render={({ field }) => (
//                         <FormItem className="w-40">
//                           <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                             Select Features <span className="text-red-500">*</span>
//                           </FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="Enter Feature"
//                               value={field.value || ''}
//                               onChange={field.onChange}
//                               disabled={isDisabled}
//                               className="w-40 bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                             />
//                           </FormControl>
//                           <FormMessage className="text-[10px]" />
//                         </FormItem>
//                       )}
//                     /> */}
//                     <FormField
//                       control={form.control}
//                       name={`roomConfigs.${index}.features`} // ✅ array field
//                       render={({ field }) => {
//                         const features: string[] = Array.isArray(field.value)
//                           ? field.value
//                           : [];
//                         const [pending, setPending] = React.useState('');

//                         const add = () => {
//                           const v = pending.trim();
//                           if (!v) return;
//                           const next = Array.from(
//                             new Set([...(features || []), v])
//                           );
//                           field.onChange(next);
//                           setPending('');
//                         };

//                         const removeAt = (i: number) => {
//                           const next = (features || []).filter(
//                             (_, idx) => idx !== i
//                           );
//                           field.onChange(next);
//                         };

//                         const onKeyDown: React.KeyboardEventHandler<
//                           HTMLInputElement
//                         > = (e) => {
//                           if (e.key === 'Enter' || e.key === ',') {
//                             e.preventDefault();
//                             add();
//                           }
//                         };

//                         return (
//                           <FormItem className="w-72">
//                             <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                               Add Features{' '}
//                               <span className="text-red-500">*</span>
//                             </FormLabel>

//                             {/* chips */}
//                             <div className="flex flex-wrap gap-2 mb-2">
//                               {features?.map((f, i) => (
//                                 <span
//                                   key={`${f}-${i}`}
//                                   className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-[#F6EEE0] text-gray-700 text-xs"
//                                 >
//                                   {f}
//                                   {!isDisabled && (
//                                     <button
//                                       type="button"
//                                       className="text-red-600"
//                                       onClick={() => removeAt(i)}
//                                       aria-label={`remove ${f}`}
//                                     >
//                                       ×
//                                     </button>
//                                   )}
//                                 </span>
//                               ))}
//                               {!features?.length && (
//                                 <span className="text-[11px] text-gray-400">
//                                   No features added
//                                 </span>
//                               )}
//                             </div>

//                             {/* input + add */}
//                             <div className="flex gap-2">
//                               <Input
//                                 type="text"
//                                 value={pending}
//                                 onChange={(e) => setPending(e.target.value)}
//                                 onKeyDown={onKeyDown}
//                                 disabled={isDisabled}
//                                 placeholder="Type & press Enter"
//                                 className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md text-xs 2xl:text-sm"
//                               />
//                               <Button
//                                 type="button"
//                                 onClick={add}
//                                 disabled={isDisabled || !pending.trim()}
//                                 className="text-xs 2xl:text-sm"
//                                 variant="secondary"
//                               >
//                                 Add
//                               </Button>
//                             </div>
//                             <FormMessage className="text-[10px]" />
//                           </FormItem>
//                         );
//                       }}
//                     />
//                     {fields.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => !isDisabled && remove(index)}
//                         className={`text-red-500 text-sm pt-6 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                         disabled={isDisabled}
//                       >
//                         Delete
//                       </button>
//                     )}
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   // onClick={() => !isDisabled && append({ roomType: 'Single', feature: 'Sea Side' })}
//                   onClick={() =>
//                     !isDisabled &&
//                     append({ roomType: 'Single', features: ['Sea Side'] })
//                   }
//                   className={`mt-2 text-blue-600 flex items-center gap-1 text-sm ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={isDisabled}
//                 >
//                   <Plus className="w-4 h-4" /> Add Room & Features
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <FormField
//                   control={form.control}
//                   name="servingDepartment"
//                   render={({ field }) => {
//                     const selectedDepartments = field.value || [];
//                     const toggleOption = (option: string) => {
//                       const newValue = selectedDepartments.includes(option)
//                         ? selectedDepartments.filter(
//                             (v: string) => v !== option
//                           )
//                         : [...selectedDepartments, option];
//                       field.onChange(newValue);
//                     };
//                     return (
//                       <FormItem>
//                         <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                           Serving Departments
//                         </FormLabel>
//                         <div className="flex flex-wrap gap-3 text-sm">
//                           {servingDepartmentOptions.map(({ label, value }) => (
//                             <label
//                               key={value}
//                               className="inline-flex text-gray-700 items-center gap-2"
//                             >
//                               <input
//                                 type="checkbox"
//                                 checked={selectedDepartments.includes(value)}
//                                 onChange={() => toggleOption(value)}
//                                 disabled={isDisabled}
//                               />
//                               <span>{label}</span>
//                             </label>
//                           ))}
//                         </div>
//                       </FormItem>
//                     );
//                   }}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="numberOfRooms"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Total Number of Rooms
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           min="1"
//                           placeholder="Enter number of rooms"
//                           {...field}
//                           disabled={isDisabled}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="totalStaff"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Total Staff
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           min="1"
//                           placeholder="Enter total staff"
//                           {...field}
//                           disabled={isDisabled}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <FormField
//                   control={form.control}
//                   name="checkInTime"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Check-in Time
//                       </FormLabel>
//                       <FormControl>
//                         <Select
//                           disabled={isDisabled}
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm relative pr-8">
//                             <SelectValue placeholder="Select check-in time" />
//                             <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
//                           </SelectTrigger>
//                           <SelectContent className="max-h-60 overflow-y-auto">
//                             {generateHourlyOptions().map((time) => (
//                               <SelectItem key={time} value={time}>
//                                 {time}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="checkOutTime"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Check-out Time
//                       </FormLabel>
//                       <FormControl>
//                         <Select
//                           disabled={isDisabled}
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm relative pr-8">
//                             <SelectValue placeholder="Select check-out time" />
//                             <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
//                           </SelectTrigger>
//                           <SelectContent className="max-h-60 overflow-y-auto">
//                             {generateHourlyOptions().map((time) => (
//                               <SelectItem key={time} value={time}>
//                                 {time}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="subscriptionPlanName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Subscription Plan
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="e.g., Basic / Premium"
//                           {...field}
//                           disabled={true}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="netPrice"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Net Price
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           placeholder="e.g., 1500"
//                           {...field}
//                           disabled={true}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="subscriptionPrice"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Subscription Price{' '}
//                         <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           min="0"
//                           placeholder="Auto-filled from plan"
//                           {...field}
//                           disabled={true}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="gstPercentage"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         GST Number <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="text"
//                           placeholder="Enter GST Number"
//                           {...field}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="subscriptionStartDate"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Subscription Start Date{' '}
//                         <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="date"
//                           {...field}
//                           value={field.value || ''}
//                           disabled={true}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="subscriptionEndDate"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Subscription End Date{' '}
//                         <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="date"
//                           {...field}
//                           value={field.value || ''}
//                           disabled={true}
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="subscriptionPlanType"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                         Subscription Plan Type
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           disabled
//                           className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                         />
//                       </FormControl>
//                       <FormMessage className="text-[10px]" />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>

//             {/* Chunk 3: Licenses and Certifications */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-5 bg-[#FAF6EF] shadow-custom p-6 2xl:p-8 rounded-lg">
//               <FormField
//                 control={form.control}
//                 name="hotelLicenseCertifications"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                       Hotel License & Certifications
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter license details"
//                         {...field}
//                         disabled={isDisabled}
//                         className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-[10px]" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="hotelLicenseImage"
//                 render={() => (
//                   <FormItem className="w-fit relative">
//                     <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                       Hotel License Image
//                     </FormLabel>
//                     <div className="flex items-center gap-2">
//                       <div
//                         className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
//                           isDisabled
//                             ? 'cursor-not-allowed opacity-50'
//                             : 'cursor-pointer'
//                         } rounded-md border border-gray-100`}
//                         onClick={() =>
//                           !isDisabled && triggerFileInput(hotelLicenseImageRef)
//                         }
//                       >
//                         {imagePreviews.hotelLicenseImage?.length ? (
//                           <img
//                             src={imagePreviews.hotelLicenseImage[0]}
//                             alt="Hotel License Preview"
//                             className="w-full h-full object-cover rounded-md"
//                           />
//                         ) : (
//                           <CiCamera className="w-8 h-8 text-coffee opacity-50" />
//                         )}
//                       </div>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           ref={hotelLicenseImageRef}
//                           disabled={isDisabled}
//                           onChange={async (e) => {
//                             const f = e.target.files?.[0];
//                             if (f)
//                               await uploadSingleImage(f, 'hotelLicenseImage');
//                             e.currentTarget.value = '';
//                           }}
//                           className="hidden"
//                         />
//                       </FormControl>
//                       <Upload
//                         className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
//                           imagePreviews.hotelLicenseImage && !isDisabled
//                             ? 'text-black cursor-pointer'
//                             : 'text-gray-400 cursor-not-allowed'
//                         }`}
//                         onClick={() =>
//                           imagePreviews.hotelLicenseImage &&
//                           !isDisabled &&
//                           triggerFileInput(hotelLicenseImageRef)
//                         }
//                       />
//                     </div>
//                     <FormMessage className="text-[10px]" />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="legalBusinessLicense"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                       Legal and Business License
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter business license"
//                         {...field}
//                         disabled={isDisabled}
//                         className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-[10px]" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="legalBusinessLicenseImage"
//                 render={() => (
//                   <FormItem className="w-fit relative">
//                     <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                       Business License Image
//                     </FormLabel>
//                     <div className="flex items-center gap-2">
//                       <div
//                         className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
//                           isDisabled
//                             ? 'cursor-not-allowed opacity-50'
//                             : 'cursor-pointer'
//                         } rounded-md border border-gray-100`}
//                         onClick={() =>
//                           !isDisabled &&
//                           triggerFileInput(legalBusinessLicenseImageRef)
//                         }
//                       >
//                         {imagePreviews.legalBusinessLicenseImage?.length ? (
//                           <img
//                             src={imagePreviews.legalBusinessLicenseImage[0]}
//                             alt="Business License Preview"
//                             className="w-full h-full object-cover rounded-md"
//                           />
//                         ) : (
//                           <CiCamera className="w-8 h-8 text-coffee opacity-50" />
//                         )}
//                       </div>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           ref={legalBusinessLicenseImageRef}
//                           onChange={async (e) => {
//                             const f = e.target.files?.[0];
//                             if (f)
//                               await uploadSingleImage(
//                                 f,
//                                 'legalBusinessLicenseImage'
//                               );
//                             e.currentTarget.value = '';
//                           }}
//                           className="hidden"
//                           disabled={isDisabled}
//                         />
//                       </FormControl>
//                       <Upload
//                         className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
//                           imagePreviews.legalBusinessLicenseImage && !isDisabled
//                             ? 'text-black cursor-pointer'
//                             : 'text-gray-400 cursor-not-allowed'
//                         }`}
//                         onClick={() =>
//                           imagePreviews.legalBusinessLicenseImage &&
//                           !isDisabled &&
//                           triggerFileInput(legalBusinessLicenseImageRef)
//                         }
//                       />
//                     </div>
//                     <FormMessage className="text-[10px]" />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="touristLicense"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                       Tourist License
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter tourist license"
//                         {...field}
//                         disabled={isDisabled}
//                         className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-[10px]" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="touristLicenseImage"
//                 render={() => (
//                   <FormItem className="w-fit relative">
//                     <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                       Tourist License Image
//                     </FormLabel>
//                     <div className="flex items-center gap-2">
//                       <div
//                         className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
//                           isDisabled
//                             ? 'cursor-not-allowed opacity-50'
//                             : 'cursor-pointer'
//                         } rounded-md border border-gray-100`}
//                         onClick={() =>
//                           !isDisabled &&
//                           triggerFileInput(touristLicenseImageRef)
//                         }
//                       >
//                         {imagePreviews.touristLicenseImage?.length ? (
//                           <img
//                             src={imagePreviews.touristLicenseImage[0]}
//                             alt="Tourist License Preview"
//                             className="w-full h-full object-cover rounded-md"
//                           />
//                         ) : (
//                           <CiCamera className="w-8 h-8 text-coffee opacity-50" />
//                         )}
//                       </div>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           ref={touristLicenseImageRef}
//                           onChange={async (e) => {
//                             const f = e.target.files?.[0];
//                             if (f)
//                               await uploadSingleImage(f, 'touristLicenseImage');
//                             e.currentTarget.value = '';
//                           }}
//                           className="hidden"
//                           disabled={isDisabled}
//                         />
//                       </FormControl>
//                       <Upload
//                         className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
//                           imagePreviews.touristLicenseImage && !isDisabled
//                             ? 'text-black cursor-pointer'
//                             : 'text-gray-400 cursor-not-allowed'
//                         }`}
//                         onClick={() =>
//                           imagePreviews.touristLicenseImage &&
//                           !isDisabled &&
//                           triggerFileInput(touristLicenseImageRef)
//                         }
//                       />
//                     </div>
//                     <FormMessage className="text-[10px]" />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="tanNumber"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                       TAN Number
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter TAN number"
//                         {...field}
//                         disabled={isDisabled}
//                         className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-[10px]" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="tanNumberImage"
//                 render={() => (
//                   <FormItem className="w-fit relative">
//                     <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                       TAN Number Image
//                     </FormLabel>
//                     <div className="flex items-center gap-2">
//                       <div
//                         className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
//                           isDisabled
//                             ? 'cursor-not-allowed opacity-50'
//                             : 'cursor-pointer'
//                         } rounded-md border border-gray-100`}
//                         onClick={() =>
//                           !isDisabled && triggerFileInput(tanNumberImageRef)
//                         }
//                       >
//                         {imagePreviews.tanNumberImage?.length ? (
//                           <img
//                             src={imagePreviews.tanNumberImage[0]}
//                             alt="TAN Number Preview"
//                             className="w-full h-full object-cover rounded-md"
//                           />
//                         ) : (
//                           <CiCamera className="w-8 h-8 text-coffee opacity-50" />
//                         )}
//                       </div>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           ref={tanNumberImageRef}
//                           onChange={async (e) => {
//                             const f = e.target.files?.[0];
//                             if (f) await uploadSingleImage(f, 'tanNumberImage');
//                             e.currentTarget.value = '';
//                           }}
//                           className="hidden"
//                           disabled={isDisabled}
//                         />
//                       </FormControl>
//                       <Upload
//                         className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
//                           imagePreviews.tanNumberImage && !isDisabled
//                             ? 'text-black cursor-pointer'
//                             : 'text-gray-400 cursor-not-allowed'
//                         }`}
//                         onClick={() =>
//                           imagePreviews.tanNumberImage &&
//                           !isDisabled &&
//                           triggerFileInput(tanNumberImageRef)
//                         }
//                       />
//                     </div>
//                     <FormMessage className="text-[10px]" />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="dataPrivacyGdprCompliances"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                       Data Privacy & GDPR Compliances
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter GDPR details"
//                         {...field}
//                         disabled={isDisabled}
//                         className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none focus:ring-0 text-xs 2xl:text-sm"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-[10px]" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="dataPrivacyGdprImage"
//                 render={() => (
//                   <FormItem className="w-fit relative">
//                     <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
//                       GDPR Compliance Image
//                     </FormLabel>
//                     <div className="flex items-center gap-2">
//                       <div
//                         className={`w-32 h-12 2xl:w-36 2xl:h-14 bg-[#F6EEE0] flex items-center justify-center ${
//                           isDisabled
//                             ? 'cursor-not-allowed opacity-50'
//                             : 'cursor-pointer'
//                         } rounded-md border border-gray-100`}
//                         onClick={() =>
//                           !isDisabled &&
//                           triggerFileInput(dataPrivacyGdprImageRef)
//                         }
//                       >
//                         {imagePreviews.dataPrivacyGdprImage?.length ? (
//                           <img
//                             src={imagePreviews.dataPrivacyGdprImage[0]}
//                             alt="GDPR Compliance Preview"
//                             className="w-full h-full object-cover rounded-md"
//                           />
//                         ) : (
//                           <CiCamera className="w-8 h-8 text-coffee opacity-50" />
//                         )}
//                       </div>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           ref={dataPrivacyGdprImageRef}
//                           onChange={async (e) => {
//                             const f = e.target.files?.[0];
//                             if (f)
//                               await uploadSingleImage(
//                                 f,
//                                 'dataPrivacyGdprImage'
//                               );
//                             e.currentTarget.value = '';
//                           }}
//                           className="hidden"
//                           disabled={isDisabled}
//                         />
//                       </FormControl>
//                       <Upload
//                         className={`absolute left-20 z-20 h-3 w-3 2xl:h-4 2xl:w-4 ${
//                           imagePreviews.dataPrivacyGdprImage && !isDisabled
//                             ? 'text-black cursor-pointer'
//                             : 'text-gray-400 cursor-not-allowed'
//                         }`}
//                         onClick={() =>
//                           imagePreviews.dataPrivacyGdprImage &&
//                           !isDisabled &&
//                           triggerFileInput(dataPrivacyGdprImageRef)
//                         }
//                       />
//                     </div>
//                     <FormMessage className="text-[10px]" />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </div>

//           <div className="mt-3 flex flex-col sm:flex-row justify-end gap-4 2x:gap-5">
//             <Button
//               type="button"
//               onClick={() => router.back()}
//               className="btn-secondary text-xs 2xl:text-sm"
//             >
//               Cancel
//             </Button>
//             {mode === 'edit' && (
//               <Button
//                 type="submit"
//                 disabled={isDisabled}
//                 className="btn-primary text-xs 2xl:text-sm"
//               >
//                 Update Profile
//               </Button>
//             )}
//           </div>
//         </form>
//       </Form>
//     </FormWrapper>
//   );
// };

// export default HotelFormProfile;
