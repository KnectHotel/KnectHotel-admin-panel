
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SuperRefundType } from './client';
import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import apiCall from '@/lib/axios';
import AssignModal from './AssignModal';

export const columns: ColumnDef<SuperRefundType>[] = [
  {
    accessorKey: 'hotel.HotelId',
    header: 'Hotel ID',
    cell: ({ row }) => (
      <div className="py-4">{row.original.hotel?.HotelId || 'N/A'}</div>
    )
  },

  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <div className="py-4">₹{row.original.amount}</div>
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => {
      const [showModal, setShowModal] = useState(false);

      const assigned = row.original.assignedTo;
      const assignedName =
        assigned && typeof assigned === 'object'
          ? `${assigned.firstName} ${assigned.lastName}`
          : 'Unassigned';

      return (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm underline text-black"
          >
            {assignedName}
          </button>

          {showModal && (
            <AssignModal
              open={showModal} // ✅ add this line
              requestId={row.original._id}
              onClose={() => setShowModal(false)}
              onAssignSuccess={() => {
                window.location.reload();
              }}
            />
          )}
        </>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const colorMap: Record<string, string> = {
        Initiated: '#FC690E',
        'In-Progress': '#3787E3',
        Completed: '#78B150',
        Rejected: '#E5252A'
      };

      const router = useRouter();

      return (
        <div className="flex flex-col items-start">
          <span style={{ color: colorMap[status] || 'gray' }}>{status}</span>

          {status === 'Completed' && (
            <button
              onClick={() =>
                router.push(
                  `/hotel-panel/refund-management/edit/${row.original._id}`
                )
              }
              className="text-[#78B150] text-[10px] mt-1 underline"
            >
              View Feedback
            </button>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => (
      <div className="py-4">
        {format(new Date(row.original.updatedAt), 'dd MMM yyyy, hh:mm a')}
      </div>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const router = useRouter();
      const handleEdit = () => {
        const refundId = row.original._id;
        router.push(`/super-admin/refund-management/edit/${refundId}`);
      };

      return (
        <div className="py-4">
          <button
            onClick={handleEdit}
            className="text-gray-600 hover:text-black"
          >
            <Edit className="w-4 text-button-dark group-hover:text-white" />
          </button>
        </div>
      );
    }
  }
];