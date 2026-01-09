'use client';

import { useState, useEffect } from 'react';
import apiCall from '@/lib/axios';

export interface RoomType {
  roomTypeId: string;
  roomTypeName: string;
  roomCount: number;
  amenities?: string[];
  stayflexiRatePlanId?: string | null;
}

interface UseHotelRoomTypesResult {
  roomTypes: RoomType[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch hotel-specific room types from the backend.
 * Fetches directly from /api/hotel/room-types endpoint.
 * 
 * @returns {UseHotelRoomTypesResult} - roomTypes array, loading state, error, and refetch function
 */
export function useHotelRoomTypes(): UseHotelRoomTypesResult {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomTypes = async () => {
    setLoading(true);
    setError(null);

    try {
      console.debug('[useHotelRoomTypes] Fetching room types from API');

      // Fetch room types directly from dedicated endpoint
      const response = await apiCall('GET', '/api/hotel/room-types');

      console.debug('[useHotelRoomTypes] API response:', {
        success: response?.success,
        count: response?.count,
        roomTypesLength: response?.roomTypes?.length || 0
      });

      if (response?.success && Array.isArray(response.roomTypes)) {
        const mappedRoomTypes: RoomType[] = response.roomTypes.map((rt: any) => ({
          roomTypeId: rt.roomTypeId,
          roomTypeName: rt.roomTypeName,
          roomCount: rt.roomCount || 0,
          amenities: rt.amenities || [],
          stayflexiRatePlanId: rt.stayflexiRatePlanId || null,
        }));

        console.debug('[useHotelRoomTypes] Loaded room types:', mappedRoomTypes.length);
        setRoomTypes(mappedRoomTypes);
      } else {
        console.warn('[useHotelRoomTypes] No room types returned from API');
        setRoomTypes([]);
      }

    } catch (err: any) {
      console.error('[useHotelRoomTypes] Error fetching room types:', err);
      setError(err?.message || 'Failed to fetch room types');
      setRoomTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  return {
    roomTypes,
    loading,
    error,
    refetch: fetchRoomTypes,
  };
}

export default useHotelRoomTypes;

