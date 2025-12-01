// // // // // // 'use client';

// // // // // // import { useEffect, useMemo, useState } from 'react';
// // // // // // import Link from 'next/link';

// // // // // // import Navbar from '@/components/Navbar';
// // // // // // import { Heading } from '@/components/ui/heading';
// // // // // // import { Button } from '@/components/ui/button';
// // // // // // import { Loader2, RefreshCw } from 'lucide-react';
// // // // // // import apiCall from '@/lib/axios';
// // // // // // import { cn } from '@/lib/utils';

// // // // // // import {
// // // // // //   Select,
// // // // // //   SelectContent,
// // // // // //   SelectItem,
// // // // // //   SelectTrigger,
// // // // // //   SelectValue
// // // // // // } from '@/components/ui/select';

// // // // // // import {
// // // // // //   ResponsiveContainer,
// // // // // //   AreaChart,
// // // // // //   Area,
// // // // // //   XAxis,
// // // // // //   YAxis,
// // // // // //   Tooltip,
// // // // // //   CartesianGrid
// // // // // // } from 'recharts';

// // // // // // // ---------- Types ----------
// // // // // // type IncomeSeriesResponse = {
// // // // // //   labels: string[];
// // // // // //   data: number[];
// // // // // // };

// // // // // // type RangeKey = 'lastYear' | 'halfYear' | 'lastMonth' | 'lastWeek' | 'today';

// // // // // // // ---------- Helpers ----------
// // // // // // const RANGE_OPTIONS: { label: string; value: RangeKey }[] = [
// // // // // //   { label: 'Last Year (24 mo)', value: 'lastYear' },
// // // // // //   { label: 'Last 6 Months', value: 'halfYear' },
// // // // // //   { label: 'Last Month', value: 'lastMonth' },
// // // // // //   { label: 'Last Week', value: 'lastWeek' },
// // // // // //   { label: 'Today', value: 'today' }
// // // // // // ];

// // // // // // const INR = new Intl.NumberFormat('en-IN', {
// // // // // //   style: 'currency',
// // // // // //   currency: 'INR',
// // // // // //   maximumFractionDigits: 0
// // // // // // });

// // // // // // function zipToSeries(labels: string[], values: number[]) {
// // // // // //   const n = Math.min(labels.length, values.length);
// // // // // //   return Array.from({ length: n }, (_, i) => ({
// // // // // //     label: labels[i],
// // // // // //     value: Number(values[i] || 0)
// // // // // //   }));
// // // // // // }

// // // // // // // ---------- Page ----------
// // // // // // export default function IncomeTimeSeriesPage() {
// // // // // //   const [range, setRange] = useState<RangeKey>('lastYear');
// // // // // //   const [series, setSeries] = useState<{ label: string; value: number }[]>([]);
// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const [err, setErr] = useState<string | null>(null);

// // // // // //   const total = useMemo(
// // // // // //     () => series.reduce((sum, d) => sum + (d.value || 0), 0),
// // // // // //     [series]
// // // // // //   );

// // // // // //   useEffect(() => {
// // // // // //     (async () => {
// // // // // //       setLoading(true);
// // // // // //       setErr(null);
// // // // // //       try {
// // // // // //         // POST only (GET returns 404 on your UAT)
// // // // // //         const res = await apiCall('POST', '/api/reports/income-time-series', {
// // // // // //           range
// // // // // //         });
// // // // // //         const payload: IncomeSeriesResponse = res?.data ?? res ?? ({} as any);
// // // // // //         setSeries(zipToSeries(payload.labels || [], payload.data || []));
// // // // // //       } catch (e: any) {
// // // // // //         const status = e?.response?.status;
// // // // // //         const msg =
// // // // // //           e?.response?.data?.message ||
// // // // // //           e?.message ||
// // // // // //           'Failed to load income time series';
// // // // // //         console.error('[income-time-series] FAIL', {
// // // // // //           status,
// // // // // //           msg,
// // // // // //           url: e?.config?.url,
// // // // // //           method: e?.config?.method
// // // // // //         });
// // // // // //         setErr(`Error ${status ?? 'NA'}: ${msg}`);
// // // // // //       } finally {
// // // // // //         setLoading(false);
// // // // // //       }
// // // // // //     })();
// // // // // //   }, [range]);

// // // // // //   return (
// // // // // //     <div className="flex min-h-screen w-full">
// // // // // //       <div className="flex-1 flex flex-col">
// // // // // //         <Navbar />

// // // // // //         <div className="px-6 py-6 mt-16">
// // // // // //           <div className="flex items-center justify-between">
// // // // // //             <Heading title="Income Time Series" className="mt-0 md:mt-0" />

// // // // // //             <div className="flex items-center gap-3">
// // // // // //               {/* Range selector */}
// // // // // //               <Select
// // // // // //                 value={range}
// // // // // //                 onValueChange={(v) => setRange(v as RangeKey)}
// // // // // //               >
// // // // // //                 <SelectTrigger className="min-w-[200px]">
// // // // // //                   <SelectValue placeholder="Select range" />
// // // // // //                 </SelectTrigger>
// // // // // //                 <SelectContent>
// // // // // //                   {RANGE_OPTIONS.map((opt) => (
// // // // // //                     <SelectItem key={opt.value} value={opt.value}>
// // // // // //                       {opt.label}
// // // // // //                     </SelectItem>
// // // // // //                   ))}
// // // // // //                 </SelectContent>
// // // // // //               </Select>

// // // // // //               <Button
// // // // // //                 variant="outline"
// // // // // //                 size="icon"
// // // // // //                 onClick={() => setRange((r) => r)} // retrigger effect
// // // // // //                 title="Refresh"
// // // // // //               >
// // // // // //                 {loading ? (
// // // // // //                   <Loader2 className="h-4 w-4 animate-spin" />
// // // // // //                 ) : (
// // // // // //                   <RefreshCw className="h-4 w-4" />
// // // // // //                 )}
// // // // // //               </Button>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Error */}
// // // // // //           {err && (
// // // // // //             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// // // // // //               {err}
// // // // // //             </div>
// // // // // //           )}

// // // // // //           {/* Summary */}
// // // // // //           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
// // // // // //             <SummaryCard
// // // // // //               title="Points"
// // // // // //               value={`${series.length}`}
// // // // // //               loading={loading}
// // // // // //             />
// // // // // //             <SummaryCard
// // // // // //               title="Total Income"
// // // // // //               value={INR.format(total)}
// // // // // //               loading={loading}
// // // // // //             />
// // // // // //             <SummaryCard
// // // // // //               title="Avg per Point"
// // // // // //               value={series.length ? INR.format(total / series.length) : '—'}
// // // // // //               loading={loading}
// // // // // //             />
// // // // // //           </div>

// // // // // //           {/* Chart */}
// // // // // //           <div className="mt-8 rounded-2xl border bg-white p-4">
// // // // // //             <div className="flex items-center justify-between mb-2">
// // // // // //               <p className="text-sm text-gray-500">Income over time</p>
// // // // // //               {loading && (
// // // // // //                 <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
// // // // // //               )}
// // // // // //             </div>
// // // // // //             <div className="h-[360px] w-full">
// // // // // //               <ResponsiveContainer width="100%" height="100%">
// // // // // //                 <AreaChart
// // // // // //                   data={series}
// // // // // //                   margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
// // // // // //                 >
// // // // // //                   <defs>
// // // // // //                     <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
// // // // // //                       <stop
// // // // // //                         offset="0%"
// // // // // //                         stopColor="currentColor"
// // // // // //                         stopOpacity={0.2}
// // // // // //                       />
// // // // // //                       <stop
// // // // // //                         offset="100%"
// // // // // //                         stopColor="currentColor"
// // // // // //                         stopOpacity={0}
// // // // // //                       />
// // // // // //                     </linearGradient>
// // // // // //                   </defs>
// // // // // //                   <CartesianGrid
// // // // // //                     strokeDasharray="3 3"
// // // // // //                     className="text-gray-100"
// // // // // //                   />
// // // // // //                   <XAxis
// // // // // //                     dataKey="label"
// // // // // //                     tick={{ fontSize: 12 }}
// // // // // //                     interval={Math.max(0, Math.ceil(series.length / 12) - 1)}
// // // // // //                   />
// // // // // //                   <YAxis
// // // // // //                     tick={{ fontSize: 12 }}
// // // // // //                     tickFormatter={(v) =>
// // // // // //                       INR.format(Number(v)).replace(/\u20B9\s?/, '₹')
// // // // // //                     }
// // // // // //                     width={90}
// // // // // //                   />
// // // // // //                   <Tooltip
// // // // // //                     formatter={(val: any) => INR.format(Number(val))}
// // // // // //                     labelFormatter={(l) => `Period: ${l}`}
// // // // // //                     contentStyle={{ fontSize: 12 }}
// // // // // //                   />
// // // // // //                   <Area
// // // // // //                     type="monotone"
// // // // // //                     dataKey="value"
// // // // // //                     stroke="currentColor"
// // // // // //                     fill="url(#fillIncome)"
// // // // // //                     strokeWidth={2}
// // // // // //                   />
// // // // // //                 </AreaChart>
// // // // // //               </ResponsiveContainer>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Back link */}
// // // // // //           <div className="mt-8">
// // // // // //             <Link
// // // // // //               href="/hotel-panel/analytics-reports"
// // // // // //               className="text-sm underline hover:opacity-80"
// // // // // //             >
// // // // // //               ← Back to Analytics & Reports
// // // // // //             </Link>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // // ---------- UI bits ----------
// // // // // // function SummaryCard({
// // // // // //   title,
// // // // // //   value,
// // // // // //   loading
// // // // // // }: {
// // // // // //   title: string;
// // // // // //   value: string | number;
// // // // // //   loading?: boolean;
// // // // // // }) {
// // // // // //   return (
// // // // // //     <div className="rounded-2xl border bg-white p-5 shadow-sm">
// // // // // //       <div className="flex items-center justify-between">
// // // // // //         <p className="text-sm text-gray-500">{title}</p>
// // // // // //         {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
// // // // // //       </div>
// // // // // //       <div className="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">
// // // // // //         {value}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }
// // // // // 'use client';

