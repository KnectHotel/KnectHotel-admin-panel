
// 'use client';

// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { DataTable } from '@/components/ui/data-table';
// import { Heading } from '@/components/ui/heading';
// import apiCall from '@/lib/axios';
// import { columns } from './columns'; // Define this separately

// // Only hotel-specific transaction info
// export interface HotelTransaction {
//   _id: string;
//   transactionId: string;
//   hotel: {
//     name: string;
//     email: string;
//     phoneNo: string;
//   };
//   amount: number;
//   createdAt: string;
//   status: string;
// }

// export const HotelTransactionDataTable: React.FC = () => {
//   const [data, setData] = useState<HotelTransaction[]>([]);
//   const [pageNo, setPageNo] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [loading, setLoading] = useState<boolean>(false);

//   const fetchTransactions = async () => {
//     try {
//       setLoading(true);
//       const response = await apiCall(
//         'GET',
//         `/api/transactions?page=${pageNo}&limit=${limit}`
//       );

//       const resData = response;

//       if (resData?.success) {
//         setData(resData.data || []);
//         setTotalRecords(resData.total || 0);
//       }
//     } catch (error) {
//       console.error('Failed to fetch transactions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, [pageNo, limit]);

//   const handlePageChange = (newPage: number) => {
//     const totalPages = Math.ceil(totalRecords / limit);
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPageNo(newPage);
//     }
//   };

//   return (
//     <>
//       <div className="flex items-start justify-start mb-4">
//         <div className="w-full flex justify-between items-center px-4">
//           <Heading title="Hotel Transactions" />
//         </div>
//       </div>

//       {loading ? (
//         <span className="text-sm px-4 py-2">Loading...</span>
//       ) : (
//         <DataTable
//           searchKey="hotel.name" // optional searchKey
//           columns={columns}
//           data={data}
//         />
//       )}

//       <div className="flex justify-end space-x-2 px-4 py-3">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => handlePageChange(pageNo - 1)}
//           disabled={pageNo === 1}
//         >
//           Previous
//         </Button>
//         <span className="text-sm text-gray-600">
//           Page {pageNo} of {Math.ceil(totalRecords / limit)}
//         </span>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => handlePageChange(pageNo + 1)}
//           disabled={pageNo >= Math.ceil(totalRecords / limit)}
//         >
//           Next
//         </Button>
//       </div>
//     </>
//   );
// };




'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import apiCall from '@/lib/axios';
import { columns } from './columns'; // Define this separately

// Only hotel-specific transaction info
export interface HotelTransaction {
  _id: string;
  transactionId: string;
  hotel: {
    name: string;
    email: string;
    phoneNo: string;
  };
  amount: number;
  createdAt: string;
  status: string;
  guest?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
}

export const HotelTransactionDataTable: React.FC = () => {
  const [data, setData] = useState<HotelTransaction[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await apiCall(
        'GET',
        `/api/transactions?page=${pageNo}&limit=${limit}`
      );

      const resData = response;
      console.log('aaaaaa', resData)

      if (resData?.success) {
        setData(resData.data || []);
        setTotalRecords(resData.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [pageNo, limit]);

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(totalRecords / limit);
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNo(newPage);
    }
  };

  return (
    <>
      <div className="flex items-start justify-start mb-4">
        <div className="w-full flex justify-between items-center px-4">
          <Heading title="Hotel Transactions" />
        </div>
      </div>

      {loading ? (
        <span className="text-sm px-4 py-2">Loading...</span>
      ) : (
        <DataTable
          searchKey="hotel.name"
          columns={columns}
          data={data}
        />
      )}

      <div className="flex justify-end space-x-2 px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pageNo - 1)}
          disabled={pageNo === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {pageNo} of {Math.ceil(totalRecords / limit)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pageNo + 1)}
          disabled={pageNo >= Math.ceil(totalRecords / limit)}
        >
          Next
        </Button>
      </div>
    </>
  );
};
