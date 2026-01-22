'use client';

import React, { useEffect, useMemo, useState } from 'react';
import apiCall from '@/lib/axios';
import { X } from 'lucide-react';
import type { SweetAlertIcon } from 'sweetalert2';
import { ToastAtTopRight } from '@/lib/sweetalert';


const showToast = (icon: SweetAlertIcon, title: string, ms = 2200) =>
  ToastAtTopRight.fire({
    icon,
    title,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: ms,
    timerProgressBar: true,
  });


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId?: string; 
}

const weekdays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
] as const;
type Weekday = typeof weekdays[number];

type DayInputs = {
  checked: boolean;
  from: string;
  to: string;
  maxPersons: string;
  price: string;
};

type ExistingSlotRow = {
  _id: string;
  dayOfWeek: Weekday | string;
  startTime: string;
  endTime: string;
  price: number;
  maxCapacity: number;
  isEditing?: boolean;
};


const emptyWeek = (): Record<Weekday, DayInputs> =>
  weekdays.reduce((acc, day) => {
    acc[day] = { checked: false, from: '', to: '', maxPersons: '', price: '' };
    return acc;
  }, {} as Record<Weekday, DayInputs>);

const emptyGroups = (): Record<Weekday, ExistingSlotRow[]> =>
  weekdays.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {} as Record<Weekday, ExistingSlotRow[]>);


const normalizeDay = (d: string): Weekday | null => {
  const s = (d || '').toLowerCase();
  if (s.startsWith('mon')) return 'Monday';
  if (s.startsWith('tue')) return 'Tuesday';
  if (s.startsWith('wed')) return 'Wednesday';
  if (s.startsWith('thu')) return 'Thursday';
  if (s.startsWith('fri')) return 'Friday';
  if (s.startsWith('sat')) return 'Saturday';
  if (s.startsWith('sun')) return 'Sunday';
  return null;
};


