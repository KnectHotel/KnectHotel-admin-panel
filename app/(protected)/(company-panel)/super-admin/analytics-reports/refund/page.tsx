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

// // type Totals = {
// //   totalCount: number;
// //   InitiatedCount: number;
// //   InprogressCount: number;
// //   CompletedCount: number;
// //   RejectedCount: number;
// // };

// // type ByServiceRow = Totals & { serviceType: string | null | undefined };

// // type RefundsReportRes = {
// //   grandTotal: Totals[]; // usually length 1
// //   byServiceType: ByServiceRow[];
// // };

// // const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');
// // const nf = new Intl.NumberFormat('en-IN');

// // function normalize(raw: any): { totals: Totals; byService: ByServiceRow[] } {
// //   const gtArr: any[] = Array.isArray(raw?.grandTotal)
// //     ? raw.grandTotal
// //     : Array.isArray(raw?.data?.grandTotal)
// //       ? raw.data.grandTotal
// //       : [];
// //   const totals: Totals = {
// //     totalCount: Number(gtArr?.[0]?.totalCount ?? 0),
// //     InitiatedCount: Number(gtArr?.[0]?.InitiatedCount ?? 0),
// //     InprogressCount: Number(gtArr?.[0]?.InprogressCount ?? 0),
// //     CompletedCount: Number(gtArr?.[0]?.CompletedCount ?? 0),
// //     RejectedCount: Number(gtArr?.[0]?.RejectedCount ?? 0)
// //   };

// //   const bsArr: any[] = Array.isArray(raw?.byServiceType)
// //     ? raw.byServiceType
// //     : Array.isArray(raw?.data?.byServiceType)
// //       ? raw.data.byServiceType
// //       : [];

// //   const byService: ByServiceRow[] = bsArr.map((r) => ({
// //     totalCount: Number(r?.totalCount ?? 0),
// //     InitiatedCount: Number(r?.InitiatedCount ?? 0),
// //     InprogressCount: Number(r?.InprogressCount ?? 0),
// //     CompletedCount: Number(r?.CompletedCount ?? 0),
// //     RejectedCount: Number(r?.RejectedCount ?? 0),
// //     serviceType: r?.serviceType ?? null
// //   }));

// //   return { totals, byService };
// // }

// // export default function RefundsReportsPage() {
// //   const today = new Date();

// //   // default: last 30 days through today
// //   const [range, setRange] = useState<DateRange | undefined>({
// //     from: subDays(today, 30),
// //     to: today
// //   });

// //   const [data, setData] = useState<{
// //     totals: Totals;
// //     byService: ByServiceRow[];
// //   } | null>(null);
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
// //         const res = await apiCall('POST', '/api/reports/refunds', {
// //           range: { startDate, endDate }
// //         });
// //         const payload = res?.data ?? res ?? {};
// //         setData(normalize(payload));
// //       } catch (eA: any) {
// //         // Fallbacks: flat POST, then GET with query params
// //         try {
// //           const resB = await apiCall('POST', '/api/reports/refunds', {
// //             startDate,
// //             endDate
// //           });
// //           const payloadB = resB?.data ?? resB ?? {};
// //           setData(normalize(payloadB));
// //         } catch (eB: any) {
// //           try {
// //             const q = `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
// //             const resC = await apiCall('GET', `/api/reports/refunds${q}`);
// //             const payloadC = resC?.data ?? resC ?? {};
// //             setData(normalize(payloadC));
// //           } catch (eC: any) {
// //             const msg =
// //               eC?.response?.data?.message ||
// //               eB?.response?.data?.message ||
// //               eA?.response?.data?.message ||
// //               eC?.message ||
// //               eB?.message ||
// //               eA?.message ||
// //               'Refunds report endpoint not found';
// //             setErr(`Failed to load refunds report. ${msg}`);
// //             setData(null);
// //           }
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, [startDate, endDate]);

// //   const totals = data?.totals;
// //   const rows = data?.byService ?? [];

