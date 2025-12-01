// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { DataTable } from '@/components/ui/data-table';
// import { Settings } from 'lucide-react';
// import { columns } from './columns';
// import apiCall from '@/lib/axios';
// import InRoomTimeSetting from '@/components/modal/in-room_dining/InRoomTimeSetting';

// export type InRoomDiningDataType = {
//   orderID: string;
//   serviceID: string;
//   requestTime: { date: string; time: string };
//   guestDetails: {
//     name: string;
//     guestID: string;
//     roomNo: string;
//     phoneNumber?: string;
//   };
//   status: string;
//   assignedTo: string;
//   paymentStatus?: string;
//   specialInstructions?: string;
//   amount?: { subtotal: number; discount: number; finalAmount: number };
//   coupon?: { code: string; type: string; value: number };
//   orderedItems?: {
//     _id: string;
//     quantity: number;
//     product: {
//       _id: string;
//       productName: string;
//       productType: string;
//       HotelId: string;
//     };
//   }[];
//   transaction?: string;
//   paymentDate?: string | null;
//   createdAt?: string | null;
//   updatedAt?: string | null;
// };

// export const InRoomDiningDataTable: React.FC = () => {
//   const router = useRouter();
//   const [data, setData] = useState<InRoomDiningDataType[]>([]);
//   const [filteredData, setFilteredData] = useState<InRoomDiningDataType[]>([]);
//   const [pageNo, setPageNo] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const lastReqSigRef = useRef<string>(''); // stale response guard

//   const formatDateTime = (iso?: string) => {
//     if (!iso) return { date: 'N/A', time: 'N/A' };
//     const d = new Date(iso);
//     return {
//       date: d.toLocaleDateString(),
//       time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     };
//   };

//   const mapOrderStatus = (status: string) => {
//     switch (status) {
//       case 'placed':
//         return 'Order placed';
//       case 'preparing':
//         return 'Order is Preparing';
//       case 'pickedup':
//         return 'Order is Picked up';
//       case 'transit':
//         return 'Order in Transit';
//       case 'delivered':
//         return 'Order Delivered';
//       case 'undelivered':
//         return 'Undelivered';
//       default:
//         return status || 'N/A';
//     }
//   };

//   const fetchData = async (term = '') => {
//     setLoading(true);
//     try {
//       const isSearching = term.trim().length >= 3;

//       const qs = new URLSearchParams({
//         page: String(pageNo),
//         limit: String(limit),
//       });
//       if (isSearching) qs.set('searchTerm', term.trim());

//       const endpoint = isSearching
//         ? `api/services/search/inroomdining?${qs.toString()}`
//         : `api/services/inroomdining/bookings?${qs.toString()}`;

//       // request signature for race protection
//       const sig = endpoint;
//       lastReqSigRef.current = sig;

//       const res = await apiCall('GET', endpoint);

//       // ignore stale/out-of-order responses
//       if (lastReqSigRef.current !== sig) return;

//       if (res?.success && Array.isArray(res.data)) {
//         const formatted: InRoomDiningDataType[] = res.data.map((item: any) => ({
//           serviceID: item._id,
//           orderID: item.uniqueId || 'N/A',
//           requestTime: formatDateTime(item.requestTime || item.createdAt),
//           guestDetails: {
//             name: `${item.guest?.firstName || ''} ${item.guest?.lastName || ''}`.trim(),
//             guestID: item.guest?._id || 'N/A',
//             roomNo: item.guest?.assignedRoomNumber || 'N/A',
//             phoneNumber: item.guest?.phoneNumber || 'N/A',
//           },
//           assignedTo: item.assignedTo
//             ? `${item.assignedTo.firstName || ''} ${item.assignedTo.lastName || ''}`.trim()
//             : 'N/A',
//           status: mapOrderStatus(item.status),
//           paymentStatus: item.paymentStatus || 'N/A',
//           specialInstructions: item.specialInstructions || 'N/A',
//           amount: {
//             subtotal: item.amount?.subtotal ?? 0,
//             discount: item.amount?.discount ?? 0,
//             finalAmount: item.amount?.finalAmount ?? 0,
//           },
//           coupon: {
//             code: item.coupon?.code || 'N/A',
//             type: item.coupon?.type || 'N/A',
//             value: item.coupon?.value ?? 0,
//           },
//           orderedItems: (item.orderedItems || []).map((ordered: any) => ({
//             _id: ordered._id,
//             quantity: ordered.quantity,
//             product: {
//               _id: ordered.product?._id || 'N/A',
//               productName: ordered.product?.productName || 'N/A',
//               productType: ordered.product?.productType || 'N/A',
//               HotelId: ordered.product?.HotelId || item.HotelId || 'N/A',
//             },
//           })),
//           transaction: item.transaction || 'N/A',
//           paymentDate: item.paymentDate || null,
//           createdAt: item.createdAt || null,
//           updatedAt: item.updatedAt || null,
//         }));

