import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthForm } from "@/components/auth/AuthForm";
import { normalizeCallbackUrl } from "@/lib/auth/redirects";

type SignUpPageProps = Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = await auth();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const callbackParam = resolvedSearchParams?.callbackUrl;
  const callbackUrl = normalizeCallbackUrl(
    Array.isArray(callbackParam) ? callbackParam[0] : callbackParam,
  );

  if (session?.user) {
    redirect(callbackUrl);
  }

  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F9FCF7_0%,#EEF7EC_100%)] px-4 py-10 text-[var(--freshco-text)] sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
      <div className="mx-auto flex min-h-[80vh] max-w-[1200px] items-center justify-center">
        <AuthForm googleEnabled={googleEnabled} mode="sign-up" />
      </div>
    </main>
  );
}
