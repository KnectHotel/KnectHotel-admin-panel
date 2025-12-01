import React from 'react';
import SubscriptionManagemetForm from '@/components/COMPANY_COMPONENTS/subscription_management/form/subscription-management-form';
import Navbar from '@/components/Navbar';

const ViewSubscriptionDetailsPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  return (
    <div className="flex flex-col w-full">
      <Navbar active search />
      <div className="flex justify-center w-full pt-8 mt-16">
        <div className="w-full container py-6 flex justify-center">
          <SubscriptionManagemetForm id={id} mode="view" />
        </div>
      </div>
    </div>
  );
};

export default ViewSubscriptionDetailsPage;
