import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Shop {
  id: string;
  name: string;
  address: string;
  avatarUrl: string;
  productCount: number;
  reviewCount: number;
  rating: number;
  createdAt: number;
  status: 'ACTIVE' | 'INACTIVE';
}

interface ShopState {
  shop: Shop | null;
  setShop: (shop: Shop) => void;
  clearShop: () => void;
}

const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      shop: null,
      setShop: (shop) => set({ shop }),
      clearShop: () => set({ shop: null }),
    }),
    {
      name: 'shop-storage'
    }
  )
);

export default useShopStore;
