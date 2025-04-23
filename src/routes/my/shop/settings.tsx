import { createFileRoute, useNavigate } from '@tanstack/react-router'
import ShopHeader from "@components/features/ShopHeader.tsx";
import ShopSidebar from "@components/features/ShopSidebar.tsx";
import Footer from "@components/features/Footer.tsx";
import useShopStore from "@stores/useShopStore.ts";
import UpdateShopForm from "@components/features/UpdateShopForm.tsx";

export const Route = createFileRoute('/my/shop/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const { shop } = useShopStore();

  if (!shop) {
    navigate({ to: "/my/shop" });
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-900">
      <ShopHeader/>

      <div className="flex flex-1">

        <div className="w-64 bg-gray-800">
          <ShopSidebar/>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <UpdateShopForm/>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
