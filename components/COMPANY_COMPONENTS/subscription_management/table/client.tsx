
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios, { apiCall } from '@/lib/axios'; // ✅ your custom axios instance
// import toast from 'react-hot-toast';

export interface Subscription {
  _id: string;
  uniqueId: string;
  subscriptionID: string
  planName: string;
  planDuration: number;
  planType: string;
  description: string;
  cost: number;
  status: 'Active' | 'Inactive' | 'Canceled' | 'Expired';
}

export const SubscriptionManagementHomePage: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<Subscription[]>([]);
  const [filteredData, setFilteredData] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // 🧠 Fetch subscriptions from API
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await apiCall('GET', '/api/subscription');
      const subscriptions = response.data || [];

      setData(subscriptions);
      setFilteredData(subscriptions);
      setTotalRecords(subscriptions.length);
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
      // toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPageNo(1);
  };

  const handleSearchChange = (searchValue: string) => {
    if (searchValue.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.planName?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleOnClick = () => {
    router.push('/super-admin/subscription-management/add');
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Heading title={`Subscription(s) (${totalRecords})`} />
        <Button
          className="btn-primary text-xs 2xl:text-sm md:text-sm"
          onClick={handleOnClick}
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="text-white">Create Subscription</span>
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-sm py-10">Loading...</div>
      ) : (
        <DataTable
          searchKey="planName"
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
