'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import apiCall from '@/lib/axios'; 
import CellAction from './cell-action';
import AssignChatModal from './AssignChatModal';

type Employee = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId?: {
    name: string;
  };
};

export type ChatWithStaff = {
  chatId: string;
  roomId: string;
  guestDetails: {
    guestID: string;
    name: string;
    roomNo: string;
    phoneNumber: string;
  };
  agentDetails: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  requestTime: string;
  productName: string;
  status: string;
  assignedTo: Employee | null;
};

export const columns: ColumnDef<ChatWithStaff>[] = [
  {
    accessorKey: 'roomId',
    header: 'Chat ID',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-gray-800">
        {row.original.roomId || 'N/A'}
      </span>
    )
  },
  {
    accessorKey: 'requestTime',
    header: 'Requested At',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.original.requestTime || 'N/A'}
      </span>
    )
  },
  {
    accessorKey: 'guestDetails',
    header: 'Guest Info',
    cell: ({ row }) => {
      const guest = row.original.guestDetails || {};
      return (
        <div className="flex flex-col text-xs text-gray-700">
          <span className="text-sm font-semibold">{guest.name || 'N/A'}</span>
          <span>Room: {guest.roomNo || 'N/A'}</span>
          <span>Ph: {guest.phoneNumber || 'N/A'}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'agentDetails',
    header: 'Agent Info',
    cell: ({ row }) => {
      const agent = row.original.agentDetails || {};
      const role = agent.name || 'N/A'; 
      return (
        <div className="flex flex-col text-xs text-gray-700">
          <span className="text-sm font-semibold">
            {agent.firstName} {agent.lastName || ''}
          </span>{' '}
          {}
          <span>{agent.email || 'N/A'}</span>
          <span>Role: {role}</span> {}
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const { useState } = React; 

      
      const statusMap = {
        Pending: 'pending',
        Active: 'active',
        Closed: 'closed',
        Cancelled: 'cancelled',
      } as const;

      type StatusLabel = keyof typeof statusMap;

      
      const normalize = (value: string): StatusLabel => {
        const val = value?.toLowerCase?.() ?? '';
        if (val === 'active') return 'Active';
        if (val === 'pending') return 'Pending';
        if (val === 'closed') return 'Closed';
        if (val === 'cancel' || val === 'cancelled' || val === 'canceled') return 'Cancelled';
        return 'Pending';
      };

      
      const colorByLabel: Record<StatusLabel, string> = {
        Active: 'text-green-600',
        Pending: 'text-yellow-600',
        Closed: 'text-red-600',
        Cancelled: 'text-gray-600',
      };

      const [status, setStatus] = useState<StatusLabel>(normalize(row.original.status));
      const [loading, setLoading] = useState(false);

      const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const next = e.target.value as StatusLabel;
        setStatus(next);
        setLoading(true);
        try {
          
          const statusValue = statusMap[next];

          
          await apiCall('PATCH', `/api/services/status/${row.original.chatId}`, {
            status: statusValue,
          });
        } catch (err) {
          console.error('❌ Error updating status:', err);
          
          setStatus(normalize(row.original.status));
        } finally {
          setLoading(false);
        }
      };

      return (
        <select
          value={status}
          onChange={handleChange}
          disabled={loading}
          className={`text-sm px-2 py-1 rounded-md border border-gray-300 focus:outline-none ${colorByLabel[status]}`}
        >
          {Object.keys(statusMap).map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      );
    },
  }
  ,
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => {
      const [showModal, setShowModal] = useState(false);
      const assigned = row.original.assignedTo;

      
      const assignedName =
        assigned && typeof assigned === 'object'
          ? `${assigned.firstName} ${assigned.lastName || ''}`.trim()
          : 'Unassigned';

      const roleName = assigned && assigned.roleId ? assigned.roleId.name : 'No Role'; 

      return (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm underline text-black"
          >
            {assignedName} - <span className="font-semibold">{roleName}</span> {}
          </button>

          {showModal && (
            <AssignChatModal
              open={showModal}
              roomId={row.original.chatId}
              onClose={() => setShowModal(false)}
              onAssignSuccess={() => window.location.reload()}
            />
          )}
        </>
      );
    }
  }


  ,
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex justify-center">
        <CellAction data={row.original} />
      </div>
    ),
  }

];
