























































































































































































































































'use client';

import React, { useEffect, useState } from 'react';
import apiCall from '@/lib/axios';
import AssignModal from '@/components/shared/AssignModal';

type Props<T> = {
  requestId: string;
  mode?: 'ordermanagement';
};

interface RequestData {
  _id: string;
  uniqueId?: string;
  status?: string;
  requestDetail?: string;
  facilityType?: string;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  requestType?: string;
  __t?: string;
  startTime?: string;
  endTime?: string;
  bookingDate?: string;
  requestTime?: string;

  assignedTo?: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
  };
  HotelId?: {
    _id: string;
    name: string;
    HotelId: string;
  };
  guest: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    assignedRoomNumber: string;
  };
  amount?: {
    subtotal: number;
    discount: number;
    finalAmount: number;
  };
  coupon?: {
    code: string;
    type: string;
    value: number;
  };
  orderedItems?: object[];
  paymentMode?: string;
  feedbackByGuest?: string;
  ratingByGuest?: number;
  specialInstructions?: string;
  transaction?: string;
  estimatedDeliveryTime?: string;
}


const fmtINR = (n?: number) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(n)
    : '—';

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleString() : 'N/A');

const statusTheme = (status?: string) => {
  const s = (status || '').toLowerCase();
  if (s.includes('pending'))
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      ring: 'ring-amber-200'
    };
  if (s.includes('accept') || s.includes('assigned'))
    return { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200' };
  if (s.includes('progress'))
    return { bg: 'bg-cyan-50', text: 'text-cyan-700', ring: 'ring-cyan-200' };
  if (s.includes('complete'))
    return {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      ring: 'ring-emerald-200'
    };
  if (s.includes('cancel'))
    return { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-200' };
  return { bg: 'bg-stone-100', text: 'text-stone-700', ring: 'ring-stone-200' };
};

const Chip = ({
  label,
  value,
  uppercase = false
}: {
  label?: string;
  value: string | React.ReactNode;
  uppercase?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    {label ? (
      <span className="text-[11px] uppercase tracking-wide text-[#6a5a45]/70">
        {label}
      </span>
    ) : null}
    <div className="inline-flex items-center gap-2 rounded-md bg-[#F6EEE0] px-3 py-2 text-sm text-[#3E3428] shadow-sm">
      {value}
    </div>
  </div>
);

const InfoCard = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-[#E6D6C2] bg-[#FAF6EF] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
    <div className="mb-3 flex items-center gap-3">
      <div className="h-5 w-1 rounded bg-[#7A5C3E]" />
      <h3 className="text-sm font-semibold tracking-tight text-[#3E3428]">
        {title}
      </h3>
    </div>
    <div className="grid gap-3">{children}</div>
  </div>
);


const OrderDetails = <T extends Record<string, any>>({
  requestId,
  mode = 'ordermanagement'
}: Props<T>) => {
  const [apiData, setApiData] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!requestId) return;
      setLoading(true);
      try {
        const result = await apiCall('GET', `api/services/order/${requestId}`);
        if (result.success) {
          setApiData(result.serviceRequests);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [requestId]);

  if (loading || !apiData) {
    return (
      <div className="mt-24 flex h-full items-center justify-center text-gray-600">
        Loading…
      </div>
    );
  }

  const st = statusTheme(apiData.status);

  return (
    <>
      <div className="mt-24 w-full">
        <div className="mx-auto max-w-6xl rounded-2xl border border-[#E6D6C2] bg-[#FAF6EF] shadow-[0_2px_20px_rgba(0,0,0,0.05)]">
          {}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6D6C2] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded bg-[#7A5C3E]" />
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold leading-tight tracking-tight text-[#3E3428]">
                  Order Details
                </h1>
                <span className="text-xs text-[#6a5a45]">
                  Ref:{' '}
                  <span className="font-medium">
                    {apiData.uniqueId || 'N/A'}
                  </span>
                </span>
              </div>
            </div>

            {}
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ring-1 ${st.bg} ${st.text} ${st.ring}`}
            >
              <span className="h-2 w-2 rounded-full bg-current opacity-70" />
              {apiData.status || 'Unknown'}
            </span>
          </div>

          {}
          <div className="grid gap-8 px-6 py-8">
            {}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Chip
                label="Hotel ID"
                value={apiData.HotelId?.HotelId || 'N/A'}
              />
              <Chip
                label="Service Type"
                value={
                  apiData.__t === 'FacilityRequest'
                    ? apiData.facilityType
                    : apiData.__t
                }
              />
              <Chip
                label="Payment Status"
                value={apiData.paymentStatus || 'N/A'}
              />
            </div>

            {}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <InfoCard title="Guest Information">
                <div className="rounded-lg bg-[#F6EEE0] p-4">
                  <div className="text-base font-semibold text-[#3E3428]">
                    {apiData.guest?.firstName} {apiData.guest?.lastName}
                  </div>
                  <div className="mt-1 text-sm text-[#3E3428]">
                    {apiData.guest?.phoneNumber}
                  </div>
                  <div className="mt-1 text-sm text-[#3E3428]">
                    {apiData.guest?.email}
                  </div>
                  <div className="mt-1 text-sm text-[#3E3428]">
                    {apiData.guest?.assignedRoomNumber}
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="Assignment">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] uppercase tracking-wide text-[#6a5a45]/70">
                    Assigned To
                  </span>
                  {}
                  <button
                    type="button"
                    className="w-full rounded-md border border-[#5a4118] bg-[#6E511D] px-4 py-2 text-left text-white shadow-sm transition-colors hover:bg-[#5f441b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A07C3E]"
                    onClick={() => setIsAssignModalOpen(true)}
                  >
                    {apiData?.assignedTo?.firstName
                      ? `${apiData.assignedTo.firstName} ${apiData.assignedTo.lastName} (${apiData.assignedTo.mobileNumber})`
                      : 'Unassigned'}
                  </button>
                </div>
              </InfoCard>

              <InfoCard title="Session Details">
                <div className="grid gap-3">
                  <Chip
                    label="Booking Date"
                    value={
                      apiData.bookingDate
                        ? new Date(apiData.bookingDate).toLocaleDateString()
                        : 'N/A'
                    }
                  />
                  <Chip label="Created At" value={fmtDate(apiData.createdAt)} />
                  <Chip label="Updated At" value={fmtDate(apiData.updatedAt)} />
                </div>
              </InfoCard>
            </div>

            {}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Chip label="Payment Mode" value={apiData.paymentMode || 'N/A'} />
              <Chip
                label="Estimated Service Completion Time"
                value={fmtDate(apiData.estimatedDeliveryTime) || 'N/A'}
              />
              <Chip label="Request Type" value={apiData.requestType || 'N/A'} />
            </div>

            {apiData.amount && (
              <div className="rounded-xl border border-[#E6D6C2] bg-[#F6EEE0] p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[#3E3428]">
                    Amount Details
                  </h3>
                  {apiData.coupon?.code ? (
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#7A5C3E]">
                      Coupon: {apiData.coupon.code} ({apiData.coupon.type}{' '}
                      {apiData.coupon.value})
                    </span>
                  ) : null}
                </div>
                <div className="space-y-2 text-sm text-[#3E3428]">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      {fmtINR(apiData.amount.subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span className="font-medium">
                      {fmtINR(apiData.amount.discount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E6D6C2] pt-2 text-[15px] font-semibold">
                    <span>Total</span>
                    <span>{fmtINR(apiData.amount.finalAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            {}
            {apiData.requestDetail ? (
              <InfoCard title="Request Detail">
                <div className="rounded-lg bg-[#F6EEE0] p-4 text-sm text-[#3E3428] leading-relaxed">
                  {apiData.requestDetail}
                </div>
              </InfoCard>
            ) : null}

            {apiData.specialInstructions ? (
              <InfoCard title="Special Instructions">
                <div className="rounded-lg bg-[#F6EEE0] p-4 text-sm text-[#3E3428] leading-relaxed">
                  {apiData.specialInstructions}
                </div>
              </InfoCard>
            ) : null}

            {(apiData.feedbackByGuest ||
              typeof apiData.ratingByGuest === 'number') && (
              <InfoCard title="Guest Feedback">
                <div className="grid gap-3">
                  {typeof apiData.ratingByGuest === 'number' ? (
                    <Chip
                      label="Rating"
                      value={`${apiData.ratingByGuest} / 5`}
                    />
                  ) : null}
                  {apiData.feedbackByGuest ? (
                    <div className="rounded-lg bg-[#F6EEE0] p-4 text-sm text-[#3E3428] leading-relaxed">
                      {apiData.feedbackByGuest}
                    </div>
                  ) : null}
                </div>
              </InfoCard>
            )}
          </div>
        </div>

        <div className="h-8" />
      </div>

      <AssignModal
        onClose={() => setIsAssignModalOpen(false)}
        requestId={isAssignModalOpen ? requestId : undefined}
        title="Assign Order"
        moduleName="ordermanagement"
      />
    </>
  );
};

export default OrderDetails;
