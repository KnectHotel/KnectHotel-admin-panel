

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Settings } from 'lucide-react';
import ToggleButton from '@/components/ui/toggleButton';
import PriceTimeSettingInRoomControlModal from '@/components/modal/in-room-control/PriceTimeSetting';
import { columns } from './columns';
import apiCall from '@/lib/axios';

export type InRoomControlDataType = {

  requestID: string;
  orderID: string;
  serviceID: string;
  uniqueId: string;

  requestTime: {
    date: string;
    time: string;
  };
  estimatedTime: string;
  estimatedDeliveryTime?: string;

  wakeUpTime: string;


  guestDetails: {
    name: string;
    guestID: string;
    roomNo: string;
    phoneNumber?: string;
  };

  status: string;
  assignedTo: string;
  assignedToMobile?: string;

  requestType: string;
  issueType: string;
  requestDetail: string;


  HotelId: string;


  paymentStatus?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};


export const InRoomControlDataTable: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<InRoomControlDataType[]>([]);
  const [filteredData, setFilteredData] = useState<InRoomControlDataType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiCall('GET', 'api/services/inroomcontrol/requests');
        if (response.success && Array.isArray(response.data)) {
          const mapped = response.data.map((item: any) => ({
            requestID: item._id || 'N/A',
            orderID: item.uniqueId || 'N/A',
            serviceID: item._id || 'N/A',

            requestTime: {
              date: item.requestTime
                ? new Date(item.requestTime).toLocaleDateString()
                : 'N/A',
              time: item.requestTime
                ? new Date(item.requestTime).toLocaleTimeString()
                : 'N/A',
            },

            guestDetails: {
              name: `${item.guest?.firstName || ''} ${item.guest?.lastName || ''}`.trim(),
              guestID: item.guest?._id || 'N/A',
              roomNo: item.guest?.assignedRoomNumber || item.roomNo || 'N/A',
              phoneNumber: item.guest?.phoneNumber || 'N/A',
            },

            status: item.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : 'N/A',

            assignedTo: `${item.assignedTo?.firstName || ''} ${item.assignedTo?.lastName || ''}`.trim() || 'Unassigned',
            assignedToMobile: item.assignedTo?.mobileNumber || 'N/A',

            estimatedTime: item.estimatedTime || '',
            estimatedDeliveryTime: item.estimatedDeliveryTime || '',

            requestDetail: item.requestDetail || 'N/A',
            issueType: item.issueType || 'N/A',
            requestType: item.requestType || 'N/A',
            wakeUpTime: item.wakeUpTime || '',
            HotelId: item.HotelId || 'N/A',

            description: item.description || '-',
            paymentStatus: item.paymentStatus || 'N/A',

            createdAt: item.createdAt || '',


            updatedAt: item.updatedAt || '',

          }));


          setData(mapped);
          setFilteredData(mapped);
          setTotalRecords(mapped.length);
        } else {
          setData([]);
          setFilteredData([]);
          setTotalRecords(0);
        }
      } catch (error) {
        setData([]);
        setFilteredData([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  const handleSearchChange = (value: string) => {
    const keyword = value.toLowerCase();
    const filtered = data.filter((item) =>
      item.guestDetails.name.toLowerCase().includes(keyword)
    );
    setFilteredData(filtered);
    setPageNo(1);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="w-full pt-20 flex items-center gap-2 justify-end px-4 py-2 bg-white">
          <div className="flex w-full justify-between items-center">
            <h2 className="text-coffee text-xl font-bold">In-room Control</h2>
            <div className="flex items-center gap-2">
              {}
            </div>
          </div>
          {}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <DataTable
          searchKey="guestDetails.name"
          columns={columns}
          data={filteredData.slice((pageNo - 1) * limit, pageNo * limit)}
          onSearch={handleSearchChange}
        />
      )}

      <div className="flex items-center justify-end gap-2 px-3 py-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => handlePageChange(pageNo - 1)}
          disabled={pageNo === 1}
        >
          Previous
        </Button>

        <span className="inline-flex items-center justify-center h-8 px-3 leading-none text-sm text-gray-600">
          Page {pageNo} of {Math.max(1, Math.ceil(totalRecords / limit))}
        </span>

        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => handlePageChange(pageNo + 1)}
          disabled={pageNo >= Math.max(1, Math.ceil(totalRecords / limit))}
        >
          Next
        </Button>
      </div>

    </>
  );
};


