'use client';

import { useEffect, useState } from 'react';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiArrowLeft,
  FiStar,
  FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import apiCall from '@/lib/axios';
import { ENDPOINTS } from '@/lib/api-config';

export default function BlogsPage() {
  const emptyForm = {
    title: '',
    image: '',
    description: '',
    content: '',
    contributor: '',
    article: '',
    date: '',
    BannerImage: '',
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

  // FETCH BLOGS FROM API
  const fetchBlogs = async () => {
    try {
      const data = await apiCall('GET', ENDPOINTS.BLOGS);
      console.log('Blog API Response:', data);

      // Handle different response structures
      if (data.data) {
        setItems(data.data);
      } else if (data.blogs) {
        setItems(data.blogs);
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
    fetchBlogs();
  }, []);

  // HANDLE SUBMIT → CREATE OR UPDATE
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = { ...formData };
    const url = editingId
      ? `${ENDPOINTS.BLOGS}/${editingId}`
      : `${ENDPOINTS.BLOGS}/createblogs`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const data = await apiCall(method, url, payload);
      fetchBlogs();
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (err: any) {
      console.log('Error submitting:', err);
      alert('Error: ' + (err.message || 'Failed to save blog'));
    }
  };

  // HANDLE DELETE CLICK
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // CONFIRM DELETE
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await apiCall('DELETE', `${ENDPOINTS.BLOGS}/${deleteId}`);
      setItems((prev) => prev.filter((b) => b._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err: any) {
      console.log('Delete Error:', err);
      alert('Delete failed: ' + (err.message || 'Unknown error'));
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  // HANDLE EDIT
  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      title: item.title || '',
      image: item.image || '',
      description: item.description || '',
      content: item.content || '',
      contributor: item.contributor || '',
      article: item.article || '',
      date: item.date || '',
      BannerImage: item.BannerImage || '',
      youtubeLink: item.youtubeLink || '',
      instagramLink: item.instagramLink || '',
      linkdinLink: item.linkdinLink || ''
    });
    setShowForm(true);
  };

  return (
    <div className="p-6 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="text-[#3b2f1c] hover:opacity-70"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-[#3b2f1c]">Blogs</h1>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData(emptyForm);
          }}
          className="flex items-center gap-2 bg-[#9b743f] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#825f34] transition-colors"
        >
          <FiPlus /> Add Blog
        </button>
      </div>

      {/* CARD GRID */}
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
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <p className="text-lg font-medium">No blogs found</p>
          <p className="text-sm opacity-70">Start by adding a new blog entry</p>
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
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                )}

                {/* Action Icons - Top Right */}
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

                {/* Rating Badge */}
                {item.ratingAvg > 0 && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-[#9b743f] text-white text-xs font-medium rounded-full shadow-sm flex items-center gap-1">
                      <FiStar size={12} fill="currentColor" />
                      {item.ratingAvg} ({item.ratingCount})
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
                  {item.description || 'No description available'}
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

                  {item.contributor && (
                    <span
                      className="text-[#9b743f] font-medium truncate max-w-[120px]"
                      title={item.contributor}
                    >
                      {item.contributor}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ADD/EDIT BLOG MODAL */}
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
              className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#9b743f] to-[#c49a5a]">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Edit Blog' : 'Add New Blog'}
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
                        type="text"
                        required
                        placeholder="Enter blog title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                      />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Brief description of the blog"
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

                    {/* CONTENT */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Content
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Full blog content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all resize-none"
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
                          type="text"
                          placeholder="Contributor name"
                          value={formData.contributor}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contributor: e.target.value
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                        />
                      </div>

                      {/* DATE */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Date
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3b2f1c] pb-2 border-b border-gray-200">
                      Media
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* IMAGE */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Main Image URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          value={formData.image}
                          onChange={(e) =>
                            setFormData({ ...formData, image: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                        />
                      </div>

                      {/* BANNER IMAGE */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Banner Image URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://example.com/banner.jpg"
                          value={formData.BannerImage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              BannerImage: e.target.value
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                        />
                      </div>
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
                        placeholder="Full article text"
                        value={formData.article}
                        onChange={(e) =>
                          setFormData({ ...formData, article: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all resize-none"
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
                          type="text"
                          placeholder="https://youtube.com/..."
                          value={formData.youtubeLink}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              youtubeLink: e.target.value
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                        />
                      </div>

                      {/* INSTAGRAM */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Instagram Link
                        </label>
                        <input
                          type="text"
                          placeholder="https://instagram.com/..."
                          value={formData.instagramLink}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instagramLink: e.target.value
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                        />
                      </div>

                      {/* LINKEDIN */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          LinkedIn Link
                        </label>
                        <input
                          type="text"
                          placeholder="https://linkedin.com/..."
                          value={formData.linkdinLink}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              linkdinLink: e.target.value
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#9b743f] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
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
                      {editingId ? 'Update Blog' : 'Create Blog'}
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
                  Delete Blog
                </h3>
                <p className="text-center text-gray-600 mb-6">
                  Are you sure you want to delete this blog? This action cannot
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
