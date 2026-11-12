"use client";

import { narrationNumbers } from "@/lib/narration-numbers";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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
  bubbleSortCode,
  bubbleSortSteps,
  parseBubbleInput,
} from "@/lib/bubble-sort";
import { narrateInSequence, startLessonPlayback } from "@/lib/lesson-playback";

import { bubbleSortNarration } from "@/lib/bubble-sort-narration";
import type { BubbleStep } from "@/lib/bubble-sort";

const initial = [6, 3, 8, 2, 5];
const subscribe = () => () => {};
const supported = () =>
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;
const serverSupported = () => false;
const button =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-black/15 px-3 text-sm font-medium hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/15 dark:hover:bg-white/10";
const primary = `${button.replace("hover:bg-black/5", "").replace("dark:hover:bg-white/10", "")} bg-neutral-900 text-white enabled:hover:bg-neutral-700 dark:bg-neutral-100 dark:text-black dark:enabled:hover:bg-neutral-300 transition-colors`;
const phases = {
  ready: "Start",
  pass: "Start pass",
  compare: "Compare neighbors",
  swap: "Swap",
  keep: "Keep order",
  settled: "Finish pass",
  done: "Complete",
};

export function BubbleSortVisualizer({
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
    step: BubbleStep;
    text: string;
    moved: boolean;
  } | null>(null);
  const speechRequested = useRef(false);
  const cancelPlayback = useRef<() => void>(() => {});
  const canSpeak = useSyncExternalStore(subscribe, supported, serverSupported);
  const reducedMotion = useReducedMotion();
  const steps = useMemo(() => bubbleSortSteps(values), [values]);
  const step = steps[cursor];
  const finished = cursor === steps.length - 1;
  const narrationParts = useMemo(() => bubbleSortNarration(step), [step]);
  const waitingForSwap =
    narration &&
    step.status === "swap" &&
    (playing || manualSpeech || spokenCue?.step === step) &&
    !(spokenCue?.step === step && spokenCue.moved);
  const visibleItems = waitingForSwap ? steps[cursor - 1].items : step.items;
  const caption =
    narration && spokenCue?.step === step ? spokenCue.text : step.explanation;
  const minimum = Math.min(...values),
    maximum = Math.max(...values);
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
                load(parseBubbleInput(draft));
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
                htmlFor="bubble-input"
                className="min-w-0 flex-1 text-xs font-medium"
              >
                Numbers to sort · up to 12
                <input
                  id="bubble-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  aria-describedby={error ? "bubble-input-error" : undefined}
                  className="mt-2 h-11 w-full min-w-52 rounded-lg border border-black/20 bg-white px-3 font-mono text-sm focus:outline-2 dark:border-white/20 dark:bg-neutral-900"
                />
              </label>
              <button type="submit" className={button}>
                Apply input
              </button>
            </div>
            {error && (
              <p
                id="bubble-input-error"
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
          aria-label="Bubble sort animation"
          className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#111]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 px-5 py-3 dark:border-white/10">
            <h2 className="text-sm font-semibold">Smallest → biggest</h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {step.comparisons} comparisons · {step.swaps} swaps · This pass:{" "}
              {step.passSwaps} swaps
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
                {step.pass ? `Pass ${step.pass} · ` : ""}
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
              aria-label="Sorting array; numbers move horizontally when swapped"
            >
              <div
                className="relative h-[255px]"
                style={{ minWidth: values.length * 50 }}
              >
                <div className="absolute inset-x-2 top-3 text-center text-xs font-medium">
                  {step.pair !== null
                    ? (() => {
                        const pair =
                          step.status === "swap" ? steps[cursor - 1] : step;
                        const left = pair.items[step.pair].value,
                          right = pair.items[step.pair + 1].value;
                        return `${left} ${left > right ? ">" : "≤"} ${right} → ${left > right ? "swap" : "keep this pair"}`;
                      })()
                    : step.status === "settled" && step.passSwaps === 0
                      ? "No swaps in the whole pass → finished"
                      : "Check two neighbors, then move one position right"}
                </div>
                {step.pair !== null && (
                  <div
                    aria-hidden="true"
                    className="absolute top-10 h-4 rounded-t border-x border-t border-neutral-500"
                    style={{
                      left: `${(step.pair / values.length) * 100}%`,
                      width: `${(2 / values.length) * 100}%`,
                    }}
                  />
                )}
                {step.sortedFrom < values.length && (
                  <div
                    className="absolute bottom-0 h-5 border-t-2 border-neutral-500 text-center text-[10px]"
                    style={{
                      left: `${(step.sortedFrom / values.length) * 100}%`,
                      right: 0,
                    }}
                  >
                    Finished ✓
                  </div>
                )}
                {visibleItems.map((item, index) => {
                  const active =
                    step.pair !== null &&
                    (index === step.pair || index === step.pair + 1);
                  const sorted = index >= step.sortedFrom;
                  const height =
                    55 +
                    (maximum === minimum
                      ? 0.5
                      : (item.value - minimum) / (maximum - minimum)) *
                      65;
                  return (
                    <motion.div
                      key={item.id}
                      initial={false}
                      animate={{
                        left: `${((index + 0.5) / values.length) * 100}%`,
                        y:
                          step.status === "swap" &&
                          !waitingForSwap &&
                          active &&
                          !reducedMotion
                            ? [0, index === step.pair ? -15 : 15, 0]
                            : 0,
                      }}
                      transition={{ duration, ease: "easeInOut" }}
                      className="absolute bottom-14 flex -translate-x-1/2 flex-col items-center"
                      style={{
                        width: `min(56px, calc(100% / ${values.length} - 4px))`,
                      }}
                      aria-label={`Index ${index}, value ${item.value}${active ? ", current pair" : ""}${sorted ? ", final position" : ""}`}
                    >
                      <div className="mb-2 h-5 text-xs">
                        {sorted ? (
                          <Check size={15} aria-label="Final position" />
                        ) : active ? (
                          index === step.pair ? (
                            "left"
                          ) : (
                            "right"
                          )
                        ) : (
                          ""
                        )}
                      </div>
                      <motion.div
                        initial={false}
                        animate={{ height }}
                        transition={{ duration }}
                        className={`flex w-full flex-col items-center justify-end rounded-lg border pb-2 font-mono font-semibold ${values.length > 9 ? "text-sm" : "text-lg"} ${active ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-black" : sorted ? "border-neutral-500 bg-neutral-200 dark:bg-neutral-800" : "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900"}`}
                      >
                        {item.value}
                        {showIdentity && (
                          <span className="text-[10px] leading-none">
                            #{item.id}
                          </span>
                        )}
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
                      className="text-center font-mono text-xs text-neutral-500 dark:text-neutral-400"
                    >
                      i: {index}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 border-t border-black/10 px-4 py-4 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="bubble-timeline"
                className="text-xs text-neutral-600 dark:text-neutral-400"
              >
                Step {cursor + 1} of {steps.length} · {phases[step.status]}
              </label>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Drag to preview silently
              </span>
            </div>
            <input
              id="bubble-timeline"
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
              {step.swaps} swaps.{" "}
              {"Bubble sort checks neighbors and swaps as it goes."}
            </p>
          </div>
        )}
      </div>
      <section
        aria-label="Bubble sort Python code"
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
            {bubbleSortCode.map((line, index) => (
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
