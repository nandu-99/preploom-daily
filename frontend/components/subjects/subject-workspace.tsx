"use client";

import { MathFormula } from "@/components/subjects/math-formula";
import type {
  SubjectContent,
  SubjectDataTable,
  SubjectFormula,
  SubjectGantt,
  SubjectProblem,
  SubjectStudyMode,
  SubjectTopic,
  SubjectVisual,
} from "@/lib/subject-content";
import {
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ListTree,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useMemo, useState } from "react";

const modeOptions: {
  value: SubjectStudyMode;
  label: string;
  description: string;
}[] = [
  { value: "learn", label: "Full note", description: "Learn the full idea" },
  {
    value: "revise",
    label: "Quick review",
    description: "Read the key points",
  },
  {
    value: "last-minute",
    label: "Last check",
    description: "Bring it back to mind",
  },
];

function clean(text: string) {
  return text.replace(/[\u2014\u2013]/g, "-");
}

function NoteVisual({ visual }: { visual: SubjectVisual }) {
  return (
    <figure className="mt-8">
      <div className="overflow-hidden rounded-[14px]">
        <Image
          src={visual.src}
          alt={visual.alt}
          width={visual.width}
          height={visual.height}
          sizes="(min-width: 1280px) 800px, (min-width: 1024px) 760px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 40px)"
          className="h-auto w-full"
        />
      </div>
      {visual.caption ? (
        <figcaption className="mt-3 text-[11px] leading-5 text-[#777] dark:text-[#888]">
          {clean(visual.caption)}
        </figcaption>
      ) : null}
    </figure>
  );
}

