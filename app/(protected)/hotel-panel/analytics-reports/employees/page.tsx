// // app/analytics/employees/page.tsx
// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import Link from 'next/link';
// import { format, subDays } from 'date-fns';
// import type { DateRange } from 'react-day-picker';

// import Navbar from '@/components/Navbar';

// import { Heading } from '@/components/ui/heading';
// import { Button } from '@/components/ui/button';
// import { Calendar as CalendarIcon, Loader2, Sidebar } from 'lucide-react';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import apiCall from '@/lib/axios';
// import { cn } from '@/lib/utils'; // if you have a cn helper; otherwise remove cn()

// type EmployeesReportRes = {
//   totalCount: number;
//   activeCount: number;
//   inactiveCount: number;
// };

// const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');

// export default function EmployeesReportsPage() {
//   // default: last 30 days
//   const [range, setRange] = useState<DateRange | undefined>({
//     from: subDays(new Date(), 30),
//     to: new Date()
//   });

//   const [data, setData] = useState<EmployeesReportRes | null>(null);
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
//     const fetchData = async () => {
//       if (!startDate || !endDate) return;
//       setLoading(true);
//       setErr(null);
//       try {
//         const res = await apiCall('POST', '/api/reports/employees', {
//           range: { startDate, endDate }
//         });
//         console.log('ressss', res);
//         // res might be { totalCount, activeCount, inactiveCount } directly,
//         // or res.data.* depending on your apiCall wrapper. Adjust if needed:
//         const payload: EmployeesReportRes = res?.data ??
//           res ?? { totalCount: 0, activeCount: 0, inactiveCount: 0 };

//         setData({
//           totalCount: Number(payload.totalCount || 0),
//           activeCount: Number(payload.activeCount || 0),
//           inactiveCount: Number(payload.inactiveCount || 0)
//         });
//       } catch (e: any) {
//         console.error(e);
//         setErr(e?.response?.data?.message || 'Failed to load employee report');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [startDate, endDate]);

//   return (
//     <div className="flex min-h-screen w-full">
//       {/* Main */}
//       <div className="flex-1 flex flex-col">
//         {/* Navbar */}
//         <Navbar />

//         {/* Content */}
//         <div className="px-6 py-6 mt-16">
//           <div className="flex items-center justify-between">
//             <Heading title="Employee Reports" className="mt-0 md:mt-0" />

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
//                   onSelect={(r) => setRange(r)}
//                   defaultMonth={range?.from}
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

//           {/* Cards */}
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <MetricCard
//               title="Total Employees"
//               value={data?.totalCount ?? 0}
//               loading={loading}
//             />
//             <MetricCard
//               title="Active Employees"
//               value={data?.activeCount ?? 0}
//               loading={loading}
//             />
//             <MetricCard
//               title="Inactive Employees"
//               value={data?.inactiveCount ?? 0}
//               loading={loading}
//             />
//           </div>

//           {/* Back link */}
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

// function MetricCard({
//   title,
//   value,
//   loading
// }: {
//   title: string;
//   value: number;
//   loading?: boolean;
// }) {
//   return (
//     <div className="rounded-2xl border bg-white p-5 shadow-sm">
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-gray-500">{title}</p>
//         {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
//       </div>
//       <div className="mt-2 text-3xl font-semibold text-gray-800">{value}</div>
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

interface EmployeesReportRes {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  // optional Excel fields from API
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
  filename = 'employees.xlsx',
  mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
) {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++)
    byteNumbers[i] = byteChars.charCodeAt(i);
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- Components ----------
function MetricCard({
  title,
  value,
  loading
}: {
  title: string;
  value: number;
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

function SplitBar({ left, right }: { left: number; right: number }) {
  const total = left + right;
  const lp = percent(left, total);
  const rp = 100 - lp;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Active: {lp}%</span>
        <span>Inactive: {rp}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border bg-muted/40">
        <div className="h-full bg-emerald-500" style={{ width: `${lp}%` }} />
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function EmployeesReportsPage() {
  // default: last 30 days
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const [data, setData] = useState<EmployeesReportRes | null>(null);
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
      const res = await apiCall('POST', '/api/reports/employees', {
        range: { startDate, endDate }
      });

      const payload: EmployeesReportRes = res?.data ??
        res ?? {
          totalCount: 0,
          activeCount: 0,
          inactiveCount: 0
        };

      setData({
        totalCount: Number(payload.totalCount || 0),
        activeCount: Number(payload.activeCount || 0),
        inactiveCount: Number(payload.inactiveCount || 0),
        excelBase64: payload.excelBase64,
        excelFileName: payload.excelFileName
      });
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Failed to load employee report');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadExcel() {
    if (!startDate || !endDate) return;
    setDownloading(true);
    try {
      // Re-fetch to ensure we have a fresh file for the current range
      const res = await apiCall('POST', '/api/reports/employees', {
        range: { startDate, endDate }
      });
      const fresh: EmployeesReportRes = (res?.data ??
        res) as EmployeesReportRes;

      const base64 = fresh?.excelBase64 ?? data?.excelBase64;
      const filename =
        fresh?.excelFileName ??
        data?.excelFileName ??
        `Employees_${startDate}_to_${endDate}.xlsx`;

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

  // initial + whenever dates change
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const total = data?.totalCount ?? 0;
  const active = data?.activeCount ?? 0;
  const inactive = data?.inactiveCount ?? 0;

  return (
    <div className="flex min-h-screen w-full">
      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="px-6 py-6 mt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Heading title="Employee Reports" className="mt-0 md:mt-0" />

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

          {/* Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Total Employees"
              value={total}
              loading={loading}
            />
            <MetricCard
              title="Active Employees"
              value={active}
              loading={loading}
            />
            <MetricCard
              title="Inactive Employees"
              value={inactive}
              loading={loading}
            />
          </div>

          {/* Split bar visualization */}
          <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-3 text-sm text-muted-foreground">
              Distribution
            </div>
            <SplitBar left={active} right={inactive} />
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
