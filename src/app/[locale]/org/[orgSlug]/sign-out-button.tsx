"use client";

import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export function SignOutButton({ label, redirectTo }: { label: string; redirectTo: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        window.location.assign(redirectTo);
      }}
      className="rounded-full px-3 py-1.5 text-sm text-slate-700 hover:bg-white"
    >
      {label}
    </button>
  );
}
