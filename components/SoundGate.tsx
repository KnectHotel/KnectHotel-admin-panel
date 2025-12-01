'use client';
import { useEffect } from 'react';
import { ensureSoundUnlocked } from '@/lib/sound-manager';

export default function SoundGate() {
  useEffect(() => {
    ensureSoundUnlocked();
  }, []);
  return null;
}
