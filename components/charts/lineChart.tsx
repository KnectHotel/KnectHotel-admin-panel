// 'use client';

// import { useEffect, useState } from 'react';
// import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
// import { Card, CardContent } from '../ui/card';
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent
// } from '../ui/chart';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '../ui/select';
// import { ChevronDown } from 'lucide-react';
// import { apiCall } from '@/lib/axios'; // ✅ adjust path if needed

// const chartConfig = {
//   employees: {
//     label: 'Employees',
//     color: 'hsl(var(--chart-1))'
//   }
// } satisfies ChartConfig;
// function get4HourTicks(data: { month: string }[]) {
//   return data
//     .filter((_, index) => index % 4 === 0) // every 4th data point (4-hour interval)
//     .map((item) => item.month);
// }

// const tabToTypeMap = ['employee', 'booking', 'service'];

// const rangeMap: Record<string, string> = {
//   Today: 'today',
//   week: 'lastWeek',
//   month: 'lastMonth',
//   quater: 'lastQuarter',
//   year: 'lastYear'
// };

// export function LineChartLinear() {
//   const [selectedRange, setSelectedRange] = useState('month');
//   const [activeTabIndex, setActiveTabIndex] = useState(0);
//   const [chartData, setChartData] = useState<
//     { month: string; employees: number }[]
//   >([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const type = tabToTypeMap[activeTabIndex];
//         let url = `/api/dashboard/cases?type=${type}`;

//         const rangeParam = rangeMap[selectedRange] || 'lastMonth';
//         url += `&range=${rangeParam}`;

//         const response = await apiCall('GET', url);
//         const { labels, data } = response;

//         let formatted = labels.map((label: string, idx: number) => ({
//           month: label,
//           employees: Math.max(0, Math.round(data[idx] || 0)) // ensures non-negative integers
//         }));

//         // ✅ FIX: Trim duplicates when range is 'year'
//         if (selectedRange === 'year' && formatted.length > 12) {
//           formatted = formatted.slice(0, 12);
//         }

//         setChartData(formatted);
//       } catch (err) {
//         console.error('Chart fetch error:', err);
//       }
//     };

//     fetchData();
//   }, [selectedRange, activeTabIndex]);

//   return (
//     <Card className="bg-lightbrown space-y-6 pt-2 w-full">
//       <div className="flex flex-col gap-3 p-4">
//         <div className="w-full flex justify-between items-center">
//           <p className="text-xs 2xl:text-sm text-[#0B1C33] opacity-70 font-medium">
//             TOTAL CASES
//           </p>

//           <div>
//             <Select
//               onValueChange={(value) => setSelectedRange(value)}
//               defaultValue={selectedRange}
//             >
//               <SelectTrigger className="w-[110px] border-white border relative">
//                 <SelectValue placeholder={selectedRange} />
//                 <ChevronDown className="absolute w-4 h-4 z-50 right-0 top-2 text-black" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Today">Today</SelectItem>
//                 <SelectItem value="week">Last week</SelectItem>
//                 <SelectItem value="month">Last month</SelectItem>
//                 <SelectItem value="quater">Last quarter</SelectItem>
//                 <SelectItem value="year">Last year</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div className="flex items-center justify-between bg-offWhite p-2 rounded-lg">
//           {[
//             'Employee Escalated',
//             'Booking Escalated',
//             'Services Escalated'
//           ].map((label, index) => (
//             <div
//               key={index}
//               onClick={() => setActiveTabIndex(index)}
//               className={`cursor-pointer text-sm font-medium px-4 py-2 rounded-lg ${activeTabIndex === index
//                 ? 'bg-coffee text-orangeLight'
//                 : 'bg-fadedCream text-[#0B1C33]'
//                 }`}
//             >
//               {label}
//             </div>
//           ))}
//         </div>
//       </div>

//       <CardContent>
//         <ChartContainer
//           config={chartConfig}
//           className="bg-lightbrown h-[200px] w-full"
//         >
//           <LineChart data={chartData} margin={{ left: 0, right: 30 }}>
//             <CartesianGrid vertical={false} />
//             <YAxis
//               tickLine={false}
//               axisLine={false}
//               tickMargin={20}
//               width={60}
//               orientation="left"
//               interval="preserveStartEnd"
//               domain={[0, 'dataMax + 1']}
//               tickFormatter={(value) => Math.floor(value).toString()}
//             />

