"use client";

import { startLessonPlayback } from "@/lib/lesson-playback";
import {
  linearSearchCode,
  linearSearchSteps,
  parseVisualArray,
  parseVisualTarget,
  quickSortCode,
  quickSortSteps,
} from "@/lib/extra-visualizations";
import { motion, useReducedMotion } from "motion/react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const initialLinear = [14, 7, 22, 7, 31, 18, 42];
const initialQuick = [8, 3, 7, 4, 9, 2, 6];
const button =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-black/15 px-3 text-sm font-medium transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/15 dark:hover:bg-white/10";
const primary = `${button} border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700 dark:border-white/15 dark:bg-[#242424] dark:text-[#f3f3f1] dark:hover:bg-[#2b2b2b]`;
const input =
  "mt-2 h-11 w-full rounded-lg border border-black/20 bg-white px-3 font-mono text-sm outline-none focus:border-neutral-600 focus:ring-2 focus:ring-neutral-600/20 dark:border-white/20 dark:bg-[#181818]";
const subscribe = () => () => {};
const speechSupported = () =>
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;
const serverSpeechSupported = () => false;

type Props = {
  algorithm: "linear" | "quick";
  initialValues?: number[];
  initialTarget?: number;
};

export function ExtraVisualizer({
  algorithm,
  initialValues,
  initialTarget,
}: Props) {
  const linear = algorithm === "linear";
  const defaults = linear ? initialLinear : initialQuick;
  const [values, setValues] = useState(initialValues ?? defaults);
  const [target, setTarget] = useState(initialTarget ?? 7);
  const [arrayDraft, setArrayDraft] = useState(
    (initialValues ?? defaults).join(", "),
  );
  const [targetDraft, setTargetDraft] = useState(String(initialTarget ?? 7));
  const [error, setError] = useState("");
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [narration, setNarration] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const cancelPlayback = useRef<() => void>(() => {});
  const canSpeak = useSyncExternalStore(
    subscribe,
    speechSupported,
    serverSpeechSupported,
  );
  const reducedMotion = useReducedMotion();
  const steps = useMemo(
    () => (linear ? linearSearchSteps(values, target) : quickSortSteps(values)),
    [linear, values, target],
  );
  const step = steps[cursor];
  const finished = cursor === steps.length - 1;
  const code = linear ? linearSearchCode : quickSortCode;
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const activeIndex = step.active;
  const range = step.range;

  useEffect(() => {
    if (!playing) return;
    const cancel = startLessonPlayback({
      delay: (step.phase === "Compare" ? 2100 : 1500) / speed,
      speak:
        narration && canSpeak
          ? (done, fail) => {
              const synth = window.speechSynthesis;
              const utterance = new SpeechSynthesisUtterance(
                `${step.title}. ${step.explanation}`,
              );
              utterance.rate = 0.95;
              utterance.onend = done;
              utterance.onerror = fail;
              synth.cancel();
              synth.speak(utterance);
              return () => {
                utterance.onend = null;
                utterance.onerror = null;
                synth.cancel();
              };
            }
          : undefined,
      onComplete: () => {
        if (finished) setPlaying(false);
        else setCursor((index) => Math.min(index + 1, steps.length - 1));
      },
      onError: () => {
        setPlaying(false);
        setNarration(false);
        setSpeechError(
          "Voice could not play. Continue with the playback controls.",
        );
      },
    });
    cancelPlayback.current = cancel;
    return cancel;
  }, [playing, step, speed, narration, canSpeak, finished, steps.length]);

  function stop() {
    cancelPlayback.current();
    if (canSpeak) window.speechSynthesis.cancel();
    setPlaying(false);
  }
  function moveTo(index: number) {
    stop();
    setCursor(index);
    if (narration && canSpeak) {
      const next = steps[index];
      const utterance = new SpeechSynthesisUtterance(
        `${next.title}. ${next.explanation}`,
      );
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }
  function load(nextValues: number[], nextTarget = target) {
    stop();
    setValues(nextValues);
    setTarget(nextTarget);
    setArrayDraft(nextValues.join(", "));
    setTargetDraft(String(nextTarget));
    setCursor(0);
    setError("");
    setSpeechError("");
  }
  function applyInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const nextValues = parseVisualArray(arrayDraft, linear ? 12 : 10);
      const nextTarget = linear ? parseVisualTarget(targetDraft) : target;
      load(nextValues, nextTarget);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Check your numbers.");
    }
  }

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.46fr)] xl:items-start">
      <div className="grid min-w-0 gap-5">
        <details className="rounded-xl border border-black/10 bg-white/60 dark:border-white/10 dark:bg-[#111]">
          <summary className="cursor-pointer rounded-xl px-5 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2">
            Customize {linear ? "array and target" : "array"}
            <span className="ml-2 text-xs font-normal text-neutral-500 dark:text-neutral-400">
              Try your own values or examples
            </span>
          </summary>
          <form
            onSubmit={applyInput}
            className="border-t border-black/10 p-4 dark:border-white/10"
          >
            <div
              className={`grid items-end gap-3 ${linear ? "sm:grid-cols-[minmax(0,1fr)_96px_auto]" : "sm:grid-cols-[minmax(0,1fr)_auto]"}`}
            >
              <label
                htmlFor={`${algorithm}-array`}
                className="min-w-0 text-xs font-medium"
              >
                Array · up to {linear ? 12 : 10} values
                <input
                  id={`${algorithm}-array`}
                  value={arrayDraft}
                  onChange={(event) => setArrayDraft(event.target.value)}
                  aria-describedby={error ? `${algorithm}-error` : undefined}
                  className={input}
                />
              </label>
              {linear && (
                <label htmlFor="linear-target" className="text-xs font-medium">
                  Target
                  <input
                    id="linear-target"
                    inputMode="numeric"
                    value={targetDraft}
                    onChange={(event) => setTargetDraft(event.target.value)}
                    aria-describedby={error ? "linear-error" : undefined}
                    className={input}
                  />
                </label>
              )}
              <button type="submit" className={`${button} h-11`}>
                Apply input
              </button>
            </div>
            {error && (
              <p
                id={`${algorithm}-error`}
                role="alert"
                className="mt-3 text-sm text-red-700 dark:text-red-400"
              >
                {error}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <span>Try an example:</span>
              {(linear
                ? [
                    { label: "Find first 7", values: initialLinear, target: 7 },
                    { label: "Missing 50", values: initialLinear, target: 50 },
                    {
                      label: "First position",
                      values: initialLinear,
                      target: 14,
                    },
                  ]
                : [
                    { label: "Mixed", values: initialQuick, target },
                    {
                      label: "Already sorted",
                      values: [1, 2, 3, 4, 5],
                      target,
                    },
                    { label: "Reverse order", values: [9, 7, 5, 3, 1], target },
                    { label: "Duplicates", values: [5, 2, 5, 1, 2], target },
                  ]
              ).map((example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => load(example.values, example.target)}
                  className="min-h-8 underline decoration-neutral-400 underline-offset-4 hover:text-neutral-700 dark:hover:text-neutral-400"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </form>
        </details>
        <section
          aria-label={`${linear ? "Linear search" : "Quick sort"} animation`}
          className="min-w-0 overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#111]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 px-4 py-3 dark:border-white/10 sm:px-5">
            <h2 className="text-sm font-semibold">
              {linear ? `Find ${target}` : "Smallest to biggest"}
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {step.comparisons} comparisons
              {linear ? "" : ` · ${step.swaps} exchanges`}
            </p>
          </div>
          <div className="bg-black/[0.02] px-3 py-3 dark:bg-white/[0.02] sm:px-5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  stop();
                  setCursor(0);
                }}
                className={button}
                aria-label="Restart visualization"
              >
                <RotateCcw size={15} /> Restart
              </button>
              <button
                type="button"
                onClick={() => {
                  if (playing) stop();
                  else {
                    if (finished) setCursor(0);
                    setPlaying(true);
                  }
                }}
                className={button}
              >
                <span>
                  {playing ? <Pause size={15} /> : <Play size={15} />}
                </span>
                {playing ? "Pause" : finished ? "Replay" : "Play"}
              </button>
              <button
                type="button"
                disabled={!canSpeak}
                aria-pressed={narration}
                onClick={() => {
                  stop();
                  setSpeechError("");
                  setNarration(!narration);
                }}
                className={button}
                title={
                  canSpeak
                    ? "Voice plays after Play or Next"
                    : "Voice is unavailable in this browser"
                }
              >
                {narration ? <Volume2 size={15} /> : <VolumeX size={15} />}{" "}
                Narration: {narration ? "on" : "off"}
              </button>
              <label className="ml-auto flex items-center gap-2 text-xs">
                Speed
                <select
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  className="h-10 rounded-lg border border-black/15 bg-white px-2 dark:border-white/15 dark:bg-[#181818]"
                >
                  {[0.5, 1, 2, 3].map((rate) => (
                    <option key={rate} value={rate}>
                      {rate}×
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {speechError && (
              <p
                role="alert"
                className="mt-2 text-xs text-red-700 dark:text-red-400"
              >
                {speechError}
              </p>
            )}
          </div>
          <div className="px-3 pb-4 pt-4 sm:px-5">
            <div
              className="min-h-[112px]"
              aria-live={narration ? "off" : "polite"}
              aria-atomic="true"
            >
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {step.phase}
              </p>
              <h3 className="mt-1 flex items-center gap-2 text-base font-semibold sm:text-lg">
                {finished && <Check size={18} />}
                {step.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
                {step.explanation}
              </p>
            </div>
            <div
              className="mt-3 min-w-0 overflow-x-auto rounded-xl bg-neutral-50 dark:bg-neutral-950"
              tabIndex={0}
              aria-label="Animated array of values and positions"
            >
              <div
                className="relative h-[278px] w-full"
                style={{ minWidth: values.length * 41 }}
              >
                {range && (
                  <motion.div
                    aria-hidden="true"
                    initial={false}
                    animate={{
                      left: `${(range[0] / values.length) * 100}%`,
                      width: `${((range[1] - range[0] + 1) / values.length) * 100}%`,
                    }}
                    transition={{ duration: reducedMotion ? 0 : 0.35 / speed }}
                    className="absolute top-[78px] h-[128px] rounded-xl border border-neutral-400/60 bg-neutral-200/40 dark:border-neutral-600 dark:bg-neutral-800/40"
                  />
                )}
                <div className="absolute inset-x-2 top-5 text-center text-[11px] text-neutral-600 dark:text-neutral-400">
                  {linear
                    ? "Check one value at a time from left to right"
                    : step.pivot === null
                      ? "Finished pivots remain in place"
                      : `Pivot: ${step.items[step.pivot]?.value} · boundary: ${step.boundary}`}
                </div>
                {step.items.map((item, index) => {
                  const active = activeIndex === index;
                  const pivot = step.pivot === index;
                  const fixed = step.fixed.includes(index);
                  const visited =
                    linear &&
                    index <
                      (activeIndex ?? (step.result === -1 ? values.length : 0));
                  const height =
                    58 +
                    (maximum === minimum
                      ? 0.5
                      : (item.value - minimum) / (maximum - minimum)) *
                      63;
                  return (
                    <motion.div
                      key={item.id}
                      initial={false}
                      animate={{
                        left: `${((index + 0.5) / values.length) * 100}%`,
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.5 / speed,
                        ease: "easeInOut",
                      }}
                      className="absolute bottom-14 flex -translate-x-1/2 flex-col items-center"
                      style={{
                        width: `min(52px, calc(100% / ${values.length} - 4px))`,
                      }}
                      aria-label={`Index ${index}, value ${item.value}${active ? ", current value" : ""}${pivot ? ", pivot" : ""}${fixed ? ", final position" : ""}`}
                    >
                      <span className="mb-2 h-5 whitespace-nowrap text-center text-[10px]">
                        {pivot ? (
                          "pivot"
                        ) : active ? (
                          "check"
                        ) : fixed ? (
                          <Check size={14} />
                        ) : (
                          ""
                        )}
                      </span>
                      <motion.div
                        initial={false}
                        animate={{ height, opacity: visited ? 0.4 : 1 }}
                        transition={{
                          duration: reducedMotion ? 0 : 0.35 / speed,
                        }}
                        className={`flex w-full items-end justify-center rounded-lg border pb-2 font-mono text-sm font-semibold ${active ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-black" : pivot ? "border-neutral-500 bg-neutral-300 dark:border-neutral-300 dark:bg-neutral-700" : fixed ? "border-neutral-500 bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-800" : "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900"}`}
                      >
                        {item.value}
                      </motion.div>
                    </motion.div>
                  );
                })}
                <div
                  className="absolute inset-x-0 bottom-7 grid h-4 items-center"
                  style={{
                    gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
                  }}
                >
                  {step.items.map((_, index) => (
                    <span
                      key={index}
                      className="text-center font-mono text-[10px] text-neutral-500 dark:text-neutral-400"
                    >
                      {index}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-black/10 px-4 py-4 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <label htmlFor={`${algorithm}-timeline`}>
                Step {cursor + 1} of {steps.length} · {step.phase}
              </label>
              <span>Drag to preview silently</span>
            </div>
            <input
              id={`${algorithm}-timeline`}
              type="range"
              min={0}
              max={steps.length - 1}
              value={cursor}
              onChange={(event) => {
                stop();
                setCursor(Number(event.target.value));
              }}
              aria-valuetext={step.title}
              className="my-3 block h-4 w-full accent-neutral-700"
            />
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={cursor === 0}
                onClick={() => moveTo(cursor - 1)}
                className={button}
              >
                <ChevronLeft size={15} /> Back
              </button>
              <button
                type="button"
                disabled={finished}
                onClick={() => moveTo(cursor + 1)}
                className={primary}
              >
                Next: {steps[cursor + 1]?.phase ?? "Complete"}
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>
        {finished && (
          <p className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
            {linear
              ? step.result === -1
                ? `${target} is not present after ${step.comparisons} comparisons.`
                : `The first ${target} is at index ${step.result}, after ${step.comparisons} comparisons.`
              : `${values.length} values sorted with ${step.comparisons} comparisons and ${step.swaps} exchanges.`}
          </p>
        )}
      </div>
      <section
        aria-label={`${linear ? "Linear search" : "Quick sort"} Python code`}
        className="min-w-0 overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#111] xl:sticky xl:top-[84px]"
      >
        <div className="flex justify-between border-b border-black/10 px-5 py-4 text-sm dark:border-white/10">
          <h2 className="font-medium">Follow the logic</h2>
          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
            Python · line {step.line}
          </span>
        </div>
        <pre
          className="overflow-x-auto py-4 text-[13px] leading-7"
          tabIndex={0}
        >
          <code>
            {code.map((line, index) => (
              <span
                key={index}
                aria-current={step.line === index + 1 ? "step" : undefined}
                className={`block min-w-max border-l-[3px] pr-5 transition-colors duration-200 ${step.line === index + 1 ? "border-neutral-950 bg-neutral-200 font-semibold text-neutral-950 dark:border-white dark:bg-neutral-800 dark:text-white" : "border-transparent text-neutral-700 dark:text-neutral-300"}`}
              >
                <span
                  aria-hidden="true"
                  className="inline-block w-10 pr-3 text-right text-neutral-500"
                >
                  {step.line === index + 1 ? "▶" : index + 1}
                </span>
                {line}
              </span>
            ))}
          </code>
        </pre>
        <div className="border-t border-black/10 px-5 py-4 text-xs leading-5 text-neutral-600 dark:border-white/10 dark:text-neutral-400">
          {linear
            ? "Linear search returns the first match, or -1 if nothing matches."
            : "The pivot is fixed after each partition. The left and right ranges are sorted recursively."}
        </div>
      </section>
    </div>
  );
}
