import { ReceptionServiceTable } from '@/components/tables/reception-service/client';
import React from 'react';

const ReceptionPage = () => {
  return (
    <div className="flex justify-center items-center h-full w-full pt-3">
      <div className="h-full w-full">
        <ReceptionServiceTable />
      </div>
    </div>
  );
};

export default ReceptionPage;
