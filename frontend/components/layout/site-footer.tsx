import { PrepLoomLogo } from "@/components/preploom-logo";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="6.5"
        width="18"
        height="11"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M10.5 9.5 15 12l-4.5 2.5v-5Z" fill="currentColor" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.9" r="1" fill="currentColor" />
    </svg>
  );
}

const groups = [
  {
    title: "Prepare",
    links: [
      ["Subjects", "/subjects"],
      ["Roadmaps", "/roadmaps"],
      ["DSA", "/dsa"],
      ["WebDev", "/webdev"],
      ["Interview Questions", "/interview-questions"],
    ],
  },
  {
    title: "Product",
    links: [
      ["About", "/about"],
      ["Feedback", "/feedback"],
      ["Contact", "/contact"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.08] bg-black/[0.012] font-[family-name:var(--font-geist-sans)] dark:border-white/[0.09] dark:bg-white/[0.018]">
      <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div>
            <Link
              href="/"
              className="inline-flex rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50"
              aria-label="PrepLoom home"
            >
              <PrepLoomLogo className="h-10 w-[138px]" />
            </Link>
            <p className="mt-6 max-w-md text-[14px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
              Focused technical interview preparation for learning, revision,
              and recall.
            </p>
            <div className="mt-7 inline-flex items-center rounded-[10px] border border-black/[0.09] px-3 py-1.5 text-[11px] text-[#606060] dark:border-white/[0.1] dark:text-[#a8a8a8]">
              Progress stays on this browser.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-9 sm:grid-cols-3">
            {groups.map((group) => (
              <nav key={group.title} aria-label={`${group.title} links`}>
                <h2 className="text-[12px] font-medium">{group.title}</h2>
                <ul className="mt-5 space-y-3">
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="group inline-flex items-center gap-1 rounded-[6px] text-[12px] text-[#606060] transition-colors hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-[#a8a8a8] dark:hover:text-white dark:focus-visible:ring-white/50"
                      >
                        {label}
                        <ArrowUpRight
                          className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
                          strokeWidth={1.7}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div>
              <h2 className="text-[12px] font-medium">Social</h2>
              <div
                className="mt-5 flex items-center gap-2"
                aria-label="PrepLoom social channels"
              >
                <a
                  href="https://www.instagram.com/preploomdaily/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="PrepLoom Daily on Instagram"
                  title="Instagram: preploomdaily"
                  className="grid size-8 place-items-center rounded-[8px] border border-black/[0.09] text-[#777] transition-colors hover:border-black/25 hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.1] dark:text-[#8f8f8f] dark:hover:border-white/25 dark:hover:text-white dark:focus-visible:ring-white/50"
                >
                  <InstagramIcon className="size-4" />
                </a>
                <a
                  href="https://www.youtube.com/@preploomdaily"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="PrepLoom Daily on YouTube"
                  title="YouTube: preploomdaily"
                  className="grid size-8 place-items-center rounded-[8px] border border-black/[0.09] text-[#777] transition-colors hover:border-black/25 hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.1] dark:text-[#8f8f8f] dark:hover:border-white/25 dark:hover:text-white dark:focus-visible:ring-white/50"
                >
                  <YoutubeIcon className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-black/[0.1] pt-6 text-[11px] text-[#606060] dark:border-white/[0.11] dark:text-[#a8a8a8]">
          <p>© 2026 PrepLoom. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
