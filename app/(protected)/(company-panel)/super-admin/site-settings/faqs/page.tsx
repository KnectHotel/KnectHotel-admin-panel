'use client';

import { useState, useEffect } from 'react';
import {
  FiMoreVertical,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiHelpCircle,
  FiArrowLeft
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import apiCall from '@/lib/axios';
import { ENDPOINTS } from '@/lib/api-config';

export default function FaqsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  
  const fetchFaqs = async () => {
    try {
      const json = await apiCall('GET', ENDPOINTS.FAQS);
      setItems(json.data || json || []);
    } catch (err) {
      console.error('Error loading FAQs:', err);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const url = editingId ? `${ENDPOINTS.FAQS}/${editingId}` : ENDPOINTS.FAQS;
      const method = editingId ? 'PUT' : 'POST';

      await apiCall(method, url, formData);
      fetchFaqs();
      setShowForm(false);
      setEditingId(null);
      setFormData({ question: '', answer: '' });
    } catch (err) {
      console.error('Error saving FAQ:', err);
    }
  };

  
  const deleteFaq = async (id: string) => {
    try {
      await apiCall('DELETE', `${ENDPOINTS.FAQS}/${id}`);
      fetchFaqs();
    } catch (err) {
      console.error('Error deleting FAQ:', err);
    }
  };

  
  const editFaq = (item: any) => {
    setEditingId(item._id);
    setShowForm(true);
    setFormData({
      question: item.question,
      answer: item.answer
    });
  };

  return (
    <div className="p-6 w-full">
      {}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
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
            <FiHelpCircle className="text-[#9b743f]" /> FAQs
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setEditingId(null);
            setFormData({ question: '', answer: '' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#9b743f] text-white px-4 py-2 rounded-md"
        >
          <FiPlus /> Add FAQ
        </motion.button>
      </motion.div>

      {}
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7187/7187948.png"
            className="w-20 mx-auto opacity-70"
          />
          <p className="text-lg font-medium mt-4">No FAQs found</p>
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
              <h3 className="font-semibold text-[#3b2f1c]">{item.question}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.answer}</p>

              {}
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
                      onClick={() => editFaq(item)}
                    >
                      <FiEdit size={16} /> Edit
                    </button>

                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                      onClick={() => deleteFaq(item._id)}
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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 text-[#3b2f1c]">
                {editingId ? 'Edit FAQ' : 'Add FAQ'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                {}
                <div>
                  <label className="text-sm font-medium">Question</label>
                  <input
                    required
                    type="text"
                    value={formData.question}
                    onChange={(e) =>
                      setFormData({ ...formData, question: e.target.value })
                    }
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>

                {}
                <div>
                  <label className="text-sm font-medium">Answer</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.answer}
                    onChange={(e) =>
                      setFormData({ ...formData, answer: e.target.value })
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
