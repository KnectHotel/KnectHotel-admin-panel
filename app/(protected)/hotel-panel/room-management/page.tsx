'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { columns, RoomDataType } from '@/components/tables/room-management/columns';
import AnimatedList, { AnimatedListItem } from '@/components/ui/AnimatedList';

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
  {
    id: '5',
    roomNumber: '103',
    roomType: 'Standard',
    roomCategory: 'Non-Smoking',
    floorNumber: '1',
    bedType: 'Queen',
    maxOccupancy: 2,
    baseRate: 3500,
    status: 'Available',
  },
  {
    id: '6',
    roomNumber: '203',
    roomType: 'Deluxe',
    roomCategory: 'Non-Smoking',
    floorNumber: '2',
    bedType: 'King',
    maxOccupancy: 2,
    baseRate: 5500,
    status: 'Available',
  },
];

export default function HotelRoomPage() {
  const router = useRouter();
  const [data] = useState<RoomDataType[]>(DUMMY_DATA);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();

  // Filter rooms that are vacant (Available) and cleaned
  // In a real app, you'd have a separate "cleaned" status field
  // For now, we'll assume "Available" means both vacant and cleaned
  const availableRooms = useMemo<AnimatedListItem[]>(() => {
    return data
      .filter((room) => room.status === 'Available')
      .map((room) => ({
        id: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        floorNumber: room.floorNumber,
        status: 'Vacant & Cleaned',
      }));
  }, [data]);

  const handleRoomSelect = (item: AnimatedListItem) => {
    setSelectedRoomId(item.id);
    // You can add additional logic here, like assigning the room to a guest
    console.log('Selected room:', item);
  };

  return (
    <div className="flex flex-col w-full p-8 gap-6">
      <div className="flex w-full items-end justify-between">
        <Heading title={`Rooms (${data.length})`} description="Manage rooms for your hotel" />
        <div className="flex items-center justify-end">
          <Button onClick={() => router.push('/hotel-panel/room-management/add')}>
            <Plus className="mr-2 h-4 w-4" /> Add New Room
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Data Table */}
        <div className="lg:col-span-2">
          <DataTable searchKey="roomNumber" columns={columns} data={data} />
        </div>

        {/* Room Assignment List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <AnimatedList
              title="Assign Room (Vacant & Cleaned)"
              items={availableRooms}
              onItemClick={handleRoomSelect}
              selectedItemId={selectedRoomId}
              emptyMessage="No vacant and cleaned rooms available"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
