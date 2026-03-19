export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-[var(--freshco-border)] bg-white p-4">
      <div className="h-[180px] animate-pulse rounded-[20px] bg-[var(--freshco-surface-soft)]" />
      <div className="mt-4 h-3 w-24 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
      <div className="mt-3 h-6 w-2/3 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
      <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
      <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
      <div className="mt-4 h-8 w-28 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
    </div>
  );
}

export function OrderItemSkeleton() {
  return (
    <div className="rounded-[22px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 animate-pulse rounded-[16px] bg-white" />
          <div className="min-w-0 flex-1">
            <div className="h-4 w-36 animate-pulse rounded-full bg-white" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-white" />
          </div>
        </div>
        <div className="h-4 w-16 animate-pulse rounded-full bg-white" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <main className="bg-white px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(340px,0.98fr)]">
        <section className="rounded-[32px] border border-[var(--freshco-border)] bg-[var(--freshco-surface-soft)] p-6">
          <div className="h-[420px] animate-pulse rounded-[28px] bg-white" />
        </section>

        <section className="grid gap-5">
          <div className="rounded-[32px] border border-[var(--freshco-border)] bg-white p-6">
            <div className="h-3 w-24 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
            <div className="mt-4 h-10 w-4/5 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
            <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
            <div className="mt-6 flex gap-3">
              <div className="h-10 w-24 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
              <div className="h-10 w-28 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
            </div>
          </div>

          <div className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-5">
            <div className="h-8 w-28 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
            <div className="mt-4 h-4 w-40 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
          </div>

          <div className="rounded-[30px] border border-[var(--freshco-border)] bg-white p-5">
            <div className="h-3 w-32 animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
            <div className="mt-4 h-12 w-full animate-pulse rounded-full bg-[var(--freshco-surface-soft)]" />
          </div>
        </section>
      </div>
    </main>
  );
}
