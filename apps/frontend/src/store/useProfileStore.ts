import { create } from 'zustand';
import type { UserProfile } from '@yojana/shared';

interface ProfileState {
  currentProfile: UserProfile | null;
  setCurrentProfile: (profile: UserProfile | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  currentProfile: null,
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
}));
