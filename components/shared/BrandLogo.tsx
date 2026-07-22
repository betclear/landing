import Image from "next/image";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/constants";

type BrandLogoProps = {
  className?: string;
  /** Visual height of the logo mark. Width scales from the asset ratio. */
  height?: number;
  priority?: boolean;
};

const ASPECT = 476 / 106;

export function BrandLogo({
  className,
  height = 28,
  priority = false,
}: BrandLogoProps) {
  const width = Math.round(height * ASPECT);

  return (
    <Image
      src="/images/logo.png"
      alt={SITE.name}
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto select-none", className)}
      style={{ height, width: "auto" }}
    />
  );
}
