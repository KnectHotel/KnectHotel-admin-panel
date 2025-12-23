'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiBell,
  FiTrendingUp,
  FiFlag,
  FiStar,
  FiUsers,
  FiBriefcase,
  FiAward,
  FiPlayCircle,
  FiHelpCircle
} from 'react-icons/fi';

const sections = [
  { name: 'Blogs', path: 'blogs', icon: <FiFileText size={26} /> },
  { name: 'News', path: 'news', icon: <FiBell size={26} /> },
  { name: 'Recent Updates', path: 'updates', icon: <FiTrendingUp size={26} /> },
  // { name: 'Milestones', path: 'milestones', icon: <FiFlag size={26} /> },
  { name: 'Reviews', path: 'reviews', icon: <FiStar size={26} /> },
  { name: 'Collaborations', path: 'collaborations', icon: <FiUsers size={26} /> },
  { name: 'Company Section', path: 'company-section', icon: <FiBriefcase size={26} /> },
  { name: 'Milestone', path: 'milestone', icon: <FiAward size={26} /> },
  { name: 'Product Videos', path: 'product-videos', icon: <FiPlayCircle size={26} /> },
  { name: 'FAQs', path: 'faqs', icon: <FiHelpCircle size={26} /> }
];

export default function ContentManagementPage() {
  return (
    <div className="p-6 w-full">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-semibold mb-6 text-[#3b2f1c]"
      >
        Site-Settings
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.35,
              delay: index * 0.08,
              ease: 'easeOut'
            }}
          >
            <Link
              href={`/super-admin/site-settings/${item.path}`}
              className="border bg-white rounded-xl p-5 shadow-sm
                         hover:shadow-lg hover:-translate-y-1 transition
                         flex items-center gap-4 cursor-pointer"
            >
              <div className="p-3 bg-[#efe7dd] rounded-lg text-[#7b5c39]">
                {item.icon}
              </div>

              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage {item.name}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
