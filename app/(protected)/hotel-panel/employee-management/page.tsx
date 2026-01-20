import Navbar from '@/components/Navbar';
import { EmployeeTable } from '@/components/tables/employee-management/client';
import React from 'react';

const EmployeeManagementPage = () => {
  return (
    <div className="flex flex-col w-full">
      {' '}
      {}
      <Navbar active={true} search={true} />
      <div className=" sm:px-6 sm:py-0 mt-20">
        <EmployeeTable />
      </div>
    </div>
  );
};

export default EmployeeManagementPage;
