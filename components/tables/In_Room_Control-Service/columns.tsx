


'use client';

import { ColumnDef } from '@tanstack/react-table';
import { InRoomControlDataType } from '@/components/tables/In_Room_Control-Service/client';
import CellAction from './cell-action';
import apiCall from '@/lib/axios';
import React, { useState } from 'react';

export const columns: ColumnDef<InRoomControlDataType, any>[] = [
  {
    accessorKey: 'orderID',
    header: 'Request ID',
    cell: ({ row }) => <div className="text-sm">{row.original.orderID}</div>
  },
  {
    accessorKey: 'guestDetails',
    header: 'Guest Details',
    cell: ({ row }) => {
      const details = row.original.guestDetails;
      return (
        <div className="flex justify-center items-start">
          <div className="flex flex-col w-full gap-1">
            <p className="text-sm text-gray-900">{details.name}</p>
            <p className="text-xs text-gray-600">Room: {details.roomNo}</p>
            <p className="text-xs text-gray-600">Phone: {details.phoneNumber}</p>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'issueType',
    header: 'Issue Type',
    cell: ({ row }) => <div className="text-sm">{row.original.issueType}</div>
  },
  {
    accessorKey: 'estimatedDeliveryTime',
    header: 'Estimated Delivery Time',
    cell: ({ row }) => {
      const estimatedDeliveryTime = row.original.estimatedDeliveryTime;
      if (estimatedDeliveryTime) {
        const date = new Date(estimatedDeliveryTime);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();

        return (
          <div className="text-sm">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        );
      }
      return <div className="text-sm">-</div>;
    },
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => (
      <div className="flex flex-col text-sm">
        <span>{row.original.assignedTo}</span>
        <span className="text-xs text-gray-500">{row.original.assignedToMobile}</span>
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const serviceId = row.original.requestID;

      
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

      const statusOptions: StatusLabel[] = ['Pending', 'In-Progress', 'Completed', 'Cancelled'];

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
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <div className="text-sm">{row.original.description}</div>
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
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      if (updatedAt) {
        const date = new Date(updatedAt);
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
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction data={row.original} />
      </div>
    )
  }
];
