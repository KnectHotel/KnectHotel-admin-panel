
// 'use client';

// import React from 'react';
// import Navbar from '@/components/Navbar';
// import CreateRefundForm from '@/components/shared/coupon-refund-management/create-refund-form';

// const EditSuperRefundPage = async ({
//   params
// }: {
//   params: Promise<{ id: string }>;
// }) => {
//   const { id } = await params;
//   const mode = 'edit';

//   return (
//     <div className="flex flex-col w-full">
//       <Navbar />
//       <div className="w-full h-screen mt-16">
//         <div className="h-full w-full flex justify-center pt-6">
//           <CreateRefundForm
//             mode={mode}
//             hotelId={id}
//             isHotel={false}
//             isLoading={false}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditSuperRefundPage;



'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import CreateRefundForm from '@/components/shared/coupon-refund-management/create-refund-form';

const EditSuperRefundPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const mode = 'edit';

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="w-full h-screen mt-16">
        <div className="h-full w-full flex justify-center pt-6">
          <CreateRefundForm
            mode={mode}
            HotelId={id}
            isHotel={false}
            isLoading={false}
          />
        </div>
      </div>
    </div>
  );
};

export default EditSuperRefundPage;