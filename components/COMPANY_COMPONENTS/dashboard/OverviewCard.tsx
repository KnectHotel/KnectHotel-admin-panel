import { Progress } from '@/components/ui/progress';
import React from 'react';
type OverviewDataType = {
  position: string;
  increment: string;
  progress: number;
};
const OverviewCard = ({ position, increment, progress }: OverviewDataType) => {
  return (
    <div className="flex flex-col w-full mx-2 items-center p-4 rounded-xl bg-[#3B2E16] border border-[#6E511D]">
      <div className="space-y-7">
        {/* Title */}
        <h5 className="text-xs 2xl:text-sm font-medium tracking-wide text-white/60">
          Overview
        </h5>
        {/* Details */}
        <div className="flex flex-col gap-2 justify-center items-start">
          <div className="flex justify-center items-end gap-2">
            <h1 className="text-3xl font-bold text-yellowBrown">{position}</h1>
            <span className="text-goldenYellow font-bold">+{increment}</span>
          </div>
          <p className="text-xs 2xl:text-sm text-white/60">
            This is current position overview
          </p>
        </div>
        {/* Progress bar */}
        <div className="w-full space-y-1">
          <Progress value={progress} />
          <div className="w-full flex px-1 justify-between text-xs 2xl:text-sm font-mono text-white">
            <span>{progress}%</span>
            <span>{`${100 - progress}`}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
