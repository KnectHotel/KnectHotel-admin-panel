import Navbar from '@/components/Navbar';
import ChangePasswordForm from '@/components/shared/change-password/form';
import React from 'react';

const ChangePasswordPage = () => {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="sm:px-6 sm:py-0 mt-16">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
