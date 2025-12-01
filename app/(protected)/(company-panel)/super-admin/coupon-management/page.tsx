// 'use client';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import React, { useEffect, useState } from 'react';
// import { Eye, SquarePen, Trash2 } from 'lucide-react';
// import { Heading } from '@/components/ui/heading';
// import { useRouter } from 'next/navigation';
// import apiCall from '@/lib/axios';
// import Navbar from '@/components/Navbar';
// import { AlertModal } from '@/components/modal/alert-modal';

// interface Coupon {
//   _id: string;
//   code: string;
//   scope: string;
//   discountType: 'percentage' | 'fixed';
//   value: number;
//   minimumSpend: number;
//   applicableFor: string;
//   validFrom: string;
//   validUntil: string;
//   status: string;
//   usageLimit: number;
//   perUserLimit: number;
//   stockable: boolean;
//   HotelId: string;
//   imageUrl: string;
//   termsAndConditions: string;
//   usedBy: any[];
//   createdAt: string;
//   updatedAt: string;
// }

// const CouponManagement = () => {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const [coupons, setCoupons] = useState<Coupon[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [deleteCouponId, setDeleteCouponId] = useState<string | null>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   const fetchCoupons = async () => {
//     try {
//       const response = await apiCall<{ success: boolean; coupons: Coupon[] }>(
//         'GET',
//         'api/coupon'
//       );
//       if (response.success) {
//         setCoupons(response.coupons);
//       }
//     } catch (error) {
//       console.error('Error fetching coupons:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const percentageCoupons = coupons.filter(
//     (coupon) => coupon.discountType === 'percentage'
//   );
//   const fixedAmountCoupons = coupons.filter(
//     (coupon) => coupon.discountType === 'fixed'
//   );

