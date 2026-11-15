"use client";

import { motion, useReducedMotion } from "motion/react";

const bits = ["1", "0", "1", "1"];

export function ModernComputerArchitectureIllustration() {
  const reduceMotion = useReducedMotion();

  return (
    <figure className="flex w-full items-center justify-center py-1 sm:py-2">
      <svg
        viewBox="0 0 720 430"
        role="img"
        aria-labelledby="mca-illustration-title mca-illustration-description"
        className="h-auto w-full text-[#151515] dark:text-[#d8d8d6]"
      >
        <title id="mca-illustration-title">
          Bits moving through an arithmetic logic unit
        </title>
        <desc id="mca-illustration-description">
          Two four-bit inputs enter an ALU. A control signal selects the
          operation, and a four-bit result leaves the unit.
        </desc>

        <g fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.22">
          <path d="M196 141 H290 M196 259 H290 M430 200 H548" />
          <path d="M360 82 V139" strokeDasharray="4 6" />
        </g>

        {[136, 254].map((y, row) => (
          <motion.g
            key={y}
            initial={reduceMotion ? false : { opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{
              duration: reduceMotion ? 0 : 0.45,
              delay: row * 0.12,
            }}
          >
            {bits.map((bit, index) => (
              <g key={`${y}-${index}`}>
                <rect
                  x={52 + index * 38}
                  y={y - 19}
                  width="32"
                  height="38"
                  rx="7"
                  className="fill-[#ededeb] dark:fill-[#141414]"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <text
                  x={68 + index * 38}
                  y={y + 5}
                  textAnchor="middle"
                  fill="currentColor"
                  fontFamily="monospace"
                  fontSize="14"
                  opacity="0.68"
                >
                  {row === 0 ? bit : bits[(index + 2) % bits.length]}
                </text>
              </g>
            ))}
          </motion.g>
        ))}

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
            delay: reduceMotion ? 0 : 0.24,
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <path
            d="M290 123 H410 L448 200 L410 277 H290 Z"
            className="fill-[#ededeb] dark:fill-[#141414]"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <text
            x="359"
            y="193"
            textAnchor="middle"
            fill="currentColor"
            fontFamily="sans-serif"
            fontSize="25"
            fontWeight="600"
          >
            ALU
          </text>
          <text
            x="359"
            y="220"
            textAnchor="middle"
            fill="currentColor"
            fontFamily="monospace"
            fontSize="10"
            opacity="0.48"
          >
            ADD · AND · XOR
          </text>
        </motion.g>

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          whileInView={{ opacity: 0.7, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{
            duration: reduceMotion ? 0 : 0.4,
            delay: reduceMotion ? 0 : 0.48,
          }}
        >
          <rect
            x="324"
            y="50"
            width="72"
            height="32"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <text
            x="360"
            y="70"
            textAnchor="middle"
            fill="currentColor"
            fontSize="9"
          >
            CONTROL
          </text>
        </motion.g>

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{
            duration: reduceMotion ? 0 : 0.45,
            delay: reduceMotion ? 0 : 0.62,
          }}
        >
          {["0", "1", "1", "1"].map((bit, index) => (
            <g key={index}>
              <rect
                x={548 + index * 38}
                y="181"
                width="32"
                height="38"
                rx="7"
                className="fill-[#ededeb] dark:fill-[#141414]"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <text
                x={564 + index * 38}
                y="205"
                textAnchor="middle"
                fill="currentColor"
                fontFamily="monospace"
                fontSize="14"
                opacity="0.68"
              >
                {bit}
              </text>
            </g>
          ))}
        </motion.g>

        <g
          fill="currentColor"
          fontFamily="monospace"
          fontSize="10"
          opacity="0.42"
        >
          <text x="52" y="101">
            OPERAND A
          </text>
          <text x="52" y="219">
            OPERAND B
          </text>
          <text x="548" y="165">
            RESULT
          </text>
        </g>
      </svg>
    </figure>
  );
}
