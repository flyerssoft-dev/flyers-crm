import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userDataProps, userPermissionsProps } from '../../../types/userTypes';

interface userImage {
  message: string;
  data: string;
}
interface AuthState {
  accesstoken: string | null;
  refreshToken: string | null;
  userProfileImage: userImage | null;
  userData: userDataProps | null;
  userRole: string | null;
  userPermissions: userPermissionsProps[] | null;
  isLoggedWithSSO: boolean;
}

interface AuthAction {
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setUserRole: (userRole: string) => void;
  setUserData: (userData: userDataProps) => void;
  setUserProfileImage: (userProfile: userImage) => void;
  getUserProfileImage: () => userImage;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getUserData: () => userDataProps;
  getUserRole: () => string;
  clearTokens: () => void;
  setUserPermissions: (userPermissions: userPermissionsProps[]) => void;
  getUserPermissions: () => userPermissionsProps[];
  setLoggedWithSSO: (type: boolean) => void;
}

const useAuthStore = create<AuthState & AuthAction>()(
  persist(
    (set, get) => ({
      accesstoken: null,
      refreshToken: null,
      userData: null,
      userRole: null,
      userProfileImage: null,
      userPermissions: null,
      isLoggedWithSSO: false,
      setAccessToken: (token) => set({ accesstoken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setUserData: (userData: userDataProps) => set({ userData }),
      setUserRole: (userRole: string) => set({ userRole }),
      setUserProfileImage: (userProfileImage: userImage) => set({ userProfileImage }),
      getUserProfileImage: () => get().userProfileImage as userImage,
      getAccessToken: () => get().accesstoken,
      getRefreshToken: () => get().refreshToken,
      getUserData: () => get().userData as userDataProps,
      getUserRole: () => get()?.userRole as string,
      clearTokens: () =>
        set(() => ({
          accesstoken: null,
          refreshToken: null,
          userData: null,
          userRole: null,
          userProfileImage: null,
          userPermissions: null,
          isLoggedWithSSO: false,
        })),
      setUserPermissions: (userPermissions: userPermissionsProps[]) => set({ userPermissions }),
      getUserPermissions: () => get()?.userPermissions as unknown as userPermissionsProps[],
      setLoggedWithSSO: (type) => set({ isLoggedWithSSO: type }),
    }),
    {
      name: 'auth store',
    },
  ),
);

export default useAuthStore;