//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               interval={0}
//               ticks={
//                 selectedRange === 'Today' ? get4HourTicks(chartData) : undefined
//               }
//             />

//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Line
//               dataKey="employees"
//               type="linear"
//               stroke="var(--color-employees)"
//               strokeWidth={1.5}
//               dot={false}
//             />
//           </LineChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent } from '../ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '../ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { ChevronDown } from 'lucide-react';
import { apiCall } from '@/lib/axios';

const tabOptions = [
  {
    label: 'Employee Count ',
    label2: 'employees:',
    key: 'employee',
    chartKey: 'employees',
    color: 'hsl(var(--chart-1))'
  },
  {
    label: 'Booking Count ',
    label2: 'bookings:',
    key: 'booking',
    chartKey: 'bookings',
    color: 'hsl(var(--chart-2))'
  },
  {
    label: 'Services Count',
    label2: 'Services:',
    key: 'service',
    chartKey: 'services',
    color: 'hsl(var(--chart-3))'
  }
];

// ✅ Typing for chart data
type ChartDataType = {
  month: string;
  [key: string]: number | string;
};

// ✅ Tick formatter for Today view
function get4HourTicks(data: ChartDataType[]) {
  return data.filter((_, index) => index % 4 === 0).map((item) => item.month);
}

const rangeMap: Record<string, string> = {
  Today: 'today',
  week: 'lastWeek',
  month: 'lastMonth',
  quater: 'lastQuarter',
  year: 'lastYear'
};

export function LineChartLinear() {
  const [selectedRange, setSelectedRange] = useState('month');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);

  const activeTab = tabOptions[activeTabIndex];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const type = activeTab.key;
        const rangeParam = rangeMap[selectedRange] || 'lastMonth';

        const url = `/api/dashboard/cases?type=${type}&range=${rangeParam}`;
        const response = await apiCall('GET', url);
        const { labels, data } = response;

        let formatted: ChartDataType[] = labels.map(
          (label: string, idx: number) => ({
            month: label,
            [activeTab.chartKey]: Math.max(0, Math.round(data[idx] || 0))
          })
        );

        if (selectedRange === 'year' && formatted.length > 12) {
          formatted = formatted.slice(0, 12);
        }

        setChartData(formatted);
      } catch (err) {
        console.error('Chart fetch error:', err);
      }
    };

    fetchData();
  }, [selectedRange, activeTabIndex]);

  const chartConfig: ChartConfig = {
    [activeTab.chartKey]: {
      label: activeTab.label2,
      color: activeTab.color
    }
  };

  return (
    <Card className="bg-lightbrown space-y-6 pt-2 w-full">
      <div className="flex flex-col gap-3 p-4">
        <div className="w-full flex justify-between items-center">
          <p className="text-xs 2xl:text-sm text-[#0B1C33] opacity-70 font-medium">
            TOTAL COUNT
          </p>

          <Select
            onValueChange={(value) => setSelectedRange(value)}
            defaultValue={selectedRange}
          >
            <SelectTrigger className="w-[110px] border-white border relative">
              <SelectValue placeholder={selectedRange} />
              <ChevronDown className="absolute w-4 h-4 z-50 right-0 top-2 text-black" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="week">Last week</SelectItem>
              <SelectItem value="month">Last month</SelectItem>
              <SelectItem value="quater">Last quarter</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between bg-offWhite p-2 rounded-lg">
          {tabOptions.map((tab, index) => (
            <div
              key={index}
              onClick={() => setActiveTabIndex(index)}
              className={`cursor-pointer text-sm font-medium px-4 py-2 rounded-lg ${
                activeTabIndex === index
                  ? 'bg-coffee text-orangeLight'
                  : 'bg-fadedCream text-[#0B1C33]'
              }`}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="bg-lightbrown h-[200px] w-full"
        >
          <LineChart data={chartData} margin={{ left: 0, right: 30 }}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={20}
              width={60}
              orientation="left"
              interval="preserveStartEnd"
              domain={[0, 'dataMax + 1']}
              tickFormatter={(value) => Math.floor(value).toString()}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              ticks={
                selectedRange === 'Today' ? get4HourTicks(chartData) : undefined
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey={activeTab.chartKey}
              type="linear"
              stroke={`var(--color-${activeTab.chartKey})`}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
