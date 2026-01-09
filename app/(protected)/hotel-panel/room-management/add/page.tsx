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
  const { roomTypes, loading: roomTypesLoading, refetch } = useHotelRoomTypes();

  const [isNewRoomType, setIsNewRoomType] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomTypeId: '',
    roomTypeName: '',  // For new room type
    floorNumber: '1',
    bedType: 'Standard',
    maxOccupancy: 2,
    baseRate: 0,
    status: 'Available',
    features: []
  });

  const [submitting, setSubmitting] = useState(false);

  console.log('[AddRoom] RoomTypes loaded:', roomTypes);
  console.log('[AddRoom] Mode:', isNewRoomType ? 'Create New' : 'Select Existing');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === '__CREATE_NEW__') {
      setIsNewRoomType(true);
      setFormData(prev => ({ ...prev, roomTypeId: '', roomTypeName: '' }));
    } else {
      setIsNewRoomType(false);
      setFormData(prev => ({ ...prev, roomTypeId: value, roomTypeName: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('[AddRoom] Form submit started');
    console.log('[AddRoom] Form data:', formData);

    // Validation
    if (!formData.roomNumber || formData.roomNumber.trim() === '') {
      ToastAtTopRight.fire({
        icon: 'error',
        title: 'Room Number is required'
      });
      return;
    }

    if (isNewRoomType) {
      if (!formData.roomTypeName || formData.roomTypeName.trim() === '') {
        ToastAtTopRight.fire({
          icon: 'error',
          title: 'Room Type Name is required'
        });
        return;
      }
    } else {
      if (!formData.roomTypeId) {
        ToastAtTopRight.fire({
          icon: 'error',
          title: 'Please select a room type'
        });
        return;
      }
    }

    setSubmitting(true);

    try {
      const admin = getSessionStorageItem<any>('admin');
      const token = admin?.token;

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('[AddRoom] Sending POST request');

      // Prepare payload based on mode
      const payload = {
        roomNumber: formData.roomNumber,
        floorNumber: formData.floorNumber,
        bedType: formData.bedType,
        maxOccupancy: formData.maxOccupancy,
        baseRate: formData.baseRate,
        status: formData.status,
        features: formData.features,
        ...(isNewRoomType
          ? { roomTypeName: formData.roomTypeName }  // New room type
          : { roomTypeId: formData.roomTypeId }       // Existing room type
        )
      };

      console.log('[AddRoom] Payload:', payload);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/hotel/rooms`,
        payload,
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
          title: isNewRoomType
            ? 'Room and Room Type created successfully'
            : 'Room created successfully'
        });

        // Refresh room types list if new one was created
        if (isNewRoomType) {
          await refetch();
        }

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

  return (
    <div className="flex flex-col w-full p-8 gap-6">
      <Heading title="Add New Room" description="Create a new room for your hotel" />

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
              value={isNewRoomType ? '__CREATE_NEW__' : formData.roomTypeId}
              onChange={handleRoomTypeSelect}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select Room Type</option>
              {roomTypes.map(rt => (
                <option key={rt.roomTypeId} value={rt.roomTypeId}>
                  {rt.roomTypeName}
                </option>
              ))}
              <option value="__CREATE_NEW__">➕ Create New Room Type</option>
            </select>
          </div>

          {isNewRoomType && (
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                New Room Type Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="roomTypeName"
                value={formData.roomTypeName}
                onChange={handleChange}
                placeholder="e.g., Deluxe, Premium, Suite"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                A new room type will be created and can be used for future rooms
              </p>
            </div>
          )}

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
            disabled={submitting}
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
