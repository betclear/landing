import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-soft hover:bg-primary-hover hover:shadow-elevated",
  secondary:
    "bg-card text-foreground border border-border shadow-soft hover:bg-surface",
  ghost: "bg-transparent text-muted-foreground hover:text-foreground",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 pl-6 pr-2 text-[15px]",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  showArrow?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  showArrow,
  ...props
}: ButtonProps) {
  const withArrow = showArrow ?? (variant === "primary" && size === "lg");

  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em]",
    "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "active:scale-[0.98]",
    variantStyles[variant],
    sizeStyles[size],
    !withArrow && size === "lg" && "px-6",
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {withArrow ? (
        <span
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover:translate-x-0.5 group-hover:-translate-y-px",
            variant === "primary"
              ? "bg-white/15 text-white"
              : "bg-foreground/5 text-foreground",
          )}
          aria-hidden="true"
        >
          <ArrowUpRight size={14} weight="bold" />
        </span>
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
