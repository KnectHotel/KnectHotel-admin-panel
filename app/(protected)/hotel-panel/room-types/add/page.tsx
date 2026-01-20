
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import axios from 'axios';
import { getSessionStorageItem } from 'utils/localstorage';
import { ToastAtTopRight } from '@/lib/sweetalert';

export default function AddRoomTypePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    roomTypeName: '',
    roomCount: 1,
    amenities: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roomCount' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomTypeName || formData.roomTypeName.trim() === '') {
      ToastAtTopRight.fire({
        icon: 'error',
        title: 'Room Type Name is required'
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

      const amenitiesArray = formData.amenities
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/hotel/room-types`,
        {
          roomTypeName: formData.roomTypeName.trim(),
          roomCount: formData.roomCount,
          amenities: amenitiesArray
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        ToastAtTopRight.fire({
          icon: 'success',
          title: 'Room type created successfully'
        });

        router.push('/hotel-panel/room-types');
      } else {
        throw new Error(response.data.message || 'Failed to create room type');
      }

    } catch (err: any) {
      console.error('Error:', err);

      const errorMessage = err.response?.data?.message || err.message || 'Failed to create room type';

      ToastAtTopRight.fire({
        icon: 'error',
        title: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-8 gap-6">
      <Heading title="Add Room Type" description="Create a new room type configuration" />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Room Type Name <span className="text-red-500">*</span>
          </label>
          <Input
            name="roomTypeName"
            value={formData.roomTypeName}
            onChange={handleChange}
            placeholder="e.g., Deluxe, Standard, Suite"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This name will be used in bookings and room selection
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Room Count
          </label>
          <Input
            type="number"
            name="roomCount"
            value={formData.roomCount}
            onChange={handleChange}
            min="1"
            placeholder="Number of rooms of this type"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Amenities (comma-separated)
          </label>
          <Input
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="e.g., AC, TV, WiFi, Mini Bar"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple amenities with commas
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Room Type'}
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
