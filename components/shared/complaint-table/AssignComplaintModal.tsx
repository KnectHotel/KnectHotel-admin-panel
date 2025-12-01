// 'use client';

// import React, { useEffect, useState, useMemo } from 'react';
// import * as Dialog from '@radix-ui/react-dialog';
// import { X } from 'lucide-react';
// import apiCall from '@/lib/axios';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';

// import type { SweetAlertIcon } from 'sweetalert2';
// import { ToastAtTopRight } from '@/lib/sweetalert';

// // ——— Toast helper ———
// const showToast = (icon: SweetAlertIcon, title: string, ms = 2200) =>
//   ToastAtTopRight.fire({
//     icon,
//     title,
//     toast: true,
//     position: 'top-end',
//     showConfirmButton: false,
//     timer: ms,
//     timerProgressBar: true
//   });

// type Employee = {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   roleId?: { name?: string };
// };

// type ComplaintBase = {
//   scope?: string;
//   HotelId?: string;
//   complaintType?: string;
//   description?: string;
//   status?: string;
// };

// interface AssignComplaintModalProps {
//   open: boolean;
//   onClose: () => void;
//   complaintId: string;
//   onAssignSuccess?: (emp: Employee) => void;
// }

// const AssignComplaintModal: React.FC<AssignComplaintModalProps> = ({
//   open,
//   onClose,
//   complaintId,
//   onAssignSuccess
// }) => {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [assigning, setAssigning] = useState(false);

//   // holds currently persisted complaint fields that server expects on PUT
//   const [baseDoc, setBaseDoc] = useState<ComplaintBase | null>(null);

//   useEffect(() => {
//     if (!open || !complaintId) return;

//     const fetchAll = async () => {
//       setLoading(true);
//       try {
//         // 1) Employees
//         const empRes = await apiCall(
//           'GET',
//           '/api/employee/by-module?moduleName=complaint-management'
//         );
//         setEmployees(empRes?.employees || []);

//         // 2) Current complaint (to build a full PUT payload)
//         const compRes = await apiCall(
//           'GET',
//           `/api/complaint/platform/complaints/${complaintId}`
//         );

//         const c =
//           compRes?.complaint ||
//           compRes?.data?.complaint ||
//           compRes?.data ||
//           compRes;

//         if (c) {
//           const base: ComplaintBase = {
//             scope: c.scope,
//             HotelId: c.HotelId,
//             complaintType: c.complaintType,
//             description: c.description,
//             status: c.status
//           };
//           setBaseDoc(base);
//         } else {
//           showToast('warning', 'Complaint details not parsed. Using minimal payload.');
//           setBaseDoc(null);
//         }
//       } catch {
//         showToast('error', 'Failed to preload data. Using minimal payload.');
//         setBaseDoc(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     setSelectedEmployeeId('');
//     fetchAll();
//   }, [open, complaintId]);

//   const selectedEmp = useMemo(
//     () => employees.find((e) => e._id === selectedEmployeeId),
//     [employees, selectedEmployeeId]
//   );

//   const handleAssign = async () => {
//     if (!selectedEmployeeId || !complaintId) {
//       showToast('warning', 'Please select an employee.');
//       return;
//     }

//     setAssigning(true);
//     const url = `/api/complaint/platform/complaints/${complaintId}`;

//     try {
//       const payload = baseDoc
//         ? { ...baseDoc, assignedTo: selectedEmployeeId }
//         : { assignedTo: selectedEmployeeId }; // fallback, in case GET failed

//       await apiCall('PUT', url, payload);

//       if (selectedEmp) onAssignSuccess?.(selectedEmp);
//       showToast('success', `Assigned to ${selectedEmp?.firstName ?? 'employee'} successfully.`);
//       onClose();
//     } catch (err: any) {
//       const status = err?.response?.status as number | undefined;
//       const serverMsg =
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         err?.message ||
//         'Failed to update complaint';

//       // PATCH fallback for validation errors / partial update
//       if (status === 400 || status === 422) {
//         showToast('info', 'Trying alternate update…');
//         try {
//           await apiCall('PATCH', url, { assignedTo: selectedEmployeeId });
//           if (selectedEmp) onAssignSuccess?.(selectedEmp);
//           showToast('success', `Assigned to ${selectedEmp?.firstName ?? 'employee'} successfully.`);
//           onClose();
//           return;
//         } catch (err2: any) {
//           const msg2 =
//             err2?.response?.data?.message ||
//             err2?.message ||
//             'Failed to update complaint (alternate method)';
//           showToast('error', msg2);
//           return;
//         }
//       }

