import { AlertModal } from '@/components/modal/alert-modal';
import { Eye, Edit, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CellAction = (props: any) => {
  const { data } = props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    try {
      
    } catch (error: any) {
      
    } finally {
      setOpen(false);
    }
  };

  const handleViewUser = () => {
    router.push(`/hotel-panel/service-management/inroomdining/details/${data?.serviceID}`);
  };

  return (
    <>
      {}
      <AlertModal
        isOpen={open}
        onCloseAction={() => setOpen(false)}
        onConfirmAction={onConfirm}
        loading={loading}
        description="Are you sure you want to deactivate this user?"
      />

      {}
      <div className="flex space-x-2">
        {}
        <button
          onClick={() => handleViewUser()}
          className="p-1 rounded-md group hover:bg-[#a07d3d5e]"
        >
          <Eye className=" w-4 text-button-dark group-hover:text-white" />
        </button>
      </div>
    </>
  );
};

export default CellAction;
