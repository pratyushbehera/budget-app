import { useEffect, useState } from "react";
import { usePlan, useSavePlan } from "../services/planApi";
import { useToast } from "../contexts/ToastContext";
import { Edit, Plus, Save, X, Trash2, Wallet, CreditCard } from "lucide-react";
import { formatCurrency } from "../shared/utils/formatCurrency";
import { categoryIconMap } from "../shared/utils/categoryIconMap";
import { AddCategory } from "../features/plan/components/AddCategory";
import { DeleteCategory } from "../features/plan/components/DeleteCategory";
import { NoPlan } from "../features/plan/components/NoPlan";
import { LoadingPage } from "../shared/components/LoadingPage";
import { useSelector } from "react-redux";

export default function PlanPage() {
  const { category: categoryList } = useSelector((state) => state.category);
  const { addToast } = useToast();
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
      addToast({
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
            addToast({
              type: "success",
              title: "Success",
              message: "Plan saved successfully.",
            });
            setIsEditing(false);
          },
          onError: (err) => {
            addToast({
              type: "error",
              title: "Failure",
              message: err?.message || "Error adding transaction.",
            });
          },
        },
      );
    } catch (err) {
      addToast({
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
    <div className="min-h-screen max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 border-b border-gray-100 dark:border-gray-800 pb-8 sm:pb-0 sm:border-none">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
              Budget Plan
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-medium tracking-tight">
              Design your monthly financial strategy
            </p>
          </div>

          {!isEditing && Object.keys(planData).length > 0 && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center justify-center gap-3 group px-8 py-4 rounded-2xl shadow-xl shadow-primary-500/20"
            >
              <Edit
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              <span className="text-sm font-black uppercase tracking-widest">
                Edit My Plan
              </span>
            </button>
          )}
        </div>

        {/* --- No plan yet --- */}
        {!isEditing && Object.keys(planData).length === 0 && (
          <NoPlan setIsEditing={setIsEditing} />
        )}

        {/* --- Edit / Create Mode --- */}
        {isEditing && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Refine Your Strategy
              </h2>
              <button
                onClick={() => setShowAddCategory(true)}
                className="btn-secondary flex items-center justify-center gap-2 group h-12 px-6 rounded-xl"
              >
                <Plus
                  size={18}
                  strokeWidth={3}
                  className="group-hover:rotate-90 transition-transform"
                />
                <span className="text-sm font-black uppercase tracking-widest">
                  Add Category
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              {Object.entries(groupedCategories).map(([type, groups]) => (
                <div key={type} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary-500">
                      {type} Categories
                    </h2>
                    <div className="h-px flex-1 bg-primary-100 dark:bg-primary-900/30"></div>
                  </div>

                  {Object.entries(groups).map(([group, cats]) => (
                    <div
                      key={group}
                      className="card p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem]"
                    >
                      <h3 className="text-lg sm:text-xl font-black mb-6 text-gray-900 dark:text-white tracking-tight capitalize">
                        {group}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {cats.map((cat) => {
                          const Icon =
                            categoryIconMap[cat.name?.toLowerCase()] ||
                            categoryIconMap["other"];
                          return (
                            <div
                              key={cat._id}
                              className="group flex flex-col gap-4 bg-gray-50/50 dark:bg-gray-800/20 p-4 sm:p-5 rounded-2xl border border-transparent hover:border-gray-200 hover:bg-white dark:hover:bg-gray-950/90 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg shadow-current/10 transition-transform group-hover:scale-110
                                    ${
                            type === "Income"
                              ? "bg-emerald-500 text-white"
                              : group?.toLowerCase().includes("want")
                                ? "bg-orange-500 text-white"
                                : "bg-blue-500 text-white"
                            }`}
                                  >
                                    <Icon
                                      className="w-5 h-5"
                                      strokeWidth={2.5}
                                    />
                                  </div>
                                  <span className="font-black text-gray-900 dark:text-white tracking-tight truncate max-w-[120px] sm:max-w-none">
                                    {cat.name}
                                  </span>
                                </div>
                                <button
                                  onClick={() => setDeleteTarget(cat)}
                                  className="p-2 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base sm:text-lg">
                                  ₹
                                </span>
                                <input
                                  type="number"
                                  value={editableData[cat.name] || ""}
                                  onChange={(e) =>
                                    handleChange(cat.name, e.target.value)
                                  }
                                  placeholder="0"
                                  className="input-field pl-10 h-12 sm:h-14 text-base sm:text-lg font-black tracking-tighter"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Edit Mode Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  label: "Planned Income",
                  value: totalPlannedIncome,
                  color: "emerald",
                },
                {
                  label: "Planned Expenses",
                  value: totalPlannedExpense,
                  color: "rose",
                },
                {
                  label: "Estimated Savings",
                  value: plannedSavings,
                  color: plannedSavings < 0 ? "rose" : "primary",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`card p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border-b-8 border-${stat.color}-500 transition-transform hover:-translate-y-1`}
                >
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                    {stat.label}
                  </p>
                  <h3
                    className={
                      "text-2xl sm:text-4xl font-black tracking-tighter text-gray-900 dark:text-white"
                    }
                  >
                    {formatCurrency(stat.value)}
                  </h3>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-3 sm:gap-4 p-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditableData(planData || {});
                }}
                className="btn-secondary px-10 h-14 rounded-2xl group w-full sm:w-auto order-2 sm:order-1"
              >
                <X
                  size={20}
                  className="group-hover:rotate-90 transition-transform"
                />
                <span className="text-sm font-black uppercase tracking-widest">
                  Cancel
                </span>
              </button>
              <button
                onClick={handleSavePlan}
                disabled={isPending}
                className="btn-primary px-10 h-14 rounded-2xl shadow-2xl shadow-primary-500/30 group w-full sm:w-auto order-1 sm:order-2"
              >
                <Save
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-sm font-black uppercase tracking-widest">
                  {isPending ? "Saving..." : "Commit Plan"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* --- Plan Dashboard (View Mode) --- */}
        {!isEditing && Object.keys(planData).length > 0 && (
          <div className="space-y-12 animate-fade-in">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Monthly Income",
                  value: totalPlannedIncome,
                  color: "bg-emerald-500",
                  icon: Wallet,
                },
                {
                  label: "Budgeted Spend",
                  value: totalPlannedExpense,
                  color: "bg-rose-500",
                  icon: CreditCard,
                },
                {
                  label: "Projected Savings",
                  value: plannedSavings,
                  color: "bg-primary-500",
                  icon: Save,
                },
              ].map((stat, i) => (
                <div key={i} className="relative group perspective">
                  <div
                    className={`h-full p-8 rounded-[2.5rem] ${stat.color} text-white shadow-2xl shadow-current/20 overflow-hidden relative transition-all duration-500 group-hover:scale-[1.02]`}
                  >
                    <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                      <stat.icon size={160} strokeWidth={1} />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">
                      {stat.label}
                    </p>
                    <h3 className="text-4xl font-black tracking-tighter">
                      {formatCurrency(stat.value)}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Grouped View */}
            <div className="space-y-16">
              {Object.entries(
                categoryList?.reduce((acc, cat) => {
                  const groupName = cat.group || "Others";
                  if (!acc[groupName]) acc[groupName] = [];
                  acc[groupName].push(cat);
                  return acc;
                }, {}) || {},
              ).map(([group, cats]) => (
                <div key={group} className="space-y-8">
                  <div className="flex items-center gap-6">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter capitalize">
                      {group}
                    </h3>
                    <div className="h-1 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-1/4 bg-primary-500/20"></div>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                      {cats.length} Categories
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cats.map((cat) => {
                      const value = planData?.[cat.name] || 0;
                      const isIncome = cat.type === "Income";
                      const Icon =
                        categoryIconMap[cat.name?.toLowerCase()] ||
                        categoryIconMap["other"];

                      return (
                        <div
                          key={cat._id}
                          className="group relative bg-white dark:bg-gray-950/40 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-500"
                        >
                          <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                              <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6
                                ${
                        isIncome
                          ? "bg-emerald-500"
                          : "bg-gray-100 dark:bg-gray-800"
                        } text-white`}
                              >
                                <Icon
                                  size={28}
                                  className={
                                    isIncome ? "text-white" : "text-primary-500"
                                  }
                                  strokeWidth={2.5}
                                />
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                  {cat.type}
                                </p>
                                <p
                                  className={`text-2xl font-black tracking-tighter ${
                                    isIncome
                                      ? "text-emerald-500"
                                      : "text-gray-900 dark:text-white"
                                  }`}
                                >
                                  {formatCurrency(value)}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-lg font-black text-gray-900 dark:text-white tracking-tight mb-4 capitalize">
                                {cat.name}
                              </h4>
                              {!isIncome && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Allocation</span>
                                    <span>
                                      {Math.round(
                                        (value / totalPlannedExpense) * 100,
                                      )}
                                      %
                                    </span>
                                  </div>
                                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 shadow-sm"
                                      style={{
                                        width: `${Math.min(
                                          (value / totalPlannedExpense) * 100,
                                          100,
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
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
      </div>

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
