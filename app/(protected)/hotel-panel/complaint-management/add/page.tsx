

import ComplaintForm from '@/components/COMPANY_COMPONENTS/complaint-management/form/complaint-form';
import Navbar from '@/components/Navbar';
import React from 'react';

// const HotelComplaintDetailPage = async () => {
//   return (
//     <div className="w-full h-screen bg-[#FAF8F5]">
//       <Navbar search />
//       <div className="flex pt-8 mt-20">
//         <div className="w-full max-w-6xl container py-6 flex">
//           <ComplaintForm mode="edit" source="hotel" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HotelComplaintDetailPage;



const HotelComplaintDetailPage = async () => {
  return (
    <div className="w-full h-screen bg-[#FAF8F5]">
      <Navbar search />
      <div className="flex pt-8 mt-20">
        <div className="w-full max-w-6xl container py-6 flex">
          <ComplaintForm mode="add" source="hotel-toSuper" />
        </div>
      </div>
    </div>
  );
};

export default HotelComplaintDetailPage;