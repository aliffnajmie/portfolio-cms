"use client";

import { useActionState } from "react";
import { LoaderCircle, LogIn } from "lucide-react";
import { login, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200" htmlFor="email">Email address</label>
        <input className="h-12 w-full border border-white/15 bg-slate-950 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70 focus:ring-1 focus:ring-cyan-300/30 disabled:opacity-60" id="email" name="email" type="email" autoComplete="email" inputMode="email" required aria-describedby={state.error ? "login-error" : undefined} disabled={pending}/>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200" htmlFor="password">Password</label>
        <input className="h-12 w-full border border-white/15 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-300/70 focus:ring-1 focus:ring-cyan-300/30 disabled:opacity-60" id="password" name="password" type="password" autoComplete="current-password" minLength={6} required aria-describedby={state.error ? "login-error" : undefined} disabled={pending}/>
      </div>
      {state.error && <p id="login-error" role="alert" className="border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200">{state.error}</p>}
      <button type="submit" disabled={pending} className="button-primary h-12 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? <><LoaderCircle className="animate-spin" size={17}/> Signing in…</> : <>Sign in <LogIn size={17}/></>}
      </button>
    </form>
  );
}
