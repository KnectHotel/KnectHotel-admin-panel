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
  Bar
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

interface IncomeTimeSeriesResponse {
  labels: string[];
  data: number[];
  excelBase64?: string;
  excelFileName?: string;
}

interface Props {
  endpoint?: string;
  body?: Record<string, any>;
  title?: string;
  maximumFractionDigits?: number;
  defaultChart?: 'area' | 'bar';
  defaultRange?: RangeKey;
}

const INR = (n?: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits
  }).format(Number(n || 0));

const toChartData = (labels: string[], values: number[]) =>
  labels.map((label, i) => ({ label, value: values[i] ?? 0 }));

const IncomeTimeSeriesChart: React.FC<Props> = ({
  endpoint = '/api/reports/income-time-series',
  body,
  title = 'Payment Reports',
  maximumFractionDigits = 0,
  defaultChart = 'area',
  defaultRange = 'lastYear'
}) => {
  const [series, setSeries] = useState<IncomeTimeSeriesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chart, setChart] = useState<'area' | 'bar'>(defaultChart);
  const [range, setRange] = useState<RangeKey>(defaultRange);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const useExternalBody = !!body;
  const effectiveBody = useMemo(() => {
    if (useExternalBody) return body!;
    return { range } as { range: RangeKey };
  }, [useExternalBody, body, range]);

  const chartData = useMemo(() => {
    if (!series) return [] as { label: string; value: number }[];
    return toChartData(series.labels, series.data);
  }, [series]);

  const maxY = useMemo(() => {
    const max = chartData.reduce((m, d) => Math.max(m, d.value), 0);
    return max > 0 ? Math.ceil(max * 1.1) : 1;
  }, [chartData]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCall<IncomeTimeSeriesResponse>(
        'POST',
        endpoint,
        effectiveBody
      );
      setSeries(res as unknown as IncomeTimeSeriesResponse);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load time series');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, JSON.stringify(effectiveBody)]);

  const handleDownloadExcel = () => {
    if (!series?.excelBase64) return;
    const a = document.createElement('a');
    a.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${series.excelBase64}`;
    a.download = series.excelFileName || 'incomeTimeSeries.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle className="text-lg md:text-xl font-semibold">
          {title}
        </CardTitle>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md border p-1">
            <Button
              type="button"
              size="sm"
              variant={chart === 'area' ? 'default' : 'ghost'}
              className="h-8"
              onClick={() => setChart('area')}
            >
              Area
            </Button>
            <Button
              type="button"
              size="sm"
              variant={chart === 'bar' ? 'default' : 'ghost'}
              className="h-8"
              onClick={() => setChart('bar')}
            >
              Bar
            </Button>
          </div>

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
            type="button"
            size="sm"
            variant="outline"
            onClick={fetchData}
            title="Refresh"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleDownloadExcel}
            disabled={!series?.excelBase64}
            title={
              series?.excelBase64 ? 'Download Excel' : 'No Excel available'
            }
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
        ) : error ? (
          <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700 text-sm">
            {error}
          </div>
        ) : (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chart === 'area' ? (
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
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
                    width={80}
                    tickFormatter={(v) => INR(v, maximumFractionDigits)}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, maxY]}
                  />
                  <Tooltip
                    formatter={(v: any) =>
                      INR(v as number, maximumFractionDigits)
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="url(#incomeFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={chartData}
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
                    width={80}
                    tickFormatter={(v) => INR(v, maximumFractionDigits)}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, maxY]}
                  />
                  <Tooltip
                    formatter={(v: any) =>
                      INR(v as number, maximumFractionDigits)
                    }
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        {series && (
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Stat
              label="Total"
              value={INR(
                series.data.reduce((s, n) => s + (n || 0), 0),
                maximumFractionDigits
              )}
            />
            <Stat
              label="Average / month"
              value={INR(
                series.data.length
                  ? series.data.reduce((s, n) => s + (n || 0), 0) /
                      series.data.length
                  : 0,
                maximumFractionDigits
              )}
            />
            <Stat
              label="Peak"
              value={INR(Math.max(...series.data, 0), maximumFractionDigits)}
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

export default IncomeTimeSeriesChart;
