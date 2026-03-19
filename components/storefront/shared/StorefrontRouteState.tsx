import Link from "next/link";

type StorefrontRouteStateProps = Readonly<{
  eyebrow?: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}>;

export function StorefrontRouteState({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: StorefrontRouteStateProps) {
  return (
    <main className="bg-white px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
      <section className="rounded-[38px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] px-5 py-10 sm:px-7 lg:px-10">
        {eyebrow ? (
          <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-[var(--freshco-brand-dark)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 text-[2.2rem] font-extrabold leading-[0.94] tracking-[-0.06em] text-[var(--freshco-text)] sm:text-[2.8rem]">
          {title}
        </h1>
        <p className="mt-4 max-w-[640px] text-[1rem] leading-7 text-[var(--freshco-text-soft)]">
          {description}
        </p>
        {actionHref && actionLabel ? (
          <Link
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[var(--freshco-brand)] px-5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--freshco-brand)] focus-visible:ring-offset-2"
            href={actionHref}
          >
            {actionLabel}
          </Link>
        ) : null}
      </section>
    </main>
  );
}
