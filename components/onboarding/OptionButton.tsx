"use client";

import { cn } from "@/lib/cn";

type OptionButtonProps = {
  selected?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function OptionButton({
  selected,
  children,
  onClick,
  className,
  type = "button",
  disabled,
}: OptionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "flex min-h-14 w-full items-center justify-between rounded-[18px] px-4 text-left text-[15px] font-medium tracking-[-0.01em] transition-all duration-200",
        "ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "bg-primary/15 text-foreground ring-primary"
          : "bg-card/60 text-foreground ring-border hover:bg-surface",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
