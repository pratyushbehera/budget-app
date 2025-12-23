import { AnimatedSection } from "../../../shared/components/AnimatedSection";
import { SectionContainer } from "../../../shared/components/SectionContainer";

const STEPS = ["Create account", "Add transactions", "Track & optimize"];

export function HowItWorks() {
  return (
    <SectionContainer>
      <AnimatedSection>
        <h2 className="section-title dark:text-gray-500">How it works</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {STEPS.map((step, i) => (
            <div key={i} className="text-center">
              <div className="step-circle">{i + 1}</div>
              <p className="mt-4 font-medium dark:text-gray-600">{step}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </SectionContainer>
  );
}
