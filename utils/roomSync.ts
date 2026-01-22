


import { setLocalStorageItem, getLocalStorageItem } from './localstorage';

export interface RoomSyncData {
  roomType: string;
  roomCategory?: string;
  floorNumber?: string;
  tower?: string;
  bedType?: string;
  maxOccupancy?: number;
  roomSize?: string;
  baseRate?: number;
  amenities?: string; 
}

const ROOM_SYNC_KEY = 'room_management_sync_data';


export function saveRoomSyncData(data: RoomSyncData): void {
  setLocalStorageItem(ROOM_SYNC_KEY, data);
}


export function getRoomSyncData(): RoomSyncData | null {
  return getLocalStorageItem<RoomSyncData>(ROOM_SYNC_KEY);
}


export function clearRoomSyncData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ROOM_SYNC_KEY);
  }
}


export function convertToRoomConfigs(data: RoomSyncData): { roomType: string; features: string[] } {
  const features: string[] = [];
  
  
  if (data.amenities) {
    const amenityList = data.amenities
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);
    features.push(...amenityList);
  }
  
  
  if (data.roomCategory) {
    features.push(`Category: ${data.roomCategory}`);
  }
  if (data.bedType) {
    features.push(`Bed: ${data.bedType}`);
  }
  if (data.maxOccupancy) {
    features.push(`Max Occupancy: ${data.maxOccupancy}`);
  }
  if (data.roomSize) {
    features.push(`Size: ${data.roomSize} sq. ft`);
  }
  if (data.floorNumber) {
    features.push(`Floor: ${data.floorNumber}`);
  }
  if (data.tower) {
    features.push(`Tower: ${data.tower}`);
  }
  if (data.baseRate) {
    features.push(`Base Rate: ₹${data.baseRate}`);
  }

  return {
    roomType: data.roomType || 'Standard',
    features: features.length > 0 ? features : ['Standard Room']
  };
}

