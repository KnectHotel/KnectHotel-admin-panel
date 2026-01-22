'use client';
import React, { useState } from 'react';
import DateRangePickerComponent from './DateRangePicker';

const Header: React.FC = () => {
  
  const [activeLink, setActiveLink] = useState<string>('Weekly');

  
  const links = ['Weekly', 'Monthly', 'Yearly'];

  
  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <header className="bg-transparent px-5 pt-3 pb-2 flex gap-5 justify-end items-center">
      <div className="min-w-44">
        <DateRangePickerComponent />
      </div>
      {}
      <nav className="flex gap-6">
        {links.map((link) => (
          <button
            key={link}
            onClick={() => handleLinkClick(link)}
            className={`text-sm font-medium transition-colors ${
              activeLink === link
                ? 'text-white border-b-2 border-[#6F4E37]' // Active: white with coffee underline
                : 'text-white/60 hover:text-white/80' // Inactive: white with 60% opacity
            } pb-1`}
          >
            {link}
          </button>
        ))}
      </nav>

      {}
    </header>
  );
};

export default Header;
