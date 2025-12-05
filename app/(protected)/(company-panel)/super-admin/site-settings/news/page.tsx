'use client';

import { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiArrowLeft
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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

  // FETCH NEWS LIST
  useEffect(() => {
    fetch('http://localhost:3001/api/news')
      .then((res) => res.json())
      .then((data) => {
        setItems(data.data || []);
      });
  }, []);

  // SUBMIT CREATE / EDIT
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = { ...formData };

    let url = 'http://localhost:3001/api/news/createnews';
    let method = 'POST';

    if (editingId) {
      url = `http://localhost:3001/api/news/${editingId}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (!json.success) {
      alert('Validation failed: ' + json.message);
      return;
    }

    if (editingId) {
      setItems((prev) =>
        prev.map((n) => (n._id === editingId ? json.data : n))
      );
    } else {
      setItems((prev) => [json.data, ...prev]);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const deleteNews = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news?')) return;

    try {
      const res = await fetch(`http://localhost:3001/api/news/${id}`, {
        method: 'DELETE'
      });

      const json = await res.json();

      if (!json.success) {
        alert('Delete failed: ' + json.message);
        return;
      }

      // Remove from UI instantly
      setItems((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.log('Delete Error:', err);
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
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                  onClick={() => deleteNews(item._id)}
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
                </span>
                
                {item.source && (
                  <span className="text-[#9b743f] font-medium truncate max-w-[120px]" title={item.source}>
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
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div className="bg-white w-full max-w-3xl rounded-2xl p-8 shadow overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold mb-4">
                {editingId ? 'Edit News' : 'Add News'}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* TITLE */}
                <div className="md:col-span-2">
                  <label>Title</label>
                  <input
                    className="w-full border rounded p-2 mt-1"
                    value={formData.title}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                {/* EXCERPT */}
                <div className="md:col-span-2">
                  <label>Excerpt</label>
                  <textarea
                    rows={2}
                    className="w-full border rounded p-2 mt-1"
                    value={formData.excerpt}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="md:col-span-2">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    className="w-full border rounded p-2 mt-1"
                    value={formData.description}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* CONTENT */}
                <div className="md:col-span-2">
                  <label>Content</label>
                  <textarea
                    rows={4}
                    className="w-full border rounded p-2 mt-1"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                  />
                </div>

                {/* CONTRIBUTOR */}
                <div>
                  <label>Contributor</label>
                  <input
                    className="w-full border rounded p-2 mt-1"
                    value={formData.contributor}
                    onChange={(e) =>
                      setFormData({ ...formData, contributor: e.target.value })
                    }
                  />
                </div>

                {/* DATE */}
                <div>
                  <label>Date</label>
                  <input
                    type="date"
                    className="w-full border rounded p-2 mt-1"
                    value={formData.date}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label>Category</label>
                  <input
                    className="w-full border rounded p-2 mt-1"
                    value={formData.category}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>

                {/* SOURCE */}
                <div>
                  <label>Source</label>
                  <input
                    className="w-full border rounded p-2 mt-1"
                    value={formData.source}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                  />
                </div>

                {/* IMAGE URL */}
                <div className="md:col-span-2">
                  <label>Image URL</label>
                  <input
                    className="w-full border rounded p-2 mt-1"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>

                {/* BANNER IMAGE */}
                <div className="md:col-span-2">
                  <label>Banner Image</label>
                  <input
                    className="w-full border rounded p-2 mt-1"
                    value={formData.BannerImage}
                    onChange={(e) =>
                      setFormData({ ...formData, BannerImage: e.target.value })
                    }
                  />
                </div>

                {/* ARTICLE */}
                <div className="md:col-span-2">
                  <label>Article</label>
                  <textarea
                    rows={3}
                    className="w-full border rounded p-2 mt-1"
                    value={formData.article}
                    onChange={(e) =>
                      setFormData({ ...formData, article: e.target.value })
                    }
                  />
                </div>

                {/* SOCIAL LINKS */}
                <div>
                  <label>YouTube</label>
                  <input
                    className="w-full border rounded p-2 mt-1"
                    value={formData.youtubeLink}
                    onChange={(e) =>
                      setFormData({ ...formData, youtubeLink: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label>Instagram</label>
                  <input
                    className="w-full border rounded p-2 mt-1"
                    value={formData.instagramLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        instagramLink: e.target.value
                      })
                    }
                  />
                </div>

                <div>
                  <label>LinkedIn</label>
                  <input
                    className="w-full border rounded p-2 mt-1"
                    value={formData.linkdinLink}
                    onChange={(e) =>
                      setFormData({ ...formData, linkdinLink: e.target.value })
                    }
                  />
                </div>

                {/* BUTTONS */}
                <div className="md:col-span-2 flex justify-end gap-4">
                  <button
                    type="button"
                    className="px-5 py-2 border rounded"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#9b743f] text-white rounded"
                  >
                    Save
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