// //   return (
// //     <div className="flex min-h-screen w-full">
// //       <div className="flex-1 flex flex-col">
// //         <Navbar />

// //         <div className="px-6 py-6 mt-16">
// //           <div className="flex items-center justify-between">
// //             <Heading title="Refunds Report" className="mt-0 md:mt-0" />

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

// //           {/* Summary cards from grandTotal[0] */}
// //           <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
// //             <MetricCard
// //               title="Total Requests"
// //               value={nf.format(totals?.totalCount ?? 0)}
// //               loading={loading}
// //             />
// //             <MetricCard
// //               title="Initiated"
// //               value={nf.format(totals?.InitiatedCount ?? 0)}
// //               loading={loading}
// //             />
// //             <MetricCard
// //               title="In-Progress"
// //               value={nf.format(totals?.InprogressCount ?? 0)}
// //               loading={loading}
// //             />
// //             <MetricCard
// //               title="Completed"
// //               value={nf.format(totals?.CompletedCount ?? 0)}
// //               loading={loading}
// //             />
// //             <MetricCard
// //               title="Rejected"
// //               value={nf.format(totals?.RejectedCount ?? 0)}
// //               loading={loading}
// //             />
// //           </div>

// //           {/* Service-wise table */}
// //           <div className="mt-10">
// //             <h3 className="text-lg font-semibold mb-3">
// //               Service-wise Breakdown
// //             </h3>
// //             <div className="overflow-auto rounded-xl border">
// //               <table className="min-w-[820px] w-full text-sm">
// //                 <thead className="bg-gray-50 text-gray-600">
// //                   <tr>
// //                     <Th>Service Type</Th>
// //                     <Th className="text-right">Total</Th>
// //                     <Th className="text-right">Initiated</Th>
// //                     <Th className="text-right">In-Progress</Th>
// //                     <Th className="text-right">Completed</Th>
// //                     <Th className="text-right">Rejected</Th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {(!rows || rows.length === 0) && (
// //                     <tr>
// //                       <td colSpan={6} className="p-4 text-center text-gray-500">
// //                         No data for this range.
// //                       </td>
// //                     </tr>
// //                   )}
// //                   {rows.map((r, idx) => (
// //                     <tr
// //                       key={`${r.serviceType ?? 'unknown'}-${idx}`}
// //                       className="border-t"
// //                     >
// //                       <Td className="font-medium">
// //                         {r.serviceType || 'Unknown'}
// //                       </Td>
// //                       <TdRight>{nf.format(r.totalCount ?? 0)}</TdRight>
// //                       <TdRight>{nf.format(r.InitiatedCount ?? 0)}</TdRight>
// //                       <TdRight>{nf.format(r.InprogressCount ?? 0)}</TdRight>
// //                       <TdRight>{nf.format(r.CompletedCount ?? 0)}</TdRight>
// //                       <TdRight>{nf.format(r.RejectedCount ?? 0)}</TdRight>
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

// // /* UI bits */
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
// import { Calendar as CalendarIcon, Download, Loader2 } from 'lucide-react';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
//   grandTotal: Totals[]; // length 1
//   byServiceType: ByServiceRow[];
//   excelBase64?: string;
//   excelFileName?: string;
// };

// const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');
// const nf = new Intl.NumberFormat('en-IN');

// function normalize(raw: any): {
//   totals: Totals;
//   byService: ByServiceRow[];
//   excelBase64?: string;
//   excelFileName?: string;
// } {
//   const gtArr: any[] = Array.isArray(raw?.grandTotal)
//     ? raw.grandTotal
//     : Array.isArray(raw?.data?.grandTotal)
//     ? raw.data.grandTotal
//     : [];
//   const totals: Totals = {
//     totalCount: Number(gtArr?.[0]?.totalCount ?? 0),
//     InitiatedCount: Number(gtArr?.[0]?.InitiatedCount ?? 0),
//     InprogressCount: Number(gtArr?.[0]?.InprogressCount ?? 0),
//     CompletedCount: Number(gtArr?.[0]?.CompletedCount ?? 0),
//     RejectedCount: Number(gtArr?.[0]?.RejectedCount ?? 0),
//   };

