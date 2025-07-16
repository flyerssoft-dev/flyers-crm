import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface AuthState {
  activeMenu: number;
  activeSubMenu: number;
}
interface AuthAction {
  setActiveMenu: (menuNumber: number) => void;
  setActiveSubMenu: (menuNumber: number) => void;
  getActiveMenu: () => number;
  getActiveSubMenu: () => number;
  reset: () => void;
}

const useMenuStore = create<AuthState & AuthAction>()(
  persist(
    (set, get) => ({
      activeMenu: 1,
      activeSubMenu: 1,
      setActiveMenu: (menuNumber) => set({ activeMenu: menuNumber }),
      setActiveSubMenu: (menuNumber) => set({ activeSubMenu: menuNumber }),
      getActiveMenu: () => get().activeMenu,
      getActiveSubMenu: () => get().activeSubMenu,
      reset: () => {
        set(() => ({
          activeMenu: 1,
          activeSubMenu: 1,
        }));
      },
    }),
    {
      name: 'menu store',
    },
  ),
);

export default useMenuStore;