const ManageSlotsModal: React.FC<ModalProps> = ({ isOpen, onClose, hotelId }) => {
  const [loading, setLoading] = useState(false);

  const [dayInputs, setDayInputs] = useState<Record<Weekday, DayInputs>>(emptyWeek());
  const [existingSlots, setExistingSlots] = useState<ExistingSlotRow[]>([]);
  const [addingForDay, setAddingForDay] = useState<Weekday | null>(null);
  const [updatingSlotId, setUpdatingSlotId] = useState<string | null>(null);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);

  
  const groupedExisting = useMemo(() => {
    const g = emptyGroups();
    existingSlots.forEach((s) => {
      const d = normalizeDay(String(s.dayOfWeek));
      if (d) g[d].push(s);
    });
    return g;
  }, [existingSlots]);

  
  const refetchSlots = async () => {
    try {
      const endpoint = hotelId
        ? `api/services/spa-salon-slots?hotelId=${hotelId}`
        : `api/services/spa-salon-slots`;

      const res = await apiCall('GET', endpoint);

      
      const arr: any[] = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res as any)
            ? (res as any)
            : [];

      const parsed: ExistingSlotRow[] = arr
        .filter(Boolean)
        .map((s: any) => ({
          _id: s?._id,
          dayOfWeek:
            normalizeDay(String(s?.dayOfWeek || s?.day)) ??
            (s?.dayOfWeek || s?.day || ''),
          startTime: s?.startTime || '',
          endTime: s?.endTime || '',
          price: Number(s?.price || 0),
          maxCapacity: Number(s?.maxCapacity || 0),
        }))
        .filter((s) => !!s._id);

      setExistingSlots(parsed);

      
      const next = emptyWeek();
      parsed.forEach((s) => {
        const n = normalizeDay(String(s.dayOfWeek));
        if (n) next[n].checked = true;
      });
      setDayInputs(next);
    } catch {
      setExistingSlots([]);
      setDayInputs(emptyWeek());
      showToast('error', 'Failed to refresh slots.');
    }
  };

  
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      await refetchSlots();
      setLoading(false);
    })();
    
  }, [isOpen, hotelId]);

  
  const handleDayToggle = (day: Weekday) => {
    setDayInputs((prev) => ({
      ...prev,
      [day]: { ...prev[day], checked: !prev[day].checked },
    }));
  };

  const handleInputChange = (
    day: Weekday,
    field: 'from' | 'to' | 'maxPersons' | 'price',
    value: string
  ) => {
    setDayInputs((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleAddSlotNow = async (day: Weekday) => {
    const { from, to, maxPersons, price } = dayInputs[day];
    
    if (!from || !to || !maxPersons) {
      return showToast('warning', 'Please fill From, To, and  Max Allowed.');
    }

    
    const slot = {
      dayOfWeek: day,
      startTime: from,                    
      endTime: to,                        
      
      maxCapacity: parseInt(maxPersons.replace(/[^\d]/g, ''), 10) || 0,
      ...(hotelId ? { HotelId: hotelId } : {}),
    };

    
    const body: any = {
      slots: [slot],
      ...(hotelId ? { HotelId: hotelId } : {}), 
    };

    setAddingForDay(day);
    try {
      await apiCall('POST', 'api/services/spa-salon-slots/add', body);

      
      await refetchSlots();

      
      setDayInputs((prev) => ({
        ...prev,
        [day]: { checked: true, from: '', to: '', maxPersons: '', price: '' },
      }));

      showToast('success', `Slot added to ${day}.`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to add slot.';
      showToast('error', msg);
    } finally {
      setAddingForDay(null);
    }
  };


  const toggleEditSlot = (id: string, on: boolean) => {
    setExistingSlots((prev) =>
      prev.map((s) => (s._id === id ? { ...s, isEditing: on } : s))
    );
  };

  const updateEditableSlot = (
    id: string,
    field: 'dayOfWeek' | 'startTime' | 'endTime' | 'price' | 'maxCapacity',
    value: string
  ) => {
    setExistingSlots((prev) =>
      prev.map((s) => {
        if (s._id !== id) return s;
        if (field === 'dayOfWeek') {
          const nd = normalizeDay(value) ?? value;
          return { ...s, dayOfWeek: nd as any };
        }
        
        
        
        if (field === 'maxCapacity') {
          return {
            ...s,
            maxCapacity: parseInt(value.replace(/[^\d]/g, ''), 10) || 0,
          };
        }
        return { ...s, [field]: value };
      })
    );
  };

  const handleUpdateSlot = async (slot: ExistingSlotRow) => {
    setUpdatingSlotId(slot._id);
    try {
      const payload: any = {
        dayOfWeek: String(slot.dayOfWeek),
        startTime: slot.startTime,
        endTime: slot.endTime,
        
        maxCapacity: slot.maxCapacity,
      };
      if (hotelId) payload.HotelId = hotelId;

      await apiCall('PUT', `api/services/spa-salon-slots/${slot._id}`, payload);
      toggleEditSlot(slot._id, false);
      showToast('success', 'Slot updated successfully!');
    } catch {
      showToast('error', 'Failed to update slot.');
    } finally {
      setUpdatingSlotId(null);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    setDeletingSlotId(id);
    try {
      await apiCall('DELETE', `api/services/spa-salon-slots/${id}`);
      setExistingSlots((prev) => prev.filter((s) => s._id !== id));
      showToast('success', 'Slot deleted successfully!');
    } catch {
      showToast('error', 'Failed to delete slot.');
    } finally {
      setDeletingSlotId(null);
    }
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[92%] max-w-6xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Manage Slots — Spa/Salon</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-600">Loading…</div>
        ) : (
          <>
            {}
            <div className="grid grid-cols-12 font-semibold text-gray-700 text-sm px-1 mb-2 gap-x-4">
              <span className="col-span-2">Select Availability</span>
              <span className="col-span-4">Select Time</span>
              <span className="col-span-2">Max Allowed</span>
              {}
            </div>

            {}
            <div className="space-y-4">
              {weekdays.map((day) => (
                <div key={day} className="grid grid-cols-12 gap-x-4 items-start">
                  {}
                  <label className="flex items-center gap-2 col-span-2">
                    <input
                      type="checkbox"
                      checked={dayInputs[day].checked}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">{day}</span>
                  </label>

                  {}
                  <input
                    type="time"
                    value={dayInputs[day].from}
                    onChange={(e) => handleInputChange(day, 'from', e.target.value)}
                    className="rounded border border-gray-300 px-3 py-1 bg-[#EFE9DF] col-span-2"
                  />

                  {}
                  <div className="col-span-2">
                    <input
                      type="time"
                      value={dayInputs[day].to}
                      onChange={(e) => handleInputChange(day, 'to', e.target.value)}
                      className="rounded border border-gray-300 px-3 py-1 w-full bg-[#EFE9DF]"
                    />
                  </div>

                  {}
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={dayInputs[day].maxPersons}
                    onChange={(e) => handleInputChange(day, 'maxPersons', e.target.value)}
                    className="rounded border border-gray-300 px-3 py-1 bg-[#EFE9DF] text-center col-span-2"
                  />

                  {}
                  <div className="col-span-4 flex items-center gap-3">
                    {}
                    <button
                      onClick={() => handleAddSlotNow(day)}
                      disabled={addingForDay === day}
                      className="w-6 h-6 flex items-center justify-center text-white bg-[#A07D3D] hover:bg-[#8c6e35] rounded-sm text-sm disabled:opacity-60"
                      title="Add slot"
                    >
                      {addingForDay === day ? '…' : '+'}
                    </button>
                  </div>

                  {}
                  {groupedExisting[day].length > 0 && (
                    <div className="col-span-12 mt-3 space-y-2">
                      {groupedExisting[day].map((s) => (
                        <div key={s._id} className="grid grid-cols-12 gap-3 items-center border rounded p-3">
                          {}
                          <div className="col-span-2">
                            {s.isEditing ? (
                              <select
                                value={String(s.dayOfWeek)}
                                onChange={(e) => updateEditableSlot(s._id, 'dayOfWeek', e.target.value)}
                                className="w-full border rounded px-2 py-1 bg-[#EFE9DF]"
                              >
                                {weekdays.map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-gray-800">{String(s.dayOfWeek)}</span>
                            )}
                          </div>

                          {}
                          <div className="col-span-2">
                            {s.isEditing ? (
                              <input
                                type="time"
                                value={s.startTime}
                                onChange={(e) => updateEditableSlot(s._id, 'startTime', e.target.value)}
                                className="w-full border rounded px-2 py-1 bg-[#EFE9DF]"
                              />
                            ) : (
                              <span>{s.startTime}</span>
                            )}
                          </div>

                          {}
                          <div className="col-span-2">
                            {s.isEditing ? (
                              <input
                                type="time"
                                value={s.endTime}
                                onChange={(e) => updateEditableSlot(s._id, 'endTime', e.target.value)}
                                className="w-full border rounded px-2 py-1 bg-[#EFE9DF]"
                              />
                            ) : (
                              <span>{s.endTime}</span>
                            )}
                          </div>

                          {}
                          <div className="col-span-2">
                            {s.isEditing ? (
                              <input
                                type="number"
                                value={String(s.maxCapacity)}
                                onChange={(e) => updateEditableSlot(s._id, 'maxCapacity', e.target.value)}
                                className="w-full border rounded px-2 py-1 bg-[#EFE9DF]"
                              />
                            ) : (
                              <span>{s.maxCapacity}</span>
                            )}
                          </div>

                          {}
                          {}

                          {}
                          <div className="col-span-2 flex gap-2 justify-end">
                            {s.isEditing ? (
                              <button
                                className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                                onClick={() => handleUpdateSlot(s)}
                                disabled={updatingSlotId === s._id}
                              >
                                {updatingSlotId === s._id ? 'Saving…' : 'Save'}
                              </button>
                            ) : (
                              <button
                                className="px-3 py-1 rounded bg-[#8c6e35] text-white hover:bg-blue-700"
                                onClick={() => toggleEditSlot(s._id, true)}
                              >
                                Edit
                              </button>
                            )}
                            <button
                              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                              onClick={() => handleDeleteSlot(s._id)}
                              disabled={deletingSlotId === s._id}
                            >
                              {deletingSlotId === s._id ? 'Deleting…' : 'Delete'}
                            </button>
                            {s.isEditing && (
                              <button
                                className="px-3 py-1 rounded border"
                                onClick={() => toggleEditSlot(s._id, false)}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {}
            <div className="flex justify-end gap-3 mt-10">
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageSlotsModal;
