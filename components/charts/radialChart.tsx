// 'use client';

// import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent
// } from '@/components/ui/chart';

// const chartData = [
//   { month: 'january', Booked: 1260, Check_Out: 570, Check_In: 480 }
// ];

// const chartConfig = {
//   Booked: {
//     label: 'Booked',
//     color: 'hsl(var(--chart-4))'
//   },
//   Check_Out: {
//     label: 'Check-Out',
//     color: 'hsl(var(--chart-3))'
//   },
//   Check_In: {
//     label: 'Check-In',
//     color: 'hsl(var(--chart-2))'
//   }
// } satisfies ChartConfig;

// export function RadialChartStacked() {
//   const totalVisitors =
//     chartData[0].Booked + chartData[0].Check_Out + chartData[0].Check_In;

//   return (
//     <Card className="flex flex-col gap-6 bg-lightbrown w-full max-w-xs sm:max-w-sm">
//       <CardHeader className="items-start pb-0">
//         <CardTitle>Revenue Stats</CardTitle>
//       </CardHeader>
//       <CardContent className="flex justify-center mt-4 pb-0">
//         <ChartContainer
//           config={chartConfig}
//           className="aspect-square w-full max-w-[250px]"
//         >
//           <RadialBarChart
//             data={chartData}
//             endAngle={180}
//             innerRadius={100}
//             outerRadius={170}
//           >
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
//                     return (
//                       <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) + 4}
//                           className="fill-muted-foreground text-black text-[0.8rem] opacity-50"
//                         >
//                           Total Revenue
//                         </tspan>
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) - 16}
//                           className="fill-foreground text-2xl font-medium"
//                         >
//                           {totalVisitors.toLocaleString()}
//                         </tspan>
//                       </text>
//                     );
//                   }
//                 }}
//               />
//             </PolarRadiusAxis>
//             <RadialBar
//               dataKey="Booked"
//               fill="var(--color-Booked)"
//               stackId="a"
//               className="stroke-transparent stroke-2"
//             />
//             <RadialBar
//               dataKey="Check_Out"
//               fill="var(--color-Check_Out)"
//               stackId="a"
//               className="stroke-transparent stroke-2"
//             />
//             <RadialBar
//               dataKey="Check_In"
//               fill="var(--color-Check_In)"
//               stackId="a"
//               className="stroke-transparent stroke-2"
//             />
//           </RadialBarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex flex-col items-start justify-center gap-6 px-2">
//         <div className="flex items-center gap-12">
//           <span className="flex w-3 h-3 bg-success rounded-full"></span>
//           <span className="opacity-30">Check-in</span>
//         </div>
//         <div className="flex items-center gap-12">
//           <span className="flex w-3 h-3 bg-pending rounded-full"></span>
//           <span className="opacity-30">Check-out</span>
//         </div>
//         <div className="flex items-center gap-12">
//           <span className="flex w-3 h-3 bg-background rounded-full"></span>
//           <span className="opacity-30">Booked</span>
//         </div>

//         <div className="w-full flex flex-col xl:flex-row justify-center items-center gap-4 border border-black border-opacity-15 rounded-lg px-4 py-2 mt-4">
//           <span className="bg-success/20 text-xs px-2 flex justify-center items-center h-8 rounded-lg border border-success">
//             <span className="text-success text-[0.8rem] whitespace-nowrap">
//               +16.2 %
//             </span>
//           </span>
//           <p className="text-xs text-black text-center">
//             You booked 3,456 rooms compared to last month
//           </p>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }




'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

type RevenueData = {
  totalRevenue: number;
  byDepartment: {
    [key: string]: number;
  };
};

type Props = {
  revenueData: {
    totalRevenue: number;
    byDepartment: {
      [key: string]: number;
    };
  };
};

const chartData = [
  { month: 'january', Booked: 1260, Check_Out: 570, Check_In: 480 }
];

export const RadialChartStacked: React.FC<Props> = ({ revenueData }) => {
  const chartData = revenueData
    ? [
      {
        name: 'Revenue',
        ...revenueData.byDepartment
      }
    ]
    : [];
  const totalVisitors = Object.values(revenueData?.byDepartment ?? {}).reduce(
    (acc, value) => acc + value,
    0
  );
  const chartConfig: ChartConfig = Object.fromEntries(
    Object.keys(revenueData.byDepartment).map((key, index) => [
      key,
      {
        label: key,
        color: `hsl(var(--chart-${(index % 6) + 1}))`
      }
    ])
  );

  const totalRevenue = revenueData?.totalRevenue ?? 0;
  return (
    <Card className="flex flex-col gap-6 bg-lightbrown w-full max-w-xs sm:max-w-sm">
      <CardHeader className="items-start pb-0">
        <CardTitle>Revenue Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center mt-4 pb-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={100}
            outerRadius={170}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground text-black text-[0.8rem] opacity-50"
                        >
                          Total Revenue
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-medium"
                        >
                          {totalRevenue.toLocaleString()}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            {/* <RadialBar
              dataKey="Booked"
              fill="var(--color-Booked)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="Check_Out"
              fill="var(--color-Check_Out)"
              stackId="a"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="Check_In"
              fill="var(--color-Check_In)"
              stackId="a"
              className="stroke-transparent stroke-2"
            /> */}
            {Object.keys(revenueData.byDepartment).map((key, index) => (
              <RadialBar
                key={key}
                dataKey={key}
                fill={`hsl(var(--chart-${(index % 6) + 1}))`} // cycle through color vars
                stackId="a"
                className="stroke-transparent stroke-2"
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col items-start justify-center gap-6 px-2">
        <div className="flex items-center gap-12">
          <span className="flex w-3 h-3 bg-success rounded-full"></span>
          <span className="opacity-30">Check-in</span>
        </div>
        <div className="flex items-center gap-12">
          <span className="flex w-3 h-3 bg-pending rounded-full"></span>
          <span className="opacity-30">Check-out</span>
        </div>
        <div className="flex items-center gap-12">
          <span className="flex w-3 h-3 bg-background rounded-full"></span>
          <span className="opacity-30">Booked</span>
        </div>

        <div className="w-full flex flex-col xl:flex-row justify-center items-center gap-4 border border-black border-opacity-15 rounded-lg px-4 py-2 mt-4">
          <span className="bg-success/20 text-xs px-2 flex justify-center items-center h-8 rounded-lg border border-success">
            <span className="text-success text-[0.8rem] whitespace-nowrap">
              +16.2 %
            </span>
          </span>
          <p className="text-xs text-black text-center">
            You booked 3,456 rooms compared to last month
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};



