import React, { useState } from "react";
import { usePlan, useSavePlan } from "../services/planApi";
import { useNotification } from "../contexts/NotificationContext";
import { useCategory } from "../services/categoryApi";

export function PlanPage() {
  const { data: categoryList } = useCategory();
  const { addNotification } = useNotification();
  const { data, isLoading } = usePlan();
  const { mutateAsync: savePlan, isPending } = useSavePlan();
  const [editableData, setEditableData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const planData = data && data["2025"]["10"];
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-300">
            Loading plan...
          </span>
        </div>
      </div>
    );
  }

  const handleChange = (category, value) => {
    setEditableData((prev) => ({
      ...prev,
      [category]: value ? parseFloat(value) : 0,
    }));
  };

  // 🔹 Save or update plan
  const handleSavePlan = async () => {
    try {
      await savePlan(
        { plan },
        {
          onSuccess: () => {
            addNotification({
              type: "success",
              title: "Success",
              message: "Plan saved successfully.",
            });
            onClose();
          },
          onError: (err) => {
            addNotification({
              type: "error",
              title: "Failure",
              message: err?.message || "Error adding transaction.",
            });
          },
        }
      );
    } catch (err) {
      addNotification({
        type: "error",
        title: "Failure",
        message: err?.message || "Error saving plan.",
      });
    }
  };

  if (!planData && !isEditing) {
    return (
      <div className="min-h-screen max-w-7xl flex items-start">
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            No Plan Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don’t have a plan yet. Let’s create your first one to start
            tracking your spending goals.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            ➕ Create Plan
          </button>
        </div>
      </div>
    );
  }

  if (isEditing || !planData) {
    const categories = categoryList.map((cat) => cat.name);

    return (
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mx-auto py-10 px-6">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ✏️ {planData ? "Edit Your Plan" : "Create Your First Plan"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Add your expected monthly income and expenses by category.
            </p>

            <table className="min-w-full text-sm text-gray-900 dark:text-gray-100 mb-6">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Planned ₹
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat}
                    className="border-b border-gray-200 dark:border-gray-600"
                  >
                    <td className="px-4 py-2 font-medium">{cat}</td>
                    <td className="px-4 py-2 text-right">
                      <input
                        type="number"
                        className="w-32 px-2 py-1 text-right border rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                        value={editableData[cat] || ""}
                        onChange={(e) => handleChange(cat, e.target.value)}
                        placeholder="0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditableData(planData || {});
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                disabled={isPending}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {isPending ? "Saving..." : "💾 Save Plan"}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="card p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your Plan Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          You can edit your plan anytime to match your goals.
        </p>
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          ✏️ Edit Plan
        </button>
      </div>

      <div className="card overflow-hidden border rounded-xl shadow-sm">
        <table className="min-w-full text-sm text-gray-900 dark:text-gray-400">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Category</th>
              <th className="px-4 py-3 text-right font-semibold">Planned ₹</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(planData).map(([cat, val]) => (
              <tr
                key={cat}
                className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2 font-medium">{cat}</td>
                <td className="px-4 py-2 text-right">
                  ₹{val.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
