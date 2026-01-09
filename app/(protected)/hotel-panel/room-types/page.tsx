// KnectHotel-admin-panel/app/(protected)/hotel-panel/room-types/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { getSessionStorageItem } from 'utils/localstorage';
import { ToastAtTopRight } from '@/lib/sweetalert';

export default function RoomTypesPage() {
  const router = useRouter();
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const admin = getSessionStorageItem<any>('admin');
      const token = admin?.token;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}api/hotel/room-types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setRoomTypes(response.data.roomTypes);
      }
    } catch (error: any) {
      console.error('Error fetching room types:', error);
      ToastAtTopRight.fire({
        icon: 'error',
        title: error.response?.data?.message || 'Failed to fetch room types'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomTypeId: string, roomTypeName: string) => {
    const result = await ToastAtTopRight.fire({
      title: `Delete ${roomTypeName}?`,
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      const admin = getSessionStorageItem<any>('admin');
      const token = admin?.token;

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}api/hotel/room-types/${roomTypeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        ToastAtTopRight.fire({
          icon: 'success',
          title: 'Room type deleted'
        });
        fetchRoomTypes();
      }
    } catch (error: any) {
      ToastAtTopRight.fire({
        icon: 'error',
        title: error.response?.data?.message || 'Failed to delete room type'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full p-8 gap-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-8 gap-6">
      <div className="flex w-full items-end justify-between">
        <Heading
          title={`Room Types (${roomTypes.length})`}
          description="Manage room type configurations for your hotel"
        />
        <Button onClick={() => router.push('/hotel-panel/room-types/add')}>
          <Plus className="mr-2 h-4 w-4" /> Add Room Type
        </Button>
      </div>

      {roomTypes.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 px-4 py-8 rounded text-center">
          <p className="text-gray-700 mb-4">No room types configured yet.</p>
          <Button onClick={() => router.push('/hotel-panel/room-types/add')}>
            <Plus className="mr-2 h-4 w-4" /> Add Your First Room Type
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amenities
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roomTypes.map((roomType: any) => (
                <tr key={roomType.roomTypeId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {roomType.roomTypeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {roomType.roomCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {roomType.roomTypeId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {roomType.amenities?.length > 0 ? roomType.amenities.join(', ') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(roomType.roomTypeId, roomType.roomTypeName)}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
