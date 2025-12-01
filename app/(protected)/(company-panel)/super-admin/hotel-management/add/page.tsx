import React from 'react';
import CreateHotelIdForm from '@/components/COMPANY_COMPONENTS/hotel-management/form/create-hotel-id-form';
import Navbar from '@/components/Navbar';
import HotelForm from '@/components/form/hotel-profile/hotel-form';

const CreateHotelIDPage = () => {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="w-full h-screen mt-14">
        <div className="h-full w-full">
          <HotelForm mode='add'/>
        </div>
      </div>
    </div>
  );
};

export default CreateHotelIDPage;