// // // // // import { useEffect, useMemo, useState } from 'react';
// // // // // import Link from 'next/link';

// // // // // import Navbar from '@/components/Navbar';
// // // // // import { Heading } from '@/components/ui/heading';
// // // // // import { Button } from '@/components/ui/button';
// // // // // import { Loader2, RefreshCw } from 'lucide-react';
// // // // // import apiCall from '@/lib/axios';

// // // // // import {
// // // // //   Select,
// // // // //   SelectContent,
// // // // //   SelectItem,
// // // // //   SelectTrigger,
// // // // //   SelectValue
// // // // // } from '@/components/ui/select';

// // // // // import {
// // // // //   ResponsiveContainer,
// // // // //   AreaChart,
// // // // //   Area,
// // // // //   XAxis,
// // // // //   YAxis,
// // // // //   Tooltip,
// // // // //   CartesianGrid
// // // // // } from 'recharts';

// // // // // // ---------- Types ----------
// // // // // type IncomeSeriesResponse =
// // // // //   | { labels: string[]; data: number[] }
// // // // //   | { data: { labels: string[]; data: number[] } }
// // // // //   | any;

// // // // // type RangeKey = 'lastYear' | 'halfYear' | 'lastMonth' | 'lastWeek' | 'today';

// // // // // // ---------- Helpers ----------
// // // // // const RANGE_OPTIONS: { label: string; value: RangeKey }[] = [
// // // // //   { label: 'Last Year (24 mo)', value: 'lastYear' },
// // // // //   { label: 'Last 6 Months', value: 'halfYear' },
// // // // //   { label: 'Last Month', value: 'lastMonth' },
// // // // //   { label: 'Last Week', value: 'lastWeek' },
// // // // //   { label: 'Today', value: 'today' }
// // // // // ];

// // // // // const INR = new Intl.NumberFormat('en-IN', {
// // // // //   style: 'currency',
// // // // //   currency: 'INR',
// // // // //   maximumFractionDigits: 0
// // // // // });

// // // // // function normalizeSeries(
// // // // //   raw: IncomeSeriesResponse
// // // // // ): { label: string; value: number }[] {
// // // // //   // Accept both shapes:
// // // // //   // 1) { labels: [...], data: [...] }
// // // // //   // 2) { data: { labels: [...], data: [...] } }
// // // // //   const labels: string[] = Array.isArray(raw?.labels)
// // // // //     ? raw.labels
// // // // //     : Array.isArray(raw?.data?.labels)
// // // // //       ? raw.data.labels
// // // // //       : [];

// // // // //   const values: number[] =
// // // // //     Array.isArray(raw?.data) && typeof raw?.data?.[0] !== 'object'
// // // // //       ? raw.data
// // // // //       : Array.isArray(raw?.data?.data)
// // // // //         ? raw.data.data
// // // // //         : [];

// // // // //   const n = Math.min(labels.length, values.length);
// // // // //   return Array.from({ length: n }, (_, i) => ({
// // // // //     label: labels[i],
// // // // //     value: Number(values[i] ?? 0)
// // // // //   }));
// // // // // }

// // // // // // ---------- Page ----------
// // // // // export default function IncomeTimeSeriesPage() {
// // // // //   const [range, setRange] = useState<RangeKey>('lastYear');
// // // // //   const [series, setSeries] = useState<{ label: string; value: number }[]>([]);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [err, setErr] = useState<string | null>(null);

// // // // //   const total = useMemo(
// // // // //     () => series.reduce((sum, d) => sum + (d.value || 0), 0),
// // // // //     [series]
// // // // //   );

// // // // //   useEffect(() => {
// // // // //     (async () => {
// // // // //       setLoading(true);
// // // // //       setErr(null);
// // // // //       try {
// // // // //         // POST only (GET returns 404 on your UAT)
// // // // //         const res = await apiCall('POST', '/api/reports/income-time-series', {
// // // // //           range
// // // // //         });
// // // // //         const raw: IncomeSeriesResponse = res?.data ?? res ?? {};
// // // // //         const normalized = normalizeSeries(raw);

// // // // //         // Debug what we actually got (first few points)
// // // // //         console.log(
// // // // //           '[income-series] labels (first 6)=',
// // // // //           normalized.slice(0, 6).map((d) => d.label)
// // // // //         );
// // // // //         console.log(
// // // // //           '[income-series] values (first 6)=',
// // // // //           normalized.slice(0, 6).map((d) => d.value)
// // // // //         );

// // // // //         setSeries(normalized);
// // // // //       } catch (e: any) {
// // // // //         const status = e?.response?.status;
// // // // //         const msg =
// // // // //           e?.response?.data?.message ||
// // // // //           e?.message ||
// // // // //           'Failed to load income time series';
// // // // //         console.error('[income-time-series] FAIL', {
// // // // //           status,
// // // // //           msg,
// // // // //           url: e?.config?.url,
// // // // //           method: e?.config?.method
// // // // //         });
// // // // //         setErr(`Error ${status ?? 'NA'}: ${msg}`);
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     })();
// // // // //   }, [range]);

// // // // //   return (
// // // // //     <div className="flex min-h-screen w-full">
// // // // //       <div className="flex-1 flex flex-col">
// // // // //         <Navbar />

// // // // //         <div className="px-6 py-6 mt-16">
// // // // //           <div className="flex items-center justify-between">
// // // // //             <Heading title="Income Time Series" className="mt-0 md:mt-0" />

// // // // //             <div className="flex items-center gap-3">
// // // // //               {/* Range selector */}
// // // // //               <Select
// // // // //                 value={range}
// // // // //                 onValueChange={(v) => setRange(v as RangeKey)}
// // // // //               >
// // // // //                 <SelectTrigger className="min-w-[200px]">
// // // // //                   <SelectValue placeholder="Select range" />
// // // // //                 </SelectTrigger>
// // // // //                 <SelectContent>
// // // // //                   {RANGE_OPTIONS.map((opt) => (
// // // // //                     <SelectItem key={opt.value} value={opt.value}>
// // // // //                       {opt.label}
// // // // //                     </SelectItem>
// // // // //                   ))}
// // // // //                 </SelectContent>
// // // // //               </Select>

// // // // //               <Button
// // // // //                 variant="outline"
// // // // //                 size="icon"
// // // // //                 onClick={() => setRange((r) => r)} // retrigger effect
// // // // //                 title="Refresh"
// // // // //               >
// // // // //                 {loading ? (
// // // // //                   <Loader2 className="h-4 w-4 animate-spin" />
// // // // //                 ) : (
// // // // //                   <RefreshCw className="h-4 w-4" />
// // // // //                 )}
// // // // //               </Button>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Error */}
// // // // //           {err && (
// // // // //             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// // // // //               {err}
// // // // //             </div>
// // // // //           )}

// // // // //           {/* Summary */}
// // // // //           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
// // // // //             <SummaryCard
// // // // //               title="Points"
// // // // //               value={`${series.length}`}
// // // // //               loading={loading}
// // // // //             />
// // // // //             <SummaryCard
// // // // //               title="Total Income"
// // // // //               value={INR.format(total)}
// // // // //               loading={loading}
// // // // //             />
// // // // //             <SummaryCard
// // // // //               title="Avg per Point"
// // // // //               value={series.length ? INR.format(total / series.length) : '—'}
// // // // //               loading={loading}
// // // // //             />
// // // // //           </div>

// // // // //           {/* Chart */}
// // // // //           <div className="mt-8 rounded-2xl border bg-white p-4">
// // // // //             <div className="flex items-center justify-between mb-2">
// // // // //               <p className="text-sm text-gray-500">Income over time</p>
// // // // //               {loading && (
// // // // //                 <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
// // // // //               )}
// // // // //             </div>

