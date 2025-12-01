// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import apiCall from '@/lib/axios';
// import { PiCameraThin } from 'react-icons/pi';
// import { X } from 'lucide-react';
// import type { SweetAlertIcon } from 'sweetalert2';
// import { ToastAtTopRight } from '@/lib/sweetalert';

// /** Toast helper */
// const showToast = (icon: SweetAlertIcon, title: string, ms = 2200) =>
//   ToastAtTopRight.fire({
//     icon,
//     title,
//     toast: true,
//     position: 'top-end',
//     showConfirmButton: false,
//     timer: ms,
//     timerProgressBar: true,
//   });

// /** -------------------- Types -------------------- */
// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   hotelId?: string; // optional
// }

// const weekdays = [
//   'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
// ] as const;
// type Weekday = typeof weekdays[number];

// type Amenity = { title: string; image: string };

// type SwimmingPoolDetails = {
//   images: string[];
//   poolDetails: string;
//   timeAndAccess: string;
//   amenities: Amenity[];
//   rulesAndRegulation: string;
//   slots?: Array<{
//     _id: string;
//     dayOfWeek: string;
//     startTime: string;
//     endTime: string;
//     price: number;
//     maxCapacity: number;
//     currentCapacity?: number;
//   }>;
// };

// type DayInputs = {
//   checked: boolean;
//   from: string;
//   to: string;
//   maxPersons: string;
//   price: string;
// };

// type ExistingSlotRow = {
//   _id: string;
//   dayOfWeek: Weekday | string;
//   startTime: string;
//   endTime: string;
//   price: number;
//   maxCapacity: number;
//   isEditing?: boolean;
// };

// /** -------------------- Helpers -------------------- */
// const emptyDetails: SwimmingPoolDetails = {
//   images: [],
//   poolDetails: '',
//   timeAndAccess: '',
//   amenities: [],
//   rulesAndRegulation: '',
// };

// const emptyWeek = (): Record<Weekday, DayInputs> =>
//   weekdays.reduce((acc, day) => {
//     acc[day] = { checked: false, from: '', to: '', maxPersons: '', price: '' };
//     return acc;
//   }, {} as Record<Weekday, DayInputs>);

// const emptyGroups = (): Record<Weekday, ExistingSlotRow[]> =>
//   weekdays.reduce((acc, day) => {
//     acc[day] = [];
//     return acc;
//   }, {} as Record<Weekday, ExistingSlotRow[]>);

// // Covers “WednessDay”, “wed”, etc.
// const normalizeDay = (d: string): Weekday | null => {
//   const s = (d || '').toLowerCase();
//   if (s.startsWith('mon')) return 'Monday';
//   if (s.startsWith('tue')) return 'Tuesday';
//   if (s.startsWith('wed')) return 'Wednesday';
//   if (s.startsWith('thu')) return 'Thursday';
//   if (s.startsWith('fri')) return 'Friday';
//   if (s.startsWith('sat')) return 'Saturday';
//   if (s.startsWith('sun')) return 'Sunday';
//   return null;
// };

// /** -------------------- Component -------------------- */
// const PriceTimeSettingSwimmingPool: React.FC<ModalProps> = ({ isOpen, onClose, hotelId }) => {
//   const [loading, setLoading] = useState(false);

//   // Details
//   const [details, setDetails] = useState<SwimmingPoolDetails>(emptyDetails);
//   const [isExistingDetails, setIsExistingDetails] = useState(false);
//   const [savingDetails, setSavingDetails] = useState(false);

//   // Images UI
//   const [preview, setPreview] = useState<string | null>(null);

//   // Per-day inputs + existing slots
//   const [dayInputs, setDayInputs] = useState<Record<Weekday, DayInputs>>(emptyWeek());
//   const [existingSlots, setExistingSlots] = useState<ExistingSlotRow[]>([]);
//   const [updatingSlotId, setUpdatingSlotId] = useState<string | null>(null);
//   const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
//   const [addingForDay, setAddingForDay] = useState<Weekday | null>(null); // disable “+” while posting

//   // Group existing slots by weekday for inline rendering
//   const groupedExisting = useMemo(() => {
//     const g = emptyGroups();
//     existingSlots.forEach((s) => {
//       const d = normalizeDay(String(s.dayOfWeek));
//       if (d) g[d].push(s);
//     });
//     return g;
//   }, [existingSlots]);

//   // ---- Load (GET details + slots) on open ----
//   useEffect(() => {
//     if (!isOpen) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const endpoint = hotelId
//           ? `api/services/swimming-pool-details?hotelId=${hotelId}`
//           : 'api/services/swimming-pool-details';

//         const res = await apiCall('GET', endpoint);
//         const body: any = (res && (res.data?.data ?? res.data)) || res;

//         if (body && typeof body === 'object') {
//           // Normalize details
//           const normalized: SwimmingPoolDetails = {
//             images: Array.isArray(body.images) ? body.images : [],
//             poolDetails: body.poolDetails || '',
//             timeAndAccess: body.timeAndAccess || '',
//             amenities: Array.isArray(body.amenities)
//               ? body.amenities.map((a: any) => ({ title: a?.title ?? '', image: a?.image ?? '' }))
//               : [],
//             rulesAndRegulation: body.rulesAndRegulation || '',
//             slots: Array.isArray(body.slots) ? body.slots : [],
//           };
//           setDetails(normalized);
//           setIsExistingDetails(true);
//           setPreview(normalized.images[0] ?? null);

//           // existing slots -> flat list
//           const ex: ExistingSlotRow[] = (normalized.slots || []).map((s) => ({
//             _id: s._id,
//             dayOfWeek: normalizeDay(s.dayOfWeek) ?? s.dayOfWeek,
//             startTime: s.startTime,
//             endTime: s.endTime,
//             price: s.price,
//             maxCapacity: s.maxCapacity,
//           }));
//           setExistingSlots(ex);

