'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ToggleButton from '@/components/ui/toggleButton';
import apiCall from '@/lib/axios';
import AssignModal from '@/components/shared/AssignModal';

type Guest = {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: number;
};

type AssignedTo = {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
};

type Feedback = {
  serviceFeedback: string;
  serviceRating: number;
  agentFeedback: string;
  agentRating: number;
};

type SwimmingPoolRequest = {
  _id: string;
  paymentStatus: string;
  uniqueId?: string;
  guest: Guest;
  status: string;
  requestDetail: string;
  feedback?: Feedback;
  ratingByGuest?: number;
  assignedTo?: AssignedTo;
  bookingDate: string;
  startTime: string;
  endTime: string;
  requestTime: string;
  estimatedDeliveryTime?: string;
  paymentMode?: string;
};

type Props = {
  serviceID: string;
};

const SwimmingPoolRequestDetail: React.FC<Props> = ({ serviceID }) => {
  const [data, setData] = useState<SwimmingPoolRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentMode, setShowPaymentMode] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await apiCall(
          'GET',
          `/api/services/swimming-pool/requests/${serviceID}`
        );
        console.log(res);
        if (res.success) setData(res.data);
      } catch (error) {
        console.error('Error fetching request:', error);
      } finally {
        setLoading(false);
      }
    };
    if (serviceID) fetchRequest();
  }, [serviceID]);

  if (loading) return <div className="mt-28 p-4">Loading...</div>;
  if (!data) return <div className="mt-28 p-4">Request not found.</div>;

  const StarRating: React.FC<{ rating?: number }> = ({ rating = 0 }) => {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);
    return (
      <div className="flex">
        {stars.map((n) => (
          <span
            key={n}
            className={n <= rating ? 'text-yellow-500' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-24 bg-[#FAF6EF] rounded-md shadow-custom px-6 py-8 flex font-medium flex-col gap-8 w-full mb-4">
      {/* Header */}
      <div className="flex gap-12 text-lg opacity-75">
        <p>Unique ID: {data.uniqueId}</p>
      </div>

      {/* Details */}
      <div className="space-y-10">
        <div className="space-y-8">
          <div className="flex flex-wrap gap-8">
            <Detail
              label="Guest Name"
              value={`${data.guest.firstName} ${data.guest.lastName}`}
            />
            <Detail label="Phone No." value={`${data.guest.phoneNumber}`} />
            <Detail
              label="Booking Date"
              value={new Date(data.bookingDate).toLocaleDateString()}
            />
            <Detail
              label="Time Slot"
              value={`${data.startTime} - ${data.endTime}`}
            />
          </div>
        </div>

        <div className="flex gap-8">
          <TextBlock label="Request Status" value={data.status} />
        </div>

        <div className="flex gap-8">
          {/* Clickable Assigned To */}
          {/* <div
            onClick={() => setIsAssignModalOpen(true)}
            className="cursor-pointer w-full max-w-md"
          >
            <TextBlock
              label="Assigned To"
              value={
                data.assignedTo
                  ? `${data.assignedTo.firstName} ${data.assignedTo.lastName} (${data.assignedTo.mobileNumber})`
                  : 'Unassigned'
              }
            />
          </div> */}
          <div className="flex flex-col gap-2 items-start text-sm w-full max-w-md">
            <span className="opacity-75">Assigned To</span>
            <button
              type="button"
              className="w-full rounded-md border border-[#5a4118] bg-[#6E511D] px-6 py-2 text-left text-white shadow-sm transition-colors hover:bg-[#5f441b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A07C3E]"
              onClick={() => setIsAssignModalOpen(true)}
            >
              {data.assignedTo
                ? `${data.assignedTo.firstName} ${data.assignedTo.lastName} (${data.assignedTo.mobileNumber})`
                : 'Unassigned'}
            </button>
          </div>

          <TextBlock
            label="Estimated Service Completion Time"
            value={
              data.estimatedDeliveryTime
                ? new Date(data.estimatedDeliveryTime).toLocaleString()
                : 'N/A'
            }
          />
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col gap-2 text-sm">
            <span className="flex gap-4 items-center">
              <p>Payment Status</p>
            </span>
            <span className="bg-[#F6EEE0] rounded-md px-10 py-1">
              {data.paymentStatus}
            </span>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <span className="flex gap-4 items-center">
              <p>Payment Mode</p>
            </span>
            <span className="bg-[#F6EEE0] rounded-md px-10 py-1">
              {data.paymentMode}
            </span>
          </div>
        </div>
      </div>

      {/* Guest Feedback + Rating (side-by-side) */}
      <div className="rounded-lg border border-[#E4D7C4] bg-[#FAF6EF] p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Service Feedback */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-medium text-gray-700 shrink-0 w-32">
              Service Feedback
            </span>
            <span className="bg-[#F6EEE0] text-gray-700 rounded-md px-4 py-2 shadow-md inline-block max-w-full">
              {data.feedback?.serviceFeedback || 'No Feedback'}
            </span>
            <div className="ml-4">
              <StarRating rating={data.feedback?.serviceRating} />
            </div>
          </div>

          {/* Agent Feedback */}
          <div className="flex items-center gap-3 md:ml-auto">
            <span className="font-medium text-gray-700 shrink-0 w-32">
              Agent Feedback
            </span>
            <span className="bg-[#F6EEE0] text-gray-700 rounded-md px-4 py-2 shadow-md inline-block max-w-full">
              {data.feedback?.agentFeedback || 'No Feedback'}
            </span>
            <div className="ml-4">
              <StarRating rating={data.feedback?.agentRating} />
            </div>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <AssignModal
        onClose={() => setIsAssignModalOpen(false)}
        requestId={isAssignModalOpen ? data._id : undefined}
        title="Assign Swimming Pool Request"
        moduleName="swimmingpool"
      />
    </div>
  );
};

// Reusable Components
const Detail = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex gap-2 items-center text-sm">
    <span className="opacity-75">{label}</span>
    <span className="bg-[#F6EEE0] rounded-md px-6 py-1">{value}</span>
  </div>
);

const TextBlock = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex flex-col gap-2 items-start text-sm w-full max-w-md">
    <span className="opacity-75">{label}</span>
    <span className="bg-[#F6EEE0] w-full rounded-md px-6 py-2 hover:opacity-90 transition">
      {value}
    </span>
  </div>
);

export default SwimmingPoolRequestDetail;
