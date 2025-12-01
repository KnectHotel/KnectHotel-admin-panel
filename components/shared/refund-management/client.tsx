// 'use client';

// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { DataTable } from '@/components/ui/data-table';
// import { Heading } from '@/components/ui/heading';
// import { useRouter } from 'next/navigation';
// import CreateRefundModal from '@/components/shared/coupon-refund-management/create_refund_modal';
// import { columns } from './column';
// import apiCall from '@/lib/axios';

// export interface SuperRefundType {
//   _id: string;
//   hotel: {
//     _id: string;
//     name: string;
//     email: string;
//     HotelId: string;
//   };
//   scope: string;
//   amount: number;
//   status: 'Initiated' | 'In-Progress' | 'Completed' | 'Rejected';
//   reason: string;
//   processedBy: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export const SuperRefundDetailsTable: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [data, setData] = useState<SuperRefundType[]>([]);
//   const [filteredData, setFilteredData] = useState<SuperRefundType[]>([]);
//   const [pageNo, setPageNo] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [totalRecords, setTotalRecords] = useState(0);

//   useEffect(() => {
//     fetchRefunds();
//   }, []);

//   const fetchRefunds = async () => {
//     try {
//       setLoading(true);
//       const res = await apiCall('get', '/api/refund');
//       if (res?.success) {
//         setData(res.refunds);
//         setFilteredData(res.refunds);
//         setTotalRecords(res.refunds.length);
//       }
//     } catch (error) {
//       console.error('Failed to fetch refunds', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearchChange = (searchValue: string) => {
//     if (!searchValue.trim()) {
//       setFilteredData(data);
//     } else {
//       const filtered = data.filter((item) =>
//         item.hotel.name.toLowerCase().includes(searchValue.toLowerCase())
//       );
//       setFilteredData(filtered);
//     }
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
//       setPageNo(newPage);
//     }
//   };

//   const handleLimitChange = (newLimit: number) => {
//     setLimit(newLimit);
//     setPageNo(1);
//   };

//   return (
//     <>
//       <div className="flex items-start justify-start">
//         <div className="w-full flex justify-between items-center px-4">
//           <Heading title={`Refunds Management`} />
//           <Button onClick={() => setIsOpen(true)} className="btn-primary">
//             Create Refund
//           </Button>
//         </div>
//       </div>

//       <CreateRefundModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

//       {loading ? (
//         <div className="text-center mt-6">Loading...</div>
//       ) : (
//         <DataTable
//           searchKey="hotel.name"
//           columns={columns}
//           data={filteredData.slice((pageNo - 1) * limit, pageNo * limit)}
//           onSearch={handleSearchChange}
//         />
//       )}

//       <div className="flex justify-end space-x-2 px-3 py-2">
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
import { useRouter } from 'next/navigation';
import CreateRefundModal from '@/components/shared/coupon-refund-management/create_refund_modal';
import { columns } from './column';
import apiCall from '@/lib/axios';

export interface SuperRefundType {
  _id: string;
  hotel: {
    _id: string;
    name: string;
    email: string;
    HotelId: string;
  };
  scope: string;
  amount: number;
  status: 'Initiated' | 'In-Progress' | 'Completed' | 'Rejected';
  reason: string;
  processedBy: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const SuperRefundDetailsTable: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<SuperRefundType[]>([]);
  const [filteredData, setFilteredData] = useState<SuperRefundType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const res = await apiCall('get', '/api/refund');
      if (res?.success) {
        setData(res.refunds);
        setFilteredData(res.refunds);
        setTotalRecords(res.refunds.length);
      }
    } catch (error) {
      console.error('Failed to fetch refunds', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (searchValue: string) => {
    if (!searchValue.trim()) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.hotel.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPageNo(1);
  };

  return (
    <>
      <div className="flex items-start justify-start">
        <div className="w-full flex justify-between items-center px-4">
          <Heading title={`Refunds Management`} />
          <Button onClick={() => setIsOpen(true)} className="btn-primary">
            Create Refund
          </Button>
        </div>
      </div>

      <CreateRefundModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {loading ? (
        <div className="text-center mt-6">Loading...</div>
      ) : (
        <DataTable
          searchKey="hotel.name"
          columns={columns}
          data={filteredData.slice((pageNo - 1) * limit, pageNo * limit)}
          onSearch={handleSearchChange}
        />
      )}

      <div className="flex justify-end space-x-2 px-3 py-2">
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