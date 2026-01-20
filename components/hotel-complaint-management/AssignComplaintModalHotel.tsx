'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import type { SweetAlertIcon } from 'sweetalert2';
import { ToastAtTopRight } from '@/lib/sweetalert';
import { ComplaintStatusType } from 'schema/company-panel';


const showToast = (icon: SweetAlertIcon, title: string, ms = 2200) =>
  ToastAtTopRight.fire({
    icon,
    title,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: ms,
    timerProgressBar: true
  });


type Employee = {
  _id: string;
  firstName: string;
  lastName: string;
  roleId?: { name?: string };
};

type ComplaintDoc = {
  _id?: string;
  scope?: string;
  HotelId?: string;
  complaintType?: string;
  description?: string;
  status?: ComplaintStatusType | string;
  assignedTo?: string | { _id: string };
  ETOD?: number; 
};

interface AssignComplaintModalHotelProps {
  open: boolean;
  onClose: () => void;
  complaintId: string;              
  currentStatus: ComplaintStatusType;
  onAssignSuccess?: (emp: Employee) => void;
  
  withoutTime?: boolean;            
  
  title?: string;
}


const safeGet = (obj: any, path: string[], fallback?: any) => {
  try {
    return path.reduce((acc, k) => (acc == null ? acc : acc[k]), obj) ?? fallback;
  } catch {
    return fallback;
  }
};

const parseError = (err: any) => {
  const status =
    safeGet(err, ['response', 'status']) ??
    safeGet(err, ['status']);
  const data =
    safeGet(err, ['response', 'data']) ??
    safeGet(err, ['data']);
  const msg =
    safeGet(err, ['response', 'data', 'message']) ??
    safeGet(err, ['response', 'data', 'error']) ??
    safeGet(err, ['data', 'message']) ??
    safeGet(err, ['message']) ??
    (typeof err === 'string' ? err : undefined) ??
    'Failed to update complaint';
  return { status, data, msg };
};


