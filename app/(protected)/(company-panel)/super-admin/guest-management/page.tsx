import { CompanyPanelGuestManagementHome } from '@/components/COMPANY_COMPONENTS/guest_management/table/client';
import Navbar from '@/components/Navbar';
import { Heading } from '@/components/ui/heading';
import React from 'react';

const GuestManagementPage = () => {
  return (
    <div className="flex flex-col w-full">
      <Navbar active search />
      <div className='container px-7 mt-20'>
      </div>
      <div className="w-full h-screen">
        <div className="h-full w-full container">
          <CompanyPanelGuestManagementHome />
        </div>
      </div>
    </div>
  );
};

export default GuestManagementPage;
