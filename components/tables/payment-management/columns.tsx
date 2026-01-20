





























































































'use client';

import { ColumnDef } from '@tanstack/react-table';
import { HotelTransaction } from './client';
import CellAction from './cell-action';

export const columns: ColumnDef<HotelTransaction>[] = [
  {
    accessorKey: 'transactionId',
    header: 'Transaction ID'
  },
  {
    header: 'Guest',
    accessorKey: 'guest',
    cell: ({ row }) => {
      const guest = row.original.guest;
      return guest ? (
        <div>
          <div>{guest.firstName} {guest.lastName}</div>
          <div>{guest.phoneNumber}</div>
        </div>
      ) : null;
    }
  },
  {
    header: 'Hotel Details',
    accessorKey: 'hotel',
    cell: ({ row }) => {
      const hotel = row.original.hotel;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{hotel.name}</span>
          <span className="text-gray-500 text-xs">{hotel.email}</span>
          <span className="text-gray-500 text-xs">{hotel.phoneNo}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `₹${row.original.amount}`
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status?.toLowerCase();

      let bgColor = '';
      switch (status) {
        case 'completed':
          bgColor = 'bg-green-200 text-green-800';
          break;
        case 'pending':
          bgColor = 'bg-yellow-200 text-yellow-800';
          break;
        case 'created':
          bgColor = 'bg-orange-300 text-orange-900';
          break;
        case 'failed':
          bgColor = 'bg-red-300 text-red-800';
          break;
        default:
          bgColor = 'bg-orange-200 text-orange-800'; 
          break;
      }

      return (
        <span
          className={`px-3 py-1 rounded-md text-xs font-semibold capitalize ${bgColor}`}
        >
          {status}
        </span>
      );
    }
  },
  {
    accessorKey: 'actions',
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction data={row.original} />
      </div>
    )
  }
];


