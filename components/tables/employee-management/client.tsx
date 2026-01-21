'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns as baseColumns } from './columns';
import { columns } from './columns';
import { EmployeeDataType } from 'app/static/EmployeeManagement';
import apiCall from '@/lib/axios';
import CellAction from './cell-action';
import { StatusType } from 'app/static/Type';
import { PaginationControls } from '@/components/shared/PaginationControls';

type ModeType = 'add_employee';

export const EmployeeTable: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<EmployeeDataType[]>([]);
  const [filteredData, setFilteredData] = useState<EmployeeDataType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(data.length || 0);
  const [mode, setMode] = useState<ModeType>();
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiCall<{
          status: boolean;
          employees: any[];
        }>('GET', 'api/employee/');

        if (response.status && Array.isArray(response.employees)) {
          
          const mappedEmployees: EmployeeDataType[] = response.employees.map(
            (emp) => ({
              employeeID: emp._id,
              requestID: emp.uniqueId || 'N/A',
              employeeDetails: {
                name: emp.firstName + ' ' + emp.lastName,
                roomNo: '', 
                mobileNo: emp.mobileNumber || '',
                emailID: emp.email || emp.emailID || ''
              },
              role: emp.roleId?.name || 'N/A',
              status: emp.status === 'Active' ? 'Active' : 'Inactive'
            })
          );
          setData(mappedEmployees);
          setFilteredData(mappedEmployees);
          setTotalRecords(mappedEmployees.length);
        } else {
          setError('Invalid response from server');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const updateEmployeeStatus = (employeeID: string, newStatus: StatusType) => {
    setData((prev) =>
      prev.map((emp) =>
        emp.employeeID === employeeID ? { ...emp, status: newStatus } : emp
      )
    );
    setFilteredData((prev) =>
      prev.map((emp) =>
        emp.employeeID === employeeID ? { ...emp, status: newStatus } : emp
      )
    );
  };

  const columns = baseColumns.map((col) => {
    if (col.id === 'actions') {
      return {
        ...col,
        cell: ({ row }: any) => (
          <div className="flex items-center justify-center">
            <CellAction
              data={row.original}
              onStatusChange={updateEmployeeStatus}
            />
          </div>
        )
      };
    }
    return col;
  });

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPageNo(1);
  };

  const handleSearchChange = (searchValue: string) => {
    setPageNo(1);
    if (searchValue.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.employeeDetails.name
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleOnClick = (actionName: string) => {
    if (actionName === 'add employee') {
      setMode('add_employee');
      router.push(`/hotel-panel/employee-management/add`);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Employees (${totalRecords})`} />
        <Button
          className="btn-primary text-xs 2xl:text-sm md:text-sm"
          onClick={() => handleOnClick('add employee')}
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="text-white">Add Employee</span>
        </Button>
      </div>
      {loading ? (
        <span>Loading...</span>
      ) : error ? (
        <span className="text-red-500">{error}</span>
      ) : (
        <DataTable
          searchKey="firstName"
          columns={columns}
          data={filteredData.slice((pageNo - 1) * limit, pageNo * limit)}
          
          
          
          
          
          
          
          
        />
      )}
      <PaginationControls
        pageNo={pageNo}
        totalRecords={totalRecords}
        limit={limit}
        totalPages={totalPages}
        filteredCount={filteredData.length}
        onPageChange={handlePageChange}
      />
    </>
  );
};