//           // pre-tick days that already have slots
//           const updated = emptyWeek();
//           ex.forEach((s) => {
//             const day = normalizeDay(String(s.dayOfWeek));
//             if (day) updated[day].checked = true;
//           });
//           setDayInputs(updated);
//         } else {
//           setDetails(emptyDetails);
//           setIsExistingDetails(false);
//           setPreview(null);
//           setExistingSlots([]);
//           setDayInputs(emptyWeek());
//         }
//       } catch {
//         setDetails(emptyDetails);
//         setIsExistingDetails(false);
//         setPreview(null);
//         setExistingSlots([]);
//         setDayInputs(emptyWeek());
//         showToast('error', 'Failed to load swimming pool details.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [isOpen, hotelId]);

//   /** -------------------- Details Handlers -------------------- */
//   const updateField = (k: keyof SwimmingPoolDetails, v: any) =>
//     setDetails((prev) => ({ ...prev, [k]: v }));

//   const addImage = () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'image/*';
//     input.multiple = true;

//     input.onchange = (e: any) => {
//       const files: FileList | undefined = e?.target?.files;
//       if (!files || files.length === 0) return;

//       const urls = Array.from(files).map((f) => URL.createObjectURL(f));

//       setDetails((prev) => {
//         const nextImages = [...prev.images, ...urls];
//         return { ...prev, images: nextImages };
//       });

//       setPreview((prev) => prev ?? urls[0]);

//       showToast('success', `${files.length} image${files.length > 1 ? 's' : ''} added.`);
//     };

//     input.click();
//   };

//   const removeImage = (i: number) => {
//     const next = details.images.filter((_, idx) => idx !== i);
//     setDetails((prev) => ({ ...prev, images: next }));
//     if (preview && details.images[i] === preview) setPreview(next[0] ?? null);
//     showToast('info', 'Image removed.');
//   };

//   const updateImage = (i: number, v: string) => {
//     const next = [...details.images];
//     next[i] = v;
//     setDetails((prev) => ({ ...prev, images: next }));
//   };

//   const addAmenity = () => {
//     setDetails((prev) => ({
//       ...prev,
//       amenities: [...prev.amenities, { title: '', image: '' }]
//     }));
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'image/*';
//     input.onchange = (e: any) => {
//       const file = e.target.files[0];
//       if (file) {
//         const url = URL.createObjectURL(file);
//         setDetails((prev) => {
//           const updated = [...prev.amenities];
//           updated[updated.length - 1].image = url;
//           return { ...prev, amenities: updated };
//         });
//       }
//     };
//     input.click();
//   };

//   const removeAmenity = (i: number) => {
//     setDetails((prev) => ({
//       ...prev,
//       amenities: prev.amenities.filter((_, idx) => idx !== i),
//     }));
//     showToast('info', 'Amenity removed.');
//   };

//   const updateAmenity = (i: number, field: keyof Amenity, v: string) => {
//     const next = [...details.amenities];
//     next[i] = { ...next[i], [field]: v };
//     setDetails((prev) => ({ ...prev, amenities: next }));
//   };

//   const handleSaveDetails = async () => {
//     const payload: SwimmingPoolDetails = {
//       images: (details.images || []).filter(Boolean),
//       poolDetails: details.poolDetails || '',
//       timeAndAccess: details.timeAndAccess || '',
//       amenities: (details.amenities || []).map((a) => ({
//         title: a.title || '',
//         image: a.image || '',
//       })),
//       rulesAndRegulation: details.rulesAndRegulation || '',
//     };

//     setSavingDetails(true);
//     try {
//       if (isExistingDetails) {
//         await apiCall('PUT', 'api/services/swimming-pool-details', payload);
//         showToast('success', 'Details updated successfully!');
//       } else {
//         await apiCall('POST', 'api/services/swimming-pool-details', payload);
//         setIsExistingDetails(true);
//         showToast('success', 'Details created successfully!');
//       }
//     } catch {
//       showToast('error', 'Save failed. Please check your inputs and try again.');
//     } finally {
//       setSavingDetails(false);
//     }
//   };

//   /** -------------------- Slots: Direct add per-day -------------------- */
//   const handleDayToggle = (day: Weekday) => {
//     setDayInputs((prev) => ({
//       ...prev,
//       [day]: { ...prev[day], checked: !prev[day].checked },
//     }));
//   };

//   const handleInputChange = (
//     day: Weekday,
//     field: 'from' | 'to' | 'maxPersons' | 'price',
//     value: string
//   ) => {
//     setDayInputs((prev) => ({
//       ...prev,
//       [day]: { ...prev[day], [field]: value },
//     }));
//   };

//   const handleAddSlotNow = async (day: Weekday) => {
//     const { from, to, maxPersons, price } = dayInputs[day];
//     if (!from || !to || !maxPersons || !price) {
//       return showToast('warning', 'Please fill From, To, Max Allowed, and Price.');
//     }

//     const slotPayload = {
//       dayOfWeek: day,
//       startTime: from,
//       endTime: to,
//       price: parseFloat(price.replace(/[^\d.]/g, '')),
//       maxCapacity: parseInt(maxPersons.replace(/[^\d]/g, ''), 10),
//     };

//     setAddingForDay(day);
//     try {
//       // API expects { slots: [...] }
//       const res = await apiCall('POST', 'api/services/swimming-pool-details/slots', {
//         slots: [slotPayload],
//       });

//       // Try to read created slot with _id (if API returns it),
//       // otherwise show optimistically with a temp id.
//       const created =
//         (res?.data?.data && Array.isArray(res.data.data) && res.data.data[0]) ||
//         (res?.data && Array.isArray(res.data.slots) && res.data.slots[0]) ||
//         null;

//       const newRow: ExistingSlotRow = {
//         _id: created?._id || `temp-${Date.now()}`,
//         dayOfWeek: day,
//         startTime: slotPayload.startTime,
//         endTime: slotPayload.endTime,
//         price: slotPayload.price,
//         maxCapacity: slotPayload.maxCapacity,
//       };

//       setExistingSlots((prev) => [...prev, newRow]);

