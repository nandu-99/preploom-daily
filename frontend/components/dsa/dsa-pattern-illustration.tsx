"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const states = [
  { values: [42, 18, 64, 30, 54, 24, 72], label: "Compare" },
  { values: [18, 42, 30, 64, 24, 54, 72], label: "Swap" },
  { values: [18, 30, 42, 24, 54, 64, 72], label: "Repeat" },
  { values: [18, 24, 30, 42, 54, 64, 72], label: "Sorted" },
];

export function DsaPatternIllustration() {
  const [step, setStep] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setStep((current) => (current + 1) % states.length);
    }, 1500);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const visible = reduceMotion ? states[states.length - 1] : states[step];

  return (
    <div
      className="flex min-h-[220px] flex-col justify-end"
      role="img"
      aria-label="An array being sorted by comparing and swapping values"
    >
      <div className="flex h-[150px] items-end justify-center gap-2.5 sm:gap-3">
        {visible.values.map((value) => (
          <motion.div
            layout
            key={value}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 190, damping: 24 }
            }
            className="flex w-8 flex-col items-center justify-end sm:w-10"
          >
            <span className="mb-2 font-mono text-[9px] text-[#777] dark:text-[#858585]">
              {value}
            </span>
            <span
              className="w-full rounded-t-[7px] bg-black/[0.09] dark:bg-white/[0.12]"
              style={{ height: `${value * 1.45}px` }}
            />
          </motion.div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-black/[0.1] pt-4 text-[10px] text-[#777] dark:border-white/[0.11] dark:text-[#858585]">
        <span>Sorting a small array</span>
        <motion.span
          key={visible.label}
          initial={reduceMotion ? false : { opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {visible.label}
        </motion.span>
      </div>
    </div>
  );
}
