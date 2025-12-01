import { OrderManagementDataTable } from '@/components/tables/Order-management-service/client';
import React from 'react';

const OrderManagementServicePage = () => {
  return (
    <div className="flex justify-center items-center h-full w-full pt-3">
      <div className="h-full w-full container">
        <OrderManagementDataTable />
      </div>
    </div>
  );
};

export default OrderManagementServicePage;