//       // Clear that day's inputs & ensure checked
//       setDayInputs((prev) => ({
//         ...prev,
//         [day]: { checked: true, from: '', to: '', maxPersons: '', price: '' },
//       }));

//       showToast('success', `Slot added to ${day}.`);
//     } catch {
//       showToast('error', 'Failed to add slot.');
//     } finally {
//       setAddingForDay(null);
//     }
//   };

//   /** -------------------- Slots: Edit/Delete existing -------------------- */
//   const toggleEditSlot = (id: string, on: boolean) => {
//     setExistingSlots((prev) =>
//       prev.map((s) => (s._id === id ? { ...s, isEditing: on } : s))
//     );
//   };

//   const updateEditableSlot = (
//     id: string,
//     field: 'dayOfWeek' | 'startTime' | 'endTime' | 'price' | 'maxCapacity',
//     value: string
//   ) => {
//     setExistingSlots((prev) =>
//       prev.map((s) => {
//         if (s._id !== id) return s;
//         if (field === 'dayOfWeek') {
//           const nd = normalizeDay(value) ?? value;
//           return { ...s, dayOfWeek: nd as any };
//         }
//         if (field === 'price') return { ...s, price: parseFloat(value.replace(/[^\d.]/g, '')) || 0 };
//         if (field === 'maxCapacity') return { ...s, maxCapacity: parseInt(value.replace(/[^\d]/g, ''), 10) || 0 };
//         return { ...s, [field]: value };
//       })
//     );
//   };

//   const handleUpdateSlot = async (slot: ExistingSlotRow) => {
//     setUpdatingSlotId(slot._id);
//     try {
//       await apiCall('PUT', `api/services/swimming-pool-details/slots/${slot._id}`, {
//         dayOfWeek: String(slot.dayOfWeek),
//         startTime: slot.startTime,
//         endTime: slot.endTime,
//         price: slot.price,
//         maxCapacity: slot.maxCapacity,
//       });
//       toggleEditSlot(slot._id, false);
//       showToast('success', 'Slot updated successfully!');
//     } catch {
//       showToast('error', 'Failed to update slot.');
//     } finally {
//       setUpdatingSlotId(null);
//     }
//   };

//   const handleDeleteSlot = async (id: string) => {
//     setDeletingSlotId(id);
//     try {
//       await apiCall('DELETE', `api/services/swimming-pool-details/slots/${id}`);
//       setExistingSlots((prev) => prev.filter((s) => s._id !== id));
//       showToast('success', 'Slot deleted successfully!');
//     } catch {
//       showToast('error', 'Failed to delete slot.');
//     } finally {
//       setDeletingSlotId(null);
//     }
//   };

//   /** -------------------- Render -------------------- */
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
//       <div className="bg-white rounded-lg shadow-lg p-6 w-[92%] max-w-6xl overflow-y-auto max-h-[90vh]">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold">Swimming Pool</h2>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {loading ? (
//           <div className="py-12 text-center text-gray-600">Loading…</div>
//         ) : (
//           <>
//             {/* ========== DETAILS ========== */}
//             <h3 className="text-base font-semibold mb-3">Details</h3>

//             {/* Preview + Images */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {/* Preview */}
//               <div>
//                 <h4 className="text-sm font-semibold mb-2">Preview</h4>
//                 <div className="relative h-44 w-full max-w-[260px] rounded-lg bg-[#F6EEE0] overflow-hidden">
//                   {preview ? (
//                     <img src={preview} className="w-full h-full object-cover rounded-lg" />
//                   ) : (
//                     <div className="flex items-center justify-center h-full">
//                       <PiCameraThin className="w-10 h-10 text-black/30" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Image URLs */}
//               {/* Images (Preview Only) */}
//               <div className="md:col-span-2">
//                 <div className="flex items-center justify-between">
//                   <h4 className="text-sm font-semibold mb-2">Images</h4>
//                   <button
//                     onClick={addImage}
//                     className="px-3 py-1 text-sm rounded bg-[#8c6e35] text-white hover:bg-black"
//                   >
//                     + Add Image
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
//                   {details.images.map((url, i) => (
//                     <div
//                       key={i}
//                       className="relative w-full h-40 rounded-lg overflow-hidden border bg-[#EFE9DF]"
//                     >
//                       {/* Image */}
//                       {url ? (
//                         <img
//                           src={url}
//                           alt={`img-${i}`}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             (e.currentTarget as HTMLImageElement).style.display = "none";
//                           }}
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center w-full h-full">
//                           <PiCameraThin className="w-10 h-10 text-black/30" />
//                         </div>
//                       )}

//                       {/* Buttons */}
//                       <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-2">
//                         <button
//                           className="flex-1 px-2 py-1 text-xs rounded bg-[#8c6e35] text-white hover:bg-blue-700"
//                           onClick={() => setPreview(url || null)}
//                         >
//                           Preview
//                         </button>
//                         <button
//                           className="flex-1 px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
//                           onClick={() => removeImage(i)}
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   ))}

//                   {details.images.length === 0 && (
//                     <p className="text-sm text-gray-500 col-span-full">
//                       No images yet. Click “Add Image”.
//                     </p>
//                   )}
//                 </div>
//               </div>

//             </div>

//             <div className="grid gap-4 mt-6">
//               <div>
//                 <label className="text-sm font-semibold">Pool Details</label>
//                 <textarea
//                   value={details.poolDetails}
//                   onChange={(e) => updateField('poolDetails', e.target.value)}
//                   rows={3}
//                   className="mt-1 w-full border rounded px-3 py-2 bg-[#EFE9DF] resize"
//                   placeholder="Write pool details…"
//                 />
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-semibold">Time &amp; Access</label>
//                   <textarea
//                     value={details.timeAndAccess}
//                     onChange={(e) => updateField('timeAndAccess', e.target.value)}
//                     rows={3}
//                     className="mt-1 w-full border rounded px-3 py-2 bg-[#EFE9DF]"
//                     placeholder="e.g., Open 7 AM – 9 PM. Access for in-house guests only…"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-semibold">Rules &amp; Regulations</label>
//                   <textarea
//                     value={details.rulesAndRegulation}
//                     onChange={(e) => updateField('rulesAndRegulation', e.target.value)}
//                     rows={3}
//                     className="mt-1 w-full border rounded px-3 py-2 bg-[#EFE9DF]"
//                     placeholder="Write rules…"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Amenities */}
//             {/* Amenities */}
//             <div className="mt-6">
//               <div className="flex items-center justify-between">
//                 <h4 className="text-sm font-semibold">Amenities</h4>
//                 <button
//                   onClick={addAmenity}
//                   className="px-3 py-1 text-sm rounded bg-[#8c6e35] text-white hover:bg-black"
//                 >
//                   + Add Amenity
//                 </button>
//               </div>

