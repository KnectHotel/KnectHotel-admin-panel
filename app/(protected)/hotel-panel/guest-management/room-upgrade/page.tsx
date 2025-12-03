'use client';

import { useEffect, useState } from 'react';
import { dummyHotels } from '@/data/foodPlans';
import { dummyRoomTypes, dummyRoomUpgrades } from '@/data/roomUpgrades';
import AnimatedSelect from '@/components/ui/AnimatedSelect';
import { Upload, Plus, Trash } from 'lucide-react';

/* SAFE FETCH FOR BACKEND FALLBACK */
async function safeFetch(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch {
    return null;
  }
}

export default function RoomUpgradePage() {
  const [hotels, setHotels] = useState(dummyHotels);
  const [roomTypes, setRoomTypes] = useState(dummyRoomTypes);
  const [upgrades, setUpgrades] = useState(dummyRoomUpgrades);

  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [showList, setShowList] = useState(false);

  const [form, setForm] = useState({
    upgradeName: '',
    price: '',
    description: '',
    amenities: [] as string[],
    status: 'Active',
    image: null as File | null
  });

  const [amenityInput, setAmenityInput] = useState('');

  /* LOAD REAL DATA IF API EXISTS */
  useEffect(() => {
    async function load() {
      const apiHotels = await safeFetch('/api/hotels');
      const apiRoomTypes = await safeFetch('/api/room/types');
      const apiUpgrades = await safeFetch('/api/room-upgrades');

      if (apiHotels) setHotels(apiHotels);
      if (apiRoomTypes) setRoomTypes(apiRoomTypes);
      if (apiUpgrades) setUpgrades(apiUpgrades);
    }
    load();
  }, []);

  /* AUTO-LOAD EXISTING UPGRADE DETAILS */
  const loadUpgradeDetails = () => {
    if (!selectedHotel || !selectedRoomType) return;

    const item = upgrades.find(
      (u) => u.hotelId === selectedHotel && u.roomType === selectedRoomType
    );

    if (item) {
      setForm({
        upgradeName: item.upgradeName,
        price: item.price.toString(),
        description: item.description,
        amenities: item.amenities || [],
        status: item.status,
        image: null
      });
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: any) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const addAmenity = () => {
    if (!amenityInput.trim()) return;
    setForm({
      ...form,
      amenities: [...form.amenities, amenityInput.trim()]
    });
    setAmenityInput('');
  };

  const deleteAmenity = (i: number) => {
    const list = [...form.amenities];
    list.splice(i, 1);
    setForm({ ...form, amenities: list });
  };

  return (
    <div
      className="min-h-screen p-10 space-y-10 w-full"
      style={{ background: '#F1EBE1', color: '#5A4A38' }}
    >
      <h1 className="text-3xl font-bold">Room Upgrades</h1>

      {/* CARD */}
      <div
        className="rounded-xl shadow p-8 space-y-10"
        style={{ background: '#fff', border: '1px solid #e8dfd2' }}
      >
        {/* SELECT HOTEL + VIEW BUTTON */}
        {/* <div className="flex items-end gap-5">
          <div className="flex-1">
            <AnimatedSelect
              label="HOTEL"
              name="hotel"
              searchable={true}
              value={selectedHotel}
              onChange={(e: any) => {
                setSelectedHotel(e.target.value);
              }}
              options={hotels.map((h) => h._id)} // bind IDs
            />
          </div>

          <button
            onClick={() => setShowList(!showList)}
            className="px-5 py-3 rounded-md text-white font-semibold"
            style={{ background: '#B28A41' }}
            disabled={!selectedHotel}
          >
            {showList ? 'Hide Upgrades' : 'View All Upgrades'}
          </button>
        </div> */}

        {/* TABLE VIEW */}
        {showList && (
          <div
            className="rounded-md p-6"
            style={{ border: '1px solid #e8dfd2', background: '#F8F4ED' }}
          >
            <h2 className="text-xl font-semibold mb-4">All Room Upgrades</h2>

            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: '#F1EBE1' }}>
                  <th className="p-3 border">Room Type</th>
                  <th className="p-3 border">Upgrade</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>

              <tbody>
                {upgrades
                  .filter((u) => u.hotelId === selectedHotel)
                  .map((u, i) => (
                    <tr key={i} className="border">
                      <td className="p-3">{u.roomType}</td>
                      <td className="p-3">{u.upgradeName}</td>
                      <td className="p-3">₹{u.price}</td>
                      <td className="p-3">{u.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MAIN FORM */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <AnimatedSelect
            label="ROOM TYPE"
            name="roomType"
            searchable={true}
            value={selectedRoomType}
            onChange={(e: any) => {
              setSelectedRoomType(e.target.value);
              loadUpgradeDetails();
            }}
            options={roomTypes}
          />

          <InputBox
            label="UPGRADE NAME"
            name="upgradeName"
            value={form.upgradeName}
            onChange={handleChange}
          />

          <InputBox
            label="PRICE"
            name="price"
            value={form.price}
            onChange={handleChange}
          />

          <AnimatedSelect
            label="STATUS"
            name="status"
            searchable={false}
            value={form.status}
            onChange={(e: any) => setForm({ ...form, status: e.target.value })}
            options={['Active', 'Inactive']}
          />
        </div>

        {/* IMAGE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="font-medium text-sm mb-1 block">IMAGE</label>

            <label
              htmlFor="imgUpload"
              className="flex items-center gap-3 cursor-pointer px-4 py-3 rounded-md border"
              style={{ borderColor: '#e8dfd2' }}
            >
              <Upload size={20} />
              Choose File
            </label>

            <input
              id="imgUpload"
              type="file"
              className="hidden"
              onChange={handleImage}
            />

            {form.image && (
              <p className="mt-2 text-sm opacity-70">{form.image.name}</p>
            )}
          </div>
        </div>

        {/* AMENITIES */}
        <div>
          <label className="font-medium text-sm block">AMENITIES</label>

          <div className="flex gap-2 mt-2">
            <input
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              placeholder="Add amenity"
              className="flex-1 p-3 rounded-md border"
              style={{ borderColor: '#e8dfd2' }}
            />

            <button
              onClick={addAmenity}
              className="px-4 rounded-md text-white"
              style={{ background: '#B28A41' }}
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {form.amenities.map((a, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-md flex items-center gap-2"
                style={{
                  background: '#F1EBE1',
                  border: '1px solid #d6c8b5'
                }}
              >
                {a}
                <button onClick={() => deleteAmenity(i)}>
                  <Trash size={14} color="#C0392B" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-medium text-sm mb-1 block">DESCRIPTION</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 rounded-md border h-32"
            style={{ borderColor: '#e8dfd2' }}
          ></textarea>
        </div>

        <button
          className="px-6 py-3 rounded-md text-white font-semibold"
          style={{ background: '#C82D5E' }}
        >
          Save Upgrade
        </button>
      </div>
    </div>
  );
}

/* SMALL INPUT BOX */
function InputBox(props: any) {
  return (
    <div>
      <label className="font-medium text-sm mb-1 block">{props.label}</label>
      <input
        {...props}
        className="w-full p-3 rounded-md border"
        style={{ borderColor: '#e8dfd2' }}
      />
    </div>
  );
}
