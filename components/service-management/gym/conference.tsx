































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Camera, X } from 'lucide-react';
import apiCall from '@/lib/axios';
import type { SweetAlertIcon } from 'sweetalert2';
import { ToastAtTopRight } from '@/lib/sweetalert'; 


const notify = (icon: SweetAlertIcon, title: string, ms = 2200) =>
  ToastAtTopRight.fire({
    icon,
    title,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: ms,
    timerProgressBar: true
  });


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
const DEFAULT_CONFERENCE_NAME = 'Conference Hall';

type HallSlotRow = {
  _id: string;
  dayOfWeek: Weekday | string;
  startTime: string;
  endTime: string;
  price: number;
  maxCapacity: number;
  isEditing?: boolean;
};

type DayInputs = {
  checked: boolean;
  from: string;
  to: string;
  maxPersons: string;
  price: string;
};

const emptyWeek = (): Record<Weekday, DayInputs> =>
  weekdays.reduce(
    (acc, day) => {
      acc[day] = {
        checked: false,
        from: '',
        to: '',
        maxPersons: '',
        price: ''
      };
      return acc;
    },
    {} as Record<Weekday, DayInputs>
  );

const emptyGroups = (): Record<Weekday, HallSlotRow[]> =>
  weekdays.reduce(
    (acc, d) => {
      acc[d] = [];
      return acc;
    },
    {} as Record<Weekday, HallSlotRow[]>
  );

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

const scrubForUpdate = (doc: any) => {
  if (!doc || typeof doc !== 'object') return {};
  const { _id, id, createdAt, updatedAt, __v, ...rest } = doc;
  return rest;
};

const extractErr = (err: any) => ({
  status: err?.response?.status,
  data: err?.response?.data
});


const unwrap = (res: any) => res?.data?.data ?? res?.data ?? res;


