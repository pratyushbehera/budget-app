import { Plus } from "lucide-react";

export const NoPlan = ({ setIsEditing }) => (
  <div className="card p-8 text-center">
    <p className="text-gray-600 dark:text-gray-300 mb-6">
      You don’t have a plan yet. Let’s create your first one to start tracking
      your spending goals.
    </p>
    <button
      onClick={() => setIsEditing(true)}
      className="btn-primary flex gap-2 mx-auto items-center"
    >
      <Plus size={18} /> Create Plan
    </button>
  </div>
);
