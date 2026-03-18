"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { getReferrerCallback, normalizeCallbackUrl } from "@/lib/auth/redirects";

type AuthFormProps = Readonly<{
  mode: "sign-in" | "sign-up";
  googleEnabled: boolean;
}>;

export function AuthForm({ mode, googleEnabled }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referrerCallbackUrl, setReferrerCallbackUrl] = useState("/");

  const isSignUp = mode === "sign-up";
  const demoCredentials = {
    email: "shopper@freshco.demo",
    password: "Freshco123!",
  };
  const callbackUrl = useMemo(() => {
    const callbackParam = searchParams.get("callbackUrl");
    return callbackParam ? normalizeCallbackUrl(callbackParam) : referrerCallbackUrl;
  }, [referrerCallbackUrl, searchParams]);

  useEffect(() => {
    setReferrerCallbackUrl(getReferrerCallback(document.referrer));
  }, []);

  const alternateHref = useMemo(
    () =>
      isSignUp
        ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    [callbackUrl, isSignUp],
  );

  async function submitCredentials(nextEmail: string, nextPassword: string) {
    const result = await signIn("credentials", {
      email: nextEmail,
      password: nextPassword,
      redirect: false,
      callbackUrl,
    });

    if (!result || result.error) {
      throw new Error("Invalid email or password.");
    }

    router.push(result.url || callbackUrl);
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const payload = (await response.json()) as { error?: string };
        if (!response.ok) {
          throw new Error(payload.error || "Unable to create account.");
        }
      }

      await submitCredentials(email, password);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Authentication failed.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDemoSignIn() {
    setSubmitting(true);
    setError(null);

    try {
      setEmail(demoCredentials.email);
      setPassword(demoCredentials.password);
      await submitCredentials(demoCredentials.email, demoCredentials.password);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Authentication failed.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-[480px] rounded-[34px] border border-[#173534]/10 bg-white p-6 shadow-[0_22px_60px_rgba(23,53,52,0.08)] sm:p-8">
      <div className="flex justify-center">
        <Image
          alt="FreshCo logo"
          className="h-auto w-[168px]"
          height={88}
          priority
          src="/freshco/logofrshco.png"
          width={296}
        />
      </div>
      <h1 className="mt-3 text-[2.5rem] font-extrabold leading-[0.92] tracking-[-0.06em] text-[var(--freshco-text)]">
        {isSignUp ? "Create your shopper account." : "Sign in to continue."}
      </h1>
      <p className="mt-4 text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
        {isSignUp
          ? "Save your order history, complete checkout faster, and keep your FreshCo preferences in one place."
          : "Access checkout, profile details, and your latest FreshCo orders."}
      </p>

      {!isSignUp ? (
        <div className="mt-6 rounded-[22px] border border-[#DCE8DA] bg-[#F6FBF5] p-4">
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-[var(--freshco-brand-dark)]">
            Test credentials
          </p>
          <p className="mt-2 text-[0.94rem] text-[var(--freshco-text-soft)]">
            Email: <strong className="text-[var(--freshco-text)]">{demoCredentials.email}</strong>
          </p>
          <p className="mt-1 text-[0.94rem] text-[var(--freshco-text-soft)]">
            Password: <strong className="text-[var(--freshco-text)]">{demoCredentials.password}</strong>
          </p>
          <button
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-[#173534]/12 bg-white px-5 text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-[var(--freshco-text)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#FDFEFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
            onClick={() => void handleDemoSignIn()}
            type="button"
          >
            Continue with demo account
          </button>
        </div>
      ) : null}

      {googleEnabled ? (
        <button
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[var(--freshco-border)] bg-white px-5 text-[0.9rem] font-bold text-[var(--freshco-text)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--freshco-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
          disabled={submitting}
          onClick={() => void signIn("google", { callbackUrl })}
          type="button"
        >
          <span className="text-[1rem]">G</span>
          <span>{isSignUp ? "Continue with Google" : "Sign in with Google"}</span>
        </button>
      ) : null}

      <div className="mt-6 flex items-center gap-3 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[var(--freshco-text-soft)]">
        <span className="h-px flex-1 bg-[var(--freshco-border)]" />
        <span>{googleEnabled ? "Or use email" : "Email access"}</span>
        <span className="h-px flex-1 bg-[var(--freshco-border)]" />
      </div>

      <form className="mt-6 grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
        {isSignUp ? (
          <input
            className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4"
            name="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
            required
            value={name}
          />
        ) : null}
        <input
          className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
          type="email"
          value={email}
        />
        <input
          className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4"
          minLength={8}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
          type="password"
          value={password}
        />
        {isSignUp ? (
          <input
            className="h-12 rounded-[18px] border border-[var(--freshco-border)] px-4"
            minLength={8}
            name="confirmPassword"
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm password"
            required
            type="password"
            value={confirmPassword}
          />
        ) : null}

        {error ? <p className="text-[0.92rem] text-[#A33A3A]">{error}</p> : null}

        <button
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.9rem] font-extrabold uppercase tracking-[0.14em] text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.03] disabled:cursor-not-allowed disabled:bg-[#B9DDB7]"
          disabled={submitting}
          type="submit"
        >
          {submitting
            ? isSignUp
              ? "Creating account..."
              : "Signing in..."
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-[0.96rem] text-[var(--freshco-text-soft)]">
        {isSignUp ? "Already have an account?" : "Need a FreshCo account?"}{" "}
        <Link className="font-bold text-[var(--freshco-brand-dark)]" href={alternateHref}>
          {isSignUp ? "Sign in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
