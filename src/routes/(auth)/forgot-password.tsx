import { createFileRoute } from '@tanstack/react-router'
import ForgotPasswordForm from "@components/features/ForgotPasswordForm.tsx";

export const Route = createFileRoute('/(auth)/forgot-password')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <div className="grid grid-cols-2 w-full overflow-hidden">
                <div className="flex flex-col items-center justify-center">
                    <img src="/assets/hero-banner.png" alt="Hero Banner" className="w-3/4 h-auto mb-4" />
                    <p className="text-center text-gray-400">Nền tảng thương mại điện tử #1 PTIT!!!</p>
                </div>
                <div className="flex justify-center col-span-1">
                    <ForgotPasswordForm />
                </div>
            </div>
        </>
    )
}