//   const bsArr: any[] = Array.isArray(raw?.byServiceType)
//     ? raw.byServiceType
//     : Array.isArray(raw?.data?.byServiceType)
//     ? raw.data.byServiceType
//     : [];

//   const byService: ByServiceRow[] = bsArr.map((r) => ({
//     totalCount: Number(r?.totalCount ?? 0),
//     InitiatedCount: Number(r?.InitiatedCount ?? 0),
//     InprogressCount: Number(r?.InprogressCount ?? 0),
//     CompletedCount: Number(r?.CompletedCount ?? 0),
//     RejectedCount: Number(r?.RejectedCount ?? 0),
//     serviceType: r?.serviceType ?? null,
//   }));

//   return {
//     totals,
//     byService,
//     excelBase64: raw?.excelBase64 ?? raw?.data?.excelBase64,
//     excelFileName: raw?.excelFileName ?? raw?.data?.excelFileName,
//   };
// }

// function downloadBase64File(
//   base64: string,
//   filename = 'refundCount.xlsx',
//   mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// ) {
//   const clean = base64
//     .replace(/^data:.*?;base64,/, '')
//     .replace(/[\r\n]+/g, '')
//     .replace(/-/g, '+')
//     .replace(/_/g, '/');

//   const byteChars = atob(clean);
//   const bytes = new Uint8Array(byteChars.length);
//   for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);

//   const blob = new Blob([bytes], { type: mime });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   URL.revokeObjectURL(url);
// }

// export default function RefundsReportsPage() {
//   const today = new Date();

//   // default: last 30 days through today
//   const [range, setRange] = useState<DateRange | undefined>({
//     from: subDays(today, 30),
//     to: today,
//   });

//   const [data, setData] = useState<{
//     totals: Totals;
//     byService: ByServiceRow[];
//     excelBase64?: string;
//     excelFileName?: string;
//   } | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [downloading, setDownloading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   const startDate = useMemo(() => (range?.from ? toYMD(range.from) : undefined), [range?.from]);
//   const endDate = useMemo(() => (range?.to ? toYMD(range.to) : undefined), [range?.to]);

//   async function fetchRefunds() {
//     // Try preferred payload -> fallback to variants
//     try {
//       const res = await apiCall('POST', '/api/reports/refunds', {
//         range: { startDate, endDate },
//       });
//       return res?.data ?? res;
//     } catch {
//       try {
//         const resB = await apiCall('POST', '/api/reports/refunds', { startDate, endDate });
//         return resB?.data ?? resB;
//       } catch {
//         const q = `?startDate=${encodeURIComponent(startDate!)}&endDate=${encodeURIComponent(endDate!)}`;
//         const resC = await apiCall('GET', `/api/reports/refunds${q}`);
//         return resC?.data ?? resC;
//       }
//     }
//   }

//   useEffect(() => {
//     (async () => {
//       if (!startDate || !endDate) return;
//       setLoading(true);
//       setErr(null);
//       try {
//         const payload = await fetchRefunds();
//         setData(normalize(payload));
//       } catch (e: any) {
//         setErr(e?.response?.data?.message || 'Refunds report endpoint not found');
//         setData(null);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [startDate, endDate]);

//   async function handleDownloadExcel() {
//     if (!startDate || !endDate) return;
//     setDownloading(true);
//     try {
//       const fresh = await fetchRefunds();
//       const n = normalize(fresh);
//       const base64 = n.excelBase64 ?? data?.excelBase64;
//       const filename =
//         n.excelFileName ?? data?.excelFileName ?? `refundCount_${startDate}_to_${endDate}.xlsx`;
//       if (!base64) {
//         alert('Excel file not provided by API for the selected range.');
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

//   const totals = data?.totals;
//   const rows = data?.byService ?? [];

