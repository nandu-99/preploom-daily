import type { DsaSheet } from "@/content/dsa";
import { ArrowUpRight } from "lucide-react";

function SheetMark({ children }: { children: string }) {
  return (
    <span className="grid size-10 place-items-center rounded-[10px] border border-black/[0.1] bg-black/[0.025] text-[10px] font-semibold tracking-[-0.01em] text-[#555] dark:border-white/[0.11] dark:bg-[#171717] dark:text-[#b8b8b8]">
      {children}
    </span>
  );
}

export function DsaSheetExplorer({ sheets }: { sheets: DsaSheet[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {sheets.map((sheet) => (
        <a
          key={sheet.id}
          href={sheet.href}
          target="_blank"
          rel="noreferrer"
          className="group flex min-h-[270px] flex-col rounded-[14px] border border-black/[0.1] bg-white/55 p-5 text-left shadow-[0_1px_2px_rgba(20,20,20,0.025)] transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-black/20 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.11] dark:bg-[#111] dark:shadow-none dark:hover:border-white/20 dark:hover:bg-[#151515] dark:focus-visible:ring-white/50"
        >
          <span className="flex w-full items-start justify-between gap-4">
            <SheetMark>{sheet.mark}</SheetMark>
            <ArrowUpRight
              className="size-4 text-[#777] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-[#858585]"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </span>
          <span className="mt-5 text-[17px] font-semibold leading-6 tracking-[-0.025em]">
            {sheet.name}
          </span>
          <span className="mt-1 text-[10px] text-[#777] dark:text-[#858585]">
            {sheet.provider}
          </span>
          <span className="mt-3 text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
            {sheet.summary}
          </span>
          <span className="mt-auto flex w-full items-end justify-between gap-4 border-t border-black/[0.08] pt-4 text-[10px] dark:border-white/[0.09]">
            <span>
              <span className="block text-[#777] dark:text-[#858585]">
                Best for
              </span>
              <span className="mt-1 block font-medium text-[#151515] dark:text-[#ededed]">
                {sheet.goals.join(" and ")}
              </span>
            </span>
            <span className="text-right">
              <span className="block text-[#777] dark:text-[#858585]">
                Official resource
              </span>
              <span className="mt-1 block font-medium text-[#151515] dark:text-[#ededed]">
                Open sheet
              </span>
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
