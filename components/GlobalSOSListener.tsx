'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket';
import { useSOSStore } from '@/lib/sos-store';

export default function GlobalSOSListener() {
  const router = useRouter();
  const setLatest = useSOSStore((s) => s.setLatest);
  const bound = useRef(false);

  useEffect(() => {
    const s = getSocket();
    if (!s) return;
    if (bound.current) return;
    bound.current = true;

    const handler = (payload: any) => {
      
      setLatest(payload);

      
      if (payload?._id) {
        router.push(`/sos/${payload._id}`);
      } else {
        
        router.push('/sos');
      }
    };

    s.off('sos', handler);
    s.on('sos', handler);

    return () => {
      s.off('sos', handler);
      bound.current = false;
    };
  }, [router, setLatest]);

  return null;
}
