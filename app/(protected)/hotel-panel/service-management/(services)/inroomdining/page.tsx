import { InRoomDiningDataTable } from '@/components/tables/In_Room_Dining-Service/client';
import React from 'react';

const HousekeepingPage = () => {
  return (
    <div className="flex justify-center items-center h-full w-full pt-3">
      <div className="h-full w-full container">
        <InRoomDiningDataTable />
      </div>
    </div>
  );
};

export default HousekeepingPage;
