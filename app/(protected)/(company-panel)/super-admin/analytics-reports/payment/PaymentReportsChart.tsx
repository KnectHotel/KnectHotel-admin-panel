'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import apiCall from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCcw } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@mui/material';


type RangeKey = 'today' | 'lastWeek' | 'lastMonth' | 'halfYear' | 'lastYear';

interface PaymentReportsResponse {
  labels: string[];
  datasets: {
    revenue: number[];
    discount: number[];
    actualCost: number[];
  };
  totals?: {
    totalRevenue?: number;
    totalDiscount?: number;
    actualCost?: number;
    totalTransactions?: number;
    averageTransactionValue?: number;
  };
  summary?: {
    period?: RangeKey;
    startDate?: string;
    endDate?: string;
  };
  excelBase64?: string;
  excelFileName?: string;
}

interface Props {
  endpoint?: string;
  title?: string;
  defaultChart?: 'area' | 'bar';
  defaultRange?: RangeKey;
  maximumFractionDigits?: number;
  
  body?: Record<string, any>;
}


const INR = (n?: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits
  }).format(Number(n || 0));

const toRows = (labels: string[], ds: PaymentReportsResponse['datasets']) =>
  labels.map((label, i) => ({
    label,
    revenue: ds.revenue[i] ?? 0,
    discount: ds.discount[i] ?? 0,
    actualCost: ds.actualCost[i] ?? 0
  }));


const PaymentReportsChart: React.FC<Props> = ({
  endpoint = '/api/reports/paymentReports',
  title = 'Payment Reports',
  defaultChart = 'area',
  defaultRange = 'lastYear',
  maximumFractionDigits = 0,
  body
}) => {
  const [data, setData] = useState<PaymentReportsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [chart, setChart] = useState<'area' | 'bar'>(defaultChart);
  const [range, setRange] = useState<RangeKey>(defaultRange);
  const [show, setShow] = useState({
    revenue: true,
    discount: true,
    actualCost: true
  });
  const chartRef = useRef<HTMLDivElement | null>(null);

  const useExternalBody = !!body;
  const effectiveBody = useMemo(() => {
    if (useExternalBody) return body!;
    return { range } as { range: RangeKey };
  }, [useExternalBody, body, range]);

  const rows = useMemo(() => {
    if (!data)
      return [] as Array<{
        label: string;
        revenue: number;
        discount: number;
        actualCost: number;
      }>;
    return toRows(data.labels, data.datasets);
  }, [data]);

  const maxY = useMemo(() => {
    const nums = rows.flatMap((r) => [
      show.revenue ? r.revenue : 0,
      show.discount ? r.discount : 0,
      show.actualCost ? r.actualCost : 0
    ]);
    const max = Math.max(0, ...nums);
    return max > 0 ? Math.ceil(max * 1.1) : 1;
  }, [rows, show]);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await apiCall<PaymentReportsResponse>(
        'POST',
        endpoint,
        effectiveBody
      );
      setData(res as unknown as PaymentReportsResponse);
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Failed to load payment reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
  }, [endpoint, JSON.stringify(effectiveBody)]);

  const handleDownloadExcel = () => {
    if (!data?.excelBase64) return;
    const a = document.createElement('a');
    a.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${data.excelBase64}`;
    a.download = data.excelFileName || 'payment-reports.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const totals = data?.totals || {};

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle className="text-lg md:text-xl font-semibold">
          {title}
        </CardTitle>

        <div className="flex flex-wrap items-center gap-2">
          {}
          <div className="inline-flex rounded-md border p-1">
            {}
          </div>

          {}
          {!useExternalBody && (
            <Select value={range} onValueChange={(v: RangeKey) => setRange(v)}>
              <SelectTrigger className="w-[160px] h-8">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="lastWeek">Last week</SelectItem>
                <SelectItem value="lastMonth">Last month</SelectItem>
                <SelectItem value="halfYear">Last 6 months</SelectItem>
                <SelectItem value="lastYear">Last year</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={fetchData}
            title="Refresh"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleDownloadExcel}
            disabled={!data?.excelBase64}
            title={data?.excelBase64 ? 'Download Excel' : 'No Excel available'}
          >
            <Download className="mr-2 h-4 w-4" /> Excel
          </Button>
        </div>
      </CardHeader>

      <CardContent ref={chartRef} className="pt-2">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : err ? (
          <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700 text-sm">
            {err}
          </div>
        ) : (
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chart === 'area' ? (
                <AreaChart
                  data={rows}
                  margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient id="discFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#f59e0b"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#f59e0b"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    height={36}
                  />
                  <YAxis
                    width={90}
                    domain={[0, maxY]}
                    tickFormatter={(v) => INR(v, maximumFractionDigits)}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(v: any) =>
                      INR(v as number, maximumFractionDigits)
                    }
                    labelFormatter={(l) => l}
                  />
                  <Legend />
                  {show.revenue && (
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#10b981"
                      fill="url(#revFill)"
                      strokeWidth={2}
                    />
                  )}
                  {show.discount && (
                    <Area
                      type="monotone"
                      dataKey="discount"
                      name="Discount"
                      stroke="#f59e0b"
                      fill="url(#discFill)"
                      strokeWidth={2}
                    />
                  )}
                  {show.actualCost && (
                    <Area
                      type="monotone"
                      dataKey="actualCost"
                      name="Actual Cost"
                      stroke="#3b82f6"
                      fill="url(#costFill)"
                      strokeWidth={2}
                    />
                  )}
                </AreaChart>
              ) : (
                <BarChart
                  data={rows}
                  margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    height={36}
                  />
                  <YAxis
                    width={90}
                    domain={[0, maxY]}
                    tickFormatter={(v) => INR(v, maximumFractionDigits)}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(v: any) =>
                      INR(v as number, maximumFractionDigits)
                    }
                    labelFormatter={(l) => l}
                  />
                  <Legend />
                  {show.revenue && (
                    <Bar
                      dataKey="revenue"
                      name="Revenue"
                      radius={[6, 6, 0, 0]}
                    />
                  )}
                  {show.discount && (
                    <Bar
                      dataKey="discount"
                      name="Discount"
                      radius={[6, 6, 0, 0]}
                    />
                  )}
                  {show.actualCost && (
                    <Bar
                      dataKey="actualCost"
                      name="Actual Cost"
                      radius={[6, 6, 0, 0]}
                    />
                  )}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        {}
        {data && (
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-5">
            <Stat
              label="Total Revenue"
              value={INR(totals.totalRevenue, maximumFractionDigits)}
            />
            <Stat
              label="Total Discount"
              value={INR(totals.totalDiscount, maximumFractionDigits)}
            />
            <Stat
              label="Actual Cost"
              value={INR(totals.actualCost, maximumFractionDigits)}
            />
            <Stat
              label="Transactions"
              value={String(totals.totalTransactions ?? 0)}
            />
            <Stat
              label="Avg Txn Value"
              value={INR(totals.averageTransactionValue, maximumFractionDigits)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};


const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border bg-card p-3 text-sm">
    <div className="text-muted-foreground">{label}</div>
    <div className="font-semibold">{value}</div>
  </div>
);

export default PaymentReportsChart;
