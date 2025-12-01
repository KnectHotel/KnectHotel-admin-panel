import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const CellAction = (props: any) => {
  const { data } = props;
  const router = useRouter();

  const handleEditUser = () => {
    router.push(`/super-admin/admin-management/edit/${data._id}`);
  };

  const handleViewUser = () => {
    router.push(`/super-admin/admin-management/view/${data._id}`);
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Edit User */}
        <button
          onClick={() => handleViewUser()}
          className="p-1 rounded-md group hover:bg-[#a07d3d5e]"
        >
          <Eye className=" w-4 text-button-dark group-hover:text-white" />
        </button>
        <Button
          onClick={() => handleEditUser()}
          className="p-3 rounded-md group cursor-pointer hover:bg-[#a07d3d5e]"
        >
          <Edit className="w-4 text-button-dark group-hover:text-white" />
        </Button>
      </div>
    </>
  );
};

export default CellAction;
