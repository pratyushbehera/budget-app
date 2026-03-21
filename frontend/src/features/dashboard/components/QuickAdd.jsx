import { Plus } from "lucide-react";
import { AddTransaction } from "../../transactions/components/AddTransaction";
import { useState } from "react";

export const QuickAdd = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <>
      <button
        className="fixed btn-primary bottom-10 right-10 flex items-center justify-center w-16 h-16 rounded-[2rem] shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 animate-fade-in group"
        onClick={() => setShowAddModal(true)}
        aria-label="Quick Add Transaction"
      >
        <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {showAddModal && (
        <AddTransaction onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
};
