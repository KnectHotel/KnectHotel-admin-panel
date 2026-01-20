

































































































































































































































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

type CouponsReportRes = {
  totalCount: number;
  activeCount: number;
  expiredCount: number;
  disabledCount: number;
  totalRedeemed: number;
  excelBase64?: string;
  excelFileName?: string;
};

const toYMD = (d: Date) => format(d, 'yyyy-MM-dd');

export default function CouponsReportsPage() {
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(today, 30),
    to: today
  });

  const [data, setData] = useState<CouponsReportRes | null>(null);
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
        const res = await apiCall('POST', '/api/reports/coupons', {
          range: { startDate, endDate }
        });
        const payload: CouponsReportRes = res?.data ?? res ?? {};
        setData({
          totalCount: Number(payload.totalCount || 0),
          activeCount: Number(payload.activeCount || 0),
          expiredCount: Number(payload.expiredCount || 0),
          disabledCount: Number(payload.disabledCount || 0),
          totalRedeemed: Number(payload.totalRedeemed || 0),
          excelBase64: payload.excelBase64,
          excelFileName: payload.excelFileName
        });
      } catch (eA: any) {
        const statusA = eA?.response?.status;
        if (statusA !== 404 && statusA !== 415 && statusA !== 400) {
          setErr(
            eA?.response?.data?.message ||
              eA?.message ||
              'Failed to load coupon report'
          );
        } else {
          try {
            const resB = await apiCall('POST', '/api/reports/coupons', {
              startDate,
              endDate
            });
            const payloadB: CouponsReportRes = resB?.data ?? resB ?? {};
            setData({
              totalCount: Number(payloadB.totalCount || 0),
              activeCount: Number(payloadB.activeCount || 0),
              expiredCount: Number(payloadB.expiredCount || 0),
              disabledCount: Number(payloadB.disabledCount || 0),
              totalRedeemed: Number(payloadB.totalRedeemed || 0),
              excelBase64: payloadB.excelBase64,
              excelFileName: payloadB.excelFileName
            });
          } catch (eB: any) {
            setErr(
              eB?.response?.data?.message ||
                eB?.message ||
                'Failed to load coupon report'
            );
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate]);

  
  function handleExcelDownload(excelBase64: string, excelFileName: string) {
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
      a.download = excelFileName;
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
      const res = await apiCall('POST', '/api/reports/coupons', {
        range: { startDate, endDate }
      });
      const payload: CouponsReportRes = res?.data ?? res ?? {};
      setData({
        totalCount: Number(payload.totalCount || 0),
        activeCount: Number(payload.activeCount || 0),
        expiredCount: Number(payload.expiredCount || 0),
        disabledCount: Number(payload.disabledCount || 0),
        totalRedeemed: Number(payload.totalRedeemed || 0),
        excelBase64: payload.excelBase64,
        excelFileName: payload.excelFileName
      });
    } catch (e) {
      setErr('Failed to refresh coupon report');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="px-6 py-6 mt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Heading title="Coupons Report" className="mt-0 md:mt-0" />
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
                    defaultMonth={range?.from}
                    disabled={{ after: today }}
                  />
                </PopoverContent>
              </Popover>
              {}
              <Button onClick={handleRefresh} disabled={loading}>
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
                onClick={() =>
                  handleExcelDownload(data?.excelBase64!, data?.excelFileName!)
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

          {}
          {err && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          {}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
            <MetricCard
              title="Total Coupons"
              value={data?.totalCount ?? 0}
              loading={loading}
            />
            <MetricCard
              title="Active"
              value={data?.activeCount ?? 0}
              loading={loading}
            />
            <MetricCard
              title="Expired"
              value={data?.expiredCount ?? 0}
              loading={loading}
            />
            <MetricCard
              title="Disabled"
              value={data?.disabledCount ?? 0}
              loading={loading}
            />
            <MetricCard
              title="Total Redeemed"
              value={data?.totalRedeemed ?? 0}
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
