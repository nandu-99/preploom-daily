import {
  ArrowRight,
  BookOpen,
  Braces,
  Code2,
  Cpu,
  Database,
  MessageSquareText,
  Network,
  Route,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type ProductTileProps = {
  href: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
  className: string;
  contentClassName?: string;
  children?: ReactNode;
};

function ProductTile({
  href,
  title,
  description,
  icon: Icon,
  className,
  contentClassName = "",
  children,
}: ProductTileProps) {
  return (
    <Link
      href={href}
      className={`group relative flex min-h-[132px] overflow-hidden rounded-[16px] border border-black/[0.1] bg-black/[0.018] p-5 transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-black/25 hover:bg-black/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f5] active:translate-y-0 dark:border-white/[0.11] dark:bg-white/[0.025] dark:hover:border-white/25 dark:hover:bg-white/[0.05] dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-[#0a0a0a] sm:p-6 ${className}`}
    >
      <div
        className={`relative z-10 flex min-w-0 flex-1 flex-col ${contentClassName}`}
      >
        <span className="grid size-9 place-items-center rounded-[10px] border border-black/[0.1] text-[#606060] dark:border-white/[0.12] dark:text-[#aaa]">
          <Icon className="size-[17px]" strokeWidth={1.6} aria-hidden="true" />
        </span>
        <div className="mt-auto pt-4">
          <h3 className="text-[19px] font-semibold tracking-[-0.035em] sm:text-[21px]">
            {title}
          </h3>
          <p className="mt-1.5 max-w-[45ch] text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8] sm:text-[13px]">
            {description}
          </p>
        </div>
      </div>
      {children}
      <ArrowRight
        className="absolute right-5 top-5 size-4 text-[#777] transition-transform group-hover:translate-x-0.5 dark:text-[#999] sm:right-6 sm:top-6"
        strokeWidth={1.7}
        aria-hidden="true"
      />
    </Link>
  );
}

export function ProductMap() {
  return (
    <div className="grid gap-3 md:grid-cols-12 md:auto-rows-[166px] lg:auto-rows-[176px]">
      <ProductTile
        href="/subjects"
        title="Subjects"
        description="Learn Operating Systems, DBMS, networks, OOP, and other core interview subjects."
        icon={BookOpen}
        className="md:col-span-7 md:row-span-2"
        contentClassName="sm:max-w-[54%]"
      >
        <div
          aria-hidden="true"
          className="absolute right-5 top-1/2 hidden -translate-y-1/2 items-center gap-3 text-[#777] opacity-65 sm:flex md:right-8 lg:right-12"
        >
          {[Cpu, Database, Network].map((SubjectIcon, index) => (
            <span
              key={index}
              className={`grid place-items-center rounded-[14px] border border-black/[0.1] dark:border-white/[0.12] ${
                index === 1 ? "size-16" : "size-12"
              }`}
            >
              <SubjectIcon
                className={index === 1 ? "size-6" : "size-[18px]"}
                strokeWidth={1.4}
              />
            </span>
          ))}
        </div>
      </ProductTile>

      <ProductTile
        href="/roadmaps"
        title="Roadmaps"
        description="Follow a clear path for the role or goal you are preparing for."
        icon={Route}
        className="md:col-span-5"
      />

      <ProductTile
        href="/interview-questions"
        title="Interview questions"
        description="Practise behavioral and technical questions with concise answers and recall mode."
        icon={MessageSquareText}
        className="md:col-span-5"
      />

      <ProductTile
        href="/dsa"
        title="Trusted DSA sheets"
        description="Choose a proven sheet. Questions and progress stay on the original platform."
        icon={Braces}
        className="md:col-span-5"
      />

      <ProductTile
        href="/webdev"
        title="WebDev resources"
        description="Useful websites, project ideas, components, setup guides, and Skills.md."
        icon={Code2}
        className="md:col-span-7"
      />
    </div>
  );
}
