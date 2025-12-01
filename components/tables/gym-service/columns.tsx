

import { ColumnDef } from '@tanstack/react-table';
import { GymServiceDataType } from 'app/static/services-management/Gym';
import CellAction from './cell-action';
import apiCall from '@/lib/axios';
import React, { useState } from 'react';

export const columns: ColumnDef<GymServiceDataType>[] = [
  {
    accessorKey: 'serviceID',
    header: 'Request ID'
  },
  {
    accessorKey: 'guestDetails',
    header: 'Guest Details',
    cell: ({ row }) => {
      const details = row.original.guestDetails;
      return (
        <div className="flex justify-center items-center">
          <div className="flex flex-col w-1/2 justify-center items-start gap-1">
            <p className="text-sm text-gray-900">{details.name || 'N/A'}</p>
            <p>{details.roomNo || 'N/A'}</p>
            <p>{details.phoneNumber || 'N/A'}</p>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'facilityType',
    header: 'Facility',
    cell: ({ row }) => <div className="text-sm">{row.original.facilityType}</div>
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
  }

  ,
  {
    accessorKey: 'paymentStatus',
    header: 'Payment',
    cell: ({ row }) => <div className="text-sm">{row.original.paymentStatus}</div>
  },
  {
    accessorKey: 'paymentDate',
    header: 'Payment Date',
    cell: ({ row }) => {
      const rawDate = row.original.paymentDate;
      const date = new Date(rawDate);

      if (!rawDate || isNaN(date.getTime())) {
        return <div className="text-xs opacity-70">N/A</div>;
      }

      return (
        <div className="text-xs opacity-70">
          <div>{date.toLocaleDateString()}</div>
          <div>{date.toLocaleTimeString()}</div>
        </div>
      );
    }
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
    accessorKey: 'slot',
    header: 'Slot Details',
    cell: ({ row }) => {
      const slot = row.original.slot;
      return (
        <div className="text-xs leading-5 text-gray-700">
          <p><span className="font-medium text-gray-800">Day:</span> {slot?.dayOfWeek || 'N/A'}</p>
          <p>
            <span className="font-medium text-gray-800">Time:</span> {slot?.startTime || '--'} - {slot?.endTime || '--'}
          </p>
          <p><span className="font-medium text-gray-800">Price:</span> ₹{slot?.price ?? 0}</p>
          <p>
            <span className="font-medium text-gray-800">Capacity:</span> {slot?.currentCapacity ?? 0}/{slot?.maxCapacity ?? 0}
          </p>
        </div>
      );
    }
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
