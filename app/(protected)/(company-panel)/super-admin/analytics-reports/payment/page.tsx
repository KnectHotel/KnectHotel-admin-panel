// // 'use client';

// // import { useEffect, useMemo, useRef, useState } from 'react';
// // import Link from 'next/link';

// // import Navbar from '@/components/Navbar';
// // import { Heading } from '@/components/ui/heading';
// // import { Button } from '@/components/ui/button';
// // import { Loader2, RefreshCw } from 'lucide-react';
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

// // type IncomeSeriesResponse = { labels: string[]; data: number[] } | any;
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
// //   // Your payload is { labels: [...], data: [...] }
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
// //   const [err, setErr] = useState<string | null>(null);

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
// //         const res = await apiCall('POST', '/api/reports/paymentReports', {
// //           range
// //         });
// //         const raw: IncomeSeriesResponse = res?.data ?? res ?? {};
// //         console.log('[raw payload]', raw);
// //         const normalized = normalize(raw);
// //         console.log('[normalized sample]', normalized.slice(0, 6));
// //         setSeries(normalized);
// //       } catch (e: any) {
// //         const status = e?.response?.status;
// //         const msg =
// //           e?.response?.data?.message ||
// //           e?.message ||
// //           'Failed to load income time series';
// //         setErr(`Error ${status ?? 'NA'}: ${msg}`);
// //         setSeries([]);
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, [range]);

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

// //           {/* Chart (explicit width/height) */}
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

// //           {/* Dev preview (remove later) */}
// //           {process.env.NODE_ENV !== 'production' && (
// //             <pre className="mt-4 text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-48">
// //               {JSON.stringify(series.slice(0, 10), null, 2)}
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
//   Bar,
//   Legend
// } from 'recharts';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import { Skeleton } from '@mui/material';

// /* ───────────────────────── Types ───────────────────────── */
// type RangeKey = 'today' | 'lastWeek' | 'lastMonth' | 'halfYear' | 'lastYear';

// interface PaymentReportsResponse {
//   labels: string[];
//   datasets: {
//     revenue: number[];
//     discount: number[];
//     actualCost: number[];
//   };
//   totals?: {
//     totalRevenue?: number;
//     totalDiscount?: number;
//     actualCost?: number;
//     totalTransactions?: number;
//     averageTransactionValue?: number;
//   };
//   summary?: {
//     period?: RangeKey;
//     startDate?: string;
//     endDate?: string;
//   };
//   excelBase64?: string;
//   excelFileName?: string;
// }

// interface Props {
//   endpoint?: string;
//   title?: string;
//   defaultChart?: 'area' | 'bar';
//   defaultRange?: RangeKey;
//   maximumFractionDigits?: number;
//   /** If provided, the component will POST this body instead of { range } and hide the range dropdown. */
//   body?: Record<string, any>;
// }

// /* ───────────────────────── Utils ───────────────────────── */
// const INR = (n?: number, maximumFractionDigits = 0) =>
//   new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits
//   }).format(Number(n || 0));

// const toRows = (labels: string[], ds: PaymentReportsResponse['datasets']) =>
//   labels.map((label, i) => ({
//     label,
//     revenue: ds.revenue[i] ?? 0,
//     discount: ds.discount[i] ?? 0,
//     actualCost: ds.actualCost[i] ?? 0
//   }));

// /* ───────────────────────── Component ───────────────────────── */
// const PaymentReportsChart: React.FC<Props> = ({
//   endpoint = '/api/reports/paymentReports',
//   title = 'Payment Reports',
//   defaultChart = 'area',
//   defaultRange = 'lastYear',
//   maximumFractionDigits = 0,
//   body
// }) => {
//   const [data, setData] = useState<PaymentReportsResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);
//   const [chart, setChart] = useState<'area' | 'bar'>(defaultChart);
//   const [range, setRange] = useState<RangeKey>(defaultRange);
//   const [show, setShow] = useState({
//     revenue: true,
//     discount: true,
//     actualCost: true
//   });
//   const chartRef = useRef<HTMLDivElement | null>(null);

//   const useExternalBody = !!body;
//   const effectiveBody = useMemo(() => {
//     if (useExternalBody) return body!;
//     return { range } as { range: RangeKey };
//   }, [useExternalBody, body, range]);

