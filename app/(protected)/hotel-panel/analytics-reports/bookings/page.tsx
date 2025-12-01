// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import Link from 'next/link';
// import { format, subDays } from 'date-fns';
// import type { DateRange } from 'react-day-picker';

// import Navbar from '@/components/Navbar';
// import { Heading } from '@/components/ui/heading';
// import { Button } from '@/components/ui/button';
// import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import apiCall from '@/lib/axios';
// import { cn } from '@/lib/utils';

// type BookingsReportRes = {
//   totalBookings: number;
//   revenueOfRoomTariff: number;
//   receivedAmount: number;
//   cashAmount: number;
//   cashfreeAmount: number;
//   onlineAmountReceived: number;
//   roomTariffDue: number;
//   confirmedBookings: number;
//   checkedInRooms: number;
//   checkedOutRooms: number;
//   cancelledBookings: number;
//   noShowBookings: number;
//   occupancyRate: string; // e.g. "14.00%"
//   totalNumberOfRooms: number;
// };

// const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');

// const nf = new Intl.NumberFormat('en-IN'); // plain numbers
// const cf = new Intl.NumberFormat('en-IN', {
//   // currency (₹)
//   style: 'currency',
//   currency: 'INR',
//   maximumFractionDigits: 0
// });

// export default function BookingsReportsPage() {
//   const today = new Date();

//   // default: last 30 days through today
//   const [range, setRange] = useState<DateRange | undefined>({
//     from: subDays(today, 30),
//     to: today
//   });

//   const [data, setData] = useState<BookingsReportRes | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   const startDate = useMemo(
//     () => (range?.from ? toYMD(range.from) : undefined),
//     [range?.from]
//   );
//   const endDate = useMemo(
//     () => (range?.to ? toYMD(range.to) : undefined),
//     [range?.to]
//   );

//   useEffect(() => {
//     (async () => {
//       if (!startDate || !endDate) return;
//       setLoading(true);
//       setErr(null);
//       try {
//         // Specified shape first: POST with { range: { startDate, endDate } }
//         const res = await apiCall('POST', '/api/reports/bookings', {
//           range: { startDate, endDate }
//         });
//         const payload: BookingsReportRes = res?.data ?? res ?? ({} as any);
//         setData(normalize(payload));
//       } catch (eA: any) {
//         const statusA = eA?.response?.status;
//         if (
//           statusA !== 404 &&
//           statusA !== 405 &&
//           statusA !== 400 &&
//           statusA !== 415
//         ) {
//           setErr(
//             eA?.response?.data?.message ||
//               eA?.message ||
//               'Failed to load bookings report'
//           );
//         } else {
//           // Fallbacks: some stacks accept flat POST or GET with query params
//           try {
//             const resB = await apiCall('POST', '/api/reports/bookings', {
//               startDate,
//               endDate
//             });
//             const payloadB: BookingsReportRes =
//               resB?.data ?? resB ?? ({} as any);
//             setData(normalize(payloadB));
//           } catch (eB: any) {
//             try {
//               const resC = await apiCall(
//                 'GET',
//                 `/api/reports/bookings?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
//               );
//               const payloadC: BookingsReportRes =
//                 resC?.data ?? resC ?? ({} as any);
//               setData(normalize(payloadC));
//             } catch (eC: any) {
//               const sA = eA?.response?.status;
//               const sB = eB?.response?.status;
//               const sC = eC?.response?.status;

//               setErr(
//                 `Failed (POST range:${sA ?? 'NA'}, POST flat:${sB ?? 'NA'}, GET:${sC ?? 'NA'}). ` +
//                   (eC?.response?.data?.message ||
//                     eC?.message ||
//                     'Bookings report endpoint not found')
//               );
//               console.error('[bookings-report] FAIL', {
//                 A: {
//                   status: sA,
//                   msg: eA?.response?.data?.message || eA?.message
//                 },
//                 B: {
//                   status: sB,
//                   msg: eB?.response?.data?.message || eB?.message
//                 },
//                 C: {
//                   status: sC,
//                   msg: eC?.response?.data?.message || eC?.message
//                 }
//               });
//             }
//           }
//         }
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [startDate, endDate]);

