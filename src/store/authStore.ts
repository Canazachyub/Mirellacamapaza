import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,

      login: async (password: string) => {
        // La contraseña por defecto está en la hoja de configuración
        // En producción, esto debería validarse contra la API
        const validPassword = 'MirellaCamapaza2026!';

        if (password === validPassword) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
