































import ComplaintForm from '@/components/COMPANY_COMPONENTS/complaint-management/form/complaint-form';
import Navbar from '@/components/Navbar';
import React from 'react';

type Props = {
  params: {
    id: string;
  };
};

const ComplaintDetailsFormPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;

  const source: 'hotel-toUser' | 'hotel-toSuper' | 'superadmin' =
    'hotel-toUser';

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="w-full h-screen pt-8 mt-20">
        <div className="h-full w-full container">
          <ComplaintForm mode="view" complaintID={id} source={source} />
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsFormPage;