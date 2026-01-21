'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import FormWrapper from './form-wrapper';
import { employeeSchema, employeeSchemaType } from 'schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { ChevronDown } from 'lucide-react';

type Props = {
  employeeID?: string;
  isEnabled?: boolean;
  mode: string;
};

const EditEmployeeForm = ({ employeeID, isEnabled, mode }: Props) => {
  const router = useRouter();

  const employeeForm = useForm<employeeSchemaType>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNo: '',
      role: '',
      status: 'Active'
    }
  });

  const onSubmit = (data: any) => {
    employeeForm.reset();
  };

  return (
    <FormWrapper title={'Employee Profile'}>
      <Form {...employeeForm}>
        <form
          onSubmit={employeeForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-4">
            {}
            <div className="flex gap-4">
              <FormField
                control={employeeForm.control}
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
                          placeholder="First Name"
                          {...field}
                          className="bg-[#F6EEE0] text-black border-none placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-45 pr-10"
                        />{' '}
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
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
                          placeholder="Last Name"
                          {...field}
                          className="bg-[#F6EEE0] text-black border-none placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-45 pr-10"
                        />{' '}
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          type="email"
                          placeholder="Email ID"
                          {...field}
                          className="bg-[#F6EEE0] text-black border-none placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-45 pr-10"
                        />
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                          className="bg-[#F6EEE0] text-black border-none placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-45 pr-10"
                        />
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {}
            <div className="flex items-center gap-2">
              <FormField
                control={employeeForm.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          type="text"
                          placeholder="Phone No"
                          {...field}
                          className="bg-[#F6EEE0] text-black border-none placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-45 pr-10"
                        />
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Role
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          type="text"
                          placeholder="Role"
                          {...field}
                          className="bg-[#F6EEE0] text-black border-none placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-45 pr-10"
                        />
                        {isEnabled && <span className="text-red-500">*</span>}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-24 bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#362913] rounded-2xl text-white border-2 shadow-md border-white">
                          {['Active', 'Inactive'].map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    <ChevronDown className="absolute right-1 top-[2.2rem] text-black w-4 h-4" />
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
            <Button type="submit" className="btn-primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
};

export default EditEmployeeForm;
