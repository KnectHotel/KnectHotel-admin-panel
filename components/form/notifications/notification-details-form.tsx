'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import FormWrapper from './form-wrapper';
import { notificationSchema, notificationSchemaType } from 'schema'; // Assumed schema
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  notificationsData,
  NotificationsDataType
} from 'app/static/ServiceManagementData';
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

type Props = {
  notificationId?: string; // Changed from guestId
  isEnabled?: boolean;
  mode: string;
};

// Assuming this is the GuestDataType from your notification data
type GuestDataType = {
  notificationID: string;
  dateAndTime: {
    date: string;
    time: string;
  };
  guestDetails: {
    name: string;
    phoneNo: string;
    roomNo: string;
  };
  notificationType: 'Email';
  Status: 'Received' | 'Sent';
};

const NotificationDetailsForm = ({
  notificationId,
  isEnabled,
  mode
}: Props) => {
  const router = useRouter();

  // Get notification details using notificationId
  const getNotificationDetails = (notificationId: string | undefined) => {
    if (notificationId) {
      return notificationsData.find(
        (notification) => notification.notificationID === notificationId
      );
    } else {
      return null;
    }
  };
  const notification = getNotificationDetails(notificationId);

  // Initialize form with notification data
  const addNotificationForm = useForm<notificationSchemaType>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      notificationID: notification?.notificationID || '',
      date: notification?.dateAndTime?.date || '',
      time: notification?.dateAndTime?.time || '',
      name: notification?.guestDetails?.name || '',
      phoneNo: notification?.guestDetails?.phoneNo || '',
      roomNo: notification?.guestDetails?.roomNo || '',
      notificationType: notification?.notificationType || 'Email',
      Status: notification?.Status || 'Received'
    }
  });

  const onSubmit = (data: any) => {
    console.log(data);
    addNotificationForm.reset({
      notificationID: '',
      date: '',
      time: '',
      name: '',
      phoneNo: '',
      roomNo: '',
      notificationType: 'Email',
      Status: 'Received'
    });
  };

  return (
    <FormWrapper
      title={
        mode === 'edit' ? 'Edit Notification Details' : 'Notification Details'
      }
    >
      <Form {...addNotificationForm}>
        <form
          onSubmit={addNotificationForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 pb-6 "
        >
          {/* Form Fields */}
          <div className="grid grid-cols-3 gap-10">
            <div className="flex flex-col gap-4">
              <FormField
                control={addNotificationForm.control}
                name="notificationID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Notification ID
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          disabled={!isEnabled}
                          type="text"
                          placeholder="Notification ID"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addNotificationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Guest Name
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          disabled={!isEnabled}
                          type="text"
                          placeholder="Guest Name"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-3">
              <FormField
                control={addNotificationForm.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          disabled={!isEnabled}
                          type="text"
                          placeholder="Phone Number"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addNotificationForm.control}
                name="roomNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Room Number
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          disabled={!isEnabled}
                          type="text"
                          placeholder="Room Number"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addNotificationForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Date
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          disabled={!isEnabled}
                          type="text"
                          placeholder="Date"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-3">
              <FormField
                control={addNotificationForm.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Time
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          disabled={!isEnabled}
                          type="text"
                          placeholder="Time"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addNotificationForm.control}
                name="notificationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Notification Type
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          disabled={!isEnabled}
                          type="text"
                          placeholder="Notification Type"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addNotificationForm.control}
                name="Status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Status
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          disabled={!isEnabled}
                          type="text"
                          placeholder="Status"
                          {...field}
                          className="bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none outline-none focus:ring-0 text-xs 2xl:text-sm"
                        />
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Buttons */}
          {isEnabled && (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                Cancel
              </Button>
              <Button type="submit" className="btn-primary">
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </Form>
    </FormWrapper>
  );
};

export default NotificationDetailsForm;
