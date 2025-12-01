'use client';

import { useEffect, useState } from 'react';
import { dummyHotels } from '@/data/foodPlans';
import AnimatedSelect from '@/components/ui/AnimatedSelect';
import { Plus, Trash } from 'lucide-react';

async function safeFetch(url: string) {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('API fail');
    return await r.json();
  } catch {
    return null;
  }
}

export default function CouponsPage() {
  // Dummy fallback
  const localDummy = [
    {
      id: 'c1',
      hotelId: 'hotel101',
      code: 'SPA10',
      type: 'percentage',
      value: 10,
      appliesTo: 'spa',
      status: 'Active',
      desc: '10% off spa'
    },
    {
      id: 'c2',
      hotelId: 'hotel101',
      code: 'ROOM50',
      type: 'fixed',
      value: 50,
      appliesTo: 'room',
      status: 'Inactive',
      desc: '₹50 off room'
    }
  ];

  const [hotels, setHotels] = useState(dummyHotels);
  const [coupons, setCoupons] = useState(localDummy);

  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedCouponCode, setSelectedCouponCode] = useState('');
  const [showList, setShowList] = useState(false);

  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    appliesTo: 'room',
    status: 'Active',
    desc: ''
  });

  useEffect(() => {
    (async () => {
      const apiHotels = await safeFetch('/api/hotels');
      const apiCoupons = await safeFetch('/api/coupons');
      if (apiHotels) setHotels(apiHotels);
      if (apiCoupons) setCoupons(apiCoupons);
    })();
  }, []);

  const loadCoupon = () => {
    if (!selectedHotel || !selectedCouponCode) return;
    const item = coupons.find(
      (c) => c.hotelId === selectedHotel && c.code === selectedCouponCode
    );
    if (!item) return;
    setForm({
      code: item.code,
      type: item.type,
      value: String(item.value),
      appliesTo: item.appliesTo,
      status: item.status,
      desc: item.desc || ''
    });
  };

  const handleSave = () => {
    // stub — replace with API call
    alert('Saved (dummy). Check console.');
    console.log('save coupon', { hotel: selectedHotel, ...form });
  };

  return (
    <div
      className="min-h-screen w-full p-10"
      style={{ background: '#F1EBE1', color: '#5A4A38' }}
    >
      <h1 className="text-3xl font-bold mb-6">Coupon Management</h1>

      <div
        className="rounded-xl p-8"
        style={{ background: '#fff', border: '1px solid #e8dfd2' }}
      >
        <div className="flex gap-4 items-end mb-4">
          {/* HOTEL */}
          <div className="flex-1">
            <AnimatedSelect
              label="Hotel"
              name="hotel"
              value={selectedHotel}
              searchable={true}
              onChange={(e: any) => setSelectedHotel(e.target.value)}
              options={hotels.map((h) => h._id)}
            />
          </div>

          {/* COUPON CODES */}
          <div className="w-60">
            <AnimatedSelect
              label="Select Coupon"
              name="coupon"
              value={selectedCouponCode}
              searchable={true}
              onChange={(e: any) => setSelectedCouponCode(e.target.value)}
              options={coupons
                .filter((c) => c.hotelId === selectedHotel)
                .map((c) => c.code)}
            />
          </div>

          <button
            className="px-4 py-2 rounded-md text-white"
            style={{ background: '#B28A41' }}
            disabled={!selectedHotel}
            onClick={() => setShowList((s) => !s)}
          >
            {showList ? 'Hide List' : 'View Coupons'}
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
                  <th className="p-2 text-left">Code</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Value</th>
                  <th className="p-2 text-left">Applies To</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {coupons
                  .filter((c) => !selectedHotel || c.hotelId === selectedHotel)
                  .map((c, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{c.code}</td>
                      <td className="p-2">{c.type}</td>
                      <td className="p-2">{c.value}</td>
                      <td className="p-2">{c.appliesTo}</td>
                      <td className="p-2">{c.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* CODE */}
          <div className="w-full">
            <label className="block font-medium mb-1">Code</label>
            <input
              name="code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full p-3 border rounded"
              style={{ borderColor: '#e8dfd2' }}
            />
          </div>

          {/* TYPE */}
          <div className="w-full">
            <AnimatedSelect
              label="Type"
              name="type"
              value={form.type}
              searchable={false}
              onChange={(e: any) => setForm({ ...form, type: e.target.value })}
              options={['Percentage', 'Fixed Amount']}
            />
          </div>

          {/* VALUE */}
          <div className="w-full">
            <label className="block font-medium mb-1">Value</label>
            <input
              name="value"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="w-full p-3 border rounded"
              style={{ borderColor: '#e8dfd2' }}
            />
          </div>

          {/* APPLIES TO */}
          <div className="w-full">
            <div className="w-full">
              <AnimatedSelect
                label="Type"
                name="type"
                value={form.type}
                searchable={false}
                onChange={(e: any) =>
                  setForm({ ...form, type: e.target.value })
                }
                options={['Room', 'Spa', 'In Room Dining']}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: '#e8dfd2' }}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={loadCoupon}
            className="px-4 py-2 rounded text-white"
            style={{ background: '#B28A41' }}
          >
            Load
          </button>
          <button
            onClick={handleSave}
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
