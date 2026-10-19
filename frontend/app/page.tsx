export default function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <section className="w-full max-w-3xl border-t border-[var(--border)] py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          PrepLoom Daily
        </p>
        <h1 className="mt-5 max-w-2xl text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
          Build preparation into a daily practice.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)]">
          The frontend workspace is ready. Learning tools and the admin portal
          will arrive as focused, tested features.
        </p>
      </section>
    </main>
  );
}
