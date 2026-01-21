'use client';

import { useState, useEffect } from 'react';
import {
  FiMoreVertical,
  FiEdit,
  FiArrowLeft,
  FiX,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { RiMoneyRupeeCircleLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import apiCall from '@/lib/axios';
import { ENDPOINTS } from '@/lib/api-config';

interface PricingPlan {
  _id: string;
  uniqueId: string;
  name: string;
  price: string;
  desc: string[];
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function PricingPage() {
  const [items, setItems] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingPlan | null>(null);

  const [formData, setFormData] = useState({
    price: '',
    desc: ['']
  });

  // FETCH ALL PRICING PLANS (including inactive - admin view)
  const fetchPricingPlans = async () => {
    try {
      setLoading(true);
      // Use admin endpoint to get all plans including inactive ones
      const json = await apiCall('GET', `${ENDPOINTS.PRICING}/admin/all`);
      const plans = json.data || json || [];
      // Sort by order
      plans.sort((a: PricingPlan, b: PricingPlan) => a.order - b.order);
      setItems(plans);
    } catch (err) {
      console.error('Error loading pricing plans:', err);
      // Fallback to regular endpoint
      try {
        const json = await apiCall('GET', ENDPOINTS.PRICING);
        setItems(json.data || json || []);
      } catch {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // ADD DESCRIPTION ITEM
  const addDescItem = () => {
    setFormData({ ...formData, desc: [...formData.desc, ''] });
  };

  // REMOVE DESCRIPTION ITEM
  const removeDescItem = (index: number) => {
    const newDesc = formData.desc.filter((_, i) => i !== index);
    setFormData({ ...formData, desc: newDesc.length > 0 ? newDesc : [''] });
  };

  // UPDATE DESCRIPTION ITEM
  const updateDescItem = (index: number, value: string) => {
    const newDesc = [...formData.desc];
    newDesc[index] = value;
    setFormData({ ...formData, desc: newDesc });
  };

  // UPDATE PRICING PLAN (only price and description)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingItem) return;

    // Filter out empty descriptions
    const filteredDesc = formData.desc.filter((d) => d.trim() !== '');
    if (filteredDesc.length === 0) {
      alert('Please add at least one feature description');
      return;
    }

    try {
      const payload = {
        price: formData.price,
        desc: filteredDesc
      };

      await apiCall('PUT', `${ENDPOINTS.PRICING}/${editingItem._id}`, payload);
      fetchPricingPlans();
      setShowForm(false);
      setEditingItem(null);
      setFormData({ price: '', desc: [''] });
    } catch (err) {
      console.error('Error saving pricing plan:', err);
    }
  };

  // TOGGLE PLAN STATUS (activate/deactivate)
  const togglePlanStatus = async (id: string) => {
    try {
      await apiCall('PATCH', `${ENDPOINTS.PRICING}/${id}/toggle`);
      fetchPricingPlans();
      setOpenId(null);
    } catch (err) {
      console.error('Error toggling plan status:', err);
    }
  };

  // OPEN EDIT FORM
  const editPricingPlan = (item: PricingPlan) => {
    setEditingItem(item);
    setShowForm(true);
    setFormData({
      price: item.price,
      desc: item.desc.length > 0 ? item.desc : ['']
    });
    setOpenId(null);
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="text-[#3b2f1c] hover:bg-gray-200 p-2 rounded-full transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>

          <h1 className="text-2xl font-semibold text-[#3b2f1c] flex items-center gap-2">
            <RiMoneyRupeeCircleLine className="text-[#9b743f]" /> Pricing Plans
          </h1>
        </div>

        
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b743f]"></div>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="text-center text-gray-500 py-20">
          <RiMoneyRupeeCircleLine className="w-16 h-16 mx-auto opacity-40 text-gray-400" />
          <p className="text-lg font-medium mt-4">No pricing plans found</p>
          <p className="text-sm mt-2">
            Please restart the backend server to seed default plans
          </p>
        </div>
      ) : (
        /* Pricing Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl p-6 shadow-sm border relative hover:shadow-md transition-shadow ${
                item.isActive ? 'border-gray-100' : 'border-gray-300 opacity-60'
              }`}
            >
              {/* Inactive Badge */}
              {!item.isActive && (
                <div className="absolute top-3 left-3">
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                    Hidden
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="flex justify-between items-start mb-4">
                <div className={!item.isActive ? 'mt-6' : ''}>
                  <h3 className="font-bold text-xl text-[#3b2f1c]">
                    {item.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-bold text-[#9b743f]">
                      {item.price}
                    </span>
                  </div>
                </div>

                {/* Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(item._id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiMoreVertical size={18} className="text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {openId === item._id && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg w-36 z-10 overflow-hidden"
                      >
                        <button
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 w-full text-left text-gray-700"
                          onClick={() => editPricingPlan(item)}
                        >
                          <FiEdit size={16} /> Edit
                        </button>

                        <button
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm w-full text-left ${
                            item.isActive
                              ? 'hover:bg-orange-50 text-orange-600'
                              : 'hover:bg-green-50 text-green-600'
                          }`}
                          onClick={() => togglePlanStatus(item._id)}
                        >
                          {item.isActive ? (
                            <>
                              <FiEyeOff size={16} /> Hide
                            </>
                          ) : (
                            <>
                              <FiEye size={16} /> Show
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Features List */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-600 mb-3">
                  Features included:
                </p>
                <ul className="space-y-2">
                  {item.desc.slice(0, 4).map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="text-[#9b743f] mt-0.5">✓</span>
                      <span className="line-clamp-2">{feature}</span>
                    </li>
                  ))}
                  {item.desc.length > 4 && (
                    <li className="text-sm text-gray-400">
                      +{item.desc.length - 4} more features...
                    </li>
                  )}
                </ul>
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* EDIT FORM MODAL */}
      <AnimatePresence>
        {showForm && editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-[#3b2f1c]">
                  Edit {editingItem.name}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX size={20} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Plan Name (Read-only) */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={editingItem.name}
                    disabled
                    className="w-full mt-1 p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Plan names are fixed and cannot be changed
                  </p>
                </div>

                {/* Price */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., ₹7,999 / month + GST"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#9b743f] focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Features/Description */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Features
                    </label>
                    <button
                      type="button"
                      onClick={addDescItem}
                      className="text-sm text-[#9b743f] hover:text-[#8a6537] flex items-center gap-1"
                    >
                      + Add Feature
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {formData.desc.map((desc, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Feature ${index + 1}`}
                          value={desc}
                          onChange={(e) =>
                            updateDescItem(index, e.target.value)
                          }
                          className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#9b743f] focus:border-transparent outline-none transition-all"
                        />
                        {formData.desc.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDescItem(index)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiX size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#9b743f] text-white rounded-lg hover:bg-[#8a6537] transition-colors font-medium"
                  >
                    Update Plan
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
