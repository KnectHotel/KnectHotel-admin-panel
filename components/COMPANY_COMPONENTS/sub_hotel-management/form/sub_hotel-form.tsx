'use client';
import React, { useEffect, useState } from 'react';
import {
  dummySubHotelFormData,
  DummySubHotelFormDataType
} from '../../../../app/static/company-panel/SubHotelManagement';
import { useForm } from 'react-hook-form';
import {
  CreateSubHotelIdFormSchema,
  CreateSubHotelIdFormSchemaType,
  serviceOptions,
  ServiceType
} from '../../../../schema/company-panel';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Button } from '@/components/ui/button';
import apiCall from '@/lib/axios';

type Props = {
  subHotelID?: string;
  mode: string; // Explicit modes
};

type HotelApiResponse = {
  hotels: {
    HotelId: string;
    name: string;
    logo: string | null;
    phoneNo: string;
    email: string;
    address: string;
    parentHotel: {
      name: string;
    };
    servingDepartment: string[];
    subscriptionPlan: string;
    panNumber: { number: string };
    // Add other fields as needed
  }[];
};


const SubHotelIdForm = ({ subHotelID, mode }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);



  // Initialize form with default values from dummy data or empty
  const form = useForm<CreateSubHotelIdFormSchemaType>({
    resolver: zodResolver(CreateSubHotelIdFormSchema),
    defaultValues: {
      parentHotelID: '',
      subHotelImageUrl: '',
      subHotelImageFile: undefined,
      subHotelName: '',
      address: '',
      services: [],
      subscriptionPlan: '',
      subscriptionPrice: 0,
      subHotelID: '',
      contactNo: '',
      email: '',
      gstDetails: ''
    }
  });

  // Set initial preview if image URL exists in view/edit mode
  useEffect(() => {
    const fetchHotelData = async () => {
      if (!subHotelID || mode !== 'view') return;
      console.log('asdfghj', subHotelID)
      try {
        const res = await apiCall('GET', `api/hotel/get-hotel/${subHotelID}`);
        const data = res?.hotel;
        console.log('Date:', res?.hotel)
        if (data) {
          form.reset({
            parentHotelID: data?.parentHotel || '',
            subHotelImageUrl: data?.logo || '',
            subHotelImageFile: undefined, // In view mode, image file is not needed
            subHotelName: data?.name || '',
            address: data?.address || '',
            services: (data?.servingDepartment || []) as ServiceType[],
            subscriptionPlan: data?.subscriptionPlan || '',
            subscriptionPrice: 2999, // You can fetch actual price if available
            subHotelID: data?.HotelId || '',
            contactNo: data?.phoneNo || '',
            email: data?.email || '',
            gstDetails: data?.panNumber?.number || ''
          });

          if (data?.logo) setPreview(data.logo);
        }
      } catch (error) {
        console.error('Failed to fetch hotel data:', error);
      }
    };


    fetchHotelData();
  }, [subHotelID, mode, form]);

  const onSubmit = async (data: CreateSubHotelIdFormSchemaType) => {
    setIsSubmitting(true);
    try {
      console.log('Submitted data:', data);
      setSubmitStatus('success');
      if (mode === 'create') {
        form.reset();
        setPreview(null);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper
      title={mode === 'create' ? 'Create Sub-Hotel' : 'Sub-Hotel Details'}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:px-8 gap-8 justify-center pt-8 items-center"
        >
          {/* Image Display or Upload */}
          {mode === 'view' && preview ? (
            <div className="h-32 w-32">
              <Image
                src={preview}
                alt={'Sub-Hotel Image'}
                height={176}
                width={176}
                className="object-cover rounded-lg"
              />
            </div>
          ) : (
            <FormField
              control={form.control}
              name="subHotelImageFile"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center items-center tracking-wide">
                  <div className="flex items-center w-full">
                    <FormControl>
                      <div
                        className="relative h-32 w-32 rounded-lg bg-[#F6EEE0] hover:drop-shadow-xl duration-200"
                        onDrop={(e) => {
                          if (mode === 'view') return;
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            if (!file.type.startsWith('image/')) {
                              alert('Please upload an image file.');
                              return;
                            }
                            if (file.size > 5 * 1024 * 1024) {
                              alert('File size exceeds 5MB.');
                              return;
                            }
                            if (preview) URL.revokeObjectURL(preview);
                            const imageUrl = URL.createObjectURL(file);
                            setPreview(imageUrl);
                            field.onChange(file);
                          }
                        }}
                        onDragOver={(e) => {
                          if (mode === 'view') return;
                          e.preventDefault();
                        }}
                      >
                        <div className="h-full w-full flex items-center justify-center relative">
                          {preview ? (
                            <>
                              <Image
                                src={preview}
                                alt="Sub-Hotel Preview"
                                height={176}
                                width={176}
                                className="object-cover h-full w-full rounded-lg"
                              />
                              {mode !== 'view' && (
                                <label
                                  htmlFor="fileUpload"
                                  className="absolute inset-0 flex justify-center items-center cursor-pointer bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity rounded-lg"
                                  aria-label="Reupload sub-hotel image"
                                >
                                  <PiCameraThin className="text-white w-12 h-12 opacity-70" />
                                </label>
                              )}
                            </>
                          ) : (
                            mode !== 'view' && (
                              <label
                                htmlFor="fileUpload"
                                className="absolute inset-0 flex justify-center items-center cursor-pointer"
                                aria-label="Upload sub-hotel image"
                              >
                                <PiCameraThin className="text-black w-12 h-12 opacity-30" />
                              </label>
                            )
                          )}
                        </div>
                        {mode !== 'view' && (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (!file.type.startsWith('image/')) {
                                  alert('Please upload an image file.');
                                  return;
                                }
                                if (file.size > 5 * 1024 * 1024) {
                                  alert('File size exceeds 5MB.');
                                  return;
                                }
                                if (preview) URL.revokeObjectURL(preview);
                                const imageUrl = URL.createObjectURL(file);
                                setPreview(imageUrl);
                                field.onChange(file);
                              } else {
                                setPreview(null);
                                field.onChange(undefined);
                              }
                            }}
                            className="hidden"
                            id="fileUpload"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          )}

          {/* Form Fields */}
          <div className="w-full flex flex-col md:flex-row justify-between items-start gap-4">
            {/* Left Part */}
            <div className="flex flex-col gap-3 w-full max-w-md">
              <FormField
                control={form.control}
                name="parentHotelID"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center">
                    <FormLabel className="w-full sm:w-36 text-sm text-nowrap font-medium text-gray-700">
                      Parent Hotel ID
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          disabled={mode === 'view'}
                          placeholder="e.g., PH001"
                          className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-gray-900 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subHotelName"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center">
                    <FormLabel className="w-full sm:w-32 text-sm font-medium text-gray-700">
                      Sub Hotel Name
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          disabled={mode === 'view'}
                          placeholder="e.g., Hotel Serenity"
                          className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-gray-900 rounded-md border-none outline-none focus:ring-0 text-sm"
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
                  <FormItem className="flex flex-col sm:flex-row sm:items-start">
                    <FormLabel className="w-full sm:w-32 text-sm font-medium text-gray-700">
                      Address
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={mode === 'view'}
                          placeholder="e.g., 123 Peace Road, Colombo"
                          className="w-full h-16 px-2 py-1 bg-[#F6EEE0] text-gray-900 rounded-md border-none outline-none focus:ring-0 text-sm resize-none"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            {/* Right Part */}
            <div className="flex flex-col gap-3 w-full max-w-md">
              <FormField
                control={form.control}
                name="subHotelID"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center">
                    <FormLabel className="w-full sm:w-32 text-sm font-medium text-gray-700">
                      Sub-Hotel ID
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          disabled={mode === 'view'}
                          placeholder="e.g., SH001"
                          className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-gray-900 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNo"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center">
                    <FormLabel className="w-full sm:w-32 text-sm font-medium text-gray-700">
                      Contact
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          disabled={mode === 'view'}
                          placeholder="e.g., +94123456789"
                          className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-gray-900 rounded-md border-none outline-none focus:ring-0 text-sm"
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
                    <FormLabel className="w-full sm:w-32 text-sm font-medium text-gray-700">
                      Email
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          disabled={mode === 'view'}
                          placeholder="e.g., contact@hotel.com"
                          className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-gray-900 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Services and Subscription */}
          <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col w-fit sm:flex-row">
              {/* Label */}
              <label className="w-full sm:w-32 text-sm font-medium text-black pt-1">
                Services
              </label>

              {/* Services Grid */}
              <div className="w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4">
                  {serviceOptions.map((service, index) => (
                    <div key={service} className="flex items-center mb-2">
                      <span className="text-sm text-black capitalize px-2 py-1 bg-lightbrown rounded cursor-pointer hover:bg-fadedCream transition">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row justify-between items-start gap-4">
              <FormField
                control={form.control}
                name="subscriptionPlan"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <FormLabel className="w-full mb-5 text-nowrap sm:w-32 text-sm font-medium text-black">
                      Subscription Plan
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          value={field.value}
                          className="w-fit placeholder:opacity-65 mb-1 h-8 bg-transparent bg-lightbrown text-black rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                        {/* ****Hardcoded for now**** */}
                      </FormControl>
                      <span className="text-sm min-h-8 text-goldenBrown ml-2">
                        INR- 2999/month
                      </span>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gstDetails"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center">
                    <FormLabel className="w-full sm:w-32 text-sm font-medium text-gray-700">
                      GST Details
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          disabled={mode === 'view'}
                          className="w-full lg:w-80 placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-gray-900 rounded-md border-none outline-none focus:ring-0 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          {mode !== 'view' && (
            <div className="w-full flex justify-start items-center">
              <Button
                type="submit"
                disabled={isSubmitting || mode === 'view'}
                className="btn-primary"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              {submitStatus === 'success' && (
                <p className="text-green-600 text-sm ml-4">
                  Form submitted successfully!
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-600 text-sm ml-4">
                  An error occurred. Please try again.
                </p>
              )}
            </div>
          )}
        </form>
      </Form>
    </FormWrapper>
  );
};

export default SubHotelIdForm;
