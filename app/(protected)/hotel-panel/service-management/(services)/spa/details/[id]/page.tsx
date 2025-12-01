import SpaServiceRequestDetail from '@/components/service-management/spa/RequestDetail';
import React from 'react';
import { SpaServiceData } from 'app/static/services-management/Spa';
type Params = {
  id: string;
};
const ViewDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div className="flex justify-center items-center h-screen w-full pt-28">
      <div className="h-full w-full container">
        <SpaServiceRequestDetail serviceID={id} />
      </div>
    </div>
  );
};

export default ViewDetails;
