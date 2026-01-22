
import { OrderManagementDataType } from '@/components/tables/Order-management-service/client';
import apiCall from '@/lib/axios';
import { ColumnDef } from '@tanstack/react-table';
import React, { useState } from 'react';
import CellAction from './cell-action';

export const columns: ColumnDef<OrderManagementDataType, any>[] = [
  {
    accessorKey: 'orderID',
    header: 'Order ID'
  },
  {
    accessorKey: 'requestTime',
    header: 'Request Time',
    cell: ({ row }) => {
      const { date, time } = row.original.requestTime || {};
      return (
        <div className="flex flex-col justify-center">
          <p className="text-xs 2xl:text-sm opacity-50">{date || '-'}</p>
          <p className="text-xs 2xl:text-sm opacity-50">{time || '-'}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'guestDetails',
    header: 'Guest Details',
    cell: ({ row }) => {
      const details = row.original.guestDetails || {};
      return (
        <div className="flex justify-center items-center">
          <div className="flex flex-col w-1/2 justify-center items-start gap-1">
            <p className="text-sm text-gray-900">{details.name || 'N/A'}</p>
            <p className="text-xs text-gray-600">{details.roomNo || '-'}</p>
            <p className="text-xs text-gray-600">{details.guestID || '-'}</p>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'servicetype',
    header: 'Service Type',
    cell: ({ row }) => (
      <div className="text-sm">{row.original.servicetype || 'N/A'}</div>
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
                    ? 'text-red-500' 
                    : 'text-gray-500'
            }`}
        >
          {statusOptions.map((option) => (
            <option
              key={option}
              value={option}
              className={
                option === 'Cancelled' ? 'text-red-500' : 'text-black' 
              }
            >
              {option}
            </option>
          ))}
        </select>
      );
    },
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned to',
    cell: ({ row }) => (
      <div className="text-sm">{row.original.assignedTo || 'Not Assigned'}</div>
    )
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
