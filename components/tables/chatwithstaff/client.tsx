'use client';

import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import apiCall from '@/lib/axios';// 👈 Create a settings modal if needed
import ToggleButton from '@/components/ui/toggleButton';
import { columns } from './column';

export const ChatWithStaffTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiCall('GET', '/api/chat/rooms');
      console.log('asdfghjk', res)
      if (res?.data) {
        const mapped = res.data.map((chat: any) => ({
          chatId: chat._id || '',
          roomId: chat.roomId,
          guestDetails: {
            guestID: chat.guestId?._id || '',
            name: chat.guestId?.firstName || 'Guest',
            phoneNumber: chat.guestId?.phoneNumber || '-',
            roomNo: chat.guestId?.assignedRoomNumber || '-',
          },
          agentDetails: {
            id: chat.agentId?._id || '',
            firstName: chat.agentId?.firstName || 'N/A',
            lastName: chat.agentId?.lastName || 'N/A',
            name: chat.agentId?.roleId?.name || 'N/A',
            email: chat.agentId?.email || 'N/A'
          },
          bookingDate: chat.createdAt
            ? new Date(chat.createdAt).toLocaleDateString()
            : 'N/A',
          requestTime: chat.createdAt
            ? new Date(chat.createdAt).toLocaleTimeString()
            : 'N/A',
          lastSeen: chat.updatedAt
            ? new Date(chat.updatedAt).toLocaleTimeString()
            : 'N/A',
          status: chat.status || 'inactive',
          assignedTo: chat.assignedTo || null,
        }));

        setData(mapped);
        setFilteredData(mapped);
        setTotalRecords(res.meta.pagination.totalDocs);
      }
    } catch (error) {
      console.error('Error fetching chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNo, limit]);

  const handleSearchChange = (searchValue: string) => {
    if (!searchValue.trim()) {
      setFilteredData(data);
    } else {
      const lower = searchValue.toLowerCase();
      setFilteredData(
        data.filter((item) =>
          item.guestDetails.name.toLowerCase().includes(lower)
        )
      );
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPageNo(1);
  };

  return (
    <>
      {/* Top Header */}
      <div className="w-full pt-20 flex items-center gap-2 justify-end px-4 py-2 bg-white">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-coffee text-xl font-bold">Chat With Staff</h2>
          <div className="flex items-center gap-2">
            {/* <h2 className="text-[0.8rem] font-semibold">AUTO REPLY</h2> */}
            {/* <ToggleButton /> */}
          </div>
        </div>

        {/* <Settings
          className="cursor-pointer"
          onClick={() => setIsSettingsModalOpen(true)}
        /> */}
        {/* <ChatSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        /> */}
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="px-4 py-6">Loading...</div>
      ) : (
        <DataTable
          searchKey="guestDetails.name"
          columns={columns}
          data={filteredData}
          onSearch={handleSearchChange}
        />
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3">
        <div>
          <label className="text-sm mr-2">Rows per page:</label>
          <select
            value={limit}
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {[5, 10, 20, 50].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

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

