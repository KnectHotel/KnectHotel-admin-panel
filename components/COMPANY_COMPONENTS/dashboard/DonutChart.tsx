'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

type ChartDataType = {
  label: string;
  visitors: number;
  fill: string;
};

const chartConfig = {
  newCustomers: {
    label: 'New Customers',
    color: 'hsl(var(--chart-7))'
  },
  returningCustomers: {
    label: 'Returning Customers',
    color: 'hsl(var(--chart-8))'
  },
  regularCustomers: {
    label: 'Regular Customers',
    color: 'hsl(var(--chart-9))'
  }
} satisfies ChartConfig;

export function DonutChart({ chartData }: { chartData: ChartDataType[] }) {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className="flex flex-col w-auto max-w-[16rem] min-w-[15rem] py-2 mt-2 bg-[#3B2E16] border border-[#6E511D]">
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="label"
              innerRadius={65}
              outerRadius={85}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white text-xl tracking-wider text-white font-semibold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-white/60 text-white"
                        >
                          Guests
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        {}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
          <div className="flex flex-col items-start gap-3">
            <div className={`flex items-center gap-2 `}>
              <div className="w-2 h-2 rounded-full bg-[#E5C67E]" />
              <span className="text-xs 2xl:text-sm text-white/60">
                {chartData[0].label}
              </span>
            </div>
            <div className={`flex items-center gap-2 `}>
              <div className="w-2 h-2 rounded-full bg-[#4A391B]" />
              <span className="text-xs 2xl:text-sm text-white/60">
                {chartData[1].label}
              </span>
            </div>
            <div className={`flex items-center gap-2 `}>
              <div className="w-2 h-2 rounded-full bg-[#A89A7E]" />
              <span className="text-xs 2xl:text-sm text-white/60">
                {chartData[2].label}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
