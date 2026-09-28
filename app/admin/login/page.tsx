import { Suspense } from "react"
import Image from "next/image"
import { LoginForm } from "@/components/admin/login-form"

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Image
            src="/images/marajo-motors-logo.png"
            alt="Marajó Motors"
            width={480}
            height={192}
            className="h-12 w-auto object-contain"
          />
          <div>
            <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Painel administrativo
            </h1>
            <p className="text-sm text-muted-foreground">Entre com seu usuário e senha para continuar</p>
          </div>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
