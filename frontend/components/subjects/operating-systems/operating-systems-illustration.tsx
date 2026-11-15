"use client";

import { motion, useReducedMotion } from "motion/react";

const taskBlocks = [116, 258, 400, 542];
const resourceBlocks = [190, 360, 530];

const taskPaths = [
  "M116 118 C116 178 276 164 336 220",
  "M258 118 C258 170 310 174 344 216",
  "M400 118 C400 170 382 184 376 216",
  "M542 118 C542 178 432 166 384 220",
];

const resourcePaths = [
  "M344 270 C322 308 236 304 190 356",
  "M360 274 L360 356",
  "M376 270 C398 308 484 304 530 356",
];

export function OperatingSystemsIllustration() {
  const reduceMotion = useReducedMotion();
  const finished = reduceMotion ? 1 : 0;

  return (
    <figure className="flex w-full items-center justify-center py-1 sm:py-2">
      <svg
        viewBox="0 40 720 400"
        role="img"
        aria-labelledby="os-illustration-title os-illustration-description"
        className="h-auto w-full text-[#151515] dark:text-[#d8d8d6]"
      >
        <title id="os-illustration-title">
          Operating system task and resource flow
        </title>
        <desc id="os-illustration-description">
          Four tasks enter a central scheduling core, which distributes work
          across three shared hardware resources.
        </desc>

        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.2"
          className="opacity-[0.13] dark:opacity-[0.2]"
        >
          {taskPaths.map((path) => (
            <path key={path} d={path} vectorEffect="non-scaling-stroke" />
          ))}
          {resourcePaths.map((path) => (
            <path key={path} d={path} vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        {taskBlocks.map((cx, index) => (
          <motion.g
            key={cx}
            initial={
              reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.94 }
            }
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{
              duration: reduceMotion ? 0 : 0.42,
              delay: reduceMotion ? 0 : index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <rect
              x={cx - 47}
              y="64"
              width="94"
              height="54"
              rx="12"
              stroke="currentColor"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
              className="fill-[#ededeb] dark:fill-[#141414]"
            />
            <circle
              cx={cx - 22}
              cy="91"
              r="5"
              fill="currentColor"
              opacity="0.35"
            />
            <path
              d={`M${cx - 8} 86 H${cx + 26} M${cx - 8} 96 H${cx + 14}`}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.3"
              vectorEffect="non-scaling-stroke"
              opacity="0.45"
            />
          </motion.g>
        ))}

        {taskPaths.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: finished, opacity: finished }}
            whileInView={{ pathLength: 1, opacity: 0.58 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{
              pathLength: {
                duration: reduceMotion ? 0 : 0.75,
                delay: reduceMotion ? 0 : 0.45 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              },
              opacity: {
                duration: reduceMotion ? 0 : 0.2,
                delay: reduceMotion ? 0 : 0.45 + index * 0.1,
              },
            }}
          />
        ))}

        <motion.g
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.72 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{
            duration: reduceMotion ? 0 : 0.55,
            delay: reduceMotion ? 0 : 1.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle
            cx="360"
            cy="242"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="360"
            cy="242"
            r="31"
            fill="none"
            stroke="currentColor"
            strokeDasharray="3 7"
            strokeLinecap="round"
            strokeWidth="1.3"
            vectorEffect="non-scaling-stroke"
            opacity="0.55"
          />
          <circle cx="360" cy="242" r="9" fill="currentColor" />
          {[
            [360, 211],
            [391, 242],
            [360, 273],
            [329, 242],
          ].map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="3.5"
              fill="currentColor"
            />
          ))}
        </motion.g>

        {resourcePaths.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: finished, opacity: finished }}
            whileInView={{ pathLength: 1, opacity: 0.82 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{
              pathLength: {
                duration: reduceMotion ? 0 : 0.72,
                delay: reduceMotion ? 0 : 1.42 + index * 0.18,
                ease: [0.65, 0, 0.35, 1],
              },
              opacity: {
                duration: reduceMotion ? 0 : 0.2,
                delay: reduceMotion ? 0 : 1.42 + index * 0.18,
              },
            }}
          />
        ))}

        {resourceBlocks.map((cx, index) => (
          <motion.g
            key={cx}
            initial={
              reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.94 }
            }
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{
              duration: reduceMotion ? 0 : 0.42,
              delay: reduceMotion ? 0 : 1.86 + index * 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <rect
              x={cx - 56}
              y="356"
              width="112"
              height="62"
              rx="14"
              stroke="currentColor"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
              className="fill-[#ededeb] dark:fill-[#141414]"
            />
            <rect
              x={cx - 27}
              y="375"
              width="54"
              height="24"
              rx="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
              opacity="0.5"
            />
            <path
              d={`M${cx - 16} 387 H${cx + 16}`}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
              opacity="0.5"
            />
          </motion.g>
        ))}
      </svg>
    </figure>
  );
}
