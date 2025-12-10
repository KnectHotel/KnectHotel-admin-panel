import { RoomClient } from '@/components/tables/room-management/client';

export default function HotelRoomsPage() {
  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RoomClient />
      </div>
    </div>
  );
}
