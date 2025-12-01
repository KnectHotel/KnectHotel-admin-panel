import { AlertModal } from '@/components/modal/alert-modal';
import { Eye, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CellAction = (props: any) => {
  const { data } = props;
  console.log(data.guestId);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    try {
      // Perform user  logic here
    } catch (error: any) {
      // console.error("Error deactivating user:", error);
    } finally {
      setOpen(false);
    }
  };

  const handleEditUser = () => {
    console.log('success');
  };

  const handleViewUser = () => {
    router.push(`notifications/view/${data.notificationID}`);
  };

  return (
    <>
      {/* Deactivate Confirmation Modal */}
      <AlertModal
        isOpen={open}
        onCloseAction={() => setOpen(false)}
        onConfirmAction={onConfirm}
        loading={loading}
        description="Are you sure you want to deactivate this user?"
      />

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {/* View user details */}
        <button
          className="p-1 rounded-md group bg-[#A07D3D1A] hover:bg-[#a07d3d5e]"
          onClick={() => handleViewUser()}
        >
          <Eye className=" w-4 text-button-dark group-hover:text-white" />
        </button>

        {/* Delete User */}
        <button
          onClick={() => setOpen(true)}
          className="p-1 rounded-md group bg-[#A07D3D1A] hover:bg-[#a07d3d5e]"
        >
          <Trash className=" w-4 text-button-dark group-hover:text-white" />
        </button>
      </div>
    </>
  );
};

export default CellAction;
