'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import CardWrapper from './form-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
const AddBookingForm = () => {
  const router = useRouter();
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
  const onSubmit = (data: any) => {
    console.log(data);
    addBookingForm.reset();
  };

  return (
    <CardWrapper title="Add Booking">
      <Form {...addBookingForm}>
        <form
          onSubmit={addBookingForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Form Fields */}
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
                        <Input
                          type="text"
                          placeholder="Enter Room Type"
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
                        <Input
                          type="text"
                          placeholder="Enter Room Number"
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
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Payment Status
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Select
                          onValueChange={field.onChange} // Updates the form field value
                          value={field.value} // Controlled value from the form
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

          {/* Buttons */}
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
        </form>
      </Form>
    </CardWrapper>
  );
};

export default AddBookingForm;
