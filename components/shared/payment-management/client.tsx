'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { apiCall } from '@/lib/axios'; // Assuming you have this helper
import { columns } from './columns';

// types/TransactionDataType.ts
export interface TransactionDataType {
  _id: string;
  transactionId: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  paymentGateway: string;
  paymentLink: string;
  hotel: {
    _id: string;
    name: string;
    email: string;
    phoneNo: string;
    subscriptionEndDate: string;
  };
  subscription: {
    _id: string;
    planName: string;
    planDuration: number;
  };
  metadata: {
    hotelName: string;
    subscriptionPlan: string;
  };
}

export const Transactions: React.FC = () => {
  const [data, setData] = useState<TransactionDataType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await apiCall(
        'GET',
        `/api/transactions?page=${pageNo}&limit=${limit}`
      );
      const resData = response;
      console.log('daataaa', resData);

      if (resData?.success) {
        setData(resData.data); // 👈 Don't format it
        setTotalRecords(resData.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [pageNo, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  return (
    <>
      <div className="flex items-start justify-start">
        <div className="w-full flex justify-between items-center px-4">
          <Heading title="Transactions" />
        </div>
      </div>

      {loading ? (
        <span className="text-sm px-4 py-2">Loading...</span>
      ) : (
        <DataTable
          searchKey="guestDetail.guestName"
          columns={columns}
          data={data}
        />
      )}

      <div className="flex justify-end space-x-2 px-4 py-3">
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
    </>
  );
};

