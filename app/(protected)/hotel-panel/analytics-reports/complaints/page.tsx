// // 'use client';

// // import { useEffect, useMemo, useState } from 'react';
// // import Link from 'next/link';
// // import { format, subDays } from 'date-fns';
// // import type { DateRange } from 'react-day-picker';

// // import Navbar from '@/components/Navbar';
// // import { Heading } from '@/components/ui/heading';
// // import { Button } from '@/components/ui/button';
// // import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
// // import {
// //   Popover,
// //   PopoverContent,
// //   PopoverTrigger
// // } from '@/components/ui/popover';
// // import { Calendar } from '@/components/ui/calendar';
// // import apiCall from '@/lib/axios';
// // import { cn } from '@/lib/utils';

// // type ComplaintsStats = {
// //   totalComplaints: number;
// //   complaintsResolved: number;
// //   pendingComplaints: number;
// //   positiveAgentRatings: number;
// //   neutralAgentRatings: number;
// //   poorAgentRatings: number;
// //   avgComplaintRating: number; // 1..5
// //   avgAgentRating: number; // 1..5
// //   avgResolutionTimeHours: number;
// // };

// // type ServiceWiseItem = {
// //   totalCount: number;
// //   resolvedCount: number;
// //   pendingCount: number;
// //   serviceType: string;
// //   avgComplaintRating: number | null;
// //   avgAgentRating: number | null;
// //   complaintFeedbacks: string[];
// //   agentFeedbacks: string[];
// // };

// // type ComplaintsReportRes = {
// //   stats: ComplaintsStats;
// //   serviceWise: ServiceWiseItem[];
// // };

// // const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');
// // const nf = new Intl.NumberFormat('en-IN');
// // const oneDecimal = (n: number | null | undefined) =>
// //   n === null || n === undefined ? '—' : (Math.round(n * 10) / 10).toFixed(1);

// // export default function ComplaintsReportsPage() {
// //   const today = new Date();

// //   // default: last 30 days through today
// //   const [range, setRange] = useState<DateRange | undefined>({
// //     from: subDays(today, 30),
// //     to: today
// //   });

// //   const [data, setData] = useState<ComplaintsReportRes | null>(null);
// //   const [loading, setLoading] = useState(false);
// //   const [err, setErr] = useState<string | null>(null);

// //   const startDate = useMemo(
// //     () => (range?.from ? toYMD(range.from) : undefined),
// //     [range?.from]
// //   );
// //   const endDate = useMemo(
// //     () => (range?.to ? toYMD(range.to) : undefined),
// //     [range?.to]
// //   );

// //   useEffect(() => {
// //     (async () => {
// //       if (!startDate || !endDate) return;
// //       setLoading(true);
// //       setErr(null);
// //       try {
// //         // Specified payload first
// //         const res = await apiCall('POST', '/api/reports/complaints', {
// //           range: { startDate, endDate }
// //         });
// //         const payload: ComplaintsReportRes = res?.data ?? res ?? ({} as any);
// //         setData(normalize(payload));
// //       } catch (eA: any) {
// //         // Fallbacks for different server shapes
// //         const sA = eA?.response?.status;
// //         try {
// //           const resB = await apiCall('POST', '/api/reports/complaints', {
// //             startDate,
// //             endDate
// //           });
// //           const payloadB: ComplaintsReportRes =
// //             resB?.data ?? resB ?? ({} as any);
// //           setData(normalize(payloadB));
// //         } catch (eB: any) {
// //           try {
// //             const resC = await apiCall(
// //               'GET',
// //               `/api/reports/complaints?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
// //             );
// //             const payloadC: ComplaintsReportRes =
// //               resC?.data ?? resC ?? ({} as any);
// //             setData(normalize(payloadC));
// //           } catch (eC: any) {
// //             const msg =
// //               eC?.response?.data?.message ||
// //               eC?.message ||
// //               'Complaints report endpoint not found';
// //             setErr(`Failed (POST range:${sA ?? 'NA'}). ${msg}`);
// //             console.error('[complaints-report] FAIL', {
// //               A: {
// //                 status: sA,
// //                 msg: eA?.response?.data?.message || eA?.message
// //               },
// //               B: {
// //                 status: eB?.response?.status,
// //                 msg: eB?.response?.data?.message || eB?.message
// //               },
// //               C: { status: eC?.response?.status, msg }
// //             });
// //           }
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, [startDate, endDate]);

// //   const stats = data?.stats;
// //   const serviceWise = data?.serviceWise ?? [];

