// app/error.tsx
'use client';

import React, { useEffect } from 'react';

const Error = ({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-6 bg-[#FAF6EF] text-center px-6">
      <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
      <p className="text-sm text-gray-700">
        We're working on fixing the issue. You can try again below.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-md bg-[#A07D3D] text-white hover:bg-[#8f6b2f] transition"
      >
        Try again
      </button>
    </div>
  );
};
export default Error;
