// // 'use client';

// // // app/analytics/complaints/page.tsx
// // // Complaints analytics with date-range filter, metrics, and service-wise table

// // import { useEffect, useMemo, useState } from 'react';
// // import Link from 'next/link';
// // import { format, subDays } from 'date-fns';
// // import type { DateRange } from 'react-day-picker';

// // import Navbar from '@/components/Navbar';
// // import { Heading } from '@/components/ui/heading';
// // import { Button } from '@/components/ui/button';
// // import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
// // import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// // import { Calendar } from '@/components/ui/calendar';
// // import apiCall from '@/lib/axios';
// // import { cn } from '@/lib/utils';

// // // ---------- Types ----------
// // interface ComplaintsStats {
// //   totalComplaints: number;
// //   complaintsResolved: number;
// //   pendingComplaints: number;
// //   positiveAgentRatings: number;
// //   neutralAgentRatings: number;
// //   poorAgentRatings: number;
// //   avgComplaintRating: number; // 1–5
// //   avgAgentRating: number; // 1–5
// //   avgResolutionTimeHours: number; // decimal hours
// // }

// // interface ServiceWiseRow {
// //   totalCount: number;
// //   resolvedCount: number;
// //   pendingCount: number;
// //   serviceType: string;
// //   avgComplaintRating?: number;
// //   avgAgentRating?: number;
// // }

// // interface ComplaintsReportRes {
// //   stats: ComplaintsStats;
// //   serviceWise: ServiceWiseRow[];
// // }

// // // ---------- Utils ----------
// // const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');

// // function percent(part: number, total: number) {
// //   if (!total) return 0;
// //   const p = Math.round((part / total) * 100);
// //   return Number.isFinite(p) ? p : 0;
// // }

// // // ---------- UI Bits ----------
// // function MetricCard({ title, value, subtitle, loading }: { title: string; value: number | string; subtitle?: string; loading?: boolean }) {
// //   return (
// //     <div className="rounded-2xl border bg-white p-5 shadow-sm">
// //       <div className="flex items-center justify-between">
// //         <p className="text-sm text-gray-500">{title}</p>
// //         {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
// //       </div>
// //       <div className="mt-2 text-3xl font-semibold text-gray-800">{value}</div>
// //       {subtitle && <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>}
// //     </div>
// //   );
// // }

// // function SplitBar({ left, right, leftLabel = 'Resolved', rightLabel = 'Pending' }: { left: number; right: number; leftLabel?: string; rightLabel?: string }) {
// //   const total = left + right;
// //   const lp = percent(left, total);
// //   const rp = 100 - lp;
// //   return (
// //     <div>
// //       <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
// //         <span>{leftLabel}: {lp}%</span>
// //         <span>{rightLabel}: {rp}%</span>
// //       </div>
// //       <div className="h-3 w-full overflow-hidden rounded-full border bg-muted/40">
// //         <div className="h-full bg-emerald-500" style={{ width: `${lp}%` }} />
// //       </div>
// //     </div>
// //   );
// // }

// // // ---------- Page ----------
// // export default function ComplaintsReportsPage() {
// //   // default: last 30 days
// //   const [range, setRange] = useState<DateRange | undefined>({
// //     from: subDays(new Date(), 30),
// //     to: new Date(),
// //   });

// //   const [data, setData] = useState<ComplaintsReportRes | null>(null);
// //   const [loading, setLoading] = useState(false);
// //   const [err, setErr] = useState<string | null>(null);

// //   const startDate = useMemo(() => (range?.from ? toYMD(range.from) : undefined), [range?.from]);
// //   const endDate = useMemo(() => (range?.to ? toYMD(range.to) : undefined), [range?.to]);

