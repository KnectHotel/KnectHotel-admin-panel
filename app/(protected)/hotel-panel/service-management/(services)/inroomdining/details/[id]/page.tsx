import RequestDetail from '@/components/service-management/RequestDetail';
import React from 'react';
type Params = {
  id: string;
};












const ViewDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  console.log('Received requestId:', id);
  if (!id) {
    console.error('Request ID is missing');
    return <div>Error: Request ID is missing</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen w-full pt-28">
      <div className="h-full w-full container">
        {}
        <RequestDetail requestId={id} mode="inroomdining" />
      </div>
    </div>
  );
};

export default ViewDetails;