// //   return (
// //     <div className="flex min-h-screen w-full">
// //       <div className="flex-1 flex flex-col">
// //         <Navbar />
// //         <div className="px-6 py-6 mt-16">
// //           <div className="flex items-center justify-between">
// //             <Heading title="Complaints Report" className="mt-0 md:mt-0" />

// //             {/* Date Range Filter */}
// //             <Popover>
// //               <PopoverTrigger asChild>
// //                 <Button
// //                   variant="outline"
// //                   className={cn(
// //                     'w-full sm:w-auto justify-start text-left font-normal',
// //                     !startDate || !endDate ? 'text-muted-foreground' : ''
// //                   )}
// //                 >
// //                   <CalendarIcon className="mr-2 h-4 w-4" />
// //                   {startDate && endDate
// //                     ? `${startDate} → ${endDate}`
// //                     : 'Pick a date range'}
// //                 </Button>
// //               </PopoverTrigger>
// //               <PopoverContent className="w-auto p-0" align="end">
// //                 <Calendar
// //                   mode="range"
// //                   numberOfMonths={2}
// //                   selected={range}
// //                   onSelect={(r) => {
// //                     if (!r) return setRange(undefined);
// //                     const next: DateRange = { from: r.from, to: r.to ?? today };
// //                     if (next.to && next.to > today) next.to = today;
// //                     if (next.from && next.from > today) next.from = today;
// //                     setRange(next);
// //                   }}
// //                   defaultMonth={range?.to ?? today}
// //                   disabled={{ after: today }}
// //                   toMonth={today}
// //                 />
// //               </PopoverContent>
// //             </Popover>
// //           </div>

// //           {/* Error */}
// //           {err && (
// //             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// //               {err}
// //             </div>
// //           )}

// //           {/* Summary cards */}
// //           <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
// //             <MetricCard
// //               title="Total Complaints"
// //               value={nf.format(stats?.totalComplaints ?? 0)}
// //               loading={loading}
// //             />
// //             <MetricCard
// //               title="Resolved"
// //               value={nf.format(stats?.complaintsResolved ?? 0)}
// //               loading={loading}
// //             />
// //             <MetricCard
// //               title="Pending"
// //               value={nf.format(stats?.pendingComplaints ?? 0)}
// //               loading={loading}
// //             />
// //             <MetricCard
// //               title="Avg Resolution (hrs)"
// //               value={oneDecimal(stats?.avgResolutionTimeHours)}
// //               loading={loading}
// //             />

// //             <MetricCard
// //               title="Positive Agent Ratings"
// //               value={nf.format(stats?.positiveAgentRatings ?? 0)}
// //               loading={loading}
// //             />
// //             <MetricCard
// //               title="Neutral Agent Ratings"
// //               value={nf.format(stats?.neutralAgentRatings ?? 0)}
// //               loading={loading}
// //             />
// //             <MetricCard
// //               title="Poor Agent Ratings"
// //               value={nf.format(stats?.poorAgentRatings ?? 0)}
// //               loading={loading}
// //             />
// //             <MetricCard
// //               title="Avg Complaint Rating"
// //               value={oneDecimal(stats?.avgComplaintRating)}
// //               loading={loading}
// //             />

// //             <MetricCard
// //               title="Avg Agent Rating"
// //               value={oneDecimal(stats?.avgAgentRating)}
// //               loading={loading}
// //             />
// //           </div>

// //           {/* Service-wise table */}
// //           <div className="mt-10">
// //             <h3 className="text-lg font-semibold mb-3">
// //               Service-wise Breakdown
// //             </h3>
// //             <div className="overflow-auto rounded-xl border">
// //               <table className="min-w-[900px] w-full text-sm">
// //                 <thead className="bg-gray-50 text-gray-600">
// //                   <tr>
// //                     <Th>Service</Th>
// //                     <Th className="text-right">Total</Th>
// //                     <Th className="text-right">Resolved</Th>
// //                     <Th className="text-right">Pending</Th>
// //                     <Th className="text-right">Avg Complaint ★</Th>
// //                     <Th className="text-right">Avg Agent ★</Th>
// //                     <Th className="text-right">
// //                       Feedbacks (Complaints / Agents)
// //                     </Th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {serviceWise.length === 0 && (
// //                     <tr>
// //                       <td colSpan={7} className="p-4 text-center text-gray-500">
// //                         No data for this range.
// //                       </td>
// //                     </tr>
// //                   )}
// //                   {serviceWise.map((row, idx) => (
// //                     <tr key={`${row.serviceType}-${idx}`} className="border-t">
// //                       <Td className="font-medium">{row.serviceType || '—'}</Td>
// //                       <TdRight>{nf.format(row.totalCount ?? 0)}</TdRight>
// //                       <TdRight>{nf.format(row.resolvedCount ?? 0)}</TdRight>
// //                       <TdRight>{nf.format(row.pendingCount ?? 0)}</TdRight>
// //                       <TdRight>{oneDecimal(row.avgComplaintRating)}</TdRight>
// //                       <TdRight>{oneDecimal(row.avgAgentRating)}</TdRight>
// //                       <TdRight>
// //                         {row.complaintFeedbacks?.length ?? 0} /{' '}
// //                         {row.agentFeedbacks?.length ?? 0}
// //                       </TdRight>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>

