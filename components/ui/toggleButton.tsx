
// 'use client';

// import React, { useEffect, useState } from 'react';

// interface ToggleButtonProps {
//   checked?: boolean;
//   enabled?: boolean;
//   onCheckedChange?: (newState: boolean) => void;
//   onToggle?: (newState: boolean) => void;
//   labelOn?: string;
//   labelOff?: string;
// }

// export default function ToggleButton({
//   checked,
//   enabled,
//   onCheckedChange,
//   onToggle,
//   labelOn = 'On',
//   labelOff = 'Off'
// }: ToggleButtonProps) {
//   const [internalState, setInternalState] = useState(false);

//   // Determine initial value
//   useEffect(() => {
//     if (typeof checked === 'boolean') {
//       setInternalState(checked);
//     } else if (typeof enabled === 'boolean') {
//       setInternalState(enabled);
//     }
//   }, [checked, enabled]);

//   const handleClick = () => {
//     const newState = !internalState;

//     // Controlled mode
//     if (typeof checked === 'boolean') {
//       onCheckedChange?.(newState);
//       onToggle?.(newState);
//     } else if (typeof enabled === 'boolean') {
//       onCheckedChange?.(newState);
//       onToggle?.(newState);
//     } else {
//       // Uncontrolled mode
//       setInternalState(newState);
//       onCheckedChange?.(newState);
//       onToggle?.(newState);
//     }
//   };

//   const isOn =
//     typeof checked === 'boolean'
//       ? checked
//       : typeof enabled === 'boolean'
//         ? enabled
//         : internalState;

//   return (
//     <button
//       onClick={handleClick}
//       aria-pressed={isOn}
//       className={`relative h-[19.5px] shadow-sm w-[44px] py-2 flex items-center rounded-full p-1 transition duration-300 ${isOn ? 'bg-coffee' : 'bg-brown'
//         }`}
//       aria-label={isOn ? labelOn : labelOff}
//       type="button"
//     >
//       <div
//         className={`h-[17px] w-[17px] rounded-full shadow-md transform transition duration-300 ${isOn ? 'translate-x-[23px] bg-brown' : '-translate-x-[4px] bg-coffee'
//           }`}
//       />
//     </button>
//   );
// }


import apiCall from '@/lib/axios';
import React, { useState, useEffect } from 'react';

interface ToggleButtonProps {
  checked?: boolean;
  enabled?: boolean;
  onCheckedChange?: (newState: boolean) => void;
  onToggle?: (newState: boolean) => void;
  serviceName: string; // Service name for the API call
  labelOn?: string;
  labelOff?: string;
  isBlurred?: boolean; // Added a new prop to control the "blurred" effect
}

export default function ToggleButton({
  checked,
  enabled,
  onCheckedChange,
  onToggle,
  serviceName,
  labelOn = 'On',
  labelOff = 'Off',
  isBlurred = false,
}: ToggleButtonProps) {
  const [internalState, setInternalState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Determine initial value for the toggle button
  useEffect(() => {
    if (typeof checked === 'boolean') {
      setInternalState(checked);
    } else if (typeof enabled === 'boolean') {
      setInternalState(enabled);
    }
  }, [checked, enabled]);

  const handleClick = async () => {
    if (isBlurred) return;

    const newState = !internalState;
    setLoading(true);
    setError(null);

    try {
      // Modify the API call to match your required structure
      const res = await apiCall('PATCH', `/api/services/toggle-services/${serviceName}`, {
        serviceName,
        status: newState,
      });

      if (res?.success) {
        setInternalState(newState);
        onCheckedChange?.(newState);
        onToggle?.(newState);
      } else {
        setError('Failed to toggle the service state. Please try again.');
      }
    } catch (err) {
      console.error('Error making API call:', err);
      setError('An error occurred while toggling the service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isOn = typeof checked === 'boolean' ? checked : internalState;

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        disabled={loading || isBlurred}
        aria-pressed={isOn}
        className={`relative h-[19.5px] shadow-sm w-[44px] py-2 flex items-center rounded-full p-1 transition duration-300 ${isOn ? 'bg-coffee' : 'bg-brown'} ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${isBlurred ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isOn ? labelOn : labelOff}
        type="button"
      >
        <div
          className={`h-[17px] w-[17px] rounded-full shadow-md transform transition duration-300 ${isOn ? 'translate-x-[23px] bg-brown' : '-translate-x-[4px] bg-coffee'}`}
        />
      </button>
      {error && <span className="text-red-500 mt-2 text-sm">{error}</span>}
    </div>
  );
}
