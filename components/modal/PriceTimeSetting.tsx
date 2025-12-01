// 'use client';

// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import apiCall from '@/lib/axios';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const weekdays = [
//   'Monday',
//   'Tuesday',
//   'Wednesday',
//   'Thursday',
//   'Friday',
//   'Saturday',
//   'Sunday',
// ];

// type DayAvailability = {
//   [key: string]: {
//     checked: boolean;
//     from: string;
//     to: string;
//   };
// };

// const PriceTimeSettingSwimmingPool: React.FC<ModalProps> = ({ isOpen, onClose }) => {
//   const [dayAvailability, setDayAvailability] = useState<DayAvailability>(
//     weekdays.reduce((acc, day) => {
//       acc[day] = { checked: false, from: '', to: '' };
//       return acc;
//     }, {} as DayAvailability)
//   );

//   // ✅ Fetch swimming pool schedule
//   useEffect(() => {
//     const fetchAvailability = async () => {
//       try {
//         const res = await apiCall('GET', 'api/hotel/service-availability/swimmingpool');
//         const swimmingPoolSchedules = res?.data?.schedules || {};

//         const updated = weekdays.reduce((acc, day) => {
//           acc[day] = { checked: false, from: '', to: '' };
//           return acc;
//         }, {} as DayAvailability);

//         // Map the fetched swimming pool schedules to dayAvailability state
//         swimmingPoolSchedules?.forEach((schedule: any) => {
//           updated[schedule.day] = {
//             checked: true,
//             from: schedule.startTime || '',
//             to: schedule.endTime || '',
//           };
//         });

//         setDayAvailability(updated);
//       } catch (error) {
//         console.error('Error fetching swimming pool schedule:', error);
//       }
//     };

//     if (isOpen) fetchAvailability();
//   }, [isOpen]);

//   const handleDayToggle = (day: string) => {
//     setDayAvailability((prev) => ({
//       ...prev,
//       [day]: { ...prev[day], checked: !prev[day].checked },
//     }));
//   };

//   const handleInputChange = (day: string, field: 'from' | 'to', value: string) => {
//     setDayAvailability((prev) => ({
//       ...prev,
//       [day]: { ...prev[day], [field]: value },
//     }));
//   };

//   const handleSave = async () => {
//     const availability = Object.entries(dayAvailability)
//       .filter(([_, { checked }]) => checked)
//       .map(([day, { from, to }]) => ({
//         day,
//         startTime: from,
//         endTime: to
//       }));

//     const payload = {
//       serviceAvailability: [
//         {
//           service: 'swimmingpool',
//           isActive: availability.length > 0,
//           schedules: availability
//         }
//       ]
//     };

//     try {
//       await apiCall('PUT', 'api/hotel/service-availability', payload);
//       console.log('Swimming Pool Availability Saved:', availability);
//       onClose();
//     } catch (error) {
//       console.error('Failed to save swimming pool availability:', error);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
//       <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl animate-fadeIn overflow-y-auto max-h-[90vh] relative">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold text-gray-800">Manage Swimming Pool Availability</h2>
//           <button onClick={onClose} className="text-gray-600 hover:text-black text-xl">✖</button>
//         </div>

//         <hr className="border-t border-gray-400 mb-4" />

//         {/* Table Heading */}
//         <div className="grid grid-cols-3 font-semibold text-gray-700 text-sm px-1 mb-3">
//           <span>Select Availability</span>
//           <span className="col-span-2">Select Time</span>
//         </div>

//         <div className="space-y-4">
//           {weekdays.map((day) => (
//             <div key={day} className="grid grid-cols-3 gap-2 items-center">
//               {/* Checkbox */}
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={dayAvailability[day].checked}
//                   onChange={() => handleDayToggle(day)}
//                   className="w-4 h-4"
//                 />
//                 <span className="text-gray-700">{day}</span>
//               </label>

//               {/* Time inputs */}
//               <div className="flex gap-4 col-span-2 items-center">
//                 <div className="flex items-center gap-1">
//                   <span className="text-sm text-gray-600">From</span>
//                   <input
//                     type="time"
//                     value={dayAvailability[day].from}
//                     onChange={(e) =>
//                       handleInputChange(day, 'from', e.target.value)
//                     }
//                     className="rounded border border-gray-300 px-2 py-1 w-[200px] bg-[#EFE9DF]"
//                   />
//                 </div>

