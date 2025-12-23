'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import apiCall from '@/lib/axios';
import { ENDPOINTS } from '@/lib/api-config';

export default function NewsPage() {
  const emptyForm = {
    title: '',
    image: '',
    BannerImage: '',
    excerpt: '',
    description: '',
    content: '',
    contributor: '',
    date: '',
    category: '',
    source: '',
    article: '',
    youtubeLink: '',
    instagramLink: '',
    linkdinLink: ''
  };

  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // FETCH NEWS LIST
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await apiCall('GET', ENDPOINTS.NEWS);
        setItems(data.data || data || []);
      } catch (err) {
        console.log('fetch error:', err);
        setItems([]);
      }
    };
    fetchNews();
  }, []);

  // SUBMIT CREATE / EDIT
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = { ...formData };
    const url = editingId
      ? `${ENDPOINTS.NEWS}/${editingId}`
      : `${ENDPOINTS.NEWS}/createnews`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const json = await apiCall(method, url, payload);

      if (editingId) {
        setItems((prev) =>
          prev.map((n) => (n._id === editingId ? json.data || json : n))
        );
      } else {
        setItems((prev) => [json.data || json, ...prev]);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (err: any) {
      console.log('Error submitting:', err);
      alert('Validation failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await apiCall('DELETE', `${ENDPOINTS.NEWS}/${deleteId}`);
      setItems((prev) => prev.filter((n) => n._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err: any) {
      console.log('Delete Error:', err);
      alert('Delete failed: ' + (err.message || 'Unknown error'));
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="text-[#3b2f1c]"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-[#3b2f1c]">News</h1>
        </div>

        <button
          className="flex items-center gap-2 bg-[#9b743f] text-white px-4 py-2 rounded-md"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData(emptyForm);
          }}
        >
          <FiPlus /> Add News
        </button>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group"
          >
            {/* Image Preview */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Action Icons - Top Right */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(item._id);
                    setFormData(item);
                    setShowForm(true);
                  }}
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

              {/* Category Badge */}
              {item.category && (
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-[#9b743f] text-white text-xs font-medium rounded-full shadow-sm">
                    {item.category}
                  </span>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-5">
              <h3 className="font-semibold text-lg text-[#3b2f1c] mb-2 line-clamp-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.excerpt}
              </p>

              {/* Meta Info */}
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
                  {item.date
                    ? new Date(item.date).toLocaleDateString()
                    : 'No date'}
                </span>

                {item.source && (
                  <span
                    className="text-[#9b743f] font-medium truncate max-w-[120px]"
                    title={item.source}
                  >
                    {item.source}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FORM MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#9b743f] to-[#c49a5a]">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Edit News' : 'Add News'}
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

              {/* Modal Body - Scrollable */}
              <div className="overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3b2f1c] pb-2 border-b border-gray-200">
                      Basic Information
                    </h3>

                    {/* TITLE */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                        placeholder="Enter news title"
                        value={formData.title}
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </div>

                    {/* EXCERPT */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Excerpt <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all resize-none"
                        placeholder="Brief summary of the news"
                        value={formData.excerpt}
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, excerpt: e.target.value })
                        }
                      />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all resize-none"
                        placeholder="Detailed description"
                        value={formData.description}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value
                          })
                        }
                      />
                    </div>

                    {/* CONTENT */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Content
                      </label>
                      <textarea
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all resize-none"
                        placeholder="Full news content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Meta Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3b2f1c] pb-2 border-b border-gray-200">
                      Meta Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* CONTRIBUTOR */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Contributor
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                          placeholder="Contributor name"
                          value={formData.contributor}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contributor: e.target.value
                            })
                          }
                        />
                      </div>

                      {/* DATE */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                          value={formData.date}
                          required
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                        />
                      </div>

                      {/* CATEGORY */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                          placeholder="e.g., Technology, Business"
                          value={formData.category}
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value
                            })
                          }
                        />
                      </div>

                      {/* SOURCE */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Source <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                          placeholder="News source"
                          value={formData.source}
                          required
                          onChange={(e) =>
                            setFormData({ ...formData, source: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3b2f1c] pb-2 border-b border-gray-200">
                      Media
                    </h3>

                    {/* IMAGE URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Image URL
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                      />
                    </div>

                    {/* BANNER IMAGE */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Banner Image URL
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                        placeholder="https://example.com/banner.jpg"
                        value={formData.BannerImage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            BannerImage: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Article Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3b2f1c] pb-2 border-b border-gray-200">
                      Article
                    </h3>

                    {/* ARTICLE */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Article Content
                      </label>
                      <textarea
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all resize-none"
                        placeholder="Full article text"
                        value={formData.article}
                        onChange={(e) =>
                          setFormData({ ...formData, article: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Social Links Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3b2f1c] pb-2 border-b border-gray-200">
                      Social Links
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* YOUTUBE */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          YouTube Link
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                          placeholder="https://youtube.com/..."
                          value={formData.youtubeLink}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              youtubeLink: e.target.value
                            })
                          }
                        />
                      </div>

                      {/* INSTAGRAM */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Instagram Link
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                          placeholder="https://instagram.com/..."
                          value={formData.instagramLink}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instagramLink: e.target.value
                            })
                          }
                        />
                      </div>

                      {/* LINKEDIN */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          LinkedIn Link
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                          placeholder="https://linkedin.com/..."
                          value={formData.linkdinLink}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              linkdinLink: e.target.value
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        setFormData(emptyForm);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-[#9b743f] to-[#c49a5a] text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {editingId ? 'Update News' : 'Create News'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
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
                  Delete News
                </h3>
                <p className="text-center text-gray-600 mb-6">
                  Are you sure you want to delete this news? This action cannot
                  be undone.
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
