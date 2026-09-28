"use client"

import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { LockIcon, UserIcon } from "lucide-react"
import { loginAction, type LoginState } from "@/app/admin/login/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: LoginState = {}

export function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/admin"
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="rounded-xl border border-border bg-card p-6 shadow-lg">
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="username" className="text-sm text-foreground">
            Usuário
          </Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="username"
              name="username"
              autoComplete="username"
              placeholder="adminmarajo"
              className="pl-9"
              required
              autoFocus
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-sm text-foreground">
            Senha
          </Label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="pl-9"
              required
            />
          </div>
        </div>

        {state.error ? (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" className="mt-2 w-full" disabled={isPending}>
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </form>
  )
}
