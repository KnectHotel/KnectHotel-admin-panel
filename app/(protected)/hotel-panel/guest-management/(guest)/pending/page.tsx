'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Eye } from 'lucide-react';
import apiCall from '@/lib/axios';
import { ColumnDef } from '@tanstack/react-table';
import Navbar from '@/components/Navbar';
import { format, parseISO } from 'date-fns';

// Define the types for guest data
export interface GuestDataType {
  guestId: string;
  id: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  preCheckInStatus: string;
  guestName: string;
  roomNo: string;
  assignedRoomNumber?: number;
  address: string;
  paymentMode: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  paymentStatus: 'Pending' | 'Confirmed' | 'Cancelled' | string;
  status:
    | 'Pending'
    | 'Confirmed'
    | 'Checked-In'
    | 'Checked-Out'
    | 'Cancelled'
    | string;
}

// Column Definitions for DataTable
const columns: ColumnDef<GuestDataType>[] = [
  {
    accessorKey: 'uniqueId',
    header: 'Booking ID'
  },
  {
    accessorKey: 'checkInDate',
    header: 'Check-In & Check-Out',
    cell: ({ row }) => {
      const { checkInDate, checkInTime, checkOutDate, checkOutTime } =
        row.original;

      const checkIn =
        checkInDate && checkInTime
          ? parseISO(`${checkInDate}T${checkInTime}`)
          : null;

      const checkOut =
        checkOutDate && checkOutTime
          ? parseISO(`${checkOutDate}T${checkOutTime}`)
          : null;

      return (
        <div className="flex flex-col text-xs opacity-70 leading-tight">
          <span>
            {checkInDate ? format(checkInDate, 'dd MMM yyyy, hh:mm a') : 'N/A'}
          </span>
          <span className="text-[12px] text-gray-700">
            {checkOutDate
              ? format(checkOutDate, 'dd MMM yyyy, hh:mm a')
              : 'N/A'}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'guestName',
    header: 'Guest Details',
    cell: ({ row }) => {
      const { firstName, lastName, assignedRoomNumber, email, phoneNumber } =
        row.original;
      return (
        <div>
          {firstName} {lastName}
          <br />
          {assignedRoomNumber}
          <br />
          {email}
          <br />
          {phoneNumber}
        </div>
      );
    }
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      const address: string = row.original.address;
      const addressLines: string[] = [];

      if (address.includes(',')) {
        // With comma: split by comma
        const parts = address.split(',').map((part) => part.trim());
        addressLines.push(...parts);
      } else {
        // Without comma: break into 4-word lines
        const words = address.trim().split(/\s+/);
        for (let i = 0; i < words.length; i += 4) {
          addressLines.push(words.slice(i, i + 4).join(' '));
        }
      }

      return (
        <div className="text-xs text-gray-700 leading-snug">
          {addressLines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      );
    }
  },
  {
    accessorKey: 'preCheckInStatus',
    header: 'Pre Check-In Status',
    cell: ({ row }) => {
      const status = row.original.preCheckInStatus?.toLowerCase() || 'unknown';

      const statusMap: Record<string, { label: string; className: string }> = {
        pending: { label: 'Pending', className: 'text-yellow-600' },
        approved: { label: 'Approved', className: 'text-green-600' },
        rejected: { label: 'Rejected', className: 'text-red-600 font-semibold' }
      };

      const display = statusMap[status] || {
        label: status,
        className: 'text-gray-500'
      };

      return <span className={display.className}>{display.label}</span>;
    }
  },

  {
    accessorKey: 'status',
    header: 'Booking Status',
    cell: ({ row }) => {
      const statusRaw = row.original.status || 'Unknown';
      const statusMap: Record<string, { label: string; className: string }> = {
        pending: { label: 'Pending', className: 'text-yellow-500' },
        confirmed: { label: 'Confirmed', className: 'text-green-600' },
        'checked-in': { label: 'Checked-In', className: 'text-blue-500' },
        'checked-out': { label: 'Checked-Out', className: 'text-indigo-500' },
        cancelled: { label: 'Cancelled', className: 'text-red-500' }
      };
      const statusData = statusMap[statusRaw.toLowerCase()] || {
        label: statusRaw,
        className: 'text-gray-400'
      };
      return <span className={statusData.className}>{statusData.label}</span>;
    }
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div className="flex justify-center">
          <button
            className="p-2 rounded-md hover:bg-[#e6dcc4]"
            onClick={() =>
              router.push(
                `/hotel-panel/guest-management/pending/view/${row.original.id}`
              )
            }
          >
            <Eye className="h-4 w-4 text-black" />
          </button>
        </div>
      );
    }
  }
];

// Pending Page Component
const PendingPage: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<GuestDataType[]>([]);
  const [filteredData, setFilteredData] = useState<GuestDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchPendingBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiCall('GET', 'api/booking/preCheckIns');
        // console.log('response', res)
        if (res?.success) {
          const bookings = res.bookings.map((booking: any) => ({
            id: booking._id,
            guestId: booking.guest,
            uniqueId: booking.uniqueId,
            firstName: booking.firstName,
            lastName: booking.lastName,
            assignedRoomNumber: booking.assignedRoomNumber,
            address: booking.address,
            preCheckInStatus: booking.preCheckInStatus,
            paymentMode: booking.paymentMode,
            checkInDate: new Date(booking.checkInDate).toLocaleDateString(),
            checkInTime: new Date(booking.checkInDate).toLocaleTimeString(),
            checkOutDate: new Date(booking.checkOutDate).toLocaleDateString(),
            checkOutTime: new Date(booking.checkOutDate).toLocaleTimeString(),
            guestName: `${booking.firstName} ${booking.lastName}`,
            roomNo: booking.assignedRoomNumber || 'N/A',
            email: booking.email,
            phoneNumber: booking.phoneNumber,
            paymentStatus: booking.paymentStatus || 'N/A',
            status: booking.status || 'Pending'
          }));
          setData(bookings);
          setFilteredData(bookings);
          setTotalRecords(bookings.length);
        } else {
          setError('Failed to load pre-check-ins');
        }
      } catch (err) {
        setError('Something went wrong while fetching bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBookings();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Navbar active search />
      <div className="w-full min-h-screen pt-8 mt-14 px-0 md:px-6">
        <Heading title="Pending Booking Requests" />
        {loading && <p className="text-center py-4">Loading...</p>}
        {error && <p className="text-center text-red-600 py-4">{error}</p>}
        {!loading && !error && (
          <DataTable
            columns={columns}
            data={filteredData.slice((pageNo - 1) * limit, pageNo * limit)}
          />
        )}
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
      </div>
    </div>
  );
};

export default PendingPage;
