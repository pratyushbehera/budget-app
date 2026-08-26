import Button from "@/shared/system/Button";
import Input from "@/shared/system/FormField/Input";
import Select from "@/shared/system/FormField/Select";

import { IndianRupeeIcon, PercentIcon } from "lucide-react";

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
    <div className="mt-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-200">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Split Details
      </h3>

      <Select
        label="Paid By"
        placeholder="Paid By"
        value={paidBy}
        onChange={onPaidByChange}
        options={selectedGroup.members.map((member) => ({
          label: member.userId?.firstName || member.email,
          value: member.userId?._id,
        }))}
      />

      <div className="flex gap-2 mt-3">
        {["equal", "percent", "exact"].map((mode) => (
          <Button
            key={mode}
            onClick={() => setSplitMode(mode)}
            size="sm"
            variant={splitMode === mode ? "primary" : "secondary"}
            className="uppercase"
            aria-pressed={splitMode === mode}
          >
            {mode}
          </Button>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {splitMode === "percent" &&
          splitDetails.map((s, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-sm"
            >
              <span className=" dark:text-white">{s.email}</span>
              <div className="flex">
                <Input
                  id={`percent-${idx}`}
                  value={s.percent}
                  onChange={(e) => updatePercent(idx, e.target.value)}
                  min={0}
                  className="w-24"
                  rightIcon={<PercentIcon size="18" />}
                />
              </div>
            </div>
          ))}

        {splitMode === "exact" &&
          splitDetails.map((s, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-sm"
            >
              <span className=" dark:text-white">{s.email}</span>
              <div className="flex items-center gap-2">
                <Input
                  id={`exact-${idx}`}
                  value={s.amount}
                  onChange={(e) => updateExact(idx, e.target.value)}
                  min={0}
                  className="w-28"
                  leftIcon={<IndianRupeeIcon size="18" />}
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
