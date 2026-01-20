
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { columns } from './columns';
import apiCall from '@/lib/axios';

export const CompanyPanelGuestManagementHome: React.FC = () => {
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Construct query string with search
      const queryParams = new URLSearchParams({
        page: pageNo.toString(),
        limit: limit.toString(),
        search: searchQuery,
      });

      const res = await apiCall(
        'GET',
        `api/booking/platform?${queryParams.toString()}`
      );
      if (res?.success) {
        setData(res.bookings || []);
        setTotalRecords(
          res.pagination?.totalBookings || res.bookings?.length || 0
        );
      } else {
        setError('Failed to load bookings');
      }
    } catch (err) {
      console.error('API fetch error:', err);
      setError('Something went wrong while fetching bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search API calls
    const handler = setTimeout(() => {
      fetchData();
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [pageNo, limit, searchQuery]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchQuery(searchValue);
    setPageNo(1); // Reset to page 1 on new search
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Heading title="All Guest Bookings" />
      </div>

      {loading && data.length === 0 ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <DataTable
          searchKey="firstName"
          columns={columns}
          data={data}
          onSearch={handleSearchChange}
        />
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6 px-3 py-4 border-t">
        <div className="text-sm">
          Showing{' '}
          {totalRecords === 0 ? 0 : Math.min((pageNo - 1) * limit + 1, totalRecords)} to{' '}
          {Math.min(pageNo * limit, totalRecords)} of {totalRecords} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageNo - 1)}
            disabled={pageNo === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pageNo} of {Math.max(1, Math.ceil(totalRecords / limit))}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageNo + 1)}
            disabled={pageNo >= Math.ceil(totalRecords / limit) || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};