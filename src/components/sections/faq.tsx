"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/data/faqs";
import { Section } from "../ui/section";
import { Reveal } from "../ui/reveal";

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Section
      id="faq"
      label="faq"
      heading="Questions you might have"
      tone="sunken"
    >
      <div className="mx-auto max-w-2xl space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;

          return (
            <Reveal key={faq.question} delay={index * 0.05}>
              <div className="card overflow-hidden">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <Plus
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 text-faint transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                    />
                  </button>
                </h3>

                {/* grid-rows 0fr → 1fr, so a long answer is never clipped the
                    way a fixed max-height would clip it. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="disclosure"
                  data-open={isOpen}
                >
                  <div>
                    <p className="px-6 pb-5 leading-relaxed text-muted">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