//   return (
//     <div className="flex min-h-screen w-full">
//       <div className="flex-1 flex flex-col">
//         <Navbar />

//         <div className="px-6 py-6 mt-16">
//           <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//             <Heading title="Refunds Report" className="mt-0 md:mt-0" />

//             {/* Date Range & Actions */}
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
//                     onSelect={(r) => {
//                       if (!r) return setRange(undefined);
//                       const next: DateRange = { from: r.from, to: r.to ?? today };
//                       if (next.to && next.to > today) next.to = today;
//                       if (next.from && next.from > today) next.from = today;
//                       setRange(next);
//                     }}
//                     defaultMonth={range?.to ?? today}
//                     disabled={{ after: today }}
//                     toMonth={today}
//                   />
//                 </PopoverContent>
//               </Popover>

//               <Button onClick={handleDownloadExcel} disabled={downloading || loading || !startDate || !endDate}>
//                 {downloading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Downloading…
//                   </>
//                 ) : (
//                   <>
//                     <Download className="mr-2 h-4 w-4" /> Download Excel
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>

//           {/* Error */}
//           {err && (
//             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//               {err}
//             </div>
//           )}

//           {/* Summary cards from grandTotal[0] */}
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
//             <MetricCard title="Total Requests" value={nf.format(totals?.totalCount ?? 0)} loading={loading} />
//             <MetricCard title="Initiated" value={nf.format(totals?.InitiatedCount ?? 0)} loading={loading} />
//             <MetricCard title="In-Progress" value={nf.format(totals?.InprogressCount ?? 0)} loading={loading} />
//             <MetricCard title="Completed" value={nf.format(totals?.CompletedCount ?? 0)} loading={loading} />
//             <MetricCard title="Rejected" value={nf.format(totals?.RejectedCount ?? 0)} loading={loading} />
//           </div>

//           {/* Service-wise table */}
//           <div className="mt-10">
//             <h3 className="text-lg font-semibold mb-3">Service-wise Breakdown</h3>
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
//                     <tr key={`${r.serviceType ?? 'unknown'}-${idx}`} className="border-t">
//                       <Td className="font-medium">{r.serviceType || 'Unknown'}</Td>
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
//               <Link href="/hotel-panel/analytics-reports" className="text-sm underline hover:opacity-80">
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
//   loading,
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
//       <div className="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">{value}</div>
//     </div>
//   );
// }

// function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
//   return (
//     <th className={cn('px-3 py-2 text-left text-xs font-medium uppercase tracking-wide', className)}>
//       {children}
//     </th>
//   );
// }
// function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
//   return <td className={cn('px-3 py-2 align-middle', className)}>{children}</td>;
// }
// function TdRight({ children, className = '' }: { children: React.ReactNode; className?: string }) {
//   return <td className={cn('px-3 py-2 text-right align-middle', className)}>{children}</td>;
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

type Totals = {
  totalCount: number;
  InitiatedCount: number;
  InprogressCount: number;
  CompletedCount: number;
  RejectedCount: number;
};

type ByServiceRow = Totals & { serviceType: string | null | undefined };

type RefundsReportRes = {
  grandTotal: Totals[]; // length 1
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
    excelBase64: raw?.excelBase64 ?? raw?.data?.excelBase64,
    excelFileName: raw?.excelFileName ?? raw?.data?.excelFileName
  };
}

