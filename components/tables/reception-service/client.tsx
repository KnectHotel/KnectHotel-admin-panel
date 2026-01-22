





































































































































































'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { PaginationControls } from '@/components/shared/PaginationControls';
import apiCall from '@/lib/axios';

export const ReceptionServiceTable: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  
  const lastReqSigRef = useRef<string>('');

  const fetchData = async (term = '') => {
    setLoading(true);
    try {
      const isSearching = term.trim().length >= 3;

      const qs = new URLSearchParams({
        page: String(pageNo),
        limit: String(limit)
      });
      if (isSearching) qs.set('searchTerm', term.trim());

      const endpoint = isSearching
        ? `api/services/search/reception?${qs.toString()}`
        : `api/services/reception/requests?${qs.toString()}`;

      const sig = endpoint;
      lastReqSigRef.current = sig;

      const response = await apiCall('GET', endpoint);

      
      if (lastReqSigRef.current !== sig) return;

      if (response?.success && Array.isArray(response.data)) {
        const mapped = response.data.map((item: any) => ({
          requestID: item._id || 'N/A',
          orderID: item.uniqueId || 'N/A',
          requestTime: {
            date: item.requestTime
              ? new Date(item.requestTime).toLocaleDateString()
              : 'N/A',
            time: item.requestTime
              ? new Date(item.requestTime).toLocaleTimeString()
              : 'N/A'
          },
          createdAt: {
            date: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'N/A',
            time: item.createdAt
              ? new Date(item.createdAt).toLocaleTimeString()
              : 'N/A'
          },
          updatedAt: {
            date: item.updatedAt
              ? new Date(item.updatedAt).toLocaleDateString()
              : 'N/A',
            time: item.updatedAt
              ? new Date(item.updatedAt).toLocaleTimeString()
              : 'N/A'
          },
          guestDetails: {
            name: item.guest
              ? `${item.guest.firstName || ''} ${item.guest.lastName || ''}`.trim()
              : 'N/A',
            phoneNumber: item.guest?.phoneNumber || 'N/A',
            roomNo: item.guest?.assignedRoomNumber || 'N/A'
          },
          status: item.status
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
            : 'N/A',
          assignedTo: item.assignedTo
            ? `${item.assignedTo.firstName || ''} ${item.assignedTo.lastName || ''}`.trim()
            : 'N/A',
          estimatedTime: item.estimatedTime || '',
          requestDetail: item.requestDetail || 'N/A',
          serviceType: item.status || 'N/A',
          requestType: item.requestType || 'N/A',
          wakeUpTime: item.wakeUpTime || '',
          paymentStatus: item.paymentStatus || 'N/A'
        }));

        setData(mapped);
        setFilteredData(mapped);

        
        const srvTotal =
          typeof response.total === 'number' ? response.total : mapped.length;
        setTotalRecords(srvTotal);

        if (typeof response.pages === 'number') {
          setTotalPages(Math.max(1, response.pages));
        } else {
          
          setTotalPages(Math.max(1, Math.ceil(srvTotal / limit)));
        }

        
        if (typeof response.page === 'number' && response.page !== pageNo) {
          setPageNo(response.page);
        }
      } else {
        setData([]);
        setFilteredData([]);
        setTotalRecords(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error(error);
      setData([]);
      setFilteredData([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchTerm);
    
  }, [pageNo, limit, searchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNo(newPage);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      
      setPageNo(1);
    }, 500);
  };

  return (
    <>
      <div className="w-full pt-20 flex gap-2 justify-end items-center px-4 py-2">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-coffee text-2xl font-bold">Reception</h2>
        </div>
      </div>

      {}
      <div className="my-4 px-4">
        <input
          type="text"
          placeholder="Search by guest name, ID, or request"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {}
      {loading ? (
        <span className="px-4 py-6">Loading...</span>
      ) : (
        <DataTable
          searchKey="guestDetails.name"
          columns={columns()}
          data={filteredData}
        />
      )}

      {}
      <PaginationControls
        pageNo={pageNo}
        totalRecords={totalRecords}
        limit={limit}
        totalPages={totalPages}
        filteredCount={filteredData.length}
        onPageChange={handlePageChange}
      />
    </>
  );
};
