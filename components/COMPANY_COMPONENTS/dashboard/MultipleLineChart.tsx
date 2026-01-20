'use client';

import { Line, LineChart, XAxis, YAxis } from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { useState } from 'react';
type ChartDataType = {
  month: string;
  newOrders: number;
  repeatOrders: number;
  averageOrderValue: number;
};
const chartConfig = {
  newOrders: {
    label: 'New Orders',
    color: 'hsl(var(--chart-1))'
  },
  repeatOrders: {
    label: 'Repeat Orders',
    color: 'hsl(var(--chart-5))'
  },
  averageOrderValue: {
    label: 'Average Order Value',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

export function MultipleLineChart({
  chartData,
  mode
}: {
  chartData: ChartDataType[];
  mode: string;
}) {
  const TotalOrders = chartData.reduce(
    (sum, item) => sum + item.newOrders + item.repeatOrders,
    0
  );
  return (
    <Card className="bg-[#3B2E16] w-auto border border-[#6E511D] pt-2">
      <div className="flex justify-between items-center px-6 pb-4">
        <div className="space-y-2">
          <span className="text-xs 2xl:text-sm font-semibold text-white/60">
            {mode} Traffic
          </span>

          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-end">
              <h2 className="text-white text-xl font-semibold">
                {TotalOrders.toLocaleString()}
              </h2>
              <span className="text-white/60">orders</span>
            </div>
            <p className="text-white/60 text-[0.66rem]">
              This is the total orders fo this week
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white/60 text-[0.62rem]">
            <span
              className="h-2 w-2 inline-block rounded-full"
              style={{ backgroundColor: chartConfig.newOrders.color }}
            ></span>
            <p>New Orders</p>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-[0.62rem]">
            {' '}
            <span
              className="h-2 w-2 inline-block rounded-full"
              style={{ backgroundColor: chartConfig.repeatOrders.color }}
            ></span>
            <p>Repeat Orders</p>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-[0.62rem]">
            {' '}
            <span
              className="h-2 w-2 inline-block rounded-full"
              style={{ backgroundColor: chartConfig.averageOrderValue.color }}
            ></span>
            <p>Average Order Value</p>
          </div>
        </div>
      </div>
      <div className="w-full mb-3">
        <div className="h-[1px] mx-auto bg-brown/50"></div>
      </div>
      <CardContent>
        <ChartContainer className="h-72 w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            {}
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              style={{ fill: 'white' }} 
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={30}
              style={{ fill: 'white' }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="newOrders"
              type="monotone"
              stroke="var(--color-newOrders)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="repeatOrders"
              type="monotone"
              stroke="var(--color-repeatOrders)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="averageOrderValue"
              type="monotone"
              stroke="var(--color-averageOrderValue)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
