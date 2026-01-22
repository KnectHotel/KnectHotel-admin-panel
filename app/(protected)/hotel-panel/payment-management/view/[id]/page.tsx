


























import React from 'react';
import Navbar from '@/components/Navbar';
import TransactionForm from '@/components/COMPANY_COMPONENTS/transaction-management/form/transaction-form';

type Params = {
  id: string;
};

const ViewTransactionPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const mode = 'view';

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="sm:px-6 sm:py-0 mt-24">
        <TransactionForm _id={id} mode={mode} isHotelPanel={true} />
      </div>
    </div>
  );
};

export default ViewTransactionPage;
