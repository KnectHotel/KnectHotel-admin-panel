







































































































































































'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { columns } from './columns';
import apiCall from '@/lib/axios';

export const GuestClient: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]); 
  const [filteredData, setFilteredData] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [pageNo, setPageNo] = useState(1); 
  const [limit, setLimit] = useState(10); 
  const [totalRecords, setTotalRecords] = useState(0); 
  const [totalPages, setTotalPages] = useState(0); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [typingTimeout, setTypingTimeout] = useState<any>(null); 

  
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await apiCall(
          'GET',
          '/api/booking/hotel/precheckin/pending/count'
        );
        if (response?.status === true && typeof response.count === 'number') {
          setPendingCount(response.count);
        } else {
          setPendingCount(0);
        }
      } catch (error) {
        setPendingCount(0);
      }
    };

    fetchPendingCount();
  }, []);

  
  const fetchData = async (searchTerm: string = '') => {
    try {
      setLoading(true);
      const res = await apiCall(
        'GET',
        searchTerm
          ? `api/booking/hotel/search?searchTerm=${searchTerm}&page=${pageNo}&limit=${limit}`
          : `api/booking/hotel?page=${pageNo}&limit=${limit}`
      );
      if (res?.success) {
        setData(res.bookings || []);
        setFilteredData(res.data || []);
        setTotalRecords(res.pagination?.total || 0);
        setTotalPages(Math.ceil(res.pagination?.total / limit));
      } else {
        setError('Failed to load bookings');
      }
    } catch (err) {
      setError('Something went wrong while fetching bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchTerm);
  }, [pageNo, limit, searchTerm]);

  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (value.length >= 3) {
      setTypingTimeout(
        setTimeout(() => {
          fetchData(value);
        }, 500)
      );
    } else {
      fetchData();
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPageNo(newPage);
    }
  };

  const handleOnClick = (actionName: string) => {
    if (actionName === 'add booking') {
      router.push('/hotel-panel/guest-management/add');
    }
    if (actionName === 'view requests') {
      router.push('/hotel-panel/guest-management/pending');
    }
  };

  const getRowClassName = (row: any) => {
    return row.preCheckInRejectionMessage ? 'bg-red-200' : '';
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading title="Booking at Hotel" />
        <div className="flex gap-3 relative">
          <Button
            className="btn-primary"
            onClick={() => handleOnClick('add booking')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Booking
          </Button>
          <Button
            className="btn-primary"
            onClick={() => handleOnClick('view requests')}
          >
            View Requests
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-1 text-white w-6 h-6 text-center pt-1 font-medium text-xs rounded-full bg-gradient-to-t from-[#E0363A] via-[#E0363A] to-[#E0363A]">
                {pendingCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {}
      <div className="my-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search bookings..."
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <DataTable
          searchKey="firstName"
          columns={columns}
          data={searchTerm.length >= 3 ? filteredData : data}
          getRowClassName={getRowClassName}
        />
      )}

      {}
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
            Page {pageNo} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageNo + 1)}
            disabled={pageNo >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
