import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  title?: string;
  description?: string;
};

export function Section({
  id,
  children,
  className,
  containerClassName,
  title,
  description,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-24 sm:py-32", className)}>
      <Container className={containerClassName}>
        {(title || description) && (
          <header className="mb-12 max-w-[36rem] sm:mb-16">
            {title ? (
              <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 max-w-[65ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            ) : null}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