// //             <div className="mt-8">
// //               <Link
// //                 href="/hotel-panel/analytics-reports"
// //                 className="text-sm underline hover:opacity-80"
// //               >
// //                 ← Back to Analytics & Reports
// //               </Link>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function normalize(p: Partial<ComplaintsReportRes>): ComplaintsReportRes {
// //   const stats = p.stats ?? ({} as Partial<ComplaintsStats>);
// //   return {
// //     stats: {
// //       totalComplaints: Number(stats.totalComplaints ?? 0),
// //       complaintsResolved: Number(stats.complaintsResolved ?? 0),
// //       pendingComplaints: Number(stats.pendingComplaints ?? 0),
// //       positiveAgentRatings: Number(stats.positiveAgentRatings ?? 0),
// //       neutralAgentRatings: Number(stats.neutralAgentRatings ?? 0),
// //       poorAgentRatings: Number(stats.poorAgentRatings ?? 0),
// //       avgComplaintRating: Number(stats.avgComplaintRating ?? 0),
// //       avgAgentRating: Number(stats.avgAgentRating ?? 0),
// //       avgResolutionTimeHours: Number(stats.avgResolutionTimeHours ?? 0)
// //     },
// //     serviceWise: Array.isArray(p.serviceWise) ? p.serviceWise : []
// //   };
// // }

// // /* Reusable bits */
// // function MetricCard({
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

// // function Th({
// //   children,
// //   className = ''
// // }: {
// //   children: React.ReactNode;
// //   className?: string;
// // }) {
// //   return (
// //     <th
// //       className={cn(
// //         'px-3 py-2 text-left text-xs font-medium uppercase tracking-wide',
// //         className
// //       )}
// //     >
// //       {children}
// //     </th>
// //   );
// // }
// // function Td({
// //   children,
// //   className = ''
// // }: {
// //   children: React.ReactNode;
// //   className?: string;
// // }) {
// //   return (
// //     <td className={cn('px-3 py-2 align-middle', className)}>{children}</td>
// //   );
// // }
// // function TdRight({
// //   children,
// //   className = ''
// // }: {
// //   children: React.ReactNode;
// //   className?: string;
// // }) {
// //   return (
// //     <td className={cn('px-3 py-2 text-right align-middle', className)}>
// //       {children}
// //     </td>
// //   );
// // }
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

// type ComplaintsStats = {
//   totalComplaints: number;
//   complaintsResolved: number;
//   pendingComplaints: number;
//   positiveAgentRatings: number;
//   neutralAgentRatings: number;
//   poorAgentRatings: number;
//   avgComplaintRating: number; // 1..5
//   avgAgentRating: number; // 1..5
//   avgResolutionTimeHours: number; // hours
// };

// type ServiceWiseItem = {
//   totalCount: number;
//   resolvedCount: number;
//   pendingCount: number;
//   serviceType: string;
//   avgComplaintRating: number | null;
//   avgAgentRating: number | null;
// };

// type ComplaintsReportRes = {
//   stats: ComplaintsStats;
//   serviceWise: ServiceWiseItem[];
// };

// const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');
// const nf = new Intl.NumberFormat('en-IN');
// const oneDecimal = (n: number | null | undefined) =>
//   n === null || n === undefined ? '—' : (Math.round(n * 10) / 10).toFixed(1);

// export default function ComplaintsReportsPage() {
//   const today = new Date();

//   // default: last 30 days through today
//   const [range, setRange] = useState<DateRange | undefined>({
//     from: subDays(today, 30),
//     to: today
//   });

