
// import { Button } from '@/components/ui/button';
// import ToggleButton from '@/components/ui/toggleButton';
// import { Edit, Eye } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import React from 'react';

// const CellAction = (props: any) => {
//   const { data } = props;

//   const router = useRouter();

//   const handleViewComplaint = () => {
//     router.push(`/hotel-panel/complaint-management/view/${data._id}`);
//     console.log('Row data:', data);
//   };

//   return (
//     <div className="flex items-center space-x-4">
//       <button
//         onClick={handleViewComplaint}
//         className="p-1 rounded-md group bg-[#A07D3D1A]"
//       >
//         <Eye className="w-5 text-button-dark group-hover:text-white" />
//       </button>
//     </div>
//   );
// };

// export default CellAction;


import { Button } from '@/components/ui/button';
import ToggleButton from '@/components/ui/toggleButton';
import { Edit, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CellAction = (props: any) => {
  const { data } = props;

  const router = useRouter();

  const handleViewUser = () => {
    router.push(`/hotel-panel/complaint-management/view/${data.complaintID}`);
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        {/* <ToggleButton /> */}
        <button
          onClick={() => handleViewUser()}
          className="p-1 rounded-md group bg-[#A07D3D1A]"
        >
          <Eye className=" w-5 text-button-dark group-hover:text-white" />
        </button>
      </div>
    </>
  );
};

export default CellAction;
