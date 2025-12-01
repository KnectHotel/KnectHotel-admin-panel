import CreateHotelIdForm from '@/components/COMPANY_COMPONENTS/hotel-management/form/create-hotel-id-form';
import HotelForm from '@/components/form/hotel-profile/hotel-form';
import Navbar from '@/components/Navbar';

const ViewPendingHotelPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  // console.log(id)
  const mode = 'pending';

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="w-full px-4 md:px-8 py-10 mt-14">
        <HotelForm mode="pending" hotelId={id} />
      </div>
    </div>
  );
};

export default ViewPendingHotelPage;
