import { ColumnDef } from '@tanstack/react-table';

import CellAction from './cell.action';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { ComplaintDataType } from '../client';
import { useRouter } from 'next/navigation';

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

// so we can read resolvedAt without using `any`
type MaybeResolved = { resolvedAt?: string | null };

// prefer resolvedAt; if missing but status is resolved, fall back to updatedAt
const pickResolvedAt = (row: any): string | undefined => {
  // handle possible API variations too
  const direct =
    row?.resolvedAt ??
    row?.ResolvedAt ?? // in case backend sent PascalCase
    row?.closedAt ??   // some APIs use closedAt
    null;

  if (direct) return String(direct);

  const status = String(row?.status ?? '').toLowerCase();
  if (status === 'resolved' && row?.updatedAt) {
    return String(row.updatedAt);
  }
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
      const createdAt = row.original.createdAt;
      const resolvedAt = pickResolvedAt(row.original); // ← use helper

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
    // optional sorting by total duration
    sortingFn: (a, b) => {
      const ca = new Date((a.original as any).createdAt ?? 0).getTime();
      const ra = new Date(pickResolvedAt(a.original) ?? Date.now()).getTime();
      const cb = new Date((b.original as any).createdAt ?? 0).getTime();
      const rb = new Date(pickResolvedAt(b.original) ?? Date.now()).getTime();
      return (ra - ca) - (rb - cb);
    }
  },
  {
    accessorKey: 'complaintType',
    header: 'Complaint Type',
    cell: ({ row }) => {
      const type = row.original.complaintType;
      return <div>{type}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const router = useRouter();

      const raw = row.original.status ?? 'Open'; // "Open" | "Inprogress" | "Resolved"
      const [open, setOpen] = useState(false);

      // normalize
      const s = String(raw).toLowerCase();
      const isOpenish = s === 'open' || s === 'inprogress';
      const label =
        s === 'inprogress' ? 'Inprogress' : s === 'open' ? 'Open' : 'Resolved';

      // colors: OPEN = red, INPROGRESS = yellow, CLOSED = green
      const colorForBadge =
        s === 'inprogress'
          ? 'text-yellow-600'
          : s === 'open'
            ? 'text-[#E5252A]'
            : 'text-[#78B15099]';

      // ID infer (complaintID preferred; fallback to _id)
      const id =
        (row.original as any).complaintID ??
        (row.original as any)._id ??
        null;

      const handleGiveFeedback = () => {
        if (!id) return console.warn('No complaint id found on row:', row.original);
        router.push(`/hotel-panel/complaint-management/edit/${id}`);
      };

      return (
        <div className="text-center">
          {isOpenish ? (
            <DropdownMenu.Root open={open} onOpenChange={setOpen}>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className={`font-medium text-sm flex items-center mx-auto gap-1 ${colorForBadge}`}
                >
                  {label}
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
                  className="bg-white rounded-md shadow-md text-sm z-50 px-2 py-1 w-[120px]"
                >
                  {/* UI me CLOSED dikhayenge, API ko "Resolved" bhejna hoga */}
                  <DropdownMenu.Item
                    className="text-[#78B15099] px-2 py-1 cursor-pointer outline-none hover:bg-gray-100"
                    onClick={() => {
                      // handleStatusChange('Resolved' as any)
                    }}
                  >
                    Resolved
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            <div className="flex flex-col">
              <span className={`font-medium text-sm ${colorForBadge}`}>
                {label}
              </span>
              <button
                type="button"
                onClick={handleGiveFeedback}
                className="text-[#78B150] text-[10px] pr-3 underline underline-offset-2"
                title="Give feedback on this complaint"
              >
                Give Feedback
              </button>
            </div>
          )}
        </div>
      );
    }
  },

  // {
  //   accessorKey: 'Remark',
  //   header: 'Remark'
  // },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const value = row.original.createdAt;
      const formatted = new Date(value).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      return <span>{formatted}</span>;
    }
  },
  // {
  //   accessorKey: 'updatedAt',
  //   header: 'Updated At',
  //   cell: ({ row }) => {
  //     const value = row.original.updatedAt;
  //     const formatted = new Date(value).toLocaleString('en-IN', {
  //       dateStyle: 'medium',
  //       timeStyle: 'short'
  //     });
  //     return <span>{formatted}</span>;
  //   }
  // },
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