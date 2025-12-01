'use client';

import { ChatWithStaffTable } from '@/components/tables/chatwithstaff/client';
import React from 'react';

const ChatWithStaffPage = () => {
  return (
    <div className="flex justify-center items-center h-full w-full pt-3">
      <div className="h-full w-full container">
        <ChatWithStaffTable />
      </div>
    </div>
  );
};

export default ChatWithStaffPage;
