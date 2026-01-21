





































import { Button } from '@/components/ui/button';
import ToggleButton from '@/components/ui/toggleButton';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const CellAction = (props: any) => {
  const { data } = props;

  const router = useRouter();

  const handleEditUser = () => {
    router.push(`refund-management/edit/${data._id}`);
  };

  return (
    <>
      {}
      <div className="flex items-center space-x-2">
        {}
        <Button
          onClick={() => handleEditUser()}
          className="p-3 rounded-md group cursor-pointer hover:bg-[#a07d3d5e]"
        >
          <Edit className=" w-4 text-button-dark group-hover:text-white" />
        </Button>
        {}
      </div>
    </>
  );
};

export default CellAction;



