// 'use client';

// import Navbar from '@/components/Navbar';
// import Image from 'next/image';
// import ToggleButton from '@/components/ui/toggleButton';
// import { Heading } from '@/components/ui/heading';
// import Link from 'next/link';

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
//           <div
//             className={`flex flex-col gap-2 group cursor-pointer
//               `}
//           >
//             <div>
//               <Link
//             href="/super-admin/analytics-reports/admin"
//             className="flex flex-col gap-2 group cursor-pointer"
//           >
//             <div>
//               <Image
//                 src="/sales.png"
//                 alt="Sales"
//                 height={1000}
//                 width={1000}
//                 quality={100}
//               />
//             </div>
//             <div className="w-full flex justify-between items-center">
//               <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
//                 ADMIN REPORTS
//               </h2>
//             </div>
//           </Link>
//             </div>
//           </div>
//           <div
//             className={`flex flex-col gap-2 group cursor-pointer
//               `}
//           >
//             <div>
//                  <Link
//             href="/super-admin/analytics-reports/complaints"
//             className="flex flex-col gap-2 group cursor-pointer"
//           >
//             <div>
//               <Image
//                 src="/sales.png"
//                 alt="Sales"
//                 height={1000}
//                 width={1000}
//                 quality={100}
//               />
//             </div>
//             <div className="w-full flex justify-between items-center">
//               <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
//                 COMPLAINT REPORTS
//               </h2>
//             </div>
//           </Link>
//             </div>
//           </div>
//           <div
//             className={`flex flex-col gap-2 group cursor-pointer
//               `}
//           >
//             <div>
//                      <Link
//             href="/super-admin/analytics-reports/coupon"
//             className="flex flex-col gap-2 group cursor-pointer"
//           >
//             <div>
//               <Image
//                 src="/sales.png"
//                 alt="Sales"
//                 height={1000}
//                 width={1000}
//                 quality={100}
//               />
//             </div>
//             <div className="w-full flex justify-between items-center">
//               <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
//                 COUPON REPORTS
//               </h2>
//             </div>
//           </Link>
//             </div>
//           </div>
//           <div
//             className={`flex flex-col gap-2 group cursor-pointer
//               `}
//           >
//             <div>
//                        <Link
//             href="/super-admin/analytics-reports/refund"
//             className="flex flex-col gap-2 group cursor-pointer"
//           >
//             <div>
//               <Image
//                 src="/sales.png"
//                 alt="Sales"
//                 height={1000}
//                 width={1000}
//                 quality={100}
//               />
//             </div>
//             <div className="w-full flex justify-between items-center">
//               <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
//                 REFUND REPORTS
//               </h2>
//             </div>
//           </Link>
//             </div>

//           </div>
//                        <Link
//             href="/super-admin/analytics-reports/hotels"
//             className="flex flex-col gap-2 group cursor-pointer"
//           >
//             <div>
//               <Image
//                 src="/sales.png"
//                 alt="Sales"
//                 height={1000}
//                 width={1000}
//                 quality={100}
//               />
//             </div>
//             <div className="w-full flex justify-between items-center">
//               <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
//                 HOTELS REPORTS
//               </h2>
//             </div>
//           </Link>

//                         <Link
//             href="/super-admin/analytics-reports/hotels"
//             className="flex flex-col gap-2 group cursor-pointer"
//           >
//             <div>
//               <Image
//                 src="/sales.png"
//                 alt="Sales"
//                 height={1000}
//                 width={1000}
//                 quality={100}
//               />
//             </div>
//             <div className="w-full flex justify-between items-center">
//               <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
//                 PAYMENT REPORTS
//               </h2>
//             </div>
//           </Link>
//                          <Link
//             href="/super-admin/analytics-reports/bookings"
//             className="flex flex-col gap-2 group cursor-pointer"
//           >
//             <div>
//               <Image
//                 src="/sales.png"
//                 alt="Sales"
//                 height={1000}
//                 width={1000}
//                 quality={100}
//               />
//             </div>
//             <div className="w-full flex justify-between items-center">
//               <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
//                 BOOKING REPORTS
//               </h2>
//             </div>
//           </Link>
//                          <Link
//             href="/super-admin/analytics-reports/subscription"
//             className="flex flex-col gap-2 group cursor-pointer"
//           >
//             <div>
//               <Image
//                 src="/sales.png"
//                 alt="Sales"
//                 height={1000}
//                 width={1000}
//                 quality={100}
//               />
//             </div>
//             <div className="w-full flex justify-between items-center">
//               <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
//                 SUBSCRIPTION REPORTS
//               </h2>
//             </div>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalyticsReportsPage;
'use client';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { Heading } from '@/components/ui/heading';
import { Download } from 'lucide-react';

function ReportCard({
  href,
  title,
  imgSrc
}: {
  href: string;
  title: string;
  imgSrc: string;
}) {
  // const onDownload = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   // open in a new tab so the PDF can export and the user stays on the grid
  //   window.open(`${href}?export=pdf`, '_blank', 'noopener,noreferrer');
  // };

  return (
    <div className="group relative flex flex-col gap-2 cursor-pointer">
      <Link href={href} className="flex flex-col gap-2">
        <div className="relative overflow-hidden rounded-xl">
          <Image
            src={imgSrc}
            alt={title}
            height={1000}
            width={1000}
            quality={100}
            className="transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Hover overlay download button */}
          {/* <button
          
            className="
              absolute right-2 top-2 opacity-0 group-hover:opacity-100
              transition-opacity duration-200
              rounded-full bg-black/60 hover:bg-black/80
              p-2 text-white shadow
            "
            aria-label={`Download ${title} PDF`}
            title={`Download ${title} PDF`}
          >
            <Download className="h-4 w-4" />
          </button> */}
        </div>

        <div className="w-full flex justify-between items-center">
          <h2 className="px-2 py-1 text-sm rounded-lg group-hover:bg-[#453519] group-hover:text-white transition-all duration-300">
            {title.toUpperCase()}
          </h2>
        </div>
      </Link>
    </div>
  );
}

export default function AnalyticsReportsPage() {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="overflow-hidden flex flex-col justify-evenly py-4 mt-20">
        <Heading
          title="Analytics and Reports"
          className="px-6 mt-0 md:mt-0 md:py-0"
        />

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          <ReportCard
            href="/super-admin/analytics-reports/admin"
            title="Admin Reports"
            imgSrc="/sales.png"
          />

          <ReportCard
            href="/super-admin/analytics-reports/complaints"
            title="Complaint Reports"
            imgSrc="/sales.png"
          />

          <ReportCard
            href="/super-admin/analytics-reports/coupon" // or /coupons if your route is plural
            title="Coupon Reports"
            imgSrc="/sales.png"
          />

          <ReportCard
            href="/super-admin/analytics-reports/refund"
            title="Refund Reports"
            imgSrc="/sales.png"
          />

          <ReportCard
            href="/super-admin/analytics-reports/hotels"
            title="Hotels Reports"
            imgSrc="/sales.png"
          />

          <ReportCard
            href="/super-admin/analytics-reports/payment" // fix: your original had hotels twice
            title="Payment Reports"
            imgSrc="/sales.png"
          />

          <ReportCard
            href="/super-admin/analytics-reports/bookings"
            title="Booking Reports"
            imgSrc="/sales.png"
          />

          <ReportCard
            href="/super-admin/analytics-reports/subscription" // or /subscriptions if plural
            title="Subscription Reports"
            imgSrc="/sales.png"
          />
        </div>
      </div>
    </div>
  );
}
