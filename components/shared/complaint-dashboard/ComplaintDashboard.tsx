'use client';
import React from 'react';
import dynamic from 'next/dynamic';



const CustomPieChart = dynamic(() => import('./PieChart'), { ssr: false });

type Props = {
  title: string;
  closedCases: number;
  openCases: number;
  inProgressCases: number;
};

const ComplaintDashboard = ({
  title,
  closedCases,
  openCases,
  inProgressCases
}: Props) => {
  return (
    <div className="w-full flex bg-[#FAF6EF] rounded-2xl drop-shadow-lg hover:drop-shadow-none ease-in-out duration-200 justify-between items-center px-6">
      <div className="flex flex-col gap-4 w-[80%]">
        <h2 className="text-xl text-start font-semibold">{title}</h2>
        <div className="flex justify-between pr-14 gap-4 w-full">
          <div className="flex gap-3">
            <span className="h-14 w-1 rounded-full bg-[#78B150]"></span>
            <div className="flex flex-col justify-center gap-1 items-start">
              <p className="text-xs 2xl:text-sm xl:text-sm opacity-35">
                CLOSED CASES
              </p>
              <h3 className="text-start text-xs 2xl:text-sm xl:text-sm font-semibold">
                {closedCases}
              </h3>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="h-14 w-1 rounded-full bg-[#FE9900]"></span>
            <div className="flex flex-col justify-center gap-1 items-start">
              <p className="text-xs 2xl:text-sm xl:text-sm opacity-35">
                OPEN CASES
              </p>
              <h3 className="text-start text-xs 2xl:text-sm xl:text-sm font-semibold">
                {openCases}
              </h3>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="h-14 w-1 rounded-full bg-[#3787E3]"></span>
            <div className="flex flex-col justify-center gap-1 items-start">
              <p className="text-xs 2xl:text-sm xl:text-sm opacity-35">
                IN PROGRESS CASES
              </p>
              <h3 className="text-start text-xs 2xl:text-sm xl:text-sm font-semibold">
                {inProgressCases}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[20%]">
        <CustomPieChart
          value1={closedCases}
          value2={openCases}
          value3={inProgressCases}
        />
      </div>
    </div>
  );
};

export default ComplaintDashboard;
