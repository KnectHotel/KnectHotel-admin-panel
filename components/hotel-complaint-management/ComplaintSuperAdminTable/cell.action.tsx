


































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
    
  };
};

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  
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
    
    router.push(`/hotel-panel/complaint-management/edit/${id}`);
  };

  
  

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

      {}
    </div>
  );
};

export default CellAction;

