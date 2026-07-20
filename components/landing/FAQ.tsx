"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/shared/Reveal";
import { FAQ_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section
      id="faq"
      title="Questions, answered clearly"
      description="Straightforward answers about how BetClear works on your iPhone."
    >
      <Reveal>
        <div className="mx-auto max-w-2xl divide-y divide-border rounded-[var(--radius-xl)] border border-border bg-card shadow-soft">
          {FAQ_ITEMS.map((item, index) => {
            const open = openIndex === index;

            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() =>
                      setOpenIndex((current) =>
                        current === index ? null : index,
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface/70 sm:px-6"
                  >
                    <span className="text-[15px] font-medium tracking-[-0.01em] text-foreground">
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        open && "rotate-45",
                      )}
                      aria-hidden="true"
                    >
                      <Plus size={12} weight="bold" />
                    </span>
                  </button>
                </h3>
                <div
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
    </Section>
  );
}
