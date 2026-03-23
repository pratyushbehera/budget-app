import React from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChatWidget() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-28 right-8 z-50">
      <button
        onClick={() => navigate("/ai-chat")}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden"
        aria-label="Open AI Assistant"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative">
          <Sparkles size={28} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-300" />
        </div>

        <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-950 animate-pulse" />
      </button>
      
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl hidden md:block border border-gray-800">
        Chat with FinPal AI
      </div>
    </div>
  );
}
