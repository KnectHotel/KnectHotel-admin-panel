import { Button } from '@/components/ui/button';
import ToggleButton from '@/components/ui/toggleButton';
import apiCall from '@/lib/axios';
import { StatusType } from 'app/static/Type';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type CellActionProps = {
  data: any;
  onStatusChange?: (id: string, status: StatusType) => void;
};

const CellAction: React.FC<CellActionProps> = ({ data, onStatusChange }) => {
  const [status, setStatus] = useState(data.status === 'Active');
  const router = useRouter();

  const handleEditUser = () => {
    router.push(`employee-management/edit/${data.employeeID}`);
  };

  const handleToggle = async (newState: boolean) => {
    setStatus(newState);

    try {
      const statusToSend: StatusType = newState ? 'Active' : 'Inactive';

      const response = await apiCall('PUT', `api/employee/${data.employeeID}`, {
        status: statusToSend
      });

      if (!response || !response.status) {
        throw new Error('Failed to update status');
      }

      onStatusChange?.(data.employeeID, statusToSend);
    } catch (error: any) {
      setStatus(!newState);
      console.error('Toggle update error:', error);
    }
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
