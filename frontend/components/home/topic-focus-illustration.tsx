"use client";

import { motion, useReducedMotion } from "motion/react";

const paths = [
  "M42 52 C112 52 132 170 220 170",
  "M42 112 C126 112 148 170 220 170",
  "M42 228 C126 228 148 170 220 170",
  "M42 288 C112 288 132 170 220 170",
];
const focus =
  "M260 170 C310 170 302 88 354 88 C408 88 392 252 446 252 C492 252 486 170 526 170";

export function TopicFocusIllustration() {
  const reduced = useReducedMotion();
  return (
    <figure className="relative mx-auto w-full max-w-[560px]">
      <svg
        viewBox="0 0 560 340"
        role="img"
        aria-label="Several study paths converge into one focused path"
        className="h-auto w-full overflow-visible text-[#151515] dark:text-[#d8d8d6]"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.25"
          className="opacity-[0.14] dark:opacity-[0.2]"
        >
          {paths.map((path) => (
            <path key={path} d={path} />
          ))}
          <path d={focus} />
        </g>
        {paths.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
            initial={{
              pathLength: reduced ? 1 : 0,
              opacity: reduced ? 0.56 : 0,
            }}
            whileInView={{ pathLength: 1, opacity: 0.56 }}
            viewport={{ once: true }}
            transition={{
              duration: reduced ? 0 : 0.8,
              delay: reduced ? 0 : index * 0.1,
            }}
          />
        ))}
        <motion.circle
          cx="240"
          cy="170"
          r="21"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.65 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        />
        <circle cx="240" cy="170" r="7" fill="currentColor" />
        <motion.path
          d={focus}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.25"
          initial={{ pathLength: reduced ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0 : 1.4, delay: reduced ? 0 : 0.8 }}
        />
        {[
          [354, 88],
          [446, 252],
          [526, 170],
        ].map(([cx, cy], index) => (
          <g key={`${cx}-${cy}`}>
            <circle
              cx={cx}
              cy={cy}
              r={index === 2 ? 16 : 11}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <circle
              cx={cx}
              cy={cy}
              r={index === 2 ? 5 : 3.5}
              fill="currentColor"
            />
          </g>
        ))}
      </svg>
    </figure>
  );
}
