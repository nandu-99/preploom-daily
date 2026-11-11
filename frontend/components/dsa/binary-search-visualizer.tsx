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
  ArrowRight,
  Check,
  Pause,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  binarySearchSteps,
  parseSearchInput,
  type SearchStep,
} from "@/lib/binary-search";

import { narrateInSequence, startLessonPlayback } from "@/lib/lesson-playback";

import { binarySearchNarration } from "@/lib/binary-search-narration";

const subscribeToSpeechSupport = () => () => {};
const speechSupported = () =>
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;
const serverSpeechSupported = () => false;

const initial = [3, 8, 12, 17, 23, 31, 38, 42, 56, 64, 79, 91];
const code = [
  "def binary_search(a, target):",
  "    low, high = 0, len(a) - 1",
  "    while low <= high:",
  "        mid = low + (high - low) // 2",
  "        if a[mid] == target:",
  "            return mid",
  "        if a[mid] < target:",
  "            low = mid + 1",
  "        else:",
  "            high = mid - 1",
  "    return -1",
];
const button =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-black/15 px-3 text-sm font-medium transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/15 dark:hover:bg-white/10";
const input =
  "mt-2 h-11 w-full rounded-lg border border-black/20 bg-white px-3 font-mono text-sm outline-none focus:border-neutral-600 focus:ring-2 focus:ring-neutral-600/20 dark:border-white/20 dark:bg-[#181818]";

