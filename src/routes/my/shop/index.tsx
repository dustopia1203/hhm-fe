import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/my/shop/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/my/shop/"!</div>
}