//       showToast('error', serverMsg);
//     } finally {
//       setAssigning(false);
//     }
//   };

//   return (
//     <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
//       <Dialog.Portal>
//         <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
//         <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg w-full max-w-xl">
//           <div className="flex justify-between items-center text-gray-700 mb-4">
//             <h3 className="text-lg font-semibold">Assign Complaint</h3>
//             <Dialog.Close className="text-gray-400 hover:text-gray-700">
//               <X size={20} />
//             </Dialog.Close>
//           </div>

//           <div className="flex flex-col gap-6">
//             <div className="flex items-center gap-6 w-full">
//               <label className="text-sm text-gray-900 whitespace-nowrap">
//                 Employee name
//               </label>
//               <Select
//                 value={selectedEmployeeId}
//                 onValueChange={setSelectedEmployeeId}
//                 disabled={loading}
//               >
//                 <SelectTrigger className="w-full bg-[#F6EEE0] text-gray-700 p-2 rounded-md border-none disabled:opacity-60">
//                   <SelectValue placeholder={loading ? 'Loading…' : 'Select Employee'} />
//                 </SelectTrigger>
//                 <SelectContent className="bg-[#362913] rounded-2xl text-white border-2 shadow-md border-white">
//                   {loading ? (
//                     <SelectItem value="loading" disabled>
//                       Loading...
//                     </SelectItem>
//                   ) : employees.length === 0 ? (
//                     <SelectItem value="none" disabled>
//                       No employees found
//                     </SelectItem>
//                   ) : (
//                     employees.map((emp) => (
//                       <SelectItem key={emp._id} value={emp._id}>
//                         {emp.firstName} {emp.lastName}{' '}
//                         {emp.roleId?.name ? `- ${emp.roleId.name}` : ''}
//                       </SelectItem>
//                     ))
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>

//             <button
//               className="mt-4 bg-[#A07D3D] text-white p-2 rounded-md disabled:opacity-60"
//               disabled={!selectedEmployeeId || assigning}
//               onClick={handleAssign}
//             >
//               {assigning ? 'Assigning...' : 'Assign'}
//             </button>
//           </div>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// };

// export default AssignComplaintModal;






'use client';

import React, { useEffect, useState, useMemo } from 'react';
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

// ——— Toast helper ———
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

type ComplaintBase = {
  scope?: string;
  HotelId?: string;
  complaintType?: string;
  description?: string;
  status?: string;
  ETOD?: number; // ⬅️ minutes (Estimated Time Of Delivery/work)
};

interface AssignComplaintModalProps {
  open: boolean;
  onClose: () => void;
  complaintId: string;
  onAssignSuccess?: (emp: Employee) => void;
  /** Agar time field hide karni ho to true pass karein */
  withoutTime?: boolean; // default: false
  /** Optional custom title */
  title?: string;
}

