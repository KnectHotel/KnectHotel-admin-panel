'use string';
import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import apiCall from '@/lib/axios';
import React, { useState } from 'react';

export type ConciergeServiceDataType = {
  requestID: string;
  serviceID: string;
  uniqueId: string;
  requestTime: {
    date: string;
    time: string;
  };
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: {
    _id: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
  };

  guestDetails: {
    name: string;
    guestID: string;
    roomNo?: string;
    phoneNumber?: string;
  };

  requestType: string;
  status: string;

  hotelId: string;
  location?: string;
  transactionID?: string;
  paymentStatus?: string;
  amount?: number;

  actions?: any;
};

export const columns: ColumnDef<ConciergeServiceDataType>[] = [
  {
    accessorKey: 'uniqueId',
    header: 'Request ID',
    cell: ({ row }) => (
      <p className="text-sm text-gray-800">{row.original.uniqueId}</p>
    )
  },
  {
    accessorKey: 'bookingDate',
    header: 'Booking Date',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.bookingDate}</span>
    )
  },
  {
    accessorKey: 'guestDetails',
    header: 'Guest Details',
    cell: ({ row }) => {
      const { name, guestID, roomNo, phoneNumber } =
        row.original.guestDetails || {};
      return (
        <div className="flex flex-col text-sm gap-1">
          <p className="font-medium">{name || '-'}</p>
          <p className="text-xs text-gray-600">Room: {roomNo || 'N/A'}</p>
          <p className="text-xs text-gray-600">Ph: {phoneNumber || 'N/A'}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'requestType',
    header: 'Request Type',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.requestType || '-'}</span>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const serviceId = row.original.serviceID;

      
      const statusMap = {
        Pending: 'pending',
        'In-Progress': 'in-progress',
        Completed: 'completed',
        Cancelled: 'cancelled'
      } as const;

      type StatusLabel = keyof typeof statusMap;

      
      const normalizeStatus = (statusFromBackend: string): StatusLabel => {
        const s = statusFromBackend?.toLowerCase?.() ?? '';
        if (s === 'pending') return 'Pending';
        if (s === 'in-progress') return 'In-Progress';
        if (s === 'completed') return 'Completed';
        if (s === 'cancel' || s === 'canceled' || s === 'cancelled')
          return 'Cancelled';
        return 'Pending';
      };

      const colorByLabel: Record<StatusLabel, string> = {
        Pending: 'text-[#3787E3]',
        'In-Progress': 'text-[#FC690E]',
        Completed: 'text-[#78B150]',
        Cancelled: 'text-red-500'
      };

      const [updating, setUpdating] = React.useState(false);
      const [status, setStatus] = React.useState<StatusLabel>(
        normalizeStatus(row.original.status)
      );

      const statusOptions: StatusLabel[] = [
        'Pending',
        'In-Progress',
        'Completed',
        'Cancelled'
      ];

      const handleStatusChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
      ) => {
        const newStatus = e.target.value as StatusLabel;
        const prev = status;
        setStatus(newStatus); 
        setUpdating(true);

        try {
          const data = await apiCall(
            'PATCH',
            `/api/services/status/${serviceId}`,
            {
              status: statusMap[newStatus] 
            }
          );

          const ok =
            data?.success ||
            data?.status === 'ok' ||
            data?.message?.toLowerCase?.().includes('status updated');

          if (!ok) {
            console.error('Failed to update status:', data?.message || data);
            setStatus(prev); 
          }
        } catch (error) {
          console.error('Error updating status:', error);
          setStatus(prev); 
        } finally {
          setUpdating(false);
        }
      };

      return (
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={updating}
          className={`text-sm px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring ${colorByLabel[status]}`}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option} className="text-black">
              {option}
            </option>
          ))}
        </select>
      );
    }
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.paymentStatus || '-'}</span>
    )
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => {
      const assigned = row.original.assignedTo;
      return assigned?.firstName ? (
        <div className="text-sm">
          <div>{`${assigned.firstName} ${assigned.lastName}`}</div>
          <div className="text-xs text-gray-500">{assigned.mobileNumber}</div>
        </div>
      ) : (
        <span className="text-sm">Unassigned</span>
      );
    }
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.location || 'N/A'}</span>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) {
        return <span className="text-xs text-gray-500">Invalid Date</span>;
      }
      return (
        <span className="text-xs text-gray-500">
          <div>{date.toLocaleDateString()}</div>
          <div>{date.toLocaleTimeString()}</div>
        </span>
      );
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      const date = new Date(updatedAt);
      if (isNaN(date.getTime())) {
        return <span className="text-xs text-gray-500">Invalid Date</span>;
      }
      return (
        <span className="text-xs text-gray-500">
          <div>{date.toLocaleDateString()}</div>
          <div>{date.toLocaleTimeString()}</div>
        </span>
      );
    }
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex justify-center">
        <CellAction data={row.original} />
      </div>
    )
  }
];