//   return (
//     <div className="flex min-h-screen w-full">
//       <div className="flex-1 flex flex-col">
//         <Navbar />
//         <div className="px-6 py-6 mt-16">
//           <div className="flex items-center justify-between">
//             <Heading title="Bookings Report" className="mt-0 md:mt-0" />
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className={cn(
//                     'w-full sm:w-auto justify-start text-left font-normal',
//                     !startDate || !endDate ? 'text-muted-foreground' : ''
//                   )}
//                 >
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {startDate && endDate
//                     ? `${startDate} → ${endDate}`
//                     : 'Pick a date range'}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="end">
//                 <Calendar
//                   mode="range"
//                   numberOfMonths={2}
//                   selected={range}
//                   onSelect={(r) => {
//                     if (!r) return setRange(undefined);
//                     const next: DateRange = { from: r.from, to: r.to ?? today };
//                     if (next.to && next.to > today) next.to = today;
//                     if (next.from && next.from > today) next.from = today;
//                     setRange(next);
//                   }}
//                   defaultMonth={range?.to ?? today}
//                   disabled={{ after: today }}
//                   toMonth={today}
//                 />
//               </PopoverContent>
//             </Popover>
//           </div>

//           {err && (
//             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//               {err}
//             </div>
//           )}

//           {/* Metrics */}
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
//             <MetricCard
//               title="Total Bookings"
//               value={nf.format(data?.totalBookings ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Confirmed Bookings"
//               value={nf.format(data?.confirmedBookings ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Checked-In Rooms"
//               value={nf.format(data?.checkedInRooms ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Checked-Out Rooms"
//               value={nf.format(data?.checkedOutRooms ?? 0)}
//               loading={loading}
//             />

//             <MetricCard
//               title="Cancelled Bookings"
//               value={nf.format(data?.cancelledBookings ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="No-Show Bookings"
//               value={nf.format(data?.noShowBookings ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Total Rooms"
//               value={nf.format(data?.totalNumberOfRooms ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Occupancy Rate"
//               value={data?.occupancyRate ?? '0%'}
//               loading={loading}
//             />

//             <MetricCard
//               title="Revenue (Room Tariff)"
//               value={cf.format(data?.revenueOfRoomTariff ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Amount Received"
//               value={cf.format(data?.receivedAmount ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Cash Amount"
//               value={cf.format(data?.cashAmount ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Cashfree Amount"
//               value={cf.format(data?.cashfreeAmount ?? 0)}
//               loading={loading}
//             />

//             <MetricCard
//               title="Online Amount Received"
//               value={cf.format(data?.onlineAmountReceived ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Room Tariff Due"
//               value={cf.format(data?.roomTariffDue ?? 0)}
//               loading={loading}
//             />
//           </div>

//           <div className="mt-8">
//             <Link
//               href="/hotel-panel/analytics-reports"
//               className="text-sm underline hover:opacity-80"
//             >
//               ← Back to Analytics & Reports
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /** Normalize payload and guard against undefined */
// function normalize(p: Partial<BookingsReportRes>): BookingsReportRes {
//   return {
//     totalBookings: Number(p.totalBookings ?? 0),
//     revenueOfRoomTariff: Number(p.revenueOfRoomTariff ?? 0),
//     receivedAmount: Number(p.receivedAmount ?? 0),
//     cashAmount: Number(p.cashAmount ?? 0),
//     cashfreeAmount: Number(p.cashfreeAmount ?? 0),
//     onlineAmountReceived: Number(p.onlineAmountReceived ?? 0),
//     roomTariffDue: Number(p.roomTariffDue ?? 0),
//     confirmedBookings: Number(p.confirmedBookings ?? 0),
//     checkedInRooms: Number(p.checkedInRooms ?? 0),
//     checkedOutRooms: Number(p.checkedOutRooms ?? 0),
//     cancelledBookings: Number(p.cancelledBookings ?? 0),
//     noShowBookings: Number(p.noShowBookings ?? 0),
//     occupancyRate: typeof p.occupancyRate === 'string' ? p.occupancyRate : '0%',
//     totalNumberOfRooms: Number(p.totalNumberOfRooms ?? 0)
//   };
// }

// function MetricCard({
//   title,
//   value,
//   loading
// }: {
//   title: string;
//   value: string | number;
//   loading?: boolean;
// }) {
//   return (
//     <div className="rounded-2xl border bg-white p-5 shadow-sm">
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-gray-500">{title}</p>
//         {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
//       </div>
//       <div className="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">
//         {value}
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { format, subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import Navbar from '@/components/Navbar';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Download, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import apiCall from '@/lib/axios';
import { cn } from '@/lib/utils';

type BookingsReportRes = {
  totalBookings: number;
  revenueOfRoomTariff: number;
  receivedAmount: number;
  cashAmount: number;
  cashfreeAmount: number;
  onlineAmountReceived: number;
  roomTariffDue: number;
  confirmedBookings: number;
  checkedInRooms: number;
  checkedOutRooms: number;
  cancelledBookings: number;
  noShowBookings: number;
  occupancyRate: string;
  totalNumberOfRooms: number;
  excelBase64?: string;
  excelFileName?: string;
};

const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');

const nf = new Intl.NumberFormat('en-IN');
const cf = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export default function BookingsReportsPage() {
  const today = new Date();

  // default: last 30 days through today
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(today, 30),
    to: today
  });

  const [data, setData] = useState<BookingsReportRes | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false); // Track downloading state
  const [err, setErr] = useState<string | null>(null);

  const startDate = useMemo(
    () => (range?.from ? toYMD(range.from) : undefined),
    [range?.from]
  );
  const endDate = useMemo(
    () => (range?.to ? toYMD(range.to) : undefined),
    [range?.to]
  );

  // Fetch report data whenever the range changes
  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) return;
      setLoading(true);
      setErr(null);
      try {
        const res = await apiCall('POST', '/api/reports/bookings', {
          range: { startDate, endDate }
        });
        const payload: BookingsReportRes = res?.data ?? res ?? ({} as any);
        setData(normalize(payload));
      } catch (eA: any) {
        const statusA = eA?.response?.status;
        if (
          statusA !== 404 &&
          statusA !== 405 &&
          statusA !== 400 &&
          statusA !== 415
        ) {
          setErr(
            eA?.response?.data?.message ||
              eA?.message ||
              'Failed to load bookings report'
          );
        } else {
          // Fallbacks
          try {
            const resB = await apiCall('POST', '/api/reports/bookings', {
              startDate,
              endDate
            });
            const payloadB: BookingsReportRes =
              resB?.data ?? resB ?? ({} as any);
            setData(normalize(payloadB));
          } catch (eB: any) {
            try {
              const resC = await apiCall(
                'GET',
                `/api/reports/bookings?startDate=${encodeURIComponent(
                  startDate
                )}&endDate=${encodeURIComponent(endDate)}`
              );
              const payloadC: BookingsReportRes =
                resC?.data ?? resC ?? ({} as any);
              setData(normalize(payloadC));
            } catch (eC: any) {
              const sA = eA?.response?.status;
              const sB = eB?.response?.status;
              const sC = eC?.response?.status;

              setErr(
                `Failed (POST range:${sA ?? 'NA'}, POST flat:${sB ?? 'NA'}, GET:${sC ?? 'NA'}). ` +
                  (eC?.response?.data?.message ||
                    eC?.message ||
                    'Bookings report endpoint not found')
              );
              console.error('[bookings-report] FAIL', {
                A: {
                  status: sA,
                  msg: eA?.response?.data?.message || eA?.message
                },
                B: {
                  status: sB,
                  msg: eB?.response?.data?.message || eB?.message
                },
                C: {
                  status: sC,
                  msg: eC?.response?.data?.message || eC?.message
                }
              });
            }
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate]);

  // Download handler
  function handleExcelDownload(excelBase64: string, excelFileName: string) {
    const binary = atob(excelBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = excelFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  // Refresh button click handler
  async function handleRefresh() {
    if (!startDate || !endDate) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await apiCall('POST', '/api/reports/bookings', {
        range: { startDate, endDate }
      });
      const payload: BookingsReportRes = res?.data ?? res ?? ({} as any);
      setData(normalize(payload));
    } catch (e) {
      setErr('Failed to refresh bookings report');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="px-6 py-6 mt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Heading title="Bookings Report" className="mt-0 md:mt-0" />
            {/* Date Range + Actions */}
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full sm:w-auto justify-start text-left font-normal',
                      !startDate || !endDate ? 'text-muted-foreground' : ''
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate && endDate
                      ? `${startDate} → ${endDate}`
                      : 'Pick a date range'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    numberOfMonths={2}
                    selected={range}
                    onSelect={(r) => setRange(r)}
                    defaultMonth={range?.from}
                  />
                </PopoverContent>
              </Popover>

              {/* Refresh Button */}
              <Button onClick={handleRefresh} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
                  </>
                ) : (
                  'Refresh'
                )}
              </Button>

              {/* Download Excel Button */}
              <Button
                variant="secondary"
                onClick={() =>
                  handleExcelDownload(data?.excelBase64!, data?.excelFileName!)
                }
                disabled={!data?.excelBase64 || downloading}
                className="flex items-center gap-2"
              >
                {downloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading…
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Excel
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error */}
          {err && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          {/* Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Total Bookings"
              value={nf.format(data?.totalBookings ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Confirmed Bookings"
              value={nf.format(data?.confirmedBookings ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Checked-In Rooms"
              value={nf.format(data?.checkedInRooms ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Checked-Out Rooms"
              value={nf.format(data?.checkedOutRooms ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Cancelled Bookings"
              value={nf.format(data?.cancelledBookings ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="No-Show Bookings"
              value={nf.format(data?.noShowBookings ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Total Rooms"
              value={nf.format(data?.totalNumberOfRooms ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Occupancy Rate"
              value={data?.occupancyRate ?? '0%'}
              loading={loading}
            />
            <MetricCard
              title="Revenue (Room Tariff)"
              value={cf.format(data?.revenueOfRoomTariff ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Amount Received"
              value={cf.format(data?.receivedAmount ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Cash Amount"
              value={cf.format(data?.cashAmount ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Cashfree Amount"
              value={cf.format(data?.cashfreeAmount ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Online Amount Received"
              value={cf.format(data?.onlineAmountReceived ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Room Tariff Due"
              value={cf.format(data?.roomTariffDue ?? 0)}
              loading={loading}
            />
          </div>

          <div className="mt-8">
            <Link
              href="/hotel-panel/analytics-reports"
              className="text-sm underline hover:opacity-80"
            >
              ← Back to Analytics & Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalize(p: Partial<BookingsReportRes>): BookingsReportRes {
  return {
    totalBookings: Number(p.totalBookings ?? 0),
    revenueOfRoomTariff: Number(p.revenueOfRoomTariff ?? 0),
    receivedAmount: Number(p.receivedAmount ?? 0),
    cashAmount: Number(p.cashAmount ?? 0),
    cashfreeAmount: Number(p.cashfreeAmount ?? 0),
    onlineAmountReceived: Number(p.onlineAmountReceived ?? 0),
    roomTariffDue: Number(p.roomTariffDue ?? 0),
    confirmedBookings: Number(p.confirmedBookings ?? 0),
    checkedInRooms: Number(p.checkedInRooms ?? 0),
    checkedOutRooms: Number(p.checkedOutRooms ?? 0),
    cancelledBookings: Number(p.cancelledBookings ?? 0),
    noShowBookings: Number(p.noShowBookings ?? 0),
    occupancyRate: typeof p.occupancyRate === 'string' ? p.occupancyRate : '0%',
    totalNumberOfRooms: Number(p.totalNumberOfRooms ?? 0),
    excelBase64: p.excelBase64,
    excelFileName: p.excelFileName
  };
}

function MetricCard({
  title,
  value,
  loading
}: {
  title: string;
  value: string | number;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
      </div>
      <div className="mt-2 text-3xl font-semibold text-gray-800">{value}</div>
    </div>
  );
}
