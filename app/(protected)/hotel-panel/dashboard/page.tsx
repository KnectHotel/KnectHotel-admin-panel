



























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { LineChartLinear } from '@/components/charts/lineChart';
import { IoEnter } from 'react-icons/io5';
import { RxCrossCircled } from 'react-icons/rx';
import { GrNotes } from 'react-icons/gr';
import { IoIosExit } from 'react-icons/io';
import { RadialChartStacked } from '@/components/charts/radialChart';
import apiCall from '@/lib/axios';

import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Loader2, Filter } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';


export type DateRangeKey =
  | 'today'
  | 'lastWeek'
  | 'lastMonth'
  | 'lastQuarter'
  | 'lastYear';

const rangeLabels: Record<DateRangeKey, string> = {
  today: 'Today',
  lastWeek: 'Last Week',
  lastMonth: 'Last Month',
  lastQuarter: 'Last Quarter',
  lastYear: 'Last Year'
};


type ServiceStatus = {
  [key: string]: {
    pending: number;
    completed: number;
  };
};

type BookingKPI = {
  total: { count: number; pctVsPrevMonth: number };
  cancelled: { count: number; pctVsPrevMonth: number };
  checkedIn: { count: number; pctVsPrevMonth: number };
  checkedOut: { count: number; pctVsPrevMonth: number };
};

type RevenueData = {
  totalRevenue: number;
  byDepartment: {
    [key: string]: number;
  };
};


type ServicesStats = {
  totalServices: number;
  revenueGenerated: number;
  paylaterAmount: number;
  cashfreeRevenue: number;
  pendingServices: number;
  inprogressServices: number;
  completedServices: number;
  cancelledServices: number;
  avgServiceRating: number | null;
  avgAgentRating: number | null;
};

type ServiceWiseItem = {
  serviceType: string;
  totalServices: number;
  revenueGenerated: number;
  pendingServices: number;
  inprogressServices: number;
  completedServices: number;
  cancelledServices: number;
  avgServiceRating: number | null;
  avgAgentRating: number | null;
};

