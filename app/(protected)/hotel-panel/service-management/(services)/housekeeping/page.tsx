import { HousekeepingServiceTable } from '@/components/tables/housekeeping-service/client';
import React from 'react';

const HousekeepingPage = () => {
  return (
    <div className="flex justify-center items-center h-full w-full pt-3">
      <div className="h-full w-full px-2 md:px-0">
        <HousekeepingServiceTable /> 
      </div>
    </div>
  );
};

export default HousekeepingPage;
