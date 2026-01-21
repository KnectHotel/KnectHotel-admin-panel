'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CardWrapper from './form-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { bookingSchema, bookingSchemaType } from 'schema';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useHotelRoomTypes } from '@/hooks/useHotelRoomTypes';
import { useHotelRooms } from '@/hooks/useHotelRooms';
import apiCall from '@/lib/axios';
import { ToastAtTopRight } from '@/lib/sweetalert';

const AddBookingForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { roomTypes, loading: loadingTypes } = useHotelRoomTypes(true);
  const { availableRooms, loading: loadingRooms } = useHotelRooms();

  const addBookingForm = useForm<bookingSchemaType>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNo: '',
      idProof: '',
      roomType: '',
      email: '',
      roomNo: '',
      paymentStatus: ''
    }
  });

  const selectedRoomTypeId = useWatch({
    control: addBookingForm.control,
    name: 'roomType'
  });

  const filteredRooms = availableRooms.filter(
    (room) => !selectedRoomTypeId || room.roomTypeId === selectedRoomTypeId
  );

  const toUtcIso = (date: Date) => {
    return date.toISOString();
  };

  const onSubmit = async (data: bookingSchemaType) => {
    try {
      setLoading(true);

      let hotelId = undefined;
      try {
        const item = sessionStorage.getItem('admin');
        if (item) {
          const adminData = JSON.parse(item);
          hotelId = adminData?.user?.HotelId || adminData?.HotelId || adminData?._id;
        }
      } catch (e) {
        console.error('Failed to parse admin session', e);
      }

      if (!hotelId) {
        ToastAtTopRight.fire({
          icon: 'error',
          title: 'Hotel ID missing',
          text: 'Please refresh the page and try again.'
        });
        setLoading(false);
        return;
      }

      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const selectedTypeFn = roomTypes.find(rt => rt.roomTypeId === data.roomType);
      const roomTypeName = selectedTypeFn ? selectedTypeFn.roomTypeName : '';

      const payload = {
        hotelId: hotelId,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNo,
        email: data.email,
        roomTypeId: data.roomType,
        roomTypeName: roomTypeName,
        assignedRoomNumber: data.roomNo,
        paymentStatus: data.paymentStatus,
        checkIn: toUtcIso(now),
        checkOut: toUtcIso(tomorrow),
        status: 'Confirmed',
        adultGuestsCount: 1,
        childrenGuestsCount: 0,
        roomStays: [
          {
            roomTypeId: data.roomType,
            roomTypeName: roomTypeName,
            numAdults: 1,
            numChildren: 0,
            roomId: ''
          }
        ],
        guests: [{
          firstName: data.firstName,
          lastName: data.lastName,
          guestType: 'adult',
          gender: 'Male',
          phoneNumber: data.phoneNo
        }]
      };

      const res = await apiCall('POST', '/api/booking/external/addBooking', payload);

      if (res?.success || res?.status === 200 || res?.booking) {
        ToastAtTopRight.fire({
          icon: 'success',
          title: 'Booking Created Successfully'
        });
        addBookingForm.reset();
        router.push('/hotel-panel/guest-management');
      } else {
        if (res?.success === false) {
          throw new Error(res?.message || 'Booking creation failed');
        }
        ToastAtTopRight.fire({
          icon: 'success',
          title: 'Booking Created Successfully'
        });
        addBookingForm.reset();
        router.push('/hotel-panel/guest-management');
      }

    } catch (error: any) {
      console.error('[AddBookingForm] Error:', error);
      ToastAtTopRight.fire({
        icon: 'error',
        title: error?.response?.data?.message || error?.message || 'Failed to create booking'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper title="Add Booking">
      <Form {...addBookingForm}>
        <form
          onSubmit={addBookingForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {}
          <div className="grid grid-cols-3 gap-10">
            <div className="flex flex-col gap-3">
              <FormField
                control={addBookingForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          type="text"
                          placeholder="Enter First Name"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        <span className="text-red-500">*</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addBookingForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          type="text"
                          placeholder="Enter Last Name"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        <span className="text-red-500">*</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-3">
              <FormField
                control={addBookingForm.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          type="text"
                          placeholder="Enter Phone Number"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        <span className="text-red-500">*</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addBookingForm.control}
                name="idProof"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      ID Proof
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          type="text"
                          placeholder="Enter ID Proof"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        <span className="text-red-500">*</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addBookingForm.control}
                name="roomType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Room Type
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            addBookingForm.setValue('roomNo', '');
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full text-left bg-[#F6EEE0] hover:text-black border-opacity-45 text-black">
                            <SelectValue placeholder={loadingTypes ? "Loading..." : "Select Room Type"} />
                          </SelectTrigger>
                          <SelectContent>
                            {roomTypes.filter(type => type.roomTypeName).map((type) => (
                              <SelectItem key={type.roomTypeId} value={type.roomTypeId}>
                                {type.roomTypeName} ({type.roomCount} rooms)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-red-500">*</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-3">
              <FormField
                control={addBookingForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Email ID
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          type="email"
                          placeholder="Enter Email ID"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        <span className="text-red-500">*</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addBookingForm.control}
                name="roomNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Room Number
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedRoomTypeId}
                        >
                          <SelectTrigger className="w-full text-left bg-[#F6EEE0] hover:text-black border-opacity-45 text-black/50">
                            <SelectValue placeholder={loadingRooms ? "Loading..." : "Select Room Number"} />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredRooms.map((room) => (
                              <SelectItem key={room._id} value={room.roomNumber}>
                                {room.roomNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-red-500">*</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addBookingForm.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Payment Status
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full text-left bg-[#F6EEE0] hover:text-black border-opacity-45 text-black">
                            <SelectValue placeholder="Select Payment Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-red-500">*</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default AddBookingForm;
