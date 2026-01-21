


































































'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { apiCall } from '@/lib/axios';

export interface ComplaintSuperAdminType {
  complaintID: string;
  uniqueId: string;
  complaintType: string;
  status: string;
  assignedTo: string;
  HotelId: {
    HotelId: string;
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
}

export const ComplaintSuperAdminTable: React.FC = () => {
  const [data, setData] = useState<ComplaintSuperAdminType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await apiCall(
        'GET',
        `/api/complaint/hotel/my-complaints?page=${pageNo}&limit=${limit}`
      );
      const complaints = res.complaints;
      const pagination = res.pagination;
    
      
      const normalizedData: ComplaintSuperAdminType[] = complaints.map(
        (item: any) => ({
          complaintID: item._id,
          uniqueId: item.uniqueId || item.raisedByAdmin?.email || 'N/A',
          complaintType: item.complaintType,
          status: item.status,
          assignedTo: item.assignedTo?._id || '',
          HotelId: item.HotelId || '',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          resolvedAt: item.resolvedAt ?? null,
        })
      );

      setData(normalizedData);
      setTotalRecords(pagination.total || 0);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, [pageNo, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPageNo(1); 
  };

  return (
    <div className="py-6 flex flex-col w-full">
      {loading ? (
        <span className="text-center text-gray-500">Loading...</span>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          Oops! No complaints found.
        </div>
      ) : (
        <DataTable searchKey="complaintType" columns={columns} data={data} />
      )}

      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center space-x-2">
          <label className="text-sm">Rows per page:</label>
          <select
            value={limit}
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
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
    </div>
  );
};