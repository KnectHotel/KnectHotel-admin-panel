'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { TransactionDataType } from './client';
import CellAction from './cell-action';

export const columns: ColumnDef<TransactionDataType>[] = [
  {
    accessorKey: 'transactionId',
    header: 'Transaction ID'
  },
  {
    accessorKey: 'hotel.name',
    header: 'Hotel Name',
    cell: ({ row }) => row.original.hotel?.name ?? 'N/A'
  },
  {
    accessorKey: 'subscription.planName',
    header: 'Subscription Plan',
    cell: ({ row }) => row.original.subscription?.planName ?? 'N/A'
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `₹${row.original.amount}`
  },
  {
    accessorKey: 'paymentGateway',
    header: 'Payment Method'
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
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      const dateObj = createdAt ? new Date(createdAt) : null;

      const date = dateObj ? format(dateObj, 'dd MMM yyyy') : null;
      const time = dateObj ? format(dateObj, 'hh:mm a') : null;

      return (
        <div className="flex flex-col text-xs opacity-50">
          <p>{date || 'N/A'}</p>
          <p>{time || 'N/A'}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'subscriptionEndDate',
    header: ' Next Payment Date',
    cell: ({ row }) => {
      const endDate = row.original.hotel?.subscriptionEndDate;
      const dateObj = endDate ? new Date(endDate) : null;

      const date = dateObj ? format(dateObj, 'dd MMM yyyy') : 'N/A';
      const time = dateObj ? format(dateObj, 'hh:mm a') : 'N/A';

      return (
        <div className="flex flex-col text-xs opacity-50">
          <p>{date}</p>
          <p>{time}</p>
        </div>
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


