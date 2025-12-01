'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell.action';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ComplaintStatusType } from 'schema/company-panel';
import { ComplaintDataType } from './client';
import apiCall from '@/lib/axios';
import AssignComplaintModalHotel from './AssignComplaintModalHotel';
import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

import type { SweetAlertIcon } from 'sweetalert2';
import { ToastAtTopRight } from '@/lib/sweetalert';

const showToast = (icon: SweetAlertIcon, title: string, ms = 2200) =>
  ToastAtTopRight.fire({
    icon,
    title,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: ms,
    timerProgressBar: true,
  });

// ---- helpers (place near imports) ----
const fmtDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const humanizeDuration = (fromIso?: string | null, toIso?: string | null) => {
  if (!fromIso) return "—";
  const start = new Date(fromIso);
  const end = toIso ? new Date(toIso) : new Date();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "—";

  const ms = Math.max(0, end.getTime() - start.getTime());
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / (24 * 60));
  const hours = Math.floor((totalMin % (24 * 60)) / 60);
  const minutes = totalMin % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes || parts.length === 0) parts.push(`${minutes}m`);
  return parts.join(" ");
};

// prefers `resolvedAt`, else if status is Resolved uses `updatedAt`
const pickResolvedAt = (row: any) => {
  if (row?.resolvedAt) return row.resolvedAt as string;
  if (row?.status === "Resolved") return row?.updatedAt as string | undefined;
  return undefined;
};


