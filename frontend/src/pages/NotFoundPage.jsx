import { Link } from "react-router-dom";
import { NotFound } from "../assets/NotFound";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-6 overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center animate-slide-in-bottom">
        {/* Illustration */}
        <div className="flex items-center justify-center relative">
          <div className="absolute inset-0 bg-primary-500/5 rounded-full blur-3xl -z-10 scale-150"></div>
          <NotFound className="w-full h-auto max-w-sm drop-shadow-2xl" />
        </div>

        {/* Content */}
        <div className="text-center md:text-left space-y-8">
          <div className="space-y-2">
            <h1 className="text-[10rem] font-black text-primary-500 tracking-tighter leading-none select-none opacity-20 absolute -top-20 md:-top-32 left-0 pointer-events-none">
              404
            </h1>
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none relative z-10">
              Lost in <br /> Space?
            </h2>
          </div>
          <p className="text-2xl text-gray-400 dark:text-gray-500 font-medium tracking-tight leading-relaxed max-w-md">
            We can&apos;t find the page you&apos;re looking for. It might have
            been moved or doesn&apos;t exist anymore.
          </p>

          <div className="flex justify-center md:justify-start pt-4">
            <Link
              to="/dashboard"
              className="btn-primary px-10 py-5 text-xl font-black rounded-2xl shadow-2xl shadow-primary-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              Return Home
            </Link>
          </div>

          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 opacity-60">
            Error Code: AUTH_NOT_FOUND_EXCEPTION
          </p>
        </div>
      </div>
    </div>
  );
}
