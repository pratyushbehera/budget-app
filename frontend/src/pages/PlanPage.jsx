import React, { useEffect, useState } from "react";
import { usePlan, useSavePlan } from "../services/planApi";
import { useNotification } from "../contexts/NotificationContext";
import { Edit, Plus, Save, X, Trash2 } from "lucide-react";
import { formatCurrency } from "../shared/utils/formatCurrency";
import { categoryIconMap } from "../shared/utils/categoryIconMap";
import { AddCategory } from "../features/plan/components/AddCategory";
import { DeleteCategory } from "../features/plan/components/DeleteCategory";
import { NoPlan } from "../features/plan/components/NoPlan";
import { LoadingPage } from "../shared/components/LoadingPage";
import { useSelector } from "react-redux";

export function PlanPage() {
  const { category: categoryList } = useSelector((state) => state.category);
  const { addNotification } = useNotification();
  const { data: planData, isLoading } = usePlan();
  const { mutateAsync: savePlan, isPending } = useSavePlan();

  const [editableData, setEditableData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setEditableData(planData || {});
  }, [planData]);

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
        message: "Please add at least one category.",
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

  if (isLoading) {
    return <LoadingPage page="plan" />;
  }

  // 🧭 Dynamically group categories by "type" and "group"
  const groupedCategories =
    categoryList?.reduce((acc, cat) => {
      const typeName = cat.type || "Others";
      if (!acc[typeName]) acc[typeName] = {};
      const groupName = cat.group || "General";
      if (!acc[typeName][groupName]) acc[typeName][groupName] = [];
      acc[typeName][groupName].push(cat);
      return acc;
    }, {}) || {};

  // 🧮 Compute dynamic totals
  const totalPlannedIncome = categoryList
    ?.filter((cat) => cat.type === "Income")
    .reduce((sum, cat) => sum + (editableData?.[cat.name] || 0), 0);

  const totalPlannedExpense = categoryList
    ?.filter((cat) => cat.type === "Expense")
    .reduce((sum, cat) => sum + (editableData?.[cat.name] || 0), 0);

  const plannedSavings = (totalPlannedIncome || 0) - (totalPlannedExpense || 0);

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-6 px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Financial Plan
        </h1>
        {!isEditing && Object.keys(planData).length > 0 && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit size={16} /> Edit Plan
          </button>
        )}
      </div>

      {/* --- No plan yet --- */}
      {!isEditing && Object.keys(planData).length === 0 && (
        <NoPlan setIsEditing={setIsEditing} />
      )}

      {/* --- Edit / Create Mode --- */}
      {isEditing && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Your Plan
            </h2>
            <button
              onClick={() => setShowAddCategory(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} /> Add Category
            </button>
          </div>
          <div className="space-y-6">
            {/* Loop over all types (Income / Expense) */}
            {Object.entries(groupedCategories).map(([type, groups]) => (
              <div key={type} className="card p-6">
                {/* Loop over groups under each type */}
                {Object.entries(groups).map(([group, cats]) => (
                  <div key={group} className="mb-5">
                    <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      {group}
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cats.map((cat) => {
                        const Icon =
                          categoryIconMap[cat.name?.toLowerCase()] ||
                          categoryIconMap["other"];

                        return (
                          <div
                            key={cat._id}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition"
                          >
                            {/* Left side: icon + label */}
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-full ${
                                  type === "Income"
                                    ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300"
                                    : group?.toLowerCase().includes("want")
                                    ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300"
                                    : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {cat.name}
                              </span>
                            </div>

                            {/* Right side: input */}
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={editableData[cat.name] || ""}
                                onChange={(e) =>
                                  handleChange(cat.name, e.target.value)
                                }
                                placeholder="0"
                                className="input-field w-28 text-right"
                              />
                              <button
                                onClick={() => setDeleteTarget(cat)}
                                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                title="Delete Category"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* --- Summary Card --- */}
            <div className="card p-6 grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-500 text-sm">Planned Income</p>
                <h3 className="text-xl font-semibold text-green-600">
                  {formatCurrency(totalPlannedIncome)}
                </h3>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Planned Expenses</p>
                <h3 className="text-xl font-semibold text-red-500">
                  {formatCurrency(totalPlannedExpense)}
                </h3>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Estimated Savings</p>
                <h3
                  className={`text-xl font-semibold ${
                    plannedSavings < 0 ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  {formatCurrency(plannedSavings)}
                </h3>
              </div>
            </div>

            {/* --- Buttons --- */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditableData(planData || {});
                }}
                className="btn-secondary flex items-center gap-2"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSavePlan}
                disabled={isPending}
                className="btn-primary flex items-center gap-2"
              >
                <Save size={16} />
                {isPending ? "Saving..." : "Save Plan"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- Plan Dashboard --- */}
      {!isEditing && Object.keys(planData).length > 0 && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <p className="text-gray-500 text-sm">Total Planned Income</p>
              <h3 className="text-xl font-semibold text-green-600">
                {formatCurrency(totalPlannedIncome)}
              </h3>
            </div>
            <div className="card p-4 text-center">
              <p className="text-gray-500 text-sm">Total Planned Expense</p>
              <h3 className="text-xl font-semibold text-red-500">
                {formatCurrency(totalPlannedExpense)}
              </h3>
            </div>
            <div className="card p-4 text-center">
              <p className="text-gray-500 text-sm">Expected Savings</p>
              <h3
                className={`text-xl font-semibold ${
                  plannedSavings < 0 ? "text-red-600" : "text-blue-600"
                }`}
              >
                {formatCurrency(plannedSavings)}
              </h3>
            </div>
          </div>

          {/* Dynamic Grouped Plan View */}
          <div className="space-y-8">
            {Object.entries(
              categoryList?.reduce((acc, cat) => {
                const groupName = cat.group || "Others";
                if (!acc[groupName]) acc[groupName] = [];
                acc[groupName].push(cat);
                return acc;
              }, {}) || {}
            ).map(([group, cats]) => (
              <div key={group}>
                {/* Group Title */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {group}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {cats[0]?.type}
                  </span>
                </div>

                {/* Categories Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cats.map((cat) => {
                    const value = planData?.[cat.name] || 0;
                    const isIncome = cat.type === "Income";

                    return (
                      <div
                        key={cat._id}
                        className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-br 
    from-gray-50 to-white dark:from-gray-50 dark:to-gray-950 shadow-sm hover:shadow-md 
    border border-gray-200 dark:border-gray-700 transition`}
                      >
                        {/* Left Section - Icon + Category name */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              isIncome
                                ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300"
                                : cat.group?.toLowerCase().includes("want")
                                ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300"
                                : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
                            }`}
                          >
                            {(() => {
                              const Icon =
                                categoryIconMap[cat.name?.toLowerCase()] ||
                                categoryIconMap["other"];
                              return <Icon className="w-5 h-5" />;
                            })()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-900 capitalize">
                              {cat.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {cat.group}
                            </p>
                          </div>
                        </div>

                        {/* Right Section - Amount */}
                        <div className="text-right">
                          <p
                            className={`text-lg font-semibold ${
                              isIncome
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-900 dark:text-gray-900"
                            }`}
                          >
                            ₹{value.toLocaleString()}
                          </p>
                          {!isIncome && (
                            <div className="mt-1 w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  cat.group?.toLowerCase().includes("want")
                                    ? "bg-orange-500"
                                    : "bg-blue-500"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    (value / totalPlannedIncome) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddCategory && (
        <AddCategory onClose={() => setShowAddCategory(false)} />
      )}

      {deleteTarget && (
        <DeleteCategory
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
