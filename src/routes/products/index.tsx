import { createFileRoute } from '@tanstack/react-router'
import Header from "@components/features/Header.tsx";
import Footer from "@components/features/Footer.tsx";

export const Route = createFileRoute('/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        <Header/>
        <div className="container mx-auto px-48 py-8">

        </div>
        <Footer/>
      </div>
    </>
  )
}
