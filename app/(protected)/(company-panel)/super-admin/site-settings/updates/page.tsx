'use client';

import { useState, useEffect } from 'react';
import {
  FiMoreVertical,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiTrendingUp,
  FiArrowLeft
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import apiCall from '@/lib/axios';
import { ENDPOINTS } from '@/lib/api-config';

export default function UpdatesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    category: '',
    image: ''
  });

  
  const fetchUpdates = async () => {
    try {
      const json = await apiCall('GET', ENDPOINTS.UPDATES);
      setItems(json.data || json || []);
    } catch (err) {
      console.error('Error fetching updates:', err);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `${ENDPOINTS.UPDATES}/${editingId}`
        : `${ENDPOINTS.UPDATES}/create`;
      const method = editingId ? 'PUT' : 'POST';

      await apiCall(method, url, formData);
      fetchUpdates();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        date: '',
        description: '',
        category: '',
        image: ''
      });
    } catch (err) {
      console.error('Error saving update:', err);
    }
  };

  
  const deleteItem = async (id: string) => {
    try {
      await apiCall('DELETE', `${ENDPOINTS.UPDATES}/${id}`);
      fetchUpdates();
    } catch (err) {
      console.error('Error deleting update:', err);
    }
  };

  
  const editItem = (item: any) => {
    setEditingId(item._id);
    setShowForm(true);
    setFormData({
      title: item.title,
      date: item.date,
      description: item.description,
      category: item.category,
      image: item.image
    });
  };

  return (
    <div className="p-6 w-full">
      {}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="text-[#3b2f1c] hover:opacity-70"
          >
            <FiArrowLeft size={20} />
          </button>

          <h1 className="text-2xl font-semibold text-[#3b2f1c] flex items-center gap-2">
            <FiTrendingUp className="text-[#9b743f]" /> Updates
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#9b743f] text-white px-4 py-2 rounded-md shadow-sm"
        >
          <FiPlus /> Add Update
        </motion.button>
      </motion.div>

      {}
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 py-16 text-center flex flex-col items-center gap-3"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/7187/7187948.png"
            alt="No updates"
            className="w-20 opacity-70"
          />
          <p className="text-lg font-medium">No updates found</p>
          <p className="text-sm opacity-70">Add your first update to begin</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              whileHover={{ scale: 1.01 }}
              className="border bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition relative"
            >
              <h3 className="font-semibold text-[#3b2f1c]">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>

              {}
              <button
                onClick={() => toggleDropdown(item._id)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded transition"
              >
                <FiMoreVertical size={18} />
              </button>

              {}
              <AnimatePresence>
                {openId === item._id && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-4 top-14 bg-white border rounded-lg shadow-md w-36 z-50 overflow-hidden"
                  >
                    <button
                      onClick={() => editItem(item)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full"
                    >
                      <FiEdit size={16} /> Edit
                    </button>

                    <button
                      onClick={() => deleteItem(item._id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full text-red-600"
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

      {}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
            >
              <h2 className="text-xl font-semibold text-[#3b2f1c] mb-4">
                {editingId ? 'Edit Update' : 'Add Update'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {}
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>

                {}
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>

                {}
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>

                {}
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <input
                    required
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>

                {}
                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <input
                    required
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#9b743f] text-white rounded-md"
                  >
                    {editingId ? 'Update' : 'Save'}
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
