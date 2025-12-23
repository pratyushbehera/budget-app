import { AnimatedSection } from "../../../shared/components/AnimatedSection";
import { SectionContainer } from "../../../shared/components/SectionContainer";

export function Testimonials() {
  return (
    <SectionContainer>
      <AnimatedSection>
        <h2 className="section-title dark:text-gray-500">Loved by users</h2>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="glass-card p-6 rounded-2xl">
            “FinPal completely changed how I manage money.”
            <span className="block mt-4 font-semibold">— Early User</span>
          </div>
        </div>
      </AnimatedSection>
    </SectionContainer>
  );
}
