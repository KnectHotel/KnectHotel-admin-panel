// import ComplaintForm from '@/components/COMPANY_COMPONENTS/complaint-management/form/complaint-form';
// import Navbar from '@/components/Navbar';
// import React from 'react';

// const ComplaintDetailsFormPage = () => {
//   return (
//     <div className="flex flex-col w-full">
//       <Navbar />
//       <div className="w-full h-screen pt-8 mt-20">
//         <div className="h-full w-full container">
//           <ComplaintForm mode="view" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ComplaintDetailsFormPage;

import React from 'react';
import ComplaintForm from '@/components/COMPANY_COMPONENTS/complaint-management/form/complaint-form';
import Navbar from '@/components/Navbar';

const ComplaintDetailsFormPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  // console.log('ID', id);
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="w-full px-4 md:px-8 py-10 mt-8">
        <ComplaintForm mode="view" complaintID={id} source="superadmin" />
      </div>
    </div>
  );
};

export default ComplaintDetailsFormPage;
