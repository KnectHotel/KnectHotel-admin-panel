'use client';

import React, { useEffect, useState } from 'react';
import ComplaintDashboard from './ComplaintDashboard'; 
import apiCall from '@/lib/axios';


const ComplaintDashboardWrapper = () => {
  const [stats, setStats] = useState({
    openCases: 0,
    inProgressCases: 0,
    closedCases: 0
  });

  const fetchStats = async () => {
    try {
      const res = await apiCall('GET', '/api/complaint/stats');
      if (res.success) {
        const { Open, Inprogress, Resolved } = res.data;
        setStats({
          openCases: Open || 0,
          inProgressCases: Inprogress || 0,
          closedCases: Resolved || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch complaint stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ComplaintDashboard
      title="Complaint Summary"
      closedCases={stats.closedCases}
      openCases={stats.openCases}
      inProgressCases={stats.inProgressCases}
    />
  );
};

export default ComplaintDashboardWrapper;