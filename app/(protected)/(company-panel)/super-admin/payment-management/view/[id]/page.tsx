// import React from 'react';
// import Navbar from '@/components/Navbar';
// import TransactionForm from '@/components/COMPANY_COMPONENTS/transaction-management/form/transaction-form';

// type Params = {
//   id: string;
// };

// const ViewTransactionPage = ({
//   params
// }: {
//   params: Params;
// }) => {
//   const id = params.id;

//   return (
//     <div className="flex flex-col w-full">
//       <Navbar />
//       <div className="sm:px-6 sm:py-0 mt-24">
//         <TransactionForm _id={id} mode="view" />
//       </div>
//     </div>
//   );
// };

// export default ViewTransactionPage;

import React from 'react';
import Navbar from '@/components/Navbar';
import TransactionForm from '@/components/COMPANY_COMPONENTS/transaction-management/form/transaction-form';

const ViewTransactionPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  // console.log(id);
  const mode = 'view';

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="sm:px-6 sm:py-0 mt-24">
        <TransactionForm _id={id} mode={mode} />
      </div>
    </div>
  );
};

export default ViewTransactionPage;
