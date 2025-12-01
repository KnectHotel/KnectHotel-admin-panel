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

// type Totals = {
//   totalCount: number;
//   InitiatedCount: number;
//   InprogressCount: number;
//   CompletedCount: number;
//   RejectedCount: number;
// };

// type ByServiceRow = Totals & { serviceType: string | null | undefined };

// type RefundsReportRes = {
//   grandTotal: Totals[]; // usually length 1
//   byServiceType: ByServiceRow[];
// };

// const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');
// const nf = new Intl.NumberFormat('en-IN');

// function normalize(raw: any): { totals: Totals; byService: ByServiceRow[] } {
//   const gtArr: any[] = Array.isArray(raw?.grandTotal)
//     ? raw.grandTotal
//     : Array.isArray(raw?.data?.grandTotal)
//       ? raw.data.grandTotal
//       : [];
//   const totals: Totals = {
//     totalCount: Number(gtArr?.[0]?.totalCount ?? 0),
//     InitiatedCount: Number(gtArr?.[0]?.InitiatedCount ?? 0),
//     InprogressCount: Number(gtArr?.[0]?.InprogressCount ?? 0),
//     CompletedCount: Number(gtArr?.[0]?.CompletedCount ?? 0),
//     RejectedCount: Number(gtArr?.[0]?.RejectedCount ?? 0)
//   };

//   const bsArr: any[] = Array.isArray(raw?.byServiceType)
//     ? raw.byServiceType
//     : Array.isArray(raw?.data?.byServiceType)
//       ? raw.data.byServiceType
//       : [];

//   const byService: ByServiceRow[] = bsArr.map((r) => ({
//     totalCount: Number(r?.totalCount ?? 0),
//     InitiatedCount: Number(r?.InitiatedCount ?? 0),
//     InprogressCount: Number(r?.InprogressCount ?? 0),
//     CompletedCount: Number(r?.CompletedCount ?? 0),
//     RejectedCount: Number(r?.RejectedCount ?? 0),
//     serviceType: r?.serviceType ?? null
//   }));

//   return { totals, byService };
// }

// export default function RefundsReportsPage() {
//   const today = new Date();

//   // default: last 30 days through today
//   const [range, setRange] = useState<DateRange | undefined>({
//     from: subDays(today, 30),
//     to: today
//   });

//   const [data, setData] = useState<{
//     totals: Totals;
//     byService: ByServiceRow[];
//   } | null>(null);
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
//         // Specified payload first
//         const res = await apiCall('POST', '/api/reports/refunds', {
//           range: { startDate, endDate }
//         });
//         const payload = res?.data ?? res ?? {};
//         setData(normalize(payload));
//       } catch (eA: any) {
//         // Fallbacks: flat POST, then GET with query params
//         try {
//           const resB = await apiCall('POST', '/api/reports/refunds', {
//             startDate,
//             endDate
//           });
//           const payloadB = resB?.data ?? resB ?? {};
//           setData(normalize(payloadB));
//         } catch (eB: any) {
//           try {
//             const q = `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
//             const resC = await apiCall('GET', `/api/reports/refunds${q}`);
//             const payloadC = resC?.data ?? resC ?? {};
//             setData(normalize(payloadC));
//           } catch (eC: any) {
//             const msg =
//               eC?.response?.data?.message ||
//               eB?.response?.data?.message ||
//               eA?.response?.data?.message ||
//               eC?.message ||
//               eB?.message ||
//               eA?.message ||
//               'Refunds report endpoint not found';
//             setErr(`Failed to load refunds report. ${msg}`);
//             setData(null);
//           }
//         }
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [startDate, endDate]);

//   const totals = data?.totals;
//   const rows = data?.byService ?? [];

//   return (
//     <div className="flex min-h-screen w-full">
//       <div className="flex-1 flex flex-col">
//         <Navbar />

//         <div className="px-6 py-6 mt-16">
//           <div className="flex items-center justify-between">
//             <Heading title="Refunds Report" className="mt-0 md:mt-0" />

//             {/* Date Range Filter */}
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

//           {/* Error */}
//           {err && (
//             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//               {err}
//             </div>
//           )}

//           {/* Summary cards from grandTotal[0] */}
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
//             <MetricCard
//               title="Total Requests"
//               value={nf.format(totals?.totalCount ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Initiated"
//               value={nf.format(totals?.InitiatedCount ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="In-Progress"
//               value={nf.format(totals?.InprogressCount ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Completed"
//               value={nf.format(totals?.CompletedCount ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Rejected"
//               value={nf.format(totals?.RejectedCount ?? 0)}
//               loading={loading}
//             />
//           </div>

