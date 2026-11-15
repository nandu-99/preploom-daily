"use client";

import {
  ArrowDown,
  ArrowRight,
  Box,
  Braces,
  Cpu,
  Database,
  Laptop,
  Network,
  Server,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type InterviewSubject =
  | "html"
  | "css"
  | "javascript"
  | "react"
  | "operating-systems"
  | "computer-networks"
  | "oop"
  | "dbms";

const labels: Record<InterviewSubject, string> = {
  html: "A semantic HTML document tree",
  css: "CSS rules resolving through the cascade",
  javascript: "JavaScript tasks moving through the event loop",
  react: "A React component tree receiving a state update",
  "operating-systems": "Processes moving through a CPU scheduler",
  "computer-networks": "A packet traveling from a client to a server",
  oop: "A class creating separate object instances",
  dbms: "Customer and order tables connected by a foreign key",
};

function IllustrationFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className="relative mx-auto min-h-[270px] w-full max-w-[390px] overflow-hidden py-5 lg:mr-0"
      role="img"
      aria-label={label}
    >
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

function HtmlIllustration({ reduceMotion }: { reduceMotion: boolean }) {
  const nodes = ["<header>", "<main>", "<footer>"];

  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center">
      <p className="mb-5 font-[family-name:var(--font-geist-mono)] text-[10px] text-[#777] dark:text-[#858585]">
        SEMANTIC DOCUMENT TREE
      </p>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[10px] border border-black/[0.14] bg-white/50 px-5 py-3 font-[family-name:var(--font-geist-mono)] text-[13px] font-medium dark:border-white/[0.15] dark:bg-white/[0.035]"
      >
        &lt;html&gt;
      </motion.div>
      <div className="h-8 w-px bg-black/[0.14] dark:bg-white/[0.16]" />
      <div className="relative grid w-full grid-cols-3 gap-2 pt-4">
        <div className="absolute left-[16.66%] right-[16.66%] top-0 h-px bg-black/[0.14] dark:bg-white/[0.16]" />
        {nodes.map((node, index) => (
          <motion.div
            key={node}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.12 + index * 0.09 }}
            className="relative rounded-[10px] border border-black/[0.1] bg-black/[0.018] px-2 py-4 text-center font-[family-name:var(--font-geist-mono)] text-[11px] dark:border-white/[0.11] dark:bg-white/[0.025]"
          >
            <span className="absolute -top-4 left-1/2 h-4 w-px -translate-x-1/2 bg-black/[0.14] dark:bg-white/[0.16]" />
            {node}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CssIllustration({ reduceMotion }: { reduceMotion: boolean }) {
  const rules = [
    ["01", "Browser defaults", "low"],
    ["02", "Stylesheet rules", "normal"],
    ["03", "Inline declaration", "high"],
  ];

  return (
    <div className="flex min-h-[230px] flex-col justify-center">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-[family-name:var(--font-geist-mono)] text-[10px] text-[#777] dark:text-[#858585]">
          THE CASCADE
        </p>
        <Braces
          className="size-4 text-[#777] dark:text-[#858585]"
          strokeWidth={1.5}
        />
      </div>
      <div className="space-y-2">
        {rules.map(([number, name, priority], index) => (
          <motion.div
            key={name}
            initial={reduceMotion ? false : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reduceMotion ? 0 : index * 0.1 }}
            className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] border border-black/[0.1] px-4 py-3 dark:border-white/[0.11]"
          >
            <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-[#858585]">
              {number}
            </span>
            <span className="text-[12px] font-medium">{name}</span>
            <span className="text-[10px] text-[#777] dark:text-[#858585]">
              {priority}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-2 text-[11px] font-medium">
        <ArrowRight className="size-3.5" strokeWidth={1.6} />
        Computed style
      </div>
    </div>
  );
}

function JavascriptIllustration({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="flex min-h-[230px] flex-col justify-center">
      <div className="grid grid-cols-[1fr_44px_1fr] items-center gap-2">
        <div className="rounded-[12px] border border-black/[0.12] p-4 dark:border-white/[0.13]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[11px] font-semibold">Call stack</span>
            <span className="font-[family-name:var(--font-geist-mono)] text-[9px] text-[#858585]">
              LIFO
            </span>
          </div>
          <div className="space-y-1.5">
            {["render()", "fetchData()"].map((item) => (
              <div
                key={item}
                className="rounded-[7px] bg-black/[0.045] px-3 py-2 font-[family-name:var(--font-geist-mono)] text-[10px] dark:bg-white/[0.06]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          animate={reduceMotion ? undefined : { rotate: [0, 180, 360] }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="grid size-9 place-items-center rounded-full border border-black/[0.12] dark:border-white/[0.14]"
        >
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </motion.div>

        <div className="rounded-[12px] border border-black/[0.12] p-4 dark:border-white/[0.13]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[11px] font-semibold">Task queue</span>
            <span className="font-[family-name:var(--font-geist-mono)] text-[9px] text-[#858585]">
              FIFO
            </span>
          </div>
          <div className="space-y-1.5">
            {["timer", "click"].map((item) => (
              <div
                key={item}
                className="rounded-[7px] border border-black/[0.08] px-3 py-2 font-[family-name:var(--font-geist-mono)] text-[10px] dark:border-white/[0.09]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-5 text-center font-[family-name:var(--font-geist-mono)] text-[10px] text-[#777] dark:text-[#858585]">
        EVENT LOOP CHECKS WHEN THE STACK IS EMPTY
      </p>
    </div>
  );
}

function ReactIllustration({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center">
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
        transition={{
          duration: 3.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="rounded-[10px] border border-black/[0.14] px-6 py-3 text-[12px] font-semibold dark:border-white/[0.15]"
      >
        App
      </motion.div>
      <div className="h-7 w-px bg-black/[0.14] dark:bg-white/[0.16]" />
      <div className="relative grid w-full grid-cols-2 gap-3 pt-4">
        <div className="absolute left-1/4 right-1/4 top-0 h-px bg-black/[0.14] dark:bg-white/[0.16]" />
        {["Header", "ProductList"].map((name) => (
          <div
            key={name}
            className="relative rounded-[10px] border border-black/[0.1] bg-black/[0.018] px-4 py-4 text-center text-[11px] font-medium dark:border-white/[0.11] dark:bg-white/[0.025]"
          >
            <span className="absolute -top-4 left-1/2 h-4 w-px -translate-x-1/2 bg-black/[0.14] dark:bg-white/[0.16]" />
            {name}
          </div>
        ))}
      </div>
      <div className="mt-4 flex w-full items-center gap-3 rounded-[10px] border border-black/[0.1] px-4 py-3 dark:border-white/[0.11]">
        <motion.span
          animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY }}
          className="grid size-7 place-items-center rounded-[7px] bg-black/[0.055] dark:bg-white/[0.07]"
        >
          <Box className="size-3.5" strokeWidth={1.5} />
        </motion.span>
        <span className="font-[family-name:var(--font-geist-mono)] text-[10px]">
          state update
        </span>
        <ArrowRight className="ml-auto size-3.5" strokeWidth={1.5} />
        <span className="text-[10px] text-[#777] dark:text-[#858585]">
          re-render
        </span>
      </div>
    </div>
  );
}

function OperatingSystemsIllustration({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <div className="flex min-h-[230px] flex-col justify-center">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 rounded-[12px] border border-black/[0.11] p-4 dark:border-white/[0.12]">
          <p className="text-[10px] font-medium text-[#777] dark:text-[#858585]">
            READY QUEUE
          </p>
          <div className="mt-3 flex gap-2">
            {["P1", "P2", "P3"].map((process, index) => (
              <motion.span
                key={process}
                animate={
                  reduceMotion
                    ? undefined
                    : { opacity: index === 0 ? [0.45, 1, 0.45] : 0.65 }
                }
                transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY }}
                className="grid size-9 place-items-center rounded-[8px] border border-black/[0.1] font-[family-name:var(--font-geist-mono)] text-[10px] dark:border-white/[0.11]"
              >
                {process}
              </motion.span>
            ))}
          </div>
        </div>
        <ArrowRight
          className="size-4 shrink-0 text-[#777] dark:text-[#858585]"
          strokeWidth={1.5}
        />
        <motion.div
          animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY }}
          className="grid size-20 shrink-0 place-items-center rounded-[16px] border border-black/[0.14] dark:border-white/[0.15]"
        >
          <div className="text-center">
            <Cpu className="mx-auto size-5" strokeWidth={1.5} />
            <span className="mt-1 block text-[9px] font-medium">CPU</span>
          </div>
        </motion.div>
      </div>
      <div className="mt-5 flex items-center gap-3 border-t border-black/[0.09] pt-4 text-[10px] text-[#777] dark:border-white/[0.1] dark:text-[#858585]">
        <span className="font-[family-name:var(--font-geist-mono)]">
          TIME SLICE
        </span>
        <span className="h-px flex-1 bg-black/[0.1] dark:bg-white/[0.11]" />
        <span>running process returns or finishes</span>
      </div>
    </div>
  );
}

function ComputerNetworksIllustration({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  const stops = [
    [Laptop, "Client"],
    [Network, "Router"],
    [Server, "Server"],
  ] as const;

  return (
    <div className="flex min-h-[230px] flex-col justify-center">
      <div className="relative grid grid-cols-3 gap-5 pt-7">
        <div className="absolute left-[16.66%] right-[16.66%] top-[59px] h-px bg-black/[0.14] dark:bg-white/[0.16]" />
        <motion.span
          animate={reduceMotion ? undefined : { left: ["15%", "50%", "82%"] }}
          transition={{
            duration: 3.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-[54px] z-20 size-3 -translate-x-1/2 rounded-[4px] border border-black/[0.25] bg-[#f7f7f5] dark:border-white/[0.3] dark:bg-[#0a0a0a]"
        />
        {stops.map(([Icon, label]) => (
          <div key={label} className="relative z-10 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-[16px] border border-black/[0.13] bg-[#f7f7f5] dark:border-white/[0.14] dark:bg-[#0a0a0a]">
              <Icon className="size-5" strokeWidth={1.5} />
            </div>
            <p className="mt-3 text-[11px] font-medium">{label}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-6 flex items-center gap-2 rounded-[8px] border border-black/[0.09] px-3 py-2 font-[family-name:var(--font-geist-mono)] text-[9px] text-[#777] dark:border-white/[0.1] dark:text-[#858585]">
        <span>IP packet</span>
        <ArrowRight className="size-3" strokeWidth={1.5} />
        <span>destination</span>
      </div>
    </div>
  );
}

function OopIllustration({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center">
      <div className="w-[190px] overflow-hidden rounded-[12px] border border-black/[0.14] dark:border-white/[0.15]">
        <div className="border-b border-black/[0.1] px-4 py-2.5 text-center text-[12px] font-semibold dark:border-white/[0.11]">
          class User
        </div>
        <div className="grid grid-cols-2 gap-2 px-4 py-3 font-[family-name:var(--font-geist-mono)] text-[9px] text-[#777] dark:text-[#858585]">
          <span>name</span>
          <span>login()</span>
        </div>
      </div>
      <ArrowDown
        className="my-3 size-4 text-[#777] dark:text-[#858585]"
        strokeWidth={1.5}
      />
      <div className="grid w-full grid-cols-2 gap-3">
        {["vivek: User", "admin: User"].map((object, index) => (
          <motion.div
            key={object}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.15 + index * 0.12 }}
            className="rounded-[10px] border border-black/[0.1] bg-black/[0.018] px-3 py-4 text-center font-[family-name:var(--font-geist-mono)] text-[10px] dark:border-white/[0.11] dark:bg-white/[0.025]"
          >
            {object}
          </motion.div>
        ))}
      </div>
      <p className="mt-4 text-[10px] text-[#777] dark:text-[#858585]">
        one definition, independent state
      </p>
    </div>
  );
}

function DbmsTable({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-black/[0.12] bg-[#f7f7f5] dark:border-white/[0.13] dark:bg-[#0a0a0a]">
      <div className="flex items-center gap-2 border-b border-black/[0.1] px-3 py-2.5 dark:border-white/[0.11]">
        <Database className="size-3.5" strokeWidth={1.5} />
        <span className="font-[family-name:var(--font-geist-mono)] text-[10px] font-semibold">
          {title}
        </span>
      </div>
      {rows.map((row) => (
        <div
          key={row}
          className="border-b border-black/[0.07] px-3 py-2 font-[family-name:var(--font-geist-mono)] text-[9px] text-[#666] last:border-0 dark:border-white/[0.08] dark:text-[#999]"
        >
          {row}
        </div>
      ))}
    </div>
  );
}

function DbmsIllustration({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="flex min-h-[230px] flex-col justify-center">
      <div className="grid grid-cols-[1fr_42px_1fr] items-center gap-2">
        <DbmsTable title="customers" rows={["PK  id", "name", "email"]} />
        <div className="relative flex items-center">
          <span className="h-px flex-1 bg-black/[0.18] dark:bg-white/[0.2]" />
          <motion.span
            animate={reduceMotion ? undefined : { scale: [1, 1.2, 1] }}
            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY }}
            className="size-2.5 rounded-full border border-black/[0.3] bg-[#f7f7f5] dark:border-white/[0.35] dark:bg-[#0a0a0a]"
          />
          <span className="h-px flex-1 bg-black/[0.18] dark:bg-white/[0.2]" />
        </div>
        <DbmsTable
          title="orders"
          rows={["PK  id", "FK  customer_id", "total"]}
        />
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 font-[family-name:var(--font-geist-mono)] text-[9px] text-[#777] dark:text-[#858585]">
        <span>PRIMARY KEY</span>
        <ArrowRight className="size-3" strokeWidth={1.5} />
        <span>FOREIGN KEY</span>
      </div>
    </div>
  );
}

export function InterviewHeroAnimation({
  variant,
}: {
  variant: InterviewSubject;
}) {
  const reduceMotion = Boolean(useReducedMotion());

  const illustration = {
    html: <HtmlIllustration reduceMotion={reduceMotion} />,
    css: <CssIllustration reduceMotion={reduceMotion} />,
    javascript: <JavascriptIllustration reduceMotion={reduceMotion} />,
    react: <ReactIllustration reduceMotion={reduceMotion} />,
    "operating-systems": (
      <OperatingSystemsIllustration reduceMotion={reduceMotion} />
    ),
    "computer-networks": (
      <ComputerNetworksIllustration reduceMotion={reduceMotion} />
    ),
    oop: <OopIllustration reduceMotion={reduceMotion} />,
    dbms: <DbmsIllustration reduceMotion={reduceMotion} />,
  }[variant];

  return (
    <IllustrationFrame label={labels[variant]}>
      {illustration}
    </IllustrationFrame>
  );
}
