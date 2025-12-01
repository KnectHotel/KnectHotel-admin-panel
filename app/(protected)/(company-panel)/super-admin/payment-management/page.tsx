'use client';
import Navbar from '@/components/Navbar';
import { Transactions } from '@/components/shared/payment-management/client';

const PaymentManagementPage = () => {
  return (
    <div className="w-full flex-col justify-center items-center">
      <Navbar active search={true} />
      <div className="w-full mt-20">
        <div className=" sm:px-6 sm:py-0">
          <Transactions />
        </div>
      </div>
    </div>
  );
};

export default PaymentManagementPage;