'use client';
import { create } from 'zustand';

export type SOSPayload = {
  type: 'Fire' | 'Medical' | 'Security';
  uniqueId: string;
  guest: {
    firstName: string;
    lastName: string;
    assignedRoomNumber: string;
  };
  assignedStaff?: string;
  HotelId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
};

type State = {
  latest: SOSPayload | null;
  setLatest: (p: SOSPayload | null) => void;
};

export const useSOSStore = create<State>((set) => ({
  latest: null,
  setLatest: (p) => set({ latest: p }),
}));
