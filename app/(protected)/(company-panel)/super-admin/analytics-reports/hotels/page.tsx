// 'use client';

// // app/analytics/hotels/page.tsx
// // Hotels counts analytics with date-range filter, metrics, and status split visualization

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
// interface HotelsCountsRes {
//   total: number;
//   active: number;
//   inactive: number;
//   pendingApproval: number;
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

// function TripleSplitBar({ a, b, c, labels = ['Active', 'Inactive', 'Pending'] }: { a: number; b: number; c: number; labels?: [string, string, string] | string[] }) {
//   const total = a + b + c;
//   const ap = percent(a, total);
//   const bp = percent(b, total);
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
//         <div className="h-full bg-indigo-500" style={{ width: `${cp}%` }} />
//       </div>
//     </div>
//   );
// }

// // ---------- Page ----------
// export default function HotelsCountsReportsPage() {
//   // default: last 30 days
//   const [range, setRange] = useState<DateRange | undefined>({
//     from: subDays(new Date(), 30),
//     to: new Date(),
//   });

//   const [data, setData] = useState<HotelsCountsRes | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   const startDate = useMemo(() => (range?.from ? toYMD(range.from) : undefined), [range?.from]);
//   const endDate = useMemo(() => (range?.to ? toYMD(range.to) : undefined), [range?.to]);

//   async function load() {
//     if (!startDate || !endDate) return;
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await apiCall('POST', '/api/reports/hotel-counts', { range: { startDate, endDate } });
//       const payload: HotelsCountsRes = (res?.data ?? res ?? {}) as HotelsCountsRes;
//       setData({
//         total: Number(payload?.total || 0),
//         active: Number(payload?.active || 0),
//         inactive: Number(payload?.inactive || 0),
//         pendingApproval: Number(payload?.pendingApproval || 0),
//       });
//     } catch (e: any) {
//       setErr(e?.response?.data?.message || 'Failed to load hotel counts');
//       setData({ total: 0, active: 0, inactive: 0, pendingApproval: 0 });
//     } finally {
//       setLoading(false);
//     }
//   }

//   // initial + on date change
//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [startDate, endDate]);

//   const total = data?.total ?? 0;
//   const active = data?.active ?? 0;
//   const inactive = data?.inactive ?? 0;
//   const pending = data?.pendingApproval ?? 0;

//   return (
//     <div className="flex min-h-screen w-full">
//       {/* Main */}
//       <div className="flex-1 flex flex-col">
//         <Navbar />

//         <div className="px-6 py-6 mt-16">
//           <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//             <Heading title="Hotels Reports" className="mt-0 md:mt-0" />

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

//           {/* Metrics */}
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
//             <MetricCard title="Total Hotels" value={total} loading={loading} />
//             <MetricCard title="Active" value={active} loading={loading} />
//             <MetricCard title="Inactive" value={inactive} loading={loading} />
//             <MetricCard title="Pending Approval" value={pending} loading={loading} />
//           </div>

//           {/* Status split */}
//           <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
//             <div className="mb-3 text-sm text-muted-foreground">Status Split</div>
//             <TripleSplitBar a={active} b={inactive} c={pending} labels={["Active", "Inactive", "Pending"]} />
//             <div className="mt-3 text-xs text-muted-foreground">Endpoint: <code>/api/reports/hotel-counts</code></div>
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

// app/analytics/hotels/page.tsx

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
interface HotelsCountsRes {
  total: number;
  active: number;
  inactive: number;
  pendingApproval: number;
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
  filename = 'hotelCounts.xlsx',
  mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
) {
  const clean = base64
    .replace(/^data:.*?;base64,/, '')
    .replace(/[\r\n]+/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const bytes = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
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
  labels = ['Active', 'Inactive', 'Pending']
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
        <div className="h-full bg-indigo-500" style={{ width: `${cp}%` }} />
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function HotelsCountsReportsPage() {
  // default: last 30 days
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const [data, setData] = useState<HotelsCountsRes | null>(null);
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

  async function fetchCounts() {
    const res = await apiCall('POST', '/api/reports/hotel-counts', {
      range: { startDate, endDate }
    });
    return res?.data ?? res ?? {};
  }

  async function load() {
    if (!startDate || !endDate) return;
    setLoading(true);
    setErr(null);
    try {
      const payload: HotelsCountsRes = (await fetchCounts()) as HotelsCountsRes;
      setData({
        total: Number(payload?.total || 0),
        active: Number(payload?.active || 0),
        inactive: Number(payload?.inactive || 0),
        pendingApproval: Number(payload?.pendingApproval || 0),
        excelBase64: payload?.excelBase64,
        excelFileName: payload?.excelFileName
      });
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Failed to load hotel counts');
      setData({ total: 0, active: 0, inactive: 0, pendingApproval: 0 });
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadExcel() {
    if (!startDate || !endDate) return;
    setDownloading(true);
    try {
      // re-fetch to ensure freshest file; fall back to current state if no base64 in fresh
      const fresh = (await fetchCounts()) as HotelsCountsRes;
      const base64 = fresh?.excelBase64 ?? data?.excelBase64;
      const file =
        fresh?.excelFileName ??
        data?.excelFileName ??
        `hotelCounts_${startDate}_to_${endDate}.xlsx`;
      if (!base64) {
        alert('Excel file not provided by API for the selected range.');
        return;
      }
      downloadBase64File(base64, file);
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

  const total = data?.total ?? 0;
  const active = data?.active ?? 0;
  const inactive = data?.inactive ?? 0;
  const pending = data?.pendingApproval ?? 0;

  return (
    <div className="flex min-h-screen w-full">
      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="px-6 py-6 mt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Heading title="Hotels Reports" className="mt-0 md:mt-0" />

            {/* Date Range + Download */}
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

              <Button
                onClick={handleDownloadExcel}
                disabled={downloading || loading || !startDate || !endDate}
              >
                {downloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                    Downloading…
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download Excel
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

          {/* Metrics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard title="Total Hotels" value={total} loading={loading} />
            <MetricCard title="Active" value={active} loading={loading} />
            <MetricCard title="Inactive" value={inactive} loading={loading} />
            <MetricCard
              title="Pending Approval"
              value={pending}
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
              b={inactive}
              c={pending}
              labels={['Active', 'Inactive', 'Pending']}
            />
            {/* <div className="mt-3 text-xs text-muted-foreground">Endpoint: <code>/api/reports/hotel-counts</code></div> */}
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
