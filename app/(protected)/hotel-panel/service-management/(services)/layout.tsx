'use client';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import React from 'react';


const excludedPaths = ['/reception/details/']; 

const ServicesLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter(); 
  const pathname = usePathname(); 

  
  

  
  const isExcludedPage = excludedPaths.some((path) => pathname?.includes(path));

  return (
    <div className="w-full flex flex-col">
      <Navbar active={!isExcludedPage} search={!isExcludedPage} />
      {children}
    </div>
  );
};

export default ServicesLayout;
