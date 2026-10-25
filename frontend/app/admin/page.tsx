"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { getAdminToken, setAdminToken } from "@/lib/admin-session";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

type LoginResponse = {
  data?: { token: string };
  error?: { message: string };
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getAdminToken()) router.replace("/admin/dashboard");
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`${backendUrl}/admin/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await response.json()) as LoginResponse;

      if (!response.ok || !body.data?.token) {
        setError(body.error?.message ?? "Unable to sign in.");
        return;
      }

      setAdminToken(body.data.token);
      router.replace("/admin/dashboard");
    } catch {
      setError("The backend is unavailable. Check that it is running.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] text-[#151515] dark:bg-[#0a0a0a] dark:text-[#f3f3f1]">
      <AdminHeader />
      <main className="mx-auto grid min-h-[calc(100dvh-68px)] max-w-[1240px] items-stretch md:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-between border-b border-black/[0.08] px-5 py-12 dark:border-white/[0.09] sm:px-8 sm:py-16 md:border-b-0 md:border-r lg:px-12 lg:py-20">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#606060] dark:text-[#a8a8a8] sm:text-[11px]">
              <span className="h-px w-7 bg-black/25 dark:bg-white/25" />
              Content administration
            </div>
            <h1 className="mt-7 max-w-[560px] text-balance text-[clamp(2.8rem,6vw,5.4rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
              Keep PrepLoom useful and current.
            </h1>
            <p className="mt-6 max-w-[42ch] text-[15px] leading-7 text-[#555] dark:text-[#b3b3b3]">
              Sign in to manage subjects and prepare new learning content.
            </p>
          </div>
          <p className="mt-14 max-w-sm text-[12px] leading-6 text-[#777] dark:text-[#8f8f8f]">
            Admin access is limited to approved PrepLoom maintainers.
          </p>
        </section>

        <section className="flex items-center px-5 py-12 sm:px-8 sm:py-16 lg:px-16">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[460px] md:mx-auto"
            noValidate
          >
            <LockKeyhole
              className="size-6 text-[#606060] dark:text-[#a8a8a8]"
              strokeWidth={1.6}
              aria-hidden="true"
            />
            <h2 className="mt-6 text-[28px] font-semibold tracking-[-0.04em] sm:text-[34px]">
              Admin sign in
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
              Use the account created through the backend seed command.
            </p>

            <div className="mt-8 grid gap-5">
              <label
                className="grid gap-2 text-[13px] font-medium"
                htmlFor="admin-email"
              >
                Email address
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 text-[14px] font-normal outline-none transition-colors placeholder:text-[#777] focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35 dark:focus:ring-white/10"
                  placeholder="admin@preploom.com"
                />
              </label>
              <label
                className="grid gap-2 text-[13px] font-medium"
                htmlFor="admin-password"
              >
                Password
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 text-[14px] font-normal outline-none transition-colors placeholder:text-[#777] focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35 dark:focus:ring-white/10"
                  placeholder="Enter your password"
                />
              </label>
            </div>

            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-[10px] border border-red-700/20 bg-red-700/[0.06] px-3.5 py-3 text-[13px] text-red-800 dark:border-red-300/20 dark:bg-red-300/[0.07] dark:text-red-200"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#151515] px-5 text-[14px] font-medium text-white transition-[opacity,transform] hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515]"
            >
              {submitting ? "Signing in..." : "Sign in"}
              {!submitting ? (
                <ArrowRight className="size-4" aria-hidden="true" />
              ) : null}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
