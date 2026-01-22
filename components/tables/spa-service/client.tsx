



























































































































































































































'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import PriceTimeSettingSpa from '@/components/modal/spa-service/PriceTimeSetting';
import ManageProductsModal from '@/components/modal/spa-service/manage-products';
import apiCall from '@/lib/axios';
import ManageSlotsModal from '@/components/modal/spa-service/ManageSlotsModal';

export const SpaServiceDataTable: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageProductsModalOpen, setIsManageProductsModalOpen] = useState(false);
  
  const [isManageSlotsModalOpen, setIsManageSlotsModalOpen] = useState(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastReqSigRef = useRef<string>('');

  const fetchBookings = async (term = '') => {
    setLoading(true);
    try {
      const isSearching = term.trim().length >= 3;
      const qs = new URLSearchParams({
        page: String(pageNo),
        limit: String(limit),
      });
      if (isSearching) qs.set('searchTerm', term.trim());

      const endpoint = isSearching
        ? `api/services/search/spa?${qs.toString()}`
        : `api/services/spasalon/bookings?${qs.toString()}`;

      const sig = endpoint;
      lastReqSigRef.current = sig;

      const response = await apiCall('GET', endpoint);

      if (lastReqSigRef.current !== sig) return;

      if (response?.success && Array.isArray(response.data)) {
        const mapped = response.data.map((item: any) => ({
          serviceID: item._id || 'N/A',
          uniqueId: item.uniqueId || '',
          guestDetails: {
            guestID: item.guest?._id || 'N/A',
            name: `${item.guest?.firstName || ''} ${item.guest?.lastName || ''}`.trim(),
            phoneNumber: item.guest?.phoneNumber || 'N/A',
            roomNo: item.guest?.assignedRoomNumber || 'N/A',
          },
          serviceType: item.spaSalonProduct?.serviceType || 'N/A',
          productName: item.spaSalonProduct?.productName || 'N/A',
          productCategory: item.spaSalonProduct?.productCategory || 'N/A',
          spaSalonProductID:
            typeof item.spaSalonProduct === 'string'
              ? item.spaSalonProduct
              : item.spaSalonProduct?._id || 'N/A',
          bookingDate: item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : 'N/A',
          bookingTime: item.bookingTime || 'N/A',
          requestTime: item.requestTime ? new Date(item.requestTime).toLocaleString() : 'N/A',
          status: item.status || 'N/A',
          paymentStatus: item.paymentStatus || 'N/A',
          paymentDate: item.paymentDate || '',
          description: item.description || item.notes || '-',
          assignedTo: item.assignedTo
            ? `${item.assignedTo.firstName || ''} ${item.assignedTo.lastName || ''}`.trim()
            : 'Unassigned',
          estimatedDeliveryTime: item.estimatedDeliveryTime
            ? new Date(item.estimatedDeliveryTime).toLocaleString()
            : '',
          amount: {
            subtotal: item.amount?.subtotal || 0,
            discount: item.amount?.discount || 0,
            finalAmount: item.amount?.finalAmount || 0,
          },
          additionalServicesSelected: item.additionalServicesSelected || [],
          transaction: item.transaction || 'N/A',
          HotelId: item.HotelId || 'N/A',
          createdAt: item.createdAt || '',
          updatedAt: item.updatedAt || '',
        }));

        setData(mapped);
        setFilteredData(mapped);

        const srvTotal = typeof response.total === 'number' ? response.total : mapped.length;
        const srvPages =
          typeof response.pages === 'number'
            ? Math.max(1, response.pages)
            : Math.max(1, Math.ceil(srvTotal / limit));

        setTotalRecords(srvTotal);
        setTotalPages(srvPages);

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
      console.error('Failed to fetch bookings:', error);
      setData([]);
      setFilteredData([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(searchTerm);
    
  }, [pageNo, limit, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setPageNo(1);
    }, 500);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNo(newPage);
    }
  };

  return (
    <>
      <div className="w-full pt-20 flex items-center gap-2 justify-end px-4 py-2 bg-white">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-coffee text-xl font-bold">Spa/Salon</h2>
        </div>
        <Settings className="cursor-pointer" onClick={() => setIsModalOpen(true)} />
        <PriceTimeSettingSpa isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>

      {}
      <div className="w-full flex justify-end px-4 gap-2">
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

        {}
        <Button
          onClick={() => setIsManageSlotsModalOpen(true)}
          className="btn-primary h-8 2xl:h-9"
        >
          Manage Slots
        </Button>
        <ManageSlotsModal
          isOpen={isManageSlotsModalOpen}
          onClose={() => setIsManageSlotsModalOpen(false)}
        />
      </div>

      {}
      <div className="my-4 px-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name, phone, or booking ID..."
          className="border p-2 rounded w-full"
        />
      </div>

      {loading ? (
        <span className="px-4 py-8">Loading...</span>
      ) : filteredData.length === 0 ? (
        <span className="px-4 py-8">No bookings found.</span>
      ) : (
        <DataTable searchKey="guestDetails.name" columns={columns} data={filteredData} />
      )}

      <div className="flex justify-end space-x-2 px-3 py-2">
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
    </>
  );
};
