
// import { Button } from '@/components/ui/button';
// import ToggleButton from '@/components/ui/toggleButton';
// import { Edit, Eye } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import React, { useState } from 'react';

// const CellAction = (props: any) => {
//   const { data } = props;

//   const router = useRouter();

//   const handleViewUser = () => {
//     console.log('complaintIDcomplaintIDcomplaintID', data.complaintID);
//     router.push(`/hotel-panel/complaint-management/view/${data.complaintID}`);
//   };

//   return (
//     <>
//       {/* Action Buttons */}
//       <div className="flex items-center space-x-4">
//         {/* <ToggleButton /> */}
//         <button
//           onClick={() => handleViewUser()}
//           className="p-1 rounded-md group bg-[#A07D3D1A]"
//         >
//           <Eye className=" w-5 text-button-dark group-hover:text-white" />
//         </button>
//       </div>
//     </>
//   );
// };

// export default CellAction;

'use client';

import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type CellActionProps = {
  data: {
    complaintID?: string;
    _id?: string;
    id?: string;
    status?: string;
    // ...any other fields you pass in row data
  };
};

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  // Be defensive about which key holds the id
  const id =
    data?.complaintID ??
    data?._id ??
    (typeof data?.id === 'string' ? data.id : '');

  const handleView = () => {
    if (!id) return;
    router.push(`/hotel-panel/complaint-management/view/${id}`);
  };

  const handleEdit = () => {
    if (!id) return;
    // Route to your editable page that uses source="hotel-toSuper"
    router.push(`/hotel-panel/complaint-management/edit/${id}`);
  };

  // (Optional) Disable edit for certain statuses
  // const isEditDisabled = data?.status === 'Resolved';

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleView}
        className="p-1 rounded-md group bg-[#A07D3D1A]"
        aria-label="View complaint"
        title="View"
      >
        <Eye className="w-5 text-button-dark group-hover:text-white" />
      </button>

      {/* <button
        onClick={handleEdit}
        // disabled={isEditDisabled}
        className="p-1 rounded-md group bg-[#A07D3D1A] disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Edit complaint"
        title="Edit"
      >
        <Edit className="w-5 text-button-dark group-hover:text-white" />
      </button> */}
    </div>
  );
};

export default CellAction;

