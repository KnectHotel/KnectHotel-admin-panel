'use client';
import React, { useEffect, useState } from 'react';
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
import { ToastAtTopRight } from '@/lib/sweetalert';
import apiCall from '@/lib/axios';

type Props = {
  employeeID?: string;
  isEnabled?: boolean;
  mode: string;
  employeeData?: any;
};

interface Role {
  _id: string;
  name: string;
}

const EmployeeForm = ({ employeeID, isEnabled, mode, employeeData }: Props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const router = useRouter();

  // Fetch roles when the form is opened
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiCall<{ status: boolean; roles: Role[] }>(
          'GET',
          'api/role/get-all-roles'
        );
        console.log('aaaaaaaaaa', response);
        if (response.status) {
          setRoles(response.roles); // Set roles in state
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const employeeForm = useForm<employeeSchemaType>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: employeeData?.firstName || '',
      lastName: employeeData?.lastName || '',
      email: employeeData?.email || '',
      password: employeeData?.password || '',
      phoneNo: employeeData?.mobileNumber || '',
      role: employeeData?.roleId?._id || '',
      status: employeeData?.status || 'Active'
    }
  });

  const onSubmit = async (data: employeeSchemaType) => {
    try {
      const payload: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobileNumber: data.phoneNo,
        roleId: data.role,
        status: data.status
      };

      // If not in 'edit' mode, include the password (i.e., creating a new employee)
      if (mode !== 'edit' && data.password) {
        payload.password = data.password;
      }

      let response;
      if (mode === 'edit') {
        // If editing, send PUT request (without password)
        response = await apiCall<{ status: boolean; message: string }>(
          'PUT',
          `api/employee/${employeeID}`, // Employee ID for editing
          payload
        );
      } else {
        // If creating, send POST request (with password)
        response = await apiCall<{ status: boolean; message: string }>(
          'POST',
          'api/employee/',
          payload
        );
      }

      if (response.status) {
        setIsSubmitted(true);
        ToastAtTopRight.fire({
          icon: 'success',
          title:
            mode === 'edit'
              ? 'Employee Updated successfully'
              : 'Employee Created successfully'
        });
        router.push('/hotel-panel/employee-management');
      }
    } catch (err) {
      console.error('Failed to save employee:', err);
      ToastAtTopRight.fire({
        icon: 'error',
        title:
          mode === 'edit'
            ? 'Failed to update employee'
            : 'Failed to create employee'
      });
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      employeeForm.reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNo: '',
        role: '',
        status: 'Active'
      });
      console.log('Form state after reset:', employeeForm.getValues());
      setIsSubmitted(false);
    }
  }, [isSubmitted, employeeForm]);

  return (
    <FormWrapper title={`Employee Profile ${mode === 'edit' ? 'Edit' : ''}`}>
      <Form {...employeeForm}>
        <form
          onSubmit={employeeForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={employeeForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black text-[0.8rem]">
                    First Name
                    {isEnabled && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      <Input
                        type="text"
                        placeholder="First Name"
                        {...field}
                        className="bg-[#F6EEE0] text-black border-none placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-45 pr-10"
                      />
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
                    {isEnabled && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      <Input
                        type="text"
                        placeholder="Last Name"
                        {...field}
                        className="bg-[#F6EEE0] text-black border-none placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-45 pr-10"
                      />
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
                    {isEnabled && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      <Input
                        type="email"
                        placeholder="Email ID"
                        {...field}
                        className="bg-[#F6EEE0] text-black border-none placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-45 pr-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode == 'add' && (
              <FormField
                control={employeeForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Password
                      {isEnabled && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                          className="bg-[#F6EEE0] text-black border-none placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-45 pr-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={employeeForm.control}
              name="phoneNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black text-[0.8rem]">
                    Phone Number
                    {isEnabled && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      <Input
                        type="text"
                        placeholder="Phone No"
                        {...field}
                        maxLength={10}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                          if (value.length <= 10) {
                            field.onChange(value);
                          }
                        }}
                        className="bg-[#F6EEE0] text-black border-none placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-45 pr-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={employeeForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black text-[0.8rem]">
                    Role
                    {isEnabled && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none relative pr-8">
                          <SelectValue placeholder="Select Role" />
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#362913] rounded-2xl text-white border-2 shadow-md border-white">
                          {roles.map((role) => (
                            <SelectItem key={role._id} value={role._id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={employeeForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black text-[0.8rem]">
                    Role
                    {isEnabled && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none relative pr-8">
                          <SelectValue placeholder="Select Role" />
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                        </SelectTrigger>

                        {/* 👇 Add these two classes */}
                        <SelectContent className="bg-[#362913] rounded-2xl text-white border-2 shadow-md border-white max-h-56 overflow-y-auto">
                          {roles.map((role) => (
                            <SelectItem key={role._id} value={role._id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none">
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
    </FormWrapper>
  );
};

export default EmployeeForm;
