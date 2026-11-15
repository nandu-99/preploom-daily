"use client";

import { narrationNumbers } from "@/lib/narration-numbers";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
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
  insertionSortCode,
  insertionSortSteps,
  parseInsertionInput,
} from "@/lib/insertion-sort";
import { narrateInSequence, startLessonPlayback } from "@/lib/lesson-playback";

import { insertionSortNarration } from "@/lib/insertion-sort-narration";
import type { InsertionStep } from "@/lib/insertion-sort";

const initial = [6, 3, 8, 2, 5];
const subscribe = () => () => {};
const supported = () =>
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;
const serverSupported = () => false;
const button =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-black/15 px-3 text-sm font-medium hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/15 dark:hover:bg-white/10";
const primary = `${button.replace("hover:bg-black/5", "").replace("dark:hover:bg-white/10", "")} bg-neutral-900 text-white enabled:hover:bg-neutral-700 dark:bg-[#242424] dark:text-[#f3f3f1] dark:enabled:hover:bg-[#2b2b2b] transition-colors`;
const phases = {
  ready: "Start",
  pick: "Pick number",
  move: "Move checking position",
  compare: "Compare",
  shift: "Shift right",
  place: "Find insertion position",
  insert: "Insert",
  done: "Complete",
};

export function InsertionSortVisualizer({
  initialValues = initial,
}: {
  initialValues?: number[];
}) {
  const [values, setValues] = useState(initialValues);
  const [draft, setDraft] = useState(initialValues.join(", "));
  const [showIdentity, setShowIdentity] = useState(false);
  const [error, setError] = useState("");
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [narration, setNarration] = useState(false);
  const [manualSpeech, setManualSpeech] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [spokenCue, setSpokenCue] = useState<{
    step: InsertionStep;
    text: string;
    moved: boolean;
  } | null>(null);
  const speechRequested = useRef(false);
  const cancelPlayback = useRef<() => void>(() => {});
  const canSpeak = useSyncExternalStore(subscribe, supported, serverSupported);
  const reducedMotion = useReducedMotion();
  const steps = useMemo(() => insertionSortSteps(values), [values]);
  const step = steps[cursor];
  const finished = cursor === steps.length - 1;
  const narrationParts = useMemo(() => insertionSortNarration(step), [step]);
  const waitingForMove =
    narration &&
    ["pick", "shift", "insert"].includes(step.status) &&
    (playing || manualSpeech || spokenCue?.step === step) &&
    !(spokenCue?.step === step && spokenCue.moved);
  const visual = waitingForMove ? steps[cursor - 1] : step;
  const caption =
    narration && spokenCue?.step === step ? spokenCue.text : step.explanation;
  const duration = reducedMotion ? 0 : 0.65 / speed;

  useEffect(() => {
    if (!playing && !(narration && manualSpeech)) return;
    const cancel = startLessonPlayback({
      delay: (step.status === "compare" ? 2300 : 1500) / speed,
      speak:
        narration && canSpeak && speechRequested.current
          ? (done, fail) => {
              const synth = window.speechSynthesis;
              const voices = synth.getVoices();
              const hindi = (voice: SpeechSynthesisVoice) =>
                voice.lang.replaceAll("_", "-").toLowerCase() === "hi-in";
              const voice =
                voices.find(
                  (item) => hindi(item) && /google/i.test(item.name),
                ) ??
                voices.find(hindi) ??
                voices.find(
                  (item) => item.lang.startsWith("en") && item.localService,
                ) ??
                voices.find((item) => item.lang.startsWith("en"));
              return narrateInSequence(
                narrationParts,
                (text, partDone, partFailed) => {
                  const utterance = new SpeechSynthesisUtterance(
                    narrationNumbers(text),
                  );
                  if (voice) utterance.voice = voice;
                  utterance.lang = voice?.lang ?? "hi-IN";
                  utterance.rate = 0.95;
                  utterance.onstart = () => {
                    const partIndex = narrationParts.findIndex(
                      (part) => part.text === text,
                    );
                    setSpokenCue({
                      step,
                      text,
                      moved: narrationParts
                        .slice(0, partIndex + 1)
                        .some((part) => part.move),
                    });
                  };
                  utterance.onend = partDone;
                  utterance.onerror = partFailed;
                  synth.cancel();
                  synth.speak(utterance);
                  return () => {
                    utterance.onstart = null;
                    utterance.onend = null;
                    utterance.onerror = null;
                    synth.cancel();
                  };
                },
                done,
                fail,
              );
            }
          : undefined,
      onComplete: () => {
        if (!playing || finished) {
          speechRequested.current = false;
          setManualSpeech(false);
          setPlaying(false);
        } else setCursor((index) => Math.min(index + 1, steps.length - 1));
      },
      onError: () => {
        speechRequested.current = false;
        setPlaying(false);
        setManualSpeech(false);
        setNarration(false);
        setSpeechError(
          "Voice could not play. Turn narration on to retry, or press Play to continue silently.",
        );
      },
    });
    cancelPlayback.current = cancel;
    return cancel;
  }, [
    playing,
    manualSpeech,
    narration,
    canSpeak,
    step,
    speed,
    finished,
    steps.length,
    narrationParts,
  ]);

  function stop() {
    speechRequested.current = false;
    cancelPlayback.current();
    if (supported()) window.speechSynthesis.cancel();
  }
  function reset() {
    stop();
    setPlaying(false);
    setManualSpeech(false);
    setCursor(0);
  }
  function jump(index: number, speak = narration) {
    stop();
    speechRequested.current = speak;
    setSpokenCue(null);
    setPlaying(false);
    setManualSpeech(speak);
    setCursor(index);
  }
  function load(next: number[]) {
    reset();
    setValues(next);
    setDraft(next.join(", "));
    setError("");
  }

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.46fr)] xl:items-start">
      <div className="grid min-w-0 gap-5">
        <details className="rounded-xl border border-black/10 bg-white/60 dark:border-white/10 dark:bg-[#111]">
          <summary className="cursor-pointer rounded-xl px-5 py-3 text-sm font-medium">
            Customize input
          </summary>
          <form
            className="border-t border-black/10 p-4 dark:border-white/10"
            onSubmit={(event) => {
              event.preventDefault();
              try {
                load(parseInsertionInput(draft));
              } catch (cause) {
                setError(
                  cause instanceof Error
                    ? cause.message
                    : "Check your numbers.",
                );
              }
            }}
          >
            <div className="flex flex-wrap items-end gap-3">
              <label
                htmlFor="insertion-input"
                className="min-w-0 flex-1 text-xs font-medium"
              >
                Numbers to sort · up to 12
                <input
                  id="insertion-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  aria-describedby={error ? "insertion-input-error" : undefined}
                  className="mt-2 h-11 w-full min-w-52 rounded-lg border border-black/20 bg-white px-3 font-mono text-sm focus:outline-2 dark:border-white/20 dark:bg-neutral-900"
                />
              </label>
              <button type="submit" className={button}>
                Apply input
              </button>
            </div>
            {error && (
              <p
                id="insertion-input-error"
                role="alert"
                className="mt-2 text-sm text-red-700 dark:text-red-400"
              >
                {error}
              </p>
            )}
            <label className="mt-3 flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={showIdentity}
                onChange={(event) => setShowIdentity(event.target.checked)}
              />
              Show original positions to track equal values
            </label>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              {[
                ["Mixed", initial],
                ["Already sorted", [2, 3, 5, 6, 8]],
                ["Nearly sorted", [2, 3, 6, 5, 8]],
                ["Reverse order", [8, 6, 5, 3, 2]],
                ["Duplicates", [4, 2, 4, 1]],
              ].map(([label, input]) => (
                <button
                  type="button"
                  key={String(label)}
                  className="min-h-9 underline underline-offset-4"
                  onClick={() => load(input as number[])}
                >
                  {String(label)}
                </button>
              ))}
            </div>
          </form>
        </details>
        <section
          aria-label="Insertion sort animation"
          className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#111]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 px-5 py-3 dark:border-white/10">
            <h2 className="text-sm font-semibold">Smallest → biggest</h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {step.comparisons} comparisons · {step.shifts} shifts
            </p>
          </div>
          <div className="border-t border-black/10 bg-black/[0.02] px-4 py-3 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={reset}
                className={button}
                aria-label="Restart sort"
              >
                <RotateCcw size={15} /> Restart
              </button>
              <button
                type="button"
                className={button}
                onClick={() => {
                  stop();
                  speechRequested.current = !playing && narration;
                  setManualSpeech(false);
                  if (finished && !playing) setCursor(0);
                  setPlaying(!playing);
                }}
              >
                {playing ? <Pause size={15} /> : <Play size={15} />}
                {playing ? "Pause" : finished ? "Replay" : "Play"}
              </button>
              <button
                type="button"
                disabled={!canSpeak}
                aria-pressed={narration}
                onClick={() => {
                  stop();
                  setPlaying(false);
                  setManualSpeech(false);
                  setSpeechError("");
                  setNarration(!narration);
                }}
                className={button}
              >
                {narration ? <Volume2 size={15} /> : <VolumeX size={15} />}
                Narration: {narration ? "on" : "off"}
              </button>
              <label className="ml-auto flex items-center gap-2 text-xs">
                Animation speed
                <select
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  className="h-10 rounded-lg border border-black/15 bg-white px-2 dark:border-white/15 dark:bg-neutral-900"
                >
                  {[0.5, 1, 2, 3].map((value) => (
                    <option key={value} value={value}>
                      {value}×
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {speechError && (
              <p
                role="alert"
                className="mt-3 text-xs text-neutral-600 dark:text-neutral-400"
              >
                {speechError}
              </p>
            )}
            {!canSpeak && (
              <p className="mt-3 text-xs text-neutral-500">
                Voice is unavailable in this browser. Follow the explanations
                below.
              </p>
            )}
          </div>
          <div className="px-4 pt-3">
            <div
              className="h-28 overflow-y-auto"
              aria-live={narration ? "off" : "polite"}
              aria-atomic="true"
            >
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {step.pass
                  ? `Number ${step.pass + 1} of ${values.length} · `
                  : ""}
                {phases[step.status]}
              </p>
              <h3 className="mt-1 flex items-center gap-2 text-lg font-semibold">
                {finished && <Check size={18} />}
                {step.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {caption}
              </p>
            </div>
            <div
              className="overflow-x-auto rounded-lg bg-neutral-50 dark:bg-neutral-950"
              tabIndex={0}
              aria-label="Insertion sort array: a held number, moving gap, and sorted section"
            >
              <div
                className="relative h-[300px]"
                style={{ minWidth: values.length * 50 }}
              >
                <p className="absolute inset-x-2 top-2 h-10 overflow-y-auto text-center text-xs">
                  {step.status === "compare"
                    ? step.title
                    : visual.held
                      ? `Holding ${visual.held.value} while we make room`
                      : finished
                        ? "All numbers are sorted"
                        : "Take a number → move bigger numbers right → put it back"}
                </p>
                {visual.gap !== null && (
                  <motion.div
                    initial={false}
                    animate={{
                      left: `${((visual.gap + 0.5) / values.length) * 100}%`,
                    }}
                    transition={{ duration }}
                    className="absolute top-[166px] flex h-14 -translate-x-1/2 items-center justify-center rounded-lg border-2 border-dashed border-neutral-400 text-xs"
                    style={{
                      width: `min(56px, calc(100% / ${values.length} - 4px))`,
                    }}
                  >
                    Empty
                  </motion.div>
                )}
                {values.map((value, id) => {
                  const held = visual.held?.id === id;
                  const index = held
                    ? visual.gap!
                    : visual.items.findIndex((item) => item?.id === id);
                  const checking =
                    !held &&
                    index === visual.j &&
                    ["compare", "move"].includes(step.status);
                  return (
                    <motion.div
                      key={id}
                      initial={false}
                      animate={{
                        left: `${((index + 0.5) / values.length) * 100}%`,
                        top: held ? 66 : 166,
                      }}
                      transition={{ duration, ease: "easeInOut" }}
                      className="absolute flex h-14 -translate-x-1/2 items-center justify-center"
                      style={{
                        width: `min(56px, calc(100% / ${values.length} - 4px))`,
                      }}
                      aria-label={`Value ${value}${held ? ", held as key" : `, position ${index}`}`}
                    >
                      <span className="absolute -top-6 whitespace-nowrap text-[11px]">
                        {held
                          ? "Number to insert"
                          : checking
                            ? "Compare this"
                            : ""}
                      </span>
                      <span
                        className={`flex h-full w-full flex-col items-center justify-center rounded-lg border font-mono ${values.length > 9 ? "text-sm" : "text-lg"} ${held ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black" : checking ? "border-2 border-neutral-600 bg-white dark:bg-neutral-900" : "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900"}`}
                      >
                        {value}
                        {showIdentity && (
                          <small className="text-[10px] leading-none">
                            #{id}
                          </small>
                        )}
                      </span>
                    </motion.div>
                  );
                })}
                <div
                  className="absolute inset-x-0 top-[232px] grid text-center font-mono text-xs text-neutral-500"
                  style={{
                    gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
                  }}
                >
                  {values.map((_, index) => (
                    <span key={index}>{index}</span>
                  ))}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex h-7 text-center text-[10px] leading-6">
                  <span
                    className="border-t-2 border-neutral-500 bg-neutral-200/50 dark:bg-neutral-800"
                    style={{
                      width: `${((visual.held ? visual.i + 1 : visual.sortedCount) / values.length) * 100}%`,
                    }}
                  >
                    {finished
                      ? "Sorted ✓"
                      : visual.held
                        ? "Making room here"
                        : "In order so far"}
                  </span>
                  <span className="flex-1 border-t border-dashed border-neutral-400">
                    {(visual.held ? visual.i + 1 : visual.sortedCount) <
                    values.length
                      ? "Not checked yet"
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 border-t border-black/10 px-4 py-4 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="insertion-timeline"
                className="text-xs text-neutral-600 dark:text-neutral-400"
              >
                Step {cursor + 1} of {steps.length} · {phases[step.status]}
              </label>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Drag to preview silently
              </span>
            </div>
            <input
              id="insertion-timeline"
              type="range"
              min={0}
              max={steps.length - 1}
              value={cursor}
              onChange={(event) => jump(Number(event.target.value), false)}
              aria-valuetext={step.title}
              className="my-3 block h-4 w-full accent-neutral-700"
            />
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={cursor === 0}
                onClick={() => jump(cursor - 1)}
                className={button}
                aria-label="Previous step"
              >
                <ChevronLeft size={15} /> Back
              </button>
              <button
                type="button"
                disabled={finished}
                onClick={() => jump(cursor + 1)}
                className={primary}
                aria-label={`Next: ${steps[cursor + 1] ? phases[steps[cursor + 1].status] : "Complete"}`}
              >
                Next:{" "}
                {steps[cursor + 1]
                  ? phases[steps[cursor + 1].status]
                  : "Complete"}
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>
        {finished && (
          <div className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
            <p>
              {values.length} items: {step.comparisons} comparisons and{" "}
              {step.shifts} shifts.{" "}
              {
                "Insertion sort moves bigger numbers right, then puts the held number in the gap."
              }
            </p>
            <Link
              className="mt-2 inline-block underline underline-offset-4"
              href={{
                pathname: "/dsa/visualizations/bubble-sort",
                query: { input: values.join(",") },
              }}
            >
              Try the same numbers in Bubble sort →
            </Link>
            <Link
              className="mt-2 ml-4 inline-block underline underline-offset-4"
              href={{
                pathname: "/dsa/visualizations/selection-sort",
                query: { input: values.join(",") },
              }}
            >
              Try the same numbers in Selection sort →
            </Link>
          </div>
        )}
      </div>
      <section
        aria-label="Insertion sort Python code"
        className="min-w-0 overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#111] xl:sticky xl:top-[84px]"
      >
        <div className="flex justify-between border-b border-black/10 px-5 py-4 text-sm dark:border-white/10">
          <h2 className="font-medium">Follow the logic</h2>
          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
            Python · line {step.line}
          </span>
        </div>
        <p className="px-5 pt-3 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
          In Python, <code>key</code> is the number held above the list.{" "}
          <code>j</code> is the position we compare with it. The small labels
          below the boxes are positions, starting at 0.
        </p>
        <pre
          className="overflow-x-auto py-4 text-[13px] leading-7"
          tabIndex={0}
        >
          <code>
            {insertionSortCode.map((line, index) => (
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
      </section>
    </div>
  );
}
