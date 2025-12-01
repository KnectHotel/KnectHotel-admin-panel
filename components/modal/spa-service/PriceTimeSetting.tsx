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
  _id?: string; // server id if present
};

type DayAvailability = {
  checked: boolean;
  from: string; // inline editor (not saved until added)
  to: string;   // inline editor (not saved until added)
  slots: Slot[];
};

const ServiceAvailabilityModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  // Build empty week
  const initializeAvailability = () =>
    weekdays.reduce((acc, day) => {
      acc[day] = { checked: false, from: '', to: '', slots: [] };
      return acc;
    }, {} as Record<string, DayAvailability>);

  const [availability, setAvailability] = useState<Record<string, DayAvailability>>(
    initializeAvailability
  );

  // ---------- Load existing (only times) ----------
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ---------- Save all (only times) ----------
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
      console.log('Availability (time only) saved ✅');
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

  // ---------- UI handlers ----------
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
        {/* Header */}
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

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(92vh-120px)] p-6">
          <div className="rounded-xl border border-black/10 bg-[#F6EEE0] shadow-sm">
            <div className="bg-[#EFE9DF] rounded-md px-4 py-2 mb-4">
              <h3 className="text-lg font-semibold text-stone-800">Set Day-wise Time Slots</h3>
            </div>

            {/* Column labels (Time only) */}
            <div className="hidden md:grid grid-cols-12 gap-x-8 text-[13px] font-medium text-stone-700 px-5 pt-4 pb-2">
              <span className="col-span-3">Select Availability</span>
              <span className="col-span-7">Select Time</span>
              <span className="col-span-2">Actions</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-black/5">
              {weekdays.map((day) => (
                <div key={day} className="px-4 sm:px-5 py-4">
                  {/* Inline editor row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-x-8 items-center">
                    {/* Checkbox + day */}
                    <label className="flex items-center gap-3 md:col-span-3">
                      <input
                        type="checkbox"
                        checked={availability[day].checked}
                        onChange={() => handleToggle(day)}
                        className="h-4 w-4 rounded border-stone-300 text-amber-700 focus:ring-amber-700"
                      />
                      <span className="text-stone-800 font-medium">{day}</span>
                    </label>

                    {/* Time From / To */}
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

                    {/* Add button */}
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

                  {/* Saved slots list (time only) */}
                  {availability[day].slots.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {availability[day].slots.map((slot, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-x-8 items-center bg-white/60 rounded-lg px-3 py-3 ring-1 ring-black/5"
                        >
                          {/* spacer for alignment on md+ */}
                          <div className="hidden md:block md:col-span-3" />

                          {/* From / To */}
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

                          {/* Delete */}
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

        {/* Footer */}
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
                // explicit save (optional, since we already save on each action)
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



// 'use client';

// import React, { useEffect, useState } from 'react';
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
//   'Sunday'
// ];

// type Slot = {
//   from: string;
//   to: string;
//   maxPersons: string; // UI value (string)
//   price: string;      // UI value (string)
//   _id?: string;
// };

// type DayAvailability = {
//   checked: boolean;
//   from: string;
//   to: string;
//   maxPersons: string;
//   price: string;
//   slots: Slot[];
// };

// const ServiceAvailabilityModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
//   const initializeAvailability = () =>
//     weekdays.reduce(
//       (acc, day) => {
//         acc[day] = {
//           checked: false,
//           from: '',
//           to: '',
//           maxPersons: '',
//           price: '',
//           slots: []
//         };
//         return acc;
//       },
//       {} as Record<string, DayAvailability>
//     );

//   const [availability, setAvailability] = useState<Record<string, DayAvailability>>(
//     initializeAvailability
//   );

//   // Sanitize helpers
//   const sanitizeInt = (v: string) => {
//     const n = parseInt(String(v).replace(/[^\d]/g, ''), 10);
//     return Number.isFinite(n) ? n : undefined;
//   };
//   const sanitizeFloat = (v: string) => {
//     const n = parseFloat(String(v).replace(/[^\d.]/g, ''));
//     return Number.isFinite(n) ? n : undefined;
//   };

//   useEffect(() => {
//     const fetchAvailability = async () => {
//       try {
//         const res = await apiCall('GET', 'api/hotel/service-availability/spa');
//         const { schedules = [] } = res?.data || {};

//         const updated = initializeAvailability();
//         schedules.forEach((entry: any) => {
//           const day = entry.day;
//           if (!updated[day]) return;

//           updated[day].checked = true;
//           updated[day].slots.push({
//             from: entry.startTime,
//             to: entry.endTime,
//             maxPersons:
//               entry.maxCapacity !== undefined && entry.maxCapacity !== null
//                 ? String(entry.maxCapacity)
//                 : '',
//             price:
//               entry.price !== undefined && entry.price !== null
//                 ? String(entry.price)
//                 : '',
//             _id: entry._id
//           });
//         });

//         setAvailability(updated);
//       } catch (error) {
//         console.error('Failed to fetch availability', error);
//       }
//     };

//     if (isOpen) fetchAvailability();
//   }, [isOpen]);

//   const saveAvailability = async (updatedAvailability: Record<string, DayAvailability>) => {
//     const schedules = Object.entries(updatedAvailability).flatMap(([day, val]) =>
//       val.checked
//         ? val.slots
//           .filter((slot) => slot.from && slot.to)
//           .map((slot) => {
//             const result: any = {
//               day,
//               startTime: slot.from,
//               endTime: slot.to
//             };

//             const maxCapacity = sanitizeInt(slot.maxPersons);
//             const price = sanitizeFloat(slot.price);

//             if (maxCapacity !== undefined) result.maxCapacity = maxCapacity;
//             if (price !== undefined) result.price = price;
//             if (slot._id) result._id = slot._id;

//             return result;
//           })
//         : []
//     );

//     const payload = {
//       serviceAvailability: [
//         {
//           service: 'spa',
//           isActive: schedules.length > 0,
//           schedules
//         }
//       ]
//     };

//     try {
//       await apiCall('PUT', 'api/hotel/service-availability', payload);
//       console.log('Availability saved ✅');
//     } catch (err: any) {
//       if (err?.response) {
//         console.error('API Error:', err.response.status, err.response.data);
//       } else if (err?.message) {
//         console.error('Error message:', err.message);
//       } else {
//         console.error('Unknown error:', err);
//       }
//     }
//   };

//   const handleToggle = (day: string) => {
//     const updated = {
//       ...availability,
//       [day]: { ...availability[day], checked: !availability[day].checked }
//     };
//     setAvailability(updated);
//     saveAvailability(updated);
//   };

//   const handleInputChange = (
//     day: string,
//     field: 'from' | 'to' | 'maxPersons' | 'price',
//     value: string
//   ) => {
//     setAvailability((prev) => ({
//       ...prev,
//       [day]: { ...prev[day], [field]: value }
//     }));
//   };

//   const handleAddSlot = (day: string) => {
//     const { from, to, maxPersons, price } = availability[day];
//     if (from && to) {
//       const updated = {
//         ...availability,
//         [day]: {
//           ...availability[day],
//           slots: [
//             ...availability[day].slots,
//             { from, to, maxPersons: maxPersons || '', price: price || '' }
//           ],
//           from: '',
//           to: '',
//           maxPersons: '',
//           price: ''
//         }
//       };
//       setAvailability(updated);
//       saveAvailability(updated);
//     }
//   };

//   const handleDeleteSlot = (day: string, index: number) => {
//     const updated = {
//       ...availability,
//       [day]: {
//         ...availability[day],
//         slots: availability[day].slots.filter((_, i) => i !== index)
//       }
//     };
//     setAvailability(updated);
//     saveAvailability(updated);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="w-[92%] max-w-6xl max-h-[92vh] overflow-y-auto rounded-lg shadow-lg bg-[#FAF6EF] p-6 space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
//             Manage Spa &amp; Salon Availability
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-xl text-gray-600 hover:text-black"
//             aria-label="Close"
//           >
//             ✖
//           </button>
//         </div>

//         <div className="bg-[#F6EEE0] rounded-lg p-4 shadow space-y-6">
//           <h3 className="text-base font-semibold text-gray-800">
//             Set Day-wise Availability
//           </h3>
//           <hr className="border-t border-gray-400" />

//           {/* Header row (labels) — matches your other screen */}
//           <div className="grid grid-cols-12 gap-x-14 font-semibold text-gray-700 text-sm px-1">
//             <span className="col-span-2">Select Availability</span>
//             <span className="col-span-4">Select Time</span>
//             <span className="col-span-2">Max Allowed Person in Slot</span>
//             <span className="col-span-4 text-left pl-12">Set Price (Excluding GST)</span>
//           </div>

//           {/* Rows */}
//           {weekdays.map((day) => (
//             <div key={day} className="space-y-2">
//               {/* Inline editor row */}
//               <div className="grid grid-cols-12 gap-x-14 items-center">
//                 {/* Checkbox + day */}
//                 <label className="flex items-center gap-2 col-span-2">
//                   <input
//                     type="checkbox"
//                     checked={availability[day].checked}
//                     onChange={() => handleToggle(day)}
//                     className="w-4 h-4"
//                   />
//                   <span className="text-gray-700">{day}</span>
//                 </label>

//                 {/* Time From / To (total col-span-4 like your example) */}
//                 <input
//                   type="time"
//                   value={availability[day].from}
//                   onChange={(e) => handleInputChange(day, 'from', e.target.value)}
//                   className="rounded border border-gray-300 px-3 py-1 w-full bg-[#EFE9DF] col-span-2"
//                   placeholder="From"
//                 />
//                 <input
//                   type="time"
//                   value={availability[day].to}
//                   onChange={(e) => handleInputChange(day, 'to', e.target.value)}
//                   className="rounded border border-gray-300 px-3 py-1 w-full bg-[#EFE9DF] col-span-2"
//                   placeholder="To"
//                 />

//                 {/* Max allowed */}
//                 <input
//                   type="number"
//                   inputMode="numeric"
//                   placeholder="e.g. 2"
//                   value={availability[day].maxPersons}
//                   onChange={(e) => handleInputChange(day, 'maxPersons', e.target.value)}
//                   className="no-spinner rounded border border-gray-300 px-3 py-1 w-24 bg-[#EFE9DF] text-center col-span-2"
//                 />

//                 {/* Price + Add button — styled to match */}
//                 <div className="relative col-span-4 flex items-center justify-start pl-12">
//                   <input
//                     type="text"
//                     placeholder="1000/- per hour"
//                     value={availability[day].price}
//                     onChange={(e) => handleInputChange(day, 'price', e.target.value)}
//                     className="rounded border border-gray-300 px-3 py-1 w-[160px] bg-[#EFE9DF] text-center"
//                   />
//                   <div className="mr-20 flex justify-end w-full">
//                     <button
//                       onClick={() => handleAddSlot(day)}
//                       className="ml-auto w-6 h-6 flex items-center justify-center text-white bg-[#A07D3D] hover:bg-[#8c6e35] rounded-sm text-sm"
//                       title="Add slot"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Saved slots list */}
//               {availability[day].slots.map((slot, index) => (
//                 <div key={index} className="grid grid-cols-12 gap-x-14 items-center">
//                   {/* Spacer to align with checkbox column */}
//                   <div className="col-span-2" />

//                   {/* Saved From */}
//                   <input
//                     type="time"
//                     value={slot.from}
//                     disabled
//                     className="rounded border border-gray-300 px-3 py-1 w-full bg-[#EFE9DF] col-span-2"
//                   />

//                   {/* Saved To */}
//                   <input
//                     type="time"
//                     value={slot.to}
//                     disabled
//                     className="rounded border border-gray-300 px-3 py-1 w-full bg-[#EFE9DF] col-span-2"
//                   />

//                   {/* Saved Max */}
//                   <input
//                     type="text"
//                     value={slot.maxPersons || ''}
//                     disabled
//                     className="rounded border border-gray-300 px-3 py-1 w-24 bg-[#EFE9DF] text-center col-span-2"
//                   />

//                   {/* Saved Price + Delete */}
//                   <div className="col-span-4 pl-12 flex items-center gap-3">
//                     <input
//                       type="text"
//                       value={slot.price || ''}
//                       disabled
//                       className="rounded border border-gray-300 px-3 py-1 w-[160px] bg-[#EFE9DF] text-center"
//                     />
//                     <span
//                       onClick={() => handleDeleteSlot(day, index)}
//                       className="text-black text-lg font-medium cursor-pointer"
//                       title="Remove"
//                     >
//                       ✖
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         {/* Footer buttons — match your palette */}
//         <hr className="border-t border-gray-400" />
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 hover:bg-gray-100 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onClose}
//             className="px-6 py-2 bg-[#a67c52] text-white rounded-md hover:bg-[#8a633d] transition"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServiceAvailabilityModal;




// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import apiCall from '@/lib/axios';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const weekdays = [
//   'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
// ];

// type Slot = {
//   from: string;
//   to: string;
//   maxPersons: string;
//   price: string;
//   _id?: string;
// };

// type DayAvailability = {
//   checked: boolean;
//   from: string;
//   to: string;
//   maxPersons: string;
//   price: string;
//   slots: Slot[];
// };

// type ServiceKey = 'spa' | 'salon';

// const initAvailability = (): Record<string, DayAvailability> =>
//   weekdays.reduce((acc, day) => {
//     acc[day] = { checked: false, from: '', to: '', maxPersons: '', price: '', slots: [] };
//     return acc;
//   }, {} as Record<string, DayAvailability>);

// const sanitizeInt = (v: string) => {
//   const n = parseInt(String(v).replace(/[^\d]/g, ''), 10);
//   return Number.isFinite(n) ? n : undefined;
// };
// const sanitizeFloat = (v: string) => {
//   const n = parseFloat(String(v).replace(/[^\d.]/g, ''));
//   return Number.isFinite(n) ? n : undefined;
// };

// function mapSchedulesIntoAvailability(schedules: any[]): Record<string, DayAvailability> {
//   const updated = initAvailability();
//   schedules?.forEach((entry: any) => {
//     const day = entry?.day;
//     if (!day || !updated[day]) return;
//     updated[day].checked = true;
//     updated[day].slots.push({
//       from: entry.startTime || '',
//       to: entry.endTime || '',
//       maxPersons:
//         entry.maxCapacity !== undefined && entry.maxCapacity !== null
//           ? String(entry.maxCapacity)
//           : '',
//       price:
//         entry.price !== undefined && entry.price !== null ? String(entry.price) : '',
//       _id: entry._id
//     });
//   });
//   return updated;
// }

// function availabilityToSchedulesPayload(a: Record<string, DayAvailability>) {
//   return Object.entries(a).flatMap(([day, val]) =>
//     val.checked
//       ? val.slots
//         .filter((s) => s.from && s.to)
//         .map((s) => {
//           const out: any = { day, startTime: s.from, endTime: s.to };
//           const maxCapacity = sanitizeInt(s.maxPersons);
//           const price = sanitizeFloat(s.price);
//           if (maxCapacity !== undefined) out.maxCapacity = maxCapacity;
//           if (price !== undefined) out.price = price;
//           if (s._id) out._id = s._id;
//           return out;
//         })
//       : []
//   );
// }

// /** -------- Reusable Section (buttons at bottom) -------- */
// type SectionProps = {
//   title: string;
//   service: ServiceKey;
//   availability: Record<string, DayAvailability>;
//   setAvailability: React.Dispatch<React.SetStateAction<Record<string, DayAvailability>>>;
//   lastFetched: Record<string, DayAvailability>;
//   setLastFetched: React.Dispatch<React.SetStateAction<Record<string, DayAvailability>>>;
// };

// const AvailabilitySection: React.FC<SectionProps> = ({
//   title,
//   service,
//   availability,
//   setAvailability,
//   lastFetched,
//   setLastFetched
// }) => {
//   const labelRow = useMemo(
//     () => (
//       <div className="grid grid-cols-12 gap-x-8 font-semibold text-gray-700 text-sm px-1">
//         <span className="col-span-2">Select Availability</span>
//         <span className="col-span-4">Select Time</span>
//         <span className="col-span-2">Max Allowed Person in Slot</span>
//         <span className="col-span-4 text-left pl-4">Set Price (Excluding GST)</span>
//       </div>
//     ),
//     []
//   );

//   const fetchForService = async () => {
//     try {
//       const res = await apiCall('GET', `api/hotel/service-availability/${service}`);
//       const schedules = res?.data?.schedules || [];
//       const mapped = mapSchedulesIntoAvailability(schedules);
//       setAvailability(mapped);
//       setLastFetched(mapped);
//     } catch (e) {
//       console.error(`Failed to fetch ${service} availability`, e);
//       const empty = initAvailability();
//       setAvailability(empty);
//       setLastFetched(empty);
//     }
//   };

//   useEffect(() => {
//     fetchForService();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const saveCurrentService = async () => {
//     const schedules = availabilityToSchedulesPayload(availability);
//     const payload = {
//       serviceAvailability: [{ service, isActive: schedules.length > 0, schedules }]
//     };
//     try {
//       await apiCall('PUT', 'api/hotel/service-availability', payload);
//       setLastFetched(availability);
//       console.log(`${service} availability saved ✅`);
//     } catch (err: any) {
//       if (err?.response) {
//         console.error('API Error:', err.response.status, err.response.data);
//       } else if (err?.message) {
//         console.error('Error message:', err.message);
//       } else {
//         console.error('Unknown error:', err);
//       }
//     }
//   };

//   const cancelCurrentService = () => {
//     setAvailability(structuredClone(lastFetched));
//   };

//   const handleToggle = (day: string) => {
//     setAvailability((prev) => ({
//       ...prev,
//       [day]: { ...prev[day], checked: !prev[day].checked }
//     }));
//   };

//   const handleInputChange = (
//     day: string,
//     field: 'from' | 'to' | 'maxPersons' | 'price',
//     value: string
//   ) => {
//     setAvailability((prev) => ({
//       ...prev,
//       [day]: { ...prev[day], [field]: value }
//     }));
//   };

//   const handleAddSlot = (day: string) => {
//     const d = availability[day];
//     if (!d) return;
//     const { from, to, maxPersons, price } = d;
//     if (from && to) {
//       setAvailability((prev) => ({
//         ...prev,
//         [day]: {
//           ...prev[day],
//           slots: [...prev[day].slots, { from, to, maxPersons: maxPersons || '', price: price || '' }],
//           from: '',
//           to: '',
//           maxPersons: '',
//           price: ''
//         }
//       }));
//     }
//   };

//   const handleDeleteSlot = (day: string, index: number) => {
//     setAvailability((prev) => ({
//       ...prev,
//       [day]: { ...prev[day], slots: prev[day].slots.filter((_, i) => i !== index) }
//     }));
//   };

//   return (
//     <div className="bg-[#F6EEE0] rounded-lg p-5 shadow space-y-5">
//       {/* Title only on top */}
//       <div className="flex items-center justify-between">
//         <h3 className="text-base font-semibold text-gray-800">{title}</h3>
//       </div>

//       <hr className="border-t border-gray-400" />
//       {labelRow}

//       {/* Rows */}
//       {weekdays.map((day) => (
//         <div key={`${service}-${day}`} className="space-y-2">
//           <div className="grid grid-cols-12 gap-x-8 items-center">
//             <label className="flex items-center gap-2 col-span-2">
//               <input
//                 type="checkbox"
//                 checked={availability[day]?.checked || false}
//                 onChange={() => handleToggle(day)}
//                 className="w-4 h-4"
//               />
//               <span className="text-gray-700">{day}</span>
//             </label>

//             <input
//               type="time"
//               value={availability[day]?.from || ''}
//               onChange={(e) => handleInputChange(day, 'from', e.target.value)}
//               className="rounded border border-gray-300 px-3 py-1 w-full bg-[#EFE9DF] col-span-2"
//               placeholder="From"
//             />
//             <input
//               type="time"
//               value={availability[day]?.to || ''}
//               onChange={(e) => handleInputChange(day, 'to', e.target.value)}
//               className="rounded border border-gray-300 px-3 py-1 w-full bg-[#EFE9DF] col-span-2"
//               placeholder="To"
//             />

//             <input
//               type="number"
//               inputMode="numeric"
//               placeholder="e.g. 2"
//               value={availability[day]?.maxPersons || ''}
//               onChange={(e) => handleInputChange(day, 'maxPersons', e.target.value)}
//               className="no-spinner rounded border border-gray-300 px-3 py-1 w-24 bg-[#EFE9DF] text-center col-span-2"
//             />

//             <div className="relative flex items-center justify-start pl-4">
//               <input
//                 type="text"
//                 placeholder="1000/- per hour"
//                 value={availability[day]?.price || ''}
//                 onChange={(e) => handleInputChange(day, 'price', e.target.value)}
//                 className="rounded border border-gray-300 px-3 py-1 w-[160px] bg-[#EFE9DF] text-center"
//               />
//               <div className="ml-3 flex justify-end w-full">
//                 <button
//                   onClick={() => handleAddSlot(day)}
//                   className="ml-auto w-6 h-6 flex items-center justify-center text-white bg-[#A07D3D] hover:bg-[#8c6e35] rounded-sm text-sm"
//                   title="Add slot"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//           </div>

//           {(availability[day]?.slots || []).map((slot, index) => (
//             <div key={`${service}-${day}-${index}`} className="grid grid-cols-12 gap-x-8 items-center">
//               <div className="col-span-2" />
//               <input
//                 type="time"
//                 value={slot.from}
//                 disabled
//                 className="rounded border border-gray-300 px-3 py-1 w-full bg-[#EFE9DF] col-span-2"
//               />
//               <input
//                 type="time"
//                 value={slot.to}
//                 disabled
//                 className="rounded border border-gray-300 px-3 py-1 w-full bg-[#EFE9DF] col-span-2"
//               />
//               <input
//                 type="text"
//                 value={slot.maxPersons || ''}
//                 disabled
//                 className="rounded border border-gray-300 px-3 py-1 w-24 bg-[#EFE9DF] text-center col-span-2"
//               />
//               <div className="col-span-4 pl-4 flex items-center gap-3">
//                 <input
//                   type="text"
//                   value={slot.price || ''}
//                   disabled
//                   className="rounded border border-gray-300 px-3 py-1 w-[160px] bg-[#EFE9DF] text-center"
//                 />
//                 <span
//                   onClick={() => handleDeleteSlot(day, index)}
//                   className="text-black text-lg font-medium cursor-pointer"
//                   title="Remove"
//                 >
//                   ✖
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       ))}

//       {/* FOOTER BUTTONS AT BOTTOM (niche) */}
//       <hr className="border-t border-gray-300 mt-4" />
//       <div className="flex justify-end gap-3">
//         <button
//           onClick={cancelCurrentService}
//           className="px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 hover:bg-gray-100 transition"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={saveCurrentService}
//           className="px-6 py-2 bg-[#a67c52] text-white rounded-md hover:bg-[#8a633d] transition"
//         >
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// /** -------- Modal with two independent sections -------- */
// const ServiceAvailabilityModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
//   const [spaAvailability, setSpaAvailability] = useState<Record<string, DayAvailability>>(initAvailability);
//   const [spaFetched, setSpaFetched] = useState<Record<string, DayAvailability>>(initAvailability);

//   const [salonAvailability, setSalonAvailability] = useState<Record<string, DayAvailability>>(initAvailability);
//   const [salonFetched, setSalonFetched] = useState<Record<string, DayAvailability>>(initAvailability);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="w-[92%] max-w-6xl max-h-[92vh] overflow-y-auto rounded-lg shadow-lg bg-[#FAF6EF] p-6 space-y-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
//             Manage Spa &amp; Salon Availability
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-xl text-gray-600 hover:text-black"
//             aria-label="Close"
//           >
//             ✖
//           </button>
//         </div>

//         {/* SPA */}
//         <AvailabilitySection
//           title="Manage Spa Availability"
//           service="spa"
//           availability={spaAvailability}
//           setAvailability={setSpaAvailability}
//           lastFetched={spaFetched}
//           setLastFetched={setSpaFetched}
//         />

//         {/* SALON */}
//         <AvailabilitySection
//           title="Manage Salon Availability"
//           service="salon"
//           availability={salonAvailability}
//           setAvailability={setSalonAvailability}
//           lastFetched={salonFetched}
//           setLastFetched={setSalonFetched}
//         />
//       </div>
//     </div>
//   );
// };

// export default ServiceAvailabilityModal;