// //   async function load() {
// //     if (!startDate || !endDate) return;
// //     setLoading(true);
// //     setErr(null);
// //     try {
// //       const res = await apiCall('POST', '/api/reports/complaints', { range: { startDate, endDate } });
// //       const payload: ComplaintsReportRes = res?.data ?? res ?? { stats: {
// //         totalComplaints: 0,
// //         complaintsResolved: 0,
// //         pendingComplaints: 0,
// //         positiveAgentRatings: 0,
// //         neutralAgentRatings: 0,
// //         poorAgentRatings: 0,
// //         avgComplaintRating: 0,
// //         avgAgentRating: 0,
// //         avgResolutionTimeHours: 0,
// //       }, serviceWise: [] };
// //       // Normalize numbers just in case
// //       const s = payload.stats;
// //       setData({
// //         stats: {
// //           totalComplaints: Number(s.totalComplaints || 0),
// //           complaintsResolved: Number(s.complaintsResolved || 0),
// //           pendingComplaints: Number(s.pendingComplaints || 0),
// //           positiveAgentRatings: Number(s.positiveAgentRatings || 0),
// //           neutralAgentRatings: Number(s.neutralAgentRatings || 0),
// //           poorAgentRatings: Number(s.poorAgentRatings || 0),
// //           avgComplaintRating: Number(s.avgComplaintRating || 0),
// //           avgAgentRating: Number(s.avgAgentRating || 0),
// //           avgResolutionTimeHours: Number(s.avgResolutionTimeHours || 0),
// //         },
// //         serviceWise: Array.isArray(payload.serviceWise) ? payload.serviceWise.map((row) => ({
// //           totalCount: Number(row.totalCount || 0),
// //           resolvedCount: Number(row.resolvedCount || 0),
// //           pendingCount: Number(row.pendingCount || 0),
// //           serviceType: row.serviceType || '—',
// //           avgComplaintRating: typeof row.avgComplaintRating === 'number' ? row.avgComplaintRating : undefined,
// //           avgAgentRating: typeof row.avgAgentRating === 'number' ? row.avgAgentRating : undefined,
// //         })) : [],
// //       });
// //     } catch (e: any) {
// //       setErr(e?.response?.data?.message || 'Failed to load complaints report');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   // initial + on date change
// //   useEffect(() => {
// //     load();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [startDate, endDate]);

// //   const stats = data?.stats;
// //   const serviceWise = data?.serviceWise ?? [];

// //   return (
// //     <div className="flex min-h-screen w-full">
// //       {/* Main */}
// //       <div className="flex-1 flex flex-col">
// //         <Navbar />

// //         <div className="px-6 py-6 mt-16">
// //           <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
// //             <Heading title="Complaints Reports" className="mt-0 md:mt-0" />

// //             {/* Date Range Filter */}
// //             <div className="flex items-center gap-2">
// //               <Popover>
// //                 <PopoverTrigger asChild>
// //                   <Button
// //                     variant="outline"
// //                     className={cn(
// //                       'w-full sm:w-auto justify-start text-left font-normal',
// //                       !startDate || !endDate ? 'text-muted-foreground' : ''
// //                     )}
// //                   >
// //                     <CalendarIcon className="mr-2 h-4 w-4" />
// //                     {startDate && endDate ? `${startDate} → ${endDate}` : 'Pick a date range'}
// //                   </Button>
// //                 </PopoverTrigger>
// //                 <PopoverContent className="w-auto p-0" align="end">
// //                   <Calendar
// //                     mode="range"
// //                     numberOfMonths={2}
// //                     selected={range}
// //                     onSelect={(r) => setRange(r)}
// //                     defaultMonth={range?.from}
// //                   />
// //                 </PopoverContent>
// //               </Popover>

// //               <Button onClick={load} disabled={loading}>
// //                 {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…</> : 'Refresh'}
// //               </Button>
// //             </div>
// //           </div>

// //           {/* Error */}
// //           {err && (
// //             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// //               {err}
// //             </div>
// //           )}

// //           {/* Top metrics */}
// //           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
// //             <MetricCard title="Total Complaints" value={stats?.totalComplaints ?? 0} loading={loading} />
// //             <MetricCard title="Resolved" value={stats?.complaintsResolved ?? 0} loading={loading} />
// //             <MetricCard title="Pending" value={stats?.pendingComplaints ?? 0} loading={loading} />
// //           </div>

