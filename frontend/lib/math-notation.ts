const greekSymbols: Record<string, string> = {
  α: "\\alpha",
  β: "\\beta",
  γ: "\\gamma",
  δ: "\\delta",
  ε: "\\varepsilon",
  θ: "\\theta",
  λ: "\\lambda",
  μ: "\\mu",
  π: "\\pi",
  ρ: "\\rho",
  σ: "\\sigma",
  τ: "\\tau",
  φ: "\\varphi",
  Φ: "\\Phi",
  Σ: "\\sum",
  Π: "\\prod",
  ℒ: "\\mathcal{L}",
  ℓ: "\\ell",
};

const mathSymbols: Record<string, string> = {
  "−": "-",
  "×": "\\times",
  "÷": "\\div",
  "·": "\\cdot",
  "⊙": "\\odot",
  "⨀": "\\bigodot",
  "≈": "\\approx",
  "≠": "\\ne",
  "≤": "\\le",
  "≥": "\\ge",
  "∈": "\\in",
  "∉": "\\notin",
  "∞": "\\infty",
  "∂": "\\partial",
  "∇": "\\nabla",
  "√": "\\sqrt",
  "→": "\\to",
  "←": "\\leftarrow",
  "⇒": "\\Rightarrow",
  "⇔": "\\Longleftrightarrow",
  "…": "\\ldots",
  "⌊": "\\left\\lfloor",
  "⌋": "\\right\\rfloor",
  "⌈": "\\left\\lceil",
  "⌉": "\\right\\rceil",
  "½": "\\frac{1}{2}",
  ɡ: "g",
  "⁄": "/",
};

const superscripts: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁺": "+",
  "⁻": "-",
  "⁼": "=",
  "⁽": "(",
  "⁾": ")",
  ⁿ: "n",
  ᵀ: "\\mathsf{T}",
  ᵈ: "d",
  ᵇ: "b",
  ᶻ: "z",
  ᴮ: "B",
  ᴸ: "L",
  ℓ: "\\ell",
};

const subscripts: Record<string, string> = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
  "₊": "+",
  "₋": "-",
  "₌": "=",
  "₍": "(",
  "₎": ")",
  ₐ: "a",
  ₑ: "e",
  ₕ: "h",
  ᵢ: "i",
  ⱼ: "j",
  ₖ: "k",
  ₗ: "l",
  ₘ: "m",
  ₙ: "n",
  ₒ: "o",
  ₚ: "p",
  ᵣ: "r",
  ₛ: "s",
  ₜ: "t",
  ᵤ: "u",
  ᵥ: "v",
  ₓ: "x",
  "꜀": "c",
  ꜜ: "down",
  ᵦ: "\\beta",
  "𝓌": "w",
};

const accentedSymbols: Record<string, string> = {
  ŷ: "\\hat{y}",
  ȳ: "\\bar{y}",
  h̃: "\\widetilde{h}",
  p̂: "\\hat{p}",
  x̂: "\\hat{x}",
  β̂: "\\hat{\\beta}",
  x̄: "\\bar{x}",
  ã: "\\widetilde{a}",
  m̂: "\\hat{m}",
  v̂: "\\hat{v}",
  "𝓌": "_{w}",
  ŷensemble: "\\hat{y}_{\\mathrm{ensemble}}",
};

const namedFunctions = new Set([
  "arg",
  "ceil",
  "cos",
  "diag",
  "exp",
  "floor",
  "ln",
  "log",
  "max",
  "mean",
  "min",
  "ReLU",
  "sigmoid",
  "sign",
  "sin",
  "softmax",
  "tanh",
]);

const semanticIdentifiers: Record<string, string> = {
  dff: "d_{\\mathrm{ff}}",
  dmodel: "d_{\\mathrm{model}}",
  ganalytical: "g_{\\mathrm{analytical}}",
  gnumerical: "g_{\\mathrm{numerical}}",
  pcorrect: "p_{\\mathrm{correct}}",
  Xpad: "X_{\\mathrm{pad}}",
  WQ: "W_Q",
  WK: "W_K",
  WV: "W_V",
  WO: "W_O",
  Wvocab: "W_{\\mathrm{vocab}}",
  bvocab: "b_{\\mathrm{vocab}}",
};

const wordPattern = /[A-Za-z]+/y;

