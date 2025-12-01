import NotificationDetailsForm from '@/components/form/notifications/notification-details-form';
import React from 'react';
type Params = {
  id: string;
};
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return (
    <div className="flex justify-center bg-white items-start w-full h-screen pt-24 px-14">
      <NotificationDetailsForm
        isEnabled={false}
        notificationId={id}
        mode="view"
      />
    </div>
  );
};

export default page;
