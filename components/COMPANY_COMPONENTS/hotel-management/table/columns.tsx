// import { ColumnDef } from '@tanstack/react-table';
// import CellAction from './cell-action';
// import { HotelDataType } from './client';

// // Update type to match guestDataType for better type safety
// export const columns: ColumnDef<HotelDataType>[] = [
//   {
//     accessorKey: 'serviceID',
//     header: 'Hotel ID'
//   },
//   {
//     accessorKey: 'hotelName',
//     header: 'Hotel Name'
//   },
//   {
//     accessorKey: 'mobileNo',
//     header: 'Mobile No.',
//     cell: ({ row }) => {
//       return <span>{row.original.mobileNo}</span>;
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
//             <span>{details.subscriptionPlan}</span>
//             <span>
//               {new Date(details.subscriptionEndDate).toLocaleString('en-GB', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: true,
//               })}
//             </span>

//             <span className="opacity-60">INR-{details.subscriptionPrice}/month</span>
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
import { HotelDataType } from './client';

// Update type to match HotelDataType for better type safety
export const columns: ColumnDef<HotelDataType>[] = [
  {
    accessorKey: 'serviceID',
    header: 'Hotel ID'
  },
  {
    accessorKey: 'hotelName',
    header: 'Hotel Name'
  },
  {
    accessorKey: 'mobileNo',
    header: 'Mobile No.',
    cell: ({ row }) => <span>{row.original.mobileNo}</span>
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'subscriptionDetails',
    header: 'Subscription Details',
    cell: ({ row }) => {
      const { subscriptionPlan, subscriptionEndDate } =
        row.original.subscriptionDetails;
      const { subscriptionStartDate } = row.original; // Access subscriptionStartDate directly

      // Handle the case where subscription details might be missing or incomplete
      const formattedEndDate = subscriptionEndDate
        ? new Date(subscriptionEndDate).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        : 'N/A';

      // Format the start date (subscriptionStartDate) similarly
      const formattedStartDate = subscriptionStartDate
        ? new Date(subscriptionStartDate).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        : 'N/A';

      return (
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-start">
            <span>{subscriptionPlan?.planName || 'N/A'}</span>
            <span>{`${formattedStartDate}`}</span>
            <span>{`${formattedEndDate}`}</span>
            <span className="opacity-60">
              INR {subscriptionPlan?.cost || 0}/month
            </span>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'housekeepingStatus',
    header: 'Room Status',
    cell: ({ row }) => {
      const status = row.original.housekeepingStatus;

      const color =
        status === 'CLEANED'
          ? 'text-green-600'
          : status === 'DIRTY'
            ? 'text-red-600'
            : status === 'INSPECTED'
              ? 'text-blue-600'
              :'text-yellow-600';

      return <span className={`${color} font-semibold`}>{status}</span>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;

      // Status styling based on the value
      let statusClass = '';
      let statusText = status;

      switch (status) {
        case 'ACTIVE':
          statusClass = 'text-success';
          break;
        case 'INACTIVE':
          statusClass = 'text-danger';
          break;
        default:
          statusClass = 'text-gray-500';
          break;
      }

      return <span className={statusClass}>{statusText}</span>;
    }
  },
  {
    accessorKey: 'actions',
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction data={row.original} />
      </div>
    )
  }
];
