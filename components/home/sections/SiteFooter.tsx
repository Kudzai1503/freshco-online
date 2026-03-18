import Image from "next/image";
import Link from "next/link";

import { footerGroups } from "@/components/home/data/content";

export function SiteFooter() {
  return (
    <footer className="bg-white px-4 pb-10 pt-7 sm:px-6 lg:px-8 xl:px-10 2xl:px-14" id="footer">
      <div className="grid gap-8 rounded-[38px] bg-[#173534] px-6 py-8 text-white shadow-[0_18px_60px_rgba(23,53,52,0.08)] sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:px-10 lg:py-10">
        <div className="max-w-[380px]">
          <Image
            alt="FreshCo logo"
            className="h-auto w-[178px] rounded-[16px] bg-white p-2.5"
            height={88}
            src="/freshco/logofrshco.png"
            width={296}
          />
          <p className="mt-5 text-[1rem] leading-7 text-white/84">
            FreshCo is building a cleaner grocery experience with produce-led visuals,
            stronger curation, and an easier way to stock the home with quality.
          </p>
          <div className="mt-6 flex gap-2.5">
            {["IG", "FB", "YT"].map((item) => (
              <a
                key={item}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/10 text-[0.76rem] font-bold tracking-[0.12em] text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#173534]"
                href="#footer"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.heading}>
              <h3 className="text-[0.82rem] font-extrabold uppercase tracking-[0.16em] text-white/72">
                {group.heading}
              </h3>
              <ul className="mt-4 space-y-3 text-[0.98rem]">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link className="text-white/86 transition-colors hover:text-white" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
