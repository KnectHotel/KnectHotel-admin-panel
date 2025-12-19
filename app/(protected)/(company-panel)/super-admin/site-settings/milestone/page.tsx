'use client';

import { useState, useEffect } from 'react';
import {
  FiMoreVertical,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiFlag,
  FiArrowLeft
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import apiCall from '@/lib/axios';
import { ENDPOINTS } from '@/lib/api-config';

export default function MilestonesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    details: '',
    achievement: '',
    images: ''
  });

  // FETCH MILESTONES
  const fetchMilestones = async () => {
    try {
      const json = await apiCall('GET', ENDPOINTS.MILESTONE);
      setItems(json.data || json || []);
    } catch (err) {
      console.error('Error loading milestones:', err);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // CREATE / UPDATE
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `${ENDPOINTS.MILESTONE}/${editingId}`
        : ENDPOINTS.MILESTONE;
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        images: formData.images.split(',').map((img) => img.trim())
      };

      await apiCall(method, url, payload);
      fetchMilestones();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        year: '',
        title: '',
        description: '',
        details: '',
        achievement: '',
        images: ''
      });
    } catch (err) {
      console.error('Error saving milestone:', err);
    }
  };

  // DELETE
  const deleteItem = async (id: string) => {
    try {
      await apiCall('DELETE', `${ENDPOINTS.MILESTONE}/${id}`);
      fetchMilestones();
    } catch (err) {
      console.error('Error deleting milestone:', err);
    }
  };

  // OPEN EDIT FORM
  const editItem = (item: any) => {
    setEditingId(item._id);
    setShowForm(true);

    setFormData({
      year: item.year,
      title: item.title,
      description: item.description,
      details: item.details,
      achievement: item.achievement,
      images: item.images.join(', ')
    });
  };

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="text-[#3b2f1c]"
          >
            <FiArrowLeft size={20} />
          </button>

          <h1 className="text-2xl font-semibold text-[#3b2f1c] flex items-center gap-2">
            <FiFlag className="text-[#9b743f]" /> Milestones
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setEditingId(null);
            setFormData({
              year: '',
              title: '',
              description: '',
              details: '',
              achievement: '',
              images: ''
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#9b743f] text-white px-4 py-2 rounded-md"
        >
          <FiPlus /> Add Milestone
        </motion.button>
      </motion.div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7187/7187948.png"
            className="w-20 mx-auto opacity-70"
          />
          <p className="text-lg font-medium mt-4">No milestones found</p>
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
              <h3 className="font-semibold text-[#3b2f1c]">
                {item.year} – {item.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>

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
                      onClick={() => editItem(item)}
                    >
                      <FiEdit size={16} /> Edit
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                      onClick={() => deleteItem(item._id)}
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
                {editingId ? 'Edit Milestone' : 'Add Milestone'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                {[
                  'year',
                  'title',
                  'description',
                  'details',
                  'achievement',
                  'images'
                ].map((field) => (
                  <div key={field}>
                    <label className="text-sm font-medium capitalize">
                      {field}
                    </label>

                    {field === 'description' || field === 'details' ? (
                      <textarea
                        required
                        rows={3}
                        value={(formData as any)[field]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                        className="w-full mt-1 p-2 border rounded-md"
                      />
                    ) : (
                      <input
                        required
                        type="text"
                        value={(formData as any)[field]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                        className="w-full mt-1 p-2 border rounded-md"
                      />
                    )}

                    {field === 'images' && (
                      <p className="text-xs text-gray-500 mt-1">
                        Add multiple image URLs separated by commas.
                      </p>
                    )}
                  </div>
                ))}

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
