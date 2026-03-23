import { Plus } from "lucide-react";
import { AddTransaction } from "../../transactions/components/AddTransaction";
import { useState } from "react";

export const QuickAdd = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <>
      <div className="fixed bottom-8 right-8 z-20">
        <button
          className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in overflow-hidden"
          onClick={() => setShowAddModal(true)}
          aria-label="Quick Add Transaction"
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative">
            <Plus size={32} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
          </div>
        </button>
      </div>

      {showAddModal && (
        <AddTransaction onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
};
