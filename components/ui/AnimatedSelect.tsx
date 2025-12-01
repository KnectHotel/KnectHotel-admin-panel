'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

interface AnimatedSelectProps {
  label: string;
  name: string;
  options: string[];
  value?: string;       // ADDED
  onChange: (e: any) => void;
  searchable?: boolean;
}

export default function AnimatedSelect({
  label,
  name,
  options,
  value = '',
  onChange,
  searchable = false
}: AnimatedSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filteredOptions = searchable
    ? options.filter((o) => o.toLowerCase().includes(searchText.toLowerCase()))
    : options;

  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchText('');
      }
    };
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const handleSelect = (v: string) => {
    onChange({ target: { name, value: v } });
    setOpen(false);
    setSearchText('');
  };

  return (
    <div ref={ref} className="relative">
      <p className="font-medium mb-1">{label}</p>

      {/* Select Box */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full p-3 rounded-md flex justify-between items-center cursor-pointer border"
        style={{ borderColor: '#e8dfd2', background: '#fff', color: '#5A4A38' }}
      >
        <span>{value || 'Select'}</span>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 w-full mt-1 rounded-md shadow-lg overflow-hidden z-20"
            style={{
              background: '#fff',
              border: '1px solid #e8dfd2',
              color: '#5A4A38'
            }}
          >
            {/* SEARCH BAR */}
            {searchable && (
              <div
                className="flex items-center gap-2 px-3 py-2 border-b"
                style={{ borderColor: '#e8dfd2' }}
              >
                <Search size={16} className="opacity-60" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search..."
                  className="w-full p-1 outline-none"
                />
              </div>
            )}

            {/* OPTIONS */}
            <ul className="max-h-52 overflow-auto">
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-2 text-sm opacity-70">
                  No results found
                </li>
              ) : (
                filteredOptions.map((option, index) => (
                  <motion.li
                    key={index}
                    onClick={() => handleSelect(option)}
                    className="px-4 py-2 cursor-pointer hover:bg-[#F1EBE1]"
                    whileHover={{ x: 4 }}
                  >
                    {option}
                  </motion.li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
