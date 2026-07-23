import type { CSSProperties } from "react";
import { Link } from "@/lib/i18n/navigation";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "soft";
type ButtonSize = "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "btn-primary hover:bg-button-hover",
  secondary: "bg-transparent text-[#0F2022] hover:bg-foreground/[0.04]",
  ghost: "bg-transparent text-muted-foreground hover:text-foreground",
  soft: "bg-soft text-soft-foreground hover:opacity-95",
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
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  showArrow = false,
  ...props
}: ButtonProps) {
  const withArrow = showArrow;

  const sizeStyle: CSSProperties | undefined =
    size === "md"
      ? {
          height: 40,
          padding: "0 20px",
          borderRadius: 40,
          boxSizing: "border-box",
          color: "#0F2022",
          fontFamily:
            "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
          fontSize: 14,
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "18px",
          whiteSpace: "nowrap",
          ...(variant === "secondary"
            ? { border: "1px solid #D5E0DB", background: "transparent" }
            : {}),
        }
      : size === "lg" && (variant === "primary" || variant === "secondary")
        ? {
            height: 50,
            padding: "0 24px",
            borderRadius: 50,
            boxSizing: "border-box",
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "18px",
            whiteSpace: "nowrap",
            ...(variant === "secondary"
              ? { border: "1px solid #D5E0DB", background: "transparent" }
              : {}),
          }
        : undefined;

  const classes = cn(
    "group inline-flex items-center justify-center rounded-full tracking-[-0.01em]",
    "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "active:scale-[0.98]",
    variantStyles[variant],
    variant === "primary" && size === "lg" && "btn-primary-lg",
    variant === "secondary" && size === "lg" && "btn-secondary-lg",
    size === "md" && "btn-md",
    size === "lg" &&
      variant !== "primary" &&
      variant !== "secondary" &&
      "h-12 gap-2 px-6 text-[15px] font-medium leading-none",
    withArrow && size === "lg" && "pl-6 pr-2",
    className,
  );

  const content = (
    <>
      <span className="inline-flex items-center leading-none">{children}</span>
      {withArrow ? (
        <span
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover:translate-x-0.5 group-hover:-translate-y-px",
            variant === "primary" || variant === "soft"
              ? "bg-black/10 text-inherit"
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
    const href = props.href;
    const onClick = props.onClick;
    const useNativeAnchor =
      href.startsWith("/api/") ||
      href.endsWith(".mobileconfig") ||
      href.startsWith("mailto:") ||
      href.startsWith("https://");

    if (useNativeAnchor) {
      return (
        <a
          href={href}
          className={classes}
          style={sizeStyle}
          onClick={onClick}
          {...(href.startsWith("https://")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} style={sizeStyle} onClick={onClick}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  const { style: buttonStyle, type, ...restButtonProps } = buttonProps;
  return (
    <button
      type={type ?? "button"}
      className={classes}
      style={{ ...sizeStyle, ...buttonStyle }}
      {...restButtonProps}
    >
      {content}
    </button>
  );
}
