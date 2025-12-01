import AdminForm from '@/components/COMPANY_COMPONENTS/admin-management/form/admin-form';
import React from 'react';
type Params = {
  id: string;
};
const EditAdminPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  return (
    <div className="flex justify-center w-full pt-8">
      <div className="w-full container py-6 flex justify-center">
        <AdminForm adminID={id} mode="edit" />
      </div>
    </div>
  );
};

export default EditAdminPage;
