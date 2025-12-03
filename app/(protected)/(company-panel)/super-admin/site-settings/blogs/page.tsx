'use client';

import { useEffect, useState } from 'react';
import {
  FiMoreVertical,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiArrowLeft
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
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
  });

  // FETCH BLOGS FROM API
  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/blogs');
      const data = await res.json();
      setItems(data.blogs || []);
    } catch (err) {
      console.log('fetch error:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // HANDLE SUBMIT → POST TO API
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/blogs/createblogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        fetchBlogs(); // refresh list
        setShowForm(false);
        setFormData({
          title: '',
          summary: '',
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
        });
      } else {
        console.log('Error:', data.message);
      }
    } catch (err) {
      console.log('Error submitting:', err);
    }
  };

  return (
    <div className="p-6 w-full relative">
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
            className="text-[#3b2f1c] hover:opacity-70"
          >
            <FiArrowLeft size={20} />
          </button>

          <h1 className="text-2xl font-semibold text-[#3b2f1c]">Blogs</h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#9b743f] text-white px-4 py-2 rounded-md shadow-sm"
        >
          <FiPlus /> Add Blog
        </motion.button>
      </motion.div>

      {/* List / Empty State */}
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 py-16 text-center flex flex-col items-center gap-3"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
            className="w-20 opacity-70"
            alt="No data"
          />
          <p className="text-lg font-medium">No blogs found</p>
          <p className="text-sm opacity-70">Start by adding a new blog entry</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {items.map((item: any) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              whileHover={{ scale: 1.01 }}
              className="border bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition relative"
            >
              <h3 className="font-semibold text-[#3b2f1c]">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.summary}</p>

              <button
                onClick={() => toggleDropdown(item._id)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded transition"
              >
                <FiMoreVertical size={18} />
              </button>

              <AnimatePresence>
                {openId === item._id && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-4 top-14 bg-white border rounded-lg shadow-md w-36 z-50 overflow-hidden"
                  >
                    <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full">
                      <FiEdit size={16} /> Edit
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full text-red-600">
                      <FiTrash2 size={16} /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Blog Modal */}
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
              className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8 
        border border-gray-200 
        overflow-y-auto max-h-[90vh]
        scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#c4a57a] pr-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#3b2f1c] tracking-wide">
                  Add New Blog
                </h2>
                <button
                  onClick={() => setShowForm(false)}
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
                {/* INPUT BASE STYLE */}
                {/* just use this className on each input */}
                {/* className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-[#9b743f] transition-all duration-200" */}

                {/* TITLE */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm
              focus:outline-none focus:ring-2 focus:ring-[#9b743f] transition-all duration-200"
                  />
                </div>

                {/* SUMMARY */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Summary</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm
              focus:outline-none focus:ring-2 focus:ring-[#9b743f] transition-all duration-200"
                  />
                </div>

                {/* IMAGE */}
                <div>
                  <label className="text-sm font-medium">Main Image</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm
              focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                {/* BANNER IMAGE */}
                <div>
                  <label className="text-sm font-medium">Banner Image</label>
                  <input
                    type="text"
                    value={formData.BannerImage}
                    onChange={(e) =>
                      setFormData({ ...formData, BannerImage: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
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
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
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
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
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
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                {/* DATE WITH ANIMATED CALENDAR */}
                <div className="relative">
                  <label className="text-sm font-medium">Date</label>

                  <motion.input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-[#9b743f] 
              text-[#3b2f1c]"
                  />

                  {/* Calendar Pop effect */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#9b743f]"
                  >
                    
                  </motion.div>
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
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                {/* LINKS */}
                <div>
                  <label className="text-sm font-medium">YouTube</label>
                  <input
                    type="text"
                    value={formData.youtubeLink}
                    onChange={(e) =>
                      setFormData({ ...formData, youtubeLink: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Instagram</label>
                  <input
                    type="text"
                    value={formData.instagramLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        instagramLink: e.target.value
                      })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">LinkedIn</label>
                  <input
                    type="text"
                    value={formData.linkdinLink}
                    onChange={(e) =>
                      setFormData({ ...formData, linkdinLink: e.target.value })
                    }
                    className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-[#9b743f]"
                  />
                </div>

                {/* BUTTONS */}
                <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#9b743f] text-white rounded-lg hover:bg-[#825f34] transition-all"
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
