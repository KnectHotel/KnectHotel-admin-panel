

























































































































































































































































































































































































































































































































































































































































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


interface ComplaintsStats {
  totalComplaints: number;
  complaintsResolved: number;
  pendingComplaints: number;
  positiveAgentRatings: number;
  neutralAgentRatings: number;
  poorAgentRatings: number;
  avgComplaintRating: number; 
  avgAgentRating: number; 
  avgResolutionTimeHours: number; 
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


const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');

function percent(part: number, total: number) {
  if (!total) return 0;
  const p = Math.round((part / total) * 100);
  return Number.isFinite(p) ? p : 0;
}


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


export default function ComplaintsReportsPage() {
  
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

      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      

      setData(normalized);
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Failed to load complaints report');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  
  async function handleExportExcel() {
    if (!data?.stats) return;
    setExporting(true);
    try {
      const XLSX = await import('xlsx');

      const s = data.stats;

      
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

      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
      XLSX.utils.book_append_sheet(wb, wsService, 'ServiceWise');

      
      const filename = `complaints_${startDate ?? 'start'}_to_${endDate ?? 'end'}.xlsx`;

      
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

  
  useEffect(() => {
    load();
    
  }, [startDate, endDate]);

  const stats = data?.stats;
  const serviceWise = data?.serviceWise ?? [];

  return (
    <div className="flex min-h-screen w-full">
      {}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="px-6 py-6 mt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Heading title="Complaints Reports" className="mt-0 md:mt-0" />

            {}
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

              {}
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

          {}
          {err && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          {}
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

          {}
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
            {}
          </div>

          {}
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

          {}
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
