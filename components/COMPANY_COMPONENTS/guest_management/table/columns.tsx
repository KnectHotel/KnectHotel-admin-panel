
import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import { parseISO, format } from 'date-fns';

export interface GuestDetailsDataType {
  _id: string;
  firstName: string;
  uniqueId: string;
  lastName: string;
  phoneNumber: string;
  assignedRoomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  paymentStatus: string;
  status: string;
  sources?: string;
  HotelId?: {
    name?: string;
    HotelId?: string;
  };
  email?: string;
  guestsCount?: number;
  createdAt?: string;
}

const formatDateTime = (isoString: string) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export const columns: ColumnDef<GuestDetailsDataType>[] = [
  {
    accessorKey: 'uniqueId',
    header: 'Booking ID',
  },
  {
    accessorKey: 'firstName',
    header: 'Guest Name',
    cell: ({ row }) => {
      const { firstName, lastName, phoneNumber, assignedRoomNumber } = row.original;
      return (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{`${firstName} ${lastName}`}</span>
          <span className="text-sm text-gray-600">{phoneNumber}</span>
          <span className="text-sm text-gray-600">Room:{assignedRoomNumber || 'N/A'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'hotelInfo',
    header: 'Hotel Info',
    cell: ({ row }) => {
      const hotel = row.original?.HotelId;
      const name = hotel?.name || 'N/A';
      const id = hotel?.HotelId || 'N/A';

      return (
        <div className="flex flex-col text-sm">
          <span className="font-medium text-gray-800">{name}</span>
          <span className="text-xs text-gray-600">ID: {id}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'checkInDate',
    header: 'Check-In',
    cell: ({ row }) => {
      const checkIn = row.original.checkInDate;
      if (checkIn) {
        const date = new Date(checkIn);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();

        return (
          <div className="text-success text-xs 2xl:text-sm opacity-80">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        );
      }
      return <div className="text-success text-xs 2xl:text-sm opacity-50">N/A</div>;
    }
  },
  {
    accessorKey: 'checkOutDate',
    header: 'Check-Out',
    cell: ({ row }) => {
      const checkOut = row.original.checkOutDate;
      if (checkOut) {
        const date = new Date(checkOut);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();

        return (
          <div className="text-warning text-xs 2xl:text-sm opacity-80">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        );
      }
      return <div className="text-warning text-xs 2xl:text-sm opacity-50">N/A</div>;
    }
  }
  ,
  {
    accessorKey: 'status',
    header: 'Booking Status',
    cell: ({ row }) => (
      <span className="capitalize font-medium">
        {row.original.status ?? 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment',
    cell: ({ row }) => (
      <span className="capitalize text-sm font-medium">
        {row.original.paymentStatus ?? 'Pending'}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return (
        <span className="text-xs text-gray-700 opacity-70">
          {createdAt ? format(parseISO(createdAt), 'dd MMM yyyy, hh:mm a') : 'N/A'}
        </span>
      );
    },
  },
  {
    accessorKey: 'actions',
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CellAction data={row.original} />
      </div>
    ),
  },
];

