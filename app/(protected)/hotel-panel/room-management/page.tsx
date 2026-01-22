
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import {
  columns,
  RoomDataType
} from '@/components/tables/room-management/columns';
import AnimatedList, { AnimatedListItem } from '@/components/ui/AnimatedList';
import apiCall from '@/lib/axios';

export default function HotelRoomPage() {
  const router = useRouter();
  const [data, setData] = useState<RoomDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    console.log('[RoomManagement] Fetching rooms from API');
    setLoading(true);
    setError(null);

    try {
      // apiCall automatically handles authentication via interceptor
      const response = await apiCall<{ success: boolean; rooms: any[] }>(
        'GET',
        'api/hotel/rooms'
      );

      console.log('[RoomManagement] API response:', response);

      if (response?.success && Array.isArray(response.rooms)) {
        const formattedRooms: RoomDataType[] = response.rooms.map(
          (room: any) => ({
            id: room._id,
            roomNumber: room.roomNumber,
            roomType: room.roomTypeName,
            roomCategory: 'Standard',
            floorNumber: room.floorNumber,
            bedType: room.bedType,
            maxOccupancy: room.maxOccupancy,
            baseRate: room.baseRate,
            status: room.status
          })
        );

        console.log('[RoomManagement] Formatted rooms:', formattedRooms);
        setData(formattedRooms);
      } else {
        console.warn('[RoomManagement] No rooms found in response');
        setData([]);
      }
    } catch (err: any) {
      console.error('[RoomManagement] Error fetching rooms:', err);
      setError(err.message || 'Failed to fetch rooms');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const availableRooms = useMemo<AnimatedListItem[]>(() => {
    return data
      .filter((room) => room.status === 'Available')
      .map((room) => ({
        id: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        floorNumber: room.floorNumber,
        status: 'Vacant & Cleaned'
      }));
  }, [data]);

  const handleRoomSelect = (item: AnimatedListItem) => {
    setSelectedRoomId(item.id);
    console.log('[RoomManagement] Selected room:', item);
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full p-8 gap-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading rooms...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full p-8 gap-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-8 gap-6">
      <div className="flex w-full items-end justify-between">
        <Heading
          title={`Rooms (${data.length})`}
          description="Manage rooms for your hotel"
        />
        <div className="flex items-center justify-end">
          <Button
            onClick={() => router.push('/hotel-panel/room-management/add')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Room
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable searchKey="roomNumber" columns={columns} data={data} />
        </div>

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
