"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2, LogOut } from "lucide-react";

export function AdminSignOutButton() {
  const [signingOut, setSigningOut] = useState(false);

  const onSignOut = async () => {
    setSigningOut(true);
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <button
      type="button"
      onClick={onSignOut}
      disabled={signingOut}
      className="inline-flex h-10 items-center gap-2 border border-brand px-4 text-sm font-semibold tracking-widest text-brand uppercase transition-colors hover:bg-brand hover:text-white disabled:opacity-60"
    >
      {signingOut ? (
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut aria-hidden="true" className="h-4 w-4" />
      )}
      Sign out
    </button>
  );
}