const AssignComplaintModalHotel: React.FC<AssignComplaintModalHotelProps> = ({
  open,
  onClose,
  complaintId,
  currentStatus,
  onAssignSuccess,
  withoutTime = false,
  title = 'Assign Complaint'
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [baseDoc, setBaseDoc] = useState<ComplaintDoc | null>(null);

  
  const [estimatedTime, setEstimatedTime] = useState<string>('');

  
  useEffect(() => {
    if (!open || !complaintId) return;

    setSelectedEmployeeId('');
    setEstimatedTime('');
    setLoading(true);

    (async () => {
      try {
        
        const empRes = await apiCall(
          'GET',
          '/api/employee/by-module?moduleName=complaint-management'
        );
        const empList: Employee[] =
          empRes?.employees || empRes?.data?.employees || empRes?.data || [];
        setEmployees(Array.isArray(empList) ? empList : []);

        
        const compRes = await apiCall(
          'GET',
          `/api/complaint/hotel/complaints/${complaintId}`
        );

        const c: any =
          compRes?.complaint ??
          compRes?.data?.complaint ??
          compRes?.data ??
          compRes;

        if (c && (c._id || c.id)) {
          const safe: ComplaintDoc = {
            _id: c._id || c.id,
            scope: c.scope,
            HotelId: c.HotelId,
            complaintType: c.complaintType,
            description: c.description,
            status: (c.status as ComplaintStatusType) ?? currentStatus,
            assignedTo:
              typeof c.assignedTo === 'string'
                ? c.assignedTo
                : c.assignedTo?._id
                  ? c.assignedTo._id
                  : undefined,
            ETOD:
              typeof c.ETOD === 'number'
                ? c.ETOD
                : undefined
          };
          setBaseDoc(safe);

          
          if (typeof safe.ETOD === 'number' && !Number.isNaN(safe.ETOD)) {
            setEstimatedTime(String(safe.ETOD));
          }
        } else {
          console.warn('⚠️ Could not parse complaint GET response:', compRes);
          setBaseDoc(null);
          showToast('warning', 'Complaint details not parsed. Using minimal payload.');
        }
      } catch (err) {
        const parsed = parseError(err);
        console.error('❌ Preload failed:', parsed, err);
        setBaseDoc(null);
        showToast('error', 'Failed to preload data. Using minimal payload.');
      } finally {
        setLoading(false);
      }
    })();
  }, [open, complaintId, currentStatus]);

  const selectedEmp = useMemo(
    () => employees.find((e) => e._id === selectedEmployeeId),
    [employees, selectedEmployeeId]
  );

  
  const sanitizeMinutes = (v: string) => v.replace(/[^\d]/g, ''); 
  const minutesToNumber = (v: string) => {
    if (!v) return undefined;
    const n = Number(v);
    if (Number.isNaN(n)) return undefined;
    if (n <= 0) return undefined;
    return Math.floor(n);
  };

  
  const handleAssign = async () => {
    if (!selectedEmployeeId) {
      showToast('warning', 'Please select an employee.');
      return;
    }

    
    let ETODnum: number | undefined = undefined;
    if (!withoutTime) {
      const cleaned = sanitizeMinutes(estimatedTime);
      const parsed = minutesToNumber(cleaned);
      if (!parsed) {
        showToast('warning', 'Please enter a valid estimated time in minutes (>= 1).');
        return;
      }
      ETODnum = parsed;
    }

    setAssigning(true);
    const url = `/api/complaint/hotel/complaints/${complaintId}`;

    
    const payload: ComplaintDoc = baseDoc
      ? {
        ...baseDoc,
        status: (baseDoc.status as ComplaintStatusType) ?? currentStatus,
        assignedTo: selectedEmployeeId,
        ...(withoutTime ? {} : { ETOD: ETODnum })
      }
      : {
        status: currentStatus,
        assignedTo: selectedEmployeeId,
        ...(withoutTime ? {} : { ETOD: ETODnum })
      };

    try {
      
      await apiCall('PUT', url, payload);

      if (selectedEmp) onAssignSuccess?.(selectedEmp);
      showToast('success', `Assigned to ${selectedEmp?.firstName ?? 'employee'} successfully.`);
      onClose();
    } catch (err) {
      const parsed = parseError(err);
      console.error('❌ PUT failed:', parsed, err);

      
      if (parsed.status === 400 || parsed.status === 422) {
        showToast('info', 'Trying alternate update…');
        try {
          await apiCall('PATCH', url, {
            assignedTo: selectedEmployeeId,
            ...(withoutTime ? {} : { ETOD: ETODnum })
          });
          if (selectedEmp) onAssignSuccess?.(selectedEmp);
          showToast('success', `Assigned to ${selectedEmp?.firstName ?? 'employee'} successfully.`);
          onClose();
          return;
        } catch (err2) {
          const parsed2 = parseError(err2);
          console.error('❌ PATCH failed:', parsed2, err2);
          showToast('error', parsed2.msg);
          return;
        }
      }

      
      if (!parsed.status && !parsed.data) {
        console.warn('⚠️ No status/data on error. Check base URL, CORS, wrapper throw style, and ID.');
        if (!complaintId || String(complaintId).includes('undefined')) {
          showToast('error', 'Invalid complaint id used in request.');
          return;
        }
      }

      showToast('error', parsed.msg);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg w-full max-w-xl">
          <div className="flex justify-between items-center text-gray-700 mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Dialog.Close className="text-gray-400 hover:text-gray-700" aria-label="Close">
              <X size={20} />
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-6">
            {}
            <div className="flex items-center gap-6 w-full">
              <label className="text-sm text-gray-900 whitespace-nowrap">Employee name</label>
              <Select
                value={selectedEmployeeId}
                onValueChange={setSelectedEmployeeId}
                disabled={loading}
              >
                <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none disabled:opacity-60">
                  <SelectValue placeholder={loading ? 'Loading…' : 'Select Employee'} />
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
                        {emp.roleId?.name ? <span className="opacity-75"> — {emp.roleId.name}</span> : null}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {}
            {!withoutTime && (
              <div className="flex items-center gap-6 w-full">
                <label htmlFor="estimatedTime" className="text-sm text-gray-900 whitespace-nowrap">
                  Estimated time (in minutes)
                </label>
                <input
                  id="estimatedTime"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={estimatedTime}
                  onChange={(e) => {
                    
                    const cleaned = e.target.value.replace(/[^\d]/g, '');
                    setEstimatedTime(cleaned.replace(/^0+/, '') || '');
                  }}
                  onBlur={() => {
                    
                    if (!estimatedTime) return;
                    const n = minutesToNumber(estimatedTime);
                    if (!n) {
                      setEstimatedTime('');
                      showToast('warning', 'Please enter a valid number ≥ 1.');
                    } else {
                      setEstimatedTime(String(n));
                    }
                  }}
                  className="p-2 rounded-md border bg-[#F6EEE0] text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-[#A07D3D]"
                  placeholder="Enter minutes (e.g., 5, 30, 90)"
                />
              </div>
            )}

            {}
            <button
              className="mt-2 bg-[#A07D3D] text-white p-2 rounded-md disabled:opacity-60"
              disabled={!selectedEmployeeId || assigning || (!withoutTime && !estimatedTime)}
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

export default AssignComplaintModalHotel;

