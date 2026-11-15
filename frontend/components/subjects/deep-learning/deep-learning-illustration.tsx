"use client";

import { motion, useReducedMotion } from "motion/react";

const layers = [
  { x: 100, nodes: [122, 206, 290] },
  { x: 286, nodes: [84, 160, 236, 312] },
  { x: 474, nodes: [112, 206, 300] },
  { x: 650, nodes: [164, 248] },
];

export function DeepLearningIllustration() {
  const reduceMotion = useReducedMotion();

  return (
    <figure className="flex w-full items-center justify-center py-1 sm:py-2">
      <svg
        viewBox="0 0 750 410"
        role="img"
        aria-labelledby="dl-illustration-title dl-illustration-description"
        className="h-auto w-full text-[#151515] dark:text-[#d8d8d6]"
      >
        <title id="dl-illustration-title">A layered neural network</title>
        <desc id="dl-illustration-description">
          Input nodes connect through two learned hidden layers to output nodes.
        </desc>

        <g opacity="0.22">
          {layers
            .slice(0, -1)
            .flatMap((layer, layerIndex) =>
              layer.nodes.flatMap((sourceY, sourceIndex) =>
                layers[layerIndex + 1].nodes.map((targetY, targetIndex) => (
                  <line
                    key={`${layerIndex}-${sourceIndex}-${targetIndex}`}
                    x1={layer.x}
                    y1={sourceY}
                    x2={layers[layerIndex + 1].x}
                    y2={targetY}
                    stroke="currentColor"
                    strokeWidth="1.2"
                    vectorEffect="non-scaling-stroke"
                  />
                )),
              ),
            )}
        </g>

        {layers.flatMap((layer, layerIndex) =>
          layer.nodes.map((y, nodeIndex) => (
            <motion.circle
              key={`${layerIndex}-${nodeIndex}`}
              cx={layer.x}
              cy={y}
              r="15"
              className="fill-[#ededeb] dark:fill-[#141414]"
              stroke="currentColor"
              strokeWidth="1.7"
              vectorEffect="non-scaling-stroke"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 0.9, scale: 1 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{
                duration: reduceMotion ? 0 : 0.35,
                delay: reduceMotion
                  ? 0
                  : 0.12 + layerIndex * 0.2 + nodeIndex * 0.035,
              }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          )),
        )}

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, delay: 1 }}
          fill="currentColor"
          fontSize="12"
          textAnchor="middle"
        >
          <text x="100" y="370" opacity="0.6">
            INPUT
          </text>
          <text x="380" y="370" opacity="0.6">
            LEARNED REPRESENTATIONS
          </text>
          <text x="650" y="370" opacity="0.6">
            OUTPUT
          </text>
        </motion.g>
      </svg>
    </figure>
  );
}
