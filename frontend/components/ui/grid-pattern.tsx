import { cn } from "@/lib/utils";
import { useId } from "react";

type GridPatternProps = React.SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
};

export function GridPattern({
  width = 40,
  height = 40,
  className,
  ...props
}: GridPatternProps) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={-1}
          y={-1}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}