// // // // //             {/* Fixed height is crucial; otherwise the chart won't render */}
// // // // //             <div className="h-[360px] w-full">
// // // // //               <ResponsiveContainer width="100%" height="100%">
// // // // //                 <AreaChart
// // // // //                   data={series}
// // // // //                   margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
// // // // //                 >
// // // // //                   <defs>
// // // // //                     <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
// // // // //                       <stop offset="0%" stopColor="#111827" stopOpacity={0.2} />
// // // // //                       <stop offset="100%" stopColor="#111827" stopOpacity={0} />
// // // // //                     </linearGradient>
// // // // //                   </defs>
// // // // //                   <CartesianGrid strokeDasharray="3 3" />
// // // // //                   <XAxis
// // // // //                     dataKey="label"
// // // // //                     tick={{ fontSize: 12 }}
// // // // //                     interval={Math.max(0, Math.ceil(series.length / 12) - 1)}
// // // // //                   />
// // // // //                   <YAxis
// // // // //                     tick={{ fontSize: 12 }}
// // // // //                     tickFormatter={(v) =>
// // // // //                       INR.format(Number(v)).replace(/\u20B9\s?/, '₹')
// // // // //                     }
// // // // //                     width={90}
// // // // //                   />
// // // // //                   <Tooltip
// // // // //                     formatter={(val: any) => INR.format(Number(val))}
// // // // //                     labelFormatter={(l) => `Period: ${l}`}
// // // // //                     contentStyle={{ fontSize: 12 }}
// // // // //                   />
// // // // //                   {/* Use a solid stroke color to ensure visibility regardless of parent text color */}
// // // // //                   <Area
// // // // //                     type="monotone"
// // // // //                     dataKey="value"
// // // // //                     stroke="#111827"
// // // // //                     fill="url(#fillIncome)"
// // // // //                     strokeWidth={2}
// // // // //                     isAnimationActive={false}
// // // // //                   />
// // // // //                 </AreaChart>
// // // // //               </ResponsiveContainer>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Optional: quick debug preview (remove in prod if you want) */}
// // // // //           {process.env.NODE_ENV !== 'production' && (
// // // // //             <pre className="mt-4 text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-48">
// // // // //               {JSON.stringify(series.slice(0, 8), null, 2)}
// // // // //             </pre>
// // // // //           )}

// // // // //           {/* Back link */}
// // // // //           <div className="mt-8">
// // // // //             <Link
// // // // //               href="/hotel-panel/analytics-reports"
// // // // //               className="text-sm underline hover:opacity-80"
// // // // //             >
// // // // //               ← Back to Analytics & Reports
// // // // //             </Link>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // // ---------- UI bits ----------
// // // // // function SummaryCard({
// // // // //   title,
// // // // //   value,
// // // // //   loading
// // // // // }: {
// // // // //   title: string;
// // // // //   value: string | number;
// // // // //   loading?: boolean;
// // // // // }) {
// // // // //   return (
// // // // //     <div className="rounded-2xl border bg-white p-5 shadow-sm">
// // // // //       <div className="flex items-center justify-between">
// // // // //         <p className="text-sm text-gray-500">{title}</p>
// // // // //         {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
// // // // //       </div>
// // // // //       <div className="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">
// // // // //         {value}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // 'use client';

// // // // import { useEffect, useMemo, useState } from 'react';
// // // // import Link from 'next/link';

// // // // import Navbar from '@/components/Navbar';
// // // // import { Heading } from '@/components/ui/heading';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Loader2, RefreshCw } from 'lucide-react';
// // // // import apiCall from '@/lib/axios';

// // // // import {
// // // //   Select,
// // // //   SelectContent,
// // // //   SelectItem,
// // // //   SelectTrigger,
// // // //   SelectValue
// // // // } from '@/components/ui/select';

// // // // import {
// // // //   ResponsiveContainer,
// // // //   AreaChart,
// // // //   Area,
// // // //   XAxis,
// // // //   YAxis,
// // // //   Tooltip,
// // // //   CartesianGrid
// // // // } from 'recharts';

// // // // type ApiShapeA = { labels: string[]; data: number[] };
// // // // type ApiShapeB = { data: { labels: string[]; data: number[] } };
// // // // type IncomeSeriesResponse = ApiShapeA | ApiShapeB | any;

// // // // type RangeKey = 'lastYear' | 'halfYear' | 'lastMonth' | 'lastWeek' | 'today';

// // // // const RANGE_OPTIONS: { label: string; value: RangeKey }[] = [
// // // //   { label: 'Last Year (24 mo)', value: 'lastYear' },
// // // //   { label: 'Last 6 Months', value: 'halfYear' },
// // // //   { label: 'Last Month', value: 'lastMonth' },
// // // //   { label: 'Last Week', value: 'lastWeek' },
// // // //   { label: 'Today', value: 'today' }
// // // // ];

// // // // const INR = new Intl.NumberFormat('en-IN', {
// // // //   style: 'currency',
// // // //   currency: 'INR',
// // // //   maximumFractionDigits: 0
// // // // });

// // // // function normalize(
// // // //   raw: IncomeSeriesResponse
// // // // ): { label: string; value: number }[] {
// // // //   // tolerate both top-level and nested data
// // // //   const labels = Array.isArray(raw?.labels)
// // // //     ? raw.labels
// // // //     : Array.isArray(raw?.data?.labels)
// // // //       ? raw.data.labels
// // // //       : [];

// // // //   const values =
// // // //     Array.isArray(raw?.data) && typeof raw?.data?.[0] !== 'object'
// // // //       ? raw.data
// // // //       : Array.isArray(raw?.data?.data)
// // // //         ? raw.data.data
// // // //         : [];

// // // //   const n = Math.min(labels.length, values.length);
// // // //   const out = Array.from({ length: n }, (_, i) => ({
// // // //     label: String(labels[i] ?? ''),
// // // //     value: Number(values[i] ?? 0)
// // // //   }));

// // // //   return out;
// // // // }

// // // // export default function IncomeTimeSeriesPage() {
// // // //   const [range, setRange] = useState<RangeKey>('lastYear');
// // // //   const [series, setSeries] = useState<{ label: string; value: number }[]>([]);
// // // //   const [chartKey, setChartKey] = useState(0); // force ResponsiveContainer to recalc
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [err, setErr] = useState<string | null>(null);

// // // //   const total = useMemo(
// // // //     () => series.reduce((sum, d) => sum + (isFinite(d.value) ? d.value : 0), 0),
// // // //     [series]
// // // //   );

// // // //   useEffect(() => {
// // // //     (async () => {
// // // //       setLoading(true);
// // // //       setErr(null);
// // // //       try {
// // // //         // POST ONLY (your UAT shows GET=404)
// // // //         const res = await apiCall('POST', '/api/reports/income-time-series', {
// // // //           range
// // // //         });
// // // //         const raw: IncomeSeriesResponse = res?.data ?? res ?? {};
// // // //         const normalized = normalize(raw);
// // // //         console.log('[income-series] sample:', res);
// // // //         console.log('[income-series] sample:', normalized.slice(0, 10));
// // // //         setSeries(normalized);

// // // //         // Kick ResponsiveContainer in case parent width was 0 on first paint
// // // //         setChartKey((k) => k + 1);
// // // //       } catch (e: any) {
// // // //         const status = e?.response?.status;
// // // //         const msg =
// // // //           e?.response?.data?.message ||
// // // //           e?.message ||
// // // //           'Failed to load income time series';
// // // //         console.error('[income-time-series] FAIL', {
// // // //           status,
// // // //           msg,
// // // //           url: e?.config?.url,
// // // //           method: e?.config?.method
// // // //         });
// // // //         setErr(`Error ${status ?? 'NA'}: ${msg}`);
// // // //         setSeries([]);
// // // //         setChartKey((k) => k + 1);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     })();
// // // //   }, [range]);

// // // //   return (
// // // //     <div className="flex min-h-screen w-full">
// // // //       <div className="flex-1 flex flex-col">
// // // //         <Navbar />

// // // //         <div className="px-6 py-6 mt-16">
// // // //           <div className="flex items-center justify-between">
// // // //             <Heading title="Income Time Series" className="mt-0 md:mt-0" />

// // // //             <div className="flex items-center gap-3">
// // // //               <Select
// // // //                 value={range}
// // // //                 onValueChange={(v) => setRange(v as RangeKey)}
// // // //               >
// // // //                 <SelectTrigger className="min-w-[200px]">
// // // //                   <SelectValue placeholder="Select range" />
// // // //                 </SelectTrigger>
// // // //                 <SelectContent>
// // // //                   {RANGE_OPTIONS.map((opt) => (
// // // //                     <SelectItem key={opt.value} value={opt.value}>
// // // //                       {opt.label}
// // // //                     </SelectItem>
// // // //                   ))}
// // // //                 </SelectContent>
// // // //               </Select>

// // // //               <Button
// // // //                 variant="outline"
// // // //                 size="icon"
// // // //                 onClick={() => setRange((r) => r)} // retrigger effect
// // // //                 title="Refresh"
// // // //               >
// // // //                 {loading ? (
// // // //                   <Loader2 className="h-4 w-4 animate-spin" />
// // // //                 ) : (
// // // //                   <RefreshCw className="h-4 w-4" />
// // // //                 )}
// // // //               </Button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Error */}
// // // //           {err && (
// // // //             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// // // //               {err}
// // // //             </div>
// // // //           )}

