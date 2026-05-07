import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="px-6 py-24 pb-32">
      <div className="max-w-7xl mx-auto bg-primary-500 rounded-[3rem] p-16 md:p-24 relative overflow-hidden shadow-2xl shadow-primary-500/20 flex flex-col items-center text-center animate-slide-in-bottom">
        {/* Background Decorative Patterns */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-black rounded-full blur-[150px]"></div>
        </div>

        <div className="relative z-10 max-w-2xl space-y-10">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
            Start Managing <br /> Money Better Today
          </h2>
          <p className="text-xl text-primary-100 font-medium tracking-tight opacity-90 leading-relaxed">
            Join thousands of users who have transformed their relationship with
            money using FinPal&apos;s expressive interface.
          </p>
          <div className="pt-4">
            <Link
              to="/signup"
              className="inline-block bg-white text-primary-600 px-12 py-5 rounded-2xl text-2xl font-black shadow-2xl shadow-black/10 hover:scale-105 active:scale-95 transition-all"
            >
              Launch My Wallet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