//           {/* Service-wise table */}
//           <div className="mt-10">
//             <h3 className="text-lg font-semibold mb-3">
//               Service-wise Breakdown
//             </h3>
//             <div className="overflow-auto rounded-xl border">
//               <table className="min-w-[820px] w-full text-sm">
//                 <thead className="bg-gray-50 text-gray-600">
//                   <tr>
//                     <Th>Service Type</Th>
//                     <Th className="text-right">Total</Th>
//                     <Th className="text-right">Initiated</Th>
//                     <Th className="text-right">In-Progress</Th>
//                     <Th className="text-right">Completed</Th>
//                     <Th className="text-right">Rejected</Th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(!rows || rows.length === 0) && (
//                     <tr>
//                       <td colSpan={6} className="p-4 text-center text-gray-500">
//                         No data for this range.
//                       </td>
//                     </tr>
//                   )}
//                   {rows.map((r, idx) => (
//                     <tr
//                       key={`${r.serviceType ?? 'unknown'}-${idx}`}
//                       className="border-t"
//                     >
//                       <Td className="font-medium">
//                         {r.serviceType || 'Unknown'}
//                       </Td>
//                       <TdRight>{nf.format(r.totalCount ?? 0)}</TdRight>
//                       <TdRight>{nf.format(r.InitiatedCount ?? 0)}</TdRight>
//                       <TdRight>{nf.format(r.InprogressCount ?? 0)}</TdRight>
//                       <TdRight>{nf.format(r.CompletedCount ?? 0)}</TdRight>
//                       <TdRight>{nf.format(r.RejectedCount ?? 0)}</TdRight>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-8">
//               <Link
//                 href="/hotel-panel/analytics-reports"
//                 className="text-sm underline hover:opacity-80"
//               >
//                 ← Back to Analytics & Reports
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* UI bits */
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

// function Th({
//   children,
//   className = ''
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <th
//       className={cn(
//         'px-3 py-2 text-left text-xs font-medium uppercase tracking-wide',
//         className
//       )}
//     >
//       {children}
//     </th>
//   );
// }
// function Td({
//   children,
//   className = ''
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <td className={cn('px-3 py-2 align-middle', className)}>{children}</td>
//   );
// }
// function TdRight({
//   children,
//   className = ''
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <td className={cn('px-3 py-2 text-right align-middle', className)}>
//       {children}
//     </td>
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
import { Calendar as CalendarIcon, Loader2, Download } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import apiCall from '@/lib/axios';
import { cn } from '@/lib/utils';

type Totals = {
  totalCount: number;
  InitiatedCount: number;
  InprogressCount: number;
  CompletedCount: number;
  RejectedCount: number;
};

type ByServiceRow = Totals & { serviceType: string | null | undefined };

type RefundsReportRes = {
  grandTotal: Totals[]; // usually length 1
  byServiceType: ByServiceRow[];
  excelBase64?: string;
  excelFileName?: string;
};

const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');
const nf = new Intl.NumberFormat('en-IN');

function normalize(raw: any): {
  totals: Totals;
  byService: ByServiceRow[];
  excelBase64?: string;
  excelFileName?: string;
} {
  const gtArr: any[] = Array.isArray(raw?.grandTotal)
    ? raw.grandTotal
    : Array.isArray(raw?.data?.grandTotal)
      ? raw.data.grandTotal
      : [];
  const totals: Totals = {
    totalCount: Number(gtArr?.[0]?.totalCount ?? 0),
    InitiatedCount: Number(gtArr?.[0]?.InitiatedCount ?? 0),
    InprogressCount: Number(gtArr?.[0]?.InprogressCount ?? 0),
    CompletedCount: Number(gtArr?.[0]?.CompletedCount ?? 0),
    RejectedCount: Number(gtArr?.[0]?.RejectedCount ?? 0)
  };

  const bsArr: any[] = Array.isArray(raw?.byServiceType)
    ? raw.byServiceType
    : Array.isArray(raw?.data?.byServiceType)
      ? raw.data.byServiceType
      : [];

  const byService: ByServiceRow[] = bsArr.map((r) => ({
    totalCount: Number(r?.totalCount ?? 0),
    InitiatedCount: Number(r?.InitiatedCount ?? 0),
    InprogressCount: Number(r?.InprogressCount ?? 0),
    CompletedCount: Number(r?.CompletedCount ?? 0),
    RejectedCount: Number(r?.RejectedCount ?? 0),
    serviceType: r?.serviceType ?? null
  }));

  return {
    totals,
    byService,
    excelBase64: raw.excelBase64 ?? raw.data?.excelBase64,
    excelFileName: raw.excelFileName ?? raw.data?.excelFileName
  };
}

