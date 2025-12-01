import GuestForm from '@/components/form/guest-management/guest-form';
import Navbar from '@/components/Navbar';
import React from 'react';
type Params = {
  id: string;
};
const ViewGuestPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen w-full pt-8 mt-16">
        <div className="h-full w-full container">
          <GuestForm isEnabled={false} guestId={id} mode="view" />
        </div>
      </div>
    </>
  );
};

export default ViewGuestPage;