export default function RefundsReportsPage() {
  const today = new Date();

  // default: last 30 days through today
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

  async function fetchRefunds() {
    // Try preferred payload -> fallback to variants
    try {
      const res = await apiCall('POST', '/api/reports/refunds', {
        range: { startDate, endDate }
      });
      return res?.data ?? res;
    } catch {
      try {
        const resB = await apiCall('POST', '/api/reports/refunds', {
          startDate,
          endDate
        });
        return resB?.data ?? resB;
      } catch {
        const q = `?startDate=${encodeURIComponent(startDate!)}&endDate=${encodeURIComponent(endDate!)}`;
        const resC = await apiCall('GET', `/api/reports/refunds${q}`);
        return resC?.data ?? resC;
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) return;
      setLoading(true);
      setErr(null);
      try {
        const payload = await fetchRefunds();
        setData(normalize(payload));
      } catch (e: any) {
        setErr(
          e?.response?.data?.message || 'Refunds report endpoint not found'
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate]);

  // Build a clean Excel on the client (Summary + ServiceWise). Falls back to API excelBase64 if present & desired.
  async function handleExportExcel() {
    if (!data?.totals) return;
    setExporting(true);
    try {
      // 1) Preferred: build workbook locally for clean Key/Value format
      const XLSX = await import('xlsx');

      // ---- Sheet 1: Summary (flat Key/Value) ----
      const t = data.totals;
      const summaryRows: Array<[string, number]> = [
        ['Key', 0], // header row; second cell will be "Value" below
        ['totalCount', t.totalCount],
        ['InitiatedCount', t.InitiatedCount],
        ['InprogressCount', t.InprogressCount],
        ['CompletedCount', t.CompletedCount],
        ['RejectedCount', t.RejectedCount]
      ];
      summaryRows[0][1] = Number.NaN; // we only care about header text; SheetJS keeps as string anyway
      const wsSummary = XLSX.utils.aoa_to_sheet([
        ['Key', 'Value'],
        ...summaryRows.slice(1)
      ]);

      // ---- Sheet 2: ServiceWise table ----
      const serviceRows = [
        [
          'Service Type',
          'Total',
          'Initiated',
          'In-Progress',
          'Completed',
          'Rejected'
        ],
        ...(data.byService ?? []).map((r) => [
          r.serviceType || 'Unknown',
          r.totalCount ?? 0,
          r.InitiatedCount ?? 0,
          r.InprogressCount ?? 0,
          r.CompletedCount ?? 0,
          r.RejectedCount ?? 0
        ])
      ];
      const wsService = XLSX.utils.aoa_to_sheet(serviceRows);

      // ---- Build + download workbook ----
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
      XLSX.utils.book_append_sheet(wb, wsService, 'ServiceWise');

      const filename = `refundCount_${startDate ?? 'start'}_to_${endDate ?? 'end'}.xlsx`;
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
      // 2) Optional fallback to API-provided base64 (will use whatever format backend sends)
      if (data?.excelBase64) {
        try {
          const clean = data.excelBase64
            .replace(/^data:.*?;base64,/, '')
            .replace(/[\r\n]+/g, '')
            .replace(/-/g, '+')
            .replace(/_/g, '/');
          const byteChars = atob(clean);
          const bytes = new Uint8Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++)
            bytes[i] = byteChars.charCodeAt(i);
          const blob = new Blob([bytes], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download =
            data.excelFileName ??
            `refundCount_${startDate ?? 'start'}_to_${endDate ?? 'end'}.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        } catch {
          alert('Failed to export Excel.');
        }
      } else {
        alert('Failed to export Excel.');
      }
    } finally {
      setExporting(false);
    }
  }

  const totals = data?.totals;
  const rows = data?.byService ?? [];

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="px-6 py-6 mt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Heading title="Refunds Report" className="mt-0 md:mt-0" />

            {/* Date Range & Actions */}
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

              <Button
                onClick={handleExportExcel}
                disabled={
                  exporting || loading || !startDate || !endDate || !data
                }
              >
                {exporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting…
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Export Excel
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

          {/* Summary cards from grandTotal[0] */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
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
          {/* <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">
              Service-wise Breakdown
            </h3>
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
                  {(!rows || rows.length === 0) && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">
                        No data for this range.
                      </td>
                    </tr>
                  )}
                  {rows.map((r, idx) => (
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
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <Link
                href="/super-admin/analytics-reports"
                className="text-sm underline hover:opacity-80"
              >
                ← Back to Analytics & Reports
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

/* UI bits */
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
