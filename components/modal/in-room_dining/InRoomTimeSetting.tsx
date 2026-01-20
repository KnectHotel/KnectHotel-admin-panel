'use client';

import React, { useEffect, useState } from 'react';
import apiCall from '@/lib/axios';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

type Slot = {
  from: string;
  to: string;
};

type DayAvailability = {
  [day: string]: {
    checked: boolean;
    from: string;
    to: string;
    slots: Slot[];
  };
};

const InRoomDiningAvailabilityModal: React.FC<ModalProps> = ({
  isOpen,
  onClose
}) => {
  const [dayAvailability, setDayAvailability] = useState<DayAvailability>(() =>
    weekdays.reduce((acc, day) => {
      acc[day] = { checked: false, from: '', to: '', slots: [] };
      return acc;
    }, {} as DayAvailability)
  );

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await apiCall(
          'GET',
          'api/hotel/service-availability/inroomdining'
        );

        const schedules = res?.data?.schedules || [];

        const mapped = weekdays.reduce((acc, day) => {
          acc[day] = { checked: false, from: '', to: '', slots: [] };
          return acc;
        }, {} as DayAvailability);

        schedules.forEach((entry: any) => {
          mapped[entry.day].checked = true;
          mapped[entry.day].slots.push({
            from: entry.startTime,
            to: entry.endTime
          });
        });

        setDayAvailability(mapped);
      } catch (err) {
        console.error('Error fetching in-room dining availability:', err);
      }
    };

    if (isOpen) fetchAvailability();
  }, [isOpen]);

  const handleDayToggle = (day: string) => {
    setDayAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        checked: !prev[day].checked
      }
    }));
  };

  const handleInputChange = (
    day: string,
    field: 'from' | 'to',
    value: string
  ) => {
    setDayAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleAddSlot = (day: string) => {
    const { from, to } = dayAvailability[day];

    if (from && to) {
      setDayAvailability((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          slots: [...prev[day].slots, { from, to }],
          from: '',
          to: ''
        }
      }));
    } else {
      alert('Please select both From and To time before adding.');
    }
  };

  const handleDeleteSlot = (day: string, index: number) => {
    setDayAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    const updated = { ...dayAvailability };

    weekdays.forEach((day) => {
      const { from, to, slots, checked } = updated[day];
      if (checked && from && to) {
        slots.push({ from, to });
        updated[day].from = '';
        updated[day].to = '';
      }
    });

    const schedules = Object.entries(updated).flatMap(([day, data]) =>
      data.checked
        ? data.slots.map((slot) => ({
          day,
          startTime: slot.from,
          endTime: slot.to
        }))
        : []
    );

    const payload = {
      serviceAvailability: [
        {
          service: 'inroomdining',
          isActive: schedules.length > 0,
          schedules
        }
      ]
    };

    try {
      const res = await apiCall(
        'PUT',
        'api/hotel/service-availability',
        payload
      );
      console.log('Updated successfully:', res);
      onClose();
    } catch (err) {
      console.error('Error saving availability:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Manage In-Room Dining Availability
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-xl"
          >
            ✖
          </button>
        </div>

        <hr className="mb-4" />

        <div className="grid grid-cols-3 font-semibold text-gray-700 text-sm px-1 mb-3">
          <span>Select Availability</span>
          <span className="col-span-2">Select Time</span>
        </div>

        <div className="space-y-4">
          {weekdays.map((day) => (
            <div key={day} className="grid grid-cols-3 gap-2 items-start">
              {}
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={dayAvailability[day].checked}
                  onChange={() => handleDayToggle(day)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">{day}</span>
              </label>

              {}
              <div className="flex gap-4 col-span-2 items-center mt-2">
                <div className="flex items-center gap-1 w-[200px]">
                  <span className="text-sm text-gray-600">From</span>
                  <input
                    type="time"
                    value={dayAvailability[day].from}
                    onChange={(e) =>
                      handleInputChange(day, 'from', e.target.value)
                    }
                    className="rounded border border-gray-300 px-2 py-1 w-full bg-[#EFE9DF]"
                  />
                </div>

                <div className="flex items-center gap-1 w-[200px]">
                  <span className="text-sm text-gray-600">To</span>
                  <div className="relative w-full">
                    <input
                      type="time"
                      value={dayAvailability[day].to}
                      onChange={(e) =>
                        handleInputChange(day, 'to', e.target.value)
                      }
                      className="rounded border border-gray-300 px-2 py-1 w-full bg-[#EFE9DF]"
                    />
                    <button
                      onClick={() => handleAddSlot(day)}
                      className="absolute right-[-36px] top-2.5 w-6 h-6 flex items-center justify-center text-white bg-[#A07D3D] hover:bg-[#8c6e35] rounded-sm text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {}
              {dayAvailability[day].slots.length > 0 && (
                <div className="col-span-2 col-start-2 text-sm font-medium text-gray-800">
                  Saved Time Slots
                </div>
              )}
              {dayAvailability[day].slots.map((slot, index) => (
                <div
                  key={index}
                  className="col-span-2 col-start-2 flex gap-4 items-center"
                >
                  <div className="flex items-center gap-1 w-[200px]">
                    <span className="text-sm text-gray-600">From</span>
                    <input
                      type="time"
                      value={slot.from}
                      disabled
                      className="rounded border border-gray-300 px-2 py-1 w-full bg-[#EFE9DF]"
                    />
                  </div>
                  <div className="flex items-center gap-1 w-[200px]">
                    <span className="text-sm text-gray-600">To</span>
                    <div className="relative w-full">
                      <input
                        type="time"
                        value={slot.to}
                        disabled
                        className="rounded border border-gray-300 px-2 py-1 w-full bg-[#EFE9DF]"
                      />
                      <span
                        onClick={() => handleDeleteSlot(day, index)}
                        className="absolute right-[-36px] top-2.5 text-black font-bold cursor-pointer"
                      >
                        ✖
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-8">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#362913] text-white py-2 px-6 rounded hover:bg-[#4a3c1f]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default InRoomDiningAvailabilityModal;