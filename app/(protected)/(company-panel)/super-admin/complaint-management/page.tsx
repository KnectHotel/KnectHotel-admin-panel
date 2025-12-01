// 'use client';
// import Navbar from '@/components/Navbar';
// import ComplaintDashboard from '@/components/shared/complaint-dashboard/ComplaintDashboard';
// import { ComplaintTable } from '@/components/shared/complaint-table/client';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// const ComplaintManagementPage = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const router = useRouter();
//   const handleOnClick = (actionName: string) => {
//     if (actionName === 'add_admin') {
//       router.push(`complaint-management/add`);
//     }
//   };

//   return (
//     <div className="w-full h-screen flex-col justify-center items-center">
//       <Navbar search />
//       <div className="py-4 px-6 mt-20">
//         <div className="flex justify-end">
//           <Button
//             className="text-xs 2xl:text-sm md:text-sm btn-primary mb-4"
//             onClick={() => handleOnClick('add_admin')}
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             <span className="text-white group-hover:text-black">
//               Add Complaint
//             </span>
//           </Button>
//         </div>
//         <ComplaintDashboard
//           title="COMPLAINT OVERVIEW"
//           closedCases={276}
//           openCases={124}
//           inProgressCases={105}
//         />
//       </div>
//       <ComplaintTable />
//     </div>
//   );
// };

// export default ComplaintManagementPage;

'use client';

import Navbar from '@/components/Navbar';
import { ComplaintTable } from '@/components/shared/complaint-table/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heading } from '@/components/ui/heading';

const ComplaintManagementPage = () => {
  const router = useRouter();

  const handleOnClick = (actionName: string) => {
    if (actionName === 'add_admin') {
      router.push('/super-admin/complaint-management/add'); // ✅ update path if needed
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF6EF] flex flex-col">
      {/* Navbar */}
      <Navbar search />

      {/* Page Content */}
      <div className="px-6 mt-20">
        <div className="w-full flex items-center justify-between px-4">
          <Heading title="Complaints" />

          <Button
            className="text-xs md:text-sm 2xl:text-sm btn-primary"
            onClick={() => handleOnClick('add_admin')}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="text-white group-hover:text-black">
              Add Complaint
            </span>
          </Button>
        </div>
      </div>

      {/* Complaint Table */}
      <ComplaintTable />
    </div>
    // </div>
  );
};

export default ComplaintManagementPage;