// //           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
// //             <MetricCard title="Avg Complaint Rating" value={(stats?.avgComplaintRating ?? 0).toFixed(1)} subtitle="/ 5.0" loading={loading} />
// //             <MetricCard title="Avg Agent Rating" value={(stats?.avgAgentRating ?? 0).toFixed(1)} subtitle="/ 5.0" loading={loading} />
// //             <MetricCard title="Avg Resolution Time" value={(stats?.avgResolutionTimeHours ?? 0).toFixed(2)} subtitle="hours" loading={loading} />
// //           </div>

// //           {/* Resolved vs Pending split */}
// //           <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
// //             <div className="mb-3 text-sm text-muted-foreground">Resolution Split</div>
// //             <SplitBar left={stats?.complaintsResolved ?? 0} right={stats?.pendingComplaints ?? 0} leftLabel="Resolved" rightLabel="Pending" />
// //             <div className="mt-3 text-xs text-muted-foreground">Endpoint: <code>/api/reports/complaints</code></div>
// //           </div>

// //           {/* Service-wise table */}
// //           <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
// //             <div className="mb-3 text-lg font-semibold">Service-wise Breakdown</div>
// //             <div className="overflow-auto rounded-xl border">
// //               <table className="min-w-full text-sm">
// //                 <thead className="bg-muted/50">
// //                   <tr>
// //                     <th className="px-4 py-2 text-left font-medium">Service</th>
// //                     <th className="px-4 py-2 text-right font-medium">Total</th>
// //                     <th className="px-4 py-2 text-right font-medium">Resolved</th>
// //                     <th className="px-4 py-2 text-right font-medium">Pending</th>
// //                     <th className="px-4 py-2 text-right font-medium">Resolved %</th>
// //                     <th className="px-4 py-2 text-right font-medium">Avg Compl. Rating</th>
// //                     <th className="px-4 py-2 text-right font-medium">Avg Agent Rating</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {serviceWise.length === 0 && (
// //                     <tr>
// //                       <td className="px-4 py-6 text-center text-muted-foreground" colSpan={7}>No data</td>
// //                     </tr>
// //                   )}
// //                   {serviceWise.map((row) => {
// //                     const rp = percent(row.resolvedCount, row.totalCount);
// //                     return (
// //                       <tr key={row.serviceType} className="odd:bg-white even:bg-muted/30">
// //                         <td className="px-4 py-2">{row.serviceType}</td>
// //                         <td className="px-4 py-2 text-right font-medium">{row.totalCount}</td>
// //                         <td className="px-4 py-2 text-right">{row.resolvedCount}</td>
// //                         <td className="px-4 py-2 text-right">{row.pendingCount}</td>
// //                         <td className="px-4 py-2 text-right">{rp}%</td>
// //                         <td className="px-4 py-2 text-right">{row.avgComplaintRating?.toFixed?.(1) ?? '—'}</td>
// //                         <td className="px-4 py-2 text-right">{row.avgAgentRating?.toFixed?.(1) ?? '—'}</td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>

// //           {/* Back link */}
// //           <div className="mt-8">
// //             <Link href="/hotel-panel/analytics-reports" className="text-sm underline hover:opacity-80">
// //               ← Back to Analytics & Reports
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';

// // app/analytics/complaints/page.tsx
// // Complaints analytics with date-range filter, metrics, service-wise table, and Excel download

// import { useEffect, useMemo, useState } from 'react';
// import Link from 'next/link';
// import { format, subDays } from 'date-fns';
// import type { DateRange } from 'react-day-picker';

// import Navbar from '@/components/Navbar';
// import { Heading } from '@/components/ui/heading';
// import { Button } from '@/components/ui/button';
// import { Calendar as CalendarIcon, Download, Loader2 } from 'lucide-react';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import apiCall from '@/lib/axios';
// import { cn } from '@/lib/utils';

// // ---------- Types ----------
// interface ComplaintsStats {
//   totalComplaints: number;
//   complaintsResolved: number;
//   pendingComplaints: number;
//   positiveAgentRatings: number;
//   neutralAgentRatings: number;
//   poorAgentRatings: number;
//   avgComplaintRating: number; // 1–5
//   avgAgentRating: number; // 1–5
//   avgResolutionTimeHours: number; // decimal hours
// }

