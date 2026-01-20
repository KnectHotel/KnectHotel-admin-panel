

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import { format, parseISO } from 'date-fns';

export interface GuestDataType {
  guestId: string;
  _id: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  createdAt: string;
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
  status: 'Pending' | 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled' | string;
}


export const columns: ColumnDef<GuestDataType>[] = [
  {
    accessorKey: 'uniqueId',
    header: 'Booking ID',
  },
  {
    accessorKey: 'checkInDate',
    header: 'Check-In & Check-Out',
    cell: ({ row }) => {
      const {
        checkInDate,
        checkInTime,
        checkOutDate,
        checkOutTime,
      } = row.original;

      const checkIn = checkInDate && checkInTime
        ? parseISO(`${checkInDate}T${checkInTime}`)
        : null;

      const checkOut = checkOutDate && checkOutTime
        ? parseISO(`${checkOutDate}T${checkOutTime}`)
        : null;

      return (
        <div className="flex flex-col text-xs opacity-70 leading-tight">
          <span>
            {checkInDate ? format(checkInDate, 'dd MMM yyyy, hh:mm a') : 'N/A'}
          </span>
          <span className="text-[12px] text-gray-700">
            {checkOutDate ? format(checkOutDate, 'dd MMM yyyy, hh:mm a') : 'N/A'}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'guestName',
    header: 'Guest Details',
    cell: ({ row }) => {
      const { firstName, lastName, assignedRoomNumber, email, phoneNumber } = row.original;

      return (
        <div>
          {firstName} {lastName}<br />
          {assignedRoomNumber}<br />
          {email} <br />
          {phoneNumber}
        </div>
      );
    },
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      const address: string = row.original.address;
      const addressLines: string[] = [];

      if (address.includes(',')) {
        
        const parts = address.split(',').map(part => part.trim());
        addressLines.push(...parts);
      } else {
        
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
  }

  ,
  {
    accessorKey: 'paymentMode',
    header: 'Payment Mode',
    cell: ({ row }) => {
      const paymentModeRaw = row.original.paymentMode || 'Unknown';
      const paymentMode = paymentModeRaw.toLowerCase();

      const paymentModeMap: Record<string, { label: string; className: string }> = {
        cash: { label: 'Cash', className: 'text-yellow-500' },
        upi: { label: 'UPI', className: 'text-blue-500' },
        card: { label: 'Card', className: 'text-green-600' },
      };

      const paymentModeData = paymentModeMap[paymentMode] || {
        label: paymentModeRaw,
        className: 'text-gray-400',
      };

      return <span className={paymentModeData.className}>{paymentModeData.label}</span>;
    },
  }
  ,
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => {
      const status = row.original.paymentStatus || 'N/A';

      const statusMap: Record<string, string> = {
        pending: 'text-yellow-500',
        paid: 'text-green-500',
      };

      const statusClass = statusMap[status] || 'text-gray-500';

      return <span className={statusClass}>{status}</span>;
    },

  },
  {
    accessorKey: 'status',
    header: 'Booking Status',
    cell: ({ row }) => {
      const statusRaw = row.original.status || 'Unknown';
      const status = statusRaw.toLowerCase();

      const statusMap: Record<string, { label: string; className: string }> = {
        pending: { label: 'Pending', className: 'text-yellow-500' },
        confirmed: { label: 'Confirmed', className: 'text-green-600' },
        'checked-in': { label: 'Checked-In', className: 'text-blue-500' },
        'checked-out': { label: 'Checked-Out', className: 'text-indigo-500' },
        cancelled: { label: 'Cancelled', className: 'text-red-500' },
      };

      const statusData = statusMap[status] || {
        label: statusRaw,
        className: 'text-gray-400',
      };

      return <span className={statusData.className}>{statusData.label}</span>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return (
        <span className="text-xs text-gray-700 opacity-70">
          {createdAt ? format(parseISO(createdAt), 'dd MMM yyyy, hh:mm a') : 'N/A'}
        </span>
      );
    },
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex justify-center">
        <CellAction data={row.original} />
      </div>
    ),
  },
];
