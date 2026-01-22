

















































































import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import { HotelDataType } from './client';


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
      const { subscriptionStartDate } = row.original; 

      
      const formattedEndDate = subscriptionEndDate
        ? new Date(subscriptionEndDate).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        : 'N/A';

      
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;

      
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
