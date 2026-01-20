'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  PriceTimeSettingConciergeSchema,
  PriceTimeSettingConciergeSchemaType
} from 'schema';
import exchageIcon from '../../../public/assets/exchange.png';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../ui/form';
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import { Button } from '../../ui/button';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PriceTimeSettingConciergeModal: React.FC<ModalProps> = ({
  isOpen,
  onClose
}) => {
  const form = useForm<PriceTimeSettingConciergeSchemaType>({
    resolver: zodResolver(PriceTimeSettingConciergeSchema),
    defaultValues: {
      priceType: 'Free',
      price: 0,
      timeSlot: '5:00AM-12:00PM',
      availability: 'Monday-Friday'
    }
  });

  
  const priceType = form.watch('priceType');
  if (!isOpen) return null;

  const onSubmit = async (data: PriceTimeSettingConciergeSchemaType) => {
    try {
      console.log('Price settings submitted:', data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error setting price:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg flex flex-col gap-6 p-6 w-full max-w-lg relative animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-medium ">Settings</h5>
            <p className="text-gray-500 text-sm mt-1">
              Edit time or price according to availability
            </p>
          </div>
          {}
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✖
          </button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center">
                <span className="text-sm font-semibold">Price</span>
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="priceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-24 bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#362913] rounded-2xl text-white border-2 shadow-md border-white">
                              {['Free', 'Paid'].map((value) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span
                    onClick={() => {
                      const currentType = form.getValues('priceType');
                      const newType = currentType === 'Free' ? 'Paid' : 'Free';
                      form.setValue('priceType', newType);
                    }}
                    className="cursor-pointer"
                  >
                    <Image
                      src={exchageIcon}
                      alt="icon"
                      height={20}
                      width={20}
                    />
                  </span>
                </div>
              </div>

              {}
              {priceType === 'Paid' && (
                <div className="flex gap-4 items-center justify-center">
                  <span className="text-sm pb-6 font-semibold">Amount</span>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Amount"
                            {...field}
                            className="w-32 h-9 bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none"
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage className="text-[10px] text-red-500" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-sm font-semibold text-gray-500">
                      Select Time Slot
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          {[
                            '5:00AM-12:00PM',
                            '12:00PM-10:00PM',
                            '10:00PM-1:00AM',
                            '11:00PM-12:00AM'
                          ].map((value) => (
                            <div
                              key={value}
                              className="flex items-center space-x-3"
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
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-sm font-semibold text-gray-500">
                      select Availability
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          {[
                            'Monday-Friday',
                            'Monday-Saturday',
                            'Monday-Sunday',
                            'Only Weekends'
                          ].map((value) => (
                            <div
                              key={value}
                              className="flex items-center space-x-3"
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

            <div className="w-full flex pt-6 justify-start items-center">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 relative">
                    <FormLabel className="text-sm w-fit text-nowrap font-medium text-gray-700">
                      Select Category
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-44 bg-lightbrown text-gray-700 py-4 px-2 rounded-md border-none">
                          <SelectValue placeholder="Select type" />
                          <ChevronDown className="ml-2 mt-1 h-5 w-5 text-black" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#362913] text-nowrap rounded-2xl text-white border-2 shadow-md border-white">
                          {['Electricity', 'Electronics'].map((value) => (
                            <SelectItem
                              key={value}
                              value={value}
                              className="text-nowrap"
                            >
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full text-center">
              <Button
                type="submit"
                className="btn-primary text-xs 2xl:text-sm xl:text-sm mt-6"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PriceTimeSettingConciergeModal;