//               <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {details.amenities.map((a, i) => (
//                   <div
//                     key={i}
//                     className="relative flex flex-col items-center rounded-lg border bg-[#EFE9DF] overflow-hidden"
//                   >
//                     {/* Amenity Image */}
//                     <div className="w-full h-32 flex items-center justify-center bg-white">
//                       {a.image ? (
//                         <img
//                           src={a.image}
//                           alt={a.title || `amenity-${i}`}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             (e.currentTarget as HTMLImageElement).style.display = "none";
//                           }}
//                         />
//                       ) : (
//                         <PiCameraThin className="w-10 h-10 text-black/30" />
//                       )}
//                     </div>

//                     {/* Title / Description */}
//                     <div className="w-full px-2 py-2 bg-[#EFE9DF]">
//                       <input
//                         type="text"
//                         value={a.title}
//                         onChange={(e) => updateAmenity(i, "title", e.target.value)}
//                         placeholder="Amenity title..."
//                         className="w-full text-sm font-medium text-gray-800 text-center bg-transparent border-b border-gray-400 focus:outline-none focus:border-gray-600"
//                       />
//                     </div>

//                     {/* Actions */}
//                     <div className="absolute top-2 right-2 flex gap-1">
//                       {/* <button
//                         className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
//                         onClick={() => setPreview(a.image || null)}
//                       >
//                         Preview
//                       </button> */}
//                       <button
//                         className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
//                         onClick={() => removeAmenity(i)}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 ))}

//                 {details.amenities.length === 0 && (
//                   <p className="text-sm text-gray-500 col-span-full">
//                     No amenities yet. Click “Add Amenity”.
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Save Details */}
//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={handleSaveDetails}
//                 className="bg-[#A07D3D] text-white font-medium py-2 px-6 rounded hover:bg-[#8c6e35] disabled:opacity-60"
//                 disabled={savingDetails}
//               >
//                 {savingDetails ? 'Saving…' : isExistingDetails ? 'Update Details' : 'Create Details'}
//               </button>
//             </div>

//             {/* ========== SLOTS (inline per day) ========== */}
//             <h3 className="text-base font-semibold mt-10 mb-3">Slots</h3>

//             <div className="grid grid-cols-12 font-semibold text-gray-700 text-sm px-1 mb-2 gap-x-4">
//               <span className="col-span-2">Select Availability</span>
//               <span className="col-span-4">Select Time</span>
//               <span className="col-span-2">Max Allowed</span>
//               <span className="col-span-4">Price (Excluding GST)</span>
//             </div>

//             <div className="space-y-4">
//               {weekdays.map((day) => (
//                 <div key={day} className="grid grid-cols-12 gap-x-4 items-start">
//                   {/* Checkbox + Day */}
//                   <label className="flex items-center gap-2 col-span-2">
//                     <input
//                       type="checkbox"
//                       checked={dayInputs[day].checked}
//                       onChange={() => handleDayToggle(day)}
//                       className="w-4 h-4"
//                     />
//                     <span className="text-gray-700">{day}</span>
//                   </label>

//                   {/* From */}
//                   <input
//                     type="time"
//                     value={dayInputs[day].from}
//                     onChange={(e) => handleInputChange(day, 'from', e.target.value)}
//                     className="rounded border border-gray-300 px-3 py-1 bg-[#EFE9DF] col-span-2"
//                   />

//                   {/* To */}
//                   <div className="col-span-2 relative">
//                     <input
//                       type="time"
//                       value={dayInputs[day].to}
//                       onChange={(e) => handleInputChange(day, 'to', e.target.value)}
//                       className="rounded border border-gray-300 px-3 py-1 w-full bg-[#EFE9DF]"
//                     />
//                   </div>

//                   {/* Max Allowed */}
//                   <input
//                     type="number"
//                     placeholder="e.g. 20"
//                     value={dayInputs[day].maxPersons}
//                     onChange={(e) => handleInputChange(day, 'maxPersons', e.target.value)}
//                     className="rounded border border-gray-300 px-3 py-1 bg-[#EFE9DF] text-center col-span-2"
//                   />

//                   {/* Price + Plus (direct POST) */}
//                   <div className="col-span-4 flex items-center gap-3">
//                     <input
//                       type="text"
//                       placeholder="1000/-"
//                       value={dayInputs[day].price}
//                       onChange={(e) => handleInputChange(day, 'price', e.target.value)}
//                       className="rounded border border-gray-300 px-3 py-1 w-[160px] bg-[#EFE9DF] text-center"
//                     />
//                     <button
//                       onClick={() => handleAddSlotNow(day)}
//                       disabled={addingForDay === day}
//                       className="w-6 h-6 flex items-center justify-center text-white bg-[#A07D3D] hover:bg-[#8c6e35] rounded-sm text-sm disabled:opacity-60"
//                       title="Add slot now"
//                     >
//                       {addingForDay === day ? '…' : '+'}
//                     </button>
//                   </div>

