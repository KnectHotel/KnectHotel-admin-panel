'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export interface RoomDataType {
  id: string;
  roomNumber: string;
  roomType: string;
  roomCategory: string; 
  floorNumber: string;
  bedType: string;
  maxOccupancy: number;
  baseRate: number;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
}

export const columns: ColumnDef<RoomDataType>[] = [
  {
    accessorKey: 'roomNumber',
    header: 'Room Number',
  },
  {
    accessorKey: 'roomType',
    header: 'Room Type',
    cell: ({ row }) => {
      const roomType = row.getValue('roomType') as string;
      const isUnlinked = roomType === 'Unlinked';

      return (
        <div className={`${isUnlinked ? 'text-red-600 font-semibold flex items-center gap-1' : ''}`}>
          {isUnlinked && (
            <span className="text-red-600" title="Room not linked to any Room Type">
              ⚠️
            </span>
          )}
          {roomType}
        </div>
      );
    },
  },
  {
    accessorKey: 'roomCategory',
    header: 'Category',
  },
  {
    accessorKey: 'floorNumber',
    header: 'Floor',
  },
  {
    accessorKey: 'bedType',
    header: 'Bed Type',
  },
  {
    accessorKey: 'maxOccupancy',
    header: 'Max Occupancy',
  },
  {
    accessorKey: 'baseRate',
    header: 'Base Rate',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('baseRate'));
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      let colorClass = 'text-gray-500';
      if (status === 'Available') colorClass = 'text-green-500';
      if (status === 'Occupied') colorClass = 'text-red-500';
      if (status === 'Maintenance') colorClass = 'text-yellow-500';
      if (status === 'Reserved') colorClass = 'text-blue-500';

      return <div className={`font-medium ${colorClass}`}>{status}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
