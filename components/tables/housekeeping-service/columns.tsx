
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { HousekeepingDataType } from 'app/static/services-management/Housekeeping';
import CellAction from './cell-action';
import apiCall from '@/lib/axios';
import React, { useState } from 'react';

export const columns: ColumnDef<HousekeepingDataType>[] = [
  {
    accessorKey: 'uniqueId',
    header: 'Request ID',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const { date, time } = row.original.createdAt || {};
      return (
        <div className="flex flex-col text-xs opacity-50">
          <p>{date || 'N/A'}</p>
          <p>{time || 'N/A'}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => {
      const { date, time } = row.original.updatedAt || {};
      return (
        <div className="flex flex-col text-xs opacity-50">
          <p>{date || 'N/A'}</p>
          <p>{time || 'N/A'}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'guestDetails',
    header: 'Guest Details',
    cell: ({ row }) => {
      const details = row.original.guestDetails || {};
      return (
        <div className="flex flex-col text-xs gap-1 text-gray-600">
          <p className="text-sm text-gray-900">{details.name || 'N/A'}</p>
          <p>{details.phoneNumber || 'N/A'}</p>
          <p>{details.roomNo || 'N/A'}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'requestType',
    header: 'Request Type',
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.requestType || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const serviceId = row.original._id || row.original.requestID;

      // Map UI display values to backend values
      const statusMap = {
        Pending: 'pending',
        'In-Progress': 'in-progress',
        Completed: 'completed',
        Cancelled: 'cancelled', // ✅ added
      } as const;

      type StatusLabel = keyof typeof statusMap;

      // Normalize backend value to match UI expected values
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

      const statusOptions: StatusLabel[] = ['Pending', 'In-Progress', 'Completed', 'Cancelled'];

      const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as StatusLabel;
        setUpdating(true);

        try {
          const data = await apiCall('PATCH', `/api/services/status/${serviceId}`, {
            status: statusMap[newStatus], // lowercase value for backend
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
                  ? 'text-red-500' // ✅ Cancelled option in red
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
    ),
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => (
      <div className="text-sm">{row.original.assignedTo || 'N/A'}</div>
    ),
  },
  {
    accessorKey: 'estimatedTime',
    header: 'Estimated Delivery',
    cell: ({ row }) => {
      const estimatedTime = row.original.estimatedTime;
      if (estimatedTime) {
        const date = new Date(estimatedTime);
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
    accessorKey: 'actions',
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction data={row.original} />
      </div>
    ),
  },
];
