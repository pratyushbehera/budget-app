import { Plus, Target } from "lucide-react";

export const NoPlan = ({ setIsEditing }) => (
  <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900/40 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800 text-center animate-fade-in group">
    <div className="w-24 h-24 bg-primary-500 rounded-4xl shadow-2xl shadow-primary-500/20 flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
      <Target className="w-12 h-12 text-white" strokeWidth={2.5} />
    </div>
    
    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter">
      No Financial Plan Yet
    </h3>
    
    <p className="text-gray-500 dark:text-gray-400 max-w-sm font-medium mb-10 leading-relaxed">
      You haven't defined your spending strategy for this period. 
      Let's set some goals and take control of your money!
    </p>

    <button
      onClick={() => setIsEditing(true)}
      className="btn-primary flex items-center gap-3 px-10 group/btn"
    >
      <Plus size={24} strokeWidth={3} className="transition-transform group-hover/btn:rotate-90" />
      <span className="text-lg">Create My First Plan</span>
    </button>
  </div>
);
