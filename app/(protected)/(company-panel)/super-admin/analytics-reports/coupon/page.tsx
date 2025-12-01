// 'use client';

// // app/analytics/coupons/page.tsx
// // Coupons analytics with date-range filter, metrics, and simple status split visualization

// import { useEffect, useMemo, useState } from 'react';
// import Link from 'next/link';
// import { format, subDays } from 'date-fns';
// import type { DateRange } from 'react-day-picker';

// import Navbar from '@/components/Navbar';
// import { Heading } from '@/components/ui/heading';
// import { Button } from '@/components/ui/button';
// import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import apiCall from '@/lib/axios';
// import { cn } from '@/lib/utils';

// // ---------- Types ----------
// interface CouponsReportRes {
//   totalCount: number;
//   activeCount: number;
//   expiredCount: number;
//   disabledCount: number;
//   totalRedeemed: number;
// }

// // ---------- Utils ----------
// const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');

// function percent(part: number, total: number) {
//   if (!total) return 0;
//   const p = Math.round((part / total) * 100);
//   return Number.isFinite(p) ? p : 0;
// }

// // ---------- UI Bits ----------
// function MetricCard({ title, value, subtitle, loading }: { title: string; value: number | string; subtitle?: string; loading?: boolean }) {
//   return (
//     <div className="rounded-2xl border bg-white p-5 shadow-sm">
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-gray-500">{title}</p>
//         {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
//       </div>
//       <div className="mt-2 text-3xl font-semibold text-gray-800">{value}</div>
//       {subtitle && <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>}
//     </div>
//   );
// }

// function TripleSplitBar({ a, b, c, labels = ['Active', 'Expired', 'Disabled'] }: { a: number; b: number; c: number; labels?: [string, string, string] | string[] }) {
//   const total = a + b + c;
//   const ap = percent(a, total);
//   const bp = percent(b, total);
//   // ensure sum 100 by assigning remainder to last segment
//   const cp = Math.max(0, 100 - ap - bp);
//   return (
//     <div>
//       <div className="mb-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
//         <span>{labels[0]}: {ap}%</span>
//         <span>{labels[1]}: {bp}%</span>
//         <span>{labels[2]}: {cp}%</span>
//       </div>
//       <div className="h-3 w-full overflow-hidden rounded-full border bg-muted/40 flex">
//         <div className="h-full bg-emerald-500" style={{ width: `${ap}%` }} />
//         <div className="h-full bg-amber-500" style={{ width: `${bp}%` }} />
//         <div className="h-full bg-rose-500" style={{ width: `${cp}%` }} />
//       </div>
//     </div>
//   );
// }

// // ---------- Page ----------
// export default function CouponsReportsPage() {
//   // default: last 30 days
//   const [range, setRange] = useState<DateRange | undefined>({
//     from: subDays(new Date(), 30),
//     to: new Date(),
//   });

//   const [data, setData] = useState<CouponsReportRes | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   const startDate = useMemo(() => (range?.from ? toYMD(range.from) : undefined), [range?.from]);
//   const endDate = useMemo(() => (range?.to ? toYMD(range.to) : undefined), [range?.to]);

//   async function load() {
//     if (!startDate || !endDate) return;
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await apiCall('POST', '/api/reports/coupons', { range: { startDate, endDate } });
//       const payload: CouponsReportRes = (res?.data ?? res ?? {}) as CouponsReportRes;
//       setData({
//         totalCount: Number(payload?.totalCount || 0),
//         activeCount: Number(payload?.activeCount || 0),
//         expiredCount: Number(payload?.expiredCount || 0),
//         disabledCount: Number(payload?.disabledCount || 0),
//         totalRedeemed: Number(payload?.totalRedeemed || 0),
//       });
//     } catch (e: any) {
//       setErr(e?.response?.data?.message || 'Failed to load coupons report');
//       setData({ totalCount: 0, activeCount: 0, expiredCount: 0, disabledCount: 0, totalRedeemed: 0 });
//     } finally {
//       setLoading(false);
//     }
//   }

//   // initial + on date change
//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [startDate, endDate]);

