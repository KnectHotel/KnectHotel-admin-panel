'use client';

import Navbar from '@/components/Navbar';
import { HotelTransactionDataTable } from '@/components/tables/payment-management/client';


const PaymentManagementPage = () => {
  return (
    <div className="w-full flex-col justify-center items-center">
      <Navbar active search={true} />
      <div className="w-full mt-20">
        <div className="sm:px-6 sm:py-0">
          <HotelTransactionDataTable />
        </div>
      </div>
    </div>
  );
};

export default PaymentManagementPage;