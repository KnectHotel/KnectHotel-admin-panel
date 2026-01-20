


















































































































































































































'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SOSManagementDataType } from './client';
import apiCall from '@/lib/axios';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const columns: ColumnDef<SOSManagementDataType>[] = [
  {
    accessorKey: 'uniqueId',
    header: 'SOS ID'
  },
  {
    accessorKey: 'type',
    header: 'Emergency Type',
    cell: ({ row }) => {
      const status = row.original.type;
      switch (status) {
        case 'Fire':
          return <div className="text-sm text-[#E5252A]">{status}</div>;
        case 'Medical':
          return <div className="text-sm text-[#3787E3]">{status}</div>;
        case 'Security':
          return <div className="text-sm text-[#9C27B0]">{status}</div>;
        default:
          return <div className="text-sm text-gray-500">{status}</div>;
      }
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const router = useRouter();
      const pathname = usePathname();
      const serviceId = row.original._id;

      const statusMap = {
        Pending: 'pending',
        'In-Progress': 'in-progress',
        Completed: 'completed'
      } as const;
      type StatusLabel = keyof typeof statusMap;

      const normalizeStatus = (s?: string): StatusLabel => {
        switch ((s || '').toLowerCase()) {
          case 'pending':
            return 'Pending';
          case 'in-progress':
            return 'In-Progress';
          case 'completed':
            return 'Completed';
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
        'Completed'
      ];

      const forceRefresh = () => {
        try {
          
          router.refresh();
        } catch {}
        try {
          
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('_r', String(Date.now()));
            
            window.location.replace(url.toString());
          }
        } catch {
          
          if (typeof window !== 'undefined') window.location.reload();
        }
      };

      const handleStatusChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
      ) => {
        const newStatus = e.target.value as StatusLabel;
        setUpdating(true);

        if (!serviceId) {
          console.error(
            '❌ serviceId is undefined. row.original:',
            row.original
          );
          setUpdating(false);
          return;
        }

        try {
          const payload = { status: statusMap[newStatus] };
          await apiCall('PUT', `/api/sos/${serviceId}`, payload);

          
          setStatus(newStatus);

          
          setTimeout(() => forceRefresh(), 120);
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            JSON.stringify(error) ||
            'Unknown error';
          console.error('❌ Error updating status:', message, error);

          
          
        } finally {
          setUpdating(false);
        }
      };

      return (
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={updating}
          className={`text-sm px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring ${
            status === 'Pending'
              ? 'text-[#3787E3]'
              : status === 'In-Progress'
                ? 'text-[#FC690E]'
                : status === 'Completed'
                  ? 'text-[#78B150]'
                  : 'text-gray-500'
          }`}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      if (createdAt) {
        const date = new Date(createdAt);
        return (
          <div className="text-xs opacity-60">
            <div>{date.toLocaleDateString()}</div>
            <div>{date.toLocaleTimeString()}</div>
          </div>
        );
      }
      return <div className="text-xs opacity-60">N/A</div>;
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
  }
];