// // // //           {/* Summary */}
// // // //           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
// // // //             <SummaryCard
// // // //               title="Points"
// // // //               value={`${series.length}`}
// // // //               loading={loading}
// // // //             />
// // // //             <SummaryCard
// // // //               title="Total Income"
// // // //               value={INR.format(total)}
// // // //               loading={loading}
// // // //             />
// // // //             <SummaryCard
// // // //               title="Avg per Point"
// // // //               value={series.length ? INR.format(total / series.length) : '—'}
// // // //               loading={loading}
// // // //             />
// // // //           </div>

// // // //           {/* Chart */}
// // // //           <div className="mt-8 rounded-2xl border bg-white p-4">
// // // //             <div className="flex items-center justify-between mb-2">
// // // //               <p className="text-sm text-gray-500">Income over time</p>
// // // //               {loading && (
// // // //                 <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
// // // //               )}
// // // //             </div>

// // // //             {/* If data is empty, show a friendly empty state */}
// // // //             {!loading && series.length === 0 ? (
// // // //               <div className="h-[360px] flex items-center justify-center text-sm text-gray-500">
// // // //                 No data for the selected range.
// // // //               </div>
// // // //             ) : (
// // // //               <div className="h-[360px] w-full">
// // // //                 <ResponsiveContainer key={chartKey} width="100%" height="100%">
// // // //                   <AreaChart
// // // //                     data={series}
// // // //                     margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
// // // //                   >
// // // //                     <defs>
// // // //                       <linearGradient
// // // //                         id="fillIncome"
// // // //                         x1="0"
// // // //                         y1="0"
// // // //                         x2="0"
// // // //                         y2="1"
// // // //                       >
// // // //                         <stop
// // // //                           offset="0%"
// // // //                           stopColor="#111827"
// // // //                           stopOpacity={0.2}
// // // //                         />
// // // //                         <stop
// // // //                           offset="100%"
// // // //                           stopColor="#111827"
// // // //                           stopOpacity={0}
// // // //                         />
// // // //                       </linearGradient>
// // // //                     </defs>
// // // //                     <CartesianGrid strokeDasharray="3 3" />
// // // //                     <XAxis
// // // //                       dataKey="label"
// // // //                       tick={{ fontSize: 12 }}
// // // //                       interval={Math.max(0, Math.ceil(series.length / 12) - 1)}
// // // //                     />
// // // //                     <YAxis
// // // //                       tick={{ fontSize: 12 }}
// // // //                       tickFormatter={(v) =>
// // // //                         INR.format(Number(v)).replace(/\u20B9\s?/, '₹')
// // // //                       }
// // // //                       width={90}
// // // //                       domain={[0, 'auto']}
// // // //                       allowDecimals={false}
// // // //                     />
// // // //                     <Tooltip
// // // //                       formatter={(val: any) => INR.format(Number(val))}
// // // //                       labelFormatter={(l) => `Period: ${l}`}
// // // //                       contentStyle={{ fontSize: 12 }}
// // // //                     />
// // // //                     <Area
// // // //                       type="monotone"
// // // //                       dataKey="value"
// // // //                       stroke="#111827"
// // // //                       fill="url(#fillIncome)"
// // // //                       strokeWidth={2}
// // // //                       isAnimationActive={false}
// // // //                     />
// // // //                   </AreaChart>
// // // //                 </ResponsiveContainer>
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           {/* Dev preview (remove later) */}
// // // //           {process.env.NODE_ENV !== 'production' && (
// // // //             <pre className="mt-4 text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-48">
// // // //               {JSON.stringify(series.slice(0, 10), null, 2)}
// // // //             </pre>
// // // //           )}

// // // //           <div className="mt-8">
// // // //             <Link
// // // //               href="/hotel-panel/analytics-reports"
// // // //               className="text-sm underline hover:opacity-80"
// // // //             >
// // // //               ← Back to Analytics & Reports
// // // //             </Link>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // function SummaryCard({
// // // //   title,
// // // //   value,
// // // //   loading
// // // // }: {
// // // //   title: string;
// // // //   value: string | number;
// // // //   loading?: boolean;
// // // // }) {
// // // //   return (
// // // //     <div className="rounded-2xl border bg-white p-5 shadow-sm">
// // // //       <div className="flex items-center justify-between">
// // // //         <p className="text-sm text-gray-500">{title}</p>
// // // //         {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
// // // //       </div>
// // // //       <div className="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">
// // // //         {value}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }
// // // // app/analytics/income-time-series/page.tsx
// // // // 'use client';

// // // // import { useEffect, useMemo, useRef, useState } from 'react';
// // // // import Link from 'next/link';

// // // // import Navbar from '@/components/Navbar';
// // // // import { Heading } from '@/components/ui/heading';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Loader2, RefreshCw } from 'lucide-react';
// // // // import apiCall from '@/lib/axios';

// // // // import {
// // // //   Select,
// // // //   SelectContent,
// // // //   SelectItem,
// // // //   SelectTrigger,
// // // //   SelectValue
// // // // } from '@/components/ui/select';

// // // // import {
// // // //   AreaChart,
// // // //   Area,
// // // //   XAxis,
// // // //   YAxis,
// // // //   Tooltip,
// // // //   CartesianGrid
// // // // } from 'recharts';

// // // // type IncomeSeriesResponse = { labels: string[]; data: number[] } | any;
// // // // type RangeKey = 'lastYear' | 'halfYear' | 'lastMonth' | 'lastWeek' | 'today';

// // // // const RANGE_OPTIONS: { label: string; value: RangeKey }[] = [
// // // //   { label: 'Last Year (24 mo)', value: 'lastYear' },
// // // //   { label: 'Last 6 Months', value: 'halfYear' },
// // // //   { label: 'Last Month', value: 'lastMonth' },
// // // //   { label: 'Last Week', value: 'lastWeek' },
// // // //   { label: 'Today', value: 'today' }
// // // // ];

// // // // const INR = new Intl.NumberFormat('en-IN', {
// // // //   style: 'currency',
// // // //   currency: 'INR',
// // // //   maximumFractionDigits: 0
// // // // });

// // // // function normalize(
// // // //   raw: IncomeSeriesResponse
// // // // ): { label: string; value: number }[] {
// // // //   // Your payload is { labels: [...], data: [...] }
// // // //   const labels: string[] = Array.isArray(raw?.labels)
// // // //     ? raw.labels
// // // //     : Array.isArray(raw?.data?.labels)
// // // //       ? raw.data.labels
// // // //       : [];

// // // //   const values: number[] =
// // // //     Array.isArray(raw?.data) && typeof raw.data[0] !== 'object'
// // // //       ? raw.data
// // // //       : Array.isArray(raw?.data?.data)
// // // //         ? raw.data.data
// // // //         : [];

// // // //   const n = Math.min(labels.length, values.length);
// // // //   return Array.from({ length: n }, (_, i) => ({
// // // //     label: String(labels[i] ?? ''),
// // // //     value: Number(values[i] ?? 0)
// // // //   }));
// // // // }

// // // // export default function IncomeTimeSeriesPage() {
// // // //   const [range, setRange] = useState<RangeKey>('lastYear');
// // // //   const [series, setSeries] = useState<{ label: string; value: number }[]>([]);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [err, setErr] = useState<string | null>(null);

// // // //   // --- HARDENED SIZING (no ResponsiveContainer) ---
// // // //   const chartWrapRef = useRef<HTMLDivElement | null>(null);
// // // //   const [dims, setDims] = useState({ w: 0, h: 360 });

// // // //   useEffect(() => {
// // // //     if (!chartWrapRef.current) return;
// // // //     const el = chartWrapRef.current;
// // // //     const ro = new ResizeObserver((entries) => {
// // // //       const cr = entries[0]?.contentRect;
// // // //       if (cr) setDims({ w: Math.max(320, Math.floor(cr.width)), h: 360 }); // min width 320
// // // //     });
// // // //     ro.observe(el);
// // // //     // initialize once
// // // //     const r = el.getBoundingClientRect();
// // // //     setDims({ w: Math.max(320, Math.floor(r.width)), h: 360 });
// // // //     return () => ro.disconnect();
// // // //   }, []);

// // // //   const total = useMemo(
// // // //     () => series.reduce((s, d) => s + (isFinite(d.value) ? d.value : 0), 0),
// // // //     [series]
// // // //   );

// // // //   useEffect(() => {
// // // //     (async () => {
// // // //       setLoading(true);
// // // //       setErr(null);
// // // //       try {
// // // //         const res = await apiCall('POST', '/api/reports/income-time-series', {
// // // //           range
// // // //         });
// // // //         const raw: IncomeSeriesResponse = res?.data ?? res ?? {};
// // // //         console.log('[raw payload]', raw);
// // // //         const normalized = normalize(raw);
// // // //         console.log('[normalized sample]', normalized.slice(0, 6));
// // // //         setSeries(normalized);
// // // //       } catch (e: any) {
// // // //         const status = e?.response?.status;
// // // //         const msg =
// // // //           e?.response?.data?.message ||
// // // //           e?.message ||
// // // //           'Failed to load income time series';
// // // //         setErr(`Error ${status ?? 'NA'}: ${msg}`);
// // // //         setSeries([]);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     })();
// // // //   }, [range]);

