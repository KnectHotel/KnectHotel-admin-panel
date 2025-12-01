'use client';
import React, { useEffect, useState } from 'react';
import apiCall from '@/lib/axios';
import AssignModal from '@/components/shared/AssignModal';

type Props<T> = {
  requestId: string;
  mode?:
    | 'reception'
    | 'other'
    | 'housekeeping'
    | 'inroomcontrol'
    | 'gym'
    | 'inroomdining';
};

interface RequestData {
  _id: string;
  guest: {
    _id: string;
    assignedRoomNumber?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    email?: string;
  };
  requestDetail: string;
  feedback?: {
    serviceFeedback: string;
    serviceRating: number;
    agentFeedback: string;
    agentRating: number;
  };
  responseDetail?: string;
  requestAssignedTo?: string;
  estimatedDeliveryTime?: string;
  requestType: string;
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };

  // ✅ Additional fields
  uniqueId?: string;
  status?: string;
  paymentStatus?: string;
  serviceType?: string;
  wakeUpTime?: string;
  HotelId?: string;
  createdAt?: string;
  updatedAt?: string;

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

  items?: {
    item: string;
    quantity: number;
    _id: string;
  }[];

  orderedItems?: {
    _id: string;
    quantity: number;
    product: {
      _id: string;
      productName: string;
      productType: string;
      description: string;
      foodType: string;
      imageUrl: string;
      cost: number;
      HotelId: string;
      visibility?: boolean;
      [key: string]: any; // for any extra keys
    };
  }[];

  slot?: {
    _id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    price: number;
    maxCapacity: number;
    currentCapacity: number;
    [key: string]: any; // fallback for unexpected keys
  };
}

