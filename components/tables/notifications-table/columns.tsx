import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import { NotificationsDataType } from 'app/static/ServiceManagementData'; 


export const columns: ColumnDef<NotificationsDataType>[] = [
  {
    accessorKey: 'notificationID',
    header: 'Notification ID',
  },
  {
    accessorKey: 'dateAndTime',
    header: 'Date & Time',
    cell: ({ row }) => {
      const { date, time } = row.original.dateAndTime;
      return (
        <div>
          {date} {time}
        </div>
      );
    },
  },
  {
    accessorKey: 'guestDetails',
    header: 'Guest Details',
    cell: ({ row }) => {
      const details = row.original.guestDetails;
      return (
        <div>
          {details.name}, Room {details.roomNo}
        </div>
      );
    },
  },
  {
    accessorKey: 'guestDetails.phoneNo',
    header: 'Contact Details',
    cell: ({ row }) => {
      const phoneNo = row.original.guestDetails.phoneNo;
      return <div>{phoneNo}</div>;
    },
  },
  {
    accessorKey: 'notificationType',
    header: 'Notification Type',
    cell: ({ row }) => {
      const type = row.original.notificationType;
      return <div>{type}</div>;
    },
  },
  {
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.Status;
      switch (status) {
        case 'Received':
          return <div className="text-blue-500">{status}</div>;
        case 'Sent':
          return <div className="text-orange-500">{status}</div>;
        default:
          return <div className="text-gray-500">{status}</div>;
      }
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