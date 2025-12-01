// import AdminForm from '@/components/COMPANY_COMPONENTS/admin-management/form/admin-form';
// import ComplaintForm from '@/components/COMPANY_COMPONENTS/complaint-management/form/complaint-form';
// import Navbar from '@/components/Navbar';
// import React from 'react';

// const AddNewComplaint = async ({ params }: { params: Promise<{ id: string }> }) => {
//   const id = (await params).id;
//   return (
//     <div className="w-full h-screen bg-[#FAF8F5]">
//       <Navbar search />
//       <div className="flex pt-8 mt-20">
//         <div className="w-full max-w-6xl container py-6 flex">
//           <ComplaintForm mode="add" complaintID={id} source='' />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddNewComplaint;

import AdminForm from '@/components/COMPANY_COMPONENTS/admin-management/form/admin-form';
import ComplaintForm from '@/components/COMPANY_COMPONENTS/complaint-management/form/complaint-form';
import Navbar from '@/components/Navbar';
import React from 'react';

const AddNewComplaint = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  return (
    <div className="w-full h-screen bg-[#FAF8F5]">
      <Navbar search />
      <div className="flex pt-8 mt-20">
        <div className="w-full max-w-6xl container py-6 flex">
          <ComplaintForm mode="add" complaintID={id} source="superadmin" />
        </div>
      </div>
    </div>
  );
};

export default AddNewComplaint;
