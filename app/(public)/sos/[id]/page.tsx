'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FireIcon, LifebuoyIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { useSOSStore } from '@/lib/sos-store';
import apiCall from '@/lib/axios';

// ----- Types -----
type Guest = {
  firstName?: string;
  lastName?: string;
  assignedRoomNumber?: string;
};

type SOSPayload = {
  _id?: string;
  uniqueId?: string;
  type: 'Fire' | 'Medical' | 'Security';
  status?: 'pending' | 'in-progress' | 'completed';
  guest?: Guest;
  guestId?: Guest | string;
  assignedStaff?: string;
  HotelId?: string;
  createdAt?: string;
  updatedAt?: string;
};

// ----- Optional DOM typing for Safari -----
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function SOSPage() {
  const router = useRouter();
  const params = useParams();
  const id =
    typeof params?.id === 'string'
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : '';

  // Prefer data set by GlobalSOSListener; fallback to fetch by id
  const storeData = useSOSStore((s) => s.latest);
  const [fetchedData, setFetchedData] = useState<SOSPayload | null>(null);
  const [fetching, setFetching] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(2);

  // ----- Audio refs/state (TS-safe) -----
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Guaranteed (non-null) AudioContext getter
  const getCtx = (): AudioContext => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AC();
    }
    return audioCtxRef.current as AudioContext;
  };

  // Resume context if suspended; return true if running
  const ensureAudioUnlocked = async (): Promise<boolean> => {
    const ctx = getCtx();
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch { }
    }
    const ok = ctx.state === 'running';
    setAudioUnlocked(ok);
    return ok;
  };

  // Unlock on first user gesture
  useEffect(() => {
    const handler = () => {
      ensureAudioUnlocked().finally(() => {
        window.removeEventListener('click', handler);
        window.removeEventListener('touchstart', handler);
        window.removeEventListener('keydown', handler);
      });
    };
    window.addEventListener('click', handler);
    window.addEventListener('touchstart', handler);
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('touchstart', handler);
      window.removeEventListener('keydown', handler);
    };
  }, []);

  const stopSiren = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch { }
      try {
        oscRef.current.disconnect();
      } catch { }
      oscRef.current = null;
    }
    if (gainRef.current) {
      try {
        gainRef.current.disconnect();
      } catch { }
      gainRef.current = null;
    }
  };

  const startPoliceSiren = () => {
    const ctx = getCtx();
    if (ctx.state !== 'running') return;

    // clean any previous run
    stopSiren();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    gain.gain.value = 0.22;

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    let freq = 800;
    let dir = 1;
    const tick = () => {
      freq += dir * 6;
      if (freq >= 1400) dir = -1;
      if (freq <= 800) dir = 1;
      try {
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
      } catch { }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    oscRef.current = osc;
    gainRef.current = gain;
  };

  // Fetch by id if no store data (hard refresh/direct link)
  useEffect(() => {
    if (storeData) return;
    if (!id) return;

    setFetching(true);
    (async () => {
      try {
        const res = await apiCall('GET', `api/sos/${id}`);
        const payload: SOSPayload = (res?.data ?? res) as SOSPayload;
        setFetchedData(payload || null);
      } catch (e) {
        console.error('Failed to fetch SOS by id', e);
      } finally {
        setFetching(false);
      }
    })();
  }, [id, storeData]);

  // Build the data to display
  const data: SOSPayload | null = useMemo(() => {
    if (storeData) return storeData as SOSPayload;
    if (fetchedData) return fetchedData;
    if (!id) return null;
    return {
      _id: id,
      uniqueId: id,
      type: 'Fire',
      guest: { firstName: 'Guest', lastName: '', assignedRoomNumber: '-' },
      assignedStaff: '',
    };
  }, [storeData, fetchedData, id]);

  // Theme classes based on type
  const pageBgClass = useMemo(() => {
    switch (data?.type) {
      case 'Fire':
        return 'bg-red-600';
      case 'Medical':
        return 'bg-sky-500';
      case 'Security':
        return 'bg-gray-700';
      default:
        return 'bg-[#2f3640]';
    }
  }, [data?.type]);

  const cardClass = useMemo(() => {
    switch (data?.type) {
      case 'Fire':
        return 'bg-red-900/30 border-red-200/40 ring-red-900/20';
      case 'Medical':
        return 'bg-sky-900/20 border-sky-200/40 ring-sky-900/20';
      case 'Security':
        return 'bg-gray-800/40 border-gray-300/30 ring-gray-900/20';
      default:
        return 'bg-[#3c4a64] border-white/30 ring-black/20';
    }
  }, [data?.type]);

  // Countdown timer
  useEffect(() => {
    const t = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Start siren when timer hits 0 (if audio is unlocked)
  useEffect(() => {
    if (secondsLeft === 0 && data) {
      ensureAudioUnlocked().then((ok) => {
        if (ok) startPoliceSiren();
      });
    }
    return () => stopSiren();
  }, [secondsLeft, data]);

  // Guest info helpers (support guest OR populated guestId)
  const guestObj: Guest =
    data?.guest ??
    (typeof data?.guestId === 'object' ? (data?.guestId as Guest) : {});

  const guestFirst = guestObj?.firstName || 'Guest';
  const guestLast = guestObj?.lastName || '';
  const roomNo = guestObj?.assignedRoomNumber || '-';

  const getEmergencyIcon = (type?: string) => {
    switch (type) {
      case 'Fire':
        return <FireIcon className="h-10 w-10 text-red-100 drop-shadow animate-pulse" />;
      case 'Medical':
        return <LifebuoyIcon className="h-10 w-10 text-white drop-shadow animate-pulse" />;
      case 'Security':
        return <ShieldCheckIcon className="h-10 w-10 text-gray-200 drop-shadow animate-pulse" />;
      default:
        return <LifebuoyIcon className="h-10 w-10 text-yellow-100 drop-shadow animate-pulse" />;
    }
  };

  if (!data) {
    return <p className="p-6 text-white">Loading...</p>;
  }

  return (
    <main className={`relative min-h-screen overflow-hidden ${pageBgClass}`}>
      {/* Header */}
      <header className="pt-12 text-center text-white flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">{getEmergencyIcon(data.type)}</div>
        <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-sm md:text-6xl">SOS</h1>
        <p className="text-xl font-medium opacity-95 md:text-2xl">{data.type}</p>
      </header>

      {/* Card */}
      <section className="mx-auto mt-10 flex max-w-3xl justify-center px-4">
        <div className={`relative w-full rounded-3xl ${cardClass} border-2 p-10 shadow-xl backdrop-blur-md ring-1`}>
          {/* Timer */}
          <div className="absolute right-4 top-3 select-none text-lg font-semibold text-white/90">
            {formatTime(secondsLeft)}
          </div>

          <div className="mx-auto max-w-xl space-y-6 text-white">
            <h2 className="text-center text-lg font-extrabold tracking-wide">
              {guestFirst} {guestLast}
            </h2>

            <div className="space-y-3 text-base leading-relaxed">
              <p className="font-semibold">SOS ID: {data.uniqueId || data._id || '-'}</p>
              <p className="font-semibold">
                Room Number:&nbsp;<span className="font-bold">{roomNo}</span>
              </p>
              {fetching && <p className="text-sm opacity-80">Loading details…</p>}
            </div>

            {/* Show when autoplay blocked */}
            {!audioUnlocked && (
              <div className="text-center">
                <button
                  onClick={ensureAudioUnlocked}
                  className="mt-4 px-4 py-2 rounded-md bg-black text-white font-semibold hover:bg-black/80 transition"
                >
                  Enable Siren
                </button>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => {
                stopSiren();
                router.back();
              }}
              className="px-6 py-2 rounded-md bg-black text-white text-lg font-semibold hover:bg-black/80 transition duration-300"
            >
              Got It
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
