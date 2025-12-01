import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type CellActionProps = {
  data: {
    subscriptionID: string;
    [key: string]: any;
    uniqueId: string;
    _id: string;
  };
};

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const handleViewUser = () => {
    if (data?._id) {
      router.push(`/super-admin/subscription-management/view/${data._id}`);
    } else {
      console.error('subscriptionID is missing in data');
    }
  };

  return (
    <button
      onClick={handleViewUser}
      className="p-1 rounded-md group hover:bg-[#a07d3d5e]"
    >
      <Eye className="w-4 text-button-dark group-hover:text-white" />
    </button>
  );
};

export default CellAction;
