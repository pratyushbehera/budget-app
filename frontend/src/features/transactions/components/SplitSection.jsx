import React from "react";

export function SplitSection({
  splitMode,
  setSplitMode,
  splitDetails = [],
  updatePercent,
  updateExact,
  isSplitValid,
  totalSplit,
  amount,
  selectedGroup,
  paidBy,
  onPaidByChange, // expects event or {name, value} wrapper
}) {
  if (!selectedGroup) return null;

  return (
    <div className="mt-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Split Details
      </h3>

      <label
        htmlFor="paidBy"
        className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2 block"
      >
        Paid By
      </label>
      <select
        id="paidBy"
        name="paidBy"
        className="input-field mt-1"
        value={paidBy}
        onChange={onPaidByChange}
      >
        {selectedGroup.members.map((m) => (
          <option key={m.email} value={m.userId?._id}>
            {m.userId?.firstName || m.email}
          </option>
        ))}
      </select>

      <div className="flex gap-2 mt-3">
        {["equal", "percent", "exact"].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setSplitMode(mode)}
            className={`px-2 py-1 rounded text-sm capitalize ${
              splitMode === mode
                ? "bg-primary-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            aria-pressed={splitMode === mode}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {splitMode === "percent" &&
          splitDetails.map((s, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-sm"
            >
              <span>{s.email}</span>
              <div className="flex items-center gap-1">
                <label htmlFor={`percent-${idx}`} className="sr-only">
                  Percent for {s.email}
                </label>
                <input
                  id={`percent-${idx}`}
                  type="text"
                  value={s.percent}
                  onChange={(e) => updatePercent(idx, e.target.value)}
                  className="w-20 p-1 rounded bg-gray-100 dark:bg-gray-700"
                  min={0}
                />
                <span className="text-xs">%</span>
              </div>
            </div>
          ))}

        {splitMode === "exact" &&
          splitDetails.map((s, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-sm"
            >
              <span>{s.email}</span>
              <div className="flex items-center gap-2">
                <label htmlFor={`exact-${idx}`} className="sr-only">
                  Amount for {s.email}
                </label>
                <input
                  id={`exact-${idx}`}
                  type="number"
                  value={s.amount}
                  onChange={(e) => updateExact(idx, e.target.value)}
                  className="w-24 p-1 rounded bg-gray-100 dark:bg-gray-700"
                  min={0}
                />
              </div>
            </div>
          ))}
      </div>

      {!isSplitValid && (
        <p className="text-xs text-red-500 mt-2">
          Split total ({totalSplit}) must equal transaction amount (
          {amount || 0})
        </p>
      )}
    </div>
  );
}
