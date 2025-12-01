'use client';
import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import apiCall from '@/lib/axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface AssignModalProps {
  open: boolean;
  onClose: () => void;
  onAssignSuccess?: () => void;
  requestId?: string;
}

const AssignModal = ({
  open,
  onClose,
  onAssignSuccess,
  requestId
}: AssignModalProps) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (!open || !requestId) return;

    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await apiCall(
          'GET',
          'api/employee/by-module?moduleName=refund-management'
        );
        setEmployees(res?.employees || []);
      } catch (err) {
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
    setSelectedEmployeeId('');
  }, [open, requestId]);

  const handleAssign = async () => {
    if (!selectedEmployeeId || !requestId) return;

    setAssigning(true);
    try {
      await apiCall('PUT', `/api/refund/assignEmployee/${requestId}`, {
        adminId: selectedEmployeeId
      });

      onAssignSuccess?.();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || 'Something went wrong';
      console.error('Assignment failed:', msg);
      alert(msg);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg w-full max-w-xl">
          <Dialog.Title className="sr-only">Assign Refund</Dialog.Title>
          <div className="flex justify-between items-center text-gray-700 mb-4">
            <h3 className="text-lg font-semibold">Assign Refund</h3>
            <Dialog.Close className="text-gray-400 hover:text-gray-500">
              <X size={20} />
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6 w-full">
              <label
                htmlFor="employeeName"
                className="text-sm text-gray-900 whitespace-nowrap"
              >
                Employee name
              </label>
              <Select
                value={selectedEmployeeId}
                onValueChange={setSelectedEmployeeId}
              >
                <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none">
                  <SelectValue placeholder="Select Employee" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 opacity-50"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </SelectTrigger>
                <SelectContent className="bg-[#362913] rounded-2xl text-white border-2 shadow-md border-white">
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : employees.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No employees found
                    </SelectItem>
                  ) : (
                    employees.map((emp) => (
                      <SelectItem key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <button
              className="mt-4 bg-[#A07D3D] text-white p-2 rounded-md"
              disabled={!selectedEmployeeId || assigning}
              onClick={handleAssign}
            >
              {assigning ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AssignModal;
