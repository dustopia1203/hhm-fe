import { createFileRoute } from '@tanstack/react-router'
import Header from "@components/features/Header.tsx";

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        <Header/>
        <main className="flex-1 px-6">
          <h1>HOME</h1>
        </main>
      </div>
    </>
  );
}
