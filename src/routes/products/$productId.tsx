import { createFileRoute } from '@tanstack/react-router'
import ShopProfileCard from "@components/features/ShopProfileCard.tsx";

export const Route = createFileRoute('/products/$productId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto px-48 py-8">
      <ShopProfileCard shopName="diddy" reviewCount={1000} productCount={100000} joinedYears={2000} shopId="10213"/>
    </div>
  );
}