//   const rows = useMemo(() => {
//     if (!data)
//       return [] as Array<{
//         label: string;
//         revenue: number;
//         discount: number;
//         actualCost: number;
//       }>;
//     return toRows(data.labels, data.datasets);
//   }, [data]);

//   const maxY = useMemo(() => {
//     const nums = rows.flatMap((r) => [
//       show.revenue ? r.revenue : 0,
//       show.discount ? r.discount : 0,
//       show.actualCost ? r.actualCost : 0
//     ]);
//     const max = Math.max(0, ...nums);
//     return max > 0 ? Math.ceil(max * 1.1) : 1;
//   }, [rows, show]);

//   const fetchData = async () => {
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await apiCall<PaymentReportsResponse>(
//         'POST',
//         endpoint,
//         effectiveBody
//       );
//       setData(res as unknown as PaymentReportsResponse);
//     } catch (e: any) {
//       setErr(e?.response?.data?.message || 'Failed to load payment reports');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [endpoint, JSON.stringify(effectiveBody)]);

//   const handleDownloadExcel = () => {
//     if (!data?.excelBase64) return;
//     const a = document.createElement('a');
//     a.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${data.excelBase64}`;
//     a.download = data.excelFileName || 'payment-reports.xlsx';
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   const totals = data?.totals || {};

//   return (
//     <Card className="w-full">
//       <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//         <CardTitle className="text-lg md:text-xl font-semibold">
//           {title}
//         </CardTitle>

//         <div className="flex flex-wrap items-center gap-2">
//           {/* Chart Type Toggle */}
//           <div className="inline-flex rounded-md border p-1">
//             {/* <Button
//               size="sm"
//               variant={chart === 'area' ? 'default' : 'ghost'}
//               className="h-8"
//               onClick={() => setChart('area')}
//             >
//               Area
//             </Button>
//             <Button
//               size="sm"
//               variant={chart === 'bar' ? 'default' : 'ghost'}
//               className="h-8"
//               onClick={() => setChart('bar')}
//             >
//               Bar
//             </Button> */}
//           </div>

//           {/* Metric toggles */}
//           {/* <div className="inline-flex rounded-md border p-1"> */}
//           {/* <Button
//               size="sm"
//               variant={show.revenue ? 'default' : 'ghost'}
//               className="h-8"
//               onClick={() => setShow((s) => ({ ...s, revenue: !s.revenue }))}
//               title="Toggle Revenue"
//             >
//               Revenue
//             </Button>
//             <Button
//               size="sm"
//               variant={show.discount ? 'default' : 'ghost'}
//               className="h-8"
//               onClick={() => setShow((s) => ({ ...s, discount: !s.discount }))}
//               title="Toggle Discount"
//             >
//               Discount
//             </Button>
//             <Button
//               size="sm"
//               variant={show.actualCost ? 'default' : 'ghost'}
//               className="h-8"
//               onClick={() =>
//                 setShow((s) => ({ ...s, actualCost: !s.actualCost }))
//               }
//               title="Toggle Actual Cost"
//             >
//               Actual Cost
//             </Button> */}
//           {/* </div> */}

//           {/* Range Selector (hidden if custom body passed) */}
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
//             size="sm"
//             variant="outline"
//             onClick={fetchData}
//             title="Refresh"
//           >
//             <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
//           </Button>

//           <Button
//             size="sm"
//             onClick={handleDownloadExcel}
//             disabled={!data?.excelBase64}
//             title={data?.excelBase64 ? 'Download Excel' : 'No Excel available'}
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
//         ) : err ? (
//           <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700 text-sm">
//             {err}
//           </div>
//         ) : (
//           <div className="h-[340px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               {chart === 'area' ? (
//                 <AreaChart
//                   data={rows}
//                   margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
//                 >
//                   <defs>
//                     <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop
//                         offset="5%"
//                         stopColor="#10b981"
//                         stopOpacity={0.35}
//                       />
//                       <stop
//                         offset="95%"
//                         stopColor="#10b981"
//                         stopOpacity={0.05}
//                       />
//                     </linearGradient>
//                     <linearGradient id="discFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop
//                         offset="5%"
//                         stopColor="#f59e0b"
//                         stopOpacity={0.35}
//                       />
//                       <stop
//                         offset="95%"
//                         stopColor="#f59e0b"
//                         stopOpacity={0.05}
//                       />
//                     </linearGradient>
//                     <linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop
//                         offset="5%"
//                         stopColor="#3b82f6"
//                         stopOpacity={0.35}
//                       />
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
//                     width={90}
//                     domain={[0, maxY]}
//                     tickFormatter={(v) => INR(v, maximumFractionDigits)}
//                     tickLine={false}
//                     axisLine={false}
//                   />
//                   <Tooltip
//                     formatter={(v: any) =>
//                       INR(v as number, maximumFractionDigits)
//                     }
//                     labelFormatter={(l) => l}
//                   />
//                   <Legend />
//                   {show.revenue && (
//                     <Area
//                       type="monotone"
//                       dataKey="revenue"
//                       name="Revenue"
//                       stroke="#10b981"
//                       fill="url(#revFill)"
//                       strokeWidth={2}
//                     />
//                   )}
//                   {show.discount && (
//                     <Area
//                       type="monotone"
//                       dataKey="discount"
//                       name="Discount"
//                       stroke="#f59e0b"
//                       fill="url(#discFill)"
//                       strokeWidth={2}
//                     />
//                   )}
//                   {show.actualCost && (
//                     <Area
//                       type="monotone"
//                       dataKey="actualCost"
//                       name="Actual Cost"
//                       stroke="#3b82f6"
//                       fill="url(#costFill)"
//                       strokeWidth={2}
//                     />
//                   )}
//                 </AreaChart>
//               ) : (
//                 <BarChart
//                   data={rows}
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
//                     width={90}
//                     domain={[0, maxY]}
//                     tickFormatter={(v) => INR(v, maximumFractionDigits)}
//                     tickLine={false}
//                     axisLine={false}
//                   />
//                   <Tooltip
//                     formatter={(v: any) =>
//                       INR(v as number, maximumFractionDigits)
//                     }
//                     labelFormatter={(l) => l}
//                   />
//                   <Legend />
//                   {show.revenue && (
//                     <Bar
//                       dataKey="revenue"
//                       name="Revenue"
//                       radius={[6, 6, 0, 0]}
//                     />
//                   )}
//                   {show.discount && (
//                     <Bar
//                       dataKey="discount"
//                       name="Discount"
//                       radius={[6, 6, 0, 0]}
//                     />
//                   )}
//                   {show.actualCost && (
//                     <Bar
//                       dataKey="actualCost"
//                       name="Actual Cost"
//                       radius={[6, 6, 0, 0]}
//                     />
//                   )}
//                 </BarChart>
//               )}
//             </ResponsiveContainer>
//           </div>
//         )}

//         {/* KPI strip */}
//         {data && (
//           <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-5">
//             <Stat
//               label="Total Revenue"
//               value={INR(totals.totalRevenue, maximumFractionDigits)}
//             />
//             <Stat
//               label="Total Discount"
//               value={INR(totals.totalDiscount, maximumFractionDigits)}
//             />
//             <Stat
//               label="Actual Cost"
//               value={INR(totals.actualCost, maximumFractionDigits)}
//             />
//             <Stat
//               label="Transactions"
//               value={String(totals.totalTransactions ?? 0)}
//             />
//             <Stat
//               label="Avg Txn Value"
//               value={INR(totals.averageTransactionValue, maximumFractionDigits)}
//             />
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// /* ───────────────────────── Tiny subcomponent ───────────────────────── */
// const Stat = ({ label, value }: { label: string; value: string }) => (
//   <div className="rounded-2xl border bg-card p-3 text-sm">
//     <div className="text-muted-foreground">{label}</div>
//     <div className="font-semibold">{value}</div>
//   </div>
// );

// export default PaymentReportsChart;
'use client';

import React from 'react';
import PaymentReportsChart from './PaymentReportsChart';
// ↩️ same folder. Adjust if you move the file.

export default function Page() {
  return (
    <PaymentReportsChart
    // You can override these if needed:
    // endpoint="/api/reports/paymentReports"
    // title="Payment Reports"
    // defaultChart="area"
    // defaultRange="lastYear"
    // maximumFractionDigits={0}
    // body={{ /* custom POST body to bypass the range dropdown */ }}
    />
  );
}