//                 <div className="flex items-center gap-1">
//                   <span className="text-sm text-gray-600">To</span>
//                   <div className="relative w-[200px]">
//                     <input
//                       type="time"
//                       value={dayAvailability[day].to}
//                       onChange={(e) =>
//                         handleInputChange(day, 'to', e.target.value)
//                       }
//                       className="rounded border border-gray-300 px-2 py-1 w-full bg-[#EFE9DF]"
//                     />
//                     <Image
//                       src="/gym-icons/plus-icon.png"
//                       alt="plus"
//                       width={18}
//                       height={18}
//                       className="absolute right-[-36px] top-2.5 pointer-events-none opacity-50"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-end gap-4 pt-8">
//           <button
//             onClick={onClose}
//             className="bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="bg-[#362913] text-white font-medium py-2 px-6 rounded hover:bg-[#4a3c1f]"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PriceTimeSettingSwimmingPool;

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
] as const;
type Weekday = (typeof weekdays)[number];

type Slot = { from: string; to: string };

type DayState = {
  checked: boolean;
  from: string;
  to: string;
  slots: Slot[];
};

type DayAvailability = Record<Weekday, DayState>;

const makeEmptyState = (): DayAvailability =>
  weekdays.reduce((acc, day) => {
    acc[day] = { checked: false, from: '', to: '', slots: [] };
    return acc;
  }, {} as DayAvailability);