//   const total = data?.totalCount ?? 0;
//   const active = data?.activeCount ?? 0;
//   const expired = data?.expiredCount ?? 0;
//   const disabled = data?.disabledCount ?? 0;
//   const redeemed = data?.totalRedeemed ?? 0;

//   return (
//     <div className="flex min-h-screen w-full">
//       {/* Main */}
//       <div className="flex-1 flex flex-col">
//         <Navbar />

//         <div className="px-6 py-6 mt-16">
//           <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//             <Heading title="Coupons Reports" className="mt-0 md:mt-0" />

//             {/* Date Range Filter */}
//             <div className="flex items-center gap-2">
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn(
//                       'w-full sm:w-auto justify-start text-left font-normal',
//                       !startDate || !endDate ? 'text-muted-foreground' : ''
//                     )}
//                   >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {startDate && endDate ? `${startDate} → ${endDate}` : 'Pick a date range'}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="end">
//                   <Calendar
//                     mode="range"
//                     numberOfMonths={2}
//                     selected={range}
//                     onSelect={(r) => setRange(r)}
//                     defaultMonth={range?.from}
//                   />
//                 </PopoverContent>
//               </Popover>

//               <Button onClick={load} disabled={loading}>
//                 {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…</> : 'Refresh'}
//               </Button>
//             </div>
//           </div>

//           {/* Error */}
//           {err && (
//             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//               {err}
//             </div>
//           )}

//           {/* Top metrics */}
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
//             <MetricCard title="Total Coupons" value={total} loading={loading} />
//             <MetricCard title="Active" value={active} loading={loading} />
//             <MetricCard title="Expired" value={expired} loading={loading} />
//             <MetricCard title="Disabled" value={disabled} loading={loading} />
//             <MetricCard title="Total Redeemed" value={redeemed} loading={loading} />
//           </div>

//           {/* Status split */}
//           <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
//             <div className="mb-3 text-sm text-muted-foreground">Status Split</div>
//             <TripleSplitBar a={active} b={expired} c={disabled} labels={["Active", "Expired", "Disabled"]} />
//             <div className="mt-3 text-xs text-muted-foreground">Endpoint: <code>/api/reports/coupons</code></div>
//           </div>

//           {/* Back link */}
//           <div className="mt-8">
//             <Link href="/hotel-panel/analytics-reports" className="text-sm underline hover:opacity-80">
//               ← Back to Analytics & Reports
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

// app/analytics/coupons/page.tsx
// Coupons analytics with date-range filter, metrics, status split, and Excel download

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

// ---------- Types ----------
interface CouponsReportRes {
  totalCount: number;
  activeCount: number;
  expiredCount: number;
  disabledCount: number;
  totalRedeemed: number;
  // Excel fields from API (optional)
  excelBase64?: string;
  excelFileName?: string;
}

// ---------- Utils ----------
const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');

function percent(part: number, total: number) {
  if (!total) return 0;
  const p = Math.round((part / total) * 100);
  return Number.isFinite(p) ? p : 0;
}

function downloadBase64File(
  base64: string,
  filename = 'report.xlsx',
  mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
) {
  const clean = base64
    .replace(/^data:.*?;base64,/, '')
    .replace(/[\r\n]+/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const byteChars = atob(clean);
  const bytes = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);

  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'report.xlsx';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- UI Bits ----------
function MetricCard({
  title,
  value,
  subtitle,
  loading
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
      </div>
      <div className="mt-2 text-3xl font-semibold text-gray-800">{value}</div>
      {subtitle && (
        <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
      )}
    </div>
  );
}

function TripleSplitBar({
  a,
  b,
  c,
  labels = ['Active', 'Expired', 'Disabled']
}: {
  a: number;
  b: number;
  c: number;
  labels?: [string, string, string] | string[];
}) {
  const total = a + b + c;
  const ap = percent(a, total);
  const bp = percent(b, total);
  const cp = Math.max(0, 100 - ap - bp);
  return (
    <div>
      <div className="mb-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <span>
          {labels[0]}: {ap}%
        </span>
        <span>
          {labels[1]}: {bp}%
        </span>
        <span>
          {labels[2]}: {cp}%
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border bg-muted/40 flex">
        <div className="h-full bg-emerald-500" style={{ width: `${ap}%` }} />
        <div className="h-full bg-amber-500" style={{ width: `${bp}%` }} />
        <div className="h-full bg-rose-500" style={{ width: `${cp}%` }} />
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function CouponsReportsPage() {
  // default: last 30 days
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const [data, setData] = useState<CouponsReportRes | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const startDate = useMemo(
    () => (range?.from ? toYMD(range.from) : undefined),
    [range?.from]
  );
  const endDate = useMemo(
    () => (range?.to ? toYMD(range.to) : undefined),
    [range?.to]
  );

  async function load() {
    if (!startDate || !endDate) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await apiCall('POST', '/api/reports/coupons', {
        range: { startDate, endDate }
      });
      const payload = (res?.data ?? res ?? {}) as CouponsReportRes;

      setData({
        totalCount: Number(payload?.totalCount ?? 0),
        activeCount: Number(payload?.activeCount ?? 0),
        expiredCount: Number(payload?.expiredCount ?? 0),
        disabledCount: Number(payload?.disabledCount ?? 0),
        totalRedeemed: Number(payload?.totalRedeemed ?? 0),
        excelBase64: (payload as any).excelBase64,
        excelFileName: (payload as any).excelFileName
      });
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Failed to load coupons report');
      setData({
        totalCount: 0,
        activeCount: 0,
        expiredCount: 0,
        disabledCount: 0,
        totalRedeemed: 0
      });
    } finally {
      setLoading(false);
    }
  }

  // Excel download (re-fetch for the current range; fallback to cached)
  async function handleDownloadExcel() {
    if (!startDate || !endDate) return;
    setDownloading(true);
    try {
      const res = await apiCall('POST', '/api/reports/coupons', {
        range: { startDate, endDate }
      });
      const fresh = (res?.data ?? res) as Partial<CouponsReportRes> & {
        excelBase64?: string;
        excelFileName?: string;
      };

      const base64 = fresh?.excelBase64 ?? data?.excelBase64;
      const filename =
        fresh?.excelFileName ??
        data?.excelFileName ??
        `couponCount_${startDate}_to_${endDate}.xlsx`;

      if (!base64) {
        alert('Excel file not provided by API response.');
        return;
      }
      downloadBase64File(base64, filename);
    } catch (e) {
      console.error(e);
      alert('Failed to download Excel.');
    } finally {
      setDownloading(false);
    }
  }

  // initial + on date change
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const total = data?.totalCount ?? 0;
  const active = data?.activeCount ?? 0;
  const expired = data?.expiredCount ?? 0;
  const disabled = data?.disabledCount ?? 0;
  const redeemed = data?.totalRedeemed ?? 0;

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="px-6 py-6 mt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Heading title="Coupons Reports" className="mt-0 md:mt-0" />

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

              <Button onClick={load} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
                  </>
                ) : (
                  'Refresh'
                )}
              </Button>

              {/* Download Excel */}
              <Button
                variant="secondary"
                onClick={handleDownloadExcel}
                disabled={!startDate || !endDate || downloading || loading}
              >
                <Download className="mr-2 h-4 w-4" />
                {downloading ? 'Downloading…' : 'Download Excel'}
              </Button>
            </div>
          </div>

          {/* Error */}
          {err && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          {/* Top metrics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
            <MetricCard title="Total Coupons" value={total} loading={loading} />
            <MetricCard title="Active" value={active} loading={loading} />
            <MetricCard title="Expired" value={expired} loading={loading} />
            <MetricCard title="Disabled" value={disabled} loading={loading} />
            <MetricCard
              title="Total Redeemed"
              value={redeemed}
              loading={loading}
            />
          </div>

          {/* Status split */}
          <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-3 text-sm text-muted-foreground">
              Status Split
            </div>
            <TripleSplitBar
              a={active}
              b={expired}
              c={disabled}
              labels={['Active', 'Expired', 'Disabled']}
            />
            {/* <div className="mt-3 text-xs text-muted-foreground">
              Endpoint: <code>/api/reports/coupons</code>
            </div> */}
          </div>

          {/* Back link */}
          <div className="mt-8">
            <Link
              href="/super-admin/analytics-reports"
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
