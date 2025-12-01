import React from 'react';
import SubHotelIdForm from '@/components/COMPANY_COMPONENTS/sub_hotel-management/form/sub_hotel-form';
import Navbar from '@/components/Navbar';
const ViewSubHotelDetailsPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  // console.log('id', id)
  return (
    <div className="flex flex-col w-full">
      <Navbar active search />
      <div className="flex justify-center items-center w-full px-6 md:px-14 py-10 mt-16">
        <SubHotelIdForm subHotelID={id} mode="view" />
      </div>
    </div>
  );
};

export default ViewSubHotelDetailsPage;

// import React from 'react';
// import CreateHotelIdForm from '@/components/COMPANY_COMPONENTS/hotel-management/form/create-hotel-id-form';
// import Navbar from '@/components/Navbar';
// import HotelForm from '@/components/form/hotel-profile/hotel-form';
// import SubHotelIdForm from '@/components/COMPANY_COMPONENTS/sub_hotel-management/form/sub_hotel-form';
// const ViewHotelDetailsPage = async ({
//   params
// }: {
//   params: Promise<{ id: string }>;
// }) => {
//   const id = (await params).id;
//   console.log('id', id)
//   return (
//     <div className="flex flex-col w-full">
//       <Navbar />
//       <div className="w-full px-4 md:px-8 py-10 mt-8">
//         <SubHotelIdForm mode='view' subHotelID={id} />
//       </div>
//     </div>
//   );
// };

// export default ViewHotelDetailsPage;
