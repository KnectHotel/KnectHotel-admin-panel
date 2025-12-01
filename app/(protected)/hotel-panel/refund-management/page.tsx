// import Navbar from '@/components/Navbar';
// import { RefundDetailsTable } from '@/components/tables/refund-management/client';
// import React from 'react';

// const RefundHomePage = () => {
//   return (
//     <div className="flex flex-col w-full">
//       <Navbar active search />
//       <div className="mt-16 w-full">
//         <RefundDetailsTable />
//       </div>
//     </div>
//   );
// };

// export default RefundHomePage;



import Navbar from '@/components/Navbar';
import { HotelRefundDetailsTable } from '@/components/tables/refund-management/client';
import React from 'react';

const RefundHomePage = () => {
  return (
    <div className="flex flex-col w-full">
      <Navbar active search />
      <div className="mt-16 w-full">
        <HotelRefundDetailsTable />
      </div>
    </div>
  );
};

export default RefundHomePage;