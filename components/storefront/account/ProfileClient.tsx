"use client";

import { useState } from "react";

import { departments } from "@/lib/storefront/mock/data";
import { useStorefrontSession } from "@/lib/storefront/browser-session";

export function ProfileClient() {
  const { loaded, profile, saveProfile } = useStorefrontSession();
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  if (!loaded) {
    return <p className="text-[var(--freshco-text-soft)]">Loading profile…</p>;
  }

  return (
    <form
      className="grid gap-4 rounded-[30px] border border-[var(--freshco-border)] bg-white p-6"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void saveProfile({
          firstName: String(form.get("firstName") ?? ""),
          lastName: String(form.get("lastName") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          preferredDepartment: String(form.get("preferredDepartment") ?? "fruits") as (typeof departments)[number]["slug"],
        }).then(() => setStatus("saved"));
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={profile.firstName} name="firstName" placeholder="First name" />
        <input className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={profile.lastName} name="lastName" placeholder="Last name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={profile.email} name="email" placeholder="Email" type="email" />
        <input className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={profile.phone} name="phone" placeholder="Phone" />
      </div>
      <select className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4" defaultValue={profile.preferredDepartment} name="preferredDepartment">
        {departments.map((department) => (
          <option key={department.slug} value={department.slug}>
            {department.name}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-4">
        <button className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white" type="submit">
          Save profile
        </button>
        {status === "saved" ? <span className="text-[0.92rem] text-[var(--freshco-brand-dark)]">Saved locally</span> : null}
      </div>
    </form>
  );
}

