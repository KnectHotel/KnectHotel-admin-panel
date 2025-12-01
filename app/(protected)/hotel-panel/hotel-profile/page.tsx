'use client';
import HotelFormprofile from '@/components/form/hotel-profile/hotel-form-profile';
import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';
import { getSessionStorageItem } from 'utils/localstorage';

const HotelProfile = () => {
  const [HotelId, setHotelId] = useState<string | null>(null);

  useEffect(() => {
    const adminData = getSessionStorageItem<any>('admin');
    // console.log('Raw session storage:', adminData);
    setHotelId(adminData?.user?.HotelId || null);
  }, []);

  if (!HotelId) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <h1 className="text-2xl font-bold">Hotel not found</h1>
      </div>
    );
  }

  return (
    <div className="w-full flex-col justify-center items-center">
      <Navbar />
      <div className="flex flex-col min-h-screen w-full bg-white py-6 mt-10">
        <div className="h-full w-full">
          <HotelFormprofile mode="edit" hotelId={HotelId} />
        </div>
      </div>
    </div>
  );
};

export default HotelProfile;
