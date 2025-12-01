import { SOSManagementDataTable } from '@/components/tables/SOS-management/client';
import React from 'react';

const SOSManagementServicePage = () => {
  return (
    <div className="flex justify-center items-center h-full w-full pt-3">
      <div className="h-full w-full container">
        <SOSManagementDataTable />
      </div>
    </div>
  );
};

export default SOSManagementServicePage;
