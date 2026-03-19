import Link from "next/link";

export function StorefrontAnnouncementBar() {
  return (
    <div className="border-b border-[#244948] bg-[#173534] text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
        <p className="text-white/88">
          Same-day delivery across Harare on fresh produce, deli, butchery, and pantry orders.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-white/76">
          <Link
            className="rounded-full transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#173534]"
            href="/shop?department=fruits"
          >
            Fresh picks
          </Link>
          <span aria-hidden="true" className="text-white/30">
            /
          </span>
          <Link
            className="rounded-full transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#173534]"
            href="/shop?department=winery"
          >
            New cellar picks
          </Link>
        </div>
      </div>
    </div>
  );
}
