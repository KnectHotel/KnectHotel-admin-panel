
'use client';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormWrapper from './form-wrapper';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import apiCall from '@/lib/axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';


const SubscriptionManagementFormSchema = z.object({
  planName: z.string().min(1, 'Plan name is required'),
  planDuration: z.preprocess(val => Number(val), z.number()),
  planType: z.string().min(1, 'Plan type is required'),
  description: z.string().min(1, 'Description is required'),
  cost: z.union([z.string(), z.number()])
    .transform(Number)
    .refine(val => val >= 0, {
      message: 'Cost cannot be negative',
    }),
});

type SubscriptionManagementFormSchemaType = z.infer<typeof SubscriptionManagementFormSchema>;

interface Props {
  mode?: 'add' | 'edit' | 'view';
  uniqueId?: string;
  id?: string;
}

const SubscriptionManagementForm: React.FC<Props> = ({ id, mode = 'view' }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubscriptionManagementFormSchemaType>({
    resolver: zodResolver(SubscriptionManagementFormSchema),
    defaultValues: {
      planName: '',
      planDuration: 0,
      planType: '',
      description: '',
      cost: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if ((mode === 'edit' || mode === 'view') && id) {
        try {
          const res = await apiCall('GET', `/api/subscription/${id}`);
          const data = res?.data;

          if (data) {
            form.reset({
              planName: data.planName,
              planDuration: Number(data.planDuration),
              planType: data.planType,
              description: data.description,
              cost: Number(data.cost)
            });
          }
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      }
    };

    fetchData();
  }, [mode, id, form]);

  const onSubmit = async (formData: SubscriptionManagementFormSchemaType) => {
    setIsSubmitting(true);
    try {
      await apiCall('POST', '/api/subscription', formData);
      router.back();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper title="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 py-7 px-2"
        >
          <div className="flex flex-row gap-8">
            {}
            <div className="w-1/2 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="planName"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start w-full">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Plan Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={mode === 'view' || isSubmitting}
                        {...field}
                        placeholder="Enter Plan Name"
                        className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-gray-900 text-xs 2xl:text-sm border-none rounded-md focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start w-full">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={mode === 'view' || isSubmitting}
                        {...field}
                        placeholder="Enter Description"
                        className="w-full h-44 min-h-[80px] p-2 bg-[#F6EEE0] text-gray-900 text-xs 2xl:text-sm border-none rounded-md resize-y focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] mt-1" />
                  </FormItem>
                )}
              />
            </div>

            {}
            <div className="w-1/2 flex flex-col gap-6">
              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="planDuration"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start w-full">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Plan Duration(Month)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={mode === 'view' || isSubmitting}
                          {...field}
                          value={field.value ?? ''}
                          placeholder="Enter Plan Duration"
                          className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-gray-900 text-xs 2xl:text-sm border-none rounded-md focus:ring-0"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </FormItem>
                  )}
                />
                {}
                <FormField
                  control={form.control}
                  name="planType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start w-full mr-8">
                      <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                        Plan Type
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={mode === 'view' || isSubmitting}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full h-8 px-2 py-1 text-gray-900 text-xs 2xl:text-sm border-none rounded-md focus:ring-0 placeholder:opacity-65 relative pr-8">
                            <SelectValue placeholder="Select Plan Type" />
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#FAF6EF] text-gray-900 text-sm rounded-md shadow-md">
                            {['Monthly', 'Quarterly', 'Semi Annual', 'Annual'].map((item) => (
                              <SelectItem
                                key={item}
                                value={item}
                                className="hover:bg-[#EEE8DC] focus:bg-[#EEE8DC] cursor-pointer px-2 py-1 rounded"
                              >
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-[10px] mt-1" />
                    </FormItem>
                  )}
                />


              </div>

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start w-full">
                    <FormLabel className="text-xs 2xl:text-sm font-medium text-gray-700">
                      Subscription Price (Excluding GST)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={mode === 'view' || isSubmitting}
                        {...field}
                        value={field.value ?? ''}
                        placeholder="Enter Cost"
                        className="w-full placeholder:opacity-65 h-8 px-2 py-1 bg-[#F6EEE0] text-gray-900 text-xs 2xl:text-sm border-none rounded-md focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] mt-1" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-start w-full pt-6 gap-3">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-[#EFE9DF] h-8 px-2 text-sm hover:outline hover:outline-black"
            >
              Cancel
            </Button>
            {mode !== 'view' && (
              <Button
                type="submit"
                className="bg-[#A07D3D] h-8 px-2 text-sm text-white hover:text-black hover:outline hover:outline-black"
                disabled={isSubmitting}
              >
                Save
              </Button>
            )}
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
};

export default SubscriptionManagementForm;
