


















import React from 'react';
import ComplaintForm from '@/components/COMPANY_COMPONENTS/complaint-management/form/complaint-form';
import Navbar from '@/components/Navbar';

const ComplaintDetailsFormPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="w-full px-4 md:px-8 py-10 mt-8">
        <ComplaintForm mode="view" complaintID={id} source="superadmin" />
      </div>
    </div>
  );
};

export default ComplaintDetailsFormPage;
