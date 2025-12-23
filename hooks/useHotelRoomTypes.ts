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
 * Generate a deterministic roomTypeId from hotel ID and room type name.
 * Format: KNECT_RT_{HOTELID_SUFFIX}_{ROOMTYPE_NORMALIZED}
 */
function generateRoomTypeId(hotelId: string, roomTypeName: string): string {
  const hotelSuffix = hotelId.slice(-8).toUpperCase();
  const normalizedName = roomTypeName.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
  return `KNECT_RT_${hotelSuffix}_${normalizedName}`;
}

/**
 * Hook to fetch hotel-specific room types from the backend.
 * Falls back to deriving room types from hotel.rooms[] if roomTypes[] is empty.
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
      // Get HotelId from session storage (same pattern as guest-form.tsx)
      let hotelId: string | null = null;
      try {
        const item = sessionStorage.getItem('admin');
        if (item) {
          const adminData = JSON.parse(item);
          hotelId = adminData?.user?.HotelId || adminData?.HotelId || null;
        }
      } catch (e) {
        console.error('[useHotelRoomTypes] Failed to get hotelId from session:', e);
      }

      if (!hotelId) {
        setError('Hotel context not found. Please refresh the page.');
        setLoading(false);
        return;
      }

      console.debug('[useHotelRoomTypes] Fetching room types for hotel:', hotelId);

      // Fetch hotel data which includes roomTypes and rooms
      const response = await apiCall('GET', `/api/hotel/get-hotel/${hotelId}`);
      const hotel = response?.hotel;

      console.debug('[useHotelRoomTypes] Hotel response:', {
        hasRoomTypes: !!hotel?.roomTypes?.length,
        roomTypesCount: hotel?.roomTypes?.length || 0,
        hasRooms: !!hotel?.rooms?.length,
        roomsCount: hotel?.rooms?.length || 0,
      });

      // Priority 1: Use roomTypes[] if available
      if (hotel?.roomTypes && Array.isArray(hotel.roomTypes) && hotel.roomTypes.length > 0) {
        const mappedRoomTypes: RoomType[] = hotel.roomTypes.map((rt: any) => ({
          roomTypeId: rt.roomTypeId || generateRoomTypeId(hotelId!, rt.roomTypeName || rt.name || 'UNKNOWN'),
          roomTypeName: rt.roomTypeName || rt.name || 'Unknown',
          roomCount: rt.roomCount || 0,
          amenities: rt.amenities || [],
          stayflexiRatePlanId: rt.stayflexiRatePlanId || null,
        }));
        console.debug('[useHotelRoomTypes] Using roomTypes[]:', mappedRoomTypes);
        setRoomTypes(mappedRoomTypes);
        return;
      }

      // Priority 2: Derive from rooms[] if roomTypes[] is empty
      if (hotel?.rooms && Array.isArray(hotel.rooms) && hotel.rooms.length > 0) {
        console.debug('[useHotelRoomTypes] roomTypes[] empty, deriving from rooms[]');

        // Group rooms by roomType to get unique room types and counts
        const roomTypeMap = new Map<string, { count: number; features: string[] }>();

        hotel.rooms.forEach((room: any) => {
          const roomTypeName = room.roomType || room.roomName || 'Standard';
          const existing = roomTypeMap.get(roomTypeName);
          if (existing) {
            existing.count++;
            // Merge features/amenities
            if (room.features) {
              room.features.forEach((f: string) => {
                if (!existing.features.includes(f)) {
                  existing.features.push(f);
                }
              });
            }
          } else {
            roomTypeMap.set(roomTypeName, {
              count: 1,
              features: room.features || [],
            });
          }
        });

        // Convert to RoomType array
        const derivedRoomTypes: RoomType[] = Array.from(roomTypeMap.entries()).map(([name, data]) => ({
          roomTypeId: generateRoomTypeId(hotelId!, name),
          roomTypeName: name,
          roomCount: data.count,
          amenities: data.features,
          stayflexiRatePlanId: null,
        }));

        console.debug('[useHotelRoomTypes] Derived room types from rooms[]:', derivedRoomTypes);
        setRoomTypes(derivedRoomTypes);
        return;
      }

      // No room data at all
      console.warn('[useHotelRoomTypes] No roomTypes or rooms found for hotel:', hotelId);
      setRoomTypes([]);

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

