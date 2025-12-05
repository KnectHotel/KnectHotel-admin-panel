'use client';

import { useEffect, useState } from 'react';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiArrowLeft,
  FiStar
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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

  // FETCH BLOGS FROM API
  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/blogsdetails');
      const data = await res.json();
      console.log('Blog API Response:', data); // Debug log
      
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
    let url = 'http://localhost:3001/api/blogsdetails/createblogs';
    let method = 'POST';

    if (editingId) {
      url = `http://localhost:3001/api/blogsdetails/${editingId}`;
      method = 'PUT';
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        fetchBlogs(); // refresh list
        setShowForm(false);
        setEditingId(null);
        setFormData(emptyForm);
      } else {
        alert('Error: ' + (data.message || 'Failed to save blog'));
      }
    } catch (err) {
      console.log('Error submitting:', err);
      alert('Failed to save blog');
    }
  };

  // DELETE BLOG
  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const res = await fetch(`http://localhost:3001/api/blogsdetails/${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok) {
        setItems((prev) => prev.filter((b) => b._id !== id));
      } else {
        alert('Delete failed: ' + data.message);
      }
    } catch (err) {
      console.log('Delete Error:', err);
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
                    onClick={() => deleteBlog(item._id)}
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8 border border-gray-200 overflow-y-auto max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#3b2f1c]">
                  {editingId ? 'Edit Blog' : 'Add New Blog'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData(emptyForm);
                  }}
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* TITLE */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b743f] transition-all duration-200"
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b743f] transition-all duration-200"
                  />
                </div>

                {/* CONTENT */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Content</label>
                  <textarea
                    rows={4}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b743f] transition-all duration-200"
                  />
                </div>

                {/* IMAGE */}
                <div>
                  <label className="text-sm font-medium">Main Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                {/* BANNER IMAGE */}
                <div>
                  <label className="text-sm font-medium">
                    Banner Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.BannerImage}
                    onChange={(e) =>
                      setFormData({ ...formData, BannerImage: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                {/* CONTRIBUTOR */}
                <div>
                  <label className="text-sm font-medium">Contributor</label>
                  <input
                    type="text"
                    value={formData.contributor}
                    onChange={(e) =>
                      setFormData({ ...formData, contributor: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                {/* DATE */}
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                {/* ARTICLE */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Article</label>
                  <textarea
                    rows={3}
                    value={formData.article}
                    onChange={(e) =>
                      setFormData({ ...formData, article: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                {/* SOCIAL LINKS */}
                <div>
                  <label className="text-sm font-medium">YouTube Link</label>
                  <input
                    type="text"
                    value={formData.youtubeLink}
                    onChange={(e) =>
                      setFormData({ ...formData, youtubeLink: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Instagram Link</label>
                  <input
                    type="text"
                    value={formData.instagramLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        instagramLink: e.target.value
                      })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">LinkedIn Link</label>
                  <input
                    type="text"
                    value={formData.linkdinLink}
                    onChange={(e) =>
                      setFormData({ ...formData, linkdinLink: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                {/* BUTTONS */}
                <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData(emptyForm);
                    }}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#9b743f] text-white rounded-lg hover:bg-[#825f34] transition-all"
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
