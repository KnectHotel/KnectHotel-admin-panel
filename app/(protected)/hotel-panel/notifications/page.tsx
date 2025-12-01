import { NotificationsTable } from '@/components/tables/notifications-table/client';
import React from 'react';

const NotificationsPage = () => {
  return (
    <div className="flex justify-center items-center h-full w-full pt-5">
      <div className="h-full w-full container">
        <NotificationsTable />
      </div>
    </div>
  );
};

export default NotificationsPage;
