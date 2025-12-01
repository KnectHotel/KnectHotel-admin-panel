// import { ColumnDef } from '@tanstack/react-table';
// import CellAction from './cell-action';
// import { SubHotelDataType } from './client';

// // Update type to match guestDataType for better type safety
// export const columns: ColumnDef<SubHotelDataType>[] = [
//   {
//     accessorKey: 'hotelID',
//     header: 'Hotel ID'
//   },
//   {
//     accessorKey: 'parentHotel',
//     header: 'Parent Hotel'
//   },
//   {
//     accessorKey: 'hotelName',
//     header: 'Hotel Name'
//   },
//   {
//     accessorKey: 'mobileNo',
//     header: 'Mobile No.',
//     cell: ({ row }) => {
//       return <span>+91-{row.original.mobileNo}</span>;
//     }
//   },
//   {
//     accessorKey: 'email',
//     header: 'Email'
//   },
//   {
//     accessorKey: 'subscriptionDetails',
//     header: 'Subscription Details',
//     cell: ({ row }) => {
//       const details = row.original.subscriptionDetails;
//       return (
//         <div className="flex items-center justify-center">
//           <div className="flex flex-col items-start">
//             <span>{details.planName}</span>
//             <span className="opacity-60">INR-{details.cost}/month</span>
//           </div>
//         </div>
//       );
//     }
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status',
//     cell: ({ row }) => {
//       const status = row.original.status;
//       let statusElement;
//       switch (status) {
//         case 'ACTIVE':
//           statusElement = <span className="text-success">{status}</span>;
//           break;
//         case 'INACTIVE':
//           statusElement = <span className="text-danger">{status}</span>;
//         default:
//           statusElement = <span className="text-gray-500">{status}</span>;
//           break;
//       }
//       return statusElement;
//     }
//   },
//   {
//     accessorKey: 'actions',
//     id: 'actions',
//     header: 'Actions',
//     cell: ({ row }) => (
//       <div className="flex items-center justify-center">
//         <CellAction data={row.original} />
//       </div>
//     )
//   }
// ];


import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import { SubHotelDataType } from './client';

export const columns: ColumnDef<SubHotelDataType>[] = [
  {
    accessorKey: 'HotelId',
    header: 'Hotel ID',
    cell: ({ row }) => <span>{row.original.HotelId || 'N/A'}</span>,
  },
  {
    accessorKey: 'parentHotel',
    header: 'Parent Hotel',
    cell: ({ row }) => {
      const parent = row.original.parentHotel;

      return parent ? (
        <div className="flex flex-col text-sm">
          <span className="font-medium">{parent.name}</span>
          <span className="text-xs text-gray-500">{parent.email}</span>
          <span className="text-xs text-gray-500">{parent.phoneNo}</span>
          <span className="text-xs text-gray-500">{parent.HotelId}</span>
        </div>
      ) : (
        <span className="text-gray-400 italic">N/A</span>
      );
    },
  }
  ,
  {
    accessorKey: 'hotelName',
    header: 'Hotel Name',
    cell: ({ row }) => <span className="font-medium">{row.original.hotelName}</span>,
  },
  {
    accessorKey: 'mobileNo',
    header: 'Mobile No.',
    cell: ({ row }) => (
      <span>+91-{row.original.mobileNo || 'N/A'}</span>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <span>{row.original.email || 'N/A'}</span>,
  },
  {
    accessorKey: 'subscriptionDetails',
    header: 'Subscription',
    cell: ({ row }) => {
      const { planName, cost } = row.original.subscriptionDetails || {};
      return (
        <div className="flex flex-col items-start">
          <span>{planName || 'No Plan'}</span>
          <span className="text-xs text-gray-500">INR {cost || 0}/month</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status?.toUpperCase();
      const statusClasses = {
        ACTIVE: 'text-green-600 font-semibold',
        INACTIVE: 'text-red-600 font-semibold',
        default: 'text-gray-500 font-medium',
      };
      return (
        <span className={statusClasses[status as keyof typeof statusClasses] || statusClasses.default}>
          {status}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction data={row.original} />
      </div>
    ),
  },
];
