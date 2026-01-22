
'use client';

import React, { useState, useEffect } from 'react';
import EmergencyAlert from './EmergencyAlert';

const SOSPage = () => {
  const [emergencyDetails, setEmergencyDetails] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);

  
  const triggerEmergency = (type: string, guestName: string, roomNo: string, assignedStaff: string) => {
    setEmergencyDetails({
      type,
      guestName,
      roomNo,
      assignedStaff,
    });

    setShowAlert(true);
  };

  useEffect(() => {
    
    const emergencyMessage = {
      type: 'Fire',
      guestName: 'Mr. Timothy Chalamate',
      roomNo: '501',
      assignedStaff: 'Employee1',
    };

    
    triggerEmergency(
      emergencyMessage.type,
      emergencyMessage.guestName,
      emergencyMessage.roomNo,
      emergencyMessage.assignedStaff
    );
  }, []);

  return (
    <div>
      {showAlert && emergencyDetails && (
        <EmergencyAlert
          emergencyDetails={emergencyDetails}
          onClose={() => setShowAlert(false)} 
        />
      )}

      {!showAlert && <div>Your regular page content here.</div>}
    </div>
  );
};

export default SOSPage;
