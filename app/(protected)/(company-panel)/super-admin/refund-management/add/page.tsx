import Navbar from '@/components/Navbar';
import CreateRefundForm from '@/components/shared/coupon-refund-management/create-refund-form';

const CreateRefundPage = () => {
  return (
    <>
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="w-full flex justify-center pt-6 mt-20">
          <CreateRefundForm mode="create" isHotel={false} isLoading={false} />
        </div>
      </div>
    </>
  );
};

export default CreateRefundPage;