const PriceTimeSettingSwimmingPool: React.FC<ModalProps> = ({
  isOpen,
  onClose
}) => {
  const [dayAvailability, setDayAvailability] =
    useState<DayAvailability>(makeEmptyState());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // -------- Helpers --------
  const buildSchedules = (state: DayAvailability) =>
    weekdays.flatMap((day) =>
      state[day].checked
        ? state[day].slots.map((s) => ({
            day,
            startTime: s.from,
            endTime: s.to
          }))
        : []
    );

  const persistNow = async (nextState: DayAvailability) => {
    const schedules = buildSchedules(nextState);
    const payload = {
      serviceAvailability: [
        {
          service: 'swimmingpool',
          isActive: schedules.length > 0,
          schedules
        }
      ]
    };
    setSaving(true);
    try {
      await apiCall('PUT', 'api/hotel/service-availability', payload);
    } catch (e) {
      console.error('Persist failed', e);
    } finally {
      setSaving(false);
    }
  };

  // -------- Load existing --------
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      try {
        // Expect: { schedules: [{ day: 'Monday', startTime: '09:00', endTime: '21:00' }, ...] }
        const res = await apiCall(
          'GET',
          'api/hotel/service-availability/swimmingpool'
        );
        const schedules: Array<{
          day: Weekday;
          startTime: string;
          endTime: string;
        }> = res?.data?.schedules ?? [];

        const next = makeEmptyState();
        schedules.forEach(({ day, startTime, endTime }) => {
          if (!weekdays.includes(day)) return;
          next[day].checked = true;
          next[day].slots.push({ from: startTime || '', to: endTime || '' });
        });
        setDayAvailability(next);
      } catch (e) {
        console.error('Error fetching availability', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  // -------- UI handlers --------
  const handleDayToggle = async (day: Weekday) => {
    const next: DayAvailability = {
      ...dayAvailability,
      [day]: { ...dayAvailability[day], checked: !dayAvailability[day].checked }
    };
    setDayAvailability(next);
    await persistNow(next);
  };

  const handleInputChange = (
    day: Weekday,
    field: 'from' | 'to',
    value: string
  ) => {
    setDayAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  // PLUS click => add slot under that day + immediately persist
  const handleAddSlot = async (day: Weekday) => {
    const curr = dayAvailability[day];
    if (!curr.from || !curr.to) return;

    const next: DayAvailability = {
      ...dayAvailability,
      [day]: {
        ...curr,
        checked: true,
        slots: [...curr.slots, { from: curr.from, to: curr.to }],
        from: '',
        to: ''
      }
    };
    setDayAvailability(next);
    await persistNow(next);
  };

  // Delete slot inline + immediately persist
  const handleDeleteSlot = async (day: Weekday, index: number) => {
    const curr = dayAvailability[day];
    const nextSlots = curr.slots.filter((_, i) => i !== index);

    const next: DayAvailability = {
      ...dayAvailability,
      [day]: { ...curr, slots: nextSlots }
    };
    setDayAvailability(next);
    await persistNow(next);
  };

  // Optional footer save (fallback)
  const handleSave = async () => {
    await persistNow(dayAvailability);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[94%] max-w-6xl max-h-[92vh] overflow-hidden rounded-2xl shadow-2xl bg-[#FAF6EF] ring-1 ring-black/10">
        {/* Header (sticky) */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#F6EEE0] to-[#EFE9DF] px-6 py-4 border-b border-black/10 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-stone-800 tracking-tight">
              Manage Swimming Pool Availability
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

        {/* Body (scrollable) */}
        <div className="overflow-y-auto max-h-[calc(92vh-120px)] p-6">
          <div className="rounded-xl border border-black/10 bg-[#F6EEE0] shadow-sm">
            {/* Section title */}
            <div className="bg-[#EFE9DF] rounded-md px-4 py-2 mb-4">
              <h3 className="text-lg font-semibold text-stone-800">
                Set Day-wise Availability
              </h3>
            </div>

            {/* Column labels */}
            <div className="hidden md:grid grid-cols-12 gap-x-10 text-[13px] font-medium text-stone-700 px-5 pt-4 pb-2">
              <span className="col-span-3">Select Availability</span>
              <span className="col-span-9">Select Time</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-black/5">
              {loading ? (
                <div className="px-5 py-10 text-center text-stone-600">
                  Loading…
                </div>
              ) : (
                weekdays.map((day) => (
                  <div key={day} className="px-4 sm:px-5 py-4">
                    {/* Editor row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-x-10 items-center">
                      {/* Checkbox + day */}
                      <label className="flex items-center gap-3 md:col-span-3">
                        <input
                          type="checkbox"
                          checked={dayAvailability[day].checked}
                          onChange={() => handleDayToggle(day)}
                          className="h-4 w-4 rounded border-stone-300 text-amber-700 focus:ring-amber-700"
                        />
                        <span className="text-stone-800 font-medium">
                          {day}
                        </span>
                      </label>

                      {/* Time + plus */}
                      <div className="md:col-span-9">
                        <div className="flex flex-wrap gap-3 items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-stone-600">From</span>
                            <input
                              type="time"
                              value={dayAvailability[day].from}
                              onChange={(e) =>
                                handleInputChange(day, 'from', e.target.value)
                              }
                              className="rounded-lg border border-stone-300 px-3 py-2 w-[180px] bg-[#EFE9DF] text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-stone-600">To</span>
                            <input
                              type="time"
                              value={dayAvailability[day].to}
                              onChange={(e) =>
                                handleInputChange(day, 'to', e.target.value)
                              }
                              className="rounded-lg border border-stone-300 px-3 py-2 w-[180px] bg-[#EFE9DF] text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700/40"
                            />
                          </div>

                          {/* PLUS clickable under same style set */}
                          <button
                            type="button"
                            onClick={() => handleAddSlot(day)}
                            title="Add slot"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#A07D3D] text-white hover:bg-[#8c6e35] transition disabled:opacity-50"
                            disabled={
                              !dayAvailability[day].from ||
                              !dayAvailability[day].to ||
                              saving
                            }
                          >
                            <Image
                              src="/gym-icons/plus-icon.png"
                              alt="plus"
                              width={18}
                              height={18}
                            />
                          </button>
                        </div>

                        {/* Saved slots under same day */}
                        {dayAvailability[day].slots.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {dayAvailability[day].slots.map((s, idx) => (
                              <div
                                key={`${s.from}-${s.to}-${idx}`}
                                className="flex items-center gap-4 bg-white/60 rounded-lg px-3 py-2 ring-1 ring-black/5"
                              >
                                <span className="text-sm text-stone-700">
                                  {s.from} — {s.to}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSlot(day, idx)}
                                  className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-700 hover:bg-black/5 transition disabled:opacity-50"
                                  title="Remove slot"
                                  disabled={saving}
                                >
                                  ✖
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer (sticky) */}
        <div className="sticky bottom-0 z-10 bg-gradient-to-r from-[#F6EEE0] to-[#EFE9DF] px-6 py-4 border-t border-black/10 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-stone-800 rounded-md border border-stone-300 hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#a67c52] text-white rounded-md hover:bg-[#8a633d] transition shadow-sm disabled:opacity-60"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTimeSettingSwimmingPool;
