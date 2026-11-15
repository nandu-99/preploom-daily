# PrepLoom OS Notes Image Design System

Use this guide for every new Operating Systems note diagram. The goal is one calm, premium, monochrome visual language across light and dark website themes.

## Canonical palette

| Role | Color | Usage |
| --- | --- | --- |
| Base background | `#25282B` | Full image canvas and outer edges |
| Dark depth | `#1D2023` | Small shadows and low-emphasis depth only |
| Primary text | `#F2F0EB` | Titles, main labels and important values |
| Primary linework | `#D8D6D1` | Main arrows, outlines, connectors and icons |
| Secondary text and lines | `#A8AAAB` | Supporting labels and less important connectors |
| Muted details | `#777A7C` | Grid lines, inactive states and subtle separators |

Do not introduce accent colors. Do not use pure black or pure white.

Contrast against `#25282B`:

- Primary text: `13.01:1`
- Primary linework: `10.20:1`
- Secondary text and lines: `6.35:1`
- Muted details: `3.43:1` - use only for large decorative details, never essential text

## Background rules

- The base canvas must be `#25282B` in every image.
- Outer edges and corners must use the exact base background.
- Very subtle charcoal depth is allowed inside the canvas, between `#1D2023` and `#2C2F32`.
- Do not use visible gradients, glow, noise, paper texture, glass effects or decorative lighting.
- Export an opaque image. Do not use transparency.

## Text rules

- Use a clean sans-serif style similar to Geist Sans or Inter.
- Use short labels and simple English.
- Main titles may use uppercase when the existing image family uses it.
- Supporting labels should use sentence case where possible.
- Use `#F2F0EB` for important text and `#A8AAAB` for supporting text.
- Never place long paragraphs inside an image.
- Check every technical term and spelling before using the image.

## Linework and icons

- Use simple outline icons rather than filled illustrations.
- Use `#D8D6D1` for main outlines and arrows.
- Use `#A8AAAB` for secondary connectors.
- Keep one consistent line weight throughout a diagram.
- At `1536 × 1024`, use approximately 2-4 px strokes.
- Arrow direction must exactly match the technical relationship.
- Use rounded rectangles and restrained corner radii.
- Avoid decorative borders that do not explain anything.

## Layout

- Default size: `1536 × 1024` pixels.
- Default ratio: `3:2` landscape.
- Keep generous outer padding.
- Use a clear top-to-bottom or left-to-right reading order.
- Keep related elements aligned to a simple grid.
- Prefer one main idea per image.
- Comparisons should use balanced columns or rows.
- Diagrams must remain readable at normal article width and on mobile.

## Content rules

- Every element must explain the concept.
- Use exact process, resource and algorithm names from the notes.
- Keep labels consistent with the written content.
- Do not add facts that are not explained in the topic.
- Do not use people, objects or decorative scenes unless an analogy genuinely improves understanding.
- Technical accuracy is more important than visual drama.

## Generation prompt template

```text
Use case: scientific-educational
Asset type: PrepLoom Operating Systems course-note diagram
Primary request: [Describe the exact concept and required relationships.]
Subject: [List every required node, label, arrow and state.]
Style/medium: premium monochrome technical infographic with clean vector-like linework
Composition/framing: 3:2 landscape, 1536 × 1024, clear grid, generous margins, readable at article width
Color palette: exact base background #25282B; primary text #F2F0EB; primary linework #D8D6D1; secondary text and lines #A8AAAB; muted details #777A7C
Typography: clean sans serif similar to Geist Sans or Inter; short labels; exact spelling
Constraints: preserve the exact technical flow and arrow directions; one clear idea; consistent line weight and rounded corners
Avoid: pure black, pure white, accent colors, visible gradients, glow, glassmorphism, 3D effects, decorative texture, clutter and watermark
```

## Reference images

Use these as style references when generating a new diagram:

- `deadlock-prevention-vs-avoidance.png`
- `deadlock-resource-allocation-cycle.png`
- `os-middle-layer.png`

The subject may change, but the palette, spacing, typography, linework and overall restraint should remain consistent.

## Final validation checklist

- Canvas background is based on `#25282B`.
- Corners and outer edges match `#25282B`.
- Main text uses `#F2F0EB`.
- Main linework uses `#D8D6D1`.
- No accent colors are present.
- All text is spelled correctly.
- Every arrow points in the correct direction.
- Labels match the notes exactly.
- The diagram is readable on desktop and mobile.
- The image adds understanding rather than decoration.
