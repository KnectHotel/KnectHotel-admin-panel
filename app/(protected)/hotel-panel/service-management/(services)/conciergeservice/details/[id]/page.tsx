import React from 'react';
import { ConciergeServiceData } from 'app/static/services-management/Concierge';
import ConciergeServiceRequestDetail from '@/components/service-management/concierge/RequestDetail';
type Params = {
  id: string;
};
const ViewDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div className="flex justify-center items-center h-screen w-full pt-28">
      <div className="h-full w-full container">
        <ConciergeServiceRequestDetail serviceID={id} />
      </div>
    </div>
  );
};
export default ViewDetails;