//   const [data, setData] = useState<ComplaintsReportRes | null>(null);
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
//         // Your spec: POST with { range: { startDate, endDate } }
//         const res = await apiCall('POST', '/api/reports/complaints', {
//           range: { startDate, endDate }
//         });
//         const payload: ComplaintsReportRes = res?.data ?? res ?? ({} as any);
//         setData(normalize(payload));
//       } catch (eA: any) {
//         // Fallbacks for slight API variations
//         const sA = eA?.response?.status;
//         try {
//           const resB = await apiCall('POST', '/api/reports/complaints', {
//             startDate,
//             endDate
//           });
//           const payloadB: ComplaintsReportRes =
//             resB?.data ?? resB ?? ({} as any);
//           setData(normalize(payloadB));
//         } catch (eB: any) {
//           try {
//             const resC = await apiCall(
//               'GET',
//               `/api/reports/complaints?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
//             );
//             const payloadC: ComplaintsReportRes =
//               resC?.data ?? resC ?? ({} as any);
//             setData(normalize(payloadC));
//           } catch (eC: any) {
//             const msg =
//               eC?.response?.data?.message ||
//               eC?.message ||
//               'Complaints report endpoint not found';
//             setErr(`Failed to load complaints report. ${msg}`);
//             console.error('[complaints-report] FAIL', {
//               A: {
//                 status: sA,
//                 msg: eA?.response?.data?.message || eA?.message
//               },
//               B: {
//                 status: eB?.response?.status,
//                 msg: eB?.response?.data?.message || eB?.message
//               },
//               C: { status: eC?.response?.status, msg }
//             });
//           }
//         }
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [startDate, endDate]);

//   const stats = data?.stats;
//   const serviceWise = data?.serviceWise ?? [];

//   return (
//     <div className="flex min-h-screen w-full">
//       <div className="flex-1 flex flex-col">
//         <Navbar />
//         <div className="px-6 py-6 mt-16">
//           <div className="flex items-center justify-between">
//             <Heading title="Complaints Report" className="mt-0 md:mt-0" />

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

//           {/* Summary cards */}
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
//             <MetricCard
//               title="Total Complaints"
//               value={nf.format(stats?.totalComplaints ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Resolved"
//               value={nf.format(stats?.complaintsResolved ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Pending"
//               value={nf.format(stats?.pendingComplaints ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Avg Resolution (hrs)"
//               value={oneDecimal(stats?.avgResolutionTimeHours)}
//               loading={loading}
//             />

//             <MetricCard
//               title="Positive Agent Ratings"
//               value={nf.format(stats?.positiveAgentRatings ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Neutral Agent Ratings"
//               value={nf.format(stats?.neutralAgentRatings ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Poor Agent Ratings"
//               value={nf.format(stats?.poorAgentRatings ?? 0)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Avg Complaint Rating"
//               value={oneDecimal(stats?.avgComplaintRating)}
//               loading={loading}
//             />
//             <MetricCard
//               title="Avg Agent Rating"
//               value={oneDecimal(stats?.avgAgentRating)}
//               loading={loading}
//             />
//           </div>

//           {/* Service-wise table */}
//           <div className="mt-10">
//             <h3 className="text-lg font-semibold mb-3">
//               Service-wise Breakdown
//             </h3>
//             <div className="overflow-auto rounded-xl border">
//               <table className="min-w-[900px] w-full text-sm">
//                 <thead className="bg-gray-50 text-gray-600">
//                   <tr>
//                     <Th>Service</Th>
//                     <Th className="text-right">Total</Th>
//                     <Th className="text-right">Resolved</Th>
//                     <Th className="text-right">Pending</Th>
//                     <Th className="text-right">Avg Complaint ★</Th>
//                     <Th className="text-right">Avg Agent ★</Th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {serviceWise.length === 0 && (
//                     <tr>
//                       <td colSpan={6} className="p-4 text-center text-gray-500">
//                         No data for this range.
//                       </td>
//                     </tr>
//                   )}
//                   {serviceWise.map((row, idx) => (
//                     <tr key={`${row.serviceType}-${idx}`} className="border-t">
//                       <Td className="font-medium">{row.serviceType || '—'}</Td>
//                       <TdRight>{nf.format(row.totalCount ?? 0)}</TdRight>
//                       <TdRight>{nf.format(row.resolvedCount ?? 0)}</TdRight>
//                       <TdRight>{nf.format(row.pendingCount ?? 0)}</TdRight>
//                       <TdRight>{oneDecimal(row.avgComplaintRating)}</TdRight>
//                       <TdRight>{oneDecimal(row.avgAgentRating)}</TdRight>
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

