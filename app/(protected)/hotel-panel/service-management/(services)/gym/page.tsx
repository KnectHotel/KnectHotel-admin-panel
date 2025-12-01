import { GymServiceTable } from '@/components/tables/gym-service/client';
import React from 'react';

const GymServicePage = () => {
  return (
    <div className="flex justify-center items-center h-full w-full pt-3">
      <div className="h-full w-full px-4">
        <GymServiceTable />
      </div>
    </div>
  );
};

export default GymServicePage;
