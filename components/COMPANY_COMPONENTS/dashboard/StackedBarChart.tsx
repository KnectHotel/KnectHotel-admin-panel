'use client';

import { Bar, BarChart, XAxis } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

type chartDataType = {
  service: string;
  totalRevenue: number;
  profit: number;
  losses: number;
};

const chartConfig = {
  totalRevenue: {
    label: 'Total Revenue',
    color: 'hsl(var(--chart-4))'
  },
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-5))'
  },
  losses: {
    label: 'Losses',
    color: 'hsl(var(--chart-6))'
  }
} satisfies ChartConfig;

const CustomTick = (props: any) => {
  const { x, y, payload } = props;
  const words = payload.value.split(' ');

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject width={100} height={60} x={-50} y={0}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            fontSize: '10px',
            lineHeight: '1.2'
          }}
        >
          {words.map((word: string, i: number) => (
            <span key={i}>{word}</span>
          ))}
        </div>
      </foreignObject>
    </g>
  );
};

export function StackedBarChart({ chartData }: { chartData: chartDataType[] }) {
  return (
    <Card className="w-full bg-transparent">
      <CardContent>
        <ChartContainer
          className="bg-transparent max-h-[18rem] w-full"
          config={chartConfig}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            // margin={{ bottom: 60 }} // Increased bottom margin for stacked labels
          >
            <XAxis
              className="text-white/60"
              dataKey="service"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={<CustomTick />}
              interval={0}
              height={40} // Increased height to accommodate stacked labels
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="totalRevenue"
              stackId="a"
              fill="var(--color-totalRevenue)"
              radius={[5, 5, 5, 5]}
              barSize={45}
            />
            <Bar
              dataKey="profit"
              stackId="a"
              fill="var(--color-profit)"
              radius={[5, 5, 5, 5]}
              barSize={45}
            />
            <Bar
              dataKey="losses"
              stackId="a"
              fill="var(--color-losses)"
              radius={[5, 5, 5, 5]}
              barSize={45}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
