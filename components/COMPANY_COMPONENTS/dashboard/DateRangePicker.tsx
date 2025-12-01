'use client';
import React from 'react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePickerComponent = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  return (
    <DatePicker
      className="bg-transparent text-white text-xs focus:outline-none border border-amber-600 border-opacity-60 placeholder:text-xs 2xl:text-sm px-1 py-1 rounded-md"
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={(update: any) => {
        setDateRange(update);
      }}
      isClearable={true}
      placeholderText="Select Date Range"
    />
  );
};

export default DateRangePickerComponent;
