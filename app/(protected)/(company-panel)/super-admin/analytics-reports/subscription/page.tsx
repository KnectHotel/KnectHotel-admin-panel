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


interface PopularPlanRow {
  soldCount: number;
  planId: string;
  planName: string;
  uniqueId?: string;
  cost?: number;
}

interface RevenueBlock {
  totalRevenue: number;
  paidSubscriptionsCount: number;
  averageRevenuePerSubscribedHotel: number;
}

interface SubscriptionsReportRes {
  totalSubscriptionsCreated: number;
  totalActive: number;
  totalInactive: number;
  totalPlanType: number;
  popularSubscriptions: PopularPlanRow[];
  revenue: RevenueBlock;
  excelBase64?: string;
  excelFileName?: string;
}


const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');

function percent(part: number, total: number) {
  if (!total) return 0;
  const p = Math.round((part / total) * 100);
  return Number.isFinite(p) ? p : 0;
}

function downloadBase64File(
  base64: string,
  filename = 'subscriptionReports.xlsx',
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
  leftLabel,
  rightLabel
}: {
  left: number;
  right: number;
  leftLabel: string;
  rightLabel: string;
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


export default function SubscriptionsReportsPage() {
  
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const [data, setData] = useState<SubscriptionsReportRes | null>(null);
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

  async function fetchReport() {
    const res = await apiCall('POST', '/api/reports/subscriptionReports', {
      range: { startDate, endDate }
    });
    return (res?.data ?? res ?? {}) as SubscriptionsReportRes;
  }

  async function load() {
    if (!startDate || !endDate) return;
    setLoading(true);
    setErr(null);
    try {
      const payload = await fetchReport();
      setData({
        totalSubscriptionsCreated: Number(
          payload?.totalSubscriptionsCreated || 0
        ),
        totalActive: Number(payload?.totalActive || 0),
        totalInactive: Number(payload?.totalInactive || 0),
        totalPlanType: Number(payload?.totalPlanType || 0),
        popularSubscriptions: Array.isArray(payload?.popularSubscriptions)
          ? payload.popularSubscriptions.map((p) => ({
              soldCount: Number(p.soldCount || 0),
              planId: String(p.planId || ''),
              planName: String(p.planName || '—'),
              uniqueId: p.uniqueId ? String(p.uniqueId) : undefined,
              cost: typeof p.cost === 'number' ? p.cost : undefined
            }))
          : [],
        revenue: {
          totalRevenue: Number(payload?.revenue?.totalRevenue || 0),
          paidSubscriptionsCount: Number(
            payload?.revenue?.paidSubscriptionsCount || 0
          ),
          averageRevenuePerSubscribedHotel: Number(
            payload?.revenue?.averageRevenuePerSubscribedHotel || 0
          )
        },
        excelBase64: payload?.excelBase64,
        excelFileName: payload?.excelFileName
      });
    } catch (e: any) {
      setErr(
        e?.response?.data?.message || 'Failed to load subscriptions report'
      );
      setData({
        totalSubscriptionsCreated: 0,
        totalActive: 0,
        totalInactive: 0,
        totalPlanType: 0,
        popularSubscriptions: [],
        revenue: {
          totalRevenue: 0,
          paidSubscriptionsCount: 0,
          averageRevenuePerSubscribedHotel: 0
        }
      });
    } finally {
      setLoading(false);
    }
  }

  
  async function handleDownloadExcel() {
    if (!startDate || !endDate || !data) return;
    setDownloading(true);
    try {
      const XLSX = await import('xlsx');

      
      const summaryAoA = [
        ['Key', 'Value'],
        ['totalSubscriptionsCreated', data.totalSubscriptionsCreated],
        ['totalActive', data.totalActive],
        ['totalInactive', data.totalInactive],
        ['totalPlanType', data.totalPlanType]
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryAoA);

      
      const r = data.revenue ?? {
        totalRevenue: 0,
        paidSubscriptionsCount: 0,
        averageRevenuePerSubscribedHotel: 0
      };
      const revenueAoA = [
        ['Key', 'Value'],
        ['totalRevenue', r.totalRevenue],
        ['paidSubscriptionsCount', r.paidSubscriptionsCount],
        ['averageRevenuePerSubscribedHotel', r.averageRevenuePerSubscribedHotel]
      ];
      const wsRevenue = XLSX.utils.aoa_to_sheet(revenueAoA);

      
      const plansAoA = [
        ['Plan Name', 'Unique ID', 'Cost (₹)', 'Sold', 'Plan ID'],
        ...(data.popularSubscriptions ?? []).map((p) => [
          p.planName,
          p.uniqueId ?? '—',
          typeof p.cost === 'number' ? p.cost : '—',
          p.soldCount,
          p.planId
        ])
      ];
      const wsPlans = XLSX.utils.aoa_to_sheet(plansAoA);

      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
      XLSX.utils.book_append_sheet(wb, wsRevenue, 'Revenue');
      XLSX.utils.book_append_sheet(wb, wsPlans, 'PopularPlans');

      const filename = `subscriptionReports_${startDate}_to_${endDate}.xlsx`;
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
    } catch (err) {
      console.error(err);
      
      try {
        const fresh = await fetchReport();
        const base64 = fresh?.excelBase64 ?? data?.excelBase64;
        const filename =
          fresh?.excelFileName ??
          data?.excelFileName ??
          `subscriptionReports_${startDate}_to_${endDate}.xlsx`;
        if (!base64) {
          alert('Excel file not provided by API for the selected range.');
        } else {
          downloadBase64File(base64, filename);
        }
      } catch (e2) {
        console.error(e2);
        alert('Failed to export Excel.');
      }
    } finally {
      setDownloading(false);
    }
  }

  
  useEffect(() => {
    load();
    
  }, [startDate, endDate]);

  const totals = {
    created: data?.totalSubscriptionsCreated ?? 0,
    active: data?.totalActive ?? 0,
    inactive: data?.totalInactive ?? 0,
    planTypes: data?.totalPlanType ?? 0
  };
  const rev = data?.revenue ?? {
    totalRevenue: 0,
    paidSubscriptionsCount: 0,
    averageRevenuePerSubscribedHotel: 0
  };
  const plans = data?.popularSubscriptions ?? [];

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="px-6 py-6 mt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Heading title="Subscriptions Reports" className="mt-0 md:mt-0" />

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

              <Button
                onClick={handleDownloadExcel}
                disabled={
                  downloading || loading || !startDate || !endDate || !data
                }
              >
                {downloading ? (
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

          {}
          {err && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          {}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Total Subscriptions Created"
              value={totals.created}
              loading={loading}
            />
            <MetricCard
              title="Active"
              value={totals.active}
              loading={loading}
            />
            <MetricCard
              title="Inactive"
              value={totals.inactive}
              loading={loading}
            />
            <MetricCard
              title="Plan Types"
              value={totals.planTypes}
              loading={loading}
            />
          </div>

          {}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Total Revenue"
              value={rev.totalRevenue.toLocaleString()}
              subtitle="₹"
              loading={loading}
            />
            <MetricCard
              title="Paid Subscriptions"
              value={rev.paidSubscriptionsCount}
              loading={loading}
            />
            <MetricCard
              title="Avg Revenue / Subscribed Hotel"
              value={rev.averageRevenuePerSubscribedHotel.toFixed(2)}
              subtitle="₹"
              loading={loading}
            />
          </div>

          {}
          <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-3 text-sm text-muted-foreground">
              Subscription Status Split
            </div>
            <SplitBar
              left={totals.active}
              right={totals.inactive}
              leftLabel="Active"
              rightLabel="Inactive"
            />
            {}
          </div>

          {}
          <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-3 text-lg font-semibold">
              Popular Subscriptions
            </div>
            <div className="overflow-auto rounded-xl border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">
                      Plan Name
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      Unique ID
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Cost (₹)
                    </th>
                    <th className="px-4 py-2 text-right font-medium">Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-6 text-center text-muted-foreground"
                        colSpan={4}
                      >
                        No data
                      </td>
                    </tr>
                  )}
                  {plans.map((row) => (
                    <tr
                      key={row.planId}
                      className="odd:bg-white even:bg-muted/30"
                    >
                      <td className="px-4 py-2">{row.planName}</td>
                      <td className="px-4 py-2">{row.uniqueId ?? '—'}</td>
                      <td className="px-4 py-2 text-right">
                        {typeof row.cost === 'number'
                          ? row.cost.toLocaleString()
                          : '—'}
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        {row.soldCount}
                      </td>
                    </tr>
                  ))}
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
