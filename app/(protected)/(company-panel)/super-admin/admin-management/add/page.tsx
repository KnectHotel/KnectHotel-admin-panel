import AdminForm from '@/components/COMPANY_COMPONENTS/admin-management/form/admin-form';
import Navbar from '@/components/Navbar';
import React from 'react';

const AddAdminPage = () => {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="sm:px-6 sm:py-0 mt-24">
        <AdminForm mode="add" />
      </div>
    </div>
  );
};

export default AddAdminPage;
