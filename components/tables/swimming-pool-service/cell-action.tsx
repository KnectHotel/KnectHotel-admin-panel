// import { AlertModal } from '@/components/modal/alert-modal';
// import { Eye, Edit, Trash } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import React, { useState } from 'react';

// const CellAction = (props: any) => {
//   const { data } = props;
//   // console.log(data.guestID);

//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);

//   const onConfirm = async () => {
//     try {
//       // Perform user  logic here
//     } catch (error: any) {
//       // console.error("Error deactivating user:", error);
//     } finally {
//       setOpen(false);
//     }
//   };

//   const handleViewUser = () => {
//     router.push(`/hotel-panel/service-management/swimmingpool/details/${data.serviceID}`);
//   };

//   return (
//     <>
//       {/* Deactivate Confirmation Modal */}
//       <AlertModal
//         isOpen={open}
//         onCloseAction={() => setOpen(false)}
//         onConfirmAction={onConfirm}
//         loading={loading}
//         description="Are you sure you want to deactivate this user?"
//       />

//       {/* Action Buttons */}
//       <div className="flex space-x-2">
//         {/* View user details */}
//         <button
//           onClick={() => handleViewUser()}
//           className="p-1 rounded-md group hover:bg-[#a07d3d5e]"
//         >
//           <Eye className=" w-4 text-button-dark group-hover:text-white" />
//         </button>
//       </div>
//     </>
//   );
// };

// export default CellAction;


import { AlertModal } from '@/components/modal/alert-modal';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const isValidObjectId = (v?: unknown) => {
  if (typeof v !== 'string') return false;
  // 24 hex chars
  return /^[a-fA-F0-9]{24}$/.test(v);
};

const CellAction = (props: any) => {
  const { data } = props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    try {
      // Perform user logic here
    } finally {
      setOpen(false);
    }
  };

  const handleViewUser = () => {
    // Try common keys in order
    const rawId =
      data?.serviceID ??
      data?.serviceId ??
      data?._id ??
      data?.id;

    if (!rawId) {
      console.error('Missing id on row data', data);
      // optionally show a toast here
      return;
    }

    // If your backend expects ObjectId, validate it
    if (!isValidObjectId(rawId)) {
      console.error('Invalid id format:', rawId);
      // optionally show a toast here
      return;
    }

    router.push(
      `/hotel-panel/service-management/swimmingpool/details/${encodeURIComponent(
        rawId
      )}`
    );
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onCloseAction={() => setOpen(false)}
        onConfirmAction={onConfirm}
        loading={loading}
        description="Are you sure you want to deactivate this user?"
      />

      <div className="flex space-x-2">
        <button
          onClick={handleViewUser}
          className="p-1 rounded-md group hover:bg-[#a07d3d5e]"
        >
          <Eye className="w-4 text-button-dark group-hover:text-white" />
        </button>
      </div>
    </>
  );
};

export default CellAction;
