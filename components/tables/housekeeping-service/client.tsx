






















































































































































































































'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ManageProductsModal from '@/components/modal/housekeeping/manage-products';
import PriceTimeSettingHouseKeeping from '@/components/modal/housekeeping/PriceTimeSetting';
import apiCall from '@/lib/axios';
import { columns } from './columns';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { HousekeepingDataType } from 'app/static/services-management/Housekeeping';

export const HousekeepingServiceTable: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<HousekeepingDataType[]>([]);
  const [filteredData, setFilteredData] = useState<HousekeepingDataType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastReqSigRef = useRef<string>(''); 

  const fetchData = async (term = '') => {
    setLoading(true);
    setError(null);
    try {
      const isSearching = term.trim().length >= 3;

      
      const qs = new URLSearchParams({
        page: String(pageNo),
        limit: String(limit)
      });
      if (isSearching) qs.set('searchTerm', term.trim());

      const endpoint = isSearching
        ? `api/services/search/housekeeping?${qs.toString()}`
        : `api/services/housekeeping/requests?${qs.toString()}`;

      
      const sig = endpoint;
      lastReqSigRef.current = sig;

      const response = await apiCall('GET', endpoint);

      
      if (lastReqSigRef.current !== sig) return;

      if (response?.success && Array.isArray(response.data)) {
        const mapped: HousekeepingDataType[] = response.data.map(
          (item: any) => ({
            requestID: item._id || 'N/A',
            uniqueId: item.uniqueId || 'N/A',
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
              name: `${item.guest?.firstName || ''} ${item.guest?.lastName || ''}`.trim(),
              guestID: item.guest?._id || 'N/A',
              phoneNumber: item.guest?.phoneNumber || 'N/A',
              roomNo: item.guest?.assignedRoomNumber || 'N/A'
            },
            status: item.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : 'N/A',
            assignedTo:
              `${item.assignedTo?.firstName || ''} ${item.assignedTo?.lastName || ''}`.trim() ||
              'N/A',
            estimatedTime: item.estimatedDeliveryTime || '',
            requestDetail: item.requestDetail || 'N/A',
            requestType: item.requestType || 'N/A',
            paymentStatus: item.paymentStatus || 'N/A',
            amount: {
              subtotal: item.amount?.subtotal || 0,
              discount: item.amount?.discount || 0,
              finalAmount: item.amount?.finalAmount || 0
            },
            coupon: {
              code: item.coupon?.code || 'N/A',
              type: item.coupon?.type || 'N/A',
              value: item.coupon?.value || 0
            },
            items:
              item.items?.map((itm: any) => ({
                item: itm.item,
                quantity: itm.quantity,
                _id: itm._id
              })) || []
          })
        );

        setData(mapped);
        setFilteredData(mapped);

        
        const srvTotal =
          typeof response.total === 'number' ? response.total : undefined;
        const srvPages =
          typeof response.pages === 'number' ? response.pages : undefined;

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

        
        if (typeof response.page === 'number' && response.page !== pageNo) {
          setPageNo(response.page);
        }
      } else {
        setData([]);
        setFilteredData([]);
        setTotalRecords(0);
        setTotalPages(1);
      }
    } catch (e) {
      console.error(e);
      setError('Error fetching data');
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
    if (newPage >= 1 && newPage <= totalPages) setPageNo(newPage);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      
      setPageNo(1);
    }, 500);
  };

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageProductsModalOpen, setIsManageProductsModalOpen] =
    useState(false);

  return (
    <>
      <div className="w-full pt-20 flex items-center gap-2 justify-end px-4 py-2 bg-white">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-coffee text-2xl font-bold">Housekeeping</h2>
        </div>
        <Settings
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        <PriceTimeSettingHouseKeeping
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      <div className="w-full flex justify-end px-4">
        <Button
          onClick={() => setIsManageProductsModalOpen(true)}
          className="btn-primary h-8 2xl:h-9"
        >
          Manage Products
        </Button>
        <ManageProductsModal
          isOpen={isManageProductsModalOpen}
          onClose={() => setIsManageProductsModalOpen(false)}
        />
      </div>

      <div className="my-4 px-4">
        <input
          type="text"
          placeholder="Search by guest name, phone, or ID..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {loading ? (
        <span className="px-4 py-8">Loading...</span>
      ) : error ? (
        <div className="text-red-500 px-4 py-8">{error}</div>
      ) : filteredData.length === 0 ? (
        <div className="px-4 py-8 text-center">
          No housekeeping requests found.
        </div>
      ) : (
        <DataTable
          searchKey="guestDetails.name"
          columns={columns}
          data={filteredData}
        />
      )}

      <PaginationControls
        totalRecords={totalRecords}
        pageNo={pageNo}
        limit={limit}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        filteredCount={filteredData.length}
      />
    </>
  );
};