// // // //   return (
// // // //     <div className="flex min-h-screen w-full">
// // // //       <div className="flex-1 flex flex-col">
// // // //         <Navbar />

// // // //         <div className="px-6 py-6 mt-16">
// // // //           <div className="flex items-center justify-between">
// // // //             <Heading title="Income Time Series" className="mt-0 md:mt-0" />
// // // //             <div className="flex items-center gap-3">
// // // //               <Select
// // // //                 value={range}
// // // //                 onValueChange={(v) => setRange(v as RangeKey)}
// // // //               >
// // // //                 <SelectTrigger className="min-w-[200px]">
// // // //                   <SelectValue placeholder="Select range" />
// // // //                 </SelectTrigger>
// // // //                 <SelectContent>
// // // //                   {RANGE_OPTIONS.map((opt) => (
// // // //                     <SelectItem key={opt.value} value={opt.value}>
// // // //                       {opt.label}
// // // //                     </SelectItem>
// // // //                   ))}
// // // //                 </SelectContent>
// // // //               </Select>
// // // //               <Button
// // // //                 variant="outline"
// // // //                 size="icon"
// // // //                 onClick={() => setRange((r) => r)} // retrigger
// // // //                 title="Refresh"
// // // //               >
// // // //                 {loading ? (
// // // //                   <Loader2 className="h-4 w-4 animate-spin" />
// // // //                 ) : (
// // // //                   <RefreshCw className="h-4 w-4" />
// // // //                 )}
// // // //               </Button>
// // // //             </div>
// // // //           </div>

// // // //           {err && (
// // // //             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// // // //               {err}
// // // //             </div>
// // // //           )}

// // // //           {/* Summary */}
// // // //           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
// // // //             <SummaryCard
// // // //               title="Points"
// // // //               value={series.length}
// // // //               loading={loading}
// // // //             />
// // // //             <SummaryCard
// // // //               title="Total Income"
// // // //               value={INR.format(total)}
// // // //               loading={loading}
// // // //             />
// // // //             <SummaryCard
// // // //               title="Avg per Point"
// // // //               value={series.length ? INR.format(total / series.length) : '—'}
// // // //               loading={loading}
// // // //             />
// // // //           </div>

// // // //           {/* Chart (explicit width/height) */}
// // // //           <div className="mt-8 rounded-2xl border bg-white p-4">
// // // //             <div className="flex items-center justify-between mb-2">
// // // //               <p className="text-sm text-gray-500">Income over time</p>
// // // //               {loading && (
// // // //                 <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
// // // //               )}
// // // //             </div>

// // // //             <div ref={chartWrapRef} className="w-full">
// // // //               {!loading && series.length === 0 ? (
// // // //                 <div
// // // //                   style={{ height: dims.h }}
// // // //                   className="flex items-center justify-center text-sm text-gray-500"
// // // //                 >
// // // //                   No data for the selected range.
// // // //                 </div>
// // // //               ) : (
// // // //                 <AreaChart
// // // //                   width={dims.w}
// // // //                   height={dims.h}
// // // //                   data={series}
// // // //                   margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
// // // //                 >
// // // //                   <defs>
// // // //                     <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
// // // //                       <stop offset="0%" stopColor="#111827" stopOpacity={0.2} />
// // // //                       <stop offset="100%" stopColor="#111827" stopOpacity={0} />
// // // //                     </linearGradient>
// // // //                   </defs>
// // // //                   <CartesianGrid strokeDasharray="3 3" />
// // // //                   <XAxis
// // // //                     dataKey="label"
// // // //                     tick={{ fontSize: 12 }}
// // // //                     interval={Math.max(0, Math.ceil(series.length / 12) - 1)}
// // // //                   />
// // // //                   <YAxis
// // // //                     tick={{ fontSize: 12 }}
// // // //                     tickFormatter={(v) =>
// // // //                       INR.format(Number(v)).replace(/\u20B9\s?/, '₹')
// // // //                     }
// // // //                     width={90}
// // // //                     domain={[0, 'auto']}
// // // //                     allowDecimals={false}
// // // //                   />
// // // //                   <Tooltip
// // // //                     formatter={(val: any) => INR.format(Number(val))}
// // // //                     labelFormatter={(l) => `Period: ${l}`}
// // // //                     contentStyle={{ fontSize: 12 }}
// // // //                   />
// // // //                   <Area
// // // //                     type="monotone"
// // // //                     dataKey="value"
// // // //                     stroke="#111827"
// // // //                     fill="url(#fillIncome)"
// // // //                     strokeWidth={2}
// // // //                     isAnimationActive={false}
// // // //                   />
// // // //                 </AreaChart>
// // // //               )}
// // // //             </div>
// // // //           </div>

// // // //           {/* Dev preview (remove later) */}
// // // //           {process.env.NODE_ENV !== 'production' && (
// // // //             <pre className="mt-4 text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-48">
// // // //               {JSON.stringify(series.slice(0, 10), null, 2)}
// // // //             </pre>
// // // //           )}

// // // //           <div className="mt-8">
// // // //             <Link
// // // //               href="/hotel-panel/analytics-reports"
// // // //               className="text-sm underline hover:opacity-80"
// // // //             >
// // // //               ← Back to Analytics & Reports
// // // //             </Link>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // function SummaryCard({
// // // //   title,
// // // //   value,
// // // //   loading
// // // // }: {
// // // //   title: string;
// // // //   value: string | number;
// // // //   loading?: boolean;
// // // // }) {
// // // //   return (
// // // //     <div className="rounded-2xl border bg-white p-5 shadow-sm">
// // // //       <div className="flex items-center justify-between">
// // // //         <p className="text-sm text-gray-500">{title}</p>
// // // //         {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
// // // //       </div>
// // // //       <div className="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">
// // // //         {value}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }
// // // 'use client';

// // // import { useEffect, useMemo, useRef, useState } from 'react';
// // // import Link from 'next/link';

// // // import Navbar from '@/components/Navbar';
// // // import { Heading } from '@/components/ui/heading';
// // // import { Button } from '@/components/ui/button';
// // // import { Loader2, RefreshCw, Download } from 'lucide-react';
// // // import apiCall from '@/lib/axios';

// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue
// // // } from '@/components/ui/select';

// // // import {
// // //   AreaChart,
// // //   Area,
// // //   XAxis,
// // //   YAxis,
// // //   Tooltip,
// // //   CartesianGrid
// // // } from 'recharts';

// // // type IncomeSeriesResponse = { labels: string[]; data: number[] } | any;
// // // type RangeKey = 'lastYear' | 'halfYear' | 'lastMonth' | 'lastWeek' | 'today';

// // // const RANGE_OPTIONS: { label: string; value: RangeKey }[] = [
// // //   { label: 'Last Year (24 mo)', value: 'lastYear' },
// // //   { label: 'Last 6 Months', value: 'halfYear' },
// // //   { label: 'Last Month', value: 'lastMonth' },
// // //   { label: 'Last Week', value: 'lastWeek' },
// // //   { label: 'Today', value: 'today' }
// // // ];

// // // const INR = new Intl.NumberFormat('en-IN', {
// // //   style: 'currency',
// // //   currency: 'INR',
// // //   maximumFractionDigits: 0
// // // });

// // // function normalize(
// // //   raw: IncomeSeriesResponse
// // // ): { label: string; value: number }[] {
// // //   const labels: string[] = Array.isArray(raw?.labels)
// // //     ? raw.labels
// // //     : Array.isArray(raw?.data?.labels)
// // //       ? raw.data.labels
// // //       : [];

// // //   const values: number[] =
// // //     Array.isArray(raw?.data) && typeof raw.data[0] !== 'object'
// // //       ? raw.data
// // //       : Array.isArray(raw?.data?.data)
// // //         ? raw.data.data
// // //         : [];

// // //   const n = Math.min(labels.length, values.length);
// // //   return Array.from({ length: n }, (_, i) => ({
// // //     label: String(labels[i] ?? ''),
// // //     value: Number(values[i] ?? 0)
// // //   }));
// // // }

// // // export default function IncomeTimeSeriesPage() {
// // //   const [range, setRange] = useState<RangeKey>('lastYear');
// // //   const [series, setSeries] = useState<{ label: string; value: number }[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [downloading, setDownloading] = useState(false);
// // //   const [err, setErr] = useState<string | null>(null);
// // //   const [excelBase64, setExcelBase64] = useState<string | null>(null);
// // //   const [excelFileName, setExcelFileName] = useState<string | null>(null);

// // //   // --- HARDENED SIZING (no ResponsiveContainer) ---
// // //   const chartWrapRef = useRef<HTMLDivElement | null>(null);
// // //   const [dims, setDims] = useState({ w: 0, h: 360 });