function DataTable({ table }: { table: SubjectDataTable }) {
  return (
    <div className="mt-7 overflow-x-auto rounded-[14px] border border-black/[0.1] dark:border-white/[0.11]">
      <table className="w-full min-w-[620px] border-collapse text-left text-[13px]">
        <thead className="bg-black/[0.035] dark:bg-white/[0.055]">
          <tr>
            {table.headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="border-r border-black/[0.08] px-4 py-3.5 font-semibold last:border-r-0 dark:border-white/[0.09]"
              >
                {clean(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[#505050] dark:text-[#b8b8b8]">
          {table.rows.map((row, rowIndex) => (
            <tr
              key={`${row.join("-")}-${rowIndex}`}
              className="border-t border-black/[0.08] dark:border-white/[0.09]"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`${cell}-${cellIndex}`}
                  className="border-r border-black/[0.08] px-4 py-3.5 last:border-r-0 dark:border-white/[0.09]"
                >
                  {clean(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormulaList({ formulas }: { formulas: SubjectFormula[] }) {
  return (
    <div className="mt-7 grid gap-4">
      {formulas.map((formula) => (
        <figure
          key={`${formula.label ?? "formula"}-${formula.expression}`}
          className="rounded-[14px] border border-black/[0.1] bg-black/[0.025] px-5 py-5 dark:border-white/[0.11] dark:bg-white/[0.04] sm:px-6"
        >
          <figcaption className="text-[12px] font-semibold leading-5 text-[#5f5f5f] dark:text-[#aaa]">
            {clean(formula.label ?? "Key formula")}
          </figcaption>
          <div className="mt-3 overflow-x-auto overscroll-x-contain pb-1">
            <MathFormula expression={formula.expression} />
          </div>
          {formula.note ? (
            <p className="mt-3 border-l-2 border-black/[0.16] pl-3 text-[12px] leading-5 text-[#686868] dark:border-white/[0.2] dark:text-[#999]">
              {clean(formula.note)}
            </p>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

function PracticeProblems({ problems }: { problems: SubjectProblem[] }) {
  return (
    <div className="mt-7 space-y-4">
      {problems.map((problem, problemIndex) => (
        <article
          key={problem.title}
          className="overflow-hidden rounded-[16px] border border-black/[0.1] dark:border-white/[0.11]"
        >
          <div className="border-b border-black/[0.08] bg-black/[0.025] px-5 py-4 dark:border-white/[0.09] dark:bg-white/[0.04] sm:px-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#707070] dark:text-[#929292]">
              Problem {String(problemIndex + 1).padStart(2, "0")}
            </p>
            <h4 className="mt-2 text-[17px] font-semibold tracking-[-0.025em]">
              {clean(problem.title)}
            </h4>
            <p className="mt-2 text-[14px] leading-7 text-[#505050] dark:text-[#b8b8b8]">
              {clean(problem.prompt)}
            </p>
          </div>
          <ol className="px-5 py-2 sm:px-6">
            {problem.steps.map((step, stepIndex) => (
              <li
                key={`${problem.title}-${stepIndex}`}
                className="grid grid-cols-[32px_1fr] gap-3 border-b border-black/[0.07] py-4 text-[13px] leading-7 text-[#505050] last:border-b-0 dark:border-white/[0.08] dark:text-[#b8b8b8]"
              >
                <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-[#777] dark:text-[#888]">
                  {String(stepIndex + 1).padStart(2, "0")}
                </span>
                <span className="font-[family-name:var(--font-geist-mono)]">
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <div className="border-t border-black/[0.08] px-5 py-4 dark:border-white/[0.09] sm:px-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#707070] dark:text-[#929292]">
              Answer
            </p>
            <p className="mt-2 font-[family-name:var(--font-geist-mono)] text-[14px] font-medium leading-7 text-[#202020] dark:text-[#ececea]">
              {problem.answer}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function GanttChart({ gantt }: { gantt: SubjectGantt }) {
  const total = Math.max(...gantt.segments.map((segment) => segment.end));

  return (
    <div className="mt-7 overflow-x-auto pb-2" aria-label="Gantt chart">
      <div className="min-w-[620px]">
        <div className="flex overflow-hidden rounded-[12px] border border-black/[0.12] dark:border-white/[0.13]">
          {gantt.segments.map((segment, index) => (
            <div
              key={`${segment.label}-${segment.start}-${segment.end}-${index}`}
              className="flex min-h-16 items-center justify-center border-r border-black/[0.12] bg-black/[0.025] px-3 text-[13px] font-semibold last:border-r-0 dark:border-white/[0.13] dark:bg-white/[0.045]"
              style={{
                width: `${((segment.end - segment.start) / total) * 100}%`,
              }}
              title={`${segment.label}: ${segment.start} to ${segment.end}`}
            >
              {clean(segment.label)}
            </div>
          ))}
        </div>
        <div className="relative mt-2 h-5 text-[11px] text-[#777] dark:text-[#888]">
          <span className="absolute left-0">0</span>
          {gantt.segments.map((segment, index) => (
            <span
              key={`${segment.end}-${index}`}
              className="absolute -translate-x-1/2 last:translate-x-[-100%]"
              style={{ left: `${(segment.end / total) * 100}%` }}
            >
              {segment.end}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LearnContent({ topic }: { topic: SubjectTopic }) {
  return (
    <div className="space-y-14">
      {topic.learn.sections.map((section) => (
        <section key={section.title}>
          <h3 className="text-[24px] font-semibold leading-tight tracking-[-0.035em] sm:text-[28px]">
            {clean(section.title)}
          </h3>
          <div className="mt-5 space-y-5 text-[15px] leading-8 text-[#505050] dark:text-[#b8b8b8] sm:text-[16px]">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{clean(paragraph)}</p>
            ))}
          </div>
          {section.points && (
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {section.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-[12px] border border-black/[0.09] bg-black/[0.02] p-4 text-[14px] leading-6 text-[#454545] dark:border-white/[0.1] dark:bg-white/[0.035] dark:text-[#c2c2c2]"
                >
                  <Check
                    className="mt-1 size-4 shrink-0"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  {clean(point)}
                </li>
              ))}
            </ul>
          )}
          {section.table ? (
            <div className="mt-7 overflow-hidden rounded-[14px] border border-black/[0.1] dark:border-white/[0.11]">
              <div className="grid grid-cols-2 bg-black/[0.035] text-[13px] font-semibold dark:bg-white/[0.055]">
                {section.table.headers.map((header, index) => (
                  <div
                    key={header}
                    className={`px-4 py-3.5 sm:px-5 ${
                      index === 1
                        ? "border-l border-black/[0.1] dark:border-white/[0.11]"
                        : ""
                    }`}
                  >
                    {clean(header)}
                  </div>
                ))}
              </div>
              {section.table.rows.map((row) => (
                <div
                  key={row.join("-")}
                  className="grid grid-cols-2 border-t border-black/[0.08] text-[13px] leading-6 text-[#505050] dark:border-white/[0.09] dark:text-[#b8b8b8]"
                >
                  {row.map((cell, index) => (
                    <div
                      key={cell}
                      className={`px-4 py-3.5 sm:px-5 ${
                        index === 1
                          ? "border-l border-black/[0.08] dark:border-white/[0.09]"
                          : ""
                      }`}
                    >
                      {clean(cell)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
          {section.dataTable ? <DataTable table={section.dataTable} /> : null}
          {section.formulas ? (
            <FormulaList formulas={section.formulas} />
          ) : null}
          {section.problems ? (
            <PracticeProblems problems={section.problems} />
          ) : null}
          {section.gantt ? <GanttChart gantt={section.gantt} /> : null}
          {section.flow && (
            <div className="mt-8 grid justify-items-center gap-2">
              {section.flow.map((step, index) => (
                <div key={`${step}-${index}`} className="contents">
                  <div
                    className={`w-full max-w-md rounded-[11px] border px-4 py-3 text-center text-[13px] font-medium ${
                      index === 1 || index === 2
                        ? "border-black/20 bg-black/[0.05] dark:border-white/20 dark:bg-white/[0.07]"
                        : "border-black/[0.1] dark:border-white/[0.11]"
                    }`}
                  >
                    {clean(step)}
                  </div>
                  {index < section.flow!.length - 1 ? (
                    <ChevronDown
                      className="size-4 text-[#888]"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          )}
          {section.visual && <NoteVisual visual={section.visual} />}
        </section>
      ))}

      <section className="border-t border-black/[0.12] pt-10 dark:border-white/[0.13]">
        <h3 className="text-[24px] font-semibold leading-tight tracking-[-0.035em] sm:text-[28px]">
          {clean(topic.learn.mechanism.title)}
        </h3>
        <ol className="mt-7 space-y-0">
          {topic.learn.mechanism.steps.map((step, index) => (
            <li
              key={`${step}-${index}`}
              className="grid grid-cols-[40px_1fr] gap-4 border-b border-black/[0.08] py-5 text-[14px] leading-7 text-[#505050] dark:border-white/[0.09] dark:text-[#b8b8b8]"
            >
              <span className="font-medium text-[#151515] dark:text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              {clean(step)}
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 sm:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[16px] border border-black/[0.09] bg-[#ededeb] p-6 text-[#151515] dark:border-white/[0.11] dark:bg-[#151515] dark:text-[#f3f3f1] sm:p-7">
          <p className="text-[12px] font-medium text-[#606060] dark:text-white/60">
            Example
          </p>
          <h3 className="mt-4 text-[22px] font-semibold tracking-[-0.03em]">
            {clean(topic.learn.example.title)}
          </h3>
          <p className="mt-4 text-[14px] leading-7 text-[#505050] dark:text-white/75">
            {clean(topic.learn.example.body)}
          </p>
        </div>
        <div className="rounded-[16px] border border-black/[0.1] p-6 dark:border-white/[0.11] sm:p-7">
          <p className="text-[12px] font-medium text-[#616161] dark:text-[#a8a8a8]">
            A common mistake
          </p>
          <p className="mt-4 text-[15px] leading-7 text-[#454545] dark:text-[#c2c2c2]">
            {clean(topic.learn.misconception)}
          </p>
        </div>
      </section>
    </div>
  );
}

export function ReviewContent({ topic }: { topic: SubjectTopic }) {
  return (
    <div className="space-y-14">
      <section>
        <p className="text-[13px] font-medium text-[#616161] dark:text-[#a8a8a8]">
          {topic.revise.definitionLabel ?? "Short definition"}
        </p>
        <p
          className={`mt-5 max-w-[54ch] font-medium ${
            topic.revise.compactDefinition
              ? "text-[17px] leading-8 tracking-[-0.018em] sm:text-[18px]"
              : "text-[clamp(1.65rem,3.5vw,2.6rem)] leading-[1.22] tracking-[-0.04em]"
          }`}
        >
          {clean(topic.revise.definition)}
        </p>
      </section>

      {topic.revise.sections?.map((section) => (
        <section
          key={section.title}
          className="border-t border-black/[0.1] pt-10 dark:border-white/[0.11]"
        >
          <h3 className="text-[24px] font-semibold tracking-[-0.035em]">
            {clean(section.title)}
          </h3>
          {section.paragraphs ? (
            <div className="mt-5 space-y-4 text-[15px] leading-8 text-[#505050] dark:text-[#b8b8b8]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{clean(paragraph)}</p>
              ))}
            </div>
          ) : null}
          {section.points ? (
            <ul className="mt-6 space-y-3">
              {section.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-[14px] leading-7 text-[#505050] dark:text-[#b8b8b8]"
                >
                  <Check
                    className="mt-1.5 size-4 shrink-0"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  {clean(point)}
                </li>
              ))}
            </ul>
          ) : null}
          {section.table ? (
            <div className="mt-6 overflow-hidden rounded-[14px] border border-black/[0.1] dark:border-white/[0.11]">
              <div className="grid grid-cols-2 bg-black/[0.035] text-[13px] font-semibold dark:bg-white/[0.055]">
                {section.table.headers.map((header, index) => (
                  <div
                    key={header}
                    className={`px-4 py-3.5 sm:px-5 ${
                      index === 1
                        ? "border-l border-black/[0.1] dark:border-white/[0.11]"
                        : ""
                    }`}
                  >
                    {clean(header)}
                  </div>
                ))}
              </div>
              {section.table.rows.map((row) => (
                <div
                  key={row.join("-")}
                  className="grid grid-cols-2 border-t border-black/[0.08] text-[13px] leading-6 text-[#505050] dark:border-white/[0.09] dark:text-[#b8b8b8]"
                >
                  {row.map((cell, index) => (
                    <div
                      key={`${cell}-${index}`}
                      className={`px-4 py-3.5 sm:px-5 ${
                        index === 1
                          ? "border-l border-black/[0.08] dark:border-white/[0.09]"
                          : ""
                      }`}
                    >
                      {clean(cell)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
          {section.dataTable ? <DataTable table={section.dataTable} /> : null}
          {section.formulas ? (
            <FormulaList formulas={section.formulas} />
          ) : null}
          {section.problems ? (
            <PracticeProblems problems={section.problems} />
          ) : null}
          {section.gantt ? <GanttChart gantt={section.gantt} /> : null}
          {section.steps ? (
            <ol className="mt-6 border-t border-black/[0.1] dark:border-white/[0.11]">
              {section.steps.map((step, index) => (
                <li
                  key={`${step}-${index}`}
                  className="grid grid-cols-[36px_1fr] gap-4 border-b border-black/[0.08] py-4 text-[14px] leading-7 text-[#505050] dark:border-white/[0.09] dark:text-[#b8b8b8]"
                >
                  <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-[#777] dark:text-[#888]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {clean(step)}
                </li>
              ))}
            </ol>
          ) : null}
          {section.flow ? (
            <div className="mt-7 grid justify-items-center gap-2">
              {section.flow.map((step, index) => (
                <div key={`${step}-${index}`} className="contents">
                  <div
                    className={`w-full max-w-md rounded-[11px] border px-4 py-3 text-center text-[13px] font-medium ${
                      index === 1 || index === 2
                        ? "border-black/20 bg-black/[0.05] dark:border-white/20 dark:bg-white/[0.07]"
                        : "border-black/[0.1] dark:border-white/[0.11]"
                    }`}
                  >
                    {clean(step)}
                  </div>
                  {index < section.flow!.length - 1 ? (
                    <ChevronDown
                      className="size-4 text-[#888]"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {section.visual && <NoteVisual visual={section.visual} />}
        </section>
      ))}

      <section>
        <h3 className="text-[24px] font-semibold tracking-[-0.035em]">
          Key points
        </h3>
        {topic.revise.essentialsStyle === "plain" ? (
          <ul className="mt-6 grid gap-x-8 gap-y-3 border-t border-black/[0.12] pt-5 dark:border-white/[0.13] sm:grid-cols-2">
            {topic.revise.essentials.map((point) => (
              <li
                key={point}
                className="flex gap-3 text-[14px] leading-7 text-[#505050] dark:text-[#b8b8b8]"
              >
                <Check
                  className="mt-1.5 size-4 shrink-0"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
                {clean(point)}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 border-t border-black/[0.12] dark:border-white/[0.13]">
            {topic.revise.essentials.map((point, index) => (
              <div
                key={point}
                className="grid grid-cols-[36px_1fr] gap-4 border-b border-black/[0.08] py-5 dark:border-white/[0.09]"
              >
                <span className="text-[12px] text-[#777] dark:text-[#858585]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-7 text-[#505050] dark:text-[#b8b8b8]">
                  {clean(point)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {topic.revise.comparison && (
        <section>
          <h3 className="text-[24px] font-semibold tracking-[-0.035em]">
            {topic.revise.comparisonTitle ?? "Compare the two"}
          </h3>
          <div className="mt-6 grid overflow-hidden rounded-[16px] border border-black/[0.1] dark:border-white/[0.11] sm:grid-cols-2">
            {[topic.revise.comparison.left, topic.revise.comparison.right].map(
              (side, index) => (
                <div
                  key={side.label}
                  className={`p-6 sm:p-7 ${
                    index === 1
                      ? "border-t border-black/[0.1] dark:border-white/[0.11] sm:border-l sm:border-t-0"
                      : ""
                  }`}
                >
                  <h4 className="text-[18px] font-semibold tracking-[-0.025em]">
                    {clean(side.label)}
                  </h4>
                  <ul className="mt-5 space-y-3">
                    {side.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-[14px] leading-6 text-[#555] dark:text-[#b3b3b3]"
                      >
                        <Check
                          className="mt-1 size-4 shrink-0"
                          strokeWidth={1.7}
                          aria-hidden="true"
                        />
                        {clean(point)}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </section>
      )}

      {topic.revise.followUp ? (
        <section className="border-l-2 border-[#151515] pl-5 dark:border-white sm:pl-7">
          <p className="text-[12px] font-medium text-[#616161] dark:text-[#a8a8a8]">
            An interviewer may ask
          </p>
          <p className="mt-3 text-[20px] font-medium leading-8 tracking-[-0.025em]">
            {clean(topic.revise.followUp)}
          </p>
        </section>
      ) : null}
    </div>
  );
}

export function RecallContent({ topic }: { topic: SubjectTopic }) {
  if (topic.lastMinute.memoryLineAtEnd) {
    return (
      <div className="space-y-8">
        {topic.lastMinute.definition ? (
          <section className="grid gap-3 border-b border-black/[0.1] pb-6 dark:border-white/[0.11] sm:grid-cols-[120px_1fr] sm:gap-6">
            <h3 className="text-[13px] font-medium">Definition</h3>
            <p className="max-w-[58ch] text-[15px] leading-7 text-[#505050] dark:text-[#b8b8b8]">
              {clean(topic.lastMinute.definition)}
            </p>
          </section>
        ) : null}

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          {topic.lastMinute.sections?.map((section) => (
            <section
              key={section.title}
              className={`border-t border-black/[0.1] pt-5 dark:border-white/[0.11] ${
                section.wide ? "md:col-span-2" : ""
              }`}
            >
              <h3 className="text-[18px] font-semibold tracking-[-0.025em]">
                {clean(section.title)}
              </h3>
              {section.points ? (
                <ul className="mt-4 space-y-2">
                  {section.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-[13px] leading-6 text-[#505050] dark:text-[#b8b8b8]"
                    >
                      <Check
                        className="mt-1.5 size-3.5 shrink-0"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                      {clean(point)}
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.flow ? (
                <div className="mt-4 grid justify-items-center gap-1.5">
                  {section.flow.map((step, index) => (
                    <div key={`${step}-${index}`} className="contents">
                      <div
                        className={`w-full rounded-[9px] border px-3 py-2 text-center text-[12px] font-medium ${
                          index === 1
                            ? "border-black/20 bg-black/[0.055] dark:border-white/20 dark:bg-white/[0.075]"
                            : "border-black/[0.1] dark:border-white/[0.11]"
                        }`}
                      >
                        {clean(step)}
                      </div>
                      {index < section.flow!.length - 1 ? (
                        <ChevronDown
                          className="size-3.5 text-[#888]"
                          strokeWidth={1.6}
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
              {section.paragraphs ? (
                <div className="mt-4 space-y-3 text-[13px] leading-6 text-[#505050] dark:text-[#b8b8b8]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{clean(paragraph)}</p>
                  ))}
                </div>
              ) : null}
              {section.visual ? <NoteVisual visual={section.visual} /> : null}
            </section>
          ))}
        </div>

        <section className="border-t border-black/[0.1] pt-6 dark:border-white/[0.11]">
          <h3 className="text-[18px] font-semibold tracking-[-0.025em]">
            {clean(topic.lastMinute.cuesLabel ?? "Key Points")}
          </h3>
          <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {topic.lastMinute.cues.map((cue) => (
              <li
                key={cue}
                className="flex gap-2.5 text-[13px] leading-6 text-[#505050] dark:text-[#b8b8b8]"
              >
                <Check
                  className="mt-1.5 size-3.5 shrink-0"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
                {clean(cue)}
              </li>
            ))}
          </ul>
        </section>

        {topic.lastMinute.memoryLine ? (
          <section className="grid gap-3 rounded-[14px] bg-black/[0.045] p-5 dark:bg-white/[0.065] sm:grid-cols-[120px_1fr] sm:items-center sm:gap-6 sm:p-6">
            <p className="text-[12px] font-medium text-[#616161] dark:text-[#a8a8a8]">
              {topic.lastMinute.memoryLineLabel ?? "Remember this line"}
            </p>
            <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.035em]">
              {clean(topic.lastMinute.memoryLine)}
            </p>
          </section>
        ) : null}
      </div>
    );
  }

  const memoryLine = (
    <section className="py-5 text-center sm:py-10">
      <p className="text-[13px] font-medium text-[#616161] dark:text-[#a8a8a8]">
        {topic.lastMinute.memoryLineLabel ?? "Remember this line"}
      </p>
      <p
        className={`mx-auto mt-6 max-w-2xl text-balance font-semibold ${
          topic.lastMinute.memoryLineAtEnd
            ? "text-[clamp(1.45rem,3vw,2.4rem)] leading-[1.12] tracking-[-0.04em]"
            : "text-[clamp(2rem,5vw,4rem)] leading-[1.04] tracking-[-0.055em]"
        }`}
      >
        {clean(topic.lastMinute.memoryLine)}
      </p>
    </section>
  );

  return (
    <div className="space-y-12">
      {!topic.lastMinute.memoryLineAtEnd ? memoryLine : null}

      {topic.lastMinute.definition ? (
        <section>
          <h3 className="text-[24px] font-semibold tracking-[-0.035em]">
            Definition
          </h3>
          <p className="mt-5 max-w-[58ch] text-[17px] leading-8 tracking-[-0.015em] text-[#505050] dark:text-[#b8b8b8]">
            {clean(topic.lastMinute.definition)}
          </p>
        </section>
      ) : null}

      {topic.lastMinute.sections?.map((section) => (
        <section
          key={section.title}
          className="border-t border-black/[0.1] pt-10 dark:border-white/[0.11]"
        >
          <h3 className="text-[24px] font-semibold tracking-[-0.035em]">
            {clean(section.title)}
          </h3>
          {section.points ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {section.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-[14px] leading-7 text-[#505050] dark:text-[#b8b8b8]"
                >
                  <Check
                    className="mt-1.5 size-4 shrink-0"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  {clean(point)}
                </li>
              ))}
            </ul>
          ) : null}
          {section.flow ? (
            <div className="mt-7 grid justify-items-center gap-2">
              {section.flow.map((step, index) => (
                <div key={`${step}-${index}`} className="contents">
                  <div
                    className={`w-full max-w-sm rounded-[11px] border px-4 py-3 text-center text-[13px] font-medium ${
                      index === 1
                        ? "border-black/20 bg-black/[0.055] dark:border-white/20 dark:bg-white/[0.075]"
                        : "border-black/[0.1] dark:border-white/[0.11]"
                    }`}
                  >
                    {clean(step)}
                  </div>
                  {index < section.flow!.length - 1 ? (
                    <ChevronDown
                      className="size-4 text-[#888]"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {section.paragraphs ? (
            <div className="mt-6 space-y-4 text-[15px] leading-8 text-[#505050] dark:text-[#b8b8b8]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{clean(paragraph)}</p>
              ))}
            </div>
          ) : null}
          {section.visual ? <NoteVisual visual={section.visual} /> : null}
        </section>
      ))}

      <section className="grid gap-3">
        {topic.lastMinute.cuesLabel ? (
          <h3 className="mb-3 text-[24px] font-semibold tracking-[-0.035em]">
            {clean(topic.lastMinute.cuesLabel)}
          </h3>
        ) : null}
        {topic.lastMinute.cues.map((cue) => (
          <div
            key={cue}
            className="flex items-start gap-4 rounded-[12px] border border-black/[0.09] p-4 dark:border-white/[0.1] sm:p-5"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#151515] text-white dark:border dark:border-white/[0.12] dark:bg-[#242424] dark:text-[#f3f3f1]">
              <Check
                className="size-3.5"
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>
            <p className="pt-0.5 text-[15px] leading-7 text-[#505050] dark:text-[#b8b8b8]">
              {clean(cue)}
            </p>
          </div>
        ))}
      </section>

      {topic.lastMinute.memoryLineAtEnd ? memoryLine : null}

      {topic.lastMinute.trap ? (
        <section className="rounded-[16px] border border-black/[0.09] bg-[#ededeb] p-6 text-[#151515] dark:border-white/[0.11] dark:bg-[#151515] dark:text-[#f3f3f1] sm:p-8">
          <p className="text-[12px] font-medium text-[#606060] dark:text-white/60">
            Do not mix this up
          </p>
          <p className="mt-4 text-[15px] leading-7 text-[#505050] dark:text-white/75">
            {clean(topic.lastMinute.trap)}
          </p>
        </section>
      ) : null}
    </div>
  );
}

export function SubjectWorkspace({ subject }: { subject: SubjectContent }) {
  const topics = useMemo(
    () => subject.modules.flatMap((module) => module.topics),
    [subject.modules],
  );
  const [selectedSlug, setSelectedSlug] = useState(topics[0].slug);
  const [mode, setMode] = useState<SubjectStudyMode>("learn");
  const [completed, setCompleted] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const reduceMotion = useReducedMotion();

  const selectedIndex = topics.findIndex(
    (topic) => topic.slug === selectedSlug,
  );
  const selectedTopic = topics[selectedIndex] ?? topics[0];
  const isComplete = completed.includes(selectedTopic.slug);
  const isSaved = saved.includes(selectedTopic.slug);

  function selectTopic(slug: string) {
    setSelectedSlug(slug);
    document.getElementById("workspace-note")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function toggleList(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    slug: string,
  ) {
    setter((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }

  return (
    <section
      id="workspace"
      className="border-b border-black/[0.08] dark:border-white/[0.09]"
    >
      <div className="sticky top-[68px] z-30 border-b border-black/[0.08] bg-[#f7f7f5]/94 px-5 py-3 backdrop-blur-xl dark:border-white/[0.09] dark:bg-[#0a0a0a]/94 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] font-medium">
              {completed.length} of {topics.length} complete
            </p>
            <p className="text-[12px] text-[#616161] dark:text-[#a8a8a8] sm:hidden">
              {clean(selectedTopic.title)}
            </p>
          </div>
          <div
            className="grid grid-cols-3 rounded-[12px] bg-black/[0.045] p-1 dark:bg-white/[0.055]"
            aria-label="Study mode"
          >
            {modeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                aria-pressed={mode === option.value}
                title={option.description}
                className={`relative min-h-10 rounded-[9px] px-3 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${
                  mode === option.value
                    ? "text-white dark:text-[#f3f3f1]"
                    : "text-[#606060] hover:text-[#151515] dark:text-[#a8a8a8] dark:hover:text-white"
                }`}
              >
                {mode === option.value && (
                  <motion.span
                    layoutId="preview-subject-mode"
                    className="absolute inset-0 rounded-[9px] bg-[#151515] dark:border dark:border-white/[0.12] dark:bg-[#242424]"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 36 }
                    }
                  />
                )}
                <span className="relative">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <details className="group mb-8 rounded-[14px] border border-black/[0.1] dark:border-white/[0.11] lg:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 text-[13px] font-medium">
            <span className="inline-flex items-center gap-2">
              <ListTree
                className="size-4"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              Choose a topic
            </span>
            <ChevronDown
              className="size-4 transition-transform group-open:rotate-180"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </summary>
          <div className="max-h-[55vh] overflow-y-auto border-t border-black/[0.09] p-2 dark:border-white/[0.1]">
            {subject.modules.map((module) => (
              <div key={module.title} className="py-2">
                <p className="px-2 py-1 text-[12px] font-medium">
                  {clean(module.title)}
                </p>
                {module.topics.map((topic) => (
                  <button
                    key={topic.slug}
                    type="button"
                    onClick={() => selectTopic(topic.slug)}
                    className={`flex min-h-11 w-full items-center justify-between rounded-[9px] px-2 text-left text-[13px] ${
                      topic.slug === selectedTopic.slug
                        ? "bg-black/[0.06] font-medium dark:bg-white/[0.08]"
                        : "text-[#606060] dark:text-[#a8a8a8]"
                    }`}
                  >
                    {clean(topic.title)}
                    {completed.includes(topic.slug) && (
                      <Check
                        className="size-4"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </details>

        <div className="grid items-start gap-12 lg:grid-cols-[240px_minmax(0,760px)] lg:justify-between xl:grid-cols-[260px_minmax(0,780px)_190px]">
          <aside className="sticky top-[150px] hidden max-h-[calc(100dvh-180px)] overflow-y-auto pr-5 lg:block">
            <p className="text-[12px] font-medium text-[#616161] dark:text-[#a8a8a8]">
              Topics
            </p>
            <div className="mt-5 space-y-7">
              {subject.modules.map((module) => (
                <section key={module.title}>
                  <h2 className="text-[13px] font-medium">
                    {clean(module.title)}
                  </h2>
                  <div className="mt-2 space-y-1">
                    {module.topics.map((topic) => {
                      const selected = topic.slug === selectedTopic.slug;
                      return (
                        <button
                          key={topic.slug}
                          type="button"
                          onClick={() => selectTopic(topic.slug)}
                          className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-[9px] px-2.5 text-left text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${
                            selected
                              ? "bg-black/[0.06] font-medium text-[#151515] dark:bg-white/[0.08] dark:text-white"
                              : "text-[#606060] hover:bg-black/[0.035] hover:text-[#151515] dark:text-[#a8a8a8] dark:hover:bg-white/[0.05] dark:hover:text-white"
                          }`}
                        >
                          <span>{clean(topic.title)}</span>
                          {completed.includes(topic.slug) && (
                            <Check
                              className="size-3.5 shrink-0"
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </aside>

          <div id="workspace-note" className="min-w-0 scroll-mt-36">
            <AnimatePresence mode="wait">
              <motion.article
                key={`${selectedTopic.slug}:${mode}`}
                initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                transition={{ duration: reduceMotion ? 0 : 0.18 }}
              >
                <header className="border-b border-black/[0.12] pb-9 dark:border-white/[0.13]">
                  <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#616161] dark:text-[#a8a8a8]">
                    <span>{clean(selectedTopic.difficulty)}</span>
                    <span aria-hidden="true">/</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3
                        className="size-3.5"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                      {clean(selectedTopic.readTime)}
                    </span>
                  </div>
                  <h2 className="mt-5 text-balance text-[clamp(2.7rem,5vw,4.8rem)] font-semibold leading-[0.94] tracking-[-0.065em]">
                    {clean(selectedTopic.title)}
                  </h2>
                  <p className="mt-6 max-w-[64ch] text-[16px] leading-8 text-[#505050] dark:text-[#b8b8b8]">
                    {clean(
                      mode === "learn"
                        ? selectedTopic.learn.opening
                        : selectedTopic.description,
                    )}
                  </p>
                </header>

                <div className="py-12">
                  {mode === "learn" && <LearnContent topic={selectedTopic} />}
                  {mode === "revise" && <ReviewContent topic={selectedTopic} />}
                  {mode === "last-minute" && (
                    <RecallContent topic={selectedTopic} />
                  )}
                </div>

                <footer className="grid gap-3 border-t border-black/[0.12] pt-6 dark:border-white/[0.13] sm:grid-cols-2">
                  <button
                    type="button"
                    disabled={selectedIndex === 0}
                    onClick={() =>
                      selectTopic(topics[Math.max(0, selectedIndex - 1)].slug)
                    }
                    className="flex min-h-16 items-center gap-3 rounded-[12px] px-3 text-left text-[13px] transition-colors hover:bg-black/[0.035] disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/[0.05]"
                  >
                    <ChevronLeft
                      className="size-4"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block text-[11px] text-[#616161] dark:text-[#a8a8a8]">
                        Previous
                      </span>
                      <span className="mt-1 block font-medium">
                        {clean(topics[Math.max(0, selectedIndex - 1)].title)}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={selectedIndex === topics.length - 1}
                    onClick={() =>
                      selectTopic(
                        topics[Math.min(topics.length - 1, selectedIndex + 1)]
                          .slug,
                      )
                    }
                    className="flex min-h-16 items-center justify-end gap-3 rounded-[12px] px-3 text-right text-[13px] transition-colors hover:bg-black/[0.035] disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/[0.05]"
                  >
                    <span>
                      <span className="block text-[11px] text-[#616161] dark:text-[#a8a8a8]">
                        Next
                      </span>
                      <span className="mt-1 block font-medium">
                        {clean(
                          topics[Math.min(topics.length - 1, selectedIndex + 1)]
                            .title,
                        )}
                      </span>
                    </span>
                    <ChevronRight
                      className="size-4"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </button>
                </footer>
              </motion.article>
            </AnimatePresence>
          </div>

          <aside className="sticky top-[150px] hidden xl:block">
            <p className="text-[12px] font-medium text-[#616161] dark:text-[#a8a8a8]">
              This topic
            </p>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => toggleList(setCompleted, selectedTopic.slug)}
                className={`flex min-h-11 w-full items-center gap-2.5 rounded-[10px] px-3 text-left text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${
                  isComplete
                    ? "bg-[#151515] text-white dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
                    : "border border-black/[0.1] hover:bg-black/[0.04] dark:border-white/[0.11] dark:hover:bg-white/[0.06]"
                }`}
              >
                <Check
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                {isComplete ? "Completed" : "Mark complete"}
              </button>
              <button
                type="button"
                onClick={() => toggleList(setSaved, selectedTopic.slug)}
                className="flex min-h-11 w-full items-center gap-2.5 rounded-[10px] border border-black/[0.1] px-3 text-left text-[12px] font-medium transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.11] dark:hover:bg-white/[0.06] dark:focus-visible:ring-white/50"
              >
                <Bookmark
                  className={`size-4 ${isSaved ? "fill-current" : ""}`}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
                {isSaved ? "Saved" : "Save for later"}
              </button>
            </div>
          </aside>
        </div>

        <div className="mt-10 flex items-center gap-3 border-t border-black/[0.1] pt-5 dark:border-white/[0.11] xl:hidden">
          <button
            type="button"
            onClick={() => toggleList(setCompleted, selectedTopic.slug)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-[10px] px-4 text-[12px] font-medium ${
              isComplete
                ? "bg-black/[0.07] dark:bg-white/[0.09]"
                : "bg-[#151515] text-white dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
            }`}
          >
            <Check className="size-4" strokeWidth={1.8} aria-hidden="true" />
            {isComplete ? "Completed" : "Mark complete"}
          </button>
          <button
            type="button"
            onClick={() => toggleList(setSaved, selectedTopic.slug)}
            className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-black/[0.1] px-4 text-[12px] font-medium dark:border-white/[0.11]"
          >
            <Bookmark
              className={`size-4 ${isSaved ? "fill-current" : ""}`}
              strokeWidth={1.7}
              aria-hidden="true"
            />
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </section>
  );
}
