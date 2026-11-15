"use client";

import type { WebdevData } from "@/lib/webdev-content";
import { createContext, useContext } from "react";
import { SideDrawer } from "@/components/ui/side-drawer";
import {
  Check,
  Clipboard,
  Code2,
  ExternalLink,
  FileCode2,
  FolderKanban,
  Globe2,
  Layers3,
  TerminalSquare,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

const WebdevContext = createContext<WebdevData | null>(null);
function useWebdevData() {
  const data = useContext(WebdevContext);
  if (!data) throw new Error("WebDev content is unavailable.");
  return data;
}

const tabs = [
  {
    id: "websites",
    label: "Useful websites",
    shortLabel: "Websites",
    icon: Globe2,
  },
  {
    id: "projects",
    label: "Project ideas",
    shortLabel: "Projects",
    icon: FolderKanban,
  },
  {
    id: "libraries",
    label: "Component libraries",
    shortLabel: "Libraries",
    icon: Layers3,
  },
  {
    id: "guides",
    label: "Curated collections",
    shortLabel: "Collections",
    icon: TerminalSquare,
  },
  {
    id: "skills",
    label: "Skills.md",
    shortLabel: "Skills.md",
    icon: FileCode2,
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

const tabDescriptions: Record<TabId, { title: string; body: string }> = {
  websites: {
    title: "Useful websites, already filtered.",
    body: "Find trusted web development tools and resources in one place.",
  },
  projects: {
    title: "Build something worth explaining.",
    body: "Compare project scope, features, and suggested stacks before you choose what to build.",
  },
  libraries: {
    title: "Choose the right starting point.",
    body: "Browse reusable components and effects for modern React projects.",
  },
  guides: {
    title: "Set up, ship, and measure.",
    body: "Follow practical guides from project setup to deployment and analytics.",
  },
  skills: {
    title: "Focused skills for better coding work.",
    body: "Open trusted skills for design, debugging, refactoring, and code review.",
  },
};

const itemEnter = { opacity: 0, y: 6 };
const itemExit = { opacity: 0, y: -4 };

function FilterBar({
  label,
  options,
  value,
  onChange,
  count,
}: {
  label: string;
  options: Array<{ id: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  count: number;
}) {
  return (
    <div className="mb-7 flex items-center gap-3 border-b border-black/[0.08] pb-4 dark:border-white/[0.09]">
      <div className="min-w-0 flex-1 overflow-x-auto">
        <div className="flex min-w-max gap-2" role="group" aria-label={label}>
          {options.map((option) => {
            const active = value === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange(option.id)}
                aria-pressed={active}
                className={`h-8 rounded-full border px-3 text-[11px] font-medium transition-[background-color,border-color,color,transform] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${
                  active
                    ? "border-black/25 bg-[#e5e5e2] text-[#151515] dark:border-white/25 dark:bg-[#202020] dark:text-[#ededed]"
                    : "border-black/[0.1] bg-white/45 text-[#606060] hover:border-black/25 hover:text-[#151515] dark:border-white/[0.11] dark:bg-[#121212] dark:text-[#a8a8a8] dark:hover:border-white/25 dark:hover:text-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <span className="shrink-0 text-[10px] tabular-nums text-[#777] dark:text-[#858585]">
        {count} {count === 1 ? "item" : "items"}
      </span>
    </div>
  );
}

function EmptyFilterState() {
  return (
    <div className="rounded-[14px] border border-black/[0.1] bg-white/45 px-6 py-14 text-center dark:border-white/[0.11] dark:bg-[#111]">
      <p className="text-[14px] font-medium">Nothing matches this filter.</p>
      <p className="mt-2 text-[12px] text-[#606060] dark:text-[#a8a8a8]">
        Choose another filter to see more resources.
      </p>
    </div>
  );
}

const websiteFilters = [
  { id: "all", label: "All" },
  { id: "learning", label: "Docs and learning" },
  { id: "testing", label: "Testing" },
  { id: "design", label: "Design assets" },
  { id: "tools", label: "Developer tools" },
];

function websiteGroup(category: string) {
  if (["Documentation", "Learning"].includes(category)) return "learning";
  if (["Compatibility", "Performance", "Accessibility"].includes(category))
    return "testing";
  if (["Images", "Typography", "Icons"].includes(category)) return "design";
  return "tools";
}

function WebsitesPanel() {
  const { websiteResources } = useWebdevData();
  const [filter, setFilter] = useState("all");
  const reduceMotion = useReducedMotion();
  const resources = websiteResources.filter(
    (resource) =>
      filter === "all" || websiteGroup(resource.category) === filter,
  );

  return (
    <div>
      <FilterBar
        label="Filter useful websites"
        options={websiteFilters}
        value={filter}
        onChange={setFilter}
        count={resources.length}
      />
      {resources.length === 0 ? (
        <EmptyFilterState />
      ) : (
        <motion.div
          layout={!reduceMotion}
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence initial={false}>
            {resources.map((resource) => (
              <motion.a
                layout={!reduceMotion}
                key={resource.name}
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                initial={reduceMotion ? false : itemEnter}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : itemExit}
                className="group flex min-h-[330px] flex-col overflow-hidden rounded-[14px] border border-black/[0.1] bg-white/55 shadow-[0_1px_2px_rgba(20,20,20,0.025)] transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-black/20 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.11] dark:bg-[#111] dark:shadow-none dark:hover:border-white/20 dark:hover:bg-[#151515] dark:focus-visible:ring-white/50"
              >
                <span className="relative block aspect-video overflow-hidden border-b border-black/[0.08] bg-black/[0.025] dark:border-white/[0.09] dark:bg-[#171717]">
                  <Image
                    src={resource.image}
                    alt={resource.imageAlt}
                    fill
                    sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1279px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.015]"
                  />
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="text-[17px] font-semibold tracking-[-0.02em]">
                    {resource.name}
                  </span>
                  <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#777] dark:text-[#858585]">
                    {resource.category}
                  </span>
                  <span className="mt-3 text-[14px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                    {resource.description}
                  </span>
                </span>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

const projectFilters = [
  { id: "all", label: "All levels" },
  { id: "Beginner", label: "Beginner" },
  { id: "Intermediate", label: "Intermediate" },
  { id: "Advanced", label: "Advanced" },
];

function ProjectsPanel() {
  const { projectIdeas } = useWebdevData();
  const [filter, setFilter] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const reduceMotion = useReducedMotion();
  const projects = projectIdeas.filter(
    (project) => filter === "all" || project.level === filter,
  );
  const selectedProject = projectIdeas.find(
    (project) => project.id === selectedProjectId,
  );

  return (
    <div>
      <FilterBar
        label="Filter project ideas"
        options={projectFilters}
        value={filter}
        onChange={setFilter}
        count={projects.length}
      />
      {projects.length === 0 ? (
        <EmptyFilterState />
      ) : (
        <motion.div
          layout={!reduceMotion}
          className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence initial={false}>
            {projects.map((project) => (
              <motion.button
                layout={!reduceMotion}
                key={project.id}
                type="button"
                onClick={() => setSelectedProjectId(project.id)}
                initial={reduceMotion ? false : itemEnter}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : itemExit}
                className="group flex min-h-[245px] flex-col rounded-[14px] border border-black/[0.1] bg-white/55 p-5 text-left shadow-[0_1px_2px_rgba(20,20,20,0.025)] transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-black/20 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.11] dark:bg-[#111] dark:shadow-none dark:hover:border-white/20 dark:hover:bg-[#151515] dark:focus-visible:ring-white/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <Code2
                    className="size-[18px] text-[#777] dark:text-[#858585]"
                    strokeWidth={1.55}
                    aria-hidden="true"
                  />
                  <span className="rounded-full border border-black/[0.1] px-2.5 py-1 text-[10px] text-[#606060] dark:border-white/[0.11] dark:text-[#a8a8a8]">
                    {project.level}
                  </span>
                </div>
                <h3 className="mt-5 text-[18px] font-semibold leading-6 tracking-[-0.025em]">
                  {project.title}
                </h3>
                <p className="mt-2 text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                  {project.description}
                </p>
                <div className="mt-auto border-t border-black/[0.08] pt-4 dark:border-white/[0.09]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] text-[#777] dark:text-[#858585]">
                      {project.stack}
                    </span>
                    <span className="text-[10px] font-medium text-[#151515] dark:text-[#ededed]">
                      View details
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <SideDrawer
        open={Boolean(selectedProject)}
        onOpenChange={(open) => {
          if (!open) setSelectedProjectId(null);
        }}
        title={selectedProject?.title ?? "Project details"}
        description={
          selectedProject?.description ?? "Project scope and suggested skills."
        }
      >
        {selectedProject && (
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-black/[0.1] px-3 py-1.5 text-[10px] dark:border-white/[0.11]">
                {selectedProject.level}
              </span>
              <span className="rounded-full border border-black/[0.1] px-3 py-1.5 text-[10px] dark:border-white/[0.11]">
                {selectedProject.stack}
              </span>
            </div>

            <section className="mt-8">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#777] dark:text-[#858585]">
                Core features
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {selectedProject.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex gap-3 rounded-[12px] border border-black/[0.09] bg-white/45 p-4 text-[12px] leading-5 dark:border-white/[0.1] dark:bg-[#121212]"
                  >
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-[#777] dark:text-[#858585]"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                    {feature}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8 border-t border-black/[0.09] pt-7 dark:border-white/[0.1]">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#777] dark:text-[#858585]">
                What you will practice
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedProject.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-black/[0.1] px-3 py-1.5 text-[11px] dark:border-white/[0.11]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-8 rounded-[12px] border border-black/[0.09] bg-white/45 p-5 dark:border-white/[0.1] dark:bg-[#121212]">
              <h3 className="text-[11px] font-medium text-[#777] dark:text-[#858585]">
                Suggested starting point
              </h3>
              <p className="mt-2 text-[13px] leading-6">
                Build the smallest working version first. Add search,
                permissions, and polish after the main flow works.
              </p>
            </section>
          </div>
        )}
      </SideDrawer>
    </div>
  );
}

function LibrariesPanel() {
  const { componentLibraries } = useWebdevData();
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <motion.div
        layout={!reduceMotion}
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence initial={false}>
          {componentLibraries.map((library) => (
            <motion.a
              layout={!reduceMotion}
              key={library.name}
              href={library.href}
              target="_blank"
              rel="noreferrer"
              initial={reduceMotion ? false : itemEnter}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : itemExit}
              className="group flex min-h-[330px] flex-col overflow-hidden rounded-[14px] border border-black/[0.1] bg-white/55 shadow-[0_1px_2px_rgba(20,20,20,0.025)] transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-black/20 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.11] dark:bg-[#111] dark:shadow-none dark:hover:border-white/20 dark:hover:bg-[#151515] dark:focus-visible:ring-white/50"
            >
              <span className="relative block aspect-video overflow-hidden border-b border-black/[0.08] bg-black/[0.025] dark:border-white/[0.09] dark:bg-[#171717]">
                <Image
                  src={library.image}
                  alt={library.imageAlt}
                  fill
                  sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1279px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.015]"
                />
              </span>
              <span className="flex flex-1 flex-col p-5">
                <span className="text-[17px] font-semibold tracking-[-0.02em]">
                  {library.name}
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#777] dark:text-[#858585]">
                  {library.category}
                </span>
                <span className="mt-3 text-[14px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                  {library.description}
                </span>
              </span>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function CopyCommand({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="absolute right-2 top-2 grid size-8 place-items-center rounded-[8px] border border-black/[0.12] bg-black/[0.035] text-[#666] transition-colors hover:bg-black/[0.07] hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.12] dark:bg-white/[0.06] dark:text-[#bcbcbc] dark:hover:bg-white/[0.1] dark:hover:text-white dark:focus-visible:ring-white/50"
      aria-label={copied ? "Command copied" : "Copy command"}
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden="true" />
      ) : (
        <Clipboard className="size-3.5" aria-hidden="true" />
      )}
    </button>
  );
}

const guideFilters = [
  { id: "all", label: "All guides" },
  { id: "setup", label: "Project setup" },
  { id: "github", label: "GitHub" },
  { id: "deployment", label: "Deployment" },
  { id: "analytics", label: "Analytics & SEO" },
];

function guideGroup(id: string) {
  if (["project-setup", "shadcn-setup"].includes(id)) return "setup";
  if (id === "github-account-ssh") return "github";
  if (["vercel-frontend", "vercel-backend", "render-deployment"].includes(id))
    return "deployment";
  return "analytics";
}

function GuidesPanel({
  onGuideChange,
  selectedGuideId,
}: {
  onGuideChange: (id: string) => void;
  selectedGuideId: string;
}) {
  const { practicalGuides } = useWebdevData();
  const [filter, setFilter] = useState("all");
  const [openGuideId, setOpenGuideId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const guides = practicalGuides.filter(
    (guide) => filter === "all" || guideGroup(guide.id) === filter,
  );
  const selected =
    practicalGuides.find(
      (guide) => guide.id === (openGuideId ?? selectedGuideId),
    ) ?? practicalGuides[0];

  function changeFilter(nextFilter: string) {
    setFilter(nextFilter);
  }

  function openGuide(id: string) {
    setOpenGuideId(id);
    onGuideChange(id);
  }

  return (
    <div>
      <FilterBar
        label="Filter curated collections"
        options={guideFilters}
        value={filter}
        onChange={changeFilter}
        count={guides.length}
      />
      {guides.length === 0 ? (
        <EmptyFilterState />
      ) : (
        <motion.div
          layout={!reduceMotion}
          className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence initial={false}>
            {guides.map((guide) => {
              const active = guide.id === openGuideId;
              return (
                <motion.button
                  layout={!reduceMotion}
                  key={guide.id}
                  type="button"
                  onClick={() => openGuide(guide.id)}
                  initial={reduceMotion ? false : itemEnter}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : itemExit}
                  aria-pressed={active}
                  className={`group flex min-h-[225px] flex-col rounded-[14px] border p-5 text-left shadow-[0_1px_2px_rgba(20,20,20,0.025)] transition-[background-color,border-color,transform] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:shadow-none dark:focus-visible:ring-white/50 ${
                    active
                      ? "border-black/30 bg-white dark:border-white/30 dark:bg-[#151515]"
                      : "border-black/[0.1] bg-white/55 hover:border-black/20 hover:bg-white dark:border-white/[0.11] dark:bg-[#111] dark:hover:border-white/20 dark:hover:bg-[#151515]"
                  }`}
                >
                  <span className="flex w-full items-start justify-between gap-4">
                    <TerminalSquare
                      className="size-[18px] text-[#777] dark:text-[#858585]"
                      strokeWidth={1.55}
                      aria-hidden="true"
                    />
                    <span className="text-[10px] text-[#777] dark:text-[#858585]">
                      {guide.steps.length} steps
                    </span>
                  </span>
                  <span className="mt-5 text-[17px] font-semibold leading-6 tracking-[-0.025em]">
                    {guide.title}
                  </span>
                  <span className="mt-2 text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                    {guide.summary}
                  </span>
                  <span className="mt-auto flex w-full items-center justify-between gap-3 pt-5 text-[10px] text-[#777] dark:text-[#858585]">
                    <span>{guide.environment}</span>
                    <span className="font-medium text-[#151515] dark:text-[#ededed]">
                      Open guide
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <SideDrawer
        open={Boolean(openGuideId)}
        onOpenChange={(open) => {
          if (!open) setOpenGuideId(null);
        }}
        title={selected.title}
        description={selected.summary}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-black/[0.1] px-3 py-1.5 text-[10px] dark:border-white/[0.11]">
            {selected.environment}
          </span>
          <span className="rounded-full border border-black/[0.1] px-3 py-1.5 text-[10px] dark:border-white/[0.11]">
            Checked {selected.checked}
          </span>
        </div>

        <div className="mt-7 grid gap-5 rounded-[12px] border border-black/[0.09] bg-white/45 p-5 dark:border-white/[0.1] dark:bg-[#121212] sm:grid-cols-2">
          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#777] dark:text-[#858585]">
              Before you start
            </h3>
            <ul className="mt-3 grid gap-2">
              {selected.prerequisites.map((item) => (
                <li key={item} className="text-[11px] leading-5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#777] dark:text-[#858585]">
              What you will have
            </h3>
            <p className="mt-3 text-[11px] leading-5">{selected.outcome}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-8">
          {selected.steps.map((step) => (
            <section key={step.title} className="min-w-0">
              <h3 className="text-[14px] font-medium tracking-[-0.015em]">
                {step.title}
              </h3>
              <p className="mt-2 text-[11px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                {step.explanation}
              </p>
              {step.warning && (
                <p className="mt-3 border-l-2 border-black/25 pl-3 text-[10px] leading-5 text-[#606060] dark:border-white/30 dark:text-[#a8a8a8]">
                  {step.warning}
                </p>
              )}
              <div className="relative mt-3 overflow-x-auto rounded-[12px] border border-black/[0.08] bg-[#e7e7e4] p-4 pr-12 text-[#383838] dark:border-white/[0.1] dark:bg-[#292929] dark:text-[#e1e1e1]">
                <pre className="min-w-max font-mono text-[10px] leading-5 sm:text-[11px]">
                  <code>{step.code}</code>
                </pre>
                <CopyCommand value={step.code} />
              </div>
            </section>
          ))}
        </div>

        <a
          href={selected.sourceHref}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-[6px] text-[12px] font-medium text-[#555] underline decoration-black/20 underline-offset-4 hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-[#b3b3b3] dark:decoration-white/25 dark:hover:text-white dark:focus-visible:ring-white/50"
        >
          Check the {selected.sourceLabel}
          <ExternalLink
            className="size-3.5"
            strokeWidth={1.6}
            aria-hidden="true"
          />
        </a>
      </SideDrawer>
    </div>
  );
}

function SkillsPanel() {
  const { skillTemplates } = useWebdevData();
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <motion.div layout={!reduceMotion} className="grid gap-3 md:grid-cols-2">
        <AnimatePresence initial={false}>
          {skillTemplates.map((skill) => (
            <motion.a
              layout={!reduceMotion}
              key={skill.title}
              href={skill.href}
              target="_blank"
              rel="noreferrer"
              initial={reduceMotion ? false : itemEnter}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : itemExit}
              className="group flex min-h-[210px] flex-col rounded-[14px] border border-black/[0.1] bg-white/55 p-5 shadow-[0_1px_2px_rgba(20,20,20,0.025)] transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-black/20 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.11] dark:bg-[#111] dark:shadow-none dark:hover:border-white/20 dark:hover:bg-[#151515] dark:focus-visible:ring-white/50"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#777] dark:text-[#858585]">
                {skill.category}
              </span>
              <h3 className="mt-5 text-[19px] font-semibold leading-7 tracking-[-0.025em]">
                {skill.title}
              </h3>
              <p className="mt-3 text-[14px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                {skill.description}
              </p>
              <span className="mt-auto pt-5 text-[11px] font-medium text-[#151515] dark:text-[#ededed]">
                Open skill
              </span>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function WebdevHubContent() {
  const { practicalGuides } = useWebdevData();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const requestedTab = searchParams.get("tab");
  const activeTab: TabId = tabs.some((tab) => tab.id === requestedTab)
    ? (requestedTab as TabId)
    : "websites";
  const requestedGuide = searchParams.get("guide");
  const selectedGuideId = practicalGuides.some(
    (guide) => guide.id === requestedGuide,
  )
    ? requestedGuide!
    : practicalGuides[0].id;
  const heading = tabDescriptions[activeTab];

  useEffect(() => {
    if (requestedTab && !tabs.some((tab) => tab.id === requestedTab)) {
      router.replace(`${pathname}?tab=websites`, { scroll: false });
    }
  }, [pathname, requestedTab, router]);

  function setQuery(nextTab: TabId, guide?: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    if (nextTab === "guides") {
      if (guide) params.set("guide", guide);
    } else {
      params.delete("guide");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (
      !(["ArrowLeft", "ArrowRight", "Home", "End"] as string[]).includes(
        event.key,
      )
    )
      return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft")
      next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    setQuery(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div id="webdev-resources" className="scroll-mt-[68px]">
      <div className="sticky top-[68px] z-40 border-y border-black/[0.09] bg-[#f7f7f5]/95 backdrop-blur-xl dark:border-white/[0.1] dark:bg-[#0a0a0a]/95">
        <div className="mx-auto max-w-[1240px] overflow-x-auto px-5 sm:px-6 lg:px-8">
          <div
            role="tablist"
            aria-label="Web development resources"
            className="flex min-w-max gap-7 sm:gap-10"
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  role="tab"
                  type="button"
                  id={`webdev-tab-${tab.id}`}
                  aria-controls={`webdev-panel-${tab.id}`}
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setQuery(tab.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`relative flex h-14 items-center gap-2 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${active ? "text-[#151515] dark:text-white" : "text-[#777] hover:text-[#151515] dark:text-[#858585] dark:hover:text-white"}`}
                >
                  <Icon
                    className="size-4"
                    strokeWidth={1.55}
                    aria-hidden="true"
                  />
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {active && (
                    <motion.span
                      layoutId="webdev-active-tab"
                      className="absolute inset-x-0 bottom-0 h-px bg-[#151515] dark:bg-white"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.22, ease: "easeOut" }
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="px-5 py-9 sm:px-6 sm:py-11 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-7 max-w-2xl sm:mb-9">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#777] dark:text-[#858585]">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </p>
            <h2 className="mt-3 text-balance text-[clamp(1.5rem,2.4vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.038em]">
              {heading.title}
            </h2>
            <p className="mt-3 max-w-[58ch] text-[13px] leading-6 text-[#555] dark:text-[#b3b3b3]">
              {heading.body}
            </p>
          </div>

          <div
            id={`webdev-panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`webdev-tab-${activeTab}`}
            tabIndex={0}
            className="focus-visible:outline-none"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.18,
                  ease: "easeOut",
                }}
              >
                {activeTab === "websites" && <WebsitesPanel />}
                {activeTab === "projects" && <ProjectsPanel />}
                {activeTab === "libraries" && <LibrariesPanel />}
                {activeTab === "guides" && (
                  <GuidesPanel
                    selectedGuideId={selectedGuideId}
                    onGuideChange={(id) => setQuery("guides", id)}
                  />
                )}
                {activeTab === "skills" && <SkillsPanel />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

export function WebdevHubSkeleton() {
  return (
    <div className="px-5 py-16 sm:px-6 lg:px-8" aria-hidden="true">
      <div className="mx-auto max-w-[1240px] animate-pulse">
        <div className="h-4 w-32 rounded bg-black/[0.06] dark:bg-[#171717]" />
        <div className="mt-6 h-14 max-w-xl rounded bg-black/[0.06] dark:bg-[#171717]" />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-44 rounded-[14px] border border-black/[0.08] bg-white/45 dark:border-white/[0.09] dark:bg-[#111]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function WebdevHub({ data }: { data: WebdevData }) {
  return (
    <WebdevContext.Provider value={data}>
      <WebdevHubContent />
    </WebdevContext.Provider>
  );
}
