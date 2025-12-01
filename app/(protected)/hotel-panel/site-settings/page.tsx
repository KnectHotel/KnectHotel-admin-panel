'use client';

import { useState } from 'react';

interface Amenity {
  name: string;
}

interface HotelPricing {
  weekday: number;
  weekend: number;
  extraGuests: number;
}

interface HotelContact {
  phone: string;
  email: string;
  address: string;
}

interface HotelStats {
  rating: number;
  totalReviews: number;
  yearsInBusiness: number;
  roomsAvailable: number;
}

interface HotelForm {
  name: string;
  location: string;
  banner: string;
  description: string;
  amenities: string[];
  features: string[];
  photos: string[];
  videos: string[];
  pricing: HotelPricing;
  contact: HotelContact;
  stats: HotelStats;
}

interface SavedHotel extends HotelForm {
  id: string;
}

export default function AdminHotelForm() {
  const [hotel, setHotel] = useState<HotelForm>({
    name: '',
    location: '',
    banner: '',
    description: '',
    amenities: [],
    features: [],
    photos: [],
    videos: [],
    pricing: {
      weekday: 0,
      weekend: 0,
      extraGuests: 0
    },
    contact: {
      phone: '',
      email: '',
      address: ''
    },
    stats: {
      rating: 0,
      totalReviews: 0,
      yearsInBusiness: 0,
      roomsAvailable: 0
    }
  });

  const [savedHotels, setSavedHotels] = useState<SavedHotel[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAmenity, setNewAmenity] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  const handlePricingChange = (field: keyof HotelPricing, value: number) => {
    setHotel((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [field]: value }
    }));
  };

  const handleContactChange = (field: keyof HotelContact, value: string) => {
    setHotel((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleStatsChange = (field: keyof HotelStats, value: number) => {
    setHotel((prev) => ({
      ...prev,
      stats: { ...prev.stats, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    if (editingId) {
      setSavedHotels((prev) =>
        prev.map((h) => (h.id === editingId ? { ...hotel, id: editingId } : h))
      );
      setEditingId(null);
    } else {
      const newHotel = { ...hotel, id: Date.now().toString() };
      setSavedHotels((prev) => [...prev, newHotel]);
    }

    setHotel({
      name: '',
      location: '',
      banner: '',
      description: '',
      amenities: [],
      features: [],
      photos: [],
      videos: [],
      pricing: { weekday: 0, weekend: 0, extraGuests: 0 },
      contact: { phone: '', email: '', address: '' },
      stats: {
        rating: 0,
        totalReviews: 0,
        yearsInBusiness: 0,
        roomsAvailable: 0
      }
    });
  };

  const handleEdit = (hotelData: SavedHotel) => {
    setHotel(hotelData);
    setEditingId(hotelData.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      setSavedHotels((prev) => prev.filter((h) => h.id !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setHotel({
      name: '',
      location: '',
      banner: '',
      description: '',
      amenities: [],
      features: [],
      photos: [],
      videos: [],
      pricing: { weekday: 0, weekend: 0, extraGuests: 0 },
      contact: { phone: '', email: '', address: '' },
      stats: {
        rating: 0,
        totalReviews: 0,
        yearsInBusiness: 0,
        roomsAvailable: 0
      }
    });
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPhoto(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setHotel((prev) => ({
              ...prev,
              photos: [...prev.photos, event.target!.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setHotel((prev) => ({
              ...prev,
              videos: [...prev.videos, event.target!.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeItem = (array: string[], index: number) => {
    return array.filter((_, i) => i !== index);
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f1e8] text-[#5a4a3a] p-10">
      <h1 className="text-4xl font-bold mb-8 text-[#7a6a54]">
        Admin Hotel Panel
      </h1>

      {/* FORM SECTION */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-[#7a6a54]">
          {editingId ? 'Edit Hotel' : 'Add New Hotel'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NAME */}
          <div>
            <label className="block mb-2 font-medium">Hotel Name</label>
            <input
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.name}
              onChange={(e) => setHotel({ ...hotel, name: e.target.value })}
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="block mb-2 font-medium">Location</label>
            <input
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.location}
              onChange={(e) => setHotel({ ...hotel, location: e.target.value })}
            />
          </div>

          {/* BANNER */}
          <div>
            <label className="block mb-2 font-medium">Banner Image URL</label>
            <input
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.banner}
              onChange={(e) => setHotel({ ...hotel, banner: e.target.value })}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              rows={4}
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.description}
              onChange={(e) =>
                setHotel({ ...hotel, description: e.target.value })
              }
            />
          </div>

          {/* AMENITIES */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Amenities</label>

            <div className="flex gap-3 mt-2">
              <input
                className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
                placeholder="Amenity"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
              />
              <button
                className="bg-[#b89968] text-white px-6 rounded hover:bg-[#a08858] transition"
                onClick={() => {
                  if (!newAmenity.trim()) return;
                  setHotel({
                    ...hotel,
                    amenities: [...hotel.amenities, newAmenity]
                  });
                  setNewAmenity('');
                }}
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap mt-2 gap-2">
              {hotel.amenities.map((a, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#f5f1e8] border border-[#d4c5b0] rounded text-sm flex items-center gap-2"
                >
                  {a}
                  <button
                    onClick={() =>
                      setHotel({
                        ...hotel,
                        amenities: removeItem(hotel.amenities, i)
                      })
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* FEATURES */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Features</label>

            <div className="flex gap-3 mt-2">
              <input
                className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
                placeholder="Feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
              />
              <button
                className="bg-[#b89968] text-white px-6 rounded hover:bg-[#a08858] transition"
                onClick={() => {
                  if (!newFeature.trim()) return;
                  setHotel({
                    ...hotel,
                    features: [...hotel.features, newFeature]
                  });
                  setNewFeature('');
                }}
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap mt-2 gap-2">
              {hotel.features.map((f, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#f5f1e8] border border-[#d4c5b0] rounded text-sm flex items-center gap-2"
                >
                  {f}
                  <button
                    onClick={() =>
                      setHotel({
                        ...hotel,
                        features: removeItem(hotel.features, i)
                      })
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* PHOTOS */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Photo URLs</label>
            <div className="flex gap-3 mt-2">
              <input
                className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
                placeholder="Image URL"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
              <button
                className="bg-[#b89968] text-white px-6 rounded hover:bg-[#a08858] transition"
                onClick={() => {
                  if (!photoURL.trim()) return;
                  setHotel({
                    ...hotel,
                    photos: [...hotel.photos, photoURL]
                  });
                  setPhotoURL('');
                }}
              >
                Add
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <div
              className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition ${
                isDraggingPhoto
                  ? 'border-[#b89968] bg-[#f5f1e8]'
                  : 'border-[#d4c5b0] bg-white'
              }`}
              onDrop={handlePhotoDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingPhoto(true);
              }}
              onDragLeave={() => setIsDraggingPhoto(false)}
            >
              <p className="text-[#7a6a54]">
                Drag & drop images here or paste URL above
              </p>
            </div>

            <div className="flex flex-wrap mt-2 gap-2">
              {hotel.photos.map((p, i) => (
                <div key={i} className="relative">
                  <img
                    src={p}
                    alt={`Photo ${i + 1}`}
                    className="w-24 h-24 object-cover rounded border border-[#d4c5b0]"
                  />
                  <button
                    onClick={() =>
                      setHotel({
                        ...hotel,
                        photos: removeItem(hotel.photos, i)
                      })
                    }
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* VIDEOS */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Video URLs</label>
            <div className="flex gap-3 mt-2">
              <input
                className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
                placeholder="Video URL"
                value={videoURL}
                onChange={(e) => setVideoURL(e.target.value)}
              />
              <button
                className="bg-[#b89968] text-white px-6 rounded hover:bg-[#a08858] transition"
                onClick={() => {
                  if (!videoURL.trim()) return;
                  setHotel({
                    ...hotel,
                    videos: [...hotel.videos, videoURL]
                  });
                  setVideoURL('');
                }}
              >
                Add
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <div
              className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition ${
                isDraggingVideo
                  ? 'border-[#b89968] bg-[#f5f1e8]'
                  : 'border-[#d4c5b0] bg-white'
              }`}
              onDrop={handleVideoDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingVideo(true);
              }}
              onDragLeave={() => setIsDraggingVideo(false)}
            >
              <p className="text-[#7a6a54]">
                Drag & drop videos here or paste URL above
              </p>
            </div>

            <div className="flex flex-wrap mt-2 gap-2">
              {hotel.videos.map((v, i) => (
                <div key={i} className="relative">
                  <video
                    src={v}
                    className="w-32 h-24 object-cover rounded border border-[#d4c5b0]"
                  />
                  <button
                    onClick={() =>
                      setHotel({
                        ...hotel,
                        videos: removeItem(hotel.videos, i)
                      })
                    }
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PRICING */}
          <div>
            <label className="block mb-2 font-medium">Weekday Price</label>
            <input
              type="number"
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.pricing.weekday}
              onChange={(e) =>
                handlePricingChange('weekday', Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Weekend Price</label>
            <input
              type="number"
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.pricing.weekend}
              onChange={(e) =>
                handlePricingChange('weekend', Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Extra Guests Price</label>
            <input
              type="number"
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.pricing.extraGuests}
              onChange={(e) =>
                handlePricingChange('extraGuests', Number(e.target.value))
              }
            />
          </div>

          {/* CONTACT */}
          <div>
            <label className="block mb-2 font-medium">Phone</label>
            <input
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.contact.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.contact.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Address</label>
            <input
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.contact.address}
              onChange={(e) => handleContactChange('address', e.target.value)}
            />
          </div>

          {/* STATS */}
          <div>
            <label className="block mb-2 font-medium">Rating</label>
            <input
              type="number"
              step="0.1"
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.stats.rating}
              onChange={(e) =>
                handleStatsChange('rating', Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Total Reviews</label>
            <input
              type="number"
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.stats.totalReviews}
              onChange={(e) =>
                handleStatsChange('totalReviews', Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Years in Business</label>
            <input
              type="number"
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.stats.yearsInBusiness}
              onChange={(e) =>
                handleStatsChange('yearsInBusiness', Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Rooms Available</label>
            <input
              type="number"
              className="w-full bg-[#f5f1e8] border border-[#d4c5b0] p-3 rounded focus:outline-none focus:border-[#b89968]"
              value={hotel.stats.roomsAvailable}
              onChange={(e) =>
                handleStatsChange('roomsAvailable', Number(e.target.value))
              }
            />
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2 mt-6 flex gap-4">
            <button
              onClick={handleSubmit}
              className="bg-[#b89968] text-white font-semibold px-6 py-4 rounded-lg flex-1 hover:bg-[#a08858] transition"
            >
              {editingId ? 'Update Hotel' : 'Save Hotel'}
            </button>
            {editingId && (
              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white font-semibold px-6 py-4 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SAVED HOTELS LIST */}
      {savedHotels.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6 text-[#7a6a54]">
            Saved Hotels ({savedHotels.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedHotels.map((h) => (
              <div
                key={h.id}
                className="bg-[#f5f1e8] rounded-lg p-6 border border-[#d4c5b0]"
              >
                {h.banner && (
                  <img
                    src={h.banner}
                    alt={h.name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-[#7a6a54] mb-2">
                  {h.name}
                </h3>
                <p className="text-sm text-[#7a6a54] mb-2">{h.location}</p>
                <p className="text-sm text-[#5a4a3a] mb-4 line-clamp-2">
                  {h.description}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(h)}
                    className="flex-1 bg-[#b89968] text-white py-2 rounded hover:bg-[#a08858] transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
