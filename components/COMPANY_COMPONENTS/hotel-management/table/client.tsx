// 'use client';

// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { DataTable } from '@/components/ui/data-table';
// import { useRouter } from 'next/navigation';
// import { columns } from './columns';
// import { Heading } from '@/components/ui/heading';
// import { HotelDataType } from 'app/static/company-panel/HotelManagement';
// import { ToastAtTopRight } from '@/lib/sweetalert';
// import apiCall from '@/lib/axios';
// import { PaginationControls } from '@/components/shared/PaginationControls';

// // type ModeType = 'add_guest' | 'add_booking';

// export const HotelManagementHome: React.FC = () => {
//   const router = useRouter();
//   const [data, setData] = useState<HotelDataType[]>([]);
//   const [filteredData, setFilteredData] = useState<HotelDataType[]>([]);
//   const [pageNo, setPageNo] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [loading, setLoading] = useState<boolean>();
//   const [totalRecords, setTotalRecords] = useState(data.length || 0);
//   const [pendingCount, setPendingCount] = useState(0);

//   useEffect(() => {
//     const fetchPendingCount = async () => {
//       try {
//         const response = await apiCall('GET', 'api/hotel/pending-requests');
//         if (response.status === 'success' && Array.isArray(response.requests)) {
//           setPendingCount(response.requests.length);
//         } else {
//           setPendingCount(0);
//         }
//       } catch {
//         setPendingCount(0);
//       }
//     };
//     fetchPendingCount();
//   }, []);

//   useEffect(() => {
//     const fetchHotels = async () => {
//       try {
//         setLoading(true);
//         const response = await apiCall(
//           'GET',
//           `api/hotel/get-hotels?page=${pageNo}&limit=${limit}`
//         );

//         if (response.status) {
//           const hotels: HotelDataType[] = response.hotels.map((hotel: any) => ({
//             hotelID: hotel._id || '',
//             serviceID: hotel.HotelId,
//             hotelName: hotel.name,
//             mobileNo: hotel.phoneNo || 'N/A',
//             email: hotel.email,
//             subscriptionDetails: {
//               subscriptionPlan: hotel.subscriptionPlan || 'N/A',
//               subscriptionEndDate: hotel.subscriptionEndDate || 'N/A',
//               subscriptionPrice: hotel.subscriptionPrice || 'N/A',
//               cost: 0
//             },
//             status:
//               hotel.status.toUpperCase() === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'
//           }));

//           setData(hotels);
//           setFilteredData(hotels);
//           setTotalRecords(response.totalHotels);
//         } else {
//           ToastAtTopRight.fire('Failed to fetch hotels', 'error');
//         }
//       } catch (error) {
//         ToastAtTopRight.fire('Error loading hotels', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHotels();
//   }, [pageNo, limit]);

//   const handlePageChange = (newPage: number) => {
//     if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
//       setPageNo(newPage);
//     }
//   };

//   const handleLimitChange = (newLimit: number) => {
//     setLimit(newLimit);
//     setPageNo(1); // Reset to the first page when the limit changes
//   };

//   const handleSearchChange = (searchValue: string) => {
//     const filtered = data.filter((item) =>
//       item.hotelName.toLowerCase().includes(searchValue.toLowerCase())
//     );
//     setFilteredData(filtered);
//     setTotalRecords(filtered.length);
//     setPageNo(1);
//   };

//   return (
//     <>
//       <div className="w-full flex justify-between items-start px-3">
//         <Heading title={`Hotels`} className="my-0" />
//         <div className="flex flex-col gap-3">
//           <Button
//             onClick={() => router.push('/super-admin/hotel-management/add')}
//             className="btn-primary"
//           >
//             On-Board Hotel
//           </Button>
//           <div className="relative">
//             <Button
//               onClick={() =>
//                 router.push('/super-admin/hotel-management/pending')
//               }
//               className="btn-primary"
//             >
//               Pending Requests
//             </Button>
//             <span className="absolute -top-2 -right-1 text-white w-6 h-6 text-center pt-1 font-medium text-xs rounded-full bg-gradient-to-t from-[#E0363A] via-[#E0363A] to-[#E0363A]">
//               {pendingCount || 0}
//             </span>
//           </div>
//         </div>
//       </div>
//       {loading ? (
//         <span>Loading...</span>
//       ) : (
//         <DataTable
//           searchKey="hotelName"
//           columns={columns}
//           data={filteredData}
//           onSearch={handleSearchChange}
//         />
//       )}
//       <PaginationControls
//         pageNo={pageNo}
//         totalRecords={totalRecords}
//         limit={limit}
//         filteredCount={filteredData.length}
//         onPageChange={handlePageChange}
//       />
//     </>
//   );
// };

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { Heading } from '@/components/ui/heading';
import { ToastAtTopRight } from '@/lib/sweetalert';
import apiCall from '@/lib/axios';
import { PaginationControls } from '@/components/shared/PaginationControls';

// TypeScript interfaces
export interface SubscriptionPlanType {
  _id: string;
  planName: string;
  planType: 'Quarterly' | 'Monthly' | 'Annually'; // Adjust plan types based on actual data
  cost: number;
}

export interface RoomType {
  _id: string;
  roomName: string;
  roomType: string;
  features: string[];
  images: string[];
}

