"use client";

import { useActionState } from "react";
import { LoaderCircle, LogIn } from "lucide-react";
import { login, type LoginState } from "@/app/admin/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input className="h-12" id="email" name="email" type="email" autoComplete="email" inputMode="email" required aria-describedby={state.error ? "login-error" : undefined} disabled={pending}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input className="h-12" id="password" name="password" type="password" autoComplete="current-password" minLength={6} required aria-describedby={state.error ? "login-error" : undefined} disabled={pending}/>
      </div>
      {state.error && <Alert id="login-error" variant="destructive">{state.error}</Alert>}
      <Button type="submit" disabled={pending} size="lg" className="w-full">
        {pending ? <><LoaderCircle className="animate-spin" size={17}/> Signing in…</> : <>Sign in <LogIn size={17}/></>}
      </Button>
    </form>
  );
}