// interface ServiceWiseRow {
//   totalCount: number;
//   resolvedCount: number;
//   pendingCount: number;
//   serviceType: string;
//   avgComplaintRating?: number;
//   avgAgentRating?: number;
// }

// interface ComplaintsReportRes {
//   stats: ComplaintsStats;
//   serviceWise: ServiceWiseRow[];
//   // NEW: Excel payload from API
//   excelBase64?: string;
//   excelFileName?: string;
// }

// // ---------- Utils ----------
// const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');

// function percent(part: number, total: number) {
//   if (!total) return 0;
//   const p = Math.round((part / total) * 100);
//   return Number.isFinite(p) ? p : 0;
// }

// // Safe Base64 → Blob → download
// function downloadBase64File(
//   base64: string,
//   filename = 'report.xlsx',
//   mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// ) {
//   const clean = base64
//     .replace(/^data:.*?;base64,/, '') // drop data: prefix if present
//     .replace(/[\r\n]+/g, '')         // drop newlines
//     .replace(/-/g, '+')              // URL-safe -> standard
//     .replace(/_/g, '/');

//   const byteChars = atob(clean);
//   const bytes = new Uint8Array(byteChars.length);
//   for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);

//   const blob = new Blob([bytes], { type: mime });
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement('a');
//   a.href = url;
//   a.download = filename || 'report.xlsx';
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   URL.revokeObjectURL(url);
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

// function SplitBar({ left, right, leftLabel = 'Resolved', rightLabel = 'Pending' }: { left: number; right: number; leftLabel?: string; rightLabel?: string }) {
//   const total = left + right;
//   const lp = percent(left, total);
//   const rp = 100 - lp;
//   return (
//     <div>
//       <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
//         <span>{leftLabel}: {lp}%</span>
//         <span>{rightLabel}: {rp}%</span>
//       </div>
//       <div className="h-3 w-full overflow-hidden rounded-full border bg-muted/40">
//         <div className="h-full bg-emerald-500" style={{ width: `${lp}%` }} />
//       </div>
//     </div>
//   );
// }

// // ---------- Page ----------
// export default function ComplaintsReportsPage() {
//   // default: last 30 days
//   const [range, setRange] = useState<DateRange | undefined>({
//     from: subDays(new Date(), 30),
//     to: new Date(),
//   });

//   const [data, setData] = useState<ComplaintsReportRes | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [downloading, setDownloading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   const startDate = useMemo(() => (range?.from ? toYMD(range.from) : undefined), [range?.from]);
//   const endDate = useMemo(() => (range?.to ? toYMD(range.to) : undefined), [range?.to]);

//   async function load() {
//     if (!startDate || !endDate) return;
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await apiCall('POST', '/api/reports/complaints', { range: { startDate, endDate } });
//       const payload: ComplaintsReportRes = res?.data ?? res ?? {
//         stats: {
//           totalComplaints: 0,
//           complaintsResolved: 0,
//           pendingComplaints: 0,
//           positiveAgentRatings: 0,
//           neutralAgentRatings: 0,
//           poorAgentRatings: 0,
//           avgComplaintRating: 0,
//           avgAgentRating: 0,
//           avgResolutionTimeHours: 0,
//         },
//         serviceWise: [],
//       };

