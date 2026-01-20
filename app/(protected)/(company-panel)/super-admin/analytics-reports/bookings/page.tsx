










































































































































































































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


interface AllBookingsRes {
  totalBookings: number;
  directCheckIns: number;
  contactlessCheckIns: number;
  newGuests: number;
  returningGuests: number;
  signupUsers: number;
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
  filename = 'allBookings.xlsx',
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


export default function AllBookingsReportsPage() {
  
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const [data, setData] = useState<AllBookingsRes | null>(null);
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
    const res = await apiCall('POST', '/api/reports/allBookings', {
      range: { startDate, endDate }
    });
    return res?.data ?? res ?? {};
  }

  async function load() {
    if (!startDate || !endDate) return;
    setLoading(true);
    setErr(null);
    try {
      const payload: AllBookingsRes = (await fetchReport()) as AllBookingsRes;
      setData({
        totalBookings: Number(payload?.totalBookings || 0),
        directCheckIns: Number(payload?.directCheckIns || 0),
        contactlessCheckIns: Number(payload?.contactlessCheckIns || 0),
        newGuests: Number(payload?.newGuests || 0),
        returningGuests: Number(payload?.returningGuests || 0),
        signupUsers: Number(payload?.signupUsers || 0),
        excelBase64: payload?.excelBase64,
        excelFileName: payload?.excelFileName
      });
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Failed to load bookings report');
      setData({
        totalBookings: 0,
        directCheckIns: 0,
        contactlessCheckIns: 0,
        newGuests: 0,
        returningGuests: 0,
        signupUsers: 0
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadExcel() {
    if (!startDate || !endDate) return;
    setDownloading(true);
    try {
      
      const fresh = (await fetchReport()) as AllBookingsRes;
      const base64 = fresh?.excelBase64 ?? data?.excelBase64;
      const file =
        fresh?.excelFileName ??
        data?.excelFileName ??
        `allBookings_${startDate}_to_${endDate}.xlsx`;
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

  
  useEffect(() => {
    load();
    
  }, [startDate, endDate]);

  const total = data?.totalBookings ?? 0;
  const direct = data?.directCheckIns ?? 0;
  const contactless = data?.contactlessCheckIns ?? 0;
  const newGuests = data?.newGuests ?? 0;
  const returning = data?.returningGuests ?? 0;
  const signups = data?.signupUsers ?? 0;

  return (
    <div className="flex min-h-screen w-full">
      {}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="px-6 py-6 mt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Heading title="Bookings Reports" className="mt-0 md:mt-0" />

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

          {}
          {err && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          {}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-6 gap-6">
            <MetricCard
              title="Total Bookings"
              value={total}
              loading={loading}
            />
            <MetricCard
              title="Direct Check-ins"
              value={direct}
              loading={loading}
            />
            <MetricCard
              title="Contactless Check-ins"
              value={contactless}
              loading={loading}
            />
            <MetricCard
              title="New Guests"
              value={newGuests}
              loading={loading}
            />
            <MetricCard
              title="Returning Guests"
              value={returning}
              loading={loading}
            />
            <MetricCard
              title="Signup Users"
              value={signups}
              loading={loading}
            />
          </div>

          {}
          <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-3 text-sm text-muted-foreground">
              Check-in Mode Split
            </div>
            <SplitBar
              left={direct}
              right={contactless}
              leftLabel="Direct"
              rightLabel="Contactless"
            />
            {}
          </div>

          {}
          <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-3 text-sm text-muted-foreground">Guest Mix</div>
            <SplitBar
              left={newGuests}
              right={returning}
              leftLabel="New"
              rightLabel="Returning"
            />
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
