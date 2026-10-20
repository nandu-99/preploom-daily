import { cn } from "@/lib/utils";
import Image from "next/image";

export function PrepLoomLogo({
  className,
  preload = false,
}: {
  className?: string;
  preload?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative block shrink-0", className)}
    >
      <Image
        src="https://preploom.vercel.app/light-logo.png"
        alt=""
        fill
        sizes="160px"
        preload={preload}
        className="object-contain object-left dark:hidden"
      />
      <Image
        src="https://preploom.vercel.app/dark-logo.png"
        alt=""
        fill
        sizes="160px"
        preload={preload}
        className="hidden object-contain object-left mix-blend-screen dark:block"
      />
    </span>
  );
}
