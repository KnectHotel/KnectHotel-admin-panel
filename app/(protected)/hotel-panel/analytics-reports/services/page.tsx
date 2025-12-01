'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { format, subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import Navbar from '@/components/Navbar';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Loader2, Download } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import apiCall from '@/lib/axios';
import { cn } from '@/lib/utils';

type ServicesReportRes = {
  totalServices: number;
  revenueGenerated: number;
  paylaterAmount: number;
  cashfreeRevenue: number;
  pendingServices: number;
  inprogressServices: number;
  completedServices: number;
  cancelledServices: number;
  avgServiceRating: number;
  avgAgentRating: number;
  // — These were getting dropped earlier —
  excelBase64?: string;
  excelFileName?: string;
};

const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');
const nf = new Intl.NumberFormat('en-IN');
const cf = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});
const oneDecimal = (n: number | null | undefined) =>
  n == null ? '—' : (Math.round(n * 10) / 10).toFixed(1);

/** Only keep specific services + add 'all' */
// const SERVICE_OPTIONS = [
//   'all',
//   'InRoomControlRequest',
//   'HousekeepingRequest',
//   'FacilityRequest',
//   'InRoomDiningBooking',
//   'SpaSalonBooking'
// ] as const;
/** Only keep specific services + add 'all' */
const SERVICE_OPTIONS = [
  'all',
  'InRoomControlRequest',
  'HousekeepingRequest',
  'FacilityRequest', // Added Gym
  'SwimmingPoolBooking', // Added SwimmingPoolBooking
  'ConciergeRequest', // Added ConciergeRequest
  'InRoomDiningBooking',
  'SpaSalonBooking'
  // 'ConferenceHall', // Added ConferenceHall
  // 'CommunityHall' // Added CommunityHall
] as const;

