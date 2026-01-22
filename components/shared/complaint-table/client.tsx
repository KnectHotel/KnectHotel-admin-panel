
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import apiCall from '@/lib/axios';












export interface ComplaintItem {
  _id: string;
  scope: string;
  raisedByGuest: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  HotelId: {
    HotelId: string;
    _id: string;
    name: string;
  };
  complaintType: string;
  description: string;
  status: string;
  assignedTo: {
    _id: string;
    firstName: string;
    lastName: string;
    roleId?: { name?: string };
  };
  createdAt: string;
  updatedAt: string;
}

export const ComplaintTable: React.FC = () => {
  const [data, setData] = useState<ComplaintItem[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await apiCall(
        'GET',
        `/api/complaint/platform/complaints?page=${pageNo}&limit=${limit}`
      );
      const complaints = res?.complaints || [];
      const pagination = res?.pagination || {};

      setData(complaints);
      setTotalRecords(pagination.total || complaints.length);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      setData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [pageNo, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  return (
    <div className="py-6 flex flex-col w-full">
      {loading ? (
        <span className="text-center">Loading...</span>
      ) : (
        <DataTable searchKey="complaintType" columns={columns} data={data} />
      )}

      <div className="flex justify-end space-x-2 px-3 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pageNo - 1)}
          disabled={pageNo === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {pageNo} of {Math.ceil(totalRecords / limit) || 1}
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
  );
};












