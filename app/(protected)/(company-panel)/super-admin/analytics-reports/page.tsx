














































































































































































































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

          {}
          {}
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
            href="/super-admin/analytics-reports/coupon" 
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
            href="/super-admin/analytics-reports/payment" 
            title="Payment Reports"
            imgSrc="/sales.png"
          />

          <ReportCard
            href="/super-admin/analytics-reports/bookings"
            title="Booking Reports"
            imgSrc="/sales.png"
          />

          <ReportCard
            href="/super-admin/analytics-reports/subscription" 
            title="Subscription Reports"
            imgSrc="/sales.png"
          />
        </div>
      </div>
    </div>
  );
}