const RequestDetail = <T extends Record<string, any>>({
  requestId,
  mode = 'other'
}: Props<T>) => {
  const [apiData, setApiData] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (mode === 'reception' && requestId) {
        setLoading(true);
        try {
          const result = await apiCall(
            'GET',
            `api/services/reception/requests/${requestId}`
          );
          if (result.success) {
            setApiData(result.data);
          }
        } catch (error) {
          console.error('Error fetching request details:', error);
        } finally {
          setLoading(false);
        }
      } else if (mode === 'housekeeping' && requestId) {
        setLoading(true);
        try {
          const result = await apiCall(
            'GET',
            `api/services/housekeeping/requests/${requestId}`
          );
          if (result.success) {
            setApiData(result.data);
          }
        } catch (error) {
          console.error('Error fetching housekeeping request details:', error);
        } finally {
          setLoading(false);
        }
      } else if (mode === 'inroomcontrol' && requestId) {
        setLoading(true);
        try {
          const result = await apiCall(
            'GET',
            `api/services/inroomcontrol/requests/${requestId}`
          );
          if (result.success) {
            setApiData(result.data);
          }
        } catch (error) {
          console.error(
            'Error fetching in-room control request details:',
            error
          );
        } finally {
          setLoading(false);
        }
      } else if (mode === 'gym' && requestId) {
        setLoading(true);
        try {
          const result = await apiCall(
            'GET',
            `api/services/facility/requests/${requestId}`
          );
          if (result.success) {
            setApiData(result.data);
          }
        } catch (error) {
          console.error('Error fetching gym request details:', error);
        } finally {
          setLoading(false);
        }
      } else if (mode === 'inroomdining' && requestId) {
        setLoading(true);
        try {
          const result = await apiCall(
            'GET',
            `api/services/inroomdining/bookings/${requestId}`
          );
          console.log('API Response:', result);
          if (result.success) {
            setApiData(result.data);
          }
        } catch (error) {
          console.error('Error fetching gym request details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [mode, requestId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  const StarRating = ({ rating }: { rating: number }) => {
    // Create an array of 5 items to represent 5 stars
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        // Filled star
        stars.push(
          <span key={i} className="text-yellow-500">
            ★
          </span>
        );
      } else {
        // Empty star
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>
        );
      }
    }

    return <div className="flex">{stars}</div>;
  };
  const formatRequestType = (t?: string) =>
    t
      ? t
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/_/g, ' ')
          .trim()
      : 'N/A';

  return (
    <>
      <div className="bg-[#FAF6EF] rounded-md shadow-custom px-8 pb-10 pt-6 flex font-medium flex-col gap-16 w-full">
        {/* Header */}
        <div className="flex flex-wrap gap-16 text-lg font-bold opacity-55">
          <p>Guest ID: {apiData?.uniqueId || 'N/A'}</p>
          <p>Status: {apiData?.status || 'N/A'}</p>
          <p>Request Type: {formatRequestType(apiData?.requestType)}</p>
        </div>

        {/* Details */}
        <div className="space-y-8">
          {/* Upper Part (3-column layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex gap-2 items-center text-sm">
              <span className="opacity-75">Guest name</span>{' '}
              <span className="bg-[#F6EEE0] rounded-md px-6 py-1">
                {apiData?.guest
                  ? `${apiData.guest.firstName} ${apiData.guest.lastName}`.toUpperCase()
                  : 'N/A'}
              </span>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <span className="opacity-75">Mobile number</span>{' '}
              <span className="bg-[#F6EEE0] rounded-md px-6 py-1">
                {apiData?.guest?.phoneNumber || 'N/A'}
              </span>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <span className="opacity-75">Email</span>{' '}
              <span className="bg-[#F6EEE0] rounded-md px-6 py-1">
                {apiData?.guest?.email || 'N/A'}
              </span>
            </div>
          </div>

          {/* Lower Part (3-column layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Left section */}
            <div className="space-y-8">
              <div className="flex flex-col gap-2 items-start text-sm">
                <span className="opacity-75">Response Detail</span>
                <span className="bg-[#F6EEE0] w-full max-w-96 py-2 rounded-md px-6">
                  "{apiData?.requestDetail || 'N/A'}"
                </span>
              </div>
              <div className="flex flex-col gap-2 items-start text-sm">
                <span className="opacity-75">Payment Status</span>
                <span className="bg-[#F6EEE0] rounded-md px-10 py-1">
                  {apiData?.paymentStatus || 'N/A'}
                </span>
              </div>
              <div className="flex flex-col gap-2 items-start text-sm">
                <span className="opacity-75">Assigned Room No.</span>
                <span className="bg-[#F6EEE0] rounded-md px-10 py-1">
                  {apiData?.guest?.assignedRoomNumber || 'N/A'}
                </span>
              </div>
            </div>

            {/* Middle section */}
            <div className="space-y-8">
              <div className="flex flex-col gap-2 items-start text-sm">
                <span className="opacity-75">Request Assigned to</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-[#5a4118] bg-[#6E511D] px-4 py-2 text-white hover:bg-[#5f441b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A07C3E]"
                  onClick={() =>
                    (mode === 'reception' ||
                      mode === 'gym' ||
                      mode === 'housekeeping' ||
                      mode === 'inroomcontrol' ||
                      mode === 'inroomdining') &&
                    setIsAssignModalOpen(true)
                  }
                >
                  <span className="truncate">
                    {apiData?.assignedTo?.firstName
                      ? `${apiData.assignedTo.firstName} ${apiData.assignedTo.lastName}`
                      : 'N/A'}
                  </span>
                </button>
              </div>
              <div className="flex flex-col gap-2 items-start text-sm">
                <span className="opacity-75">
                  Estimated Service Completion Time
                </span>
                <span className="bg-[#F6EEE0] rounded-md px-10 py-1">
                  {apiData?.estimatedDeliveryTime
                    ? new Date(apiData.estimatedDeliveryTime).toLocaleString()
                    : 'N/A'}
                </span>
              </div>
              {mode === 'reception' && (
                <div className="flex flex-col gap-2 items-start text-sm">
                  <span className="opacity-75">Wake Up Time</span>
                  <span className="bg-[#F6EEE0] rounded-md px-10 py-1">
                    {apiData?.wakeUpTime
                      ? new Date(apiData.wakeUpTime).toLocaleString()
                      : 'N/A'}
                  </span>
                </div>
              )}
            </div>

            {/* Right section */}
            <div className="space-y-8">
              {/* <div className="flex flex-col gap-2 items-start text-sm">
                <span className="opacity-75">Request Type</span>
                <span className="bg-[#F6EEE0] rounded-md px-10 py-1">
                  {apiData?.requestType || 'N/A'}
                </span>
              </div> */}
              {apiData?.requestType &&
                ['Reception', 'Housekeeping'].includes(apiData.requestType) && (
                  <div className="space-y-8">
                    <div className="flex flex-col gap-2 items-start text-sm">
                      <span className="opacity-75">Request Type</span>
                      <span className="bg-[#F6EEE0] rounded-md px-10 py-1">
                        {apiData.requestType}
                      </span>
                    </div>
                  </div>
                )}

              {/* <div className="flex flex-col gap-2 items-start text-sm">
                <span className="opacity-75">Service Type</span>
                <span className="bg-[#F6EEE0] rounded-md px-10 py-1">
                  {apiData?.serviceType || 'N/A'}
                </span>
              </div> */}
            </div>
          </div>

          {/* Created / Updated info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 text-sm">
            <div className="flex flex-col gap-1">
              <span className="opacity-75">Created At</span>
              <span className="bg-[#F6EEE0] rounded-md px-6 py-1">
                {apiData?.createdAt
                  ? new Date(apiData.createdAt).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="opacity-75">Updated At</span>
              <span className="bg-[#F6EEE0] rounded-md px-6 py-1">
                {apiData?.updatedAt
                  ? new Date(apiData.updatedAt).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Feedback + Rating (side-by-side) */}
      <div className="mt-6 bg-[#F6EEE0] p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">Guest Feedback</h3>

        <div className="mt-4 space-y-4">
          <div>
            <span className="font-medium text-gray-700">Service Feedback:</span>
            <p className="text-gray-600 mt-1">
              {apiData?.feedback?.serviceFeedback || 'No Feedback'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Service Rating:</span>
            <StarRating rating={apiData?.feedback?.serviceRating || 0} />
          </div>

          <div>
            <span className="font-medium text-gray-700">Agent Feedback:</span>
            <p className="text-gray-600 mt-1">
              {apiData?.feedback?.agentFeedback || 'No Feedback'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Agent Rating:</span>
            <StarRating rating={apiData?.feedback?.agentRating || 0} />
          </div>
        </div>
      </div>

      {mode === 'housekeeping' ||
        (mode === 'inroomdining' && requestId && (
          <div className="flex flex-col gap-6">
            {/* Amount Section */}
            <div className="w-full rounded-lg border border-[#E4D7C4] bg-[#F6EEE0] px-6 py-4 shadow-sm">
              <h3 className="text-base font-semibold text-[#4B3F2F] mb-2">
                Amount Details
              </h3>
              <div className="text-sm space-y-1 text-[#333]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{apiData?.amount?.subtotal ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>₹{apiData?.amount?.discount ?? 0}</span>
                </div>
                <div className="flex justify-between font-medium text-[#1B1B1B]">
                  <span>Total</span>
                  <span>₹{apiData?.amount?.finalAmount ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Coupon Section */}
            {apiData?.coupon?.code && (
              <div className="w-full rounded-lg border border-[#E4D7C4] bg-[#F6EEE0] px-6 py-4 shadow-sm">
                <h3 className="text-base font-semibold text-[#4B3F2F] mb-2">
                  Coupon Applied
                </h3>
                <div className="text-sm text-[#333] space-y-1">
                  <div className="flex justify-between">
                    <span>Code</span>
                    <span>{apiData.coupon.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span>{apiData.coupon.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Value</span>
                    <span>{apiData.coupon.value}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Ordered Items Section */}
            {(() => {
              const items = apiData?.items;
              if (!items || items.length === 0) return null;
              return (
                <div className="w-full rounded-lg border border-[#E4D7C4] bg-[#F6EEE0] px-6 py-4 shadow-sm">
                  <h3 className="text-base font-semibold text-[#4B3F2F] mb-2">
                    Ordered Items
                  </h3>
                  <ul className="list-disc list-inside text-sm text-[#333] space-y-1">
                    {items.map((itm, idx) => (
                      <li key={itm._id || idx}>
                        <span className="font-medium">Item ID:</span> {itm.item}
                        , <span className="font-medium">Qty:</span>{' '}
                        {itm.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>
        ))}

      {mode === 'inroomdining' &&
        Array.isArray(apiData?.orderedItems) &&
        apiData.orderedItems.length > 0 && (
          <div className="w-full rounded-lg border border-[#E4D7C4] bg-[#F6EEE0] px-6 py-4 shadow-sm">
            <h3 className="text-base font-semibold text-[#4B3F2F] mb-4">
              Ordered Items
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiData.orderedItems.map((item, idx) => {
                const product = item.product || {};
                return (
                  <div
                    key={item._id || idx}
                    className="border border-[#d6c7ae] rounded-lg p-4 bg-white shadow"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <img
                        src={product.imageUrl || '/fallback.png'}
                        alt={product.productName || 'Product Image'}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#1B1B1B] text-sm">
                          {product.productName || 'N/A'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {product.productType || 'N/A'} •{' '}
                          {product.foodType || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mb-1">
                      <span className="font-medium text-[#4B3F2F]">
                        Description:{' '}
                      </span>
                      {product.description || 'N/A'}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium text-[#4B3F2F]">
                        Quantity:{' '}
                      </span>
                      {item.quantity}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium text-[#4B3F2F]">
                        Unit Cost:{' '}
                      </span>
                      ₹{product.cost ?? 'N/A'}
                    </p>
                    <p className="text-sm font-semibold mt-2">
                      <span className="text-[#1B1B1B]">Total: </span>₹
                      {(product.cost ?? 0) * item.quantity}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      {mode !== 'inroomdining' && apiData?.slot && (
        <div className="mt-6 p-4 border rounded-xl shadow-sm bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Slot Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium text-gray-600">Day:</span>
              <p>{apiData.slot?.dayOfWeek || 'N/A'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Time:</span>
              <p>
                {apiData.slot?.startTime && apiData.slot?.endTime
                  ? `${apiData.slot.startTime} - ${apiData.slot.endTime}`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Price:</span>
              <p>₹{apiData.slot?.price?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Capacity:</span>
              <p>
                {apiData.slot?.currentCapacity || 0}/
                {apiData.slot?.maxCapacity || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {mode === 'housekeeping' &&
        Array.isArray(apiData?.items) &&
        apiData.items.length > 0 && (
          <div className="mt-6 p-4 border rounded-xl shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Housekeeping Details
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 border rounded-md">
                <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                  <tr>
                    <th className="px-4 py-2">Service Type</th>
                    <th className="px-4 py-2">Item Name</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {apiData.items.map((itemObj: any, index: number) => {
                    const item = itemObj.item;
                    const quantity = itemObj.quantity || 0;
                    const price = item?.price || 0;
                    return (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">
                          {item?.serviceType || 'N/A'}
                        </td>
                        <td className="px-4 py-2">{item?.name || 'N/A'}</td>
                        <td className="px-4 py-2">{item?.category || 'N/A'}</td>
                        <td className="px-4 py-2">₹{price.toFixed(2)}</td>
                        <td className="px-4 py-2">{quantity}</td>
                        <td className="px-4 py-2">
                          ₹{(price * quantity).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      <AssignModal
        onClose={() => setIsAssignModalOpen(false)}
        // onAssign={() => {}}
        requestId={isAssignModalOpen ? requestId : undefined}
        title="Assign Request to Employee"
        moduleName={
          mode === 'inroomcontrol'
            ? 'in_room_control'
            : mode === 'inroomdining'
              ? 'inroomdining'
              : mode === 'gym'
                ? 'gym'
                : mode === 'housekeeping'
                  ? 'housekeeping'
                  : mode === 'reception'
                    ? 'reception'
                    : mode
        }
      />
    </>
  );
};

export default RequestDetail;
