// KnectHotel-admin-panel/app/(protected)/hotel-panel/room-management/add/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import axios from 'axios';
import { getSessionStorageItem } from 'utils/localstorage';
import { ToastAtTopRight } from '@/lib/sweetalert';
import { useHotelRoomTypes } from '@/hooks/useHotelRoomTypes';

export default function AddRoomPage() {
  const router = useRouter();
  const { roomTypes, loading: roomTypesLoading, error: roomTypesError } = useHotelRoomTypes();

  const [formData, setFormData] = useState({
    roomNumber: '',
    roomTypeId: '',
    floorNumber: '1',
    bedType: 'Standard',
    maxOccupancy: 2,
    baseRate: 0,
    status: 'Available',
    features: []
  });

  const [submitting, setSubmitting] = useState(false);

  console.log('[AddRoom] RoomTypes loaded:', roomTypes);
  console.log('[AddRoom] RoomTypes loading:', roomTypesLoading);
  console.log('[AddRoom] RoomTypes error:', roomTypesError);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('[AddRoom] Form submit started');
    console.log('[AddRoom] Form data:', formData);

    if (!formData.roomTypeId) {
      ToastAtTopRight.fire({
        icon: 'error',
        title: 'Room Type is required'
      });
      return;
    }

    if (!formData.roomNumber || formData.roomNumber.trim() === '') {
      ToastAtTopRight.fire({
        icon: 'error',
        title: 'Room Number is required'
      });
      return;
    }

    setSubmitting(true);

    try {
      const admin = getSessionStorageItem<any>('admin');
      const token = admin?.token;

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('[AddRoom] Sending POST request');

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/hotel/rooms`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('[AddRoom] Response:', response.data);

      if (response.data.success) {
        ToastAtTopRight.fire({
          icon: 'success',
          title: 'Room created successfully'
        });

        router.push('/hotel-panel/room-management');
      } else {
        throw new Error(response.data.message || 'Failed to create room');
      }

    } catch (err: any) {
      console.error('[AddRoom] Error:', err);

      const errorMessage = err.response?.data?.message || err.message || 'Failed to create room';

      ToastAtTopRight.fire({
        icon: 'error',
        title: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (roomTypesLoading) {
    return (
      <div className="flex flex-col w-full p-8 gap-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const hasRoomTypes = roomTypes && roomTypes.length > 0;

  return (
    <div className="flex flex-col w-full p-8 gap-6">
      <Heading title="Add New Room" description="Create a new room for your hotel" />

      {!hasRoomTypes && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          ⚠️ <strong>No Room Types Configured.</strong> Please configure room types before creating rooms.
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Room Number <span className="text-red-500">*</span>
            </label>
            <Input
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder="e.g., 101"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Room Type <span className="text-red-500">*</span>
            </label>
            <select
              name="roomTypeId"
              value={formData.roomTypeId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
              disabled={!hasRoomTypes}
            >
              <option value="">Select Room Type</option>
              {roomTypes.map(rt => (
                <option key={rt.roomTypeId} value={rt.roomTypeId}>
                  {rt.roomTypeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Floor Number</label>
            <Input
              name="floorNumber"
              value={formData.floorNumber}
              onChange={handleChange}
              placeholder="e.g., 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bed Type</label>
            <select
              name="bedType"
              value={formData.bedType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="Standard">Standard</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Queen">Queen</option>
              <option value="King">King</option>
              <option value="Twin">Twin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Occupancy</label>
            <Input
              type="number"
              name="maxOccupancy"
              value={formData.maxOccupancy}
              onChange={handleChange}
              min="1"
              max="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Base Rate (₹)</label>
            <Input
              type="number"
              name="baseRate"
              value={formData.baseRate}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={submitting || !hasRoomTypes}
          >
            {submitting ? 'Creating...' : 'Create Room'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
