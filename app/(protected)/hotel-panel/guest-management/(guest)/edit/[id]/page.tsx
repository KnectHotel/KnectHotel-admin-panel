// import GuestForm from '@/components/form/guest-management/guest-form';
// import Navbar from '@/components/Navbar';
// import React from 'react';

// const EditGuestPage = async ({
//   params
// }: {
//   params: Promise<{ id: string }>;
// }) => {
//   const id = (await params).id;

//   return (
//     <>
//       <Navbar />
//       <div className="flex justify-center items-center min-h-screen w-full pt-8 mt-16">
//         <div className="h-full w-full container">
//           <GuestForm isEnabled={true} guestId={id} mode="edit" />
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditGuestPage;


import GuestForm from '@/components/form/guest-management/guest-form';
import Navbar from '@/components/Navbar';
import React from 'react';

const EditGuestPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;

  return (
    <>
      <Navbar />
      <div className="flex  justify-center items-center min-h-screen w-full pt-8 mt-16">
        <div className="h-full w-full container">
          <GuestForm
            isEnabled={true}
            guestId={id}
            mode="edit"
            isEditMode={true}
          />
        </div>
      </div>
    </>
  );
};

export default EditGuestPage;