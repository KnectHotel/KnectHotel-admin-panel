'use client';

import { useState, useEffect } from 'react';
import {
  FiMoreVertical,
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
  const [openId, setOpenId] = useState<string | null>(null);

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

  const toggleDropdown = (id: string) => {
    setOpenId(openId === id ? null : id);
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

      {/* LIST */}
      {items.map((item) => (
        <div
          key={item._id}
          className="border bg-white rounded-xl p-5 shadow-sm relative"
        >
          <h3 className="font-semibold text-[#3b2f1c]">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.excerpt}</p>

          {/* Dropdown trigger */}
          <button
            className="absolute top-4 right-4 p-2"
            onClick={() => toggleDropdown(item._id)}
          >
            <FiMoreVertical size={18} />
          </button>

          {/* Dropdown (INSIDE MAP ONLY) */}
          <AnimatePresence>
            {openId === item._id && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-4 top-0 bg-white border rounded-lg shadow-md w-36 overflow-hidden"
              >
                <button
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={() => {
                    setEditingId(item._id);
                    setFormData(item);
                    setShowForm(true);
                  }}
                >
                  <FiEdit size={16} /> Edit
                </button>

                <button
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  onClick={() => deleteNews(item._id)}
                >
                  <FiTrash2 size={16} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

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
