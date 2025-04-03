import { create } from "zustand/react";

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

const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile: AccountProfile) => set({ profile }),
  clearProfile: () => set({ profile: null })
}))

export default useProfileStore;
