'use client';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CreateCouponForm from '@/components/shared/coupon-refund-management/create-coupon-form';

const EditCouponPage = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="w-full flex justify-center pt-6 mt-16">
        <CreateCouponForm mode="edit" couponId={id as string} />
      </div>
    </div>
  );
};

export default EditCouponPage;
