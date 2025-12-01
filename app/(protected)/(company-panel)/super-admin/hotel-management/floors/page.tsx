'use client';

import { useEffect, useState } from 'react';
import { dummyHotels } from '@/data/foodPlans';
import AnimatedSelect from '@/components/ui/AnimatedSelect';

/* safeFetch identical to earlier — inline for brevity */
async function safeFetch(url: string) {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error();
    return await r.json();
  } catch {
    return null;
  }
}

export default function FloorsPage() {
  const local = [
    { id: 'f1', hotelId: 'hotel101', floorNo: 1, name: 'Ground', rooms: 20 },
    { id: 'f2', hotelId: 'hotel101', floorNo: 2, name: 'First', rooms: 18 }
  ];

  const [hotels, setHotels] = useState(dummyHotels);
  const [floors, setFloors] = useState(local);

  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [showList, setShowList] = useState(false);

  const [form, setForm] = useState({ floorNo: '', name: '', rooms: '' });

  useEffect(() => {
    (async () => {
      const h = await safeFetch('/api/hotels');
      const f = await safeFetch('/api/hotels/floors');
      if (h) setHotels(h);
      if (f) setFloors(f);
    })();
  }, []);

  const load = () => {
    if (!selectedHotel || !selectedFloor) return;
    const it = floors.find(
      (fl) =>
        fl.hotelId === selectedHotel && String(fl.floorNo) === selectedFloor
    );
    if (it)
      setForm({
        floorNo: String(it.floorNo),
        name: it.name,
        rooms: String(it.rooms)
      });
  };
  const save = () => {
    console.log('save floor', { hotel: selectedHotel, ...form });
    alert('Saved (dummy)');
  };

  return (
    <div
      className="min-h-screen p-10 w-full"
      style={{ background: '#F1EBE1', color: '#5A4A38' }}
    >
      <h1 className="text-3xl font-bold mb-6">Floor Manager</h1>

      <div
        className="rounded-xl p-8"
        style={{ background: '#fff', border: '1px solid #e8dfd2' }}
      >
        <div className="flex gap-4 items-end mb-4">
          <div className="flex-1">
            <AnimatedSelect
              label="Hotel"
              name="hotel"
              value={selectedHotel}
              searchable
              onChange={(e: any) => setSelectedHotel(e.target.value)}
              options={hotels.map((h) => h._id)}
            />
          </div>
          <div className="w-48">
            <AnimatedSelect
              label="Floor"
              name="floor"
              value={selectedFloor}
              searchable
              onChange={(e: any) => setSelectedFloor(e.target.value)}
              options={floors
                .filter((f) => f.hotelId === selectedHotel)
                .map((f) => String(f.floorNo))}
            />
          </div>
          <button
            className="px-4 py-2 rounded text-white"
            style={{ background: '#B28A41' }}
            onClick={() => setShowList((s) => !s)}
            disabled={!selectedHotel}
          >
            {showList ? 'Hide' : 'View Floors'}
          </button>
        </div>

        {showList && (
          <div
            className="mb-4 p-4 rounded"
            style={{ background: '#F8F4ED', border: '1px solid #e8dfd2' }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ background: '#F1EBE1' }}>
                  <th className="p-2">Floor</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Rooms</th>
                </tr>
              </thead>
              <tbody>
                {floors
                  .filter((f) => !selectedHotel || f.hotelId === selectedHotel)
                  .map((f, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{f.floorNo}</td>
                      <td className="p-2">{f.name}</td>
                      <td className="p-2">{f.rooms}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Floor No</label>
            <input
              value={form.floorNo}
              onChange={(e) => setForm({ ...form, floorNo: e.target.value })}
              className="w-full p-2 border rounded"
              style={{ borderColor: '#e8dfd2' }}
            />
          </div>
          <div>
            <label className="block mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded"
              style={{ borderColor: '#e8dfd2' }}
            />
          </div>
          <div>
            <label className="block mb-1">Rooms</label>
            <input
              value={form.rooms}
              onChange={(e) => setForm({ ...form, rooms: e.target.value })}
              className="w-full p-2 border rounded"
              style={{ borderColor: '#e8dfd2' }}
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={load}
            className="px-4 py-2 mr-2 rounded"
            style={{ background: '#B28A41', color: '#fff' }}
          >
            Load
          </button>
          <button
            onClick={save}
            className="px-4 py-2 rounded"
            style={{ background: '#C82D5E', color: '#fff' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
