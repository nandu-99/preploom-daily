import { cn } from "@/lib/utils";
import Image from "next/image";

type PrepLoomLogoProps = {
  className?: string;
  preload?: boolean;
};

export function PrepLoomLogo({
  className,
  preload = false,
}: PrepLoomLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative block shrink-0", className)}
    >
      <Image
        src="/light-logo.png"
        alt=""
        fill
        sizes="160px"
        preload={preload}
        className="object-contain object-left dark:hidden"
      />
      <Image
        src="/dark-logo.png"
        alt=""
        fill
        sizes="160px"
        preload={preload}
        className="hidden object-contain object-left mix-blend-screen dark:block"
      />
    </span>
  );
}
