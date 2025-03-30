import { createFileRoute } from '@tanstack/react-router';
import VerifyAccountForm from "@components/features/VerifyAccountForm.tsx";

export const Route = createFileRoute('/(auth)/verify-account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <VerifyAccountForm/>
    </>
  );
}
