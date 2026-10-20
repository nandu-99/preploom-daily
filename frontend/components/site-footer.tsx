import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 sm:grid-cols-[1fr_auto] sm:items-end sm:px-6 lg:px-8">
        <div>
          <Link
            href="/"
            className="inline-flex rounded-[8px] text-xl font-semibold tracking-[-0.045em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
          >
            PrepLoom
          </Link>
          <p className="mt-4 max-w-[420px] text-sm leading-6 text-[var(--muted)]">
            Focused technical interview preparation for learning, revision, and
            recall.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex items-center gap-5 text-sm text-[var(--muted)]">
            <li>
              <Link
                href="/"
                className="rounded-[6px] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="rounded-[6px] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>

        <p className="border-t border-[var(--border)] pt-5 text-xs text-[var(--subtle)] sm:col-span-2">
          © 2026 PrepLoom. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