// // //   useEffect(() => {
// // //     if (!chartWrapRef.current) return;
// // //     const el = chartWrapRef.current;
// // //     const ro = new ResizeObserver((entries) => {
// // //       const cr = entries[0]?.contentRect;
// // //       if (cr) setDims({ w: Math.max(320, Math.floor(cr.width)), h: 360 }); // min width 320
// // //     });
// // //     ro.observe(el);
// // //     // initialize once
// // //     const r = el.getBoundingClientRect();
// // //     setDims({ w: Math.max(320, Math.floor(r.width)), h: 360 });
// // //     return () => ro.disconnect();
// // //   }, []);

// // //   const total = useMemo(
// // //     () => series.reduce((s, d) => s + (isFinite(d.value) ? d.value : 0), 0),
// // //     [series]
// // //   );

// // //   useEffect(() => {
// // //     (async () => {
// // //       setLoading(true);
// // //       setErr(null);
// // //       try {
// // //         const res = await apiCall('POST', '/api/reports/income-time-series', {
// // //           range
// // //         });
// // //         const raw: IncomeSeriesResponse = res?.data ?? res ?? {};
// // //         setExcelBase64(raw.excelBase64 ?? null);
// // //         setExcelFileName(raw.excelFileName ?? null);
// // //         const normalized = normalize(raw);
// // //         setSeries(normalized);
// // //       } catch (e: any) {
// // //         const status = e?.response?.status;
// // //         const msg =
// // //           e?.response?.data?.message ||
// // //           e?.message ||
// // //           'Failed to load income time series';
// // //         setErr(`Error ${status ?? 'NA'}: ${msg}`);
// // //         setSeries([]);
// // //         setExcelBase64(null);
// // //         setExcelFileName(null);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     })();
// // //   }, [range]);

// // //   function handleExcelDownload() {
// // //     if (!excelBase64 || !excelFileName) return;
// // //     setDownloading(true);
// // //     try {
// // //       const binary = atob(excelBase64);
// // //       const bytes = new Uint8Array(binary.length);
// // //       for (let i = 0; i < binary.length; i++) {
// // //         bytes[i] = binary.charCodeAt(i);
// // //       }
// // //       const blob = new Blob([bytes], {
// // //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// // //       });
// // //       const url = window.URL.createObjectURL(blob);
// // //       const a = document.createElement('a');
// // //       a.href = url;
// // //       a.download = excelFileName;
// // //       document.body.appendChild(a);
// // //       a.click();
// // //       a.remove();
// // //       window.URL.revokeObjectURL(url);
// // //     } finally {
// // //       setTimeout(() => setDownloading(false), 800);
// // //     }
// // //   }

// // //   return (
// // //     <div className="flex min-h-screen w-full">
// // //       <div className="flex-1 flex flex-col">
// // //         <Navbar />

// // //         <div className="px-6 py-6 mt-16">
// // //           <div className="flex items-center justify-between">
// // //             <Heading title="Income Time Series" className="mt-0 md:mt-0" />
// // //             <div className="flex items-center gap-3">
// // //               <Select
// // //                 value={range}
// // //                 onValueChange={(v) => setRange(v as RangeKey)}
// // //               >
// // //                 <SelectTrigger className="min-w-[200px]">
// // //                   <SelectValue placeholder="Select range" />
// // //                 </SelectTrigger>
// // //                 <SelectContent>
// // //                   {RANGE_OPTIONS.map((opt) => (
// // //                     <SelectItem key={opt.value} value={opt.value}>
// // //                       {opt.label}
// // //                     </SelectItem>
// // //                   ))}
// // //                 </SelectContent>
// // //               </Select>
// // //               <Button
// // //                 variant="outline"
// // //                 size="icon"
// // //                 onClick={() => setRange((r) => r)} // retrigger
// // //                 title="Refresh"
// // //               >
// // //                 {loading ? (
// // //                   <Loader2 className="h-4 w-4 animate-spin" />
// // //                 ) : (
// // //                   <RefreshCw className="h-4 w-4" />
// // //                 )}
// // //               </Button>

// // //               {/* Download Excel Button */}
// // //               <Button
// // //                 variant="secondary"
// // //                 size="icon"
// // //                 onClick={handleExcelDownload}
// // //                 disabled={!excelBase64 || downloading}
// // //                 title="Download Excel"
// // //                 className="flex items-center justify-center"
// // //               >
// // //                 {downloading ? (
// // //                   <Loader2 className="h-4 w-4 animate-spin" />
// // //                 ) : (
// // //                   <Download className="h-4 w-4" />
// // //                 )}
// // //               </Button>
// // //             </div>
// // //           </div>

// // //           {err && (
// // //             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// // //               {err}
// // //             </div>
// // //           )}

// // //           {/* Summary */}
// // //           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
// // //             <SummaryCard
// // //               title="Points"
// // //               value={series.length}
// // //               loading={loading}
// // //             />
// // //             <SummaryCard
// // //               title="Total Income"
// // //               value={INR.format(total)}
// // //               loading={loading}
// // //             />
// // //             <SummaryCard
// // //               title="Avg per Point"
// // //               value={series.length ? INR.format(total / series.length) : '—'}
// // //               loading={loading}
// // //             />
// // //           </div>

// // //           {/* Chart */}
// // //           <div className="mt-8 rounded-2xl border bg-white p-4">
// // //             <div className="flex items-center justify-between mb-2">
// // //               <p className="text-sm text-gray-500">Income over time</p>
// // //               {loading && (
// // //                 <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
// // //               )}
// // //             </div>

// // //             <div ref={chartWrapRef} className="w-full">
// // //               {!loading && series.length === 0 ? (
// // //                 <div
// // //                   style={{ height: dims.h }}
// // //                   className="flex items-center justify-center text-sm text-gray-500"
// // //                 >
// // //                   No data for the selected range.
// // //                 </div>
// // //               ) : (
// // //                 <AreaChart
// // //                   width={dims.w}
// // //                   height={dims.h}
// // //                   data={series}
// // //                   margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
// // //                 >
// // //                   <defs>
// // //                     <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
// // //                       <stop offset="0%" stopColor="#111827" stopOpacity={0.2} />
// // //                       <stop offset="100%" stopColor="#111827" stopOpacity={0} />
// // //                     </linearGradient>
// // //                   </defs>
// // //                   <CartesianGrid strokeDasharray="3 3" />
// // //                   <XAxis
// // //                     dataKey="label"
// // //                     tick={{ fontSize: 12 }}
// // //                     interval={Math.max(0, Math.ceil(series.length / 12) - 1)}
// // //                   />
// // //                   <YAxis
// // //                     tick={{ fontSize: 12 }}
// // //                     tickFormatter={(v) =>
// // //                       INR.format(Number(v)).replace(/\u20B9\s?/, '₹')
// // //                     }
// // //                     width={90}
// // //                     domain={[0, 'auto']}
// // //                     allowDecimals={false}
// // //                   />
// // //                   <Tooltip
// // //                     formatter={(val: any) => INR.format(Number(val))}
// // //                     labelFormatter={(l) => `Period: ${l}`}
// // //                     contentStyle={{ fontSize: 12 }}
// // //                   />
// // //                   <Area
// // //                     type="monotone"
// // //                     dataKey="value"
// // //                     stroke="#111827"
// // //                     fill="url(#fillIncome)"
// // //                     strokeWidth={2}
// // //                     isAnimationActive={false}
// // //                   />
// // //                 </AreaChart>
// // //               )}
// // //             </div>
// // //           </div>

// // //           {/* Dev preview (remove or comment out in prod) */}
// // //           {process.env.NODE_ENV !== 'production' && (
// // //             <pre className="mt-4 text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-48">
// // //               {JSON.stringify(series.slice(0, 10), null, 2)}
// // //             </pre>
// // //           )}

// // //           <div className="mt-8">
// // //             <Link
// // //               href="/hotel-panel/analytics-reports"
// // //               className="text-sm underline hover:opacity-80"
// // //             >
// // //               ← Back to Analytics & Reports
// // //             </Link>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function SummaryCard({
// // //   title,
// // //   value,
// // //   loading
// // // }: {
// // //   title: string;
// // //   value: string | number;
// // //   loading?: boolean;
// // // }) {
// // //   return (
// // //     <div className="rounded-2xl border bg-white p-5 shadow-sm">
// // //       <div className="flex items-center justify-between">
// // //         <p className="text-sm text-gray-500">{title}</p>
// // //         {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
// // //       </div>
// // //       <div className="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">
// // //         {value}
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // 'use client';

// // import { useEffect, useMemo, useRef, useState } from 'react';
// // import Link from 'next/link';

// // import Navbar from '@/components/Navbar';
// // import { Heading } from '@/components/ui/heading';
// // import { Button } from '@/components/ui/button';
// // import { Loader2, RefreshCw, Download } from 'lucide-react';
// // import apiCall from '@/lib/axios';

// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue
// // } from '@/components/ui/select';

// // import {
// //   AreaChart,
// //   Area,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   CartesianGrid
// // } from 'recharts';

// // type IncomeSeriesResponse =
// //   | {
// //       labels: string[];
// //       data: number[];
// //       excelBase64?: string;
// //       excelFileName?: string;
// //     }
// //   | any;
// // type RangeKey = 'lastYear' | 'halfYear' | 'lastMonth' | 'lastWeek' | 'today';

