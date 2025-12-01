import AdminForm from '@/components/COMPANY_COMPONENTS/admin-management/form/admin-form';
import Navbar from '@/components/Navbar';
import React from 'react';
type Params = {
  id: string;
};
const ViewAdminPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="sm:px-6 sm:py-0 mt-24">
        <AdminForm adminID={id} mode="view" />
      </div>
    </div>
  );
};

export default ViewAdminPage;
