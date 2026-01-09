'use client';

import { useState, useEffect } from 'react';
import apiCall from '@/lib/axios';

export interface HotelRoom {
  _id: string;
  roomNumber: string;
  roomTypeId: string;
  roomTypeName: string;
  floorNumber?: string;
  bedType?: string;
  maxOccupancy?: number;
  baseRate?: number;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
  features?: string[];
}

interface UseHotelRoomsResult {
  rooms: HotelRoom[];
  availableRooms: HotelRoom[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch hotel rooms from the backend.
 * Returns all rooms and filtered available rooms for assignment.
 * 
 * @returns {UseHotelRoomsResult} - rooms array, availableRooms, loading state, error, and refetch function
 */
export function useHotelRooms(): UseHotelRoomsResult {
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);

    try {
      console.debug('[useHotelRooms] Fetching rooms from API');

      // Fetch rooms directly from dedicated endpoint
      const response = await apiCall('GET', '/api/hotel/rooms');

      console.debug('[useHotelRooms] API response:', {
        success: response?.success,
        count: response?.count,
        roomsLength: response?.rooms?.length || 0
      });

      if (response?.success && Array.isArray(response.rooms)) {
        console.debug('[useHotelRooms] Loaded rooms:', response.rooms.length);
        setRooms(response.rooms);
      } else {
        console.warn('[useHotelRooms] No rooms returned from API');
        setRooms([]);
      }

    } catch (err: any) {
      console.error('[useHotelRooms] Error fetching rooms:', err);
      setError(err?.message || 'Failed to fetch rooms');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter only available rooms for assignment
  const availableRooms = rooms.filter(room => room.status === 'Available');

  return {
    rooms,
    availableRooms,
    loading,
    error,
    refetch: fetchRooms,
  };
}

export default useHotelRooms;