//                   {/* EXISTING slots for THIS day */}
//                   {groupedExisting[day].length > 0 && (
//                     <div className="col-span-12 mt-3 space-y-2">
//                       {groupedExisting[day].map((s) => (
//                         <div key={s._id} className="grid grid-cols-12 gap-3 items-center border rounded p-3">
//                           {/* Day */}
//                           <div className="col-span-2">
//                             {s.isEditing ? (
//                               <select
//                                 value={String(s.dayOfWeek)}
//                                 onChange={(e) => updateEditableSlot(s._id, 'dayOfWeek', e.target.value)}
//                                 className="w-full border rounded px-2 py-1 bg-[#EFE9DF]"
//                               >
//                                 {weekdays.map((d) => (
//                                   <option key={d} value={d}>{d}</option>
//                                 ))}
//                               </select>
//                             ) : (
//                               <span className="text-gray-800">{String(s.dayOfWeek)}</span>
//                             )}
//                           </div>
//                           {/* Start */}
//                           <div className="col-span-2">
//                             {s.isEditing ? (
//                               <input
//                                 type="time"
//                                 value={s.startTime}
//                                 onChange={(e) => updateEditableSlot(s._id, 'startTime', e.target.value)}
//                                 className="w-full border rounded px-2 py-1 bg-[#EFE9DF]"
//                               />
//                             ) : (
//                               <span>{s.startTime}</span>
//                             )}
//                           </div>
//                           {/* End */}
//                           <div className="col-span-2">
//                             {s.isEditing ? (
//                               <input
//                                 type="time"
//                                 value={s.endTime}
//                                 onChange={(e) => updateEditableSlot(s._id, 'endTime', e.target.value)}
//                                 className="w-full border rounded px-2 py-1 bg-[#EFE9DF]"
//                               />
//                             ) : (
//                               <span>{s.endTime}</span>
//                             )}
//                           </div>
//                           {/* Max */}
//                           <div className="col-span-2">
//                             {s.isEditing ? (
//                               <input
//                                 type="number"
//                                 value={String(s.maxCapacity)}
//                                 onChange={(e) => updateEditableSlot(s._id, 'maxCapacity', e.target.value)}
//                                 className="w-full border rounded px-2 py-1 bg-[#EFE9DF]"
//                               />
//                             ) : (
//                               <span>{s.maxCapacity}</span>
//                             )}
//                           </div>
//                           {/* Price */}
//                           <div className="col-span-2">
//                             {s.isEditing ? (
//                               <input
//                                 type="text"
//                                 value={String(s.price)}
//                                 onChange={(e) => updateEditableSlot(s._id, 'price', e.target.value)}
//                                 className="w-full border rounded px-2 py-1 bg-[#EFE9DF]"
//                               />
//                             ) : (
//                               <span>{s.price}</span>
//                             )}
//                           </div>

//                           {/* Actions */}
//                           <div className="col-span-2 flex gap-2 justify-end">
//                             {s.isEditing ? (
//                               <button
//                                 className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
//                                 onClick={() => handleUpdateSlot(s)}
//                                 disabled={updatingSlotId === s._id}
//                               >
//                                 {updatingSlotId === s._id ? 'Saving…' : 'Save'}
//                               </button>
//                             ) : (
//                               <button
//                                 className="px-3 py-1 rounded bg-[#8c6e35] text-white hover:bg-blue-700"
//                                 onClick={() => toggleEditSlot(s._id, true)}
//                               >
//                                 Edit
//                               </button>
//                             )}
//                             <button
//                               className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
//                               onClick={() => handleDeleteSlot(s._id)}
//                               disabled={deletingSlotId === s._id}
//                             >
//                               {deletingSlotId === s._id ? 'Deleting…' : 'Delete'}
//                             </button>
//                             {s.isEditing && (
//                               <button
//                                 className="px-3 py-1 rounded border"
//                                 onClick={() => toggleEditSlot(s._id, false)}
//                               >
//                                 Cancel
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Footer */}
//             <div className="flex justify-end gap-3 mt-10">
//               <button
//                 onClick={onClose}
//                 className="bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-400"
//               >
//                 Close
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PriceTimeSettingSwimmingPool;
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import apiCall from '@/lib/axios';
import { PiCameraThin } from 'react-icons/pi';
import { X } from 'lucide-react';
import type { SweetAlertIcon } from 'sweetalert2';
import { ToastAtTopRight } from '@/lib/sweetalert';

/** Toast helper */
const showToast = (icon: SweetAlertIcon, title: string, ms = 2200) =>
  ToastAtTopRight.fire({
    icon,
    title,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: ms,
    timerProgressBar: true
  });

/** -------------------- Types -------------------- */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId?: string; // optional
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

type Amenity = { title: string; image: string };

type SwimmingPoolDetails = {
  images: string[];
  poolDetails: string;
  timeAndAccess: string;
  amenities: Amenity[];
  rulesAndRegulation: string;
  slots?: Array<{
    _id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    price: number;
    maxCapacity: number;
    currentCapacity?: number;
  }>;
};

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