export const columns: ColumnDef<ComplaintDataType>[] = [
  {
    accessorKey: 'uniqueId',
    header: 'Complaint ID'
  },
  {
    id: 'timeDuration',
    header: 'Time Duration',
    cell: ({ row }) => {
      const createdAt = (row.original as any).createdAt as string | undefined;
      const resolvedAt = pickResolvedAt(row.original as any);

      const createdStr = fmtDateTime(createdAt);
      const resolvedStr = fmtDateTime(resolvedAt);
      const durationStr = humanizeDuration(createdAt, resolvedAt);
      const isClosed = Boolean(resolvedAt);

      return (
        <div className="text-center leading-tight">
          <div className="text-[11px] text-gray-500">Created</div>
          <div className="text-sm font-medium">{createdStr}</div>

          <div className="text-[11px] text-gray-500 mt-1">Resolved</div>
          <div className="text-sm font-medium">{resolvedStr}</div>

          <div className="mt-1 text-[11px] text-gray-600">
            {isClosed ? 'Total: ' : 'Running: '}
            <span className="font-semibold">{durationStr}</span>
          </div>
        </div>
      );
    },
    // (optional) enable sorting by duration
    sortingFn: (a, b) => {
      const ca = new Date((a.original as any).createdAt ?? 0).getTime();
      const ra =
        new Date(pickResolvedAt(a.original as any) ?? Date.now()).getTime();
      const cb = new Date((b.original as any).createdAt ?? 0).getTime();
      const rb =
        new Date(pickResolvedAt(b.original as any) ?? Date.now()).getTime();
      return (ra - ca) - (rb - cb);
    }
  },

  {
    accessorKey: 'complaintType',
    header: 'Complaint Type',
    cell: ({ row }) => <div>{row.original.complaintType}</div>
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => {
      type Emp = { _id: string; firstName: string; lastName: string };
      const [employeeList, setEmployeeList] = useState<Emp[]>([]);
      const [open, setOpen] = useState(false);
      const [assignedTo, setAssignedTo] = useState<string | null>(
        (row.original.assignedTo as string) || null
      );

      // (optional) sirf display name ke liye list fetch — dropdown ab modal me hai
      useEffect(() => {
        const fetchEmployees = async () => {
          try {
            const res = await apiCall(
              'GET',
              '/api/employee/by-module?moduleName=complaint-management'
            );
            if (res?.employees) setEmployeeList(res.employees);
          } catch (err) {
            console.error('Failed to fetch employees:', err);
          }
        };
        fetchEmployees();
      }, []);

      const selectedEmployee = employeeList.find((e) => e._id === assignedTo);
      const selectedName = selectedEmployee
        ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
        : 'Unassigned';

      return (
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-black font-medium text-sm underline underline-offset-2"
          >
            {selectedName}
          </button>

          <AssignComplaintModalHotel
            open={open}
            onClose={() => setOpen(false)}
            complaintId={row.original.complaintID}
            currentStatus={(row.original.status || 'Open') as ComplaintStatusType}
            onAssignSuccess={(emp) => {
              // UI state + row data sync
              setAssignedTo(emp._id);
              row.original.assignedTo = emp._id as any;
            }}
          />
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const [status, setStatus] = useState<ComplaintStatusType>(
        (row.original.status || 'Open') as ComplaintStatusType
      );
      const [open, setOpen] = useState(false);
      const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for remark
      const [remark, setRemark] = useState(''); // State for remark
      const router = useRouter();

      const handleStatusChange = async (newStatus: ComplaintStatusType) => {
        const prev = status;
        setStatus(newStatus);
        setOpen(false);

        if (newStatus === 'Resolved') {
          setIsModalOpen(true); // Open modal when status is "Resolved"
          return;
        }

        try {
          await apiCall(
            'PUT',
            `/api/complaint/hotel/complaints/${row.original.complaintID}`,
            { status: newStatus }
          );

          showToast('success', 'Complaint status updated successfully');
        } catch (error: any) {
          setStatus(prev); // revert on failure
          console.error('Status update error:', error);
          showToast(
            'error',
            error?.response?.message || error?.message || 'Failed to update status'
          );
        }
      };

      const handleSaveRemark = async () => {
        if (!remark) {
          showToast('warning', 'Please enter a remark');
          return;
        }

        try {
          await apiCall(
            'PUT',
            `/api/complaint/hotel/complaints/${row.original.complaintID}`,
            { status: 'Resolved', remark }
          );
          showToast('success', 'Complaint marked as resolved with remark');
          setIsModalOpen(false); // Close modal after saving the remark
        } catch (error) {
          console.error('Error saving remark:', error);
          showToast('error', 'Failed to save remark');
        }
      };

      const getColor = (status: ComplaintStatusType) => {
        switch (status) {
          case 'Open':
            return 'text-[#E5252A]';
          case 'Inprogress':
            return 'text-yellow-600';
          case 'Resolved':
            return 'text-green-600';
          default:
            return ''; // Fallback in case of an unexpected value
        }
      };

      return (
        <div className="text-center">
          <DropdownMenu.Root open={open} onOpenChange={setOpen}>
            <DropdownMenu.Trigger asChild>
              <button
                className={`font-medium text-sm flex items-center mx-auto gap-1 ${getColor(status)}`}
              >
                {status}
                {open ? (
                  <ChevronUp className="h-4 w-4 text-black" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-black" />
                )}
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                side="bottom"
                align="start"
                className="bg-white rounded-md shadow-md text-sm z-50 px-2 py-1 w-[160px]"
              >
                {['Open', 'Inprogress', 'Resolved'].map((val) => (
                  <DropdownMenu.Item
                    key={val}
                    onClick={() => handleStatusChange(val as ComplaintStatusType)}
                    className="cursor-pointer px-2 py-1 hover:bg-gray-100 text-black outline-none"
                  >
                    {val}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Show only when Resolved */}
          {status === 'Resolved' && (
            <button
              onClick={() =>
                router.push(
                  `/super-admin/complaint-management/view/${row.original.complaintID}`
                )
              }
              className="text-[#78B150] text-[10px] mt-1"
            >
              View Feedback
            </button>
          )}

          {/* Modal for remark when status is Resolved */}
          {isModalOpen && (
            <Dialog.Root open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
              <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg w-full max-w-xl">
                <div className="flex justify-between items-center text-gray-700 mb-4">
                  <h3 className="text-lg font-semibold">Add Remark to Resolved Complaint</h3>
                  <Dialog.Close className="text-gray-400 hover:text-gray-700" aria-label="Close">
                    <X size={20} />
                  </Dialog.Close>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <label htmlFor="remark" className="block text-sm font-medium text-gray-700">
                      Remark
                    </label>
                    <textarea
                      id="remark"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      className="p-2 mt-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A07D3D]"
                      placeholder="Enter your remark..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      className={`mt-4 bg-[#A07D3D] text-white px-4 py-2 rounded-md disabled:opacity-60`}
                      disabled={!remark}
                      onClick={handleSaveRemark}
                    >
                      Save Remark
                    </button>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Root>
          )}
        </div>
      );
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