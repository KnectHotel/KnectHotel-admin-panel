








'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modal/alert-modal';

export default function Logout() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsOpen(true); 
  }, []);

  const handleConfirmLogout = () => {
    setLoading(true);

    
    sessionStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/; secure; samesite=strict';

    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 800);
  };

  const handleCancel = () => {
    setIsOpen(false);
    router.back();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <AlertModal
          isOpen={isOpen}
          onCloseAction={handleCancel}
          onConfirmAction={handleConfirmLogout}
          loading={loading}
          description="You will be logged out. Do you want to continue?"
        />
      </div>
    )
  );
}
