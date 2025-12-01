// 'use client';

// import Navbar from '@/components/Navbar';
// import Image from 'next/image';
// import { Heading } from '@/components/ui/heading';

// const AnalyticsReportsPage = () => {
//   return (
//     <div className="flex flex-col w-full">
//       <Navbar />
//       <div className="overflow-hidden flex flex-col justify-evenly py-4 mt-20">
//         <Heading
//           title="Analytics and Reports"
//           className="px-6 mt-0 md:mt-0 md:py-0"
//         />
//         <div className="w-full grid grid-cols-4 gap-8 px-6">
//           {/* Sales Card */}
//           <div className="flex flex-col gap-2 group cursor-pointer">
//             <div>
//               <Image
//                 src={'/sales.png'}
//                 alt="Sales"
//                 height={1000}
//                 width={1000}
//                 quality={100}
//               />
//             </div>
//             <div className="w-full flex justify-between items-center">
//               <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
//                 EMPLOYEE REPORTS
//               </h2>
//             </div>
//           </div>

//           {/* Housekeeping Reports */}
//           <div className="flex flex-col gap-2 group cursor-pointer">
//             <div>
//               <Image
//                 src={'/homekeeper.png'}
//                 alt="Housekeeping"
//                 height={1000}
//                 width={1000}
//                 quality={100}
//               />
//             </div>
//             <div className="w-full flex justify-between items-center">
//               <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
//                 HOUSEKEEPING REPORTS
//               </h2>
//             </div>
//           </div>

//           {/* Financial Reports */}
//           <div className="flex flex-col gap-2 group cursor-pointer">
//             <div>
//               <Image
//                 src={'/finanace.png'}
//                 alt="Finance"
//                 height={1000}
//                 width={1000}
//                 quality={100}
//               />
//             </div>
//             <div className="w-full flex justify-between items-center">
//               <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
//                 FINANCIAL REPORTS
//               </h2>
//             </div>
//           </div>

//           {/* Customer Analytics */}
//           <div className="flex flex-col gap-2 group cursor-pointer">
//             <div>
//               <Image
//                 src={'/customer.png'}
//                 alt="Customer"
//                 height={1000}
//                 width={1000}
//                 quality={100}
//               />
//             </div>
//             <div className="w-full flex justify-between items-center">
//               <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
//                 CUSTOMER ANALYTICS
//               </h2>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalyticsReportsPage;
// app/analytics-reports/page.tsx (or wherever your AnalyticsReportsPage lives)
'use client';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';

const AnalyticsReportsPage = () => {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="overflow-hidden flex flex-col justify-evenly py-4 mt-20">
        <Heading
          title="Analytics and Reports"
          className="px-6 mt-0 md:mt-0 md:py-0"
        />

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          {/* Employee Reports */}
          <Link
            href="/hotel-panel/analytics-reports/employees"
            className="flex flex-col gap-2 group cursor-pointer"
          >
            <div>
              <Image
                src="/sales.png"
                alt="Sales"
                height={1000}
                width={1000}
                quality={100}
              />
            </div>
            <div className="w-full flex justify-between items-center">
              <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
                EMPLOYEE REPORTS
              </h2>
            </div>
          </Link>

          {/* Housekeeping Reports */}
          <div className="flex flex-col gap-2 group cursor-pointer">
            <Link
              href="/hotel-panel/analytics-reports/coupons"
              className="flex flex-col gap-2 group cursor-pointer"
            >
              <div>
                <Image
                  src="/homekeeper.png"
                  alt="Housekeeping"
                  height={1000}
                  width={1000}
                  quality={100}
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
                  COUPON REPORTS
                </h2>
              </div>
            </Link>
          </div>

          {/* Financial Reports */}
          <div className="flex flex-col gap-2 group cursor-pointer">
            <Link
              href="/hotel-panel/analytics-reports/bookings"
              className="flex flex-col gap-2 group cursor-pointer"
            >
              <div>
                <Image
                  src="/finanace.png"
                  alt="Finance"
                  height={1000}
                  width={1000}
                  quality={100}
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
                  BOOKING REPORTS
                </h2>
              </div>
            </Link>
          </div>

          {/* Customer Analytics */}
          <div className="flex flex-col gap-2 group cursor-pointer">
            <Link
              href="/hotel-panel/analytics-reports/complaints"
              className="flex flex-col gap-2 group cursor-pointer"
            >
              <div>
                <Image
                  src="/customer.png"
                  alt="Customer"
                  height={1000}
                  width={1000}
                  quality={100}
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
                  COMPLAINT REPORTS
                </h2>
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-2 group cursor-pointer">
            <Link
              href="/hotel-panel/analytics-reports/services"
              className="flex flex-col gap-2 group cursor-pointer"
            >
              <div>
                <Image
                  src="/customer.png"
                  alt="Customer"
                  height={1000}
                  width={1000}
                  quality={100}
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
                  SERVICE REPORTS
                </h2>
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-2 group cursor-pointer">
            <Link
              href="/hotel-panel/analytics-reports/payment"
              className="flex flex-col gap-2 group cursor-pointer"
            >
              <div>
                <Image
                  src="/customer.png"
                  alt="Customer"
                  height={1000}
                  width={1000}
                  quality={100}
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
                  PAYMENT REPORTS
                </h2>
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-2 group cursor-pointer">
            <Link
              href="/hotel-panel/analytics-reports/refund"
              className="flex flex-col gap-2 group cursor-pointer"
            >
              <div>
                <Image
                  src="/customer.png"
                  alt="Customer"
                  height={1000}
                  width={1000}
                  quality={100}
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
                  REFUND REPORTS
                </h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReportsPage;
