import GuestForm from '@/components/form/guest-management/guest-form';
import Navbar from '@/components/Navbar';
import React from 'react';

const AddGuestPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen w-full pt-8 mt-16">
        <div className="h-full w-full container">
          <GuestForm isEnabled={true} mode="add" />
        </div>
      </div>
    </>
  );
};

export default AddGuestPage;
