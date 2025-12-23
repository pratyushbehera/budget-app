import { AnimatedSection } from "../../../shared/components/AnimatedSection";
import { SectionContainer } from "../../../shared/components/SectionContainer";

const FEATURES = [
  {
    title: "Expense Tracking",
    desc: "Understand where every rupee goes.",
  },
  {
    title: "Budget Planning",
    desc: "Stay within limits effortlessly.",
  },
  {
    title: "Goal Setting",
    desc: "Plan milestones and achieve them.",
  },
];

export function Features() {
  return (
    <SectionContainer>
      <AnimatedSection>
        <h2 className="section-title dark:text-gray-500">Everything you need</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="glass-card p-6 rounded-2xl hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-950">{f.desc}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </SectionContainer>
  );
}
