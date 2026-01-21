'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import CreateRefundModal from '@/components/shared/coupon-refund-management/create_refund_modal';
import { hotelRefundColumns } from './columns';
import apiCall from '@/lib/axios';

export interface HotelRefundType {
  _id: string;
  uniqueId: string;
  guest: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    uniqueId?: string;
  };
  amount: number;
  reason: string;
  scope: string;
  status: 'Initiated' | 'In-Progress' | 'Completed' | 'Rejected';
  processedBy: string;
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  hotel: {
    _id: string;
    name: string;
    email: string;
    HotelId: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const HotelRefundDetailsTable: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [refundList, setRefundList] = useState<HotelRefundType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchRefunds = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url =
        searchTerm.trim().length > 0
          ? `/api/refund/search?searchTerm=${searchTerm}&page=${currentPage}&limit=${pageLimit}`
          : `/api/refund?page=${currentPage}&limit=${pageLimit}`;

      const res = await apiCall('get', url);

      if (res?.success) {
        const responseData = res.data || res.refunds || [];

        const mapped = responseData.map(
          (item: any): HotelRefundType => ({
            _id: item._id,
            uniqueId: item.uniqueId || 'N/A',
            guest: {
              firstName: item.guest?.firstName || 'N/A',
              lastName: item.guest?.lastName || 'N/A',
              phoneNumber: item.guest?.phoneNumber || 'N/A',
            },
            amount: item.amount || 0,
            reason: item.reason || 'N/A',
            scope: item.scope || 'Hotel',
            status: item.status || 'Initiated',
            processedBy: item.processedBy || 'N/A',
            createdAt: item.createdAt || '',
            updatedAt: item.updatedAt || '',
            hotel: {
              _id: item.hotel?._id || 'N/A',
              name: item.hotel?.name || 'N/A',
              email: item.hotel?.email || 'N/A',
              HotelId: item.hotel?.HotelId || 'N/A'
            }
          })
        );

        setRefundList(mapped);
        setTotalCount(res.total || mapped.length);
      } else {
        setRefundList([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching hotel refunds:', error);
      setError('Failed to load refund data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [currentPage, pageLimit, searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); 
  };

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalCount / pageLimit)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      {}
      <div className="flex items-start justify-start">
        <div className="w-full flex justify-between items-center px-4">
          <Heading title={`Refunds Management`} />
          <Button onClick={() => setModalOpen(true)} className="btn-primary">
            Create Refund
          </Button>
        </div>
      </div>

      <CreateRefundModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {}
      <div className="my-4 px-4">
        <input
          type="text"
          placeholder="Search by guest name, phone, or ID..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {}
      {isLoading ? (
        <div className="text-center mt-6">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 mt-6">{error}</div>
      ) : refundList.length === 0 ? (
        <div className="text-center mt-6">No refund records found.</div>
      ) : (
        <DataTable
          searchKey="hotel.name"
          columns={hotelRefundColumns}
          data={refundList}
        />
      )}

      {}
      <div className="flex justify-end space-x-2 px-3 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {Math.ceil(totalCount / pageLimit)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage >= Math.ceil(totalCount / pageLimit)}
        >
          Next
        </Button>
      </div>
    </>
  );
};