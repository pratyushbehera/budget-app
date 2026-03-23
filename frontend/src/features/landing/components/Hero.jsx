import { HeroVisual } from "./HeroVisual";
import { AnimatedSection } from "../../../shared/components/AnimatedSection";
import { GradientBlob } from "../../../shared/components/GradientBlob";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <GradientBlob />
      
      {/* Decorative Blur Patterns */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text Area */}
        <AnimatedSection className="space-y-10">
          <div className="space-y-4">
            <div className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full text-xs font-black uppercase tracking-[0.2em] animate-fade-in">
              The Future of Personal Finance
            </div>
            <h1 className="text-7xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9] animate-slide-in-bottom">
              Take Control <br/>
              <span className="text-primary-500">of Your Money</span>
            </h1>
          </div>

          <p className="text-2xl text-gray-400 dark:text-gray-500 font-medium tracking-tight max-w-xl leading-relaxed animate-fade-in">
            Master your spending, crush your goals, and build lasting wealth with the most expressive budget tracker ever built.
          </p>

          <div className="flex flex-wrap gap-6 animate-fade-in pt-4">
            <Link 
              to="/signup" 
              className="btn-primary px-10 py-5 text-xl font-black rounded-2xl shadow-2xl shadow-primary-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="px-10 py-5 text-xl font-black text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl border-2 border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all"
            >
              Sign In
            </Link>
          </div>
        </AnimatedSection>

        {/* Visual Area */}
        <AnimatedSection delay={0.3} className="relative">
          <div className="absolute inset-0 bg-primary-500/5 rounded-full blur-3xl -z-10 scale-150"></div>
          <HeroVisual />
        </AnimatedSection>
      </div>
    </section>
  );
}
