import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Outlet/>
        <TanStackRouterDevtools/>
      </div>
    </>
  );
}