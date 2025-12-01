'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import dummyHotelData from '../../../../app/static/company-panel/HotelManagement';
import { useForm } from 'react-hook-form';
import {
  CreateHotelIdFormSchema,
  CreateHotelIdFormSchemaType,
  serviceOptions
} from '../../../../schema/company-panel';
import { zodResolver } from '@hookform/resolvers/zod';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, ChevronUp } from 'lucide-react';
import FormWrapper from './form-wrapper';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import Image from 'next/image';
import { PiCameraThin } from 'react-icons/pi';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { apiCall } from '@/lib/axios';

type Props = {
  hotelID?: string;
  isEnabled?: boolean;
  mode: string;
};

const CreateHotelIdForm = ({ hotelID, isEnabled = true, mode }: Props) => {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [status, setStatus] = useState<'PENDING' | 'APPROVE'>('PENDING');
  const [licenses, setLicenses] = useState<
    { title: string; number: string; image: string }[]
  >([]);
  const [roomList, setRoomList] = useState<
    { roomName: string; roomType: string; features: string[] }[]
  >([]);
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [checkOutTime, setCheckOutTime] = useState<string>('');
  const [totalStaff, setTotalStaff] = useState<number>(0);
  const [gstDetails, setGstDetails] = useState<string>('');

  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getHotelDetails = (hotelID: string | undefined) => {
    if (hotelID) {
      return dummyHotelData.find((hotel) => hotel.hotelID === hotelID);
    }
    return null;
  };
  const hotel = getHotelDetails(hotelID);

  const form = useForm<CreateHotelIdFormSchemaType>({
    resolver: zodResolver(CreateHotelIdFormSchema),
    defaultValues: {
      hotelID: hotel?.hotelID || '',
      hotelImageUrl: hotel?.hotelImageUrl || '',
      hotelImageFile: hotel?.hotelImageFile || undefined,
      hotelName: hotel?.hotelName || '',
      address: hotel?.address || '',
      services: hotel?.services || [],
      subscriptionPlan: hotel?.subscriptionPlan || 'Standard',
      subscriptionPrice: hotel?.subscriptionPrice || 2999,
      contactNo: hotel?.contactNo || '',
      email: hotel?.email || ''
    }
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = async (data: CreateHotelIdFormSchemaType) => {
    console.log('is submitting');
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const formData = new FormData();
      formData.append('name', data.hotelName);
      formData.append('address', data.address);
      formData.append('email', data.email);
      formData.append('phoneNo', data.contactNo);
      formData.append('subscriptionPlan', data.subscriptionPlan);
      formData.append('subscriptionPrice', data.subscriptionPrice.toString());
      if (data.services && data.services.length > 0) {
        formData.append('services', JSON.stringify(data.services));
      }
      if (data.hotelImageFile) {
        formData.append('image', data.hotelImageFile);
      }

      const response = await apiCall(
        'POST',
        'api/superAdmin/hotel/add-hotel',
        formData
      );
      console.log('API response:', response);
      setSubmitStatus('success');
      form.reset();
      router.push('/hotels'); // Navigate to hotels list after success
    } catch (error: any) {
      console.error('Error occurred during API call:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    form.reset(); // Reset form to initial values
    setPreview(null); // Clear image preview
    router.push('/hotels'); // Navigate back to hotels list
  };

  const data = [
    {
      title: 'Hotel License & Certification',
      number: '1234RTFVEG',
      image: '/certificate.png'
    },
    {
      title: 'Legal and Business license',
      number: '1234RTFVEG',
      image: '/legal.png'
    },
    {
      title: 'Tourist License',
      number: '1234RTFVEG',
      image: '/tourist.png'
    },
    {
      title: 'Tan number',
      number: '1234RTFVEG',
      image: '/tan.png'
    },
    {
      title: 'Data Privacy & GDPR Compliances',
      number: '1234RTFVEG',
      image: '/privacy.png'
    }
  ];

  // In your useEffect fetching the hotel data, map all fields:
  useEffect(() => {
    if (hotelID) {
      const fetchHotel = async () => {
        try {
          const response = await apiCall(
            'GET',
            `api/hotel/get-hotel/${hotelID}`
          );
          if (response.status && response.hotel) {
            const h = response.hotel;
            form.reset({
              hotelID: h.HotelId || '',
              hotelName: h.name || '',
              address: h.address || '',
              contactNo: h.phoneNo || '',
              email: h.email || '',
              subscriptionPlan: h.subscriptionPlan || '',
              subscriptionPrice: h.subscriptionPrice || 0,
              services:
                h.servingDepartment?.map((service: any) =>
                  service.toLowerCase()
                ) || []
            });
            setLicenses([
              {
                title: 'Hotel License & Certification',
                number: h.hotelLicenseAndCertification?.certificateValue || '',
                image: h.hotelLicenseAndCertification?.imageUrl || ''
              },
              {
                title: 'Legal and Business License',
                number: h.legalAndBusinessLicense?.licenseValue || '',
                image: h.legalAndBusinessLicense?.imageUrl || ''
              },
              {
                title: 'Tourist License',
                number: h.touristLicense?.licenseValue || '',
                image: h.touristLicense?.imageUrl || ''
              },
              {
                title: 'PAN Number',
                number: h.panNumber?.numberValue || '',
                image: h.panNumber?.imageUrl || ''
              },
              {
                title: 'Data Privacy & GDPR Compliances',
                number: h.dataPrivacyAndGDPRCompliance?.complianceValue || '',
                image: h.dataPrivacyAndGDPRCompliance?.imageUrl || ''
              }
            ]);
            setRoomList(h.rooms || []);
            setCheckInTime(h.checkInTime || '');
            setCheckOutTime(h.checkOutTime || '');
            setTotalStaff(h.totalStaff || 0);
            setGstDetails(h.gstDetails || '');
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchHotel();
    }
  }, [hotelID]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <FormWrapper title="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 justify-center pt-4 items-center"
          >
            {/* Image Upload */}
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start justify-between w-full">
              <h2 className="text-[#362913] font-bold text-[16px]">
                BRANDED HOTEL
              </h2>
              <div>
                {mode === 'pending' ? (
                  <>
                    <div className="flex justify-end w-full mb-4 cursor-pointer">
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
                        <DropdownMenu.Content className="bg-white rounded px-4 shadow-lg p-2 space-y-1 mt-1">
                          <DropdownMenu.Item
                            onSelect={() => setStatus('PENDING')}
                          >
                            <span className="text-sm px-2 py-1 hover:bg-gray-100 rounded">
                              PENDING
                            </span>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onSelect={() => setStatus('APPROVE')}
                          >
                            <span className="text-sm px-2 py-1 hover:bg-gray-100 rounded">
                              APPROVE
                            </span>
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full px-0 md:px-0">
              <div className="w-full flex justify-between items-center gap-4">
                {/* Left part */}
                <div className="flex flex-col gap-3 justify-center items-start">
                  <FormField
                    control={form.control}
                    name="hotelID"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center">
                        <FormLabel className="w-full sm:w-32 text-sm font-medium text-black">
                          Hotel ID
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled={mode === 'view' || !isEnabled}
                              placeholder="Enter hotel ID"
                              className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-black rounded-md border-none outline-none focus:ring-0 text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hotelName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center">
                        <FormLabel className="w-full sm:w-32 text-sm font-medium text-black">
                          Hotel Name
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled={mode === 'view' || !isEnabled}
                              placeholder="Enter hotel Name"
                              className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-black rounded-md border-none outline-none focus:ring-0 text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center">
                        <FormLabel className="w-full sm:w-32 text-sm font-medium text-black">
                          Address
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={mode === 'view' || !isEnabled}
                              placeholder="Enter address"
                              className="w-full placeholder:opacity-65 h-16 px-2 py-1 bg-[#F6EEE0] text-black rounded-md border-none outline-none focus:ring-0 text-sm resize-none"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                {/* Right part */}
                <div className="flex flex-col gap-3 justify-center items-start">
                  <FormField
                    control={form.control}
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center">
                        <FormLabel className="w-full sm:w-32 text-sm font-medium text-black">
                          Contact
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled={mode === 'view' || !isEnabled}
                              placeholder="Enter contact number"
                              className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-black rounded-md border-none outline-none focus:ring-0 text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center">
                        <FormLabel className="w-full sm:w-32 text-sm font-medium text-black">
                          Email
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              disabled={mode === 'view' || !isEnabled}
                              placeholder="Enter email"
                              className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-black rounded-md border-none outline-none focus:ring-0 text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 justify-center items-start w-full">
                {/* Services */}
                <FormField
                  control={form.control}
                  name="services"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-black">
                        Services
                      </FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4">
                        {serviceOptions.map((service) => (
                          <div key={service} className="flex items-center mb-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(service)}
                                onCheckedChange={(checked) => {
                                  const updatedServices = checked
                                    ? [...(field.value || []), service]
                                    : (field.value || []).filter(
                                        (s) => s !== service
                                      );
                                  field.onChange(updatedServices);
                                }}
                                disabled={mode === 'view' || !isEnabled}
                              />
                            </FormControl>
                            <FormLabel className="ml-2 text-sm text-black capitalize">
                              {service}
                            </FormLabel>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full justify-between">
                  <FormField
                    control={form.control}
                    name="subscriptionPlan"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center gap-8">
                        <FormLabel className="w-full sm:w-32 lg:w-full text-sm font-medium text-black">
                          Subscription Plan
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled={mode === 'view' || !isEnabled}
                              className="w-fit placeholder:opacity-65 h-8 bg-[#F6EEE0] text-black rounded-md border-none outline-none focus:ring-0 text-sm"
                            />
                          </FormControl>
                          <span className="text-sm text-goldenBrown ml-2">
                            INR- 2999/month
                          </span>
                          <FormMessage className="text-[10px] mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hotelName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:flex-row sm:items-center">
                        <FormLabel className="w-full sm:w-32 text-sm font-medium text-black">
                          GST Details
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled={mode === 'view' || !isEnabled}
                              placeholder="Enter hotel Name"
                              className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-black rounded-md border-none outline-none focus:ring-0 text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] mt-1" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full flex justify-start items-center gap-4">
                <Button
                  type="button"
                  className="btn-secondary"
                  onClick={onCancel}
                  disabled={isSubmitting || mode === 'view'}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting || mode === 'view'}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                {submitStatus === 'success' && (
                  <p className="text-green-600 text-sm">
                    Form submitted successfully!
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-sm">
                    An error occurred. Please try again.
                  </p>
                )}
              </div>
            </div>
          </form>
        </Form>
      </FormWrapper>
      <FormWrapper title="">
        <div className="flex flex-col md:flex-row justify-between w-full">
          {/* Left Column */}
          <div className="w-full md:w-1/3 flex flex-col gap-3 md:gap-6">
            {/* Room Types */}
            <div className="flex">
              <div className="w-40 font-medium text-sm text-black">
                Room types
              </div>
              <ul className="text-sm text-black space-y-1">
                {roomList.length > 0 ? (
                  roomList.map((room) => (
                    <li key={room.roomName}>
                      {room.roomName} - Features: {room.features.join(', ')}
                    </li>
                  ))
                ) : (
                  <li>No room data available</li>
                )}
              </ul>
            </div>

            {/* Select Features */}
            <div className="flex mt-4">
              <div className="w-40 font-medium text-sm text-black">
                Select features
              </div>
              <ul className="text-sm text-black space-y-1">
                <li>Sea View</li>
                <li>Balcony View</li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-2/3 flex flex-col justify-start gap-3 md:gap-6 mt-3 md:mt-0">
            <div className="flex flex-col gap-3 md:gap-0 md:flex-row w-full justify-evenly">
              <div className="flex justify-between w-52 text-sm text-black">
                <span className="font-medium">Check-in time</span>
                <span>{checkInTime || 'N/A'}</span>
              </div>
              <div className="flex justify-between w-52 text-sm text-black">
                <span className="font-medium">Number of rooms</span>
                <span>{roomList.length}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:gap-0 md:flex-row w-full justify-evenly">
              <div className="flex justify-between w-52 text-sm text-black">
                <span className="font-medium">Check-out time</span>
                <span>{checkOutTime || 'N/A'}</span>
              </div>
              <div className="flex justify-between w-52 text-sm text-black">
                <span className="font-medium">Total staff</span>
                <span>{totalStaff}</span>
              </div>
            </div>
          </div>
        </div>
      </FormWrapper>
      <FormWrapper title="">
        <div className="flex flex-col gap-5">
          {data.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="w-1/3 text-sm text-gray-500">{item.title}</div>
              <div className="w-1/3 text-sm font-normal text-black">
                {item.number}
              </div>
              <div className="w-1/3 flex justify-start">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={100}
                  height={60}
                  className="rounded-md object-contain"
                />
              </div>
            </div>
          ))}

          {/* Additional Labels */}
          <div className="pt-6 space-y-6">
            <p className="text-sm font-medium text-black">
              Internet Connectivity
            </p>
            <p className="text-sm font-medium text-black">
              Software Compatibility
            </p>
          </div>
        </div>
      </FormWrapper>
    </div>
  );
};

export default CreateHotelIdForm;