/** -------------------- Helpers -------------------- */
const emptyDetails: SwimmingPoolDetails = {
  images: [],
  poolDetails: '',
  timeAndAccess: '',
  amenities: [],
  rulesAndRegulation: ''
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

const emptyGroups = (): Record<Weekday, ExistingSlotRow[]> =>
  weekdays.reduce(
    (acc, day) => {
      acc[day] = [];
      return acc;
    },
    {} as Record<Weekday, ExistingSlotRow[]>
  );

// Covers “WednessDay”, “wed”, etc.
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

/** Upload helper: send files to your uploader endpoint and get persistent URLs */
async function uploadImagesAndGetUrls(files: File[]): Promise<string[]> {
  const fd = new FormData();
  for (const f of files) fd.append('files', f);

  // ⚠️ Replace with your actual upload path / response shape if different
  const res = await apiCall('POST', '/api/uploads/images', fd);
  // Expecting: { urls: ["https://.../img1.jpg", "..."] }
  const urls: string[] = res?.data?.urls ?? res?.urls ?? [];

  if (!Array.isArray(urls)) {
    throw new Error('Upload failed: invalid response');
  }
  return urls;
}

/** -------------------- Component -------------------- */
const PriceTimeSettingSwimmingPool: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  hotelId
}) => {
  const [loading, setLoading] = useState(false);

  // Details
  const [details, setDetails] = useState<SwimmingPoolDetails>(emptyDetails);
  const [isExistingDetails, setIsExistingDetails] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);

  // Images UI
  const [preview, setPreview] = useState<string | null>(null);

  // Per-day inputs + existing slots
  const [dayInputs, setDayInputs] =
    useState<Record<Weekday, DayInputs>>(emptyWeek());
  const [existingSlots, setExistingSlots] = useState<ExistingSlotRow[]>([]);
  const [updatingSlotId, setUpdatingSlotId] = useState<string | null>(null);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const [addingForDay, setAddingForDay] = useState<Weekday | null>(null); // disable “+” while posting

  // Group existing slots by weekday for inline rendering
  const groupedExisting = useMemo(() => {
    const g = emptyGroups();
    existingSlots.forEach((s) => {
      const d = normalizeDay(String(s.dayOfWeek));
      if (d) g[d].push(s);
    });
    return g;
  }, [existingSlots]);

  // ---- Load (GET details + slots) on open ----
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      try {
        const endpoint = hotelId
          ? `api/services/swimming-pool-details?hotelId=${hotelId}`
          : 'api/services/swimming-pool-details';

        const res = await apiCall('GET', endpoint);
        const body: any = (res && (res.data?.data ?? res.data)) || res;

        if (body && typeof body === 'object') {
          // Normalize details
          const normalized: SwimmingPoolDetails = {
            images: Array.isArray(body.images) ? body.images : [],
            poolDetails: body.poolDetails || '',
            timeAndAccess: body.timeAndAccess || '',
            amenities: Array.isArray(body.amenities)
              ? body.amenities.map((a: any) => ({
                  title: a?.title ?? '',
                  image: a?.image ?? ''
                }))
              : [],
            rulesAndRegulation: body.rulesAndRegulation || '',
            slots: Array.isArray(body.slots) ? body.slots : []
          };
          setDetails(normalized);
          setIsExistingDetails(true);
          setPreview(normalized.images[0] ?? null);

          // existing slots -> flat list
          const ex: ExistingSlotRow[] = (normalized.slots || []).map((s) => ({
            _id: s._id,
            dayOfWeek: normalizeDay(s.dayOfWeek) ?? s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            price: s.price,
            maxCapacity: s.maxCapacity
          }));
          setExistingSlots(ex);

          // pre-tick days that already have slots
          const updated = emptyWeek();
          ex.forEach((s) => {
            const day = normalizeDay(String(s.dayOfWeek));
            if (day) updated[day].checked = true;
          });
          setDayInputs(updated);
        } else {
          setDetails(emptyDetails);
          setIsExistingDetails(false);
          setPreview(null);
          setExistingSlots([]);
          setDayInputs(emptyWeek());
        }
      } catch {
        setDetails(emptyDetails);
        setIsExistingDetails(false);
        setPreview(null);
        setExistingSlots([]);
        setDayInputs(emptyWeek());
        showToast('error', 'Failed to load swimming pool details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, hotelId]);

  /** -------------------- Details Handlers -------------------- */
  const updateField = (k: keyof SwimmingPoolDetails, v: any) =>
    setDetails((prev) => ({ ...prev, [k]: v }));

  /** Add images: upload first, store persistent URLs; also set local preview */
  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = async (e: any) => {
      const files: FileList | undefined = e?.target?.files;
      if (!files || files.length === 0) return;

      // Optional local preview (just for the UI)
      const localUrls = Array.from(files).map((f) => URL.createObjectURL(f));
      setPreview((prev) => prev ?? localUrls[0]);

      try {
        const uploadedUrls = await uploadImagesAndGetUrls(Array.from(files));
        if (!uploadedUrls.length) throw new Error('No URLs returned');

        setDetails((prev) => {
          const nextImages = [...prev.images, ...uploadedUrls];
          return { ...prev, images: nextImages };
        });

        showToast(
          'success',
          `${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded.`
        );
      } catch (err: any) {
        showToast('error', err?.message || 'Image upload failed.');
      }
    };

    input.click();
  };

  const removeImage = (i: number) => {
    const next = details.images.filter((_, idx) => idx !== i);
    setDetails((prev) => ({ ...prev, images: next }));
    if (preview && details.images[i] === preview) setPreview(next[0] ?? null);
    showToast('info', 'Image removed.');
  };

  const updateImage = (i: number, v: string) => {
    const next = [...details.images];
    next[i] = v;
    setDetails((prev) => ({ ...prev, images: next }));
  };

  /** Add amenity: create row, then prompt for image file and upload to get URL */
  const addAmenity = () => {
    // Add empty amenity first so index is predictable
    setDetails((prev) => ({
      ...prev,
      amenities: [...prev.amenities, { title: '', image: '' }]
    }));

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e?.target?.files?.[0] as File | undefined;
      if (!file) return;

      try {
        const [url] = await uploadImagesAndGetUrls([file]);
        setDetails((prev) => {
          const updated = [...prev.amenities];
          updated[updated.length - 1].image = url;
          return { ...prev, amenities: updated };
        });
      } catch (err: any) {
        showToast('error', err?.message || 'Amenity image upload failed.');
      }
    };
    input.click();
  };

  const removeAmenity = (i: number) => {
    setDetails((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, idx) => idx !== i)
    }));
    showToast('info', 'Amenity removed.');
  };

  const updateAmenity = (i: number, field: keyof Amenity, v: string) => {
    const next = [...details.amenities];
    next[i] = { ...next[i], [field]: v };
    setDetails((prev) => ({ ...prev, amenities: next }));
  };

  /** Save details: include hotel context and only persistent URLs */
  const handleSaveDetails = async () => {
    const payload: SwimmingPoolDetails & { HotelId?: string } = {
      images: (details.images || []).filter(Boolean),
      poolDetails: details.poolDetails || '',
      timeAndAccess: details.timeAndAccess || '',
      amenities: (details.amenities || []).map((a) => ({
        title: a.title || '',
        image: a.image || '' // should already be persistent URL
      })),
      rulesAndRegulation: details.rulesAndRegulation || '',
      ...(hotelId ? { HotelId: hotelId } : {})
    };

    setSavingDetails(true);
    try {
      if (isExistingDetails) {
        await apiCall(
          'PUT',
          `api/services/swimming-pool-details${hotelId ? `?hotelId=${hotelId}` : ''}`,
          payload
        );
        showToast('success', 'Details updated successfully!');
      } else {
        await apiCall(
          'POST',
          `api/services/swimming-pool-details${hotelId ? `?hotelId=${hotelId}` : ''}`,
          payload
        );
        setIsExistingDetails(true);
        showToast('success', 'Details created successfully!');
      }
    } catch {
      showToast(
        'error',
        'Save failed. Please check your inputs and try again.'
      );
    } finally {
      setSavingDetails(false);
    }
  };

  /** -------------------- Slots: Direct add per-day -------------------- */
  const handleDayToggle = (day: Weekday) => {
    setDayInputs((prev) => ({
      ...prev,
      [day]: { ...prev[day], checked: !prev[day].checked }
    }));
  };

  const handleInputChange = (
    day: Weekday,
    field: 'from' | 'to' | 'maxPersons' | 'price',
    value: string
  ) => {
    setDayInputs((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleAddSlotNow = async (day: Weekday) => {
    const { from, to, maxPersons, price } = dayInputs[day];
    if (!from || !to || !maxPersons || !price) {
      return showToast(
        'warning',
        'Please fill From, To, Max Allowed, and Price.'
      );
    }

    const slotPayload = {
      dayOfWeek: day,
      startTime: from,
      endTime: to,
      price: parseFloat(price.replace(/[^\d.]/g, '')),
      maxCapacity: parseInt(maxPersons.replace(/[^\d]/g, ''), 10),
      ...(hotelId ? { HotelId: hotelId } : {})
    };

    setAddingForDay(day);
    try {
      // API expects { slots: [...] }
      const res = await apiCall(
        'POST',
        `api/services/swimming-pool-details/slots${hotelId ? `?hotelId=${hotelId}` : ''}`,
        { slots: [slotPayload] }
      );

      // Try to read created slot with _id (if API returns it),
      // otherwise show optimistically with a temp id.
      const created =
        (res?.data?.data && Array.isArray(res.data.data) && res.data.data[0]) ||
        (res?.data && Array.isArray(res.data.slots) && res.data.slots[0]) ||
        null;

      const newRow: ExistingSlotRow = {
        _id: created?._id || `temp-${Date.now()}`,
        dayOfWeek: day,
        startTime: slotPayload.startTime,
        endTime: slotPayload.endTime,
        price: slotPayload.price,
        maxCapacity: slotPayload.maxCapacity
      };

      setExistingSlots((prev) => [...prev, newRow]);

      // Clear that day's inputs & ensure checked
      setDayInputs((prev) => ({
        ...prev,
        [day]: { checked: true, from: '', to: '', maxPersons: '', price: '' }
      }));

      showToast('success', `Slot added to ${day}.`);
    } catch {
      showToast('error', 'Failed to add slot.');
    } finally {
      setAddingForDay(null);
    }
  };

  /** -------------------- Slots: Edit/Delete existing -------------------- */
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
        if (field === 'price')
          return { ...s, price: parseFloat(value.replace(/[^\d.]/g, '')) || 0 };
        if (field === 'maxCapacity')
          return {
            ...s,
            maxCapacity: parseInt(value.replace(/[^\d]/g, ''), 10) || 0
          };
        return { ...s, [field]: value };
      })
    );
  };

  const handleUpdateSlot = async (slot: ExistingSlotRow) => {
    setUpdatingSlotId(slot._id);
    try {
      await apiCall(
        'PUT',
        `api/services/swimming-pool-details/slots/${slot._id}${hotelId ? `?hotelId=${hotelId}` : ''}`,
        {
          dayOfWeek: String(slot.dayOfWeek),
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price,
          maxCapacity: slot.maxCapacity,
          ...(hotelId ? { HotelId: hotelId } : {})
        }
      );
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
      await apiCall(
        'DELETE',
        `api/services/swimming-pool-details/slots/${id}${hotelId ? `?hotelId=${hotelId}` : ''}`
      );
      setExistingSlots((prev) => prev.filter((s) => s._id !== id));
      showToast('success', 'Slot deleted successfully!');
    } catch {
      showToast('error', 'Failed to delete slot.');
    } finally {
      setDeletingSlotId(null);
    }
  };

  /** -------------------- Render -------------------- */
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[92%] max-w-6xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Swimming Pool</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-600">Loading…</div>
        ) : (
          <>
            {/* ========== DETAILS ========== */}
            <h3 className="text-base font-semibold mb-3">Details</h3>

            {/* Preview + Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Preview */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Preview</h4>
                <div className="relative h-44 w-full max-w-[260px] rounded-lg bg-[#F6EEE0] overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <PiCameraThin className="w-10 h-10 text-black/30" />
                    </div>
                  )}
                </div>
              </div>

              {/* Images (Preview + Persistent URLs) */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold mb-2">Images</h4>
                  <button
                    onClick={addImage}
                    className="px-3 py-1 text-sm rounded bg-[#8c6e35] text-white hover:bg-black"
                  >
                    + Add Image
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {details.images.map((url, i) => (
                    <div
                      key={i}
                      className="relative w-full h-40 rounded-lg overflow-hidden border bg-[#EFE9DF]"
                    >
                      {url ? (
                        <img
                          src={url}
                          alt={`img-${i}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <PiCameraThin className="w-10 h-10 text-black/30" />
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-2">
                        <button
                          className="flex-1 px-2 py-1 text-xs rounded bg-[#8c6e35] text-white hover:bg-blue-700"
                          onClick={() => setPreview(url || null)}
                        >
                          Preview
                        </button>
                        <button
                          className="flex-1 px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                          onClick={() => removeImage(i)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {details.images.length === 0 && (
                    <p className="text-sm text-gray-500 col-span-full">
                      No images yet. Click “Add Image”.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 mt-6">
              <div>
                <label className="text-sm font-semibold">Pool Details</label>
                <textarea
                  value={details.poolDetails}
                  onChange={(e) => updateField('poolDetails', e.target.value)}
                  rows={3}
                  className="mt-1 w-full border rounded px-3 py-2 bg-[#EFE9DF] resize"
                  placeholder="Write pool details…"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">
                    Time &amp; Access
                  </label>
                  <textarea
                    value={details.timeAndAccess}
                    onChange={(e) =>
                      updateField('timeAndAccess', e.target.value)
                    }
                    rows={3}
                    className="mt-1 w-full border rounded px-3 py-2 bg-[#EFE9DF]"
                    placeholder="e.g., Open 7 AM – 9 PM. Access for in-house guests only…"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">
                    Rules &amp; Regulations
                  </label>
                  <textarea
                    value={details.rulesAndRegulation}
                    onChange={(e) =>
                      updateField('rulesAndRegulation', e.target.value)
                    }
                    rows={3}
                    className="mt-1 w-full border rounded px-3 py-2 bg-[#EFE9DF]"
                    placeholder="Write rules…"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Amenities</h4>
                <button
                  onClick={addAmenity}
                  className="px-3 py-1 text-sm rounded bg-[#8c6e35] text-white hover:bg-black"
                >
                  + Add Amenity
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {details.amenities.map((a, i) => (
                  <div
                    key={i}
                    className="relative flex flex-col items-center rounded-lg border bg-[#EFE9DF] overflow-hidden"
                  >
                    {/* Amenity Image */}
                    <div className="w-full h-32 flex items-center justify-center bg-white">
                      {a.image ? (
                        <img
                          src={a.image}
                          alt={a.title || `amenity-${i}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = 'none';
                          }}
                        />
                      ) : (
                        <PiCameraThin className="w-10 h-10 text-black/30" />
                      )}
                    </div>

                    {/* Title */}
                    <div className="w-full px-2 py-2 bg-[#EFE9DF]">
                      <input
                        type="text"
                        value={a.title}
                        onChange={(e) =>
                          updateAmenity(i, 'title', e.target.value)
                        }
                        placeholder="Amenity title..."
                        className="w-full text-sm font-medium text-gray-800 text-center bg-transparent border-b border-gray-400 focus:outline-none focus:border-gray-600"
                      />
                    </div>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                        onClick={() => removeAmenity(i)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {details.amenities.length === 0 && (
                  <p className="text-sm text-gray-500 col-span-full">
                    No amenities yet. Click “Add Amenity”.
                  </p>
                )}
              </div>
            </div>

            {/* Save Details */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleSaveDetails}
                className="bg-[#A07D3D] text-white font-medium py-2 px-6 rounded hover:bg-[#8c6e35] disabled:opacity-60"
                disabled={savingDetails}
              >
                {savingDetails
                  ? 'Saving…'
                  : isExistingDetails
                    ? 'Update Details'
                    : 'Create Details'}
              </button>
            </div>

            {/* ========== SLOTS (inline per day) ========== */}
            <h3 className="text-base font-semibold mt-10 mb-3">Slots</h3>

            <div className="grid grid-cols-12 font-semibold text-gray-700 text-sm px-1 mb-2 gap-x-4">
              <span className="col-span-2">Select Availability</span>
              <span className="col-span-4">Select Time</span>
              <span className="col-span-2">Max Allowed</span>
              <span className="col-span-4">Price (Excluding GST)</span>
            </div>

            <div className="space-y-4">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="grid grid-cols-12 gap-x-4 items-start"
                >
                  {/* Checkbox + Day */}
                  <label className="flex items-center gap-2 col-span-2">
                    <input
                      type="checkbox"
                      checked={dayInputs[day].checked}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">{day}</span>
                  </label>

                  {/* From */}
                  <input
                    type="time"
                    value={dayInputs[day].from}
                    onChange={(e) =>
                      handleInputChange(day, 'from', e.target.value)
                    }
                    className="rounded border border-gray-300 px-3 py-1 bg-[#EFE9DF] col-span-2"
                  />

                  {/* To */}
                  <div className="col-span-2 relative">
                    <input
                      type="time"
                      value={dayInputs[day].to}
                      onChange={(e) =>
                        handleInputChange(day, 'to', e.target.value)
                      }
                      className="rounded border border-gray-300 px-3 py-1 w-full bg-[#EFE9DF]"
                    />
                  </div>

                  {/* Max Allowed */}
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={dayInputs[day].maxPersons}
                    onChange={(e) =>
                      handleInputChange(day, 'maxPersons', e.target.value)
                    }
                    className="rounded border border-gray-300 px-3 py-1 bg-[#EFE9DF] text-center col-span-2"
                  />

                  {/* Price + Plus (direct POST) */}
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
                      disabled={addingForDay === day}
                      className="w-6 h-6 flex items-center justify-center text-white bg-[#A07D3D] hover:bg-[#8c6e35] rounded-sm text-sm disabled:opacity-60"
                      title="Add slot now"
                    >
                      {addingForDay === day ? '…' : '+'}
                    </button>
                  </div>

                  {/* EXISTING slots for THIS day */}
                  {groupedExisting[day].length > 0 && (
                    <div className="col-span-12 mt-3 space-y-2">
                      {groupedExisting[day].map((s) => (
                        <div
                          key={s._id}
                          className="grid grid-cols-12 gap-3 items-center border rounded p-3"
                        >
                          {/* Day */}
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
                          {/* Start */}
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
                          {/* End */}
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
                          {/* Max */}
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
                          {/* Price */}
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

                          {/* Actions */}
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
                              {deletingSlotId === s._id
                                ? 'Deleting…'
                                : 'Delete'}
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

            {/* Footer */}
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

export default PriceTimeSettingSwimmingPool;
