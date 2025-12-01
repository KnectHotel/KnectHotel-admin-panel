import { AdminTable } from '@/components/COMPANY_COMPONENTS/admin-management/tables/client';
import Navbar from '@/components/Navbar';
import React from 'react';

const EmployeeManagementPage = () => {
  return (
    <div className="flex flex-col w-full">
      <Navbar active={true} search={true} />
      <div className="sm:px-6 sm:py-0 mt-20">
        <AdminTable />
      </div>
    </div>
  );
};

export default EmployeeManagementPage;