//         setData(formatted);
//         setFilteredData(formatted);

//         // ✅ server-driven pagination (prefer `total`/`pages`/`page`)
//         const srvTotal =
//           typeof res.total === 'number'
//             ? res.total
//             : typeof res.count === 'number'
//               ? res.count
//               : formatted.length;

//         const srvPages =
//           typeof res.pages === 'number'
//             ? res.pages
//             : Math.max(1, Math.ceil(srvTotal / limit));

//         setTotalRecords(srvTotal);
//         setTotalPages(Math.max(1, srvPages));

//         // (optional) sync if server returns current page
//         if (typeof res.page === 'number' && res.page !== pageNo) {
//           setPageNo(res.page);
//         }
//       } else {
//         setData([]);
//         setFilteredData([]);
//         setTotalRecords(0);
//         setTotalPages(1);
//       }
//     } catch (error) {
//       console.error('Error fetching InRoomDining data', error);
//       setData([]);
//       setFilteredData([]);
//       setTotalRecords(0);
//       setTotalPages(1);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(searchTerm);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pageNo, limit, searchTerm]);

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) setPageNo(newPage);
//   };

//   const handleSearchChange = (value: string) => {
//     setSearchTerm(value);
//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     typingTimeoutRef.current = setTimeout(() => {
//       // reset to first page; useEffect will refetch
//       setPageNo(1);
//     }, 500);
//   };

//   return (
//     <>
//       <div className="flex flex-col gap-4">
//         <div className="w-full pt-20 flex items-center gap-2 justify-end px-4 py-2 bg-white">
//           <div className="flex w-full justify-between items-center">
//             <h2 className="text-coffee text-xl font-bold">In-room Dining</h2>
//           </div>
//           <Settings className="cursor-pointer" onClick={() => setIsModalOpen(true)} />
//           <InRoomTimeSetting isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//         </div>

//         <div className="flex justify-end px-4">
//           <Button
//             onClick={() => router.push('/hotel-panel/service-management/inroomdining/menu')}
//             className="btn-primary"
//           >
//             View Menu
//           </Button>
//         </div>
//       </div>

//       <div className="my-4 px-4">
//         <input
//           type="text"
//           placeholder="Search by guest name, phone, or ID..."
//           value={searchTerm}
//           onChange={(e) => handleSearchChange(e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>

//       {loading ? (
//         <div className="text-center py-4">Loading...</div>
//       ) : (
//         <DataTable searchKey="guestDetails.name" columns={columns} data={filteredData} />
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
//           Page {pageNo} of {totalPages}
//         </span>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => handlePageChange(pageNo + 1)}
//           disabled={pageNo >= totalPages}
//         >
//           Next
//         </Button>
//       </div>
//     </>
//   );
// };


'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Plus, Settings, FileSpreadsheet, FilePlus2, ChevronRight } from 'lucide-react';
import { columns } from './columns';
import apiCall from '@/lib/axios';
import InRoomTimeSetting from '@/components/modal/in-room_dining/InRoomTimeSetting';
import AddItemModal from '@/components/modal/in-room_dining/add-item';
import BulkUploadModal from '@/components/modal/in-room_dining/BulkUploadModal';

