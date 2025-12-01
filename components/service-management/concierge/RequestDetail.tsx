'use client';

import React, { useEffect, useState } from 'react';
import apiCall from '@/lib/axios';
import AssignModal from '@/components/shared/AssignModal';
import Image from 'next/image';

/* ---------- Image helpers (URL or S3 Key → URL) ---------- */
const S3_BASE = 'https://dibstestbucket0403.s3.ap-south-1.amazonaws.com';
const FALLBACK = '/fallback.png';

const keyToUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${S3_BASE}/${value.replace(/^\/+/, '')}`;
};
const resolveImage = (value?: string | null) => keyToUrl(value) || FALLBACK;
/* -------------------------------------------------------- */

type ConciergeRequestDetail = {
  _id: string;
  uniqueId: string;
  requestDetail: string;
  responseDetail?: string;
  requestAssignedTo?: string;
  effectiveCost?: string;
  requestedTimeSlot?: string;
  requestedVenue?: string;
  paymentStatus: string;
  requestType: string;
  status: string;
  requestTime: string;
  estimatedDeliveryTime?: string; // present in your sample
  roomNumber?: string; // present in your sample

  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    mobileNumber?: string; // your sample uses mobileNumber
  };

  guest: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    assignedRoomNumber?: string;
  };

  conciergeItem?: {
    _id: string;
    name: string;
    description: string;
    category: string;
    serviceType?: string;
    location?: string;
    distance?: number;
    imageUrl?: string | null; // may be URL or S3 key
  };

  feedback?: {
    serviceFeedback?: string;
    serviceRating?: number;
    agentFeedback?: string;
    agentRating?: number;
  };
};

type Props = {
  serviceID: string;
};

const InfoPill = ({
  label,
  value
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs uppercase tracking-wide text-[#6a5a45]/70">
      {label}
    </span>
    <span className="bg-[#F6EEE0] text-[#3E3428] rounded-md px-4 py-2 shadow-sm">
      {value ?? 'N/A'}
    </span>
  </div>
);

const TextBlock = ({
  label,
  value
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs uppercase tracking-wide text-[#6a5a45]/70">
      {label}
    </span>
    <div className="bg-[#F6EEE0] text-[#3E3428] rounded-md px-4 py-3 leading-relaxed shadow-sm">
      {value ?? '-'}
    </div>
  </div>
);

const StarRating: React.FC<{ rating?: number }> = ({ rating = 0 }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex gap-1 text-lg leading-none">
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

const fmtDateTime = (d?: string) => (d ? new Date(d).toLocaleString() : 'N/A');

const ConciergeServiceRequestDetail: React.FC<Props> = ({ serviceID }) => {
  const [request, setRequest] = useState<ConciergeRequestDetail | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const res = await apiCall(
          'get',
          `/api/services/concierge/requests/${serviceID}`
        );
        console.log(res);
        if (res?.success) setRequest(res.data);
      } catch (err) {
        console.error('Failed to fetch request details', err);
      } finally {
        setLoading(false);
      }
    };
    if (serviceID) fetchRequest();
  }, [serviceID]);

  if (loading)
    return <div className="mt-24 text-center text-gray-600">Loading…</div>;
  if (!request)
    return (
      <div className="mt-24 text-center text-red-600">Request not found</div>
    );

  const guestName =
    `${request.guest?.firstName || ''} ${request.guest?.lastName || ''}`.trim() ||
    'N/A';

  const assignedTo = request.assignedTo?.firstName
    ? `${request.assignedTo.firstName} ${request.assignedTo.lastName}`
    : 'Unassigned';

  const assignedToPhone =
    request.assignedTo?.mobileNumber ||
    request.assignedTo?.phoneNumber ||
    'N/A';

  const requestTimeStr = fmtDateTime(request.requestTime);
  const etaStr = fmtDateTime(request.estimatedDeliveryTime);

  const itemImg = resolveImage(request.conciergeItem?.imageUrl);

  return (
    <>
      <div className="mt-24 w-full">
        {/* Card wrapper */}
        <div className="mx-auto max-w-6xl bg-[#FAF6EF] rounded-2xl border border-[#E6D6C2] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6D6C2]">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded bg-[#7A5C3E]" />
              <h1 className="text-lg md:text-xl font-semibold tracking-tight text-[#3E3428]">
                Concierge Request
              </h1>
            </div>
            <div className="flex items-center gap-6 text-sm md:text-base text-[#6a5a45]">
              <span>
                Request ID:&nbsp;
                <span className="font-medium">{request.uniqueId || 'N/A'}</span>
              </span>
              <span className="capitalize">
                Status:&nbsp;
                <span className="font-medium">{request.status || 'N/A'}</span>
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-8 grid gap-10">
            {/* Top row: guest quick info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InfoPill label="Guest name" value={guestName} />
              <InfoPill
                label="Mobile number"
                value={request.guest?.phoneNumber || 'N/A'}
              />
              <InfoPill
                label="Room No."
                value={
                  request.roomNumber ||
                  request.guest?.assignedRoomNumber ||
                  'N/A'
                }
              />
              <InfoPill
                label="Payment Status"
                value={
                  <span
                    className={
                      request.paymentStatus?.toLowerCase() === 'paid'
                        ? 'text-green-700 font-medium'
                        : 'text-red-600 font-medium'
                    }
                  >
                    {request.paymentStatus || 'N/A'}
                  </span>
                }
              />
            </div>

            {/* Middle: request meta */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Col 1 */}
              <div className="grid gap-6">
                <TextBlock
                  label="Request Detail"
                  value={request.requestDetail || '-'}
                />
                <InfoPill
                  label="Request Type"
                  value={request.requestType || 'N/A'}
                />
              </div>

              {/* Col 2 */}
              <div className="grid gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wide text-[#6a5a45]/70">
                    Request Assigned to
                  </span>
                  {/* <button
                    className="bg-[#F6EEE0] hover:bg-[#F0E6D6] text-[#3E3428] transition-colors rounded-md px-4 py-2 shadow-sm text-left"
                    onClick={() => setIsAssignModalOpen(true)}
                  >
                    {assignedTo}
                    {assignedTo !== 'Unassigned' && (
                      <span className="ml-2 text-[#6a5a45]/80 text-sm">
                        ({assignedToPhone})
                      </span>
                    )}
                  </button> */}
                  <button
                    type="button"
                    className="bg-[#6E511D] border border-[#5a4118] hover:bg-[#5f441b] text-white transition-colors rounded-md px-4 py-2 shadow-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A07C3E]"
                    onClick={() => setIsAssignModalOpen(true)}
                  >
                    {assignedTo}
                    {assignedTo !== 'Unassigned' && (
                      <span className="ml-2 text-white/80 text-sm">
                        ({assignedToPhone})
                      </span>
                    )}
                  </button>
                </div>
                <InfoPill
                  label="Effective Cost"
                  value={request.effectiveCost || 'Not Set'}
                />
              </div>

              {/* Col 3 */}
              <div className="grid gap-6">
                <InfoPill label="Requested Time" value={requestTimeStr} />
                <InfoPill
                  label="Estimated Service Completion Time"
                  value={etaStr}
                />
              </div>
            </div>

            {/* Concierge Item section */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoPill
                  label="Concierge Item"
                  value={request.conciergeItem?.name || 'N/A'}
                />
                <InfoPill
                  label="Location"
                  value={request.conciergeItem?.location || 'N/A'}
                />
                <InfoPill
                  label="Category"
                  value={request.conciergeItem?.category || 'N/A'}
                />
                <InfoPill
                  label="Distance"
                  value={
                    request.conciergeItem?.distance != null
                      ? `${request.conciergeItem.distance} km`
                      : 'N/A'
                  }
                />
                <TextBlock
                  label="Description"
                  value={request.conciergeItem?.description?.trim() || 'N/A'}
                />
              </div>

              {/* Image */}
              {/* <div className="bg-[#FFF9F0] rounded-xl p-3 border border-[#E6D6C2] shadow-inner">
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={itemImg}
                    alt={request.conciergeItem?.name || 'Concierge item'}
                    fill
                    sizes="(max-width: 1024px) 100vw, 280px"
                    className="object-cover"
                  />
                </div>
              </div> */}
            </div>

            {/* Guest Feedback (same pattern as Spa/Salon) */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Guest Feedback
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mt-2">
                {/* Service Feedback */}
                <div className="bg-[#FAF6EF] p-4 rounded-lg shadow-sm">
                  <h4 className="text-gray-600 font-medium mb-2">
                    Service Feedback
                  </h4>
                  <p className="mb-2">
                    {request.feedback?.serviceFeedback || 'No feedback'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Rating:</span>
                    <StarRating rating={request.feedback?.serviceRating || 0} />
                  </div>
                </div>

                {/* Agent Feedback */}
                <div className="bg-[#FAF6EF] p-4 rounded-lg shadow-sm">
                  <h4 className="text-gray-600 font-medium mb-2">
                    Agent Feedback
                  </h4>
                  <p className="mb-2">
                    {request.feedback?.agentFeedback || 'No feedback'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Rating:</span>
                    <StarRating rating={request.feedback?.agentRating || 0} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>

      {/* Assign Modal */}
      <AssignModal
        onClose={() => setIsAssignModalOpen(false)}
        requestId={isAssignModalOpen ? serviceID : undefined}
        title="Assign Request to Employee"
        moduleName="conciergeservice"
      />
    </>
  );
};

export default ConciergeServiceRequestDetail;