//       const s = payload.stats;
//       setData({
//         stats: {
//           totalComplaints: Number(s.totalComplaints || 0),
//           complaintsResolved: Number(s.complaintsResolved || 0),
//           pendingComplaints: Number(s.pendingComplaints || 0),
//           positiveAgentRatings: Number(s.positiveAgentRatings || 0),
//           neutralAgentRatings: Number(s.neutralAgentRatings || 0),
//           poorAgentRatings: Number(s.poorAgentRatings || 0),
//           avgComplaintRating: Number(s.avgComplaintRating || 0),
//           avgAgentRating: Number(s.avgAgentRating || 0),
//           avgResolutionTimeHours: Number(s.avgResolutionTimeHours || 0),
//         },
//         serviceWise: Array.isArray(payload.serviceWise)
//           ? payload.serviceWise.map((row) => ({
//               totalCount: Number(row.totalCount || 0),
//               resolvedCount: Number(row.resolvedCount || 0),
//               pendingCount: Number(row.pendingCount || 0),
//               serviceType: row.serviceType || '—',
//               avgComplaintRating: typeof row.avgComplaintRating === 'number' ? row.avgComplaintRating : undefined,
//               avgAgentRating: typeof row.avgAgentRating === 'number' ? row.avgAgentRating : undefined,
//             }))
//           : [],
//         // keep excel fields if backend includes them
//         excelBase64: (payload as any).excelBase64,
//         excelFileName: (payload as any).excelFileName,
//       });
//     } catch (e: any) {
//       setErr(e?.response?.data?.message || 'Failed to load complaints report');
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Excel download (re-fetch to ensure the current range; falls back to cached)
//   async function handleDownloadExcel() {
//     if (!startDate || !endDate) return;
//     setDownloading(true);
//     try {
//       const res = await apiCall('POST', '/api/reports/complaints', { range: { startDate, endDate } });
//       const fresh = (res?.data ?? res) as Partial<ComplaintsReportRes> & {
//         excelBase64?: string;
//         excelFileName?: string;
//       };

//       const base64 = fresh?.excelBase64 ?? data?.excelBase64;
//       const filename =
//         fresh?.excelFileName ?? data?.excelFileName ?? `complaints_${startDate}_to_${endDate}.xlsx`;

//       if (!base64) {
//         alert('Excel file not provided by API response.');
//         return;
//       }
//       downloadBase64File(base64, filename);
//     } catch (e) {
//       console.error(e);
//       alert('Failed to download Excel.');
//     } finally {
//       setDownloading(false);
//     }
//   }

//   // initial + on date change
//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [startDate, endDate]);

//   const stats = data?.stats;
//   const serviceWise = data?.serviceWise ?? [];

//   return (
//     <div className="flex min-h-screen w-full">
//       {/* Main */}
//       <div className="flex-1 flex flex-col">
//         <Navbar />

//         <div className="px-6 py-6 mt-16">
//           <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//             <Heading title="Complaints Reports" className="mt-0 md:mt-0" />

//             {/* Date Range + Actions */}
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

//               {/* Download Excel */}
//               <Button
//                 variant="secondary"
//                 onClick={handleDownloadExcel}
//                 disabled={!startDate || !endDate || downloading || loading}
//               >
//                 <Download className="mr-2 h-4 w-4" />
//                 {downloading ? 'Downloading…' : 'Download Excel'}
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
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <MetricCard title="Total Complaints" value={stats?.totalComplaints ?? 0} loading={loading} />
//             <MetricCard title="Resolved" value={stats?.complaintsResolved ?? 0} loading={loading} />
//             <MetricCard title="Pending" value={stats?.pendingComplaints ?? 0} loading={loading} />
//           </div>

//           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <MetricCard title="Avg Complaint Rating" value={(stats?.avgComplaintRating ?? 0).toFixed(1)} subtitle="/ 5.0" loading={loading} />
//             <MetricCard title="Avg Agent Rating" value={(stats?.avgAgentRating ?? 0).toFixed(1)} subtitle="/ 5.0" loading={loading} />
//             <MetricCard title="Avg Resolution Time" value={(stats?.avgResolutionTimeHours ?? 0).toFixed(2)} subtitle="hours" loading={loading} />
//           </div>

//           {/* Resolved vs Pending split */}
//           <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
//             <div className="mb-3 text-sm text-muted-foreground">Resolution Split</div>
//             <SplitBar left={stats?.complaintsResolved ?? 0} right={stats?.pendingComplaints ?? 0} leftLabel="Resolved" rightLabel="Pending" />
//             <div className="mt-3 text-xs text-muted-foreground">Endpoint: <code>/api/reports/complaints</code></div>
//           </div>

