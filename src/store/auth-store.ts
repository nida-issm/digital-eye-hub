import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  email:    string | null;
  isAuthed: boolean;
  setCredentials: (email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email:    null,
      isAuthed: false,
      setCredentials: (email) => set({ email, isAuthed: true }),
      clearAuth: () => set({ email: null, isAuthed: false }),
    }),
    { name: 'de-auth' }
  )
);
