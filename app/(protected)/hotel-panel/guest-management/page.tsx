import Navbar from '@/components/Navbar';
import { GuestClient } from '@/components/tables/guest-table/client';
import React from 'react';

const GuestManagementPage = () => {
  return (
    <div className="flex flex-col w-full">
      <Navbar active={true} search={true} />
      <div className=" sm:px-6 sm:py-0 mt-20">
        <GuestClient />
      </div>
    </div>
  );
};

export default GuestManagementPage;