//           {/* Service-wise table */}
//           <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
//             <div className="mb-3 text-lg font-semibold">Service-wise Breakdown</div>
//             <div className="overflow-auto rounded-xl border">
//               <table className="min-w-full text-sm">
//                 <thead className="bg-muted/50">
//                   <tr>
//                     <th className="px-4 py-2 text-left font-medium">Service</th>
//                     <th className="px-4 py-2 text-right font-medium">Total</th>
//                     <th className="px-4 py-2 text-right font-medium">Resolved</th>
//                     <th className="px-4 py-2 text-right font-medium">Pending</th>
//                     <th className="px-4 py-2 text-right font-medium">Resolved %</th>
//                     <th className="px-4 py-2 text-right font-medium">Avg Compl. Rating</th>
//                     <th className="px-4 py-2 text-right font-medium">Avg Agent Rating</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {serviceWise.length === 0 && (
//                     <tr>
//                       <td className="px-4 py-6 text-center text-muted-foreground" colSpan={7}>No data</td>
//                     </tr>
//                   )}
//                   {serviceWise.map((row) => {
//                     const rp = percent(row.resolvedCount, row.totalCount);
//                     return (
//                       <tr key={row.serviceType} className="odd:bg-white even:bg-muted/30">
//                         <td className="px-4 py-2">{row.serviceType}</td>
//                         <td className="px-4 py-2 text-right font-medium">{row.totalCount}</td>
//                         <td className="px-4 py-2 text-right">{row.resolvedCount}</td>
//                         <td className="px-4 py-2 text-right">{row.pendingCount}</td>
//                         <td className="px-4 py-2 text-right">{rp}%</td>
//                         <td className="px-4 py-2 text-right">{row.avgComplaintRating?.toFixed?.(1) ?? '—'}</td>
//                         <td className="px-4 py-2 text-right">{row.avgAgentRating?.toFixed?.(1) ?? '—'}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
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
interface ComplaintsStats {
  totalComplaints: number;
  complaintsResolved: number;
  pendingComplaints: number;
  positiveAgentRatings: number;
  neutralAgentRatings: number;
  poorAgentRatings: number;
  avgComplaintRating: number; // 1–5
  avgAgentRating: number; // 1–5
  avgResolutionTimeHours: number; // decimal hours
}

interface ServiceWiseRow {
  totalCount: number;
  resolvedCount: number;
  pendingCount: number;
  serviceType: string;
  avgComplaintRating?: number;
  avgAgentRating?: number;
}

interface ComplaintsReportRes {
  stats: ComplaintsStats;
  serviceWise: ServiceWiseRow[];
}

// ---------- Utils ----------
const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');

