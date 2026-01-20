import GuestForm from '@/components/form/guest-management/guest-form';
import Navbar from '@/components/Navbar';

const ViewGuestPendingRequest = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  
  const mode = 'pending';

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="flex flex-col justify-center items-center w-full px-4 md:px-8 pt-10 mt-14">
        <GuestForm isEnabled={false} guestId={id} mode="pending" />
      </div>
    </div>
  );
};

export default ViewGuestPendingRequest;
