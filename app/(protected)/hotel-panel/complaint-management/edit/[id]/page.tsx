import ComplaintForm from '@/components/COMPANY_COMPONENTS/complaint-management/form/complaint-form';
import Navbar from '@/components/Navbar';
import React from 'react';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const ComplaintDetailsFormPageSuper = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;

  // Source fixed only for hotel-toSuper (editable)
  const source: 'hotel-toUser' | 'hotel-toSuper' | 'superadmin' = 'hotel-toSuper';

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="w-full h-screen pt-8 mt-20">
        <div className="h-full w-full container">
          {/* Editable form for hotel-toSuper */}
          <ComplaintForm mode="edit" complaintID={id} source={source} />
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsFormPageSuper;
