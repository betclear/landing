import { cn } from "@/lib/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
};

export function Card({ children, className, as: Component = "div" }: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-soft",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-elevated",
        className,
      )}
    >
      {children}
    </Component>
  );
}
