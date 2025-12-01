
'use client';

import React, { useState, useEffect } from 'react';
import EmergencyAlert from './EmergencyAlert';

const SOSPage = () => {
  const [emergencyDetails, setEmergencyDetails] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);

  // Simulate receiving an emergency SOS (This should come from API or event)
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
    // Example trigger, replace with actual event/API response
    const emergencyMessage = {
      type: 'Fire',
      guestName: 'Mr. Timothy Chalamate',
      roomNo: '501',
      assignedStaff: 'Employee1',
    };

    // Trigger the emergency
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
          onClose={() => setShowAlert(false)} // Close the alert after 10 seconds
        />
      )}

      {!showAlert && <div>Your regular page content here.</div>}
    </div>
  );
};

export default SOSPage;
