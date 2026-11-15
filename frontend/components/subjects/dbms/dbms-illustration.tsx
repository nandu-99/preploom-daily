"use client";

import { motion, useReducedMotion } from "motion/react";

const tables = [
  { x: 84, y: 86, label: "STUDENT" },
  { x: 454, y: 86, label: "COURSE" },
  { x: 269, y: 286, label: "ENROLMENT" },
];

export function DbmsIllustration() {
  const reduceMotion = useReducedMotion();

  return (
    <figure className="flex w-full items-center justify-center py-1 sm:py-2">
      <svg
        viewBox="0 0 720 430"
        role="img"
        aria-labelledby="dbms-illustration-title dbms-illustration-description"
        className="h-auto w-full text-[#151515] dark:text-[#d8d8d6]"
      >
        <title id="dbms-illustration-title">Related database tables</title>
        <desc id="dbms-illustration-description">
          Student and Course tables connect through an Enrolment table, showing
          how a database keeps related data in an organized structure.
        </desc>

        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <motion.path
            d="M264 179 C304 224 327 241 358 286"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.42 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.25 }}
          />
          <motion.path
            d="M454 179 C414 224 391 241 361 286"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.42 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.38 }}
          />
        </g>

        {tables.map((table, index) => (
          <motion.g
            key={table.label}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              delay: reduceMotion ? 0 : 0.08 + index * 0.13,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <rect
              x={table.x}
              y={table.y}
              width="182"
              height="94"
              rx="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={table.x}
              y1={table.y + 34}
              x2={table.x + 182}
              y2={table.y + 34}
              stroke="currentColor"
              strokeWidth="1.2"
              opacity="0.35"
            />
            <text
              x={table.x + 18}
              y={table.y + 23}
              fill="currentColor"
              fontSize="12"
              fontWeight="600"
              letterSpacing="1.2"
            >
              {table.label}
            </text>
            {[0, 1, 2].map((row) => (
              <g key={row} opacity={row === 0 ? 0.72 : 0.34}>
                <circle
                  cx={table.x + 21}
                  cy={table.y + 49 + row * 14}
                  r="2.3"
                  fill="currentColor"
                />
                <line
                  x1={table.x + 34}
                  y1={table.y + 49 + row * 14}
                  x2={table.x + 91 + row * 14}
                  y2={table.y + 49 + row * 14}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.4"
                />
              </g>
            ))}
          </motion.g>
        ))}

        <g fill="currentColor">
          <circle cx="358" cy="246" r="4" />
          <circle cx="344" cy="246" r="2" opacity="0.35" />
          <circle cx="372" cy="246" r="2" opacity="0.35" />
        </g>

        <text
          x="360"
          y="410"
          fill="currentColor"
          fontSize="12"
          textAnchor="middle"
          letterSpacing="2.2"
          opacity="0.48"
        >
          ORGANIZED • RELATED • CONTROLLED
        </text>
      </svg>
    </figure>
  );
}