function isRecordKey<T extends Record<string, string>>(
  record: T,
  key: string,
): key is keyof T & string {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function readScript(
  source: string,
  start: number,
  script: Record<string, string>,
) {
  let value = "";
  let index = start;

  while (index < source.length && isRecordKey(script, source[index])) {
    value += script[source[index]];
    index += 1;
  }

  return { value, end: index };
}

function readCaretScript(source: string, start: number) {
  if (source[start] === "(") {
    let depth = 0;
    for (let index = start; index < source.length; index += 1) {
      if (source[index] === "(") depth += 1;
      if (source[index] === ")") depth -= 1;
      if (depth === 0) {
        return {
          value: source.slice(start + 1, index),
          end: index + 1,
        };
      }
    }
  }

  const match = source.slice(start).match(/^[A-Za-z0-9]+/);
  return match
    ? { value: match[0], end: start + match[0].length }
    : { value: source[start] ?? "", end: start + 1 };
}

function readRootArgument(source: string, start: number) {
  if (source[start] === "(") {
    let depth = 0;
    for (let index = start; index < source.length; index += 1) {
      if (source[index] === "(") depth += 1;
      if (source[index] === ")") depth -= 1;
      if (depth === 0) {
        return { value: source.slice(start + 1, index), end: index + 1 };
      }
    }
  }

  const word = source
    .slice(start)
    .match(/^[A-Za-z]+(?:\([^)]*\))?[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]*/u);
  if (word) return { value: word[0], end: start + word[0].length };

  const number = source.slice(start).match(/^[0-9.]+/);
  if (number) return { value: number[0], end: start + number[0].length };

  const end = source.slice(start).search(/[=,;+]/);
  const resolvedEnd = end === -1 ? source.length : start + end;
  return { value: source.slice(start, resolvedEnd).trim(), end: resolvedEnd };
}

function formatWord(word: string) {
  if (semanticIdentifiers[word]) return semanticIdentifiers[word];
  if (namedFunctions.has(word)) return `\\operatorname{${word}}`;
  if (word.length === 1) return word;
  return `\\mathrm{${word}}`;
}

function findMatchingGroup(source: string, start: number) {
  const opening = source[start];
  const closing = opening === "(" ? ")" : "]";
  let depth = 0;

  for (let index = start; index < source.length; index += 1) {
    if (source[index] === opening) depth += 1;
    if (source[index] === closing) depth -= 1;
    if (depth === 0) return index;
  }

  return -1;
}

function findTopLevelFraction(source: string) {
  let roundDepth = 0;
  let squareDepth = 0;
  let fenceDepth = 0;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character === "(") roundDepth += 1;
    if (character === ")") roundDepth -= 1;
    if (character === "[") squareDepth += 1;
    if (character === "]") squareDepth -= 1;
    if (character === "⌊" || character === "⌈") fenceDepth += 1;
    if (character === "⌋" || character === "⌉") fenceDepth -= 1;

    if (
      character !== "/" ||
      roundDepth !== 0 ||
      squareDepth !== 0 ||
      fenceDepth !== 0
    ) {
      continue;
    }

    let start = 0;
    let end = source.length;
    let leftRoundDepth = 0;
    let leftSquareDepth = 0;

    for (let cursor = 0; cursor < index; cursor += 1) {
      const current = source[cursor];
      if (current === "(") leftRoundDepth += 1;
      if (current === ")") leftRoundDepth -= 1;
      if (current === "[") leftSquareDepth += 1;
      if (current === "]") leftSquareDepth -= 1;
      if (
        leftRoundDepth === 0 &&
        leftSquareDepth === 0 &&
        /[=≈≠≤≥,+;:]/u.test(current)
      ) {
        start = cursor + 1;
      }
    }

    let rightRoundDepth = 0;
    let rightSquareDepth = 0;
    for (let cursor = index + 1; cursor < source.length; cursor += 1) {
      const current = source[cursor];
      if (current === "(") rightRoundDepth += 1;
      if (current === ")") rightRoundDepth -= 1;
      if (current === "[") rightSquareDepth += 1;
      if (current === "]") rightSquareDepth -= 1;
      if (
        rightRoundDepth === 0 &&
        rightSquareDepth === 0 &&
        /[=≈≠≤≥,+;:]/u.test(current)
      ) {
        end = cursor;
        break;
      }
    }

    const rightText = source.slice(index + 1, end);
    const wordBoundary = rightText.search(/\s+(?:for|when|where)\s+/i);
    if (wordBoundary !== -1) end = index + 1 + wordBoundary;

    return {
      start,
      slash: index,
      end,
    };
  }

  return null;
}

/**
 * Converts PrepLoom's existing readable Unicode notation into KaTeX input.
 * The original expression remains the canonical source and accessible fallback.
 */
