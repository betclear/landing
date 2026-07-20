"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { FAQ_ITEMS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Clear answers before you install."
            description="Straight talk about what BetClear does, what it cannot do, and how protection works on iPhone."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-border rounded-[1.75rem] bg-card ring-1 ring-border">
            {FAQ_ITEMS.map((item, index) => {
              const open = openIndex === index;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-button-${index}`;

              return (
                <div key={item.question}>
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => {
                        const next = open ? null : index;
                        setOpenIndex(next);
                        if (next !== null) {
                          trackEvent("faq_opened", { question: item.question });
                        }
                      }}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface/60 sm:px-6"
                    >
                      <span className="text-[15px] font-medium tracking-[-0.015em] text-foreground">
                        {item.question}
                      </span>
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          open && "rotate-45 text-primary",
                        )}
                        aria-hidden="true"
                      >
                        <Plus size={12} weight="bold" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground sm:px-6">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
