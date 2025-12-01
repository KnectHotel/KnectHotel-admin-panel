// import { ColumnDef } from '@tanstack/react-table';
// import { MoveDownLeft, MoveUpRight } from 'lucide-react';  // Importing lucide-react icons
// import CellAction from './cell-action';

// export const columns: ColumnDef<any>[] = [
//   {
//     accessorKey: 'paymentID',
//     header: 'Payment ID',
//   },
//   {
//     accessorKey: 'dateTime',
//     header: 'Date & Time',
//   },
//   {
//     accessorKey: 'guestDetail',
//     header: 'Guest Detail',
//     cell: ({ row }) => {
//       const { guestName, guestID } = row.original.guestDetail;
//       return (
//         <div className="flex flex-col items-start">
//           <span className="text-sm">{guestID}</span>
//           <span className="text-xs opacity-55">{guestName}</span>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: 'serviceDetails',
//     header: 'Service Details',
//     cell: ({ row }) => {
//       const { serviceID, serviceName } = row.original.serviceDetails;
//       return (
//         <div className="flex flex-col items-start">
//           <span className="text-sm">{serviceID}</span>
//           <span className="text-xs opacity-55">{serviceName}</span>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: 'paymentTransaction',
//     header: 'Payment & Transactions',
//     cell: ({ row }) => {
//       const { amount, method } = row.original.paymentTransaction;

//       let Icon;
//       let iconColor = '';
//       if (method === 'Online') {
//         Icon = MoveUpRight;  
//         iconColor = 'text-red-500'; 
//       } else if (method === 'via cash') {
//         Icon = MoveDownLeft; 
//         iconColor = 'text-green-500';  
//       }

//       return (
//         <div className="flex flex-col items-start">
//           <span className="text-sm">{amount}</span>
//           <span className="text-xs opacity-55 flex items-center gap-1">
//             {method} {Icon && <Icon className={`${iconColor} w-4 h-4`} />}
//           </span>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: 'discountCoupon',
//     header: 'Discount & Coupons',
//     cell: ({ row }) => {
//       const discountCoupon = row.original.discountCoupon;

//       return (
//         <div className="flex items-center gap-2">
//           <span className="text-sm">{discountCoupon}</span>
//           {discountCoupon !== 'None' && (
//             <img src={'/discount.png'} alt="Discount Coupon" className="w-8 h-8 mt-1" />
//           )}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: 'actions',
//     id: 'actions',
//     header: 'Actions',
//     cell: ({ row }) => (
//       <div className="flex items-center justify-center">
//         <CellAction data={row.original} />
//       </div>
//     ),
//   },
// ];


'use client';

import { ColumnDef } from '@tanstack/react-table';
import { HotelTransaction } from './client';
import CellAction from './cell-action';

export const columns: ColumnDef<HotelTransaction>[] = [
  {
    accessorKey: 'transactionId',
    header: 'Transaction ID'
  },
  {
    header: 'Guest',
    accessorKey: 'guest',
    cell: ({ row }) => {
      const guest = row.original.guest;
      return guest ? (
        <div>
          <div>{guest.firstName} {guest.lastName}</div>
          <div>{guest.phoneNumber}</div>
        </div>
      ) : null;
    }
  },
  {
    header: 'Hotel Details',
    accessorKey: 'hotel',
    cell: ({ row }) => {
      const hotel = row.original.hotel;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{hotel.name}</span>
          <span className="text-gray-500 text-xs">{hotel.email}</span>
          <span className="text-gray-500 text-xs">{hotel.phoneNo}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `₹${row.original.amount}`
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status?.toLowerCase();

      let bgColor = '';
      switch (status) {
        case 'completed':
          bgColor = 'bg-green-200 text-green-800';
          break;
        case 'pending':
          bgColor = 'bg-yellow-200 text-yellow-800';
          break;
        case 'created':
          bgColor = 'bg-orange-300 text-orange-900';
          break;
        case 'failed':
          bgColor = 'bg-red-300 text-red-800';
          break;
        default:
          bgColor = 'bg-orange-200 text-orange-800'; // normal/default
          break;
      }

      return (
        <span
          className={`px-3 py-1 rounded-md text-xs font-semibold capitalize ${bgColor}`}
        >
          {status}
        </span>
      );
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


