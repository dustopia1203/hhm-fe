import { createFileRoute } from '@tanstack/react-router'
import Header from "@components/features/Header.tsx";

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <>
      <div className="">
        <Header />
        <h1>HOME</h1>
      </div>
    </>
  );
}
