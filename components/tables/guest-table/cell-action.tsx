












































































'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  data: {
    guestId: string;
    _id: string;
  };
}

const CellAction: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleViewUser = () => {
    router.push(`/hotel-panel/guest-management/view/${data._id}`);
  };

  const handleEditUser = () => {
    router.push(`/hotel-panel/guest-management/edit/${data._id}`);
  };

  const onConfirm = async () => {
    try {
      setLoading(true);
      toast.success('Deactivation logic executed');
    } catch (error) {
      toast.error('Error performing action');
    } finally {
      setLoading(false);
      setOpen(false);
    }
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

      <div className="relative z-0">
        <div className="flex space-x-2">
          {}
          <button
            onClick={handleViewUser}
            className="p-1 rounded-md group hover:bg-[#a07d3d5e]"
          >
            <Eye className="w-4 text-button-dark group-hover:text-white" />
          </button>

          {}
          {}

          {}
          <Button
            onClick={handleEditUser}
            className="p-3 rounded-md group cursor-pointer hover:bg-[#a07d3d5e]"
          >
            <Edit className="w-4 text-button-dark group-hover:text-white" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default CellAction;
