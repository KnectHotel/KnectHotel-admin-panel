'use client';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CreateCouponForm from '@/components/shared/coupon-refund-management/create-coupon-form';

const ViewCouponPage = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="w-full flex justify-center pt-6 mt-20">
        <CreateCouponForm mode="view" couponId={id as string} />
      </div>
    </div>
  );
};

export default ViewCouponPage;
