'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PaginationControls } from '@/components/shared/PaginationControls';
import apiCall from '@/lib/axios';
import { GymServiceDataType } from 'app/static/services-management/Gym';
import { columns } from './columns';
import PriceTimeSettingGym from '@/components/modal/gym/PriceTimeSetting';
import { Settings } from 'lucide-react';

export const GymServiceTable: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<GymServiceDataType[]>([]);
  const [filteredData, setFilteredData] = useState<GymServiceDataType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        ? `api/services/search/gym?${qs.toString()}`
        : `api/services/facility/requests?${qs.toString()}`;

      const sig = endpoint;
      lastReqSigRef.current = sig;

      const response = await apiCall('GET', endpoint);

      
      if (lastReqSigRef.current !== sig) return;

      if (response?.success && Array.isArray(response.data)) {
        const mapped: GymServiceDataType[] = response.data.map((item: any) => ({
          serviceID: item.uniqueId || 'N/A',
          requestID: item._id || 'N/A',
          requestTime: {
            date: item.requestTime
              ? new Date(item.requestTime).toLocaleDateString()
              : 'N/A',
            time: item.requestTime
              ? new Date(item.requestTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'N/A'
          },
          guestDetails: {
            name: `${item.guest?.firstName || ''} ${item.guest?.lastName || ''}`.trim(),
            guestID: item.guest?._id || 'N/A',
            roomNo:
              item.guest?.assignedRoomNumber || item.slot?.roomNo || 'N/A',
            phoneNumber: item.guest?.phoneNumber || 'N/A'
          },
          status: item.status
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
            : 'N/A',
          assignedTo: item.assignedTo
            ? `${item.assignedTo.firstName || ''} ${item.assignedTo.lastName || ''}`.trim()
            : 'N/A',
          estimatedTime: item.slot?.startTime || 'N/A',
          wakeUpTime: item.slot?.endTime || 'N/A',
          requestDetail: item.requestDetail || 'N/A',
          requestType: item.requestType || 'N/A',
          facilityType: item.facilityType || 'N/A',
          facility: item.facility || 'N/A',
          HotelId: item.HotelId || 'N/A',
          paymentStatus: item.paymentStatus || 'N/A',
          paymentDate: item.paymentDate || null,
          transaction: item.transaction || 'N/A',
          createdAt: item.createdAt || null,
          updatedAt: item.updatedAt || null,
          slot: {
            dayOfWeek: item.slot?.dayOfWeek || 'N/A',
            startTime: item.slot?.startTime || 'N/A',
            endTime: item.slot?.endTime || 'N/A',
            price: item.slot?.price || 0,
            maxCapacity: item.slot?.maxCapacity || 0,
            currentCapacity: item.slot?.currentCapacity || 0
          }
        }));

        setData(mapped);
        setFilteredData(mapped);

        
        const srvTotal =
          typeof response.total === 'number' ? response.total : mapped.length;
        const srvPages =
          typeof response.pages === 'number'
            ? response.pages
            : Math.max(1, Math.ceil(srvTotal / limit));

        setTotalRecords(srvTotal);
        setTotalPages(Math.max(1, srvPages));

        
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

  return (
    <>
      <div className="w-full pt-20 px-4 py-2 bg-white flex justify-between items-center">
        <h2 className="text-xl font-bold text-coffee">
          GYM / COMMUNITY / CONFERENCE HALL
        </h2>
        {}
      </div>

      <div className="w-full flex justify-end gap-4 px-4 py-2">
        <Button
          className="btn-primary h-8"
          onClick={() => router.push('/hotel-panel/service-management/gym/add')}
        >
          Manage Gym
        </Button>

        <Button
          className="btn-primary h-8"
          onClick={() =>
            router.push('/hotel-panel/service-management/gym/community')
          }
        >
          Manage Community Hall
        </Button>

        <Button
          className="btn-primary h-8"
          onClick={() =>
            router.push('/hotel-panel/service-management/gym/conference')
          }
        >
          Manage Conference Hall
        </Button>
      </div>

      <div className="my-4 px-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by guest name, ID, or request"
          className="border p-2 rounded w-full"
        />
      </div>

      {loading ? (
        <p className="text-center py-10">Loading...</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filteredData}
            searchKey="guestDetails.name"
          />
          <PaginationControls
            pageNo={pageNo}
            totalRecords={totalRecords}
            limit={limit}
            totalPages={totalPages}
            filteredCount={filteredData.length}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
};