export type InRoomDiningDataType = {
  orderID: string;
  serviceID: string;
  requestTime: { date: string; time: string };
  guestDetails: {
    name: string;
    guestID: string;
    roomNo: string;
    phoneNumber?: string;
  };
  status: string;
  assignedTo: string;
  paymentStatus?: string;
  specialInstructions?: string;
  amount?: { subtotal: number; discount: number; finalAmount: number };
  coupon?: { code: string; type: string; value: number };
  orderedItems?: {
    _id: string;
    quantity: number;
    product: {
      _id: string;
      productName: string;
      productType: string;
      HotelId: string;
    };
  }[];
  transaction?: string;
  paymentDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export const InRoomDiningDataTable: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<InRoomDiningDataType[]>([]);
  const [filteredData, setFilteredData] = useState<InRoomDiningDataType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // existing: single add-item modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  // NEW: bulk modal
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  // NEW: chooser modal
  const [isChooserOpen, setIsChooserOpen] = useState(false);

  const lastReqSigRef = useRef<string>('');

  const formatDateTime = (iso?: string) => {
    if (!iso) return { date: 'N/A', time: 'N/A' };
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const mapOrderStatus = (status: string) => {
    switch (status) {
      case 'placed':
        return 'Order placed';
      case 'preparing':
        return 'Order is Preparing';
      case 'pickedup':
        return 'Order is Picked up';
      case 'transit':
        return 'Order in Transit';
      case 'delivered':
        return 'Order Delivered';
      case 'undelivered':
        return 'Undelivered';
      default:
        return status || 'N/A';
    }
  };

  const fetchData = async (term = '') => {
    setLoading(true);
    try {
      const isSearching = term.trim().length >= 3;

      const qs = new URLSearchParams({
        page: String(pageNo),
        limit: String(limit),
      });
      if (isSearching) qs.set('searchTerm', term.trim());

      const endpoint = isSearching
        ? `api/services/search/inroomdining?${qs.toString()}`
        : `api/services/inroomdining/bookings?${qs.toString()}`;

      const sig = endpoint;
      lastReqSigRef.current = sig;

      const res = await apiCall('GET', endpoint);

      if (lastReqSigRef.current !== sig) return;

      if (res?.success && Array.isArray(res.data)) {
        const formatted: InRoomDiningDataType[] = res.data.map((item: any) => ({
          serviceID: item._id,
          orderID: item.uniqueId || 'N/A',
          requestTime: formatDateTime(item.requestTime || item.createdAt),
          guestDetails: {
            name: `${item.guest?.firstName || ''} ${item.guest?.lastName || ''}`.trim(),
            guestID: item.guest?._id || 'N/A',
            roomNo: item.guest?.assignedRoomNumber || 'N/A',
            phoneNumber: item.guest?.phoneNumber || 'N/A',
          },
          assignedTo: item.assignedTo
            ? `${item.assignedTo.firstName || ''} ${item.assignedTo.lastName || ''}`.trim()
            : 'N/A',
          status: mapOrderStatus(item.status),
          paymentStatus: item.paymentStatus || 'N/A',
          specialInstructions: item.specialInstructions || 'N/A',
          amount: {
            subtotal: item.amount?.subtotal ?? 0,
            discount: item.amount?.discount ?? 0,
            finalAmount: item.amount?.finalAmount ?? 0,
          },
          coupon: {
            code: item.coupon?.code || 'N/A',
            type: item.coupon?.type || 'N/A',
            value: item.coupon?.value ?? 0,
          },
          orderedItems: (item.orderedItems || []).map((ordered: any) => ({
            _id: ordered._id,
            quantity: ordered.quantity,
            product: {
              _id: ordered.product?._id || 'N/A',
              productName: ordered.product?.productName || 'N/A',
              productType: ordered.product?.productType || 'N/A',
              HotelId: ordered.product?.HotelId || item.HotelId || 'N/A',
            },
          })),
          transaction: item.transaction || 'N/A',
          paymentDate: item.paymentDate || null,
          createdAt: item.createdAt || null,
          updatedAt: item.updatedAt || null,
        }));

        setData(formatted);
        setFilteredData(formatted);

        const srvTotal =
          typeof res.total === 'number'
            ? res.total
            : typeof res.count === 'number'
              ? res.count
              : formatted.length;

        const srvPages =
          typeof res.pages === 'number'
            ? res.pages
            : Math.max(1, Math.ceil(srvTotal / limit));

        setTotalRecords(srvTotal);
        setTotalPages(Math.max(1, srvPages));

        if (typeof res.page === 'number' && res.page !== pageNo) {
          setPageNo(res.page);
        }
      } else {
        setData([]);
        setFilteredData([]);
        setTotalRecords(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching InRoomDining data', error);
      setData([]);
      setFilteredData([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, limit, searchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPageNo(newPage);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setPageNo(1);
    }, 500);
  };

  // Optional: if bulk upload succeeds, refresh menu/list
  const handleBulkSuccess = () => {
    setIsBulkOpen(false);
    // Refresh anything you want here:
    // fetchData(searchTerm);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="w-full pt-20 flex items-center gap-2 justify-end px-4 py-2 bg-white">
          <div className="flex w-full justify-between items-center">
            <h2 className="text-coffee text-xl font-bold">In-room Dining</h2>
          </div>
          <Settings className="cursor-pointer" onClick={() => setIsModalOpen(true)} />
          <InRoomTimeSetting isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>

        {/* Right CTA row */}
        <div className="flex justify-end px-4 gap-2">
          <Button
            onClick={() => router.push('/hotel-panel/service-management/inroomdining/menu')}
            className="btn-primary"
          >
            View Menu
          </Button>

          {/* Add Items now opens a chooser */}
          <Button
            onClick={() => setIsChooserOpen(true)}
            className="btn-primary flex gap-1"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Items</span>
          </Button>
        </div>
      </div>

      {/* AddItem modal */}
      <AddItemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        editMode={false}
        productId={undefined}
      />

      {/* BulkUpload modal */}
      <BulkUploadModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        onSuccess={handleBulkSuccess}
      />

      {/* Chooser modal */}
      {isChooserOpen && (
        <ChooserModal
          onClose={() => setIsChooserOpen(false)}
          onPickBulk={() => {
            setIsChooserOpen(false);
            setIsBulkOpen(true);
          }}
          onPickSingle={() => {
            setIsChooserOpen(false);
            setIsAddOpen(true);
          }}
        />
      )}

      <div className="my-4 px-4">
        <input
          type="text"
          placeholder="Search by guest name, phone, or ID..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <DataTable searchKey="guestDetails.name" columns={columns} data={filteredData} />
      )}

      <div className="flex items-center justify-end gap-2 px-3 py-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => handlePageChange(pageNo - 1)}
          disabled={pageNo === 1}
        >
          Previous
        </Button>

        <span className="inline-flex items-center justify-center h-8 px-3 leading-none text-sm text-gray-600">
          Page {pageNo} of {Math.max(1, Math.ceil(totalRecords / limit))}
        </span>

        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => handlePageChange(pageNo + 1)}
          disabled={pageNo >= Math.max(1, Math.ceil(totalRecords / limit))}
        >
          Next
        </Button>
      </div>

    </>
  );
};

/* ----------------- Small Chooser Modal (inline) ----------------- */
function ChooserModal({
  onClose,
  onPickBulk,
  onPickSingle,
}: {
  onClose: () => void;
  onPickBulk: () => void;
  onPickSingle: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[999]">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
          <div className="px-5 py-4 border-b">
            <h3 className="text-lg font-semibold">Add Items</h3>
            <p className="text-xs text-gray-500 mt-1">
              Choose how you want to add items to the in-room dining menu.
            </p>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bulk upload option */}
            <button
              onClick={onPickBulk}
              className="group flex flex-col items-start gap-3 rounded-xl border p-4 hover:border-gray-400 hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-lg p-2 bg-gray-100">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <span className="font-medium">Bulk upload (CSV)</span>
              </div>
              <p className="text-sm text-gray-600 text-left">
                Upload a CSV file and add multiple products in one go.
              </p>
              <div className="mt-auto w-full flex justify-end opacity-60 group-hover:opacity-100">
                <ChevronRight className="h-4 w-4" />
              </div>
            </button>

            {/* Single item option */}
            <button
              onClick={onPickSingle}
              className="group flex flex-col items-start gap-3 rounded-xl border p-4 hover:border-gray-400 hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-lg p-2 bg-gray-100">
                  <FilePlus2 className="h-6 w-6" />
                </div>
                <span className="font-medium">Add single item</span>
              </div>
              <p className="text-sm text-gray-600 text-left">
                Fill a small form to add one product with image.
              </p>
              <div className="mt-auto w-full flex justify-end opacity-60 group-hover:opacity-100">
                <ChevronRight className="h-4 w-4" />
              </div>
            </button>
          </div>

          <div className="px-5 py-4 border-t flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