// // const RANGE_OPTIONS: { label: string; value: RangeKey }[] = [
// //   { label: 'Last Year (24 mo)', value: 'lastYear' },
// //   { label: 'Last 6 Months', value: 'halfYear' },
// //   { label: 'Last Month', value: 'lastMonth' },
// //   { label: 'Last Week', value: 'lastWeek' },
// //   { label: 'Today', value: 'today' }
// // ];

// // const INR = new Intl.NumberFormat('en-IN', {
// //   style: 'currency',
// //   currency: 'INR',
// //   maximumFractionDigits: 0
// // });

// // function normalize(
// //   raw: IncomeSeriesResponse
// // ): { label: string; value: number }[] {
// //   const labels: string[] = Array.isArray(raw?.labels)
// //     ? raw.labels
// //     : Array.isArray(raw?.data?.labels)
// //       ? raw.data.labels
// //       : [];

// //   const values: number[] =
// //     Array.isArray(raw?.data) && typeof raw.data[0] !== 'object'
// //       ? raw.data
// //       : Array.isArray(raw?.data?.data)
// //         ? raw.data.data
// //         : [];

// //   const n = Math.min(labels.length, values.length);
// //   return Array.from({ length: n }, (_, i) => ({
// //     label: String(labels[i] ?? ''),
// //     value: Number(values[i] ?? 0)
// //   }));
// // }

// // export default function IncomeTimeSeriesPage() {
// //   const [range, setRange] = useState<RangeKey>('lastYear');
// //   const [series, setSeries] = useState<{ label: string; value: number }[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [downloading, setDownloading] = useState(false);
// //   const [err, setErr] = useState<string | null>(null);
// //   const [excelBase64, setExcelBase64] = useState<string | null>(null);
// //   const [excelFileName, setExcelFileName] = useState<string | null>(null);

// //   // --- HARDENED SIZING (no ResponsiveContainer) ---
// //   const chartWrapRef = useRef<HTMLDivElement | null>(null);
// //   const [dims, setDims] = useState({ w: 0, h: 360 });

// //   useEffect(() => {
// //     if (!chartWrapRef.current) return;
// //     const el = chartWrapRef.current;
// //     const ro = new ResizeObserver((entries) => {
// //       const cr = entries[0]?.contentRect;
// //       if (cr) setDims({ w: Math.max(320, Math.floor(cr.width)), h: 360 }); // min width 320
// //     });
// //     ro.observe(el);
// //     // initialize once
// //     const r = el.getBoundingClientRect();
// //     setDims({ w: Math.max(320, Math.floor(r.width)), h: 360 });
// //     return () => ro.disconnect();
// //   }, []);

// //   const total = useMemo(
// //     () => series.reduce((s, d) => s + (isFinite(d.value) ? d.value : 0), 0),
// //     [series]
// //   );

// //   useEffect(() => {
// //     (async () => {
// //       setLoading(true);
// //       setErr(null);
// //       try {
// //         const res = await apiCall('POST', '/api/reports/income-time-series', {
// //           range
// //         });
// //         const raw: IncomeSeriesResponse = res?.data ?? res ?? {};
// //         setExcelBase64(raw.excelBase64 ?? null);
// //         setExcelFileName(raw.excelFileName ?? null);
// //         const normalized = normalize(raw);
// //         setSeries(normalized);
// //       } catch (e: any) {
// //         const status = e?.response?.status;
// //         const msg =
// //           e?.response?.data?.message ||
// //           e?.message ||
// //           'Failed to load income time series';
// //         setErr(`Error ${status ?? 'NA'}: ${msg}`);
// //         setSeries([]);
// //         setExcelBase64(null);
// //         setExcelFileName(null);
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, [range]);

// //   function handleExcelDownload() {
// //     if (!excelBase64 || !excelFileName) return;
// //     setDownloading(true);
// //     try {
// //       const binary = atob(excelBase64);
// //       const bytes = new Uint8Array(binary.length);
// //       for (let i = 0; i < binary.length; i++) {
// //         bytes[i] = binary.charCodeAt(i);
// //       }
// //       const blob = new Blob([bytes], {
// //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// //       });
// //       const url = window.URL.createObjectURL(blob);
// //       const a = document.createElement('a');
// //       a.href = url;
// //       a.download = excelFileName;
// //       document.body.appendChild(a);
// //       a.click();
// //       a.remove();
// //       window.URL.revokeObjectURL(url);
// //     } finally {
// //       setTimeout(() => setDownloading(false), 800);
// //     }
// //   }

// //   return (
// //     <div className="flex min-h-screen w-full">
// //       <div className="flex-1 flex flex-col">
// //         <Navbar />
// //         <div className="px-6 py-6 mt-16">
// //           <div className="flex items-center justify-between">
// //             <Heading title="Payment Reports" className="mt-0 md:mt-0" />
// //             <div className="flex items-center gap-3">
// //               <Select
// //                 value={range}
// //                 onValueChange={(v) => setRange(v as RangeKey)}
// //               >
// //                 <SelectTrigger className="min-w-[200px]">
// //                   <SelectValue placeholder="Select range" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   {RANGE_OPTIONS.map((opt) => (
// //                     <SelectItem key={opt.value} value={opt.value}>
// //                       {opt.label}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //               <Button
// //                 variant="outline"
// //                 size="icon"
// //                 onClick={() => setRange((r) => r)} // retrigger
// //                 title="Refresh"
// //               >
// //                 {loading ? (
// //                   <Loader2 className="h-4 w-4 animate-spin" />
// //                 ) : (
// //                   <RefreshCw className="h-4 w-4" />
// //                 )}
// //               </Button>
// //               <Button
// //                 variant="secondary"
// //                 size="icon"
// //                 onClick={handleExcelDownload}
// //                 disabled={!excelBase64 || downloading}
// //                 title="Download Excel"
// //                 className="flex items-center justify-center"
// //               >
// //                 {downloading ? (
// //                   <Loader2 className="h-4 w-4 animate-spin" />
// //                 ) : (
// //                   <Download className="h-4 w-4" />
// //                 )}
// //               </Button>
// //             </div>
// //           </div>

// //           {err && (
// //             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// //               {err}
// //             </div>
// //           )}

// //           {/* Summary */}
// //           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
// //             <SummaryCard
// //               title="Points"
// //               value={series.length}
// //               loading={loading}
// //             />
// //             <SummaryCard
// //               title="Total Income"
// //               value={INR.format(total)}
// //               loading={loading}
// //             />
// //             <SummaryCard
// //               title="Avg per Point"
// //               value={series.length ? INR.format(total / series.length) : '—'}
// //               loading={loading}
// //             />
// //           </div>

// //           {/* Chart */}
// //           <div className="mt-8 rounded-2xl border bg-white p-4">
// //             <div className="flex items-center justify-between mb-2">
// //               <p className="text-sm text-gray-500">Income over time</p>
// //               {loading && (
// //                 <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
// //               )}
// //             </div>

// //             <div ref={chartWrapRef} className="w-full">
// //               {!loading && series.length === 0 ? (
// //                 <div
// //                   style={{ height: dims.h }}
// //                   className="flex items-center justify-center text-sm text-gray-500"
// //                 >
// //                   No data for the selected range.
// //                 </div>
// //               ) : (
// //                 <AreaChart
// //                   width={dims.w}
// //                   height={dims.h}
// //                   data={series}
// //                   margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
// //                 >
// //                   <defs>
// //                     <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
// //                       <stop offset="0%" stopColor="#111827" stopOpacity={0.2} />
// //                       <stop offset="100%" stopColor="#111827" stopOpacity={0} />
// //                     </linearGradient>
// //                   </defs>
// //                   <CartesianGrid strokeDasharray="3 3" />
// //                   <XAxis
// //                     dataKey="label"
// //                     tick={{ fontSize: 12 }}
// //                     interval={Math.max(0, Math.ceil(series.length / 12) - 1)}
// //                   />
// //                   <YAxis
// //                     tick={{ fontSize: 12 }}
// //                     tickFormatter={(v) =>
// //                       INR.format(Number(v)).replace(/\u20B9\s?/, '₹')
// //                     }
// //                     width={90}
// //                     domain={[0, 'auto']}
// //                     allowDecimals={false}
// //                   />
// //                   <Tooltip
// //                     formatter={(val: any) => INR.format(Number(val))}
// //                     labelFormatter={(l) => `Period: ${l}`}
// //                     contentStyle={{ fontSize: 12 }}
// //                   />
// //                   <Area
// //                     type="monotone"
// //                     dataKey="value"
// //                     stroke="#111827"
// //                     fill="url(#fillIncome)"
// //                     strokeWidth={2}
// //                     isAnimationActive={false}
// //                   />
// //                 </AreaChart>
// //               )}
// //             </div>
// //           </div>

// //           {/* Full raw JSON response - helpful to see all data */}
// //           {series.length > 0 && (
// //             <pre className="mt-6 p-4 bg-gray-50 rounded max-h-96 overflow-auto text-xs">
// //               {JSON.stringify(series, null, 2)}
// //             </pre>
// //           )}

