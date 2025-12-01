

// import { ColumnDef } from '@tanstack/react-table';
// import { Switch } from '@/components/ui/switch';
// import { Eye } from 'lucide-react';
// import CellAction from './cell-action';
// import apiCall from '@/lib/axios';
// import { toast } from 'sonner';


// // Assuming your data shape is:
// export type Subscription = {
//   _id: string;
//   uniqueId: string;
//   subscriptionID: string;
//   planName: string;
//   planDuration: number;
//   planType: string; // 'Monthly' | 'Half Yearly' | 'Yearly'
//   description: string;
//   cost: number;
//   status: 'Active' | 'Inactive' | 'Canceled' | 'Expired';
// };

// export const columns: ColumnDef<Subscription>[] = [
//   {
//     header: 'SN',
//     accessorFn: (_row, index) => index + 1,
//     id: 'serialNumber',
//     cell: ({ row }) => <div>{row.index + 1}</div>
//   },
//   {
//     header: 'Subscription ID',
//     accessorKey: 'uniqueId'
//   },
//   {
//     header: 'Plan Details',
//     cell: ({ row }) => {
//       const { planName, planType } = row.original;
//       return (
//         <div className="flex flex-col items-start">
//           <span className="font-medium">{planName}</span>
//           <span className="text-sm opacity-60">{planType}</span>
//         </div>
//       );
//     }
//   },
//   {
//     header: 'Plan Duration',
//     accessorKey: 'planDuration',
//     cell: ({ row }) => (
//       <div>{row.original.planDuration} {row.original.planType === 'Monthly' ? 'Months' : 'Days'}</div>
//     )
//   },
//   {
//     header: 'Plan Type',
//     accessorKey: 'planType'
//   },
//   {
//     header: 'Cost',
//     accessorKey: 'cost',
//     cell: ({ row }) => (
//       <div className="text-sm font-semibold">₹{row.original.cost.toLocaleString()}</div>
//     )
//   },
//   {
//     header: 'Status',
//     accessorKey: 'status',
//     cell: ({ row }) => {
//       const status = row.original.status.toUpperCase();
//       let color = 'text-gray-500';

//       if (status === 'ACTIVE') color = 'text-green-600';
//       else if (status === 'CANCELED') color = 'text-red-600';
//       else if (status === 'INACTIVE') color = 'text-yellow-600';
//       else if (status === 'EXPIRED') color = 'text-gray-400';

//       return <span className={`text-sm font-medium ${color}`}>{status}</span>;
//     }
//   },
//   // {
//   //   header: 'Actions',
//   //   id: 'actions',
//   //   cell: ({ row }) => {
//   //     const status = row.original.status.toUpperCase();
//   //     const isChecked = status === 'ACTIVE';
//   //     const isEditable = status === 'ACTIVE' || status === 'INACTIVE';

//   //     return (
//   //       <div className="flex items-center gap-x-3">
//   //         <Switch
//   //           checked={isChecked}
//   //           disabled={!isEditable}
//   //           onCheckedChange={(checked) => {
//   //             console.log(`Toggled ${row.original.uniqueId}:`, checked);
//   //             // TODO: Call your update status API here
//   //           }}
//   //         />
//   //         <CellAction data={row.original} />
//   //       </div>
//   //     );
//   //   }
//   // }
//   {
//     header: 'Actions',
//     id: 'actions',
//     cell: ({ row }) => {
//       const { _id, uniqueId, status } = row.original;
//       const isChecked = status === 'Active';
//       const isEditable = status === 'Active' || status === 'Inactive';

//       const handleToggle = async (checked: boolean) => {
//         const newStatus = checked ? 'Active' : 'Inactive';
//         try {
//           await apiCall('PUT', `/api/subscription/${_id}`, { status: newStatus });
//           toast.success(`Status updated to ${newStatus} for ${uniqueId}`);
//         } catch (err) {
//           console.error(err);
//           toast.error(`Failed to update status for ${uniqueId}`);
//         }
//       };

//       return (
//         <div className="flex items-center gap-x-3">
//           <Switch
//             checked={isChecked}
//             disabled={!isEditable}
//             onCheckedChange={handleToggle}
//           />
//           <CellAction data={row.original} />
//         </div>
//       );
//     }
//   }
// ];

import { ColumnDef } from '@tanstack/react-table';
import { Switch } from '@/components/ui/switch';
import { Eye } from 'lucide-react';
import CellAction from './cell-action';
import apiCall from '@/lib/axios';
import { toast } from 'sonner'; // or any toast lib you use
import React from 'react';

export type Subscription = {
  _id: string;
  uniqueId: string;
  subscriptionID: string;
  planName: string;
  planDuration: number;
  planType: string; // 'Monthly' | 'Half Yearly' | 'Yearly'
  description: string;
  cost: number;
  status: 'Active' | 'Inactive' | 'Canceled' | 'Expired';
};

export const columns: ColumnDef<Subscription>[] = [
  // {
  //   header: 'SN',
  //   accessorFn: (_row, index) => index + 1,
  //   id: 'serialNumber',
  //   cell: ({ row }) => <div>{row.index + 1}</div>
  // },
  {
    header: 'Subscription ID',
    accessorKey: 'uniqueId'
  },
  {
    header: 'Plan Details',
    cell: ({ row }) => {
      const { planName, planType } = row.original;
      return (
        <div className="flex flex-col items-start">
          <span className="font-medium">{planName}</span>
          <span className="text-sm opacity-60">{planType}</span>
        </div>
      );
    }
  },
  {
    header: 'Plan Duration',
    accessorKey: 'planDuration',
    cell: ({ row }) => (
      <div>
        {row.original.planDuration}{' '}
        {row.original.planType === 'Monthly' ? 'Months' : 'Days'}
      </div>
    )
  },
  {
    header: 'Plan Type',
    accessorKey: 'planType'
  },
  {
    header: 'Cost',
    accessorKey: 'cost',
    cell: ({ row }) => (
      <div className="text-sm font-semibold">
        ₹{row.original.cost.toLocaleString()}
      </div>
    )
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.original.status.toUpperCase();
      let color = 'text-gray-500';

      if (status === 'ACTIVE') color = 'text-green-600';
      else if (status === 'CANCELED') color = 'text-red-600';
      else if (status === 'INACTIVE') color = 'text-yellow-600';
      else if (status === 'EXPIRED') color = 'text-gray-400';

      return (
        <span className={`text-sm font-medium ${color}`}>{status}</span>
      );
    }
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const { _id, uniqueId, status } = row.original;
      const [localStatus, setLocalStatus] = React.useState(status);
      const isChecked = localStatus === 'Active';
      const isEditable = localStatus === 'Active' || localStatus === 'Inactive';

      const handleToggle = async (checked: boolean) => {
        const newStatus = checked ? 'Active' : 'Inactive';
        setLocalStatus(newStatus);

        try {
          await apiCall('PUT', `/api/subscription/${_id}`, { status: newStatus });
          toast.success(`Status updated to ${newStatus} for ${uniqueId}`);
          window.location.reload();
        } catch (err) {
          console.error(err);
          toast.error(`Failed to update status for ${uniqueId}`);
          setLocalStatus(status);
        }
      };

      return (
        <div className="flex items-center gap-x-3">
          <Switch
            checked={isChecked}
            disabled={!isEditable}
            onCheckedChange={handleToggle}
          />
          <CellAction data={row.original} />
        </div>
      );
    }
  }
];
