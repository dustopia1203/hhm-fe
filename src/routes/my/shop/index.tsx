import { createFileRoute } from '@tanstack/react-router';
import Footer from "@components/features/Footer.tsx";
import CreateShopForm from "@components/features/CreateShopForm.tsx";
import ShopHeader from "@components/features/ShopHeader.tsx";


export const Route = createFileRoute('/my/shop/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <ShopHeader/>

      <main className="flex-grow py-12 container mx-auto px-4">
        <CreateShopForm/>
      </main>

      <Footer/>
    </div>
  );
}