//   const handleDeleteCoupon = async () => {
//     if (!deleteCouponId) return;
//     setDeleteLoading(true);
//     try {
//       await apiCall('DELETE', `api/coupon/${deleteCouponId}`);
//       setCoupons((prev) => prev.filter((c) => c._id !== deleteCouponId));
//       setShowDeleteModal(false);
//       setDeleteCouponId(null);
//     } catch (error) {
//       console.error('Failed to delete coupon:', error);
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col w-full">
//       <Navbar />
//       <div className="min-h-screen w-full flex justify-center pt-6 mt-12">
//         <div className="flex flex-col w-full gap-3 container">
//           <div className="flex justify-between items-center w-full">
//             <Heading title={`Coupon Management`} className="mt-0" />
//             <Button
//               onClick={() => router.push(`/super-admin/coupon-management/create`)}
//               className="btn-primary"
//             >
//               Create Coupon
//             </Button>
//           </div>
//           {/* Coupon Container */}
//           <div className="flex flex-col bg-[#FAF6EF] shadow-custom p-6 pb-10 w-full gap-8">
//             {/* Percentage coupons list */}
//             <div className="space-y-2">
//               <p className="inline-block font-medium text-lg">Percentage Coupons</p>
//               <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
//                 {isLoading ? (
//                   <p>Loading...</p>
//                 ) : percentageCoupons.length > 0 ? (
//                   percentageCoupons.map((coupon) => (
//                     <div
//                       key={coupon._id}
//                       className="relative h-36 rounded-lg bg-white shadow"
//                     >
//                       {/* <Image
//                         src={coupon.imageUrl || '/placeholder-coupon.png'}
//                         alt={`${coupon.code} coupon`}
//                         fill
//                         className="object-cover rounded-t-lg"
//                         onError={(e) => {
//                           const target = e.target as HTMLImageElement;
//                           target.src = '/placeholder-coupon.png';
//                         }}
//                       /> */}
//                       <div className="absolute bottom-0 left-0 right-0 bg-[#281F0F] text-white rounded-b-lg">
//                         <div className="p-2 pb-4 flex-col gap-1">
//                           <h4 className="text-sm font-semibold">{coupon.code}</h4>
//                           <p className="text-[0.7rem] opacity-70">{coupon.value}% off</p>
//                         </div>
//                       </div>
//                       <div className="absolute w-full -bottom-8 flex justify-between items-center px-4">
//                         <button
//                           onClick={() =>
//                             router.push(
//                               `/super-admin/coupon-management/view/${coupon._id}`
//                             )
//                           }
//                           className="rounded-md  hover:bg-[#e6dcc4] p-1"
//                         >
//                           <Eye className="h-4 w-4 text-black" />
//                         </button>
//                         <SquarePen
//                           className="h-4 w-4 cursor-pointer"
//                           onClick={() => router.push(`/super-admin/coupon-management/edit/${coupon._id}`)}
//                         />
//                         <Trash2
//                           className="h-4 w-4 cursor-pointer"
//                           onClick={() => {
//                             setDeleteCouponId(coupon._id);
//                             setShowDeleteModal(true);
//                           }}
//                         />
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <></>
//                 )}
//               </div>
//             </div>
//             {/* Fixed amount coupons list */}
//             <div className="space-y-2 mt-8">
//               <p className="inline-block font-medium text-lg">Fixed Amount Coupons</p>
//               <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
//                 {isLoading ? (
//                   <p>Loading...</p>
//                 ) : fixedAmountCoupons.length > 0 ? (
//                   fixedAmountCoupons.map((coupon) => (
//                     <div
//                       key={coupon._id}
//                       className="relative h-36 rounded-lg bg-white shadow"
//                     >
//                       {/* <Image
//                         src={coupon.imageUrl || '/placeholder-coupon.png'}
//                         alt={`${coupon.code} coupon`}
//                         fill
//                         className="object-cover rounded-t-lg"
//                         onError={(e) => {
//                           const target = e.target as HTMLImageElement;
//                           target.src = '/placeholder-coupon.png';
//                         }}
//                       /> */}
//                       <div className="absolute bottom-0 left-0 right-0 bg-[#281F0F] text-white rounded-b-lg">
//                         <div className="p-2 pb-4 flex-col gap-1">
//                           <h4 className="text-sm font-semibold">{coupon.code}</h4>
//                           <p className="text-[0.7rem] opacity-70">₹{coupon.value} off</p>
//                         </div>
//                       </div>
//                       <div className="absolute w-full -bottom-8 flex justify-between items-center px-4">
//                         <button
//                           onClick={() =>
//                             router.push(
//                               `/super-admin/coupon-management/view/${coupon._id}`
//                             )
//                           }
//                           className="rounded-md  hover:bg-[#e6dcc4] p-1"
//                         >
//                           <Eye className="h-4 w-4 text-black" />
//                         </button>
//                         <SquarePen
//                           className="h-4 w-4 cursor-pointer"
//                           onClick={() => router.push(`/super-admin/coupon-management/edit/${coupon._id}`)}
//                         />
//                         <Trash2
//                           className="h-4 w-4 cursor-pointer"
//                           onClick={() => {
//                             setDeleteCouponId(coupon._id);
//                             setShowDeleteModal(true);
//                           }}
//                         />
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <></>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Alert Modal for Delete Confirmation */}
//       <AlertModal
//         isOpen={showDeleteModal}
//         onCloseAction={() => {
//           setShowDeleteModal(false);
//           setDeleteCouponId(null);
//         }}
//         onConfirmAction={handleDeleteCoupon}
//         loading={deleteLoading}
//         title="Are you sure you want to delete?"
//         description="This action cannot be undone. The coupon will be permanently deleted."
//       />
//     </div>
//   );
// };

// export default CouponManagement;


'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Eye, SquarePen, Trash2 } from 'lucide-react';
import { Heading } from '@/components/ui/heading';
import { useRouter } from 'next/navigation';
import apiCall from '@/lib/axios';
import Navbar from '@/components/Navbar';
import { AlertModal } from '@/components/modal/alert-modal';

interface Coupon {
  _id: string;
  code: string;
  scope: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minimumSpend: number;
  applicableFor: string;
  validFrom: string;
  validUntil: string;
  status: string;
  usageLimit: number;
  perUserLimit: number;
  stockable: boolean;
  HotelId: string;
  imageUrl: string;
  termsAndConditions: string;
  usedBy: any[];
  createdAt: string;
  updatedAt: string;
}

