import { HeroVisual } from "./HeroVisual";
import { AnimatedSection } from "../../../shared/components/AnimatedSection";
import { GradientBlob } from "../../../shared/components/GradientBlob";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <GradientBlob />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <AnimatedSection>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 dark:text-gray-600">
            Take Control of Your
            <span className="block text-primary-600">Finances</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-xl mb-10">
            Track expenses, plan budgets, and achieve your financial goals with
            clarity and confidence.
          </p>

          <div className="flex gap-4">
            <Link to="/signup" className="btn-primary px-8 py-4 rounded-xl">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-4 rounded-xl">
              Login
            </Link>
          </div>
        </AnimatedSection>

        {/* Visual */}
        <AnimatedSection delay={0.2}>
          <HeroVisual />
        </AnimatedSection>
      </div>
    </section>
  );
}
