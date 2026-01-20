import { RoomForm } from '@/components/form/room-management/room-form';

type PageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export default async function HotelRoomPage({ params }: PageProps) {
  const { roomId } = await params;

  
  const initialData =
    roomId === 'add'
      ? null
      : {
          roomNumber: '101',
          roomType: 'Deluxe',
          roomCategory: 'Non-Smoking',
          floorNumber: '1',
          tower: 'Tower A',
          bedType: 'King',
          maxOccupancy: 2,
          roomSize: '350',
          amenities: 'WiFi, AC, TV',
          baseRate: 5000,
        };

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RoomForm initialData={initialData} />
      </div>
    </div>
  );
}

