import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import { EmployeeDataType } from 'app/static/EmployeeManagement';
import { StatusType } from 'app/static/Type';


export const columns: ColumnDef<EmployeeDataType>[] = [
  {
    accessorKey: 'requestID',
    header: 'Employee ID'
  },
  {
    accessorKey: 'employeeDetails.name',
    header: 'Employee Name'
  },
  {
    accessorKey: 'employeeDetails.mobileNo',
    header: 'Mobile no.'
  },
  {
    accessorKey: 'employeeDetails.emailID',
    header: 'Email ID'
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role || 'N/A';
      if (role === 'SOS') {
        return <div className=" font-medium text-red-400">{role}</div>;
      } else {
        return <div className="text-black">{role}</div>;
      }
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status: StatusType = row.original.status;
      return status === 'Active' ? (
        <div className="font-medium text-[#78B150]">{status.toUpperCase()}</div>
      ) : (
        <div className="text-[#E5252A]">{status.toUpperCase()}</div>
      );
    }
  },
  {
    accessorKey: 'actions',
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction
          data={row.original}
        
        />
      </div>
    )
  }
];
