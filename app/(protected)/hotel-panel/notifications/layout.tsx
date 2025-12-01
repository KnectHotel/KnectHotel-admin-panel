import Navbar from '@/components/Navbar';
import React from 'react';

const LayoutNotifications = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-auto flex-col">
      <Navbar active={true} search={true} />
      {children}
    </div>
  );
};

export default LayoutNotifications;
