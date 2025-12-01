'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import CreateRefundForm from '@/components/shared/coupon-refund-management/create-refund-form';

const EditSuperRefundPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="w-full h-screen mt-16">
        <div className="h-full w-full flex justify-center pt-6">
          <CreateRefundForm mode="edit" GuestId={id} />
        </div>
      </div>
    </div>
  );
};

export default EditSuperRefundPage;
