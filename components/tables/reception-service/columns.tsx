'use client';
import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import { ReceptionDataType } from 'app/static/services-management/Reception';
import React, { useState } from 'react';
import apiCall from '@/lib/axios';

export const columns = (): ColumnDef<ReceptionDataType>[] => [
  {
    accessorKey: 'orderID',
    header: 'Request ID'
  },
  {
    accessorKey: 'guestDetails',
    header: 'Guest Details',
    cell: ({ row }) => {
      const details = row.original.guestDetails || {};
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
    accessorKey: 'requestType',
    header: 'Request Type',
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.requestType || 'N/A'}</div>;
    }
  },
  {
    accessorKey: 'wakeUpTime',
    header: 'Wake-up Time',
    cell: ({ row }) => {
      const wakeUpTime = row.original.wakeUpTime;
      if (wakeUpTime) {
        const date = new Date(wakeUpTime);
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const serviceId = row.original._id || row.original.requestID;

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
        'Cancelled', // ✅ added here
      ];

      const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as StatusLabel;
        setUpdating(true);

        try {
          const data = await apiCall('PATCH', `/api/services/status/${serviceId}`, {
            status: statusMap[newStatus], // lowercase value to backend
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
            <option
              key={option}
              value={option}
              className={option === 'Cancelled' ? 'text-red-500' : 'text-black'} // ✅ option red too
            >
              {option}
            </option>
          ))}
        </select>
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
    }
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.assignedTo || 'N/A'}</div>;
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
