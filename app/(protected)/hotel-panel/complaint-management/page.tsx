'use client';
import Navbar from '@/components/Navbar';
import ComplaintDashboard from '@/components/shared/complaint-dashboard/ComplaintDashboard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ComplaintTable } from '@/components/hotel-complaint-management/client';
import { ComplaintSuperAdminTable } from '@/components/hotel-complaint-management/ComplaintSuperAdminTable/client';
import ComplaintDashboardWrapper from '@/components/shared/complaint-dashboard/ComplaintDashboardWrapper';

const ComplaintManagementPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');

  const handleOnClick = (actionName: string) => {
    if (actionName === 'add_admin') {
      router.push(`complaint-management/add`);
    }
  };
  return (
    <div className="w-full flex-col justify-center items-center">
      <Navbar search={true} />
      <div className="px-4 mt-24">
        <div className="flex justify-between items-center">
          <div className="flex justify-start mb-4">
            <Button
              onClick={() => setActiveTab('user')}
              className={`rounded-r-none ${activeTab === 'user' ? 'btn-active bg-[#A07D3D] text-white' : 'bg-[#A07D3D4D] text-gray-500'}`}
            >
              By User
            </Button>
            <Button
              onClick={() => setActiveTab('admin')}
              className={`rounded-l-none ${activeTab === 'admin' ? 'btn-active bg-[#A07D3D] text-white' : 'bg-[#A07D3D4D] text-gray-500'}`}
            >
              To Super Admin
            </Button>
          </div>
          {/* <Button
            className="text-xs 2xl:text-sm md:text-sm btn-primary mb-4"
            onClick={() => handleOnClick('add_admin')}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="text-white group-hover:text-black">
              Add Complaint
            </span>
          </Button> */}
          {activeTab === 'admin' && (
            <Button
              className="text-xs 2xl:text-sm md:text-sm btn-primary mb-4"
              onClick={() => handleOnClick('add_admin')}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="text-white group-hover:text-black">
                Add Complaint
              </span>
            </Button>
          )}
        </div>
      </div>
      {activeTab === 'user' && <ComplaintDashboardWrapper />}
      {activeTab === 'user' ? <ComplaintTable /> : <ComplaintSuperAdminTable />}
    </div>
  );
};

export default ComplaintManagementPage;