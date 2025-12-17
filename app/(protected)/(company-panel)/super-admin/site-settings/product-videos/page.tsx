'use client';

import { useState, useEffect } from 'react';
import {
  FiMoreVertical,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiPlayCircle,
  FiArrowLeft
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import { API_BASE_URL } from '@/lib/api-config';

const API_BASE = `${API_BASE_URL}/product_videos`;

export default function ProductVideosPage() {
  const [items, setItems] = useState<any[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    thumbnail: "",
  });

  // FETCH PRODUCT VIDEOS
  const fetchVideos = async () => {
    try {
      const res = await fetch(API_BASE);
      const json = await res.json();
      setItems(json.data || []);
    } catch (err) {
      console.error("Error loading videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // CREATE / UPDATE
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        fetchVideos();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          title: "",
          description: "",
          duration: "",
          thumbnail: "",
        });
      }
    } catch (err) {
      console.error("Error saving video:", err);
    }
  };

  // DELETE
  const deleteVideo = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) fetchVideos();
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  // OPEN EDIT FORM
  const editVideo = (item: any) => {
    setEditingId(item._id);
    setShowForm(true);

    setFormData({
      title: item.title,
      description: item.description,
      duration: item.duration,
      thumbnail: item.thumbnail,
    });
  };

  return (
    <div className="p-6 w-full">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="text-[#3b2f1c]">
            <FiArrowLeft size={20} />
          </button>

          <h1 className="text-2xl font-semibold text-[#3b2f1c] flex items-center gap-2">
            <FiPlayCircle className="text-[#9b743f]" /> Product Videos
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setEditingId(null);
            setFormData({ title: "", description: "", duration: "", thumbnail: "" });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#9b743f] text-white px-4 py-2 rounded-md"
        >
          <FiPlus /> Add Video
        </motion.button>
      </motion.div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7187/7187948.png"
            className="w-20 mx-auto opacity-70"
          />
          <p className="text-lg font-medium mt-4">No product videos found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="border bg-white rounded-xl p-5 shadow-sm relative"
            >
              <h3 className="font-semibold text-[#3b2f1c]">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>

              <div className="mt-2 text-xs text-gray-500">
                Duration: {item.duration}
              </div>

              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt="Thumbnail"
                  className="w-32 h-20 object-cover rounded-md mt-3 border"
                />
              )}

              {/* Dropdown */}
              <button
                onClick={() => toggleDropdown(item._id)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded"
              >
                <FiMoreVertical size={18} />
              </button>

              <AnimatePresence>
                {openId === item._id && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-4 top-14 bg-white border rounded-lg shadow-md w-36"
                  >
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => editVideo(item)}
                    >
                      <FiEdit size={16} /> Edit
                    </button>

                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                      onClick={() => deleteVideo(item._id)}
                    >
                      <FiTrash2 size={16} /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* FORM MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 text-[#3b2f1c]">
                {editingId ? "Edit Product Video" : "Add Product Video"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 02:15"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="text-sm font-medium">Thumbnail URL</label>
                  <input
                    required
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail: e.target.value })
                    }
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#9b743f] text-white rounded-md"
                  >
                    {editingId ? "Update" : "Save"}
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
