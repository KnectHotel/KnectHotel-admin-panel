'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { columns } from './columns';
import apiCall from '@/lib/axios';
import { PaginationControls } from '@/components/shared/PaginationControls';
import PriceTimeSetting from '@/components/modal/PriceTimeSetting';
import ManageProductsModal from '@/components/modal/order-management/ManageProductsModal';

export type OrderManagementDataType = {
  orderID: string;
  servicetype: string;
  requestTime: {
    date: string;
    time: string;
  };
  guestDetails: {
    name: string;
    guestID: string;
    roomNo: string;
  };
  serviceID: string;
  status: string;
  assignedTo: string;
};

export const OrderManagementDataTable: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<OrderManagementDataType[]>([]);
  const [filteredData, setFilteredData] = useState<OrderManagementDataType[]>(
    []
  );
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageProductsModalOpen, setIsManageProductsModalOpen] =
    useState(false);

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  
  
  
  
  
  
  

  

  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  const fetchData = async (term = '') => {
    setLoading(true);
    try {
      const url =
        term.length >= 3
          ? `api/services/search/ordermanagement?searchTerm=${term}&page=${pageNo}&limit=${limit}`
          : `api/services/orders?page=${pageNo}&limit=${limit}`;

      const response = await apiCall('GET', url);

      
      const responseData =
        term.length >= 3 ? response.data : response.serviceRequests;

      if (Array.isArray(responseData)) {
        const mapped = responseData.map(
          (item: any): OrderManagementDataType => ({
            orderID: item.uniqueId,
            requestTime: formatDateTime(item.requestTime || item.createdAt),
            guestDetails: {
              name: `${item.guest?.firstName || ''} ${item.guest?.lastName || ''}`.trim(),
              guestID: item.guest?.assignedRoomNumber || '-',
              roomNo: item.guest?.phoneNumber || '-'
            },
            serviceID: item._id,
            servicetype: item.__t || 'N/A',
            status: item.status || 'Unknown',
            assignedTo: item.assignedTo
              ? `${item.assignedTo.firstName || ''} ${item.assignedTo.lastName || ''}`
              : 'Not Assigned'
          })
        );

        setData(mapped);
        setFilteredData(mapped);

        
        const total =
          response.total ??
          response.count ??
          response?.data?.total ??
          mapped.length;
        const serverLimit = response.limit ?? limit; 
        const pages =
          response.pages ??
          response.totalPages ?? 
          Math.max(1, Math.ceil(total / serverLimit));

        setTotalRecords(total);
        setTotalPages(pages);

        
        if (serverLimit !== limit) setLimit(serverLimit);
      } else {
        setData([]);
        setFilteredData([]);
        setTotalRecords(0);
        setTotalPages(1);
      }
    } catch {
      setError('Failed to fetch order data.');
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
    if (newPage > 0 && newPage <= totalPages) setPageNo(newPage);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        setPageNo(1);
        fetchData(value);
      }, 500)
    );
  };

  return (
    <>
      {}
      <div className="w-full pt-20 flex items-center gap-2 justify-end px-4 py-2 bg-white">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-coffee text-2xl font-bold">Order Management</h2>
        </div>
        <Settings
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        <PriceTimeSetting
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      {}
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
      {loading ? (
        <span className="px-4 py-8">Loading...</span>
      ) : error ? (
        <div className="text-red-500 px-4 py-8">{error}</div>
      ) : filteredData.length === 0 ? (
        <div className="px-4 py-8 text-center">No order requests found.</div>
      ) : (
        <DataTable
          searchKey="guestDetails.name"
          columns={columns}
          data={filteredData}
        />
      )}

      {}
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
