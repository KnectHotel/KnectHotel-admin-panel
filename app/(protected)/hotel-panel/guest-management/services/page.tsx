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

export default function ServicesPage() {
  const local = [
    {
      id: 's1',
      hotelId: 'hotel101',
      name: 'Spa',
      price: 1200,
      status: 'Active',
      desc: 'Relaxing spa package'
    },
    {
      id: 's2',
      hotelId: 'hotel101',
      name: 'Laundry',
      price: 200,
      status: 'Active',
      desc: 'Per piece'
    }
  ];

  const [hotels, setHotels] = useState(dummyHotels);
  const [services, setServices] = useState(local);

  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [showList, setShowList] = useState(false);

  const [form, setForm] = useState({
    name: '',
    price: '',
    status: 'Active',
    desc: ''
  });

  useEffect(() => {
    (async () => {
      const h = await safeFetch('/api/hotels');
      const s = await safeFetch('/api/services');
      if (h) setHotels(h);
      if (s) setServices(s);
    })();
  }, []);

  const load = () => {
    if (!selectedHotel || !selectedService) return;

    const it = services.find(
      (sv) => sv.hotelId === selectedHotel && sv.name === selectedService
    );

    if (it)
      setForm({
        name: it.name,
        price: String(it.price),
        status: it.status,
        desc: it.desc
      });
  };

  const save = () => {
    console.log('save service', { hotel: selectedHotel, ...form });
    alert('Saved (dummy)');
  };

  return (
    <div
      className="min-h-screen p-10 w-full"
      style={{ background: '#F1EBE1', color: '#5A4A38' }}
    >
      <h1 className="text-3xl font-bold mb-6">Hotel Services</h1>

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
              searchable
              onChange={(e: any) => setSelectedHotel(e.target.value)}
              options={hotels.map((h) => h._id)}
            />
          </div>

          <div className="w-64">
            <AnimatedSelect
              label="Service"
              name="service"
              value={selectedService}
              searchable
              onChange={(e: any) => setSelectedService(e.target.value)}
              options={services
                .filter((s) => s.hotelId === selectedHotel)
                .map((s) => s.name)}
            />
          </div>

          <button
            className="px-4 py-2 rounded text-white"
            style={{ background: '#B28A41' }}
            disabled={!selectedHotel}
            onClick={() => setShowList((s) => !s)}
          >
            {showList ? 'Hide' : 'View Services'}
          </button>
        </div>
 */}
        {/* TABLE */}
        {showList && (
          <div
            className="mb-6 p-4 rounded"
            style={{ background: '#F8F4ED', border: '1px solid #e8dfd2' }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ background: '#F1EBE1' }}>
                  <th className="p-2 text-left">Service</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {services
                  .filter((s) => !selectedHotel || s.hotelId === selectedHotel)
                  .map((s, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{s.name}</td>
                      <td className="p-2">₹{s.price}</td>
                      <td className="p-2">{s.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="w-full">
            <label className="block mb-1 font-medium">Service Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 border rounded"
              style={{ borderColor: '#e8dfd2' }}
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 font-medium">Price</label>
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full p-3 border rounded"
              style={{ borderColor: '#e8dfd2' }}
            />
          </div>

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
        </div>

        {/* DESCRIPTION */}
        <div className="mt-6">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: '#e8dfd2' }}
          />
        </div>

        {/* ACTION BUTTONS */}
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