type ServicesReportRes = {
  stats: ServicesStats;
  serviceWise: ServiceWiseItem[];
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


function normalizeServicesPayload(p: any): ServicesReportRes {
  const s = p?.stats ?? {};
  const stats: ServicesStats = {
    totalServices: Number(s.totalServices ?? 0),
    revenueGenerated: Number(s.revenueGenerated ?? 0),
    paylaterAmount: Number(s.paylaterAmount ?? 0),
    cashfreeRevenue: Number(s.cashfreeRevenue ?? 0),
    pendingServices: Number(s.pendingServices ?? 0),
    inprogressServices: Number(s.inprogressServices ?? 0),
    completedServices: Number(s.completedServices ?? 0),
    cancelledServices: Number(s.cancelledServices ?? 0),
    avgServiceRating:
      s.avgServiceRating == null ? null : Number(s.avgServiceRating),
    avgAgentRating: s.avgAgentRating == null ? null : Number(s.avgAgentRating)
  };

  const rawList = Array.isArray(p?.serviceWise)
    ? p.serviceWise
    : Array.isArray(p?.complaintTypeWise)
      ? p.complaintTypeWise
      : [];

  const serviceWise: ServiceWiseItem[] = rawList.map((it: any) => ({
    serviceType: String(it?.serviceType ?? 'Unknown'),
    totalServices: Number(it?.totalServices ?? 0),
    revenueGenerated: Number(it?.revenueGenerated ?? 0),
    pendingServices: Number(it?.pendingServices ?? 0),
    inprogressServices: Number(it?.inprogressServices ?? 0),
    completedServices: Number(it?.completedServices ?? 0),
    cancelledServices: Number(it?.cancelledServices ?? 0),
    avgServiceRating:
      it?.avgServiceRating == null ? null : Number(it?.avgServiceRating),
    avgAgentRating:
      it?.avgAgentRating == null ? null : Number(it?.avgAgentRating)
  }));

  return { stats, serviceWise };
}


export default function DashboardPage() {
  
  const [serviceStatusData, setServiceStatusData] = useState<ServiceStatus>({});
  const [kpiData, setKpiData] = useState<BookingKPI | null>(null);
  const [serviceRevenue, setServiceRevenue] = useState<RevenueData | null>(
    null
  );
  const [dashLoading, setDashLoading] = useState(true);
  const [dashError, setDashError] = useState('');

  
  const [range, setRange] = useState<DateRangeKey>('lastQuarter');

  
  const today = new Date();
  const [svcRange, setSvcRange] = useState<DateRange | undefined>({
    from: subDays(today, 30),
    to: today
  });
  const startDate = useMemo(
    () => (svcRange?.from ? toYMD(svcRange.from) : undefined),
    [svcRange?.from]
  );
  const endDate = useMemo(
    () => (svcRange?.to ? toYMD(svcRange.to) : undefined),
    [svcRange?.to]
  );

  const [servicesData, setServicesData] = useState<ServicesReportRes | null>(
    null
  );
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesErr, setServicesErr] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchAll = async () => {
      setDashLoading(true);
      setDashError('');
      try {
        const res = await apiCall(
          'GET',
          `/api/dashboard/service-status?range=${range}`
        );
        setServiceStatusData(res || {});

        const kpiRes = await apiCall(
          'GET',
          `/api/dashboard/booking-kpis?range=${range}`
        );
        setKpiData(kpiRes || null);

        const revenueRes = await apiCall(
          'GET',
          `/api/dashboard/service-revenue?range=${range}`
        );
        setServiceRevenue(revenueRes || null);
      } catch (err: any) {
        console.error('Error fetching dashboard data', err);
        setDashError('Failed to fetch dashboard data');
      } finally {
        setDashLoading(false);
      }
    };

    fetchAll();
  }, [range]);

  
  const buildPostBody = useCallback(() => {
    return { service: 'All', range: { startDate, endDate } };
  }, [startDate, endDate]);

  const buildGetQuery = useCallback(() => {
    if (!startDate || !endDate) return '';
    const parts = [
      `service=${encodeURIComponent('All')}`,
      `startDate=${encodeURIComponent(startDate)}`,
      `endDate=${encodeURIComponent(endDate)}`
    ];
    return parts.join('&');
  }, [startDate, endDate]);

  
  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) return;
      setServicesLoading(true);
      setServicesErr(null);
      try {
        
        const res = await apiCall(
          'POST',
          '/api/reports/services',
          buildPostBody()
        );
        const payload: ServicesReportRes = normalizeServicesPayload(
          res?.data ?? res ?? {}
        );
        setServicesData(payload);
      } catch (eA: any) {
        try {
          
          const q = buildGetQuery();
          const resC = await apiCall('GET', `/api/reports/services?${q}`);
          const payloadC: ServicesReportRes = normalizeServicesPayload(
            resC?.data ?? resC ?? {}
          );
          setServicesData(payloadC);
        } catch (eC: any) {
          const msg =
            eC?.response?.data?.message ||
            eA?.response?.data?.message ||
            eC?.message ||
            eA?.message ||
            'Services report endpoint not found';
          setServicesErr(`Failed to load services report. ${msg}`);
          console.error('[services-report] FAIL', { eA, eC });
        }
      } finally {
        setServicesLoading(false);
      }
    })();
  }, [startDate, endDate, buildGetQuery, buildPostBody]);

  
  const nfCount = (v: number | null) => (v == null ? '—' : nf.format(v));
  const fmtAmt = (v: number | null) => (v == null ? '—' : cf.format(v));
  const fmtRating = (v: number | null) => (v == null ? '—' : oneDecimal(v));

  
  const kpiCards = [
    {
      key: 'total',
      title: 'Booked Rooms',
      icon: <GrNotes className="text-success" />,
      color: 'bg-success/20'
    },
    {
      key: 'cancelled',
      title: 'Canceled Rooms',
      icon: <RxCrossCircled className="text-danger" />,
      color: 'bg-danger/20'
    },
    {
      key: 'checkedIn',
      title: 'Check-in Rooms',
      icon: <IoEnter className="text-primary2" />,
      color: 'bg-primary2/20'
    },
    {
      key: 'checkedOut',
      title: 'Check-out Rooms',
      icon: <IoIosExit className="text-purple" />,
      color: 'bg-purple/20'
    }
  ] as const;

  return (
    <div className="min-h-screen flex flex-col w-full">
      {}
      <Navbar active className="" />

      <div className="flex-1 pt-24 pb-4 px-4 lg:px-6 w-full container">
        {}
        <div className="mb-4 flex items-center justify-between gap-3">
          <Heading title="Dashboard" className="mt-0 md:mt-0" />
          <div className="border-2 flex gap-3 w-fit rounded-lg border-[#FAF7F2] bg-[#FAF7F2]">
            <Button className="p-0 bg-transparent ml-2 border-none shadow-none focus:ring-0 hover:bg-transparent">
              <Filter
                height={20}
                width={20}
                className="text-button-dark fill-coffee"
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#FAF7F2] rounded-l-none text-[#362913] font-semibold hover:bg-coffee/90 hover:text-[#FAF7F2] duration-150 ease-in-out">
                  {rangeLabels[range]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 bg-[#FAF7F2] text-[#362913]"
                side="bottom"
                align="start"
              >
                {Object.entries(rangeLabels).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setRange(key as DateRangeKey)}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-4 lg:mb-6">
          <div className="w-full lg:w-2/3 h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden rounded-xl">
            <LineChartLinear />
          </div>

          <div className="w-full lg:w-1/3 grid grid-cols-2 gap-4">
            {kpiCards.map(({ key, title, icon, color }, i) => (
              <div
                key={i}
                className="bg-lightbrown flex flex-col gap-4 lg:gap-6 justify-between rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div className={`${color} rounded-full p-2`}>{icon}</div>
                  <div className="bg-success/20 border border-success text-xs lg:text-sm px-2 py-[0.4px] rounded-full">
                    {kpiData
                      ? `${(kpiData as any)[key]?.pctVsPrevMonth}%`
                      : '--'}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <h1 className="text-xl lg:text-2xl font-medium">
                    {kpiData ? (kpiData as any)[key]?.count : '--'}
                  </h1>
                  <span className="text-xs lg:text-sm text-black/40">
                    {title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Heading
              title="Services Report (All Services)"
              className="mt-0 md:mt-0"
            />

            {}
            <div className="flex items-center gap-3">
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
                    selected={svcRange}
                    onSelect={(r) => {
                      if (!r) return setSvcRange(undefined);
                      const next: DateRange = {
                        from: r.from,
                        to: r.to ?? today
                      };
                      if (next.to && next.to > today) next.to = today;
                      if (next.from && next.from > today) next.from = today;
                      setSvcRange(next);
                    }}
                    defaultMonth={svcRange?.to ?? today}
                    disabled={{ after: today }}
                    toMonth={today}
                  />
                </PopoverContent>
              </Popover>
              {servicesLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
          </div>

          <div className="w-full rounded-xl bg-lightbrown p-4 lg:p-6 tracking-wide">
            {servicesErr && (
              <div className="text-center text-red-500 text-sm py-4">
                {servicesErr}
              </div>
            )}

            {!servicesErr && (
              <div className="overflow-x-auto">
                {(() => {
                  const columns = servicesData?.serviceWise ?? [];

                  
                  const chipColors = [
                    'bg-coffee',
                    'bg-success',
                    'bg-primary2',
                    'bg-purple',
                    'bg-amber-500',
                    'bg-rose-500',
                    'bg-teal-600',
                    'bg-indigo-600'
                  ];

                  type Col = (typeof columns)[number];
                  const METRICS: Array<{
                    key: keyof Col;
                    label: string;
                    kind: 'count' | 'amount' | 'rating';
                  }> = [
                    {
                      key: 'totalServices',
                      label: 'Total Services',
                      kind: 'count'
                    },
                    {
                      key: 'pendingServices',
                      label: 'Pending Services',
                      kind: 'count'
                    },
                    {
                      key: 'inprogressServices',
                      label: 'In-Progress Services',
                      kind: 'count'
                    },
                    {
                      key: 'completedServices',
                      label: 'Completed Services',
                      kind: 'count'
                    },
                    {
                      key: 'cancelledServices',
                      label: 'Cancelled Services',
                      kind: 'count'
                    },
                    {
                      key: 'revenueGenerated',
                      label: 'Revenue (Total)',
                      kind: 'amount'
                    },
                    {
                      key: 'avgServiceRating',
                      label: 'Avg Service Rating',
                      kind: 'rating'
                    },
                    {
                      key: 'avgAgentRating',
                      label: 'Avg Agent Rating',
                      kind: 'rating'
                    }
                  ];

                  const renderCell = (
                    val: any,
                    kind: 'count' | 'amount' | 'rating'
                  ) => {
                    if (val == null) return '—';
                    if (kind === 'count') return nfCount(Number(val));
                    if (kind === 'amount') return fmtAmt(Number(val));
                    return fmtRating(Number(val));
                  };

                  const cellText = (kind: 'count' | 'amount' | 'rating') =>
                    kind === 'count'
                      ? 'text-green-700'
                      : kind === 'amount'
                        ? 'text-blue-700'
                        : 'text-purple-700';

                  return (
                    <table className="min-w-full border-separate border-spacing-0">
                      <thead>
                        <tr className="align-bottom">
                          <th className="sticky left-0 z-10 bg-lightbrown px-3 py-2 text-left text-xs font-semibold text-gray-800 border-b border-white/20">
                            Metric
                          </th>
                          {columns.map((svc, idx) => (
                            <th
                              key={svc.serviceType}
                              className="px-3 py-2 text-left text-xs font-semibold text-gray-800 border-b border-white/20"
                            >
                              <span
                                className={cn(
                                  'inline-block rounded-md text-white px-3 py-1',
                                  chipColors[idx % chipColors.length]
                                )}
                              >
                                {svc.serviceType}
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {METRICS.map(({ key, label, kind }, rowIdx) => (
                          <tr
                            key={String(key)}
                            className={
                              rowIdx % 2 === 0 ? 'bg-white/10' : 'bg-white/0'
                            }
                          >
                            <td className="sticky left-0 z-10 bg-lightbrown px-3 py-2 text-sm font-medium text-gray-900 border-b border-white/20">
                              {label}
                            </td>

                            {columns.length === 0 ? (
                              <td className="px-3 py-2 text-sm text-gray-500 border-b border-white/20">
                                No services
                              </td>
                            ) : (
                              columns.map((svc) => (
                                <td
                                  key={svc.serviceType + String(key)}
                                  className={cn(
                                    'px-3 py-2 text-sm border-b border-white/20 text-right',
                                    cellText(kind)
                                  )}
                                >
                                  {renderCell(svc[key], kind)}
                                </td>
                              ))
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