// /** Normalize payload safely */
// function normalize(p: Partial<ComplaintsReportRes>): ComplaintsReportRes {
//   const stats = p.stats ?? ({} as Partial<ComplaintsStats>);
//   return {
//     stats: {
//       totalComplaints: Number(stats.totalComplaints ?? 0),
//       complaintsResolved: Number(stats.complaintsResolved ?? 0),
//       pendingComplaints: Number(stats.pendingComplaints ?? 0),
//       positiveAgentRatings: Number(stats.positiveAgentRatings ?? 0),
//       neutralAgentRatings: Number(stats.neutralAgentRatings ?? 0),
//       poorAgentRatings: Number(stats.poorAgentRatings ?? 0),
//       avgComplaintRating: Number(stats.avgComplaintRating ?? 0),
//       avgAgentRating: Number(stats.avgAgentRating ?? 0),
//       avgResolutionTimeHours: Number(stats.avgResolutionTimeHours ?? 0)
//     },
//     serviceWise: Array.isArray(p.serviceWise)
//       ? p.serviceWise.map((s) => ({
//           totalCount: Number(s.totalCount ?? 0),
//           resolvedCount: Number(s.resolvedCount ?? 0),
//           pendingCount: Number(s.pendingCount ?? 0),
//           serviceType: s.serviceType ?? '—',
//           avgComplaintRating: s.avgComplaintRating ?? null,
//           avgAgentRating: s.avgAgentRating ?? null
//         }))
//       : []
//   };
// }