const AssignComplaintModal: React.FC<AssignComplaintModalProps> = ({
  open,
  onClose,
  complaintId,
  onAssignSuccess,
  withoutTime = false,
  title = 'Assign Complaint'
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // holds currently persisted complaint fields that server expects on PUT
  const [baseDoc, setBaseDoc] = useState<ComplaintBase | null>(null);

  // Estimated time state (minutes) — string to control input cleanly
  const [estimatedTime, setEstimatedTime] = useState<string>('');

  // Helpers for ETOD
  const sanitizeMinutes = (v: string) => v.replace(/[^\d]/g, ''); // digits only
  const minutesToNumber = (v: string) => {
    if (!v) return undefined;
    const n = Number(v);
    if (Number.isNaN(n) || n <= 0) return undefined;
    return Math.floor(n);
  };

  useEffect(() => {
    if (!open || !complaintId) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1) Employees
        const empRes = await apiCall(
          'GET',
          '/api/employee/by-module?moduleName=complaint-management'
        );
        const emps =
          empRes?.employees || empRes?.data?.employees || empRes?.data || [];
        setEmployees(Array.isArray(emps) ? emps : []);

        // 2) Current complaint (to build a full PUT payload)
        const compRes = await apiCall(
          'GET',
          `/api/complaint/platform/complaints/${complaintId}`
        );

        const c =
          compRes?.complaint ||
          compRes?.data?.complaint ||
          compRes?.data ||
          compRes;

        if (c) {
          const base: ComplaintBase = {
            scope: c.scope,
            HotelId: c.HotelId,
            complaintType: c.complaintType,
            description: c.description,
            status: c.status,
            ETOD:
              typeof c.ETOD === 'number' && !Number.isNaN(c.ETOD)
                ? c.ETOD
                : undefined
          };
          setBaseDoc(base);

          // Prefill ETOD if server already has it
          if (typeof base.ETOD === 'number') {
            setEstimatedTime(String(base.ETOD));
          } else {
            setEstimatedTime('');
          }
        } else {
          showToast('warning', 'Complaint details not parsed. Using minimal payload.');
          setBaseDoc(null);
          setEstimatedTime('');
        }
      } catch {
        showToast('error', 'Failed to preload data. Using minimal payload.');
        setBaseDoc(null);
        setEstimatedTime('');
      } finally {
        setLoading(false);
      }
    };

    setSelectedEmployeeId('');
    fetchAll();
  }, [open, complaintId]);

  const selectedEmp = useMemo(
    () => employees.find((e) => e._id === selectedEmployeeId),
    [employees, selectedEmployeeId]
  );

  const handleAssign = async () => {
    if (!selectedEmployeeId || !complaintId) {
      showToast('warning', 'Please select an employee.');
      return;
    }

    // Validate ETOD if required
    let ETODnum: number | undefined = undefined;
    if (!withoutTime) {
      const cleaned = sanitizeMinutes(estimatedTime);
      const parsed = minutesToNumber(cleaned);
      if (!parsed) {
        showToast('warning', 'Please enter a valid estimated time in minutes (≥ 1).');
        return;
      }
      ETODnum = parsed;
    }

    setAssigning(true);
    const url = `/api/complaint/platform/complaints/${complaintId}`;

    try {
      const payload = baseDoc
        ? {
          ...baseDoc,
          assignedTo: selectedEmployeeId,
          ...(withoutTime ? {} : { ETOD: ETODnum })
        }
        : {
          assignedTo: selectedEmployeeId,
          ...(withoutTime ? {} : { ETOD: ETODnum })
        }; // fallback, in case GET failed

      await apiCall('PUT', url, payload);

      if (selectedEmp) onAssignSuccess?.(selectedEmp);
      showToast('success', `Assigned to ${selectedEmp?.firstName ?? 'employee'} successfully.`);
      onClose();
    } catch (err: any) {
      const status = err?.response?.status as number | undefined;
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to update complaint';

      // PATCH fallback for validation errors / partial update
      if (status === 400 || status === 422) {
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
        } catch (err2: any) {
          const msg2 =
            err2?.response?.data?.message ||
            err2?.message ||
            'Failed to update complaint (alternate method)';
          showToast('error', msg2);
          return;
        }
      }

      showToast('error', serverMsg);
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
            <Dialog.Close className="text-gray-400 hover:text-gray-700">
              <X size={20} />
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-6">
            {/* Employee */}
            <div className="flex items-center gap-6 w-full">
              <label className="text-sm text-gray-900 whitespace-nowrap">
                Employee name
              </label>
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
                        {emp.firstName} {emp.lastName}{' '}
                        {emp.roleId?.name ? `- ${emp.roleId.name}` : ''}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Time (minutes) */}
            {!withoutTime && (
              <div className="flex items-center gap-6 w-full">
                <label
                  htmlFor="estimatedTime"
                  className="text-sm text-gray-900 whitespace-nowrap"
                >
                  Estimated time (in minutes)
                </label>
                <input
                  id="estimatedTime"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={estimatedTime}
                  onChange={(e) => {
                    // keep only digits, remove leading zeros
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

            <button
              className="mt-4 bg-[#A07D3D] text-white p-2 rounded-md disabled:opacity-60"
              disabled={
                !selectedEmployeeId ||
                assigning ||
                (!withoutTime && !estimatedTime)
              }
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

export default AssignComplaintModal;
