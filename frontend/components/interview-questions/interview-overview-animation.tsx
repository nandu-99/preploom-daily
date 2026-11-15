"use client";

import { CheckCircle2, FileText, Mic2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const stages = [
  { label: "Prepare", icon: FileText },
  { label: "Speak", icon: Mic2 },
  { label: "Review", icon: CheckCircle2 },
];

export function InterviewOverviewAnimation() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="mx-auto w-full max-w-[390px] py-8 lg:mr-0"
      role="img"
      aria-label="Interview preparation moving from preparation to speaking and review"
    >
      <div className="relative grid grid-cols-3 items-start gap-3 pt-8">
        <div
          className="absolute left-[16.66%] right-[16.66%] top-[61px] h-px bg-black/[0.12] dark:bg-white/[0.14]"
          aria-hidden="true"
        />

        {!reduceMotion && (
          <motion.span
            className="absolute left-[16.66%] right-[16.66%] top-[60px] h-[3px] origin-left rounded-full bg-[#6c6c6c] dark:bg-[#a8a8a8]"
            animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 5.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          />
        )}

        {stages.map((stage, index) => {
          const Icon = stage.icon;

          return (
            <div key={stage.label} className="relative z-10 text-center">
              <motion.div
                className="mx-auto grid size-16 place-items-center rounded-[16px] border border-black/[0.13] bg-[#f7f7f5] text-[#555] dark:border-white/[0.15] dark:bg-[#0a0a0a] dark:text-[#b8b8b8]"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        y: [0, -5, 0],
                        scale: [1, 1.06, 1],
                        opacity: [0.68, 1, 0.68],
                      }
                }
                transition={{
                  duration: 3.2,
                  delay: index * 0.7,
                  repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
              </motion.div>
              <p className="mt-4 text-[12px] font-medium text-[#555] dark:text-[#b3b3b3]">
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
