import {
  Navbar,
  Hero,
  SocialProof,
  Features,
  HowItWorks,
  Testimonials,
  Footer,
  CTA,
} from "../features/landing/components";

export function HomePage() {
  return (
    <div
      className="
  min-h-screen overflow-x-hidden
  bg-gradient-to-b
  from-primary-300
  via-white
  to-primary-300
  dark:from-gray-950
  dark:via-gray-850
  dark:to-gray-950
"
    >
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
