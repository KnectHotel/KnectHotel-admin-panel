'use client';

import { useEffect, useState } from 'react';
import { dummyHotels } from '@/data/foodPlans';
import AnimatedSelect from '@/components/ui/AnimatedSelect';

async function safeFetch(url: string) {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error();
    return await r.json();
  } catch {
    return null;
  }
}

export default function RoomCategoriesPage() {
  const local = [
    {
      id: 'rc1',
      hotelId: 'hotel101',
      name: 'Deluxe',
      description: 'Spacious deluxe rooms',
      status: 'Active'
    },
    {
      id: 'rc2',
      hotelId: 'hotel101',
      name: 'Suite',
      description: 'Suites',
      status: 'Active'
    }
  ];

  const [hotels, setHotels] = useState(dummyHotels);
  const [categories, setCategories] = useState(local);

  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showList, setShowList] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    (async () => {
      const h = await safeFetch('/api/hotels');
      const cats = await safeFetch('/api/room/categories');
      if (h) setHotels(h);
      if (cats) setCategories(cats);
    })();
  }, []);

  const load = () => {
    if (!selectedHotel || !selectedCategory) return;
    const it = categories.find(
      (c) => c.hotelId === selectedHotel && c.name === selectedCategory
    );
    if (it)
      setForm({
        name: it.name,
        description: it.description,
        status: it.status
      });
  };

  const save = () => {
    console.log('save category', { hotel: selectedHotel, ...form });
    alert('Saved (dummy)');
  };

  return (
    <div
      className="min-h-screen p-10 w-full"
      style={{ background: '#F1EBE1', color: '#5A4A38' }}
    >
      <h1 className="text-3xl font-bold mb-6">Room Category Manager</h1>

      <div
        className="rounded-xl p-8"
        style={{ background: '#fff', border: '1px solid #e8dfd2' }}
      >
        {/* TOP BAR */}
        {/* <div className="flex gap-4 items-end mb-6">
          <div className="flex-1">
            <AnimatedSelect
              label="Hotel"
              name="hotel"
              value={selectedHotel}
              searchable={true}
              options={hotels.map((h) => h._id)}
              onChange={(e: any) => setSelectedHotel(e.target.value)}
            />
          </div>

          <div className="w-64">
            <AnimatedSelect
              label="Category"
              name="category"
              value={selectedCategory}
              searchable={true}
              options={categories
                .filter((c) => c.hotelId === selectedHotel)
                .map((c) => c.name)}
              onChange={(e: any) => setSelectedCategory(e.target.value)}
            />
          </div>

          <button
            className="px-4 py-2 rounded text-white"
            style={{ background: '#B28A41' }}
            onClick={() => setShowList((s) => !s)}
            disabled={!selectedHotel}
          >
            {showList ? 'Hide' : 'View List'}
          </button>
        </div> */}

        {/* LIST TABLE */}
        {showList && (
          <div
            className="mb-6 p-4 rounded"
            style={{ background: '#F8F4ED', border: '1px solid #e8dfd2' }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ background: '#F1EBE1' }}>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {categories
                  .filter((c) => !selectedHotel || c.hotelId === selectedHotel)
                  .map((c, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{c.name}</td>
                      <td className="p-2">{c.description}</td>
                      <td className="p-2">{c.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* NAME */}
          <div className="w-full">
            <label className="block mb-1 font-medium">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 border rounded"
              style={{ borderColor: '#e8dfd2' }}
            />
          </div>

          {/* STATUS - AnimatedSelect */}
          <div className="w-full">
            <AnimatedSelect
              label="Status"
              name="status"
              value={form.status}
              searchable={false}
              onChange={(e: any) =>
                setForm({ ...form, status: e.target.value })
              }
              options={['Active', 'Inactive']}
            />
          </div>

          <div></div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-6">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: '#e8dfd2' }}
          />
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={load}
            className="px-4 py-2 rounded text-white"
            style={{ background: '#B28A41' }}
          >
            Load
          </button>

          <button
            onClick={save}
            className="px-4 py-2 rounded text-white"
            style={{ background: '#C82D5E' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
