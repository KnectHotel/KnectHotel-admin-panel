'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import apiCall from '@/lib/axios';
import { ENDPOINTS } from '@/lib/api-config';

export default function CollaborationPage() {
  const emptyForm = {
    name: '',
    description: '',
    logo: '',
    type: ''
  };

  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  
  const fetchCollaborations = async () => {
    try {
      const data = await apiCall('GET', ENDPOINTS.COLLABORATIONS);
      console.log('Collaboration API Response:', data);

      if (data.data) {
        setItems(data.data);
      } else if (data.collaborations) {
        setItems(data.collaborations);
      } else if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.log('Unexpected response format:', data);
        setItems([]);
      }
    } catch (err) {
      console.log('fetch error:', err);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, []);

  
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = { ...formData };
    const url = editingId
      ? `${ENDPOINTS.COLLABORATIONS}/${editingId}`
      : ENDPOINTS.COLLABORATIONS;
    const method = editingId ? 'PUT' : 'POST';

    try {
      await apiCall(method, url, payload);
      fetchCollaborations();
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (err: any) {
      console.log('Error submitting:', err);
      alert('Error: ' + (err.message || 'Failed to save collaboration'));
    }
  };

  
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await apiCall('DELETE', `${ENDPOINTS.COLLABORATIONS}/${deleteId}`);
      setItems((prev) => prev.filter((c) => c._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err: any) {
      console.log('Delete Error:', err);
      alert('Delete failed: ' + (err.message || 'Unknown error'));
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  
  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      logo: item.logo || '',
      type: item.type || ''
    });
    setShowForm(true);
  };

  return (
    <div className="p-6 w-full">
      {}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="text-[#3b2f1c] hover:opacity-70"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-[#3b2f1c]">
            Collaborations
          </h1>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData(emptyForm);
          }}
          className="flex items-center gap-2 bg-[#9b743f] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#825f34] transition-colors"
        >
          <FiPlus /> Add Collaboration
        </button>
      </div>

      {}
      {items.length === 0 ? (
        <div className="text-gray-500 py-16 text-center flex flex-col items-center gap-3">
          <svg
            className="w-20 h-20 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-lg font-medium">No collaborations found</p>
          <p className="text-sm opacity-70">
            Start by adding a new collaboration
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group"
            >
              {}
              <div className="relative h-48 bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] overflow-hidden">
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="w-full h-full object-contain p-8"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110"
                    title="Edit"
                  >
                    <FiEdit size={16} className="text-[#9b743f]" />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(item._id)}
                    className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110"
                    title="Delete"
                  >
                    <FiTrash2 size={16} className="text-red-500" />
                  </button>
                </div>

                {}
                {item.type && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-[#9b743f] text-white text-xs font-medium rounded-full shadow-sm">
                      {item.type}
                    </span>
                  </div>
                )}
              </div>

              {}
              <div className="p-5">
                <h3 className="font-semibold text-lg text-[#3b2f1c] mb-2 line-clamp-1">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {item.description || 'No description available'}
                </p>

                {}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : 'No date'}
                  </span>
                </div>
              </div>
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#9b743f] to-[#c49a5a]">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Edit Collaboration' : 'Add New Collaboration'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData(emptyForm);
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-all duration-200"
                  title="Close"
                >
                  <FiX size={24} className="text-white" />
                </button>
              </div>

              {}
              <div className="overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3b2f1c] pb-2 border-b border-gray-200">
                      Basic Information
                    </h3>

                    {}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter collaboration name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                      />
                    </div>

                    {}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Brief description of the collaboration"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    {}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Media, Technology, Business"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3b2f1c] pb-2 border-b border-gray-200">
                      Media
                    </h3>

                    {}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Logo URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com/logo.png"
                        value={formData.logo}
                        onChange={(e) =>
                          setFormData({ ...formData, logo: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        setFormData(emptyForm);
                      }}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-[#9b743f] to-[#c49a5a] text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {editingId
                        ? 'Update Collaboration'
                        : 'Create Collaboration'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <FiTrash2 size={24} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                  Delete Collaboration
                </h3>
                <p className="text-center text-gray-600 mb-6">
                  Are you sure you want to delete this collaboration? This
                  action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteId(null);
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
