// 'use client';
// import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
// import { ChevronDown, ChevronUp, Edit } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import apiCall from '@/lib/axios'; // adjust if path differs
// import { HotelRefundType } from './client';
// import { ColumnDef } from '@tanstack/react-table';
// import { useRouter } from 'next/navigation';
// import AssignModal from '@/components/shared/refund-management/AssignModal';

// export const hotelRefundColumns: ColumnDef<HotelRefundType>[] = [
//    {
//     accessorKey: 'uniqueId', // Access the uniqueId directly from refund data
//     header: 'Refund ID',
//     cell: ({ row }) => {
//       const refundId = row.original.uniqueId || 'N/A'; // Access uniqueId directly from the data
//       return <span>{refundId}</span>; // Display uniqueId as Refund ID
//     }
//   },
//   {
//     header: 'Guest Info',
//     accessorKey: 'guest', // Access guest information directly
//     cell: ({ row }) => {
//       const guest = row.original.guest || {};
//       const fullName = `${guest?.firstName || 'N/A'} ${guest?.lastName || 'N/A'}`;
//       const phone = guest?.phoneNumber || 'N/A';

//       return (
//         <div className="flex flex-col">
//           <span className="font-medium text-sm text-gray-800">{fullName}</span>
//           <span className="text-xs text-gray-500">{phone}</span>
//         </div>
//       );
//     }
//   },
//   ,

//   {
//     accessorKey: 'amount',
//     header: 'Amount'
//   },
//   // {
//   //   accessorKey: 'assignedTo',
//   //   header: 'Assigned To',
//   //   cell: ({ row }) => {
//   //     const [showModal, setShowModal] = useState(false);

//   //     const assigned = row.original.assignedTo;
//   //     const assignedName =
//   //       assigned && typeof assigned === 'object'
//   //         ? `${assigned.firstName} ${assigned.lastName}`
//   //         : 'Unassigned';

//   //     return (
//   //       <>
//   //         <button
//   //           onClick={() => setShowModal(true)}
//   //           className="text-sm underline text-black"
//   //         >
//   //           {assignedName}
//   //         </button>

//   //         {showModal && (
//   //           <AssignModal
//   //             open={showModal} // ✅ add this line
//   //             requestId={row.original._id}
//   //             onClose={() => setShowModal(false)}
//   //             onAssignSuccess={() => {
//   //               window.location.reload();
//   //             }}
//   //           />
//   //         )}
//   //       </>
//   //     );
//   //   }
//   // },
//   {
//     accessorKey: 'status',
//     header: 'Status',
//     cell: ({ row }) => {
//       const status = row.original.status;
//       const colorMap: Record<string, string> = {
//         Initiated: '#FC690E',
//         'In-Progress': '#3787E3',
//         Completed: '#78B150',
//         Rejected: '#E5252A'
//       };

//       const router = useRouter();

//       return (
//         <div className="flex flex-col items-start">
//           <span style={{ color: colorMap[status] || 'gray' }}>{status}</span>

//           {status === 'Completed' && (
//             <button
//               onClick={() =>
//                 router.push(
//                   `/hotel-panel/refund-management/edit/${row.original._id}`
//                 )
//               }
//               className="text-[#78B150] text-[10px] mt-1 underline"
//             >
//               View Feedback
//             </button>
//           )}
//         </div>
//       );
//     }
//   },
//   {
//     accessorKey: 'updatedAt',
//     header: 'Updated At',
//     cell: ({ row }) => {
//       const updatedAt = row.original.updatedAt;
//       const date = new Date(updatedAt);
//       if (isNaN(date.getTime())) {
//         return <span className="text-xs text-gray-500">Invalid Date</span>;
//       }
//       return (
//         <span className="text-xs text-gray-500">
//           <div>{date.toLocaleDateString()}</div>
//           <div>{date.toLocaleTimeString()}</div>
//         </span>
//       );
//     },
//   },
//   {
//     id: 'actions',
//     header: 'Actions',
//     cell: ({ row }) => {
//       const router = useRouter();
//       const handleEdit = () => {
//         const GuestId = row.original._id;
//         router.push(`/hotel-panel/refund-management/edit/${GuestId}`);
//       };

//       return (
//         <div className="py-4">
//           <button
//             onClick={handleEdit}
//             className="text-gray-600 hover:text-black"
//           >
//             <Edit className="w-4 text-button-dark group-hover:text-white" />
//           </button>
//         </div>
//       );
//     }
//   }
// ];


import { ColumnDef } from '@tanstack/react-table'; // Assuming you have this import
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { HotelRefundType } from './client';

export const hotelRefundColumns: ColumnDef<HotelRefundType>[] = [
  {
    accessorKey: 'uniqueId',
    header: 'Refund ID',
    cell: ({ row }) => {
      const refundId = row.original.uniqueId || 'N/A'; // Access uniqueId correctly
      return <span>{refundId}</span>;
    },
  },
  {
    header: 'Guest Info',
    accessorKey: 'guest', // Correctly access guest data
    cell: ({ row }) => {
      const guest = row.original.guest || {};
      const fullName = `${guest.firstName || 'N/A'} ${guest.lastName || 'N/A'}`;
      const phone = guest.phoneNumber || 'N/A';

      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm text-gray-800">{fullName}</span>
          <span className="text-xs text-gray-500">{phone}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      return <span>{`INR ${row.original.amount || 0}`}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const colorMap: Record<string, string> = {
        Initiated: '#FC690E',
        'In-Progress': '#3787E3',
        Completed: '#78B150',
        Rejected: '#E5252A',
      };

      const router = useRouter();

      return (
        <div className="flex flex-col items-start">
          <span style={{ color: colorMap[status] || 'gray' }}>{status}</span>

          {status === 'Completed' && (
            <button
              onClick={() =>
                router.push(`/hotel-panel/refund-management/edit/${row.original._id}`)
              }
              className="text-[#78B150] text-[10px] mt-1 underline"
            >
              View Feedback
            </button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      const date = new Date(updatedAt);
      if (isNaN(date.getTime())) {
        return <span className="text-xs text-gray-500">Invalid Date</span>;
      }
      return (
        <span className="text-xs text-gray-500">
          <div>{date.toLocaleDateString()}</div>
          <div>{date.toLocaleTimeString()}</div>
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const router = useRouter();
      const handleEdit = () => {
        const refundId = row.original._id;
        router.push(`/hotel-panel/refund-management/edit/${refundId}`);
      };

      return (
        <div className="py-4">
          <button
            onClick={handleEdit}
            className="text-gray-600 hover:text-black"
          >
            <Edit className="w-4 text-button-dark group-hover:text-white" />
          </button>
        </div>
      );
    },
  },
];

