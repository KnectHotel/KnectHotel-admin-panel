'use client';

import { useState, useEffect } from 'react';
import {
  FiMoreVertical,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUsers,
  FiArrowLeft
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import { API_BASE_URL } from '@/lib/api-config';

const API_BASE = `${API_BASE_URL}/company`;

export default function CompanyPage() {
  const [company, setCompany] = useState<any>(null);

  const [showMissionForm, setShowMissionForm] = useState(false);
  const [showLeadersForm, setShowLeadersForm] = useState(false);
  const [showValuesForm, setShowValuesForm] = useState(false);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Form data
  const [mission, setMission] = useState("");
  const [leaderForm, setLeaderForm] = useState({ name: "", img: "", role: "", tagline: "" });
  const [valueForm, setValueForm] = useState({ title: "", description: "" });

  // LOAD DATA
  const fetchCompany = async () => {
    try {
      const res = await fetch(API_BASE);
      const json = await res.json();
      if (json.success) {
        // If data is null/undefined, use default empty object so UI renders
        const data = json.data || { mission: "", leadership: [], values: [] };
        setCompany(data);
        setMission(data.mission || "");
      }
    } catch (err) {
      console.error("Error loading company:", err);
      // Initialize with empty data on error so user can try to create
      setCompany({ mission: "", leadership: [], values: [] });
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  // UPSERT COMPANY
  const saveCompany = async (payload: any) => {
    try {
      const res = await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) fetchCompany();
    } catch (err) {
      console.error("Error saving company:", err);
    }
  };

  // HANDLERS
  const saveMission = () => {
    saveCompany({ ...company, mission });
    setShowMissionForm(false);
  };

  const saveLeader = () => {
    let updated = [...company.leadership];

    if (editIndex !== null) updated[editIndex] = leaderForm;
    else updated.push(leaderForm);

    saveCompany({ ...company, leadership: updated });

    setLeaderForm({ name: "", img: "", role: "", tagline: "" });
    setEditIndex(null);
    setShowLeadersForm(false);
  };

  const deleteLeader = (index: number) => {
    const updated = company.leadership.filter((_: any, i: number) => i !== index);
    saveCompany({ ...company, leadership: updated });
  };

  const saveValue = () => {
    let updated = [...company.values];

    if (editIndex !== null) updated[editIndex] = valueForm;
    else updated.push(valueForm);

    saveCompany({ ...company, values: updated });

    setValueForm({ title: "", description: "" });
    setEditIndex(null);
    setShowValuesForm(false);
  };

  const deleteValue = (index: number) => {
    const updated = company.values.filter((_: any, i: number) => i !== index);
    saveCompany({ ...company, values: updated });
  };

  if (!company) {
    return (
      <div className="p-6 w-full flex items-center justify-center text-gray-500">
        Loading company data...
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="text-[#3b2f1c] hover:opacity-70">
            <FiArrowLeft size={20} />
          </button>

          <h1 className="text-2xl font-semibold text-[#3b2f1c] flex items-center gap-2">
            <FiUsers className="text-[#9b743f]" /> Company Settings
          </h1>
        </div>
      </motion.div>

      {/* MISSION */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg text-[#3b2f1c]">Mission Statement</h2>

          <button
            onClick={() => setShowMissionForm(true)}
            className="text-sm px-3 py-1 bg-[#9b743f] text-white rounded-md"
          >
            Edit
          </button>
        </div>

        <p className="text-gray-700">{company.mission}</p>
      </section>

      {/* LEADERSHIP */}
      <section className="mb-10">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-[#3b2f1c]">Leadership Team</h2>

          <button
            onClick={() => {
              setEditIndex(null);
              setLeaderForm({ name: "", img: "", role: "", tagline: "" });
              setShowLeadersForm(true);
            }}
            className="flex items-center gap-2 bg-[#9b743f] text-white px-3 py-1 rounded-md"
          >
            <FiPlus size={16} /> Add
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {company.leadership.map((leader: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="border bg-white rounded-xl p-5 shadow-sm relative"
            >
              <h3 className="font-semibold">{leader.name}</h3>
              <p className="text-sm text-gray-600">{leader.role}</p>
              <p className="text-xs text-gray-500 mt-1">{leader.tagline}</p>

              <button
                onClick={() => setOpenDropdown(index)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded"
              >
                <FiMoreVertical size={18} />
              </button>

              <AnimatePresence>
                {openDropdown === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-4 top-14 bg-white border rounded-lg shadow-md w-36"
                  >
                    <button
                      className="px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 w-full"
                      onClick={() => {
                        setEditIndex(index);
                        setLeaderForm(leader);
                        setShowLeadersForm(true);
                      }}
                    >
                      <FiEdit size={16} /> Edit
                    </button>

                    <button
                      className="px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 w-full text-red-600"
                      onClick={() => deleteLeader(index)}
                    >
                      <FiTrash2 size={16} /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section>
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-[#3b2f1c]">Company Values</h2>

          <button
            onClick={() => {
              setEditIndex(null);
              setValueForm({ title: "", description: "" });
              setShowValuesForm(true);
            }}
            className="flex items-center gap-2 bg-[#9b743f] text-white px-3 py-1 rounded-md"
          >
            <FiPlus size={16} /> Add
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {company.values.map((val: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="border bg-white rounded-xl p-5 shadow-sm relative"
            >
              <h3 className="font-semibold">{val.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{val.description}</p>

              <button
                onClick={() => setOpenDropdown(index + 100)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded"
              >
                <FiMoreVertical size={18} />
              </button>

              <AnimatePresence>
                {openDropdown === index + 100 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-4 top-14 bg-white border rounded-lg shadow-md w-36"
                  >
                    <button
                      className="px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 w-full"
                      onClick={() => {
                        setEditIndex(index);
                        setValueForm(val);
                        setShowValuesForm(true);
                      }}
                    >
                      <FiEdit size={16} /> Edit
                    </button>

                    <button
                      className="px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 w-full text-red-600"
                      onClick={() => deleteValue(index)}
                    >
                      <FiTrash2 size={16} /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MISSION MODAL */}
      <Modal visible={showMissionForm} onClose={() => setShowMissionForm(false)}>
        <h2 className="text-lg font-semibold mb-3">Edit Mission</h2>
        <textarea
          rows={4}
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          className="w-full border rounded p-2"
        />
        <button onClick={saveMission} className="mt-4 bg-[#9b743f] text-white px-4 py-2 rounded">
          Save
        </button>
      </Modal>

      {/* LEADER MODAL */}
      <Modal visible={showLeadersForm} onClose={() => setShowLeadersForm(false)}>
        <h2 className="text-lg font-semibold mb-3">{editIndex !== null ? "Edit Leader" : "Add Leader"}</h2>

        {["name", "img", "role", "tagline"].map((field) => (
          <div key={field} className="mb-2">
            <label className="text-sm font-medium capitalize">{field}</label>
            <input
              type="text"
              value={(leaderForm as any)[field]}
              onChange={(e) => setLeaderForm({ ...leaderForm, [field]: e.target.value })}
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>
        ))}

        <button onClick={saveLeader} className="mt-4 bg-[#9b743f] text-white px-4 py-2 rounded">
          Save
        </button>
      </Modal>

      {/* VALUE MODAL */}
      <Modal visible={showValuesForm} onClose={() => setShowValuesForm(false)}>
        <h2 className="text-lg font-semibold mb-3">{editIndex !== null ? "Edit Value" : "Add Value"}</h2>

        {["title", "description"].map((field) => (
          <div key={field} className="mb-2">
            <label className="text-sm font-medium capitalize">{field}</label>
            {field === "description" ? (
              <textarea
                rows={3}
                value={(valueForm as any)[field]}
                onChange={(e) => setValueForm({ ...valueForm, [field]: e.target.value })}
                className="w-full border rounded p-2 mt-1"
                required
              />
            ) : (
              <input
                type="text"
                value={(valueForm as any)[field]}
                onChange={(e) => setValueForm({ ...valueForm, [field]: e.target.value })}
                className="w-full border rounded p-2 mt-1"
                required
              />
            )}
          </div>
        ))}

        <button onClick={saveValue} className="mt-4 bg-[#9b743f] text-white px-4 py-2 rounded">
          Save
        </button>
      </Modal>
    </div>
  );
}

/* Simple Modal Component */
function Modal({
  visible,
  children,
  onClose
}: {
  visible: boolean;
  children: any;
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <AnimatePresence>
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
          className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-black"
          >
            ✕
          </button>

          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
