"use client";

import { useState } from "react";
import { createAuthClient } from "better-auth/react";
import type { Dictionary } from "@/i18n/dictionaries";

const authClient = createAuthClient();

type Mode = "signIn" | "signUp";
type Status = { kind: "idle" | "pending" } | { kind: "error" | "info"; message: string };

export function AuthForm({ text, next }: { text: Dictionary["auth"]; next: string }) {
  const [mode, setMode] = useState<Mode>("signIn");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setStatus({ kind: "pending" });

    if (mode === "signUp") {
      const { error } = await authClient.signUp.email({
        name: String(form.get("name") ?? ""),
        email,
        password,
        callbackURL: next,
      });
      setStatus(error ? { kind: "error", message: text.genericError } : { kind: "info", message: text.checkEmail });
      return;
    }

    const { error } = await authClient.signIn.email({ email, password });
    if (!error) {
      window.location.assign(next);
      return;
    }
    setStatus({ kind: "error", message: error.status === 403 ? text.notVerified : text.invalid });
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-emerald-950/15 bg-white px-3 py-2 text-slate-900 focus:outline-2 focus:outline-emerald-700";

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate={false}>
      <h1 className="text-2xl font-semibold text-emerald-950">
        {mode === "signIn" ? text.signInTitle : text.signUpTitle}
      </h1>
      {mode === "signUp" && (
        <label className="text-sm text-slate-700">
          {text.name}
          <input name="name" required maxLength={100} autoComplete="name" className={inputClass} />
        </label>
      )}
      <label className="text-sm text-slate-700">
        {text.email}
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      <label className="text-sm text-slate-700">
        {text.password}
        <input
          name="password"
          type="password"
          required
          minLength={12}
          maxLength={128}
          autoComplete={mode === "signIn" ? "current-password" : "new-password"}
          className={inputClass}
        />
        {mode === "signUp" && <span className="mt-1 block text-xs text-slate-500">{text.passwordHint}</span>}
      </label>
      {(status.kind === "error" || status.kind === "info") && (
        <p role={status.kind === "error" ? "alert" : "status"} className="text-sm text-slate-800">
          {status.message}
        </p>
      )}
      <button
        type="submit"
        disabled={status.kind === "pending"}
        className="rounded-full bg-emerald-900 px-4 py-2 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
      >
        {mode === "signIn" ? text.signIn : text.signUp}
      </button>
      <button
        type="button"
        onClick={() => {
          setMode(mode === "signIn" ? "signUp" : "signIn");
          setStatus({ kind: "idle" });
        }}
        className="text-sm text-emerald-900 underline"
      >
        {mode === "signIn" ? text.toSignUp : text.toSignIn}
      </button>
    </form>
  );
}
