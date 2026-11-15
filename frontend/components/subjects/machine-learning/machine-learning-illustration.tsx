"use client";

import { motion, useReducedMotion } from "motion/react";

const points = [
  { x: 108, y: 330 },
  { x: 154, y: 306 },
  { x: 198, y: 288 },
  { x: 244, y: 254 },
  { x: 286, y: 248 },
  { x: 330, y: 210 },
  { x: 374, y: 202 },
  { x: 420, y: 165 },
  { x: 464, y: 151 },
  { x: 510, y: 124 },
  { x: 554, y: 108 },
  { x: 600, y: 76 },
];

export function MachineLearningIllustration() {
  const reduceMotion = useReducedMotion();

  return (
    <figure className="flex w-full items-center justify-center py-1 sm:py-2">
      <svg
        viewBox="0 0 720 430"
        role="img"
        aria-labelledby="ml-illustration-title ml-illustration-description"
        className="h-auto w-full text-[#151515] dark:text-[#d8d8d6]"
      >
        <title id="ml-illustration-title">
          Data points becoming a learned model
        </title>
        <desc id="ml-illustration-description">
          Training examples appear on a coordinate plane, followed by a line
          representing the stable pattern learned by a model.
        </desc>

        <motion.g
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
        >
          <path
            d="M74 42V366H650"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.5"
          />
          {[122, 202, 282].map((y) => (
            <path
              key={y}
              d={`M74 ${y}H650`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 10"
              vectorEffect="non-scaling-stroke"
              opacity="0.12"
            />
          ))}
          {[190, 306, 422, 538].map((x) => (
            <path
              key={x}
              d={`M${x} 42V366`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 10"
              vectorEffect="non-scaling-stroke"
              opacity="0.12"
            />
          ))}
        </motion.g>

        {points.map((point, index) => (
          <motion.circle
            key={`${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            r="7"
            className="fill-[#ededeb] dark:fill-[#141414]"
            stroke="currentColor"
            strokeWidth="1.7"
            vectorEffect="non-scaling-stroke"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 0.72, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: reduceMotion ? 0 : 0.34,
              delay: reduceMotion ? 0 : 0.08 + index * 0.045,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}

        <path
          d="M98 338C214 286 316 235 416 174C498 125 566 92 626 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.95"
        />

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: reduceMotion ? 0 : 0.45,
            delay: reduceMotion ? 0 : 1.55,
          }}
        >
          <rect
            x="426"
            y="280"
            width="212"
            height="68"
            rx="13"
            className="fill-[#ededeb] dark:fill-[#141414]"
            stroke="currentColor"
            strokeWidth="1.3"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x="532"
            y="309"
            textAnchor="middle"
            fill="currentColor"
            fontSize="13"
            fontWeight="600"
          >
            EXAMPLES → PATTERN
          </text>
          <text
            x="532"
            y="331"
            textAnchor="middle"
            fill="currentColor"
            fontSize="11"
            opacity="0.58"
          >
            training produces a model
          </text>
        </motion.g>
      </svg>
    </figure>
  );
}
