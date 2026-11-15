"use client";

import { Select } from "@base-ui/react/select";
import { SubmissionNotice } from "@/components/forms/submission-notice";
import { Check, ChevronDown, LoaderCircle, Send } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

const reasons = [
  "Content correction",
  "Resource suggestion",
  "Product feedback",
  "General question",
];

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "contact",
          name: formData.get("name"),
          email: formData.get("email"),
          category: formData.get("reason"),
          message: formData.get("message"),
        }),
      });

      if (!response.ok) throw new Error("Message could not be sent");

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const fieldClassName =
    "mt-2 h-10 w-full rounded-[9px] border border-black/[0.12] bg-black/[0.02] px-3 text-[13px] outline-none transition-[border-color,background-color,box-shadow] placeholder:text-[#888] hover:border-black/20 focus:border-black/30 focus:bg-white focus:ring-2 focus:ring-black/[0.08] dark:border-white/[0.13] dark:bg-white/[0.035] dark:placeholder:text-[#777] dark:hover:border-white/22 dark:focus:border-white/30 dark:focus:bg-white/[0.05] dark:focus:ring-white/[0.08]";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 font-[family-name:var(--font-geist-sans)]"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-[13px] font-medium">
          Name
          <input
            className={fieldClassName}
            type="text"
            name="name"
            autoComplete="name"
            required
          />
        </label>
        <label className="text-[13px] font-medium">
          Email
          <input
            className={fieldClassName}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
          />
        </label>
      </div>

      <Select.Root name="reason" defaultValue="Content correction" required>
        <Select.Label className="text-[13px] font-medium">
          What is this about?
        </Select.Label>
        <Select.Trigger
          className={`${fieldClassName} flex items-center justify-between text-left`}
        >
          <Select.Value />
          <Select.Icon>
            <ChevronDown
              className="size-4 text-[#777]"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            sideOffset={6}
            alignItemWithTrigger={false}
            className="z-[80] outline-none"
          >
            <Select.Popup className="min-w-[var(--anchor-width)] origin-[var(--transform-origin)] rounded-[10px] border border-black/[0.12] bg-[#f7f7f5] p-1.5 font-[family-name:var(--font-geist-sans)] text-[#151515] shadow-[0_18px_50px_rgba(0,0,0,0.14)] outline-none transition-[transform,opacity] data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 dark:border-white/[0.13] dark:bg-[#151515] dark:text-[#f3f3f1] dark:shadow-[0_22px_60px_rgba(0,0,0,0.5)]">
              <Select.List>
                {reasons.map((reason) => (
                  <Select.Item
                    key={reason}
                    value={reason}
                    className="grid min-h-9 cursor-default grid-cols-[1fr_20px] items-center rounded-[7px] px-2.5 text-[13px] outline-none data-highlighted:bg-black/[0.06] dark:data-highlighted:bg-white/[0.08]"
                  >
                    <Select.ItemText>{reason}</Select.ItemText>
                    <Select.ItemIndicator className="justify-self-end">
                      <Check
                        className="size-3.5"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>

      <label className="block text-[13px] font-medium">
        Message
        <textarea
          className={`${fieldClassName} min-h-32 resize-y py-3 leading-6`}
          name="message"
          placeholder="Include the page link when reporting a content issue."
          required
        />
      </label>

      <SubmissionNotice
        status={status}
        successTitle="Message sent successfully"
        successMessage="Thanks for contacting PrepLoom. Your message has reached our inbox."
        errorTitle="Message not sent"
        errorMessage="Something went wrong. Check your connection and try again."
        onDismiss={() => setStatus("idle")}
      />

      <div className="flex justify-end border-t border-black/[0.1] pt-5 dark:border-white/[0.11]">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-end rounded-[9px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[opacity,transform] hover:-translate-y-px hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f5] disabled:pointer-events-none disabled:opacity-60 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1] dark:hover:bg-[#2b2b2b] dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-[#0a0a0a]"
        >
          {status === "sending" ? "Sending..." : "Send message"}
          {status === "sending" ? (
            <LoaderCircle
              className="size-3.5 animate-spin"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          ) : (
            <Send className="size-3.5" strokeWidth={1.7} aria-hidden="true" />
          )}
        </button>
      </div>
    </form>
  );
}
