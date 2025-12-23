import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-gray-950/70 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" className="w-7 h-7" alt="FinPal" />
          <span className="font-bold text-xl dark:text-white">FinPal</span>
        </div>

        <div className="flex gap-4">
          <Link to="/login" className="btn-secondary px-4 py-2 rounded-lg">
            Login
          </Link>
          <Link to="/signup" className="btn-primary px-4 py-2 rounded-lg">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
