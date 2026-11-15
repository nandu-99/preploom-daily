"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export function SideDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-black/35 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:bg-black/60" />
        <Dialog.Viewport className="fixed inset-0 z-[101] flex justify-end">
          <Dialog.Popup className="h-[100dvh] w-full max-w-[580px] overflow-y-auto border-l border-black/[0.1] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] antialiased shadow-[-24px_0_70px_rgba(20,20,20,0.12)] transition-transform duration-300 ease-out data-ending-style:translate-x-full data-starting-style:translate-x-full dark:border-white/[0.11] dark:bg-[#0d0d0d] dark:text-[#f3f3f1] dark:shadow-[-24px_0_80px_rgba(0,0,0,0.45)]">
            <div className="sticky top-0 z-10 flex items-start gap-5 border-b border-black/[0.08] bg-[#f7f7f5]/95 px-5 py-5 backdrop-blur-xl dark:border-white/[0.09] dark:bg-[#0d0d0d]/95 sm:px-7">
              <div className="min-w-0 flex-1">
                <Dialog.Title className="text-[18px] font-semibold leading-6 tracking-[-0.025em]">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                  {description}
                </Dialog.Description>
              </div>
              <Dialog.Close
                className="grid size-9 shrink-0 place-items-center rounded-[9px] border border-black/[0.1] text-[#606060] transition-colors hover:border-black/20 hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:border-white/20 dark:hover:text-white dark:focus-visible:ring-white/50"
                aria-label="Close details"
              >
                <X className="size-4" strokeWidth={1.6} aria-hidden="true" />
              </Dialog.Close>
            </div>
            <div className="px-5 py-7 sm:px-7 sm:py-8">{children}</div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
