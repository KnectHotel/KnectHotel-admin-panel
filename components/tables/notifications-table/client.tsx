'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';

import { useRouter } from 'next/navigation';
import { columns } from './columns';

import { notificationsData } from 'app/static/ServiceManagementData';
import ToggleButton from '@/components/ui/toggleButton';
import { Settings } from 'lucide-react';
import PriceTimeSetting from '@/components/modal/PriceTimeSetting';

export const NotificationsTable: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState(notificationsData || []);
  const [filteredData, setFilteredData] = useState(notificationsData || []);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState<boolean>();
  const [totalRecords, setTotalRecords] = useState(data.length || 0);

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPageNo(1); 
  };

  
  const handleSearchChange = (searchValue: string) => {
    if (searchValue.trim() === '') {
      setFilteredData(data); 
    } else {
      const filtered = data.filter((item) =>
        item.guestDetails.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };
  return (
    <>
      <div className="w-full flex items-center gap-2 justify-end px-4 py-2 bg-white">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-coffee text-xl font-bold">Notifications</h2>
          <div className="flex items-center gap-2">
            <h2 className="text-[0.8rem] font-semibold">
              AUTO ACCEPT REQUESTS
            </h2>
            {}
          </div>
        </div>
        <Settings className='cursor-pointer' onClick={() => setIsModalOpen(true)} />
        <PriceTimeSetting
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <DataTable
          searchKey="firstName"
          columns={columns}
          data={filteredData.slice((pageNo - 1) * limit, pageNo * limit)} 
        
        
        
        
        
        
        
        
        />
      )}
      <div className="flex justify-end space-x-2 px-3 py-2">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageNo - 1)}
            disabled={pageNo === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pageNo} of {Math.ceil(totalRecords / limit)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageNo + 1)}
            disabled={pageNo >= Math.ceil(totalRecords / limit)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};
