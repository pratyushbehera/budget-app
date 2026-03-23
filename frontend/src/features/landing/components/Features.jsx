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
    <SectionContainer id="features" className="py-24">
      <AnimatedSection className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
            Everything You Need
          </h2>
          <p className="text-2xl text-gray-400 dark:text-gray-500 font-medium tracking-tight">
             Advanced tools to master your financial destiny
          </p>
        </div>
 
        <div className="grid md:grid-cols-3 gap-10">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none hover:-translate-y-4 transition-transform duration-500 group"
            >
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-primary-500/20 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black text-white">0{i+1}</span>
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">{f.title}</h3>
              <p className="text-lg text-gray-400 dark:text-gray-500 font-medium tracking-tight leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </SectionContainer>
  );
}
