"use client";

import { motion, useReducedMotion } from "motion/react";

const objects = [
  { x: 76, label: "car1", state: "Silver · 0" },
  { x: 304, label: "car2", state: "Gray · 60" },
  { x: 532, label: "car3", state: "White · 30" },
];

export function OopIllustration() {
  const reduceMotion = useReducedMotion();

  return (
    <figure className="flex w-full items-center justify-center py-1 sm:py-2">
      <svg
        viewBox="0 0 720 430"
        role="img"
        aria-labelledby="oop-illustration-title oop-illustration-description"
        className="h-auto w-full text-[#151515] dark:text-[#d8d8d6]"
      >
        <title id="oop-illustration-title">
          One class creating three objects
        </title>
        <desc id="oop-illustration-description">
          A Car class defines fields and methods. Three Car objects use that
          structure while keeping separate state.
        </desc>

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <rect
            x="230"
            y="30"
            width="260"
            height="148"
            rx="18"
            className="fill-[#ededeb] dark:fill-[#141414]"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M230 86 H490 M360 86 V178"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
            opacity="0.35"
          />
          <text
            x="360"
            y="67"
            textAnchor="middle"
            fill="currentColor"
            fontSize="22"
            fontWeight="600"
          >
            Car class
          </text>
          <text
            x="260"
            y="116"
            fill="currentColor"
            fontSize="13"
            opacity="0.55"
          >
            Fields
          </text>
          <text x="260" y="143" fill="currentColor" fontSize="15">
            color · speed
          </text>
          <text
            x="385"
            y="116"
            fill="currentColor"
            fontSize="13"
            opacity="0.55"
          >
            Methods
          </text>
          <text x="385" y="143" fill="currentColor" fontSize="15">
            start · brake
          </text>
        </motion.g>

        {objects.map((object, index) => {
          const center = object.x + 56;
          return (
            <g key={object.label}>
              <motion.path
                d={`M360 178 C360 226 ${center} 214 ${center} 276`}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.6"
                vectorEffect="non-scaling-stroke"
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.5 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.7,
                  delay: reduceMotion ? 0 : 0.35 + index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
              <motion.g
                initial={
                  reduceMotion ? false : { opacity: 0, y: 8, scale: 0.96 }
                }
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.4,
                  delay: reduceMotion ? 0 : 0.8 + index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect
                  x={object.x}
                  y="276"
                  width="112"
                  height="108"
                  rx="15"
                  className="fill-[#ededeb] dark:fill-[#141414]"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={`M${object.x} 323 H${object.x + 112}`}
                  stroke="currentColor"
                  strokeWidth="1.1"
                  vectorEffect="non-scaling-stroke"
                  opacity="0.3"
                />
                <text
                  x={center}
                  y="307"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="17"
                  fontWeight="600"
                >
                  {object.label}
                </text>
                <text
                  x={center}
                  y="348"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="12"
                  opacity="0.55"
                >
                  color · speed
                </text>
                <text
                  x={center}
                  y="371"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="13"
                >
                  {object.state}
                </text>
              </motion.g>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
