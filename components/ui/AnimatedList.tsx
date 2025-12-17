'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface AnimatedListItem {
  id: string;
  roomNumber: string;
  roomType: string;
  floorNumber?: string;
  status?: string;
}

interface AnimatedListProps {
  items: AnimatedListItem[];
  onItemClick?: (item: AnimatedListItem) => void;
  selectedItemId?: string;
  emptyMessage?: string;
  title?: string;
}

export default function AnimatedList({
  items,
  onItemClick,
  selectedItemId,
  emptyMessage = 'No items available',
  title,
}: AnimatedListProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      )}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 py-8 text-sm"
            >
              {emptyMessage}
            </motion.div>
          ) : (
            items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => onItemClick?.(item)}
                className={`
                  p-3 rounded-lg border cursor-pointer transition-all
                  ${
                    selectedItemId === item.id
                      ? 'bg-[#EEA720] text-white border-[#EEA720] shadow-md'
                      : 'bg-[#F6EEE0] text-gray-700 border-gray-300 hover:bg-[#F1EBE1] hover:border-[#EEA720]'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        Room {item.roomNumber}
                      </span>
                      {item.status && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            selectedItemId === item.id
                              ? 'bg-white/20 text-white'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </div>
                    <div className="text-xs mt-1 opacity-75">
                      {item.roomType}
                      {item.floorNumber && ` • Floor ${item.floorNumber}`}
                    </div>
                  </div>
                  {selectedItemId === item.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-2"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

