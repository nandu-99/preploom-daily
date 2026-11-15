"use client";

import { motion, useReducedMotion } from "motion/react";

const mainLinks = [
  "M148 312 L222 274",
  "M310 274 L379 207",
  "M421 180 L519 129",
  "M561 106 L628 82",
];

const branchLinks = ["M264 298 L304 354", "M286 294 L488 340"];

const packetPath = {
  x: [140, 246, 388, 528, 628],
  y: [304, 266, 186, 119, 75],
};

function RouterNode({ x, y, delay }: { x: number; y: number; delay: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.g
      initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        delay: reduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      <ellipse
        cx={x}
        cy={y}
        rx="29"
        ry="19"
        className="fill-[#ededeb] dark:fill-[#141414]"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={`M${x - 17} ${y - 5} L${x - 5} ${y} L${x - 17} ${y + 5} M${x + 17} ${y - 5} L${x + 5} ${y} L${x + 17} ${y + 5}`}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
        opacity="0.65"
      />
    </motion.g>
  );
}

export function ComputerNetworksIllustration() {
  const reduceMotion = useReducedMotion();

  return (
    <figure className="flex w-full items-center justify-center py-1 sm:py-2">
      <svg
        viewBox="0 0 720 430"
        role="img"
        aria-labelledby="cn-illustration-title cn-illustration-description"
        className="h-auto w-full text-[#151515] dark:text-[#d8d8d6]"
      >
        <title id="cn-illustration-title">
          Packet traveling through a network
        </title>
        <desc id="cn-illustration-description">
          A packet moves from a laptop through a switch and two routers to a
          server. The switch also connects a phone and a desktop computer.
        </desc>

        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.2"
          className="opacity-[0.14] dark:opacity-[0.2]"
        >
          {[...mainLinks, ...branchLinks].map((path) => (
            <path key={path} d={path} vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        {mainLinks.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.58 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: reduceMotion ? 0 : 0.55,
              delay: reduceMotion ? 0 : 0.2 + index * 0.14,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}

        {branchLinks.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.3 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: reduceMotion ? 0 : 0.65,
              delay: reduceMotion ? 0 : 0.9 + index * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{
            duration: reduceMotion ? 0 : 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <rect
            x="52"
            y="272"
            width="96"
            height="62"
            rx="8"
            className="fill-[#ededeb] dark:fill-[#141414]"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M43 346 H157 L145 334 H55 Z M91 346 L88 354 H112 L109 346"
            className="fill-[#ededeb] dark:fill-[#141414]"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
        </motion.g>

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{
            duration: reduceMotion ? 0 : 0.45,
            delay: reduceMotion ? 0 : 0.58,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <rect
            x="222"
            y="250"
            width="88"
            height="48"
            rx="11"
            className="fill-[#ededeb] dark:fill-[#141414]"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          {[238, 252, 266, 280].map((x) => (
            <rect
              key={x}
              x={x}
              y="269"
              width="8"
              height="7"
              rx="1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              vectorEffect="non-scaling-stroke"
              opacity="0.55"
            />
          ))}
        </motion.g>

        <RouterNode x={400} y={190} delay={0.84} />
        <RouterNode x={540} y={118} delay={1.02} />

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, x: 8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{
            duration: reduceMotion ? 0 : 0.45,
            delay: reduceMotion ? 0 : 1.18,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <rect
            x="628"
            y="34"
            width="58"
            height="104"
            rx="10"
            className="fill-[#ededeb] dark:fill-[#141414]"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M641 52 H673 V69 H641 Z M641 78 H673 V95 H641 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
            opacity="0.55"
          />
          <circle
            cx="657"
            cy="116"
            r="3.5"
            fill="currentColor"
            opacity="0.55"
          />
        </motion.g>

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 0.5, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{
            duration: reduceMotion ? 0 : 0.45,
            delay: reduceMotion ? 0 : 1.2,
          }}
        >
          <rect
            x="291"
            y="354"
            width="28"
            height="52"
            rx="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M299 363 H311 M301 396 H309"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.1"
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x="488"
            y="312"
            width="82"
            height="54"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M529 366 V382 M508 382 H550"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.3"
            vectorEffect="non-scaling-stroke"
          />
        </motion.g>

        {reduceMotion ? (
          <g>
            {[172, 342, 474, 595].map((x, index) => (
              <rect
                key={x}
                x={x}
                y={[293, 226, 150, 91][index]}
                width="14"
                height="9"
                rx="2"
                fill="currentColor"
                opacity="0.55"
              />
            ))}
          </g>
        ) : (
          [0, 1, 2].map((packet) => (
            <motion.rect
              key={packet}
              width="14"
              height="9"
              rx="2"
              fill="currentColor"
              initial={{ x: packetPath.x[0], y: packetPath.y[0], opacity: 0 }}
              animate={{
                x: packetPath.x,
                y: packetPath.y,
                opacity: [0, 0.9, 0.9, 0.9, 0],
              }}
              transition={{
                duration: 4.8,
                delay: 1.35 + packet * 1.25,
                times: [0, 0.25, 0.5, 0.75, 1],
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.2,
              }}
            />
          ))
        )}
      </svg>
    </figure>
  );
}
