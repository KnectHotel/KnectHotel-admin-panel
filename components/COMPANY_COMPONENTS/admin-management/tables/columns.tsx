'use client'; // Mark as Client Component

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';

export interface AdminDataType {
  _id: string;
  isSuperAdmin: boolean;
  uniqueId: string;
  roleId: {
    _id: string;
    name: string;
  } | null;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  housekeeping: string;
  status: string;
  scope: string;
  IsOtpVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Custom hook to fetch roles and return columns
export const useColumns = (): ColumnDef<AdminDataType>[] => {
  return [
    {
      accessorKey: 'adminId',
      header: 'Admin ID',
      cell: ({ row }) => row.original.uniqueId || 'N/A'
    },
    {
      accessorKey: 'firstName',
      header: 'Admin Name',
      cell: ({ row }) => {
        const fullName = `${row.original.firstName} ${row.original.lastName}`;
        return (
          <div className="flex flex-col items-start justify-center">
            <span>{fullName}</span>
            <span className="text-xs 2xl:text-sm opacity-60 pt-1">
              CREATED: {new Date(row.original.createdAt).toLocaleTimeString()}
            </span>
            <span className="text-xs 2xl:text-sm opacity-60">
              {new Date(row.original.createdAt).toLocaleDateString()}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'mobileNumber',
      header: 'Mobile no.',
      cell: ({ row }) => row.original.mobileNumber || 'N/A'
    },
    {
      accessorKey: 'email',
      header: 'Email ID'
    },
    {
      accessorKey: 'roleId',
      header: 'Role',
      cell: ({ row }) => {
        return (
          <div>
            {row.original.roleId?.name || 'N/A'}
          </div>
        );
      }
    },
    
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status || 'N/A';
        if (status === 'Active') {
          return <div className="font-medium text-[#78B150]">ACTIVE</div>;
        }
        return <div className="text-[#E5252A]">{status.toUpperCase()}</div>;
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <CellAction data={row.original} />
        </div>
      )
    }
  ];
};
