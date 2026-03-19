import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function requireAuth(callbackPath: string) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }

  return session;
}