// /* Reusable bits */
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
import { Calendar as CalendarIcon, Download, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import apiCall from '@/lib/axios';
import { cn } from '@/lib/utils';

type ComplaintsStats = {
  totalComplaints: number;
  complaintsResolved: number;
  pendingComplaints: number;
  positiveAgentRatings: number;
  neutralAgentRatings: number;
  poorAgentRatings: number;
  avgComplaintRating: number; // 1..5
  avgAgentRating: number; // 1..5
  avgResolutionTimeHours: number; // hours
};

type ServiceWiseItem = {
  totalCount: number;
  resolvedCount: number;
  pendingCount: number;
  serviceType: string;
  avgComplaintRating: number | null;
  avgAgentRating: number | null;
};

type ComplaintsReportRes = {
  stats: ComplaintsStats;
  serviceWise: ServiceWiseItem[];
  excelBase64?: string;
  excelFileName?: string;
};

const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');

const nf = new Intl.NumberFormat('en-IN');
const oneDecimal = (n: number | null | undefined) =>
  n === null || n === undefined ? '—' : (Math.round(n * 10) / 10).toFixed(1);

export default function ComplaintsReportsPage() {
  const today = new Date();

  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(today, 30),
    to: today
  });

  const [data, setData] = useState<ComplaintsReportRes | null>(null);
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

  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) return;
      setLoading(true);
      setErr(null);
      try {
        const res = await apiCall('POST', '/api/reports/complaints', {
          range: { startDate, endDate }
        });
        const payload: ComplaintsReportRes = res?.data ?? res ?? {};
        setData(normalize(payload));
      } catch (eA: any) {
        const sA = eA?.response?.status;
        try {
          const resB = await apiCall('POST', '/api/reports/complaints', {
            startDate,
            endDate
          });
          const payloadB: ComplaintsReportRes = resB?.data ?? resB ?? {};
          setData(normalize(payloadB));
        } catch (eB: any) {
          try {
            const resC = await apiCall(
              'GET',
              `/api/reports/complaints?startDate=${encodeURIComponent(
                startDate
              )}&endDate=${encodeURIComponent(endDate)}`
            );
            const payloadC: ComplaintsReportRes = resC?.data ?? resC ?? {};
            setData(normalize(payloadC));
          } catch (eC: any) {
            const msg =
              eC?.response?.data?.message ||
              eC?.message ||
              'Complaints report endpoint not found';
            setErr(`Failed: ${msg}`);
            console.error('[complaints-report] FAIL', {
              A: {
                status: sA,
                msg: eA?.response?.data?.message || eA?.message
              },
              B: {
                status: eB?.response?.status,
                msg: eB?.response?.data?.message || eB?.message
              },
              C: { status: eC?.response?.status, msg }
            });
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate]);

  function handleExcelDownload(excelBase64: string, fileName: string) {
    setDownloading(true);
    try {
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
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  }

  async function handleRefresh() {
    if (!startDate || !endDate) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await apiCall('POST', '/api/reports/complaints', {
        range: { startDate, endDate }
      });
      const payload: ComplaintsReportRes = res?.data ?? res ?? {};
      setData(normalize(payload));
    } catch {
      setErr('Failed to refresh complaints report');
    } finally {
      setLoading(false);
    }
  }

  const stats = data?.stats;
  const serviceWise = data?.serviceWise ?? [];

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="px-6 py-6 mt-16">
          {/* Header and Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <Heading title="Complaints Report" className="mt-0 md:mt-0" />
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
              <Button onClick={handleRefresh} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
                  </>
                ) : (
                  'Refresh'
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  data?.excelBase64 &&
                  handleExcelDownload(
                    data.excelBase64,
                    data.excelFileName ?? 'report.xlsx'
                  )
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

          {/* Summary cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Total Complaints"
              value={nf.format(stats?.totalComplaints ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Resolved"
              value={nf.format(stats?.complaintsResolved ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Pending"
              value={nf.format(stats?.pendingComplaints ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Avg Resolution (hrs)"
              value={oneDecimal(stats?.avgResolutionTimeHours)}
              loading={loading}
            />
            <MetricCard
              title="Positive Agent Ratings"
              value={nf.format(stats?.positiveAgentRatings ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Neutral Agent Ratings"
              value={nf.format(stats?.neutralAgentRatings ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Poor Agent Ratings"
              value={nf.format(stats?.poorAgentRatings ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Avg Complaint Rating"
              value={oneDecimal(stats?.avgComplaintRating)}
              loading={loading}
            />
            <MetricCard
              title="Avg Agent Rating"
              value={oneDecimal(stats?.avgAgentRating)}
              loading={loading}
            />
          </div>

          {/* Service-wise table */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">
              Service-wise Breakdown
            </h3>
            <div className="overflow-auto rounded-xl border">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <Th>Service</Th>
                    <Th className="text-right">Total</Th>
                    <Th className="text-right">Resolved</Th>
                    <Th className="text-right">Pending</Th>
                    <Th className="text-right">Avg Complaint ★</Th>
                    <Th className="text-right">Avg Agent ★</Th>
                  </tr>
                </thead>
                <tbody>
                  {serviceWise.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">
                        No data for this range.
                      </td>
                    </tr>
                  ) : (
                    serviceWise.map((row, idx) => (
                      <tr
                        key={`${row.serviceType}-${idx}`}
                        className="border-t"
                      >
                        <Td className="font-medium">
                          {row.serviceType || '—'}
                        </Td>
                        <TdRight>{nf.format(row.totalCount ?? 0)}</TdRight>
                        <TdRight>{nf.format(row.resolvedCount ?? 0)}</TdRight>
                        <TdRight>{nf.format(row.pendingCount ?? 0)}</TdRight>
                        <TdRight>{oneDecimal(row.avgComplaintRating)}</TdRight>
                        <TdRight>{oneDecimal(row.avgAgentRating)}</TdRight>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
    </div>
  );
}

function normalize(p: Partial<ComplaintsReportRes>): ComplaintsReportRes {
  const stats = p.stats ?? ({} as Partial<ComplaintsStats>);
  return {
    stats: {
      totalComplaints: Number(stats.totalComplaints ?? 0),
      complaintsResolved: Number(stats.complaintsResolved ?? 0),
      pendingComplaints: Number(stats.pendingComplaints ?? 0),
      positiveAgentRatings: Number(stats.positiveAgentRatings ?? 0),
      neutralAgentRatings: Number(stats.neutralAgentRatings ?? 0),
      poorAgentRatings: Number(stats.poorAgentRatings ?? 0),
      avgComplaintRating: Number(stats.avgComplaintRating ?? 0),
      avgAgentRating: Number(stats.avgAgentRating ?? 0),
      avgResolutionTimeHours: Number(stats.avgResolutionTimeHours ?? 0)
    },
    serviceWise: Array.isArray(p.serviceWise)
      ? p.serviceWise.map((s) => ({
          totalCount: Number(s.totalCount ?? 0),
          resolvedCount: Number(s.resolvedCount ?? 0),
          pendingCount: Number(s.pendingCount ?? 0),
          serviceType: s.serviceType ?? '—',
          avgComplaintRating: s.avgComplaintRating ?? null,
          avgAgentRating: s.avgAgentRating ?? null
        }))
      : [],
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