const CouponManagement = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteCouponId, setDeleteCouponId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await apiCall<{ success: boolean; coupons: Coupon[] }>(
        'GET',
        'api/coupon'
      );
      if (response.success) {
        setCoupons(response.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const percentageCoupons = coupons.filter(
    (coupon) => coupon.discountType === 'percentage'
  );
  const fixedAmountCoupons = coupons.filter(
    (coupon) => coupon.discountType === 'fixed'
  );

  const handleDeleteCoupon = async () => {
    if (!deleteCouponId) return;
    setDeleteLoading(true);
    try {
      await apiCall('DELETE', `api/coupon/${deleteCouponId}`);
      setCoupons((prev) => prev.filter((c) => c._id !== deleteCouponId));
      setShowDeleteModal(false);
      setDeleteCouponId(null);
    } catch (error) {
      console.error('Failed to delete coupon:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="min-h-screen w-full flex justify-center pt-6 mt-12">
        <div className="flex flex-col w-full gap-3 container">
          <div className="flex justify-between items-center w-full">
            <Heading title={`Coupon Management`} className="mt-0" />
            <Button
              onClick={() => router.push(`/super-admin/coupon-management/create`)}
              className="btn-primary"
            >
              Create Coupon
            </Button>
          </div>
          {/* Coupon Container */}
          <div className="flex flex-col bg-[#FAF6EF] shadow-custom p-6 pb-10 w-full gap-8">
            {/* Percentage coupons list */}
            <div className="space-y-2">
              <p className="inline-block font-medium text-lg">Percentage Coupons</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 mb-4">
                {isLoading ? (
                  <p>Loading...</p>
                ) : percentageCoupons.length > 0 ? (
                  percentageCoupons.map((coupon) => (
                    <div
                      key={coupon._id}
                      className="relative h-36 rounded-lg bg-white shadow mb-8"
                    >
                      {/* Display the image */}
                      <Image
                        src={coupon.imageUrl || '/placeholder-coupon.png'}
                        alt={`${coupon.code} coupon`}
                        width={144}
                        height={144}
                        className="object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-coupon.png'; // Fallback image if there's an error loading the image
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-[#281F0F] text-white rounded-b-lg">
                        <div className="p-2 pb-4 flex-col gap-1">
                          <h4 className="text-sm font-semibold">{coupon.code}</h4>
                          <p className="text-[0.7rem] opacity-70">{coupon.value}% off</p>
                        </div>
                      </div>
                      <div className="absolute w-full -bottom-8 flex justify-between items-center px-4">
                        <button
                          onClick={() =>
                            router.push(
                              `/super-admin/coupon-management/view/${coupon._id}`
                            )
                          }
                          className="rounded-md hover:bg-[#e6dcc4] p-1"
                        >
                          <Eye className="h-4 w-4 text-black" />
                        </button>
                        <SquarePen
                          className="h-4 w-4 cursor-pointer"
                          onClick={() =>
                            router.push(`/super-admin/coupon-management/edit/${coupon._id}`)
                          }
                        />
                        <Trash2
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => {
                            setDeleteCouponId(coupon._id);
                            setShowDeleteModal(true);
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>
            {/* Fixed amount coupons list */}
            <div className="space-y-2 mt-8">
              <p className="inline-block font-medium text-lg">Fixed Amount Coupons</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 mb-4">
                {isLoading ? (
                  <p>Loading...</p>
                ) : fixedAmountCoupons.length > 0 ? (
                  fixedAmountCoupons.map((coupon) => (
                    <div
                      key={coupon._id}
                      className="relative h-36 rounded-lg bg-white shadow mb-8"
                    >
                      {/* Display the image */}
                      <Image
                        src={coupon.imageUrl || '/placeholder-coupon.png'}
                        alt={`${coupon.code} coupon`}
                        width={144}
                        height={144}
                        className="object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-coupon.png'; // Fallback image if there's an error loading the image
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-[#281F0F] text-white rounded-b-lg">
                        <div className="p-2 pb-4 flex-col gap-1">
                          <h4 className="text-sm font-semibold">{coupon.code}</h4>
                          <p className="text-[0.7rem] opacity-70">₹{coupon.value} off</p>
                        </div>
                      </div>
                      <div className="absolute w-full -bottom-8 flex justify-between items-center px-4">
                        <button
                          onClick={() =>
                            router.push(
                              `/super-admin/coupon-management/view/${coupon._id}`
                            )
                          }
                          className="rounded-md hover:bg-[#e6dcc4] p-1"
                        >
                          <Eye className="h-4 w-4 text-black" />
                        </button>
                        <SquarePen
                          className="h-4 w-4 cursor-pointer"
                          onClick={() =>
                            router.push(`/super-admin/coupon-management/edit/${coupon._id}`)
                          }
                        />
                        <Trash2
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => {
                            setDeleteCouponId(coupon._id);
                            setShowDeleteModal(true);
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Alert Modal for Delete Confirmation */}
      <AlertModal
        isOpen={showDeleteModal}
        onCloseAction={() => {
          setShowDeleteModal(false);
          setDeleteCouponId(null);
        }}
        onConfirmAction={handleDeleteCoupon}
        loading={deleteLoading}
        title="Are you sure you want to delete?"
        description="This action cannot be undone. The coupon will be permanently deleted."
      />
    </div>
  );
};

export default CouponManagement;
