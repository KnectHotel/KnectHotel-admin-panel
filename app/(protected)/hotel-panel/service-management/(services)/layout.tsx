'use client';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import React from 'react';

// Define an array of paths where navbar should behave differently
const excludedPaths = ['/reception/details/']; // Add more paths as needed

const ServicesLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter(); // Get the router instance
  const pathname = usePathname(); // Get the current pathname

  // Debugging
  // console.log('Current Pathname:', pathname);

  // Check if the current route is in the excluded paths
  const isExcludedPage = excludedPaths.some((path) => pathname?.includes(path));

  return (
    <div className="w-full flex flex-col">
      <Navbar active={!isExcludedPage} search={!isExcludedPage} />
      {children}
    </div>
  );
};

export default ServicesLayout;
