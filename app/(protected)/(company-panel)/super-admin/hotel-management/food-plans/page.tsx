'use client';

import { useEffect, useState } from 'react';
import { dummyCategories, dummyMenuItems } from '@/data/menu';
import { dummyHotels } from '@/data/foodPlans';
import AnimatedSelect from '@/components/ui/AnimatedSelect';
import { Upload } from 'lucide-react';

async function safeFetch(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch {
    return null;
  }
}

export default function MenuItemPage() {
  const [hotels, setHotels] = useState(dummyHotels);
  const [categories, setCategories] = useState(dummyCategories);
  const [menuItems, setMenuItems] = useState(dummyMenuItems);

  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showMenuList, setShowMenuList] = useState(false);

  const [form, setForm] = useState({
    name: '',
    unitPrice: '',
    discountPrice: '',
    status: 'Active',
    description: '',
    image: null as File | null
  });

  useEffect(() => {
    async function loadAll() {
      const apiHotels = await safeFetch('/api/hotels');
      const apiCategories = await safeFetch('/api/menu/categories');
      const apiMenuItems = await safeFetch('/api/menu/items');

      if (apiHotels) setHotels(apiHotels);
      if (apiCategories) setCategories(apiCategories);
      if (apiMenuItems) setMenuItems(apiMenuItems);
    }

    loadAll();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: any) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const loadMenuItem = () => {
    if (!selectedHotel || !selectedCategory) return;

    const item = menuItems.find(
      (x) => x.hotelId === selectedHotel && x.category === selectedCategory
    );

    if (item) {
      setSelectedItem(item);
      setForm({
        name: item.name,
        unitPrice: item.unitPrice.toString(),
        discountPrice: item.discountPrice.toString(),
        status: item.status,
        description: item.description,
        image: null
      });
    }
  };

  return (
    <div
      className="min-h-screen p-10 space-y-10 w-full"
      style={{ background: '#F1EBE1', color: '#5A4A38' }}
    >
      <h1 className="text-3xl font-bold">Menu Item</h1>

      <div
        className="rounded-xl shadow p-8 space-y-10"
        style={{ background: '#fff', border: '1px solid #e8dfd2' }}
      >
        {}
        <div className="flex items-end gap-5">
          <div className="flex-1">
            <AnimatedSelect
              label="HOTEL"
              name="hotel"
              value={selectedHotel}
              searchable={true}
              onChange={(e: any) => {
                setSelectedHotel(e.target.value);
              }}
              options={hotels.map((h) => h.name)}
            />
          </div>

          <button
            onClick={() => setShowMenuList(!showMenuList)}
            className="px-5 py-3 rounded-md text-white font-semibold"
            style={{ background: '#B28A41' }}
            disabled={!selectedHotel}
          >
            {showMenuList ? 'Hide Menu List' : 'View Menu Items'}
          </button>
        </div>

        {}
        {showMenuList && (
          <div
            className="rounded-md p-6"
            style={{ border: '1px solid #e8dfd2', background: '#F8F4ED' }}
          >
            <h2 className="text-xl font-semibold mb-4">Full Menu</h2>

            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: '#F1EBE1' }}>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Discount</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>

              <tbody>
                {menuItems
                  .filter((m) => m.hotelId === selectedHotel)
                  .map((item, i) => (
                    <tr key={i} className="border">
                      <td className="p-3">{item.category}</td>
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">₹{item.unitPrice}</td>
                      <td className="p-3">₹{item.discountPrice}</td>
                      <td className="p-3">{item.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <AnimatedSelect
            label="CATEGORY"
            name="category"
            value={selectedCategory}
            searchable={true}
            onChange={(e: any) => {
              setSelectedCategory(e.target.value);
              loadMenuItem();
            }}
            options={categories}
          />

          <InputBox
            label="NAME"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <InputBox
            label="UNIT PRICE"
            name="unitPrice"
            value={form.unitPrice}
            onChange={handleChange}
          />

          <InputBox
            label="DISCOUNT PRICE"
            name="discountPrice"
            value={form.discountPrice}
            onChange={handleChange}
          />
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <AnimatedSelect
            label="STATUS"
            name="status"
            value={form.status}
            searchable={false}
            onChange={(e: any) => setForm({ ...form, status: e.target.value })}
            options={['Active', 'Inactive']}
          />

          <div>
            <label className="font-medium text-sm mb-1 block">IMAGE</label>

            <label
              htmlFor="imageUpload"
              className="flex items-center gap-3 cursor-pointer px-4 py-3 rounded-md border"
              style={{ borderColor: '#e8dfd2' }}
            >
              <Upload size={20} />
              Choose File
            </label>

            <input
              id="imageUpload"
              type="file"
              className="hidden"
              onChange={handleImage}
            />

            {form.image && (
              <p className="mt-2 text-sm opacity-70">{form.image.name}</p>
            )}
          </div>
        </div>

        {}
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
          Save
        </button>
      </div>
    </div>
  );
}


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
