import React from 'react';
import OverviewCard from '../../../../../components/COMPANY_COMPONENTS/dashboard/OverviewCard';
import DetailsCard from '../../../../../components/COMPANY_COMPONENTS/dashboard/DetailsCard';
import { StackedBarChart } from '../../../../../components/COMPANY_COMPONENTS/dashboard/StackedBarChart';
import { DonutChart } from '../../../../../components/COMPANY_COMPONENTS/dashboard/DonutChart';
import { MultipleLineChart } from '../../../../../components/COMPANY_COMPONENTS/dashboard/MultipleLineChart';
import Header from '../../../../../components/COMPANY_COMPONENTS/dashboard/Header';
import Navbar from '@/components/Navbar';


type OverviewCardData = {
  position: string;
  increment: string;
  progress: number;
};

type DetailsCardItem = {
  title: string;
  value: number;
  increment: number;
};

type StackedBarChartData = {
  service: string;
  totalRevenue: number;
  profit: number;
  losses: number;
}[];

type DonutChartData = {
  label: string;
  visitors: number;
  fill: string;
}[];

type LineChartData = {
  month: string;
  newOrders: number;
  repeatOrders: number;
  averageOrderValue: number;
}[];


const OverviewCardDummyData: OverviewCardData = {
  position: '24.5',
  increment: '28.1',
  progress: 78
};

const DetailsCardDummyData: DetailsCardItem[] = [
  {
    title: 'Service Request',
    value: 74122,
    increment: 2.8
  },
  {
    title: 'Time Spent',
    value: 127,
    increment: 30
  },
  {
    title: 'Feedback ratings',
    value: 74352,
    increment: 5
  }
];

const StackedBarChartDummyData: StackedBarChartData = [
  {
    service: 'Reception',
    totalRevenue: 45000,
    profit: 38000,
    losses: 7000
  },
  {
    service: 'Housekeeping',
    totalRevenue: 28000,
    profit: 22000,
    losses: 6000
  },
  {
    service: 'In-room Dining',
    totalRevenue: 52000,
    profit: 45000,
    losses: 7000
  },
  {
    service: 'Concierges',
    totalRevenue: 39000,
    profit: 34000,
    losses: 5000
  },
  {
    service: 'Spa/Salon',
    totalRevenue: 67000,
    profit: 58000,
    losses: 9000
  },
  {
    service: 'Hall Bookings',
    totalRevenue: 85000,
    profit: 72000,
    losses: 13000
  },
  {
    service: 'Manage Orders',
    totalRevenue: 31000,
    profit: 26000,
    losses: 5000
  },
  {
    service: 'Swimming Pool',
    totalRevenue: 42000,
    profit: 37000,
    losses: 5000
  },
  {
    service: 'Laundry',
    totalRevenue: 25000,
    profit: 20000,
    losses: 5000
  },
  {
    service: 'SOS',
    totalRevenue: 18000,
    profit: 14000,
    losses: 4000
  },
  {
    service: 'Chat-With Staff',
    totalRevenue: 64000,
    profit: 55000,
    losses: 9000
  },
  {
    service: 'Gym',
    totalRevenue: 37000,
    profit: 32000,
    losses: 5000
  }
];

const DonutChartDummyData: DonutChartData = [
  { label: 'New Customers', visitors: 3475, fill: 'var(--color-newCustomers)' },
  {
    label: 'Returning Customers',
    visitors: 1230,
    fill: 'var(--color-returningCustomers)'
  },
  {
    label: 'Regular Customers',
    visitors: 987,
    fill: 'var(--color-regularCustomers)'
  }
];

const MultipleLineChartDummyData: LineChartData = [
  {
    month: 'January',
    newOrders: 344,
    repeatOrders: 566,
    averageOrderValue: 234
  },
  {
    month: 'February',
    newOrders: 387,
    repeatOrders: 602,
    averageOrderValue: 221
  },
  {
    month: 'March',
    newOrders: 523,
    repeatOrders: 577,
    averageOrderValue: 265
  },
  {
    month: 'April',
    newOrders: 478,
    repeatOrders: 658,
    averageOrderValue: 253
  },
  {
    month: 'May',
    newOrders: 542,
    repeatOrders: 683,
    averageOrderValue: 271
  },
  {
    month: 'June',
    newOrders: 615,
    repeatOrders: 721,
    averageOrderValue: 292
  }
];

const DBPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <Navbar  />
      <div className="min-h-screen w-full bg-coffee overflow-x-hidden mt-20">
        <Header />

        {}
        <div className="p-4 space-y-6 w-full flex flex-col justify-center items-center">
          {}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-6 w-full">
            <div className="flex-1 flex justify-center">
              <StackedBarChart chartData={StackedBarChartDummyData} />
            </div>
            <div className="flex-2 flex justify-center">
              <DonutChart chartData={DonutChartDummyData} />
            </div>
          </div>

          {}
          <div className="flex flex-col md:flex-row overflow-x-auto md:justify-between space-x-4 items-center w-full">
            <div className="flex flex-col justify-center items-center gap-3">
              <OverviewCard
                position={OverviewCardDummyData.position}
                increment={OverviewCardDummyData.increment}
                progress={OverviewCardDummyData.progress}
              />
              <DetailsCard data={DetailsCardDummyData} />
            </div>
            <div className="w-[90%]">
              <MultipleLineChart
                chartData={MultipleLineChartDummyData}
                mode="Weekly"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBPage;
