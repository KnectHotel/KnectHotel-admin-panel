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
  _id?: string; 
};

type DayAvailability = {
  checked: boolean;
  from: string; 
  to: string;   
  slots: Slot[];
};

const ServiceAvailabilityModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  
  const initializeAvailability = () =>
    weekdays.reduce((acc, day) => {
      acc[day] = { checked: false, from: '', to: '', slots: [] };
      return acc;
    }, {} as Record<string, DayAvailability>);

  const [availability, setAvailability] = useState<Record<string, DayAvailability>>(
    initializeAvailability
  );

  
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await apiCall('GET', 'api/hotel/service-availability/spa');
        const { schedules = [] } = res?.data || {};

        const updated = initializeAvailability();
        (schedules as any[]).forEach((entry) => {
          const day = entry.day;
          if (!updated[day]) return;
          updated[day].checked = true;
          updated[day].slots.push({
            from: entry.startTime ?? '',
            to: entry.endTime ?? '',
            _id: entry._id
          });
        });

        setAvailability(updated);
      } catch (error) {
        console.error('Failed to fetch availability', error);
        setAvailability(initializeAvailability());
      }
    };

    if (isOpen) fetchAvailability();
    
  }, [isOpen]);

  
  const saveAvailability = async (updatedAvailability: Record<string, DayAvailability>) => {
    const schedules = Object.entries(updatedAvailability).flatMap(([day, val]) =>
      val.checked
        ? val.slots
          .filter((slot) => slot.from && slot.to)
          .map((slot) => {
            const result: any = {
              day,
              startTime: slot.from,
              endTime: slot.to
            };
            if (slot._id) result._id = slot._id;
            return result;
          })
        : []
    );

    const payload = {
      serviceAvailability: [
        {
          service: 'spa',
          isActive: schedules.length > 0,
          schedules
        }
      ]
    };

    try {
      await apiCall('PUT', 'api/hotel/service-availability', payload);
    } catch (err: any) {
      if (err?.response) {
        console.error('API Error:', err.response.status, err.response.data);
      } else if (err?.message) {
        console.error('Error message:', err.message);
      } else {
        console.error('Unknown error:', err);
      }
    }
  };

  
  const handleToggle = (day: string) => {
    const updated = {
      ...availability,
      [day]: { ...availability[day], checked: !availability[day].checked }
    };
    setAvailability(updated);
    saveAvailability(updated);
  };

  const handleInputChange = (day: string, field: 'from' | 'to', value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleAddSlot = (day: string) => {
    const { from, to } = availability[day];
    if (!from || !to) return;

    const updated = {
      ...availability,
      [day]: {
        ...availability[day],
        checked: true,
        slots: [...availability[day].slots, { from, to }],
        from: '',
        to: ''
      }
    };
    setAvailability(updated);
    saveAvailability(updated);
  };

  const handleDeleteSlot = (day: string, index: number) => {
    const updated = {
      ...availability,
      [day]: {
        ...availability[day],
        slots: availability[day].slots.filter((_, i) => i !== index)
      }
    };
    setAvailability(updated);
    saveAvailability(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[94%] max-w-6xl max-h-[92vh] overflow-hidden rounded-2xl shadow-2xl bg-[#FAF6EF] ring-1 ring-black/10">
        {}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#F6EEE0] to-[#EFE9DF] px-6 py-4 border-b border-black/10 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-stone-800 tracking-tight">
              Manage Spa &amp; Salon — Availability
            </h2>
            <button
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 text-stone-600 hover:text-black transition"
              aria-label="Close"
              title="Close"
            >
              ✖
            </button>
          </div>
        </div>

        {}
        <div className="overflow-y-auto max-h-[calc(92vh-120px)] p-6">
          <div className="rounded-xl border border-black/10 bg-[#F6EEE0] shadow-sm">
            <div className="bg-[#EFE9DF] rounded-md px-4 py-2 mb-4">
              <h3 className="text-lg font-semibold text-stone-800">Set Day-wise Time Slots</h3>
            </div>

            {}
            <div className="hidden md:grid grid-cols-12 gap-x-8 text-[13px] font-medium text-stone-700 px-5 pt-4 pb-2">
              <span className="col-span-3">Select Availability</span>
              <span className="col-span-7">Select Time</span>
              <span className="col-span-2">Actions</span>
            </div>

            {}
            <div className="divide-y divide-black/5">
              {weekdays.map((day) => (
                <div key={day} className="px-4 sm:px-5 py-4">
                  {}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-x-8 items-center">
                    {}
                    <label className="flex items-center gap-3 md:col-span-3">
                      <input
                        type="checkbox"
                        checked={availability[day].checked}
                        onChange={() => handleToggle(day)}
                        className="h-4 w-4 rounded border-stone-300 text-amber-700 focus:ring-amber-700"
                      />
                      <span className="text-stone-800 font-medium">{day}</span>
                    </label>

                    {}
                    <div className="grid grid-cols-2 gap-3 md:col-span-7">
                      <input
                        type="time"
                        value={availability[day].from}
                        onChange={(e) => handleInputChange(day, 'from', e.target.value)}
                        className="rounded-lg border border-stone-300 px-3 py-2 w-full bg-[#EFE9DF] text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                        placeholder="From"
                      />
                      <input
                        type="time"
                        value={availability[day].to}
                        onChange={(e) => handleInputChange(day, 'to', e.target.value)}
                        className="rounded-lg border border-stone-300 px-3 py-2 w-full bg-[#EFE9DF] text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                        placeholder="To"
                      />
                    </div>

                    {}
                    <div className="md:col-span-2 flex items-center">
                      <button
                        onClick={() => handleAddSlot(day)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#A07D3D] text-white hover:bg-[#8c6e35] transition disabled:opacity-50"
                        title="Add time slot"
                        disabled={!availability[day].from || !availability[day].to}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {}
                  {availability[day].slots.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {availability[day].slots.map((slot, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-x-8 items-center bg-white/60 rounded-lg px-3 py-3 ring-1 ring-black/5"
                        >
                          {}
                          <div className="hidden md:block md:col-span-3" />

                          {}
                          <div className="grid grid-cols-2 gap-3 md:col-span-7">
                            <input
                              type="time"
                              value={slot.from}
                              disabled
                              className="rounded-lg border border-stone-300 px-3 py-2 w-full bg-[#EFE9DF] text-stone-700"
                            />
                            <input
                              type="time"
                              value={slot.to}
                              disabled
                              className="rounded-lg border border-stone-300 px-3 py-2 w-full bg-[#EFE9DF] text-stone-700"
                            />
                          </div>

                          {}
                          <div className="md:col-span-2 flex items-center">
                            <button
                              onClick={() => handleDeleteSlot(day, index)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-700 hover:bg-black/5 transition"
                              title="Remove"
                            >
                              ✖
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="sticky bottom-0 z-10 bg-gradient-to-r from-[#F6EEE0] to-[#EFE9DF] px-6 py-4 border-t border-black/10 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-stone-800 rounded-md border border-stone-300 hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                
                saveAvailability(availability);
                onClose();
              }}
              className="px-6 py-2 bg-[#a67c52] text-white rounded-md hover:bg-[#8a633d] transition shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAvailabilityModal;
































































































































































































































































































































































































































































































































































































































































































































































































