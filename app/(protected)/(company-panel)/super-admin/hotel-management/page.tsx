import { HotelManagementHome } from '@/components/COMPANY_COMPONENTS/hotel-management/table/client';
import Navbar from '@/components/Navbar';
import { Heading } from '@/components/ui/heading';
import React from 'react';

const HotelPage = () => {
  return (
    <div className="flex flex-col w-full">
      <Navbar active search />
      <div className="sm:px-6 sm:py-0 mt-24">
        <HotelManagementHome />
      </div>
    </div>
  );
};

export default HotelPage;
