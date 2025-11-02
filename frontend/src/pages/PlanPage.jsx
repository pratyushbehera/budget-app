import React, { useEffect, useState } from "react";
import { usePlan, useSavePlan } from "../services/planApi";
import { useNotification } from "../contexts/NotificationContext";
import { useCategory } from "../services/categoryApi";
import { Edit, Plus } from "lucide-react";

export function PlanPage() {
  const { data: categoryList } = useCategory();
  const { addNotification } = useNotification();
  const { data: planData, isLoading } = usePlan();
  const { mutateAsync: savePlan, isPending } = useSavePlan();
  const [editableData, setEditableData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const categories = categoryList?.map((cat) => cat.name);
  const handleChange = (category, value) => {
    setEditableData((prev) => ({
      ...prev,
      [category]: value ? parseFloat(value) : 0,
    }));
  };

  const handleSavePlan = async () => {
    const plan = editableData;
    if (Object.keys(plan).length === 0) {
      addNotification({
        type: "error",
        title: "Validation failed",
        message: "Please add atleast one category.",
      });
      return;
    }
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
            setIsEditing(false);
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

  useEffect(() => {
    setEditableData(planData);
  }, [planData]);

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

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-6 px-6 lg:px-8">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Plans
        </h1>
        {!isEditing && Object.keys(planData).length === 0 && (
          <div className="card p-8">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You don’t have a plan yet. Let’s create your first one to start
              tracking your spending goals.
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex gap-2 items-center"
            >
              <Plus /> Create Plan
            </button>
          </div>
        )}
        {isEditing && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {Object.keys(planData).length !== 0
                ? "Edit Your Plan"
                : "Create Your First Plan"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Add your expected monthly income and expenses by category.
            </p>

            <table className="min-w-full text-sm text-gray-900 dark:text-gray-900 mb-6">
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
                        className="input-field w-32"
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
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                disabled={isPending}
                className="btn-primary"
              >
                {isPending ? "Saving..." : "Save Plan"}
              </button>
            </div>
          </div>
        )}
        {!isEditing && Object.keys(planData).length > 0 && (
          <div>
            <div className="card p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Plan Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You can edit your plan anytime to match your goals.
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary mt-2 flex gap-2"
              >
                <Edit />
                Edit Plan
              </button>
            </div>

            <div className="card overflow-hidden border rounded-xl shadow-sm">
              <table className="min-w-full text-sm text-gray-900 dark:text-gray-400">
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
        )}
      </div>
    </div>
  );
}
