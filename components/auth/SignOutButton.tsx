"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      className="hidden h-12 items-center justify-center rounded-full border border-[var(--freshco-border)] bg-white px-5 text-[0.8rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--freshco-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 md:inline-flex"
      onClick={() => void signOut({ callbackUrl: "/" })}
      type="button"
    >
      Sign out
    </button>
  );
}
