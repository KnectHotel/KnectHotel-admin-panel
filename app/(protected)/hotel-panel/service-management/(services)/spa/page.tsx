import { SpaServiceDataTable } from '@/components/tables/spa-service/client';
import React from 'react';

const HousekeepingPage = () => {
  return (
    <div className="flex justify-center items-center h-full w-full pt-3">
      <div className="h-full w-full container">
        <SpaServiceDataTable />
      </div>
    </div>
  );
};

export default HousekeepingPage;
