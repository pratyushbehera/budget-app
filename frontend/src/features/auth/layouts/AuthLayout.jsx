import { Link } from "react-router-dom";

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen relative flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Decorative Background Patterns */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-secondary-500/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 h-24 px-8 flex items-center justify-between border-b border-gray-100/50 dark:border-gray-800/50 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-primary-500 shadow-lg shadow-primary-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <img
              src="/logo.png"
              alt="FinPal"
              className="w-6 h-6 object-contain brightness-0 invert"
            />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
            FinPal
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-10">
          {/* Title Section */}
          <div className="text-center space-y-3 animate-fade-in">
            <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-[1.1]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-gray-400 dark:text-gray-500 font-medium tracking-tight">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Container */}
          <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-10 animate-slide-in">
            {children}
          </div>

          {/* Footer Section */}
          {footer && (
            <div className="text-center pt-2 animate-fade-in opacity-80">
              <div className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex flex-col gap-2">
                {footer}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
