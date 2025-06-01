import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AccountProfile {
  username: string,
  grantedPrivileges: [string],
  firstName: string,
  lastName: string,
  middleName: string,
  phone: string,
  dateOfBirth: number,
  avatarUrl: string,
  gender: "MALE" | "FEMALE" | "OTHER",
  address: string,
}

interface ProfileStore {
  profile: AccountProfile | null;
  setProfile: (profile: AccountProfile) => void;
  clearProfile: () => void;
}

const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile: AccountProfile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'profile-storage',
      storage: {
        getItem: (key) => {
          const value = sessionStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => sessionStorage.removeItem(key),
      }
    }
  )
);

export default useProfileStore;
