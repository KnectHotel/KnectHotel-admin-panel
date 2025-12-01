'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@mui/material';
import apiCall from '@/lib/axios';

export interface Transaction {
  _id: string;
  transactionId: string;
  hotel: {
    HotelId: string;
    name: string;
    email: string;
    phoneNo: string;
  };
  amount: number;
  status: string;
  paymentGateway: string;
  paymentLink: string;
  subscription: {
    planName: string;
    planDuration: number;
    cost: number;
  };
  createdAt: string;
  coupon?: {
    _id?: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    value: number;
  };
  discountAmount?: number;
  gatewayResponse?: {
    event_time?: string;
    data: {
      customer_details: {
        customer_name: string;
        customer_id: string;
        customer_email: string;
        customer_phone: string;
      };
      payment: {
        cf_payment_id?: string;
        payment_time?: string;
      };
    };
  };
  serviceRequestId?: {
    uniqueId: string;
    __t: string;
    requestDetail: string;
    paymentStatus: string;
    createdAt: string;
    bookingDate: string;
    additionalGuests?: number;
    amount: {
      discount?: number;
      finalAmount?: number;
      subtotal?: number;
    };
    guest: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  };
}

interface Props {
  _id: string;
  mode: 'view';
  isHotelPanel?: boolean;
}

const TransactionForm = ({ _id, mode, isHotelPanel = false }: Props) => {
  const [transactionData, setTransactionData] = useState<Transaction | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await apiCall('GET', `api/transactions/${_id}`);
        console.log(res);
        setTransactionData(res.data);
      } catch (error) {
        console.error('Error fetching transaction:', error);
      } finally {
        setLoading(false);
      }
    };

    if (_id) fetchTransaction();
  }, [_id]);

  const formatDateAndTime = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB'); // DD-MM-YYYY
    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }); // 12-hour time with AM/PM
    return `${formattedDate}, ${formattedTime}`;
  };

  if (loading) {
    return (
      <div className="p-10">
        <Skeleton className="h-10 w-40 mb-4" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (!transactionData) {
    return <div className="p-10 text-red-500">Transaction not found.</div>;
  }

  const serviceRequest = transactionData.serviceRequestId;
  const createdAt = serviceRequest?.createdAt
    ? formatDateAndTime(serviceRequest.createdAt)
    : null;
  const bookingDate = serviceRequest?.bookingDate
    ? formatDateAndTime(serviceRequest.bookingDate)
    : null;
  const formatCoupon = (c?: Transaction['coupon']): string => {
    if (!c) return 'N/A';
    const valStr =
      c.discountType === 'percentage' ? `${c.value}%` : `INR ${c.value}`;
    return `${c.code} (${valStr})`;
  };
  return (
    <div className="my-8 px-6">
      <Card className="bg-[#FAF6EF] w-full shadow-custom border-none">
        <div className="flex gap-8 flex-wrap items-center p-4">
          <h2 className="text-sm font-medium text-gray-500">
            Transaction ID: {transactionData.transactionId || 'N/A'}
          </h2>
          {!isHotelPanel && (
            <h2 className="text-sm font-medium text-gray-500">
              Transaction Amount: INR {transactionData.amount || 0}
            </h2>
          )}
          {!isHotelPanel && transactionData.coupon && (
            <h2 className="text-sm font-medium text-gray-500">
              Coupon: {transactionData.coupon.value}%
            </h2>
          )}
          <h2 className="text-sm font-medium text-gray-500">
            Payment Gateway: {transactionData.paymentGateway || 'N/A'}
          </h2>
          <h2 className="text-sm font-medium text-gray-500">
            HotelId: {transactionData.hotel?.HotelId || 'N/A'}
          </h2>
        </div>

        <CardContent>
          <div className="space-y-4">
            {/* Hotel Info - For Hotel Panel */}
            {isHotelPanel && (
              <div className="space-y-2 pt-4">
                <h3 className="text-sm font-semibold">Hotel Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Hotel Name
                    </label>
                    <Input
                      value={transactionData.hotel?.name || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Hotel Email
                    </label>
                    <Input
                      value={transactionData.hotel?.email || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Hotel Phone
                    </label>
                    <Input
                      value={transactionData.hotel?.phoneNo || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Coupon
                    </label>
                    {/* ✅ FIX: never pass the object; pass a string */}
                    <Input
                      value={formatCoupon(transactionData.coupon)}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Service Request Details */}
            {serviceRequest && (
              <div className="space-y-2 pt-4">
                <h3 className="text-sm font-semibold">
                  Service Request Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Unique ID
                    </label>
                    <Input
                      value={serviceRequest.uniqueId || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Type
                    </label>
                    <Input
                      value={serviceRequest.__t || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Request Detail
                    </label>
                    <Input
                      value={serviceRequest.requestDetail || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Payment Status
                    </label>
                    <Input
                      value={serviceRequest.paymentStatus || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Created At
                    </label>
                    <Input
                      value={createdAt || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Booking Date
                    </label>
                    <Input
                      value={bookingDate || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Final Amount
                    </label>
                    <Input
                      value={`INR ${serviceRequest.amount?.finalAmount || 0}`}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Guest Name
                    </label>
                    <Input
                      value={`${serviceRequest.guest?.firstName} ${serviceRequest.guest?.lastName}`}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Guest Phone
                    </label>
                    <Input
                      value={serviceRequest.guest.phoneNumber || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Coupon Info - Non-Hotel Panel */}
            {!isHotelPanel && transactionData.coupon && (
              <div className="space-y-2 pt-4">
                <h3 className="text-sm font-semibold">Coupon Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Coupon Code
                    </label>
                    <Input
                      value={transactionData.coupon.code || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Discount Type
                    </label>
                    <Input
                      value={transactionData.coupon.discountType || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Discount Value
                    </label>
                    <Input
                      value={transactionData.coupon.value || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Info - Non-Hotel Panel */}
            {!isHotelPanel && (
              <div className="space-y-2 pt-4">
                <h3 className="text-sm font-semibold">Payment Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Payment Link
                    </label>
                    <Input
                      value={transactionData.paymentLink || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Payment Gateway
                    </label>
                    <Input
                      value={transactionData.paymentGateway || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">
                      Status
                    </label>
                    <Input
                      value={transactionData.status || 'N/A'}
                      disabled
                      className="bg-[#F6EEE0] text-gray-700 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionForm;
