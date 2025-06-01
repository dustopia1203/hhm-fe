import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import NotFound from "@components/common/NotFound.tsx";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound
})

function RootComponent() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Outlet/>
        <Toaster
          theme="dark"
          richColors
          position="top-right"
        />
        <TanStackRouterDevtools/>
      </div>
    </>
  );
}