import { Plus } from "lucide-react";
import { AddTransaction } from "../../transactions/components/AddTransaction";
import { useState } from "react";
import Button from "@/shared/system/Button";

export const QuickAdd = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <>
      <div className="fixed bottom-8 right-8 z-20">
        <Button size="icon-md" onClick={() => setShowAddModal(true)}>
          <Plus
            size={32}
            strokeWidth={1.5}
            className="hover:rotate-90 transition-transform duration-300"
          />
        </Button>
      </div>

      {showAddModal && (
        <AddTransaction onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
};