export default function RefundsReportsPage() {
  const today = new Date();

  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(today, 30),
    to: today
  });

  const [data, setData] = useState<{
    totals: Totals;
    byService: ByServiceRow[];
    excelBase64?: string;
    excelFileName?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const startDate = useMemo(
    () => (range?.from ? toYMD(range.from) : undefined),
    [range?.from]
  );
  const endDate = useMemo(
    () => (range?.to ? toYMD(range.to) : undefined),
    [range?.to]
  );

  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) return;
      setLoading(true);
      setErr(null);
      try {
        const res = await apiCall('POST', '/api/reports/refunds', {
          range: { startDate, endDate }
        });
        const normalized = normalize(res?.data ?? res ?? {});
        setData(normalized);
      } catch (eA: any) {
        try {
          const resB = await apiCall('POST', '/api/reports/refunds', {
            startDate,
            endDate
          });
          const normalized = normalize(resB?.data ?? resB ?? {});
          setData(normalized);
        } catch (eB: any) {
          try {
            const q = `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
            const resC = await apiCall('GET', `/api/reports/refunds${q}`);
            const normalized = normalize(resC?.data ?? resC ?? {});
            setData(normalized);
          } catch (eC: any) {
            const msg =
              eC?.response?.data?.message ||
              eB?.response?.data?.message ||
              eA?.response?.data?.message ||
              eC?.message ||
              eB?.message ||
              eA?.message ||
              'Refunds report endpoint not found';
            setErr(`Failed to load refunds report. ${msg}`);
            setData(null);
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate]);

  function handleExcelDownload() {
    if (!data?.excelBase64 || !data?.excelFileName) return;
    setDownloading(true);
    try {
      const binary = atob(data.excelBase64);
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
      a.download = data.excelFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  }

  const totals = data?.totals;
  const rows = data?.byService ?? [];

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="px-6 py-6 mt-16">
          <div className="flex items-center justify-between mb-4">
            <Heading title="Refunds Report" className="mt-0 md:mt-0" />

            {/* Date Range Filter + Download Button */}
            <div className="flex gap-3 items-center">
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
                    onSelect={(r) => {
                      if (!r) return setRange(undefined);
                      const next: DateRange = {
                        from: r.from,
                        to: r.to ?? today
                      };
                      if (next.to && next.to > today) next.to = today;
                      if (next.from && next.from > today) next.from = today;
                      setRange(next);
                    }}
                    defaultMonth={range?.to ?? today}
                    disabled={{ after: today }}
                    toMonth={today}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="secondary"
                onClick={handleExcelDownload}
                // disabled={!data?.excelBase64 || downloading}
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
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <MetricCard
              title="Total Requests"
              value={nf.format(totals?.totalCount ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Initiated"
              value={nf.format(totals?.InitiatedCount ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="In-Progress"
              value={nf.format(totals?.InprogressCount ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Completed"
              value={nf.format(totals?.CompletedCount ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Rejected"
              value={nf.format(totals?.RejectedCount ?? 0)}
              loading={loading}
            />
          </div>

          {/* Service-wise table */}
          <div className="overflow-auto rounded-xl border">
            <table className="min-w-[820px] w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <Th>Service Type</Th>
                  <Th className="text-right">Total</Th>
                  <Th className="text-right">Initiated</Th>
                  <Th className="text-right">In-Progress</Th>
                  <Th className="text-right">Completed</Th>
                  <Th className="text-right">Rejected</Th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No data for this range.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, idx) => (
                    <tr
                      key={`${r.serviceType ?? 'unknown'}-${idx}`}
                      className="border-t"
                    >
                      <Td className="font-medium">
                        {r.serviceType || 'Unknown'}
                      </Td>
                      <TdRight>{nf.format(r.totalCount ?? 0)}</TdRight>
                      <TdRight>{nf.format(r.InitiatedCount ?? 0)}</TdRight>
                      <TdRight>{nf.format(r.InprogressCount ?? 0)}</TdRight>
                      <TdRight>{nf.format(r.CompletedCount ?? 0)}</TdRight>
                      <TdRight>{nf.format(r.RejectedCount ?? 0)}</TdRight>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Back link */}
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

/* UI components */
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
      <div className="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">
        {value}
      </div>
    </div>
  );
}

function Th({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        'px-3 py-2 text-left text-xs font-medium uppercase tracking-wide',
        className
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn('px-3 py-2 align-middle', className)}>{children}</td>
  );
}

function TdRight({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn('px-3 py-2 text-right align-middle', className)}>
      {children}
    </td>
  );
}