export function unicodeMathToLatex(expression: string): string {
  let source = expression
    .replaceAll("I/Os", "I⁄Os")
    .replace(/\b(EX|MEM|ID|IF|WB)\/(EX|MEM|ID|IF|WB)\./g, "$1⁄$2.");
  const fraction = findTopLevelFraction(source);

  if (fraction) {
    const prefix = source.slice(0, fraction.start);
    const numerator = source.slice(fraction.start, fraction.slash).trim();
    const denominator = source.slice(fraction.slash + 1, fraction.end).trim();
    const suffix = source.slice(fraction.end);

    if (numerator && denominator) {
      return [
        unicodeMathToLatex(prefix),
        `\\frac{${unicodeMathToLatex(numerator)}}{${unicodeMathToLatex(denominator)}}`,
        unicodeMathToLatex(suffix),
      ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    }
  }

  const protectedAccents: string[] = [];

  for (const [symbol, latex] of Object.entries(accentedSymbols)) {
    source = source.replaceAll(symbol, () => {
      const token = `§A${protectedAccents.length}§`;
      protectedAccents.push(latex);
      return token;
    });
  }

  let latex = "";
  let index = 0;
  let normOpen = false;

  while (index < source.length) {
    const character = source[index];

    if (/\s/.test(character)) {
      let end = index + 1;
      while (end < source.length && /\s/.test(source[end])) end += 1;

      const previous = source[index - 1] ?? "";
      const next = source[end] ?? "";
      const relationOrOperator = /[=+\-−×÷·≈≠≤≥<>←→⇒⇔]/u;

      if (
        previous &&
        next &&
        !relationOrOperator.test(previous) &&
        !relationOrOperator.test(next)
      ) {
        latex += "\\ ";
      }

      index = end;
      continue;
    }

    if (character === "§") {
      const end = source.indexOf("§", index + 1);
      const token = source.slice(index + 2, end);
      latex += protectedAccents[Number(token)];
      index = end + 1;
      continue;
    }

    if (character !== "ℓ" && isRecordKey(superscripts, character)) {
      const script = readScript(source, index, superscripts);
      latex += `^{${script.value}}`;
      index = script.end;
      continue;
    }

    if (isRecordKey(subscripts, character)) {
      const script = readScript(source, index, subscripts);
      latex += `_{${script.value}}`;
      index = script.end;
      continue;
    }

    if (character === "^") {
      const script = readCaretScript(source, index + 1);
      latex += `^{${unicodeMathToLatex(script.value)}}`;
      index = script.end;
      continue;
    }

    if (character === "′") {
      latex += "^{\\prime}";
      index += 1;
      continue;
    }

    if (character === "√") {
      const argument = readRootArgument(source, index + 1);
      latex += `\\sqrt{${unicodeMathToLatex(argument.value)}}`;
      index = argument.end;
      continue;
    }

    if (character === "(" || character === "[") {
      const end = findMatchingGroup(source, index);
      if (end !== -1) {
        const open = character === "(" ? "\\left(" : "\\left[";
        const close = character === "(" ? "\\right)" : "\\right]";
        latex += `${open}${unicodeMathToLatex(source.slice(index + 1, end))}${close}`;
        index = end + 1;
        continue;
      }
    }

    if (character === "⌊" || character === "⌈") {
      const closing = character === "⌊" ? "⌋" : "⌉";
      const end = source.indexOf(closing, index + 1);
      if (end !== -1) {
        const open = character === "⌊" ? "\\left\\lfloor" : "\\left\\lceil";
        const close = character === "⌊" ? "\\right\\rfloor" : "\\right\\rceil";
        latex += `${open}${unicodeMathToLatex(source.slice(index + 1, end))}${close}`;
        index = end + 1;
        continue;
      }
    }

    if (source.startsWith("||", index) || source.startsWith("‖", index)) {
      latex += normOpen ? "\\rVert " : "\\lVert ";
      normOpen = !normOpen;
      index += source.startsWith("||", index) ? 2 : 1;
      continue;
    }

    if (isRecordKey(greekSymbols, character)) {
      latex += `${greekSymbols[character]} `;
      index += 1;
      continue;
    }

    if (isRecordKey(mathSymbols, character)) {
      latex += `${mathSymbols[character]} `;
      index += 1;
      continue;
    }

    if (/[A-Za-z]/.test(character)) {
      wordPattern.lastIndex = index;
      const match = wordPattern.exec(source);
      if (match) {
        latex += formatWord(match[0]);
        index = wordPattern.lastIndex;
        continue;
      }
    }

    if (character === "$") {
      latex += "\\$";
    } else if (character === "%") {
      latex += "\\%";
    } else if (character === "&") {
      latex += "\\&";
    } else if (character === "_") {
      latex += "\\_";
    } else if (character === "{") {
      latex += "\\{";
    } else if (character === "}") {
      latex += "\\}";
    } else if (character === "|") {
      latex += "\\vert ";
    } else {
      latex += character;
    }

    index += 1;
  }

  return latex.replace(/\s+/g, " ").trim();
}
