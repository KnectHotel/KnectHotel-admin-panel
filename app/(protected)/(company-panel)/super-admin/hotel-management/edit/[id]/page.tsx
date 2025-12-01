import React from 'react';
import CreateHotelIdForm from '@/components/COMPANY_COMPONENTS/hotel-management/form/create-hotel-id-form';
import Navbar from '@/components/Navbar';
import HotelForm from '@/components/form/hotel-profile/hotel-form';

const EditHotelDetailsPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="w-full h-screen mt-16">
        <div className="h-full w-full">
          <HotelForm mode="edit" hotelId={id} />
        </div>
      </div>
    </div>
  );
};

export default EditHotelDetailsPage;
