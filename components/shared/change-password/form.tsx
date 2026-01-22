'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FormWrapper from '@/components/shared/change-password/form-wrapper'; 
import {
  changePasswordSchema,
  ChangePasswordSchemaType
} from '../../../schema'; 
import apiCall from '@/lib/axios';

export default function ChangePasswordForm() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  
  const changePasswordForm = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  
  const onChangePasswordSubmit = async (data: ChangePasswordSchemaType) => {
    try {
      const payload = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      };

      const response = await apiCall(
        'POST',
        'api/superAdmin/change-password',
        payload
      );

      showSnackbar(
        response.message || 'Password changed successfully',
        'success'
      );
      changePasswordForm.reset();
    } catch (error: any) {
      
      
      showSnackbar(error.message || 'Failed to change password', 'error');
    }
  };

  return (
    <FormWrapper title="Change Password">
      <Form {...changePasswordForm}>
        <form
          onSubmit={changePasswordForm.handleSubmit(onChangePasswordSubmit)}
          className="lg:flex flex-col w-full bg-[#FAF6EF] h-full justify-center items-start space-y-6 bg-[AF6EF] shadow-custom p-8 border-none outline-none rounded-md"
        >
          <div className="flex justify-between items-center w-full">
            {}
            <FormField
              control={changePasswordForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Old Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Current Password"
                      className="bg-transparent text-black border-black border-opacity-20 placeholder:text-black placeholder:text-xs 2xl:text-sm 2xl:placeholder:text-sm placeholder:opacity-25"
                    />
                  </FormControl>
                  <FormMessage className="min-h-[20px] text-xs 2xl:text-sm" />
                </FormItem>
              )}
            />

            {}
            <FormField
              control={changePasswordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="New Password"
                      className="bg-transparent text-black border-black border-opacity-20 placeholder:text-black placeholder:text-xs 2xl:text-sm 2xl:placeholder:text-sm placeholder:opacity-25"
                    />
                  </FormControl>
                  <FormMessage className="min-h-[20px] text-xs 2xl:text-sm" />
                </FormItem>
              )}
            />

            {}
            <FormField
              control={changePasswordForm.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm New Password"
                      className="bg-transparent text-black border-black border-opacity-20 placeholder:text-black placeholder:text-xs 2xl:text-sm 2xl:placeholder:text-sm placeholder:opacity-25"
                    />
                  </FormControl>
                  <FormMessage className="min-h-[20px] text-xs 2xl:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {}
          <Button
            type="submit"
            className="btn-primary text-xs 2xl:text-sm xl:text-sm"
          >
            Save Changes
          </Button>
        </form>
      </Form>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        key={'topcenter'}
        autoHideDuration={3000}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </FormWrapper>
  );
}
