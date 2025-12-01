import React from 'react';
import CreateHotelIdForm from '@/components/COMPANY_COMPONENTS/hotel-management/form/create-hotel-id-form';
import Navbar from '@/components/Navbar';
import HotelForm from '@/components/form/hotel-profile/hotel-form';
const ViewHotelDetailsPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="w-full px-4 md:px-8 py-10 mt-8">
        <HotelForm mode='view' hotelId={id}/>
      </div>
    </div>
  );
};

export default ViewHotelDetailsPage;
