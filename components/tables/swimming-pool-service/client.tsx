

































































































































































































'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { PaginationControls } from '@/components/shared/PaginationControls';
import apiCall from '@/lib/axios';
import ManageProductsModal from '@/components/modal/swimmingpool/manage-products';
import PriceTimeSetting from '@/components/modal/PriceTimeSetting';
import { Settings } from 'lucide-react';

export const SwimmingpoolServiceDataTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isManageProductsModalOpen, setIsManageProductsModalOpen] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  
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
        ? `/api/services/search/swimmingpool?${qs.toString()}`
        : `/api/services/swimming-pool/requests?${qs.toString()}`;

      
      const sig = `${endpoint}`;
      lastReqSigRef.current = sig;

      const res = await apiCall('GET', endpoint);

      
      if (lastReqSigRef.current !== sig) return;

      if (res?.success && Array.isArray(res.data)) {
        const mapped = res.data.map((item: any) => ({
          uniqueId: item.uniqueId || 'N/A',
          serviceID: item._id || 'N/A',
          orderID: item.uniqueId || 'N/A',
          requestTime: {
            date: item.requestTime
              ? new Date(item.requestTime).toLocaleDateString()
              : 'N/A',
            time: item.requestTime
              ? new Date(item.requestTime).toLocaleTimeString()
              : 'N/A'
          },
          createdAt: item.createdAt || null,
          updatedAt: item.updatedAt || null,
          bookingDate: item.bookingDate
            ? new Date(item.bookingDate).toLocaleDateString()
            : 'N/A',
          bookingTime:
            item.bookingTime ||
            `${item.startTime || 'N/A'} - ${item.endTime || 'N/A'}`,
          guestDetails: {
            name: item.guest
              ? `${item.guest.firstName || ''} ${item.guest.lastName || ''}`.trim()
              : 'N/A',
            phoneNumber: item.guest?.phoneNumber || 'N/A',
            roomNo: item.guest?.assignedRoomNumber || 'N/A'
          },
          assignedTo: item.assignedTo
            ? `${item.assignedTo.firstName || ''} ${item.assignedTo.lastName || ''}`.trim()
            : 'Unassigned',
          estimatedTime: item.estimatedTime || '',
          requestDetail: item.requestDetail || item.description || 'N/A',
          paymentStatus: item.paymentStatus || 'N/A',
          amount: {
            subtotal: item.amount?.subtotal ?? 0,
            discount: item.amount?.discount ?? 0,
            finalAmount: item.amount?.finalAmount ?? 0
          },
          additionalServicesSelected: item.additionalServicesSelected || [],
          status: item.status
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
            : 'N/A'
        }));

        setData(mapped);
        setFilteredData(mapped);

        
        const srvTotal = typeof res.total === 'number' ? res.total : undefined;
        const srvPages = typeof res.pages === 'number' ? res.pages : undefined;

        if (srvTotal !== undefined && srvPages !== undefined) {
          setTotalRecords(srvTotal);
          setTotalPages(Math.max(1, srvPages));
        } else {
          
          const guessedTotal =
            mapped.length < limit
              ? (pageNo - 1) * limit + mapped.length
              : pageNo * limit + 1; 
          setTotalRecords(guessedTotal);
          setTotalPages(Math.max(1, Math.ceil(guessedTotal / limit)));
        }
      } else {
        setData([]);
        setFilteredData([]);
        setTotalRecords(0);
        setTotalPages(1);
      }
    } catch (e) {
      console.error(e);
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

  
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPageNo(newPage);
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
      {}
      <div className="w-full pt-20 flex items-center justify-between px-4 py-2">
        <h2 className="text-coffee text-2xl font-bold">Swimming Pool</h2>

        <div className="flex items-center gap-3">
          {}
          <Settings
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          <PriceTimeSetting
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          {}
          <Button
            onClick={() => setIsManageProductsModalOpen(true)}
            className="btn-primary h-8 2xl:h-9"
          >
            Manage Pool
          </Button>
          <ManageProductsModal
            isOpen={isManageProductsModalOpen}
            onClose={() => setIsManageProductsModalOpen(false)}
          />
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
          columns={columns}
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
