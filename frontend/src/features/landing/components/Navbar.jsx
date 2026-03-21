import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-3xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-100 dark:border-gray-900 h-20 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto w-full px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
          <img src="/logo.png" className="w-10 h-10 group-hover:rotate-12 transition-transform" alt="FinPal" />
          <span className="font-black text-2xl dark:text-white tracking-widest uppercase">FinPal</span>
        </Link>
 
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 items-center mr-4">
             {["Features", "Team", "Security"].map(link => (
               <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-primary-500 transition-colors">{link}</a>
             ))}
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup" className="btn-primary px-8 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