const ConferenceFacilityManager: React.FC = () => {
  const [loading, setLoading] = useState(false);

  
  const [facilityId, setFacilityId] = useState<string | null>(null);
  const [facilityDoc, setFacilityDoc] = useState<any>(null);

  
  const [images, setImages] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [savingImages, setSavingImages] = useState(false);
  const [uploading, setUploading] = useState(false);

  
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  
  const [dayInputs, setDayInputs] =
    useState<Record<Weekday, DayInputs>>(emptyWeek());
  const [addingForDay, setAddingForDay] = useState<Weekday | null>(null);

  
  const [existingSlots, setExistingSlots] = useState<HallSlotRow[]>([]);
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

  
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiCall('GET', 'api/services/facility/items');
        const facilities: any[] = unwrap(res) || [];

        const hall = facilities.find(
          (f) => f?.facilityType === 'ConferenceHall'
        );
        if (!hall) {
          notify('info', 'Conference Hall not found. Create one first?');
          setFacilityId(null);
          setFacilityDoc(null);
          setImages([]);
          setExistingSlots([]);
          setPreview(null);
          setDayInputs(emptyWeek());
          return;
        }

        setFacilityId(hall._id || null);
        setFacilityDoc(hall);

        
        const imgs = Array.isArray(hall.images)
          ? hall.images.filter(Boolean)
          : [];
        setImages(imgs);
        setPreview(imgs[0] ?? null);

        
        const flat: HallSlotRow[] = [];

        const slotsByDay = hall.slotsByDay;
        if (slotsByDay && typeof slotsByDay === 'object') {
          weekdays.forEach((d) => {
            const arr: any[] = Array.isArray(slotsByDay[d])
              ? slotsByDay[d]
              : [];
            arr.forEach((s) => {
              flat.push({
                _id: s._id,
                dayOfWeek: d,
                startTime: s.startTime,
                endTime: s.endTime,
                price: Number(s.price || 0),
                maxCapacity: Number(s.maxCapacity || 0)
              });
            });
          });
        } else if (Array.isArray(hall.slots)) {
          hall.slots.forEach((s: any) => {
            const d = normalizeDay(String(s.dayOfWeek)) || String(s.dayOfWeek);
            flat.push({
              _id: s._id,
              dayOfWeek: d as any,
              startTime: s.startTime,
              endTime: s.endTime,
              price: Number(s.price || 0),
              maxCapacity: Number(s.maxCapacity || 0)
            });
          });
        }

        setExistingSlots(flat);

        
        const pre = emptyWeek();
        flat.forEach((s) => {
          const d = normalizeDay(String(s.dayOfWeek));
          if (d) pre[d].checked = true;
        });
        setDayInputs(pre);
      } catch (e) {
        const info = extractErr(e);
        console.warn('Load ConferenceHall failed', info);
        notify('error', 'Failed to load Conference Hall.');
        setFacilityId(null);
        setFacilityDoc(null);
        setImages([]);
        setExistingSlots([]);
        setPreview(null);
        setDayInputs(emptyWeek());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  
  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file); 
    const res = await apiCall('POST', 'api/upload/admin', fd);
    const body = unwrap(res);
    const url = body?.data?.url || body?.url || '';
    if (!url) throw new Error('No URL returned from upload');
    return url;
  };

  const uploadMany = async (files: FileList): Promise<string[]> => {
    const arr = Array.from(files);
    setUploading(true);
    try {
      const results = await Promise.allSettled(arr.map(uploadFile));
      const success: string[] = [];
      let failed = 0;

      results.forEach((r) => {
        if (r.status === 'fulfilled') success.push(r.value);
        else failed++;
      });

      if (success.length)
        notify(
          'success',
          `${success.length} image${success.length > 1 ? 's' : ''} uploaded`
        );
      if (failed)
        notify('error', `${failed} upload${failed > 1 ? 's' : ''} failed`);
      return success;
    } finally {
      setUploading(false);
    }
  };

  
  const addImage = () => {
    if (uploading) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = async (e: any) => {
      const files: FileList | undefined = e?.target?.files;
      if (!files?.length) return;

      try {
        const urls = await uploadMany(files);
        if (!urls.length) return;
        setImages((prev) => {
          const next = [...prev, ...urls];
          if (!preview && next.length) setPreview(next[0]);
          return next;
        });
      } catch {
        notify('error', 'Upload failed');
      } finally {
        input.value = '';
      }
    };

    input.click();
  };

  const replaceImage = (index: number) => {
    if (uploading) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e: any) => {
      const file: File | undefined = e?.target?.files?.[0];
      if (!file) return;
      try {
        setUploading(true);
        const url = await uploadFile(file);
        setImages((prev) => {
          const next = [...prev];
          const wasPreview = preview === prev[index];
          next[index] = url;
          if (wasPreview) setPreview(url);
          return next;
        });
        notify('success', 'Image replaced');
      } catch {
        notify('error', 'Replace failed');
      } finally {
        setUploading(false);
        input.value = '';
      }
    };

    input.click();
  };

  const removeImage = (i: number) => {
    setImages((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      if (preview && prev[i] === preview) setPreview(next[0] ?? null);
      return next;
    });
    notify('info', 'Image removed');
  };

  const saveImages = async () => {
    const imgs = images.filter(Boolean);

    
    const id = facilityId ?? (await ensureConference({ images: imgs }));

    const base = scrubForUpdate(facilityDoc || {});
    const payload = {
      ...base,
      name: base.name ?? facilityDoc?.name ?? DEFAULT_CONFERENCE_NAME, 
      facilityType: base.facilityType ?? 'ConferenceHall',
      images: imgs
    };

    setSavingImages(true);
    try {
      const res = await apiCall(
        'PUT',
        `api/services/facility/update-facility/${id}`,
        payload
      );
      const updated = unwrap(res);
      if (updated?.images) {
        const nextImgs = (updated.images as string[]).filter(Boolean);
        setImages(nextImgs);
        setPreview((p) => nextImgs[0] ?? p ?? null);
      }
      if (updated) setFacilityDoc(updated);
      notify('success', 'Images saved');
    } catch (e) {
      console.warn('saveImages PUT failed', extractErr(e), payload);
      notify('error', 'Failed to save images');
    } finally {
      setSavingImages(false);
    }
  };

  
  const handleDayToggle = (day: Weekday) => {
    setDayInputs((p) => ({
      ...p,
      [day]: { ...p[day], checked: !p[day].checked }
    }));
  };

  const handleInputChange = (
    day: Weekday,
    field: 'from' | 'to' | 'maxPersons' | 'price',
    value: string
  ) => {
    setDayInputs((p) => ({ ...p, [day]: { ...p[day], [field]: value } }));
  };

  const handleAddSlotNow = async (day: Weekday) => {
    const { from, to, maxPersons, price } = dayInputs[day];
    if (!from || !to || !maxPersons || !price) {
      notify('warning', 'Please fill From, To, Max Allowed, and Price.');
      return;
    }

    const newSlot = {
      startTime: from,
      endTime: to,
      price: parseFloat(price.replace(/[^\d.]/g, '')),
      maxCapacity: parseInt(maxPersons.replace(/[^\d]/g, ''), 10),
      dayOfWeek: day
    };

    setAddingForDay(day);
    try {
      
      const id = facilityId ?? (await ensureConference());

      const base = scrubForUpdate(facilityDoc || {});
      const payload = {
        ...base,
        name: base.name ?? facilityDoc?.name ?? DEFAULT_CONFERENCE_NAME,
        facilityType: base.facilityType ?? 'ConferenceHall',
        slots: [newSlot]
      };

      const res = await apiCall(
        'PUT',
        `api/services/facility/items/${id}`,
        payload
      );
      const body = unwrap(res);
      const updated = body?.data ?? body;

      if (updated) {
        setFacilityDoc(updated);
        if (Array.isArray(updated.slots)) {
          const flatFromServer = updated.slots.map((s: any) => ({
            _id: s._id,
            dayOfWeek: normalizeDay(String(s.dayOfWeek)) || String(s.dayOfWeek),
            startTime: s.startTime,
            endTime: s.endTime,
            price: Number(s.price || 0),
            maxCapacity: Number(s.maxCapacity || 0)
          })) as HallSlotRow[];
          setExistingSlots(flatFromServer);

          const pre = emptyWeek();
          flatFromServer.forEach((s) => {
            const d = normalizeDay(String(s.dayOfWeek));
            if (d) pre[d].checked = true;
          });
          setDayInputs(pre);
        }
      }

      notify('success', `Slot added to ${day}`);
    } catch (e) {
      console.warn('Add slot PUT failed', extractErr(e));
      notify('error', 'Failed to add slot');
    } finally {
      setAddingForDay(null);
    }
  };

  
  const toggleEditSlot = (id: string, on: boolean) => {
    setExistingSlots((prev) =>
      prev.map((s) => (s._id === id ? { ...s, isEditing: on } : s))
    );
    if (on) notify('info', 'Edit mode enabled');
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
        if (field === 'price')
          return { ...s, price: parseFloat(value.replace(/[^\d.]/g, '')) || 0 };
        if (field === 'maxCapacity')
          return {
            ...s,
            maxCapacity: parseInt(value.replace(/[^\d]/g, ''), 10) || 0
          };
        return { ...s, [field]: value as any };
      })
    );
  };

  const handleSaveSlot = async (slot: HallSlotRow) => {
    if (!facilityId) {
      notify('warning', 'Conference Hall ID missing');
      return;
    }
    setUpdatingSlotId(slot._id);
    try {
      const base = scrubForUpdate(facilityDoc || {});
      const payload = {
        ...base,
        facilityType: base.facilityType ?? 'ConferenceHall',
        slots: [
          {
            _id: slot._id,
            dayOfWeek: String(slot.dayOfWeek),
            startTime: slot.startTime,
            endTime: slot.endTime,
            price: slot.price,
            maxCapacity: slot.maxCapacity
          }
        ]
      };

      const res = await apiCall(
        'PUT',
        `api/services/facility/items/${facilityId}`,
        payload
      );
      const body = unwrap(res);
      const updated = body?.data ?? body;
      if (updated) {
        setFacilityDoc(updated);
        if (Array.isArray(updated.slots)) {
          const flatFromServer: HallSlotRow[] = updated.slots.map((s: any) => ({
            _id: s._id,
            dayOfWeek: normalizeDay(String(s.dayOfWeek)) || String(s.dayOfWeek),
            startTime: s.startTime,
            endTime: s.endTime,
            price: Number(s.price || 0),
            maxCapacity: Number(s.maxCapacity || 0)
          })) as any;
          setExistingSlots(flatFromServer);
        }
      }

      toggleEditSlot(slot._id, false);
      notify('success', 'Slot updated');
    } catch (e) {
      const info = extractErr(e);
      console.warn('Save slot PUT failed', info);
      notify('error', 'Failed to update slot');
    } finally {
      setUpdatingSlotId(null);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!facilityId) {
      notify('warning', 'Conference Hall ID missing');
      return;
    }
    setDeletingSlotId(slotId);
    try {
      const res = await apiCall(
        'DELETE',
        `api/services/facility/items/${facilityId}/${slotId}`
      );
      const body = unwrap(res);
      const updated = body?.data ?? body;

      if (updated && Array.isArray(updated.slots)) {
        setFacilityDoc(updated);
        const flatFromServer: HallSlotRow[] = updated.slots.map((s: any) => ({
          _id: s._id,
          dayOfWeek: normalizeDay(String(s.dayOfWeek)) || String(s.dayOfWeek),
          startTime: s.startTime,
          endTime: s.endTime,
          price: Number(s.price || 0),
          maxCapacity: Number(s.maxCapacity || 0)
        })) as any;
        setExistingSlots(flatFromServer);
      } else {
        setExistingSlots((prev) => prev.filter((s) => s._id !== slotId));
      }

      notify('success', 'Slot deleted');
    } catch (e) {
      const info = extractErr(e);
      console.warn('Delete slot failed', info);
      notify('error', 'Failed to delete slot');
    } finally {
      setDeletingSlotId(null);
    }
  };

  const ensureConference = async (
    initial?: Record<string, any>
  ): Promise<string> => {
    if (facilityId) return facilityId;

    const payload = {
      name: initial?.name || facilityDoc?.name || DEFAULT_CONFERENCE_NAME, 
      facilityType: 'ConferenceHall',
      images: [] as string[],
      slots: [] as any[],
      ...(initial || {})
    };

    try {
      const res = await apiCall('POST', 'api/services/facility/items', payload);
      const created = unwrap(res);
      const doc = created?.data ?? created;
      const id = doc?._id;
      if (!id) throw new Error('No _id in create response');

      setFacilityId(id);
      setFacilityDoc(doc);

      const imgs: string[] = Array.isArray(doc.images)
        ? doc.images.filter(Boolean)
        : [];
      setImages(imgs);
      setPreview(imgs[0] ?? null);

      const flat = Array.isArray(doc.slots)
        ? doc.slots.map((s: any) => ({
            _id: s._id,
            dayOfWeek: normalizeDay(String(s.dayOfWeek)) || String(s.dayOfWeek),
            startTime: s.startTime,
            endTime: s.endTime,
            price: Number(s.price || 0),
            maxCapacity: Number(s.maxCapacity || 0)
          }))
        : [];
      setExistingSlots(flat);

      notify('success', 'Conference Hall created');
      return id;
    } catch (e) {
      console.warn('Create ConferenceHall failed', extractErr(e));
      notify('error', 'Could not create Conference Hall');
      throw e;
    }
  };

  
  return (
    <div className="p-4 sm:p-6 rounded-lg shadow-md bg-[#FAF6EF] w-full mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Conference Hall</h2>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-600">Loading…</div>
      ) : (
        <>
          {}
          <h3 className="text-base font-semibold mb-3">Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {}
            <div>
              <h4 className="text-sm font-semibold mb-2">Preview</h4>
              <div
                className="relative h-44 w-full max-w-[260px] rounded-lg bg-[#F6EEE0] overflow-hidden cursor-pointer"
                onClick={() => {
                  if (preview) {
                    setModalImage(preview);
                    setShowPreviewModal(true);
                  }
                }}
                title={preview ? 'Click to open preview' : undefined}
              >
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="w-10 h-10 text-black/30" />
                  </div>
                )}
              </div>
            </div>

            {}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold mb-2">Gallery</h4>
                <button
                  onClick={addImage}
                  disabled={uploading}
                  className="px-3 py-1 text-sm rounded bg-[#8c6e35] text-white hover:bg-black disabled:opacity-60"
                >
                  {uploading ? 'Uploading…' : '+ Add Image'}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {images.map((url, i) => (
                  <div
                    key={i}
                    className="relative w-full h-40 rounded-lg overflow-hidden border bg-[#EFE9DF] group"
                  >
                    {url ? (
                      <img
                        src={url}
                        alt={`img-${i}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => {
                          setModalImage(url);
                          setShowPreviewModal(true);
                        }}
                        title="Click to preview"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <Camera className="w-10 h-10 text-black/30" />
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 right-2 grid grid-cols-3 gap-2">
                      <button
                        className="px-2 py-1 text-xs rounded bg-[#8c6e35] text-white hover:bg-blue-700"
                        onClick={() => {
                          setPreview(url || null);
                          notify('info', 'Preview updated');
                        }}
                      >
                        Preview
                      </button>
                      <button
                        className="px-2 py-1 text-xs rounded bg-[#6b7280] text-white hover:bg-gray-700 disabled:opacity-60"
                        onClick={() => replaceImage(i)}
                        disabled={uploading}
                      >
                        Replace
                      </button>
                      <button
                        className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                        onClick={() => removeImage(i)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {images.length === 0 && (
                  <p className="text-sm text-gray-500 col-span-full">
                    No images yet. Click “Add Image”.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={saveImages}
                  className="bg-[#A07D3D] text-white font-medium py-2 px-6 rounded hover:bg-[#8c6e35] disabled:opacity-60"
                >
                  {savingImages ? 'Saving…' : 'Save Images'}
                </button>
              </div>
            </div>
          </div>

          {}
          <h3 className="text-base font-semibold mt-10 mb-3">Slots</h3>

          <div className="grid grid-cols-12 font-semibold text-gray-700 text-sm px-1 mb-2 gap-x-4">
            <span className="col-span-2">Select Availability</span>
            <span className="col-span-4">Select Time</span>
            <span className="col-span-2">Max Allowed</span>
            <span className="col-span-4">Price (Excluding GST)</span>
          </div>

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
                  onChange={(e) =>
                    handleInputChange(day, 'from', e.target.value)
                  }
                  className="rounded border border-gray-300 px-3 py-1 bg-[#EFE9DF] col-span-2"
                />

                {}
                <input
                  type="time"
                  value={dayInputs[day].to}
                  onChange={(e) => handleInputChange(day, 'to', e.target.value)}
                  className="rounded border border-gray-300 px-3 py-1 bg-[#EFE9DF] col-span-2"
                />

                {}
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={dayInputs[day].maxPersons}
                  onChange={(e) =>
                    handleInputChange(day, 'maxPersons', e.target.value)
                  }
                  className="rounded border border-gray-300 px-3 py-1 bg-[#EFE9DF] text-center col-span-2"
                />

                {}
                <div className="col-span-4 flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="1000/-"
                    value={dayInputs[day].price}
                    onChange={(e) =>
                      handleInputChange(day, 'price', e.target.value)
                    }
                    className="rounded border border-gray-300 px-3 py-1 w-[160px] bg-[#EFE9DF] text-center"
                  />
                  <button
                    onClick={() => handleAddSlotNow(day)}
                    className="w-6 h-6 flex items-center justify-center text-white bg-[#A07D3D] hover:bg-[#8c6e35] rounded-sm text-sm disabled:opacity-60"
                    title="Add slot now"
                  >
                    {addingForDay === day ? '…' : '+'}
                  </button>
                </div>

                {}
                {groupedExisting[day].length > 0 && (
                  <div className="col-span-12 mt-3 space-y-2">
                    {groupedExisting[day].map((s) => (
                      <div
                        key={s._id}
                        className="grid grid-cols-12 gap-3 items-center border rounded p-3"
                      >
                        {}
                        <div className="col-span-2">
                          {s.isEditing ? (
                            <select
                              value={String(s.dayOfWeek)}
                              onChange={(e) =>
                                updateEditableSlot(
                                  s._id,
                                  'dayOfWeek',
                                  e.target.value
                                )
                              }
                              className="w-full border rounded px-2 py-1 bg-[#EFE9DF]"
                            >
                              {weekdays.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-gray-800">
                              {String(s.dayOfWeek)}
                            </span>
                          )}
                        </div>

                        {}
                        <div className="col-span-2">
                          {s.isEditing ? (
                            <input
                              type="time"
                              value={s.startTime}
                              onChange={(e) =>
                                updateEditableSlot(
                                  s._id,
                                  'startTime',
                                  e.target.value
                                )
                              }
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
                              onChange={(e) =>
                                updateEditableSlot(
                                  s._id,
                                  'endTime',
                                  e.target.value
                                )
                              }
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
                              onChange={(e) =>
                                updateEditableSlot(
                                  s._id,
                                  'maxCapacity',
                                  e.target.value
                                )
                              }
                              className="w-full border rounded px-2 py-1 bg-[#EFE9DF]"
                            />
                          ) : (
                            <span>{s.maxCapacity}</span>
                          )}
                        </div>

                        {}
                        <div className="col-span-2">
                          {s.isEditing ? (
                            <input
                              type="text"
                              value={String(s.price)}
                              onChange={(e) =>
                                updateEditableSlot(
                                  s._id,
                                  'price',
                                  e.target.value
                                )
                              }
                              className="w-full border rounded px-2 py-1 bg-[#EFE9DF]"
                            />
                          ) : (
                            <span>{s.price}</span>
                          )}
                        </div>

                        {}
                        <div className="col-span-2 flex gap-2 justify-end">
                          {s.isEditing ? (
                            <button
                              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                              onClick={() => handleSaveSlot(s)}
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
                            title="Delete slot"
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
        </>
      )}

      {}
      {showPreviewModal && modalImage && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              aria-label="Close preview"
              className="absolute -top-10 right-0 text-white hover:text-gray-200"
              onClick={() => {
                setShowPreviewModal(false);
                setModalImage(null);
              }}
              title="Close"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="bg-white rounded-lg overflow-hidden">
              <div className="relative w-full max-h-[80vh]">
                <img
                  src={modalImage}
                  alt="Preview"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
              <div className="p-3 flex justify-end">
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setModalImage(null);
                  }}
                  className="px-4 py-2 rounded bg-[#8c6e35] text-white hover:bg-[#6f562b]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConferenceFacilityManager;
