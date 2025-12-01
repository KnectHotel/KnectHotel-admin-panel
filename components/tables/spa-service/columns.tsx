'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import apiCall from '@/lib/axios';
import React, { useState } from 'react';

export type SpaServiceDataType = {
  serviceID: string;
  uniqueId: string;

  guestDetails: {
    guestID: string;
    name: string;
    roomNo: string;
    phoneNumber: string;
  };

  serviceType: string;
  productCategory: string;
  productName: string;
  spaSalonProductID?: string;

  bookingDate: string;
  bookingTime: string;
  requestTime: string;

  status: string;
  paymentStatus: string;
  paymentDate?: string;

  amount: {
    subtotal: number;
    discount: number;
    finalAmount: number;
  };

  additionalServicesSelected: string[];
  description: string;
  assignedTo: string;
  estimatedDeliveryTime?: string;

  transaction?: string;
  HotelId: string;
  createdAt: string;
  updatedAt: string;
};


export const columns: ColumnDef<SpaServiceDataType>[] = [
  {
    accessorKey: 'uniqueId',
    header: 'Booking ID',
    cell: ({ row }) => (
      <div className="text-sm font-semibold text-gray-800">
        {row.original.uniqueId}
      </div>
    )
  },
  {
    accessorKey: 'guestDetails',
    header: 'Guest',
    cell: ({ row }) => {
      const guest = row.original.guestDetails;
      return (
        <div className="flex flex-col text-xs text-gray-700">
          <span className="text-sm font-medium">{guest.name}</span>
          <span>Room: {guest.roomNo}</span>
          <span>Ph: {guest.phoneNumber}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const serviceId = row.original.serviceID;

      // Map UI display values to backend values
      const statusMap = {
        Pending: 'pending',
        'In-Progress': 'in-progress',
        Completed: 'completed',
        Cancelled: 'cancelled', // ✅ Added Cancelled
      } as const;

      type StatusLabel = keyof typeof statusMap;

      // Normalize backend value to match UI expected values
      const normalizeStatus = (statusFromBackend: string): StatusLabel => {
        switch (statusFromBackend?.toLowerCase()) {
          case 'pending':
            return 'Pending';
          case 'in-progress':
            return 'In-Progress';
          case 'completed':
            return 'Completed';
          case 'cancel':
          case 'canceled':
          case 'cancelled':
            return 'Cancelled';
          default:
            return 'Pending';
        }
      };

      const [updating, setUpdating] = React.useState(false);
      const [status, setStatus] = React.useState<StatusLabel>(
        normalizeStatus(row.original.status)
      );

      const statusOptions: StatusLabel[] = [
        'Pending',
        'In-Progress',
        'Completed',
        'Cancelled', // ✅ Added here
      ];

      const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as StatusLabel;
        setUpdating(true);

        try {
          const data = await apiCall('PATCH', `/api/services/status/${serviceId}`, {
            status: statusMap[newStatus], // Send lowercase value to backend
          });

          if (
            data.success ||
            data.status === 'ok' ||
            data.message?.toLowerCase().includes('status updated')
          ) {
            setStatus(newStatus);
          } else {
            console.error('❌ Failed to update status:', data.message || data);
          }
        } catch (error) {
          console.error('❌ Error updating status:', error);
        } finally {
          setUpdating(false);
        }
      };

      return (
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={updating}
          className={`text-sm px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring ${status === 'Pending'
              ? 'text-[#3787E3]'
              : status === 'In-Progress'
                ? 'text-[#FC690E]'
                : status === 'Completed'
                  ? 'text-[#78B150]'
                  : status === 'Cancelled'
                    ? 'text-red-500' // ✅ Cancelled styled in red
                    : 'text-gray-500'
            }`}
        >
          {statusOptions.map((option) => (
            <option
              key={option}
              value={option}
              className={option === 'Cancelled' ? 'text-red-500' : 'text-black'} // ✅ Dropdown option red too
            >
              {option}
            </option>
          ))}
        </select>
      );
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment',
    cell: ({ row }) => (
      <div className={`text-sm font-semibold ${row.original.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'}`}>
        {row.original.paymentStatus}
      </div>
    )
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amt = row.original?.amount;
      return amt ? (
        <div className="flex flex-col text-xs">
          <span>Subtotal: ₹{amt.subtotal ?? 0}</span>
          <span>Discount: ₹{amt.discount ?? 0}</span>
          <span>Total: ₹{amt.finalAmount ?? 0}</span>
        </div>
      ) : (
        <span className="text-xs text-gray-500">N/A</span>
      );
    }
  },
  {
    accessorKey: 'description',
    header: 'Note',
    cell: ({ row }) => (
      <div className="text-sm truncate max-w-[150px]">{row.original.description}</div>
    )
  },
  {
    accessorKey: 'paymentDate',
    header: 'Payment Date',
    cell: ({ row }) => {
      const paymentDate = row.original.paymentDate;
      if (paymentDate) {
        const date = new Date(paymentDate);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();

        return (
          <div className="text-xs">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        );
      }
      return <div className="text-xs">N/A</div>;
    },
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
    },
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
    },
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.assignedTo || 'N/A'}</div>;
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

