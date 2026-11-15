"use client";

import { motion, useReducedMotion } from "motion/react";

const sourcePaths = [
  "M42 52 C112 52 132 170 220 170",
  "M42 112 C126 112 148 170 220 170",
  "M42 228 C126 228 148 170 220 170",
  "M42 288 C112 288 132 170 220 170",
];

const sourcePoints = [
  [42, 52],
  [42, 112],
  [42, 228],
  [42, 288],
];

const focusPath =
  "M260 170 C310 170 302 88 354 88 C408 88 392 252 446 252 C492 252 486 170 526 170";

const checkpoints = [
  [354, 88],
  [446, 252],
  [526, 170],
];

export function TopicFocusIllustration() {
  const reduceMotion = useReducedMotion();
  const finalPath = reduceMotion ? 1 : 0;

  return (
    <figure className="relative mx-auto w-full max-w-[560px]">
      <svg
        viewBox="0 0 560 340"
        role="img"
        aria-labelledby="topic-focus-title topic-focus-description"
        className="h-auto w-full overflow-visible text-[#151515] dark:text-[#d8d8d6]"
      >
        <title id="topic-focus-title">One focused study path</title>
        <desc id="topic-focus-description">
          Several paths come together into one choice, followed by a single path
          through three study checkpoints.
        </desc>

        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.25"
          className="opacity-[0.14] dark:opacity-[0.2]"
        >
          {sourcePaths.map((path) => (
            <path key={path} d={path} vectorEffect="non-scaling-stroke" />
          ))}
          <path d={focusPath} vectorEffect="non-scaling-stroke" />
        </g>

        {sourcePaths.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: finalPath, opacity: finalPath }}
            whileInView={{ pathLength: 1, opacity: 0.56 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              pathLength: {
                duration: reduceMotion ? 0 : 0.8,
                delay: reduceMotion ? 0 : index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              },
              opacity: {
                duration: reduceMotion ? 0 : 0.25,
                delay: reduceMotion ? 0 : index * 0.1,
              },
            }}
          />
        ))}

        {sourcePoints.map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="5"
            fill="currentColor"
            initial={
              reduceMotion ? { opacity: 0.5 } : { opacity: 0, scale: 0.5 }
            }
            whileInView={{ opacity: 0.5, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: reduceMotion ? 0 : 0.35,
              delay: reduceMotion ? 0 : index * 0.1,
            }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}

        <motion.circle
          cx="240"
          cy="170"
          r="21"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.65 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
            delay: reduceMotion ? 0 : 0.72,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        <motion.circle
          cx="240"
          cy="170"
          r="7"
          fill="currentColor"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: reduceMotion ? 0 : 0.35,
            delay: reduceMotion ? 0 : 0.95,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />

        <motion.path
          d={focusPath}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.25"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: finalPath, opacity: finalPath }}
          whileInView={{ pathLength: 1, opacity: 0.9 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            pathLength: {
              duration: reduceMotion ? 0 : 1.4,
              delay: reduceMotion ? 0 : 1.08,
              ease: [0.65, 0, 0.35, 1],
            },
            opacity: {
              duration: reduceMotion ? 0 : 0.25,
              delay: reduceMotion ? 0 : 1.08,
            },
          }}
        />

        {checkpoints.map(([cx, cy], index) => {
          const last = index === checkpoints.length - 1;
          return (
            <motion.g
              key={`${cx}-${cy}`}
              initial={
                reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.55 }
              }
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: reduceMotion ? 0 : 0.35,
                delay: reduceMotion ? 0 : 1.55 + index * 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <circle
                cx={cx}
                cy={cy}
                r={last ? 16 : 11}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={cx} cy={cy} r={last ? 5 : 3.5} fill="currentColor" />
            </motion.g>
          );
        })}

        <motion.circle
          cx="526"
          cy="170"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          initial={
            reduceMotion ? { opacity: 0.18 } : { opacity: 0, scale: 0.65 }
          }
          whileInView={{ opacity: 0.18, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            delay: reduceMotion ? 0 : 2.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      </svg>
    </figure>
  );
}