export function BinarySearchVisualizer() {
  const [values, setValues] = useState(initial);
  const [target, setTarget] = useState(42);
  const [arrayDraft, setArrayDraft] = useState(initial.join(", "));
  const [targetDraft, setTargetDraft] = useState("42");
  const [error, setError] = useState("");
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [narration, setNarration] = useState(false);
  const [manualNarration, setManualNarration] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [spokenCue, setSpokenCue] = useState<{
    step: SearchStep;
    text: string;
    moved: boolean;
  } | null>(null);
  // Enabling narration is a preference, never authorization to start audio.
  const speechRequested = useRef(false);
  const cancelPlayback = useRef<() => void>(() => {});
  const supportsSpeech = useSyncExternalStore(
    subscribeToSpeechSupport,
    speechSupported,
    serverSpeechSupported,
  );
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const steps = useMemo(
    () => binarySearchSteps(values, target),
    [values, target],
  );
  const step = steps[cursor];
  const finished = cursor === steps.length - 1;
  const running = playing;
  const waitingToMove =
    narration &&
    step.status === "narrow" &&
    (playing || manualNarration || spokenCue?.step === step) &&
    !(spokenCue?.step === step && spokenCue.moved);
  const rangeStep = waitingToMove ? steps[cursor - 1] : step;
  const remaining = Math.max(0, rangeStep.high - rangeStep.low + 1);
  const widestValue = Math.max(...values.map((value) => String(value).length));
  const narrationParts = useMemo(
    () => binarySearchNarration(step, values, target),
    [step, values, target],
  );
  const caption =
    narration && spokenCue?.step === step ? spokenCue.text : step.explanation;

  const probe = step.mid;
  const phaseNames = {
    ready: "Start",
    select: "Choose midpoint",
    compare: "Compare",
    narrow: "Narrow range",
    found: "Return index",
    missing: "Return -1",
  };
  const nextAction = steps[cursor + 1]
    ? phaseNames[steps[cursor + 1].status]
    : "Complete";
  const inspecting =
    step.status === "select" ||
    step.status === "compare" ||
    step.status === "found";
  const travel = {
    duration: reducedMotion ? 0 : 0.6 / speed,
    ease: "easeInOut" as const,
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || probe === null || stage.scrollWidth <= stage.clientWidth)
      return;
    const position = ((probe + 0.5) / values.length) * stage.scrollWidth;
    stage.scrollTo({
      left: position - stage.clientWidth / 2,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }, [probe, reducedMotion, values.length]);

  useEffect(() => {
    if (!playing && !(narration && manualNarration)) return;
    const cancel = startLessonPlayback({
      delay:
        (step.status === "compare" || step.status === "select" ? 3000 : 1800) /
        speed,
      speak:
        narration && supportsSpeech && speechRequested.current
          ? (done, fail) => {
              const synth = window.speechSynthesis;

              const voices = synth.getVoices();
              const isHindi = (voice: SpeechSynthesisVoice) =>
                voice.lang.replaceAll("_", "-").toLowerCase() === "hi-in";
              const voice =
                voices.find(
                  (item) => isHindi(item) && /google/i.test(item.name),
                ) ??
                voices.find(isHindi) ??
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
                  // Keep narration at a steady pace, independent of animation speed.
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
        if (!playing) {
          speechRequested.current = false;
          setManualNarration(false);
          return;
        }
        if (finished) {
          speechRequested.current = false;
          setPlaying(false);
          setManualNarration(false);
        } else setCursor((value) => Math.min(value + 1, steps.length - 1));
      },
      onError: () => {
        speechRequested.current = false;
        setPlaying(false);
        setManualNarration(false);
        setNarration(false);
        setSpeechError(
          "Voice could not play in this browser. Playback is paused. Turn narration on to retry, or press Play to continue silently.",
        );
      },
    });
    cancelPlayback.current = cancel;
    return cancel;
  }, [
    playing,
    narration,
    manualNarration,
    supportsSpeech,
    step,
    speed,
    finished,
    steps.length,
    narrationParts,
  ]);

  function stopAudio() {
    speechRequested.current = false;
    cancelPlayback.current();
    // Also flush browser-queued speech, including audio left by hot reload.
    if (speechSupported()) window.speechSynthesis.cancel();
  }

  function reset() {
    stopAudio();
    setManualNarration(false);
    setPlaying(false);
    setCursor(0);
  }
  function preset(nextTarget: number) {
    setValues(initial);
    setTarget(nextTarget);
    setArrayDraft(initial.join(", "));
    setTargetDraft(String(nextTarget));
    setError("");
    reset();
  }
  function jump(next: number, speak = narration) {
    stopAudio();
    speechRequested.current = speak;
    setManualNarration(speak);
    setSpokenCue(null);
    setPlaying(false);
    setCursor(next);
  }

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.46fr)] xl:items-start">
      <div className="grid min-w-0 gap-5">
        <details className="rounded-xl border border-black/10 bg-white/60 dark:border-white/10 dark:bg-[#111]">
          <summary className="cursor-pointer rounded-xl px-5 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2">
            Customize array &amp; target{" "}
            <span className="ml-2 text-xs font-normal text-neutral-500 dark:text-neutral-400">
              Try your own values or examples
            </span>
          </summary>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              try {
                const result = parseSearchInput(arrayDraft, targetDraft);
                setValues(result.values);
                setTarget(result.target);
                setError("");
                reset();
              } catch (cause) {
                setError(
                  cause instanceof Error ? cause.message : "Check your input.",
                );
              }
            }}
            className="border-t border-black/10 p-4 dark:border-white/10"
          >
            <div className="grid items-end gap-4 sm:grid-cols-[1fr_110px_auto]">
              <label className="text-xs font-medium" htmlFor="search-array">
                Sorted array{" "}
                <span className="font-normal text-neutral-500 dark:text-neutral-400">
                  · up to 20 values
                </span>
                <input
                  id="search-array"
                  className={input}
                  value={arrayDraft}
                  onChange={(event) => setArrayDraft(event.target.value)}
                  aria-describedby={error ? "search-error" : undefined}
                />
              </label>
              <label className="text-xs font-medium" htmlFor="search-target">
                Target
                <input
                  id="search-target"
                  className={input}
                  value={targetDraft}
                  onChange={(event) => setTargetDraft(event.target.value)}
                  inputMode="numeric"
                  aria-describedby={error ? "search-error" : undefined}
                />
              </label>
              <button className={`${button} h-11`} type="submit">
                Apply input <ArrowRight size={15} />
              </button>
            </div>
            {error && (
              <p
                id="search-error"
                role="alert"
                className="mt-3 text-sm text-red-700 dark:text-red-400"
              >
                {error}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <span>Try an example:</span>
              {[
                ["Find 42", 42],
                ["Missing 50", 50],
                ["First value", 3],
              ].map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => preset(Number(value))}
                  className="min-h-8 underline decoration-neutral-400 underline-offset-4 hover:text-neutral-700 dark:hover:text-neutral-400"
                >
                  {label}
                </button>
              ))}
            </div>
          </form>
        </details>
        <section
          aria-label="Binary search animation"
          className="min-w-0 overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#111]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4 dark:border-white/10">
            <h2 className="text-lg font-semibold">
              Find <span className="font-mono text-2xl">{target}</span>
            </h2>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              {remaining} positions left to check · {step.comparisons}{" "}
              comparisons
            </span>
          </div>
          <div className="border-t border-black/10 bg-black/[0.02] px-3 py-3 sm:px-5 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={reset}
                className={button}
                aria-label="Restart search"
              >
                <RotateCcw size={15} /> Restart
              </button>
              <button
                type="button"
                onClick={() => {
                  stopAudio();
                  speechRequested.current = !running && narration;
                  if (finished && !running) setCursor(0);
                  setManualNarration(false);
                  setPlaying(!running);
                }}
                className={button}
              >
                {running ? <Pause size={15} /> : <Play size={15} />}
                {running ? "Pause" : finished ? "Replay" : "Play"}
              </button>
              <button
                type="button"
                aria-pressed={narration}
                disabled={!supportsSpeech}
                onClick={() => {
                  stopAudio();
                  setPlaying(false);
                  setSpeechError("");
                  setNarration(!narration);
                  setManualNarration(false);
                }}
                className={button}
                title={
                  supportsSpeech
                    ? "Enable voice for Play or Next. Turning this on does not start narration."
                    : "Voice narration is unavailable in this browser"
                }
              >
                {narration ? <Volume2 size={15} /> : <VolumeX size={15} />}{" "}
                Narration: {narration ? "on" : "off"}
              </button>
              <label className="ml-auto flex items-center gap-2 text-xs">
                Animation speed
                <select
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  className="min-h-10 rounded-lg border border-black/15 bg-white px-2 dark:border-white/15 dark:bg-[#181818]"
                >
                  <option value={0.5}>0.5×</option>
                  <option value={1}>1×</option>
                  <option value={2}>2×</option>
                  <option value={3}>3×</option>
                </select>
              </label>
            </div>
          </div>
          <div className="px-3 pb-3 pt-3 sm:px-5">
            <div
              className="h-28 overflow-y-auto"
              aria-live={narration ? "off" : "polite"}
              aria-atomic="true"
            >
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {step.iteration ? `Iteration ${step.iteration} · ` : ""}
                {phaseNames[step.status]}
              </p>
              <h3 className="mt-1 flex items-center gap-2 text-base font-semibold sm:text-lg">
                {step.status === "found" && <Check size={18} />}
                {step.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
                {caption}
              </p>
            </div>
            <div className="h-16 overflow-y-auto py-1 text-xs text-neutral-600 dark:text-neutral-400">
              {step.status === "select" ? (
                step.iteration === 1 ? (
                  <>
                    <p className="font-mono">
                      mid = low + (high − low) // 2 = {step.low} + ({step.high}{" "}
                      − {step.low}) // 2 = {step.mid}
                    </p>
                    <p className="mt-1">
                      {"//"} means divide and round down. This gives a position,
                      not the value inside the box.
                    </p>
                  </>
                ) : (
                  <details>
                    <summary className="cursor-pointer">
                      Midpoint calculation
                    </summary>
                    <p className="font-mono">{step.explanation}</p>
                  </details>
                )
              ) : (
                <p>
                  Sorted: smallest → largest. The outlined range contains the
                  positions still possible.
                </p>
              )}
            </div>
            <div
              ref={stageRef}
              className="relative mt-3 min-w-0 overflow-x-auto rounded-xl bg-neutral-50 dark:bg-neutral-950"
              aria-label="Animated array and search pointers; scroll for more values on small screens"
            >
              <div
                className="relative h-[280px] w-full"
                style={{
                  minWidth: values.length > 15 ? values.length * 30 : undefined,
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-[144px] border-t border-dashed border-neutral-300 dark:border-neutral-800"
                />
                <motion.div
                  aria-hidden="true"
                  initial={false}
                  animate={{
                    left: `${(rangeStep.low / values.length) * 100}%`,
                    width: `${(remaining / values.length) * 100}%`,
                    opacity: remaining ? 1 : 0,
                  }}
                  transition={travel}
                  className="absolute top-[71px] h-[116px] rounded-xl border border-neutral-400/60 bg-neutral-200/50 dark:border-neutral-600 dark:bg-neutral-800/50"
                />
                <div
                  className="absolute inset-x-0 top-[96px] grid"
                  style={{
                    gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
                  }}
                >
                  {values.map((value, index) => {
                    const active =
                      index >= rangeStep.low && index <= rangeStep.high;
                    const middle = inspecting && index === step.mid;
                    const rejecting =
                      step.status === "compare" &&
                      step.mid !== null &&
                      values[step.mid] !== target &&
                      active &&
                      (values[step.mid] < target
                        ? index <= step.mid
                        : index >= step.mid);
                    return (
                      <div key={index} className="relative text-center">
                        <motion.div
                          initial={false}
                          animate={{
                            opacity: active ? 1 : 0.22,
                            y: !active ? 32 : middle ? -10 : 0,
                            scale: middle ? 1.08 : active ? 1 : 0.88,
                          }}
                          transition={travel}
                          className={`relative mx-auto flex h-14 w-[calc(100%-4px)] max-w-[52px] items-center justify-center rounded-lg border font-mono font-medium shadow-sm ${rejecting ? "outline-2 outline-dashed outline-offset-2 outline-neutral-400 " : ""}${middle ? "border-neutral-900 bg-neutral-900 text-white shadow-lg dark:border-neutral-100 dark:bg-neutral-100 dark:text-black" : "border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900"}`}
                          style={{
                            fontSize:
                              widestValue > 2
                                ? "clamp(9px, 1vw, 13px)"
                                : values.length > 15
                                  ? 11
                                  : values.length > 12
                                    ? 13
                                    : 16,
                          }}
                          aria-label={`Index ${index}, value ${value}${middle ? ", middle" : ""}${!active ? ", discarded" : ""}`}
                        >
                          {value}
                          {step.status === "found" && middle && (
                            <motion.span
                              initial={{
                                scale: reducedMotion ? 1 : 0.8,
                                opacity: 0,
                              }}
                              animate={{ scale: 1.18, opacity: 1 }}
                              transition={travel}
                              className="absolute inset-0 rounded-xl border-2 border-neutral-500 dark:border-neutral-300"
                            />
                          )}
                        </motion.div>
                        <motion.span
                          initial={false}
                          animate={{
                            y: !active ? 32 : 0,
                            opacity: active ? 1 : 0.35,
                          }}
                          transition={travel}
                          className="absolute inset-x-0 top-[66px] font-mono text-[10px] text-neutral-500 dark:text-neutral-400 sm:text-xs"
                        >
                          {index}
                          {!active && (
                            <span className="block text-[10px]">Skipped</span>
                          )}
                        </motion.span>
                      </div>
                    );
                  })}
                </div>
                <motion.div
                  aria-hidden="true"
                  initial={false}
                  animate={{
                    left: `${(((probe ?? 0) + 0.5) / values.length) * 100}%`,
                    opacity:
                      probe === null || remaining === 0
                        ? 0
                        : step.status === "narrow"
                          ? 0.45
                          : 1,
                  }}
                  transition={travel}
                  className="absolute top-5 flex -translate-x-1/2 flex-col items-center"
                >
                  <span
                    style={{
                      transform:
                        probe === 0 && values.length > 1
                          ? "translateX(35%)"
                          : probe === values.length - 1 && values.length > 1
                            ? "translateX(-35%)"
                            : undefined,
                    }}
                    className="whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-2 font-mono text-xs text-white dark:bg-neutral-100 dark:text-black"
                  >
                    {step.status === "found"
                      ? "FOUND AT INDEX"
                      : step.status === "narrow"
                        ? "CHECKED INDEX"
                        : "MID INDEX"}{" "}
                    · {probe ?? ""}
                  </span>
                  <span className="h-6 w-px bg-neutral-900 dark:bg-neutral-100" />
                  <span className="text-xs leading-none">▼</span>
                </motion.div>
                {step.status === "compare" && step.mid !== null && (
                  <div className="absolute inset-x-2 bottom-0 text-center text-xs font-medium">
                    {values[step.mid]}{" "}
                    {values[step.mid] === target
                      ? "="
                      : values[step.mid] < target
                        ? "<"
                        : ">"}{" "}
                    {target} →{" "}
                    {values[step.mid] === target
                      ? "match, return this position"
                      : values[step.mid] < target
                        ? `${values[step.mid]} and everything left are too small → look right`
                        : `${values[step.mid]} and everything right are too big → look left`}
                  </div>
                )}
                {(["low", "high"] as const).map((name) => (
                  <motion.div
                    key={name}
                    aria-hidden="true"
                    initial={false}
                    animate={{
                      left: `${Math.max(0, Math.min(100, ((rangeStep[name] + 0.5) / values.length) * 100))}%`,
                      opacity: 1,
                    }}
                    transition={travel}
                    className={`absolute flex -translate-x-1/2 flex-col items-center ${name === "low" ? "top-[191px]" : "top-[231px]"}`}
                  >
                    <span className="text-[10px] leading-none">▲</span>
                    <span
                      style={{
                        transform:
                          rangeStep[name] <= 0
                            ? "translateX(40%)"
                            : rangeStep[name] >= values.length - 1
                              ? "translateX(-40%)"
                              : undefined,
                      }}
                      className="whitespace-nowrap rounded-md border border-neutral-300 bg-white px-2 py-1 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-900"
                    >
                      {name} {rangeStep[name]}
                      {rangeStep[name] < 0 || rangeStep[name] >= values.length
                        ? " (out)"
                        : ""}
                    </span>
                  </motion.div>
                ))}
                {remaining === 0 && (
                  <div
                    className="absolute inset-x-4 top-5 text-center"
                    role="status"
                  >
                    <p className="font-mono text-lg font-semibold">
                      low ({step.low}) &gt; high ({step.high})
                    </p>
                    <p className="mt-1 text-sm">
                      No possible indices remain
                      {step.status === "missing" ? " · return -1" : ""}
                    </p>
                  </div>
                )}
                {step.status === "ready" && (
                  <span className="absolute inset-x-0 top-10 text-center text-xs text-neutral-500 dark:text-neutral-400">
                    Use Next to choose the middle · positions start at 0
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-black/10 px-3 py-4 dark:border-white/10 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="search-timeline"
                className="text-xs text-neutral-600 dark:text-neutral-400"
              >
                Step {cursor + 1} of {steps.length} · {phaseNames[step.status]}
              </label>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Drag to preview silently
              </span>
            </div>
            <input
              id="search-timeline"
              type="range"
              min={0}
              max={steps.length - 1}
              value={cursor}
              onChange={(event) => jump(Number(event.target.value), false)}
              className="my-3 block h-4 w-full accent-neutral-700"
              aria-valuetext={`Step ${cursor + 1}: ${step.title}`}
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
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-neutral-800 px-4 text-sm font-medium text-white hover:bg-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 disabled:cursor-not-allowed disabled:opacity-35 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-300"
                aria-label={`Next: ${nextAction}`}
              >
                Next: {nextAction} <ChevronRight size={15} />
              </button>
            </div>
          </div>
          {finished && (
            <div className="border-t border-black/10 px-5 py-3 text-sm dark:border-white/10">
              <p>
                {step.status === "found"
                  ? "Next, try a missing target to see why the loop stops."
                  : "Now try a target that exists and follow the same decisions."}
              </p>
              <button
                type="button"
                className={`${button} mt-2`}
                onClick={() => preset(step.status === "found" ? 50 : 42)}
              >
                {step.status === "found" ? "Try missing target 50" : "Find 42"}
              </button>
            </div>
          )}
          {speechError && (
            <p
              role="alert"
              className="px-5 pb-3 text-xs leading-5 text-neutral-600 dark:text-neutral-400"
            >
              {speechError}
            </p>
          )}
          {!supportsSpeech && (
            <p className="px-5 pb-3 text-xs text-neutral-500 dark:text-neutral-400">
              Voice narration is unavailable in this browser. You can still
              follow the on-screen explanations.
            </p>
          )}
        </section>
      </div>

      <section
        aria-label="Synchronized Python code"
        className="min-w-0 rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#111] xl:sticky xl:top-[84px]"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
          <h2 className="text-sm font-medium">Follow the logic</h2>
          <span className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
            Python · line {step.line}
          </span>
        </div>
        <div
          className="overflow-x-auto py-5"
          tabIndex={0}
          aria-label="Binary search source code"
        >
          <pre className="min-w-max text-[11px] leading-8">
            <code>
              {code.map((line, index) => (
                <span
                  key={line}
                  aria-current={step.line === index + 1 ? "step" : undefined}
                  className={`block border-l-[3px] pr-5 transition-colors duration-200 ${step.line === index + 1 ? "border-neutral-950 bg-neutral-200 font-semibold text-neutral-950 dark:border-white dark:bg-neutral-800 dark:text-white" : "border-transparent text-neutral-700 dark:text-neutral-300"}`}
                >
                  <span
                    aria-hidden="true"
                    className="inline-block w-10 select-none pr-3 text-right text-neutral-500 dark:text-neutral-400"
                  >
                    {step.line === index + 1 ? "▶" : index + 1}
                  </span>
                  {line}
                </span>
              ))}
            </code>
          </pre>
        </div>
        <div className="mx-5 border-t border-black/10 py-5 dark:border-white/10">
          <h3 className="text-xs font-semibold">Keep this invariant in mind</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            If the target exists, it is always between{" "}
            <code className="text-neutral-800 dark:text-neutral-400">low</code>{" "}
            and{" "}
            <code className="text-neutral-800 dark:text-neutral-400">high</code>
            , inclusive.
          </p>
          <p className="mt-4 text-xs leading-6 text-neutral-600 dark:text-neutral-400">
            Use Next step to go at your own pace. Try a missing target to see
            why the loop stops.
          </p>
        </div>
      </section>
    </div>
  );
}
