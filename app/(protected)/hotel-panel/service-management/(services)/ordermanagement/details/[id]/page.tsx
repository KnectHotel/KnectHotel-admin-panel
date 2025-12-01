

import OrderDetails from '@/components/service-management/ordermanagement/OrderDetails';
import React from 'react';

type Params = {
  id: string;
};

const ViewDetails = async ({ params }: { params: Promise<Params> }) => {
  const { id } = await params;

  if (!id) {
    console.error('Request ID is missing');
    return <div>Error: Request ID is missing</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen w-full pt-28">
      <div className="h-full w-full container">
        <OrderDetails requestId={id} />
      </div>
    </div>
  );
};

export default ViewDetails;