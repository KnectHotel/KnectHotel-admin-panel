'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { columns, RoomDataType } from './columns';

const DUMMY_DATA: RoomDataType[] = [
  {
    id: '1',
    roomNumber: '101',
    roomType: 'Deluxe',
    roomCategory: 'Non-Smoking',
    floorNumber: '1',
    bedType: 'King',
    maxOccupancy: 2,
    baseRate: 5000,
    status: 'Available',
  },
  {
    id: '2',
    roomNumber: '102',
    roomType: 'Standard',
    roomCategory: 'Smoking',
    floorNumber: '1',
    bedType: 'Queen',
    maxOccupancy: 2,
    baseRate: 3500,
    status: 'Occupied',
  },
  {
    id: '3',
    roomNumber: '201',
    roomType: 'Suite',
    roomCategory: 'Non-Smoking',
    floorNumber: '2',
    bedType: 'King',
    maxOccupancy: 4,
    baseRate: 12000,
    status: 'Available',
  },
  {
    id: '4',
    roomNumber: '202',
    roomType: 'Deluxe',
    roomCategory: 'Non-Smoking',
    floorNumber: '2',
    bedType: 'Twin',
    maxOccupancy: 2,
    baseRate: 5500,
    status: 'Maintenance',
  },
];

export const RoomClient: React.FC = () => {
  const router = useRouter();
  const [data] = useState<RoomDataType[]>(DUMMY_DATA);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Rooms (${data.length})`} description="Manage rooms for your hotel" />
        <Button onClick={() => router.push('/super-admin/hotel-management/rooms/add')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Room
        </Button>
      </div>
      <DataTable searchKey="roomNumber" columns={columns} data={data} />
    </>
  );
};
