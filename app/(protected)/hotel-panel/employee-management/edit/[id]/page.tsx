'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeForm from '@/components/form/employee_management/employee-form';
import Navbar from '@/components/Navbar';
import apiCall from '@/lib/axios';

type Params = {
  id: string;
};

const EditGuestPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  
  const { id } = React.use(params);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await apiCall('GET', `api/employee/${id}`);
        if (response.status) {
          setEmployee(response.employee);
        } else {
          setError('Failed to fetch employee data');
        }
      } catch (err) {
        setError('Error fetching employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="flex justify-center items-center h-screen w-full pt-8 mt-16">
        <div className="h-full w-full container">
          {employee && (
            <EmployeeForm
              isEnabled={true}
              employeeID={id}
              mode="edit"
              employeeData={employee} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditGuestPage;
