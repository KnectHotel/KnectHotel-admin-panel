'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import React from 'react';
import { MdDashboardCustomize } from 'react-icons/md';

export function NavItem({
  href,
  label,
  children,
  disabled = false,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const pathname = usePathname(); 

  if (disabled) {
    return (
      <div
        className="flex items-center gap-4 p-2 2xl:my-2 rounded-lg text-gray-400 cursor-not-allowed opacity-60 select-none"
        title="You do not have permission to access this module"
      >
        {children}
        <span className="text-xs 2xl:text-sm font-medium">{label}</span>
      </div>
    );
  }

  
  const safeChildren = React.Children.toArray(children).filter((child) => {
    if (React.isValidElement(child) && child.type === NavItem) {
      console.warn('NavItem cannot contain another NavItem as a child. This will cause nested anchor tags.');
      return false;
    }
    return true;
  });

  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-4 p-2 2xl:my-2 rounded-lg transition-colors text-white ',
        {
          'bg-[#ffffff3b] text-[#EEA720]': pathname?.startsWith(href), 
          'hover:bg-[#ffffff3b] hover:text-[#EEA720]': pathname !== href 
        }
      )}
    >
      {safeChildren}
      <span className="text-xs 2xl:text-sm font-medium">{label}</span>
    </Link>
  );
}