// //           <div className="mt-8">
// //             <Link
// //               href="/hotel-panel/analytics-reports"
// //               className="text-sm underline hover:opacity-80"
// //             >
// //               ← Back to Analytics & Reports
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function SummaryCard({
// //   title,
// //   value,
// //   loading
// // }: {
// //   title: string;
// //   value: string | number;
// //   loading?: boolean;
// // }) {
// //   return (
// //     <div className="rounded-2xl border bg-white p-5 shadow-sm">
// //       <div className="flex items-center justify-between">
// //         <p className="text-sm text-gray-500">{title}</p>
// //         {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
// //       </div>
// //       <div className="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">
// //         {value}
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import apiCall from '@/lib/axios';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// import { Download, RefreshCcw } from 'lucide-react';
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   BarChart,
//   Bar
// } from 'recharts';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import { Skeleton } from '@mui/material';

// type RangeKey = 'today' | 'lastWeek' | 'lastMonth' | 'halfYear' | 'lastYear';

// interface IncomeTimeSeriesResponse {
//   labels: string[]; // e.g., ["Jan", "Feb", ...]
//   data: number[]; // e.g., [0, 0, 336304.48, ...]
//   excelBase64?: string; // base64 of an .xlsx file (optional)
//   excelFileName?: string; // e.g., "incomeTimeSeries.xlsx"
// }

// interface Props {
//   endpoint?: string;
//   body?: Record<string, any>;
//   title?: string;

//   maximumFractionDigits?: number;
//   defaultChart?: 'area' | 'bar';
//   defaultRange?: RangeKey;
// }

// const INR = (n?: number, maximumFractionDigits = 0) =>
//   new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits
//   }).format(Number(n || 0));

// const toChartData = (labels: string[], values: number[]) =>
//   labels.map((label, i) => ({ label, value: values[i] ?? 0 }));

// const IncomeTimeSeriesChart: React.FC<Props> = ({
//   endpoint = '/api/reports/income-time-series',
//   body,
//   title = 'Payment Reports',
//   maximumFractionDigits = 0,
//   defaultChart = 'area',
//   defaultRange = 'lastYear'
// }) => {
//   const [series, setSeries] = useState<IncomeTimeSeriesResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [chart, setChart] = useState<'area' | 'bar'>(defaultChart);
//   const [range, setRange] = useState<RangeKey>(defaultRange);
//   const chartRef = useRef<HTMLDivElement | null>(null);

//   const useExternalBody = !!body;

//   const effectiveBody = useMemo(() => {
//     if (useExternalBody) return body!;
//     return { range } as { range: RangeKey };
//   }, [useExternalBody, body, range]);

//   const chartData = useMemo(() => {
//     if (!series) return [] as { label: string; value: number }[];
//     return toChartData(series.labels, series.data);
//   }, [series]);

//   const maxY = useMemo(() => {
//     const max = chartData.reduce((m, d) => Math.max(m, d.value), 0);
//     // Add 10% headroom for visual breathing space
//     return max > 0 ? Math.ceil(max * 1.1) : 1;
//   }, [chartData]);

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await apiCall<IncomeTimeSeriesResponse>(
//         'POST',
//         endpoint,
//         effectiveBody
//       );
//       setSeries(res as unknown as IncomeTimeSeriesResponse);
//     } catch (e: any) {
//       setError(e?.response?.data?.message || 'Failed to load time series');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [endpoint, JSON.stringify(effectiveBody)]);

//   const handleDownloadExcel = () => {
//     if (!series?.excelBase64) return;
//     const a = document.createElement('a');
//     a.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${series.excelBase64}`;
//     a.download = series.excelFileName || 'incomeTimeSeries.xlsx';
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//         <CardTitle className="text-lg md:text-xl font-semibold">
//           {title}
//         </CardTitle>
//         <div className="flex flex-wrap items-center gap-2">
//           {/* Chart Type Toggle */}
//           <div className="inline-flex rounded-md border p-1">
//             <Button
//               type="button"
//               size="sm"
//               variant={chart === 'area' ? 'default' : 'ghost'}
//               className="h-8"
//               onClick={() => setChart('area')}
//             >
//               Area
//             </Button>
//             <Button
//               type="button"
//               size="sm"
//               variant={chart === 'bar' ? 'default' : 'ghost'}
//               className="h-8"
//               onClick={() => setChart('bar')}
//             >
//               Bar
//             </Button>
//           </div>

//           {/* Range Selector (hidden when custom body is passed) */}
//           {!useExternalBody && (
//             <Select value={range} onValueChange={(v: RangeKey) => setRange(v)}>
//               <SelectTrigger className="w-[160px] h-8">
//                 <SelectValue placeholder="Select range" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="today">Today</SelectItem>
//                 <SelectItem value="lastWeek">Last week</SelectItem>
//                 <SelectItem value="lastMonth">Last month</SelectItem>
//                 <SelectItem value="halfYear">Last 6 months</SelectItem>
//                 <SelectItem value="lastYear">Last year</SelectItem>
//               </SelectContent>
//             </Select>
//           )}

//           <Button
//             type="button"
//             size="sm"
//             variant="outline"
//             onClick={fetchData}
//             title="Refresh"
//           >
//             <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
//           </Button>

//           <Button
//             type="button"
//             size="sm"
//             onClick={handleDownloadExcel}
//             disabled={!series?.excelBase64}
//             title={
//               series?.excelBase64 ? 'Download Excel' : 'No Excel available'
//             }
//           >
//             <Download className="mr-2 h-4 w-4" /> Excel
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent ref={chartRef} className="pt-2">
//         {loading ? (
//           <div className="space-y-3">
//             <Skeleton className="h-6 w-40" />
//             <Skeleton className="h-64 w-full" />
//           </div>
//         ) : error ? (
//           <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700 text-sm">
//             {error}
//           </div>
//         ) : (
//           <div className="h-[320px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               {chart === 'area' ? (
//                 <AreaChart
//                   data={chartData}
//                   margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
//                 >
//                   <defs>
//                     <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
//                       <stop
//                         offset="95%"
//                         stopColor="#3b82f6"
//                         stopOpacity={0.05}
//                       />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                   <XAxis
//                     dataKey="label"
//                     tickLine={false}
//                     axisLine={false}
//                     interval={0}
//                     height={36}
//                   />
//                   <YAxis
//                     width={80}
//                     tickFormatter={(v) => INR(v, maximumFractionDigits)}
//                     tickLine={false}
//                     axisLine={false}
//                     domain={[0, maxY]}
//                   />
//                   <Tooltip
//                     formatter={(v: any) =>
//                       INR(v as number, maximumFractionDigits)
//                     }
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="value"
//                     stroke="#3b82f6"
//                     fill="url(#incomeFill)"
//                     strokeWidth={2}
//                   />
//                 </AreaChart>
//               ) : (
//                 <BarChart
//                   data={chartData}
//                   margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                   <XAxis
//                     dataKey="label"
//                     tickLine={false}
//                     axisLine={false}
//                     interval={0}
//                     height={36}
//                   />
//                   <YAxis
//                     width={80}
//                     tickFormatter={(v) => INR(v, maximumFractionDigits)}
//                     tickLine={false}
//                     axisLine={false}
//                     domain={[0, maxY]}
//                   />
//                   <Tooltip
//                     formatter={(v: any) =>
//                       INR(v as number, maximumFractionDigits)
//                     }
//                   />
//                   <Bar dataKey="value" radius={[6, 6, 0, 0]} />
//                 </BarChart>
//               )}
//             </ResponsiveContainer>
//           </div>
//         )}

//         {/* Legend-like totals */}
//         {series && (
//           <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
//             <Stat
//               label="Total"
//               value={INR(
//                 series.data.reduce((s, n) => s + (n || 0), 0),
//                 maximumFractionDigits
//               )}
//             />
//             <Stat
//               label="Average / month"
//               value={INR(
//                 series.data.length
//                   ? series.data.reduce((s, n) => s + (n || 0), 0) /
//                       series.data.length
//                   : 0,
//                 maximumFractionDigits
//               )}
//             />
//             <Stat
//               label="Peak"
//               value={INR(Math.max(...series.data, 0), maximumFractionDigits)}
//             />
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// const Stat = ({ label, value }: { label: string; value: string }) => (
//   <div className="rounded-2xl border bg-card p-3 text-sm">
//     <div className="text-muted-foreground">{label}</div>
//     <div className="font-semibold">{value}</div>
//   </div>
// );

// export default IncomeTimeSeriesChart;
'use client';

import React from 'react';
import IncomeTimeSeriesChart from './IncomeTimeSeriesChart';

export default function Page() {
  return (
    <IncomeTimeSeriesChart
    // endpoint="/api/reports/income-time-series"
    // title="Payment Reports"
    // defaultChart="area"
    // defaultRange="lastYear"
    // maximumFractionDigits={0}
    // body={{ /* optional custom POST body to hide range dropdown */ }}
    />
  );
}
