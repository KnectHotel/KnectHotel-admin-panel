import React from 'react';
import SubHotelIdForm from '@/components/COMPANY_COMPONENTS/sub_hotel-management/form/sub_hotel-form';
import Navbar from '@/components/Navbar';
const ViewSubHotelDetailsPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  
  return (
    <div className="flex flex-col w-full">
      <Navbar active search />
      <div className="flex justify-center items-center w-full px-6 md:px-14 py-10 mt-16">
        <SubHotelIdForm subHotelID={id} mode="view" />
      </div>
    </div>
  );
};

export default ViewSubHotelDetailsPage;
























