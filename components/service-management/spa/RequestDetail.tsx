'use client';

import React, { useEffect, useState } from 'react';
import apiCall from '@/lib/axios';
import AssignModal from '@/components/shared/AssignModal';

/* ======================= Types ======================= */
type SpaSalonBooking = {
  _id: string;
  uniqueId: string;
  status: string;
  bookingDate: string;
  bookingTime: string;
  requestTime: string;
  paymentStatus: string;
  amount: {
    subtotal: number;
    discount: number;
    finalAmount: number;
  };
  slot?: {
    _id: string;
    dayOfWeek: string;
    startTime: string; // "10:00"
    endTime: string; // "11:00"
    maxCapacity: number;
    currentCapacity?: number;
  };
  guest: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  spaSalonProduct: {
    _id: string;
    serviceType: string;
    productCategory: string;
    productName: string;
    price: number;
    description: string;
    imageUrl: string;
  };
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
  estimatedDeliveryTime?: string;
  feedback?: {
    serviceFeedback: string;
    serviceRating: number;
    agentFeedback: string;
    agentRating: number;
  };
};

type Props = {
  serviceID: string;
};

/* ======================= UI helpers (same style as OrderDetails) ======================= */
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
      <span
        className={`text-[11px] ${uppercase ? 'uppercase' : ''} tracking-wide text-[#6a5a45]/70`}
      >
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

