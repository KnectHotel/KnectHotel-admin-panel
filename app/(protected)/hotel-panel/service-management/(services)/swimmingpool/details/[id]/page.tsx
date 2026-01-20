






















import React from 'react';
import SwimmingPoolRequestDetail from '@/components/service-management/swimming-pool/RequestDetail';

const ViewDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  return (
    <div className="flex justify-center items-center h-screen w-full pt-28">
      <div className="h-full w-full container">
        <SwimmingPoolRequestDetail serviceID={id} />
      </div>
    </div>
  );
};

export default ViewDetails;
