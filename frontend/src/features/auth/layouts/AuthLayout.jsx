import { Link } from "react-router-dom";

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-start border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur">
        <Link to="/" className="flex items-start gap-2">
          <img
            src="/logo.png"
            alt="FinPal"
            className="w-7 h-7 object-contain"
          />
          <span className="text-xl font-bold text-gray-950 dark:text-white">
            FinPal
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