const StarRating = ({ rating = 0 }: { rating?: number }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex gap-1">
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

/* ======================= Component ======================= */
const SpaServiceRequestDetail: React.FC<Props> = ({ serviceID }) => {
  const [service, setService] = useState<SpaSalonBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const res = await apiCall(
          'GET',
          `/api/services/spasalon/booking/${serviceID}`
        );
        if (res?.success) setService(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (serviceID) fetchBookingDetails();
  }, [serviceID]);

  if (loading) {
    return (
      <div className="mt-24 flex h-full items-center justify-center text-gray-600">
        Loading…
      </div>
    );
  }
  if (!service) {
    return (
      <div className="mt-24 flex h-full items-center justify-center text-rose-600">
        No data found.
      </div>
    );
  }

  const st = statusTheme(service.status);
  const fmtDateOnly = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'Asia/Kolkata'
        })
      : 'N/A';

  const fmtDateTime = (d?: string) =>
    d
      ? new Date(d).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata'
        })
      : 'N/A';

  // Accept either "HH:mm" or an ISO string
  const fmtTime = (t?: string) => {
    if (!t) return 'N/A';
    // "10:00" style
    if (/^\d{1,2}:\d{2}$/.test(t)) return t;
    // ISO -> time
    const d = new Date(t);
    return isNaN(d.getTime())
      ? t
      : d.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata'
        });
  };

  return (
    <>
      <div className="mt-24 w-full">
        <div className="mx-auto max-w-6xl rounded-2xl border border-[#E6D6C2] bg-[#FAF6EF] shadow-[0_2px_20px_rgba(0,0,0,0.05)]">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6D6C2] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded bg-[#7A5C3E]" />
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold leading-tight tracking-tight text-[#3E3428]">
                  Spa/Salon Booking Details
                </h1>
                <span className="text-xs text-[#6a5a45]">
                  Ref:{' '}
                  <span className="font-medium">
                    {service.uniqueId || 'N/A'}
                  </span>
                </span>
              </div>
            </div>

            {/* Status chip */}
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ring-1 ${st.bg} ${st.text} ${st.ring}`}
            >
              <span className="h-2 w-2 rounded-full bg-current opacity-70" />
              {service.status || 'Unknown'}
            </span>
          </div>

          {/* Body */}
          <div className="grid gap-8 px-6 py-8">
            {/* Top quick facts */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Chip
                label="Service Type"
                value={service.spaSalonProduct.serviceType || 'N/A'}
              />
              <Chip
                label="Category"
                value={service.spaSalonProduct.productCategory || 'N/A'}
              />
              <Chip
                label="Payment Status"
                value={
                  <span
                    className={
                      service.paymentStatus?.toLowerCase() === 'paid'
                        ? 'text-emerald-700'
                        : 'text-rose-700'
                    }
                  >
                    {service.paymentStatus || 'N/A'}
                  </span>
                }
              />
            </div>

            {/* Guest + Assignment + Session */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <InfoCard title="Guest Information">
                <div className="rounded-lg bg-[#F6EEE0] p-4">
                  <div className="text-base font-semibold text-[#3E3428]">
                    {service.guest?.firstName} {service.guest?.lastName}
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="Assignment">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] uppercase tracking-wide text-[#6a5a45]/70">
                    Assigned To
                  </span>
                  {/* <button
                    className="w-full rounded-md bg-[#F6EEE0] px-4 py-2 text-left text-[#3E3428] shadow-sm transition-colors hover:bg-[#F0E6D6]"
                    onClick={() => setIsAssignModalOpen(true)}
                  >
                    {service.assignedTo
                      ? `${service.assignedTo.firstName} ${service.assignedTo.lastName}${
                          service.assignedTo.phoneNumber
                            ? ` (${service.assignedTo.phoneNumber})`
                            : ''
                        }`
                      : 'Unassigned'}
                  </button> */}
                  <button
                    type="button"
                    className="w-full rounded-md border border-[#5a4118] bg-[#6E511D] px-4 py-2 text-left text-white shadow-sm transition-colors hover:bg-[#5f441b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A07C3E]"
                    onClick={() => setIsAssignModalOpen(true)}
                  >
                    {service.assignedTo
                      ? `${service.assignedTo.firstName} ${service.assignedTo.lastName}${
                          service.assignedTo.phoneNumber
                            ? ` (${service.assignedTo.phoneNumber})`
                            : ''
                        }`
                      : 'Unassigned'}
                  </button>
                </div>
              </InfoCard>

              <InfoCard title="Session Details">
                <div className="grid gap-3">
                  <Chip
                    label="Booking Date"
                    value={fmtDateOnly(service.bookingDate)}
                  />
                  <Chip
                    label="Booking Time"
                    value={fmtTime(
                      service.bookingTime || service.slot?.startTime
                    )}
                  />
                  <Chip
                    label="Request Time"
                    value={fmtDateTime(service.requestTime)}
                  />

                  {service.estimatedDeliveryTime ? (
                    <Chip
                      label="Estimated Service Completion Time"
                      value={fmtDate(service.estimatedDeliveryTime)}
                    />
                  ) : null}
                </div>
              </InfoCard>
            </div>

            {/* Product Details + Amount */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <InfoCard title="Service Details">
                <div className="grid gap-3">
                  <Chip
                    label="Service Name"
                    value={service.spaSalonProduct.productName}
                  />
                  <div className="rounded-lg bg-[#F6EEE0] p-4 text-sm text-[#3E3428] leading-relaxed">
                    <div className="mb-2 font-medium text-[#3E3428]">
                      Description
                    </div>
                    <p>{service.spaSalonProduct.description || '—'}</p>
                  </div>
                  {service.spaSalonProduct.imageUrl ? (
                    <div className="overflow-hidden rounded-lg border border-[#E6D6C2]">
                      {/* Using native img to avoid Next/Image domain config issues */}
                      <img
                        src={service.spaSalonProduct.imageUrl}
                        alt={service.spaSalonProduct.productName}
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              </InfoCard>

              <div className="rounded-xl border border-[#E6D6C2] bg-[#F6EEE0] p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[#3E3428]">
                    Amount Details
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-[#3E3428]">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      {fmtINR(service.amount?.subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span className="font-medium">
                      {fmtINR(service.amount?.discount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E6D6C2] pt-2 text-[15px] font-semibold">
                    <span>Total</span>
                    <span>{fmtINR(service.amount?.finalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {(service.feedback?.serviceFeedback ||
              typeof service.feedback?.serviceRating === 'number' ||
              service.feedback?.agentFeedback ||
              typeof service.feedback?.agentRating === 'number') && (
              <InfoCard title="Guest Feedback">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg bg-[#F6EEE0] p-4">
                    <div className="mb-2 text-sm font-medium text-[#3E3428]">
                      Service Feedback
                    </div>
                    <p className="mb-2 text-sm text-[#3E3428]">
                      {service.feedback?.serviceFeedback || 'No feedback'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#3E3428]">
                        Rating:
                      </span>
                      <StarRating
                        rating={service.feedback?.serviceRating || 0}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#F6EEE0] p-4">
                    <div className="mb-2 text-sm font-medium text-[#3E3428]">
                      Agent Feedback
                    </div>
                    <p className="mb-2 text-sm text-[#3E3428]">
                      {service.feedback?.agentFeedback || 'No feedback'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#3E3428]">
                        Rating:
                      </span>
                      <StarRating rating={service.feedback?.agentRating || 0} />
                    </div>
                  </div>
                </div>
              </InfoCard>
            )}
          </div>
        </div>

        <div className="h-8" />
      </div>

      {/* Assign Modal */}
      <AssignModal
        onClose={() => setIsAssignModalOpen(false)}
        requestId={isAssignModalOpen ? serviceID : undefined}
        title="Assign Request to Employee"
        moduleName="spasalon"
      />
    </>
  );
};

export default SpaServiceRequestDetail;
