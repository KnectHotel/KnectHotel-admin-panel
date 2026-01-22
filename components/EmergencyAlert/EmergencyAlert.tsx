'use client';

import React, { useState, useEffect } from 'react';

const EmergencyAlert = ({ emergencyDetails, onClose }: { emergencyDetails: any, onClose: () => void }) => {
  const [seconds, setSeconds] = useState(10);
  const [isBip, setIsBip] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    
    onClose();
  }, [seconds, onClose]);

  useEffect(() => {
    
    const beepSound = new Audio('/path/to/bip-sound.mp3'); 
    beepSound.play();
    setIsBip(true);

    
    setTimeout(() => {
      setIsBip(false);
    }, 10000);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-red-600 text-white flex justify-center items-center flex-col">
      <h1 className="text-4xl font-bold">SOS - Emergency {emergencyDetails.type}</h1>
      <p className="text-lg mt-4">{emergencyDetails.guestName} ({emergencyDetails.roomNo})</p>
      <p className="text-lg mt-2">Assigned Staff: {emergencyDetails.assignedStaff}</p>
      <p className="text-2xl mt-4">Time Remaining: {seconds}s</p>

      {}
      {isBip && <audio src="/path/to/bip-sound.mp3" autoPlay loop />}
    </div>
  );
};

export default EmergencyAlert;