export interface HotelDataType {
  hotelID: string;
  serviceID: string;
  hotelName: string;
  mobileNo: string;
  email: string;
  subscriptionDetails: {
    subscriptionPlan: SubscriptionPlanType;
    subscriptionEndDate: string | null;
    subscriptionPrice: string | number;
    cost: number;
  };
  housekeepingStatus: 'CLEANED' | 'DIRTY' | 'INSPECTED';
  status: 'ACTIVE' | 'INACTIVE';
  address: string;
  city: string;
  country: string;
  state: string;
  pincode: string;
  rooms: RoomType[];
  internetConnectivity: boolean;
  softwareCompatibility: boolean;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionPaymentStatus: 'pending' | 'paid';
  about: string;
  gstPercentage: number;
  createdAt: string;
  updatedAt: string;
  HotelId: string;
  transaction: string;
  netPrice: number;
}

export const HotelManagementHome: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<HotelDataType[]>([]);
  const [filteredData, setFilteredData] = useState<HotelDataType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(1);
  // Fetch Pending Count
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await apiCall('GET', 'api/hotel/pending-requests');
        if (response.status === 'success' && Array.isArray(response.requests)) {
          setPendingCount(response.requests.length);
        } else {
          setPendingCount(0);
        }
      } catch {
        setPendingCount(0);
      }
    };
    fetchPendingCount();
  }, []);

  // Fetch Hotels Data
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await apiCall(
          'GET',
          `api/hotel/get-hotels?page=${pageNo}&limit=${limit}&_t=${Date.now()}`
        );
        console.log(response);

        if (response.status) {
          const hotels: HotelDataType[] = response.hotels.map((hotel: any) => {
            // ✅ FINAL STATUS LOGIC: Payment + Valid Dates = ACTIVE
            const isActive =
              hotel.subscriptionPaymentStatus === 'paid' &&
              !!hotel.subscriptionStartDate &&
              !!hotel.subscriptionEndDate;

            // 🔍 DEBUG LOG (Temporary - Remove after issue is 100% stable)
            console.log('HOTEL STATUS DEBUG', {
              hotelName: hotel.name,
              backendStatus: hotel.status,
              paymentStatus: hotel.subscriptionPaymentStatus,
              subscriptionStartDate: hotel.subscriptionStartDate,
              subscriptionEndDate: hotel.subscriptionEndDate,
              derivedStatus: isActive ? 'ACTIVE' : 'INACTIVE'
            });

            return {
              hotelID: hotel._id || '',
              serviceID: hotel.HotelId,
              hotelName: hotel.name,
              mobileNo: hotel.phoneNo || 'N/A',
              email: hotel.email,
              subscriptionDetails: {
                subscriptionPlan: {
                  _id: hotel.subscriptionPlan?._id || '',
                  planName: hotel.subscriptionPlan?.planName || 'N/A',
                  planType: hotel.subscriptionPlan?.planType || 'N/A',
                  cost: hotel.subscriptionPlan?.cost || 0
                },
                subscriptionEndDate: hotel.subscriptionEndDate || 'N/A',
                subscriptionPrice: hotel.subscriptionPrice || 'N/A',
                cost: 0
              },
              // ✅ USE DERIVED STATUS (not backend flag)
              status: isActive ? 'ACTIVE' : 'INACTIVE',
              address: hotel.address || '',
              city: hotel.city || '',
              country: hotel.country || '',
              state: hotel.state || '',
              pincode: hotel.pincode || '',
              rooms: hotel.rooms || [],
              internetConnectivity: hotel.internetConnectivity || false,
              softwareCompatibility: hotel.softwareCompatibility || false,
              subscriptionStartDate: hotel.subscriptionStartDate || '',
              subscriptionEndDate: hotel.subscriptionEndDate || '',
              subscriptionPaymentStatus:
                hotel.subscriptionPaymentStatus || 'pending',
              about: hotel.about || '',
              gstPercentage: hotel.gstPercentage || 18,
              createdAt: hotel.createdAt || '',
              updatedAt: hotel.updatedAt || '',
              HotelId: hotel.HotelId || '',
              transaction: hotel.transaction || '',
              netPrice: hotel.netPrice || 0
            };
          });

          setData(hotels);
          setFilteredData(hotels);
          setTotalRecords(response.totalHotels);
        } else {
          ToastAtTopRight.fire('Failed to fetch hotels', 'error');
        }
      } catch (error) {
        ToastAtTopRight.fire('Error loading hotels', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [pageNo, limit]);

  // Pagination Control Functions
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalRecords / limit)) {
      setPageNo(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPageNo(1); // Reset to the first page when the limit changes
  };

  // Search Functionality
  const handleSearchChange = (searchValue: string) => {
    const filtered = data.filter((item) =>
      item.hotelName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
    setTotalRecords(filtered.length);
    setPageNo(1);
  };

  return (
    <>
      <div className="w-full flex justify-between items-start px-3">
        <Heading title={`Hotels`} className="my-0" />
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push('/super-admin/hotel-management/add')}
            className="btn-primary"
          >
            On-Board Hotel
          </Button>
          <div className="relative">
            <Button
              onClick={() =>
                router.push('/super-admin/hotel-management/pending')
              }
              className="btn-primary"
            >
              Pending Requests
            </Button>
            <span className="absolute -top-2 -right-1 text-white w-6 h-6 text-center pt-1 font-medium text-xs rounded-full bg-gradient-to-t from-[#E0363A] via-[#E0363A] to-[#E0363A]">
              {pendingCount || 0}
            </span>
          </div>
        </div>
      </div>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <DataTable
          searchKey="hotelName"
          columns={columns}
          data={filteredData}
          onSearch={handleSearchChange}
        />
      )}
      <PaginationControls
        pageNo={pageNo}
        totalRecords={totalRecords}
        limit={limit}
        totalPages={totalPages}
        filteredCount={filteredData.length}
        onPageChange={handlePageChange}
      />
    </>
  );
};
