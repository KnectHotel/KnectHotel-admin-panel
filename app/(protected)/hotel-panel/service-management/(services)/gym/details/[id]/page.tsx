import RequestDetail from '@/components/service-management/RequestDetail';
import React from 'react';
type Params = {
  id: string;
};
const ViewDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  console.log(id)
  return (
    <div className="flex justify-center items-center h-screen w-full pt-28">
      <div className="h-full w-full container">
        <RequestDetail requestId={id} mode="gym" />
      </div>
    </div>
  );
};

export default ViewDetails;
