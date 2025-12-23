import { AnimatedSection } from "../../../shared/components/AnimatedSection";
import { SectionContainer } from "../../../shared/components/SectionContainer";

export function SocialProof() {
  return (
    <SectionContainer>
      <AnimatedSection>
        <p className="text-sm uppercase tracking-widest text-gray-500 text-center mb-6">
          Trusted by early users
        </p>

        <div className="flex justify-center gap-10 opacity-70 dark:text-gray-800">
          <span className="font-semibold">Startup A</span>
          <span className="font-semibold">Startup B</span>
          <span className="font-semibold">Startup C</span>
        </div>
      </AnimatedSection>
    </SectionContainer>
  );
}
