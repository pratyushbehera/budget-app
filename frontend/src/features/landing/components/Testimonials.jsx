import { AnimatedSection } from "../../../shared/components/AnimatedSection";
import { SectionContainer } from "../../../shared/components/SectionContainer";

export function Testimonials() {
  return (
    <SectionContainer className="py-24">
      <AnimatedSection className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
            Loved By Thousands
          </h2>
          <p className="text-2xl text-gray-400 dark:text-gray-500 font-medium tracking-tight">
            Join the revolution in personal finance
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-3xl p-12 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-[12rem] font-black leading-none italic">"</span>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight relative z-10 italic">
              “FinPal completely changed how I manage money. The expressive UI makes budgeting addictive.”
            </p>
            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-500 shadow-lg shadow-primary-500/20"></div>
              <div>
                <span className="block text-xl font-black text-gray-900 dark:text-white tracking-tighter">Pratyush Behera</span>
                <span className="text-xs font-black uppercase tracking-widest text-primary-500">Power User</span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </SectionContainer>
  );
}