export default function ServicesReportsPage() {
  const today = new Date();

  // default: last 30 days through today
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(today, 30),
    to: today
  });

  /** default to 'all' */
  const [service, setService] = useState<string>('all');

  const [data, setData] = useState<ServicesReportRes | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const startDate = useMemo(
    () => (range?.from ? toYMD(range.from) : undefined),
    [range?.from]
  );
  const endDate = useMemo(
    () => (range?.to ? toYMD(range.to) : undefined),
    [range?.to]
  );

  // Turn "InRoomDiningBooking" -> "In Room Dining Booking", "all" -> "All"
  // const humanizeService = (s: string) =>
  //   s === 'all'
  //     ? 'All'
  //     : s
  //         .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
  //         .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  //         .replace(/\b[a-z]/g, (m) => m.toUpperCase());
  // const humanizeService = (s: string) =>
  //   s === 'all'
  //     ? 'All'
  //     : s
  //         .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
  //         .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  //         .replace(/\b[a-z]/g, (m) => m.toUpperCase())
  //         .replace('Gym', 'Gym') // Ensuring that Gym is correctly capitalized
  //         .replace('SwimmingPoolBooking', 'Swimming Pool Booking') // Formatting SwimmingPoolBooking
  //         .replace('ConferenceHall', 'Conference Hall') // Formatting ConferenceHall
  //         .replace('CommunityHall', 'Community Hall'); // Formatting CommunityHall
  const humanizeService = (s: string) => {
    if (s === 'all') return 'All';

    // Remove the 'Request' word in the dropdown, but keep it for the API call
    if (s === 'FacilityRequest') return 'Gym/Conference Hall/Community Hall'; // For display, show 'Facility' instead of 'FacilityRequest'
    if (s === 'InRoomControlRequest') return 'In Room Control';
    if (s === 'HousekeepingRequest') return 'Housekeeping';
    if (s === 'ConciergeRequest') return 'Concierge';
    if (s === 'SpaSalonBooking') return 'Spa Salon';
    if (s === 'InRoomDiningBooking') return 'In Room Dining';
    if (s === 'SwimmingPoolBooking') return 'Swimming Pool';
    return s
      .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .replace(/\b[a-z]/g, (m) => m.toUpperCase());
  };

  const buildPostBody = (shape: 'range' | 'flat') => {
    const svc = service === 'all' ? undefined : service;
    if (shape === 'range') {
      return {
        ...(svc ? { service: svc } : {}),
        range: { startDate, endDate }
      };
    }
    return {
      ...(svc ? { service: svc } : {}),
      startDate,
      endDate
    };
  };
  const buildGetQuery = () => {
    const parts = [
      ...(service === 'all' ? [] : [`service=${encodeURIComponent(service)}`]),
      `startDate=${encodeURIComponent(startDate!)}`,
      `endDate=${encodeURIComponent(endDate!)}`
    ];
    return parts.join('&');
  };

  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) return;
      setLoading(true);
      setErr(null);
      try {
        const res = await apiCall(
          'POST',
          '/api/reports/services',
          buildPostBody('range')
        );
        const payload: ServicesReportRes =
          (res as any)?.data ?? (res as any) ?? {};
        setData(normalize(payload));
      } catch (eA: any) {
        try {
          const resB = await apiCall(
            'POST',
            '/api/reports/services',
            buildPostBody('flat')
          );
          const payloadB: ServicesReportRes =
            (resB as any)?.data ?? (resB as any) ?? {};
          setData(normalize(payloadB));
        } catch (eB: any) {
          try {
            const q = buildGetQuery();
            const resC = await apiCall('GET', `/api/reports/services?${q}`);
            const payloadC: ServicesReportRes =
              (resC as any)?.data ?? (resC as any) ?? {};
            setData(normalize(payloadC));
          } catch (eC: any) {
            const msg =
              eC?.response?.data?.message ||
              eB?.response?.data?.message ||
              eA?.response?.data?.message ||
              eC?.message ||
              eB?.message ||
              eA?.message ||
              'Services report endpoint not found';
            setErr(`Failed to load services report. ${msg}`);
            console.error('[services-report] FAIL', {
              A: {
                status: eA?.response?.status,
                msg: eA?.response?.data?.message || eA?.message
              },
              B: {
                status: eB?.response?.status,
                msg: eB?.response?.data?.message || eB?.message
              },
              C: {
                status: eC?.response?.status,
                msg: eC?.response?.data?.message || eC?.message
              }
            });
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate, service]);

  function handleExcelDownload() {
    // Only allow for "All" services
    if (service !== 'all') return;
    if (!data?.excelBase64 || !data?.excelFileName) return;

    setDownloading(true);
    try {
      // Use a direct data URL to avoid atob/Blob issues with very large base64 strings
      const a = document.createElement('a');
      a.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${data.excelBase64}`;
      a.download = data.excelFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setTimeout(() => setDownloading(false), 600);
    }
  }

  const excelEnabled = Boolean(data?.excelBase64) && service === 'all';

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="px-6 py-6 mt-16">
          <div className="flex items-center justify-between">
            <Heading title="Services Report" className="mt-0 md:mt-0" />

            {/* Filters: Service, Date Range and Download button */}
            <div className="flex items-center gap-3">
              {/* <Select value={service} onValueChange={setService}>
                <SelectTrigger className="min-w-[220px]">
                  <SelectValue placeholder="All Services">
                    {humanizeService(service)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {humanizeService(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
              <Select value={service} onValueChange={setService}>
                <SelectTrigger className="min-w-[220px]">
                  <SelectValue placeholder="All Services">
                    {humanizeService(service)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {humanizeService(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                variant="secondary"
                onClick={handleExcelDownload}
                disabled={!excelEnabled || downloading}
                className="flex items-center gap-2"
                title={
                  service !== 'all'
                    ? 'Excel download is available only for All services'
                    : data?.excelBase64
                      ? 'Download Excel'
                      : 'No Excel available'
                }
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

          {err && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Total Services"
              value={nf.format(data?.totalServices ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Pending"
              value={nf.format(data?.pendingServices ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="In-Progress"
              value={nf.format(data?.inprogressServices ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Completed"
              value={nf.format(data?.completedServices ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Cancelled"
              value={nf.format(data?.cancelledServices ?? 0)}
              loading={loading}
            />

            <MetricCard
              title="Revenue (Total)"
              value={cf.format(data?.revenueGenerated ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Pay Later Amount"
              value={cf.format(data?.paylaterAmount ?? 0)}
              loading={loading}
            />
            <MetricCard
              title="Cashfree Revenue"
              value={cf.format(data?.cashfreeRevenue ?? 0)}
              loading={loading}
            />

            <MetricCard
              title="Avg Service Rating"
              value={oneDecimal(data?.avgServiceRating)}
              loading={loading}
            />
            <MetricCard
              title="Avg Agent Rating"
              value={oneDecimal(data?.avgAgentRating)}
              loading={loading}
            />
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
  );
}

/** Preserve excel fields (bug fix) and coerce numerics safely */
function normalize(p: Partial<ServicesReportRes>): ServicesReportRes {
  return {
    totalServices: toNum(p.totalServices),
    revenueGenerated: toNum(p.revenueGenerated),
    paylaterAmount: toNum(p.paylaterAmount),
    cashfreeRevenue: toNum(p.cashfreeRevenue),
    pendingServices: toNum(p.pendingServices),
    inprogressServices: toNum(p.inprogressServices),
    completedServices: toNum(p.completedServices),
    cancelledServices: toNum(p.cancelledServices),
    avgServiceRating: toNum(p.avgServiceRating),
    avgAgentRating: toNum(p.avgAgentRating),
    excelBase64: p.excelBase64, // ← keep these
    excelFileName: p.excelFileName // ← keep these
  };
}
const toNum = (v: any) =>
  v == null || v === '' || isNaN(Number(v)) ? 0 : Number(v);

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
