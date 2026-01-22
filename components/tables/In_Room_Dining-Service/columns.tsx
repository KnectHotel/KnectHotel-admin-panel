

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { InRoomDiningDataType } from '@/components/tables/In_Room_Dining-Service/client';
import CellAction from './cell-action';
import apiCall from '@/lib/axios';
import React, { useState } from 'react';

export const columns: ColumnDef<InRoomDiningDataType, any>[] = [
  {
    accessorKey: 'orderID',
    header: 'Order ID'
  },
  {
    accessorKey: 'guestDetails',
    header: 'Guest Details',
    cell: ({ row }) => {
      const details = row.original.guestDetails;
      return (
        <div className="flex flex-col text-xs gap-1 text-gray-600">
          <p className="text-sm text-gray-900">{details.name || 'N/A'}</p>
          <p>{details.roomNo || 'N/A'}</p>
          <p>{details.phoneNumber || 'N/A'}</p>
        </div>
      );
    }
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
        Cancelled: 'cancelled', 
      } as const;

      type StatusLabel = keyof typeof statusMap;

      
      const normalizeStatus = (statusFromBackend: string): StatusLabel => {
        switch (statusFromBackend.toLowerCase()) {
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
        'Cancelled', 
      ];

      const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as StatusLabel;
        setUpdating(true);

        try {
          const data = await apiCall('PATCH', `/api/services/status/${serviceId}`, {
            status: statusMap[newStatus], 
          });

          if (
            data.success ||
            data.status === 'ok' ||
            data.message?.toLowerCase().includes('status updated')
          ) {
            setStatus(newStatus);
          } else {
            console.error('Failed to update status:', data.message || data);
          }
        } catch (error) {
          console.error('Error updating status:', error);
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
                    ? 'text-red-500' // ✅ Cancelled in red
                    : 'text-gray-500'
            }`}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option} className="text-black">
              {option}
            </option>
          ))}
        </select>
      );
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => (
      <div className="text-sm">{row.original.paymentStatus || 'N/A'}</div>
    )
  },
  {
    accessorKey: 'specialInstructions',
    header: 'Special Instructions',
    cell: ({ row }) => (
      <div className="text-sm truncate max-w-[250px]">{row.original.specialInstructions || 'N/A'}</div>
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
    accessorKey: 'coupon',
    header: 'Coupon',
    cell: ({ row }) => {
      const cp = row.original?.coupon;
      return cp?.code ? (
        <div className="flex flex-col text-xs">
          <span>Code: {cp.code}</span>
          <span>Type: {cp.type}</span>
          <span>Value: {cp.value}%</span>
        </div>
      ) : (
        <span className="text-xs text-gray-500">N/A</span>
      );
    }
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
          <div className="text-sm">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        );
      }
      return <div className="text-sm">N/A</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      if (createdAt) {
        const date = new Date(createdAt);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();

        return (
          <div className="text-xs opacity-60">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        );
      }
      return <div className="text-xs opacity-60">N/A</div>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      if (updatedAt) {
        const date = new Date(updatedAt);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();

        return (
          <div className="text-xs opacity-60">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        );
      }
      return <div className="text-xs opacity-60">N/A</div>;
    },
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => (
      <div className="text-sm">{row.original.assignedTo || 'N/A'}</div>
    )
  },
  {
    accessorKey: 'actions',
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex justify-center">
        <CellAction data={row.original} />
      </div>
    )
  }
];
