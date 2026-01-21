'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import apiCall from '@/lib/axios';

import { columns } from './columns';

export type SOSManagementDataType = {
  _id: string;
  uniqueId: string;
  type: 'Fire' | 'Medical' | 'Security';
  status: 'pending' | 'in-progress' | 'completed';
  guestId: string;
  HotelId: string;
  createdAt: string;
  updatedAt: string;
};

export const SOSManagementDataTable: React.FC = () => {
  const [data, setData] = useState<SOSManagementDataType[]>([]);
  const [filteredData, setFilteredData] = useState<SOSManagementDataType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiCall('GET', 'api/sos');
      const dataArray = response?.data;

      if (Array.isArray(dataArray)) {
        setData(dataArray);
        setFilteredData(dataArray);
        setTotalRecords(dataArray.length);
      } else {
        console.error('Data is not an array:', response);
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('API fetch error:', error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  const handleSearchChange = (searchValue: string) => {
    const filtered = data.filter((item) =>
      item.uniqueId.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.type.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
    setPageNo(1); 
  };

  return (
    <>
      <div className="w-full flex justify-start px-4 mt-20">
        <h2 className="text-[#281F0F] text-lg xl:text-xl font-medium">
          SOS Management
        </h2>
      </div>

      {loading ? (
        <span>Loading...</span>
      ) : (
        <DataTable
          searchKey="uniqueId"
          columns={columns}
          data={filteredData.slice((pageNo - 1) * limit, pageNo * limit)} 
          onSearch={handleSearchChange}
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
