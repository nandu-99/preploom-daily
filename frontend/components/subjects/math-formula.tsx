import { unicodeMathToLatex } from "@/lib/math-notation";
import katex from "katex";

type MathFormulaProps = {
  expression: string;
};

export function MathFormula({ expression }: MathFormulaProps) {
  const latex = unicodeMathToLatex(expression);
  let markup: string | null = null;

  try {
    markup = katex.renderToString(latex, {
      displayMode: true,
      output: "htmlAndMathml",
      strict: "error",
      throwOnError: true,
      trust: false,
    });
  } catch {
    markup = null;
  }

  if (markup) {
    return (
      <div
        className="math-formula min-w-max py-1 text-[17px] text-[#202020] dark:text-[#ececea] sm:text-[19px] [&_.katex-display]:m-0"
        data-source-expression={expression}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }

  return (
    <p className="min-w-max whitespace-nowrap font-[family-name:var(--font-geist-mono)] text-[15px] font-medium leading-8 tracking-[-0.02em] text-[#202020] dark:text-[#ececea] sm:text-[17px]">
      {expression}
    </p>
  );
}