function percent(part: number, total: number) {
  if (!total) return 0;
  const p = Math.round((part / total) * 100);
  return Number.isFinite(p) ? p : 0;
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

function SplitBar({
  left,
  right,
  leftLabel = 'Resolved',
  rightLabel = 'Pending'
}: {
  left: number;
  right: number;
  leftLabel?: string;
  rightLabel?: string;
}) {
  const total = left + right;
  const lp = percent(left, total);
  const rp = 100 - lp;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {leftLabel}: {lp}%
        </span>
        <span>
          {rightLabel}: {rp}%
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border bg-muted/40">
        <div className="h-full bg-emerald-500" style={{ width: `${lp}%` }} />
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function ComplaintsReportsPage() {
  // default: last 30 days
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const [data, setData] = useState<ComplaintsReportRes | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
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
      const res = await apiCall('POST', '/api/reports/complaints', {
        range: { startDate, endDate }
      });
      const payload: any = res?.data ?? res ?? {};
      const s = payload?.stats ?? {};
      const sourceRows = Array.isArray(payload?.serviceWise)
        ? payload.serviceWise
        : Array.isArray(payload?.complaintTypeWise)
          ? payload.complaintTypeWise
          : [];

      const normalized: ComplaintsReportRes = {
        stats: {
          totalComplaints: Number(s.totalComplaints || 0),
          complaintsResolved: Number(s.complaintsResolved || 0),
          pendingComplaints: Number(s.pendingComplaints || 0),
          positiveAgentRatings: Number(s.positiveAgentRatings || 0),
          neutralAgentRatings: Number(s.neutralAgentRatings || 0),
          poorAgentRatings: Number(s.poorAgentRatings || 0),
          avgComplaintRating: Number(s.avgComplaintRating || 0),
          avgAgentRating: Number(s.avgAgentRating || 0),
          avgResolutionTimeHours: Number(s.avgResolutionTimeHours || 0)
        },
        serviceWise: sourceRows.map((row: any) => ({
          totalCount: Number(row.totalCount || 0),
          resolvedCount: Number(row.resolvedCount || 0),
          pendingCount: Number(row.pendingCount || 0),
          serviceType: row.serviceType || '—',
          avgComplaintRating:
            typeof row.avgComplaintRating === 'number'
              ? row.avgComplaintRating
              : undefined,
          avgAgentRating:
            typeof row.avgAgentRating === 'number'
              ? row.avgAgentRating
              : undefined
        }))
      };

      // const normalized: ComplaintsReportRes = {
      //   stats: {
      //     totalComplaints: Number(s.totalComplaints || 0),
      //     complaintsResolved: Number(s.complaintsResolved || 0),
      //     pendingComplaints: Number(s.pendingComplaints || 0),
      //     positiveAgentRatings: Number(s.positiveAgentRatings || 0),
      //     neutralAgentRatings: Number(s.neutralAgentRatings || 0),
      //     poorAgentRatings: Number(s.poorAgentRatings || 0),
      //     avgComplaintRating: Number(s.avgComplaintRating || 0),
      //     avgAgentRating: Number(s.avgAgentRating || 0),
      //     avgResolutionTimeHours: Number(s.avgResolutionTimeHours || 0)
      //   },
      //   serviceWise: Array.isArray(payload?.serviceWise)
      //     ? payload.serviceWise.map((row: any) => ({
      //         totalCount: Number(row.totalCount || 0),
      //         resolvedCount: Number(row.resolvedCount || 0),
      //         pendingCount: Number(row.pendingCount || 0),
      //         serviceType: row.serviceType || '—',
      //         avgComplaintRating:
      //           typeof row.avgComplaintRating === 'number'
      //             ? row.avgComplaintRating
      //             : undefined,
      //         avgAgentRating:
      //           typeof row.avgAgentRating === 'number'
      //             ? row.avgAgentRating
      //             : undefined
      //       }))
      //     : []
      // };

      setData(normalized);
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Failed to load complaints report');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  // Excel export: flat Summary (Key/Value) + ServiceWise table
  async function handleExportExcel() {
    if (!data?.stats) return;
    setExporting(true);
    try {
      const XLSX = await import('xlsx');

      const s = data.stats;

      // ---- Sheet 1: Summary (Key / Value) ----
      const summaryRows: Array<[string, string | number]> = [
        ['Key', 'Value'],
        ['totalComplaints', s.totalComplaints],
        ['complaintsResolved', s.complaintsResolved],
        ['pendingComplaints', s.pendingComplaints],
        ['positiveAgentRatings', s.positiveAgentRatings],
        ['neutralAgentRatings', s.neutralAgentRatings],
        ['poorAgentRatings', s.poorAgentRatings],
        [
          'avgComplaintRating',
          Number(
            s.avgComplaintRating?.toFixed?.(1) ?? s.avgComplaintRating ?? 0
          )
        ],
        [
          'avgAgentRating',
          Number(s.avgAgentRating?.toFixed?.(1) ?? s.avgAgentRating ?? 0)
        ],
        [
          'avgResolutionTimeHours',
          Number(
            s.avgResolutionTimeHours?.toFixed?.(2) ??
              s.avgResolutionTimeHours ??
              0
          )
        ]
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);

      // ---- Sheet 2: ServiceWise table ----
      const sw = data.serviceWise ?? [];
      const serviceRows = [
        [
          'Service',
          'Total',
          'Resolved',
          'Pending',
          'Resolved %',
          'Avg Compl. Rating',
          'Avg Agent Rating'
        ],
        ...sw.map((r) => [
          r.serviceType || '—',
          r.totalCount ?? 0,
          r.resolvedCount ?? 0,
          r.pendingCount ?? 0,
          (r.totalCount
            ? Math.round((r.resolvedCount / r.totalCount) * 100)
            : 0) + '%',
          typeof r.avgComplaintRating === 'number'
            ? Number(r.avgComplaintRating.toFixed(1))
            : '—',
          typeof r.avgAgentRating === 'number'
            ? Number(r.avgAgentRating.toFixed(1))
            : '—'
        ])
      ];
      const wsService = XLSX.utils.aoa_to_sheet(serviceRows);

      // ---- Build workbook ----
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
      XLSX.utils.book_append_sheet(wb, wsService, 'ServiceWise');

      // ---- File name with range ----
      const filename = `complaints_${startDate ?? 'start'}_to_${endDate ?? 'end'}.xlsx`;

      // ---- Write + download ----
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Failed to export Excel.');
    } finally {
      setExporting(false);
    }
  }

  // initial + on date change
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const stats = data?.stats;
  const serviceWise = data?.serviceWise ?? [];

  return (
    <div className="flex min-h-screen w-full">
      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="px-6 py-6 mt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Heading title="Complaints Reports" className="mt-0 md:mt-0" />

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

              {/* Export Excel */}
              <Button
                variant="secondary"
                onClick={handleExportExcel}
                disabled={
                  !startDate || !endDate || exporting || loading || !data
                }
              >
                <Download className="mr-2 h-4 w-4" />
                {exporting ? 'Exporting…' : 'Export Excel'}
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Total Complaints"
              value={stats?.totalComplaints ?? 0}
              loading={loading}
            />
            <MetricCard
              title="Resolved"
              value={stats?.complaintsResolved ?? 0}
              loading={loading}
            />
            <MetricCard
              title="Pending"
              value={stats?.pendingComplaints ?? 0}
              loading={loading}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Avg Complaint Rating"
              value={(stats?.avgComplaintRating ?? 0).toFixed(1)}
              subtitle="/ 5.0"
              loading={loading}
            />
            <MetricCard
              title="Avg Agent Rating"
              value={(stats?.avgAgentRating ?? 0).toFixed(1)}
              subtitle="/ 5.0"
              loading={loading}
            />
            <MetricCard
              title="Avg Resolution Time"
              value={(stats?.avgResolutionTimeHours ?? 0).toFixed(2)}
              subtitle="hours"
              loading={loading}
            />
          </div>

          {/* Resolved vs Pending split */}
          <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-3 text-sm text-muted-foreground">
              Resolution Split
            </div>
            <SplitBar
              left={stats?.complaintsResolved ?? 0}
              right={stats?.pendingComplaints ?? 0}
              leftLabel="Resolved"
              rightLabel="Pending"
            />
            {/* <div className="mt-3 text-xs text-muted-foreground">
              Endpoint: <code>/api/reports/complaints</code>
            </div> */}
          </div>

          {/* Service-wise table */}
          <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-3 text-lg font-semibold">
              Complaint-wise Breakdown
            </div>
            <div className="overflow-auto rounded-xl border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">
                      Complaint type
                    </th>
                    <th className="px-4 py-2 text-right font-medium">Total</th>
                    <th className="px-4 py-2 text-right font-medium">
                      Resolved
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Pending
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Resolved %
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Avg Compl. Rating
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Avg Agent Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {serviceWise.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-6 text-center text-muted-foreground"
                        colSpan={7}
                      >
                        No data
                      </td>
                    </tr>
                  )}
                  {serviceWise.map((row) => {
                    const rp = percent(row.resolvedCount, row.totalCount);
                    return (
                      <tr
                        key={row.serviceType}
                        className="odd:bg-white even:bg-muted/30"
                      >
                        <td className="px-4 py-2">{row.serviceType}</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {row.totalCount}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {row.resolvedCount}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {row.pendingCount}
                        </td>
                        <td className="px-4 py-2 text-right">{rp}%</td>
                        <td className="px-4 py-2 text-right">
                          {typeof row.avgComplaintRating === 'number'
                            ? row.avgComplaintRating.toFixed(1)
                            : '—'}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {typeof row.avgAgentRating === 'number'
                            ? row.avgAgentRating.toFixed(1)
                            : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
