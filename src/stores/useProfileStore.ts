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
      name: 'profile-storage'
    }
  )
);

export default useProfileStore;
