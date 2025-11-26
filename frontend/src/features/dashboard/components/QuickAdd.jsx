import { Plus } from "lucide-react";
import { AddTransaction } from "../../transactions/components/AddTransaction";
import { useState } from "react";

export const QuickAdd = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <>
      <button
        className="fixed btn-primary bottom-8 right-8 flex items-center gap-2 font-semibold px-4 py-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        onClick={() => setShowAddModal(true)}
      >
        <Plus size={20} />
      </button>

      {showAddModal && (
        <AddTransaction onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
};
