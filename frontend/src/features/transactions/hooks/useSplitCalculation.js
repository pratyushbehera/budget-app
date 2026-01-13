import { useEffect, useState } from "react";

/**
 * useSplitCalculation(amount, groupMembers)
 * - amount: number or numeric string
 * - groupMembers: array of members (each having userId?._id and email)
 */
export function useSplitCalculation(amount, groupMembers) {
  const [splitMode, setSplitMode] = useState("equal");
  const [splitDetails, setSplitDetails] = useState([]);

  // initialize when members change
  useEffect(() => {
    if (Array.isArray(groupMembers) && groupMembers.length > 0) {
      setSplitDetails(
        groupMembers.map((m) => ({
          userId: m.userId?._id || null,
          email: m.email,
          percent: 0,
          amount: 0,
        }))
      );
    }
  }, [groupMembers]);

  useEffect(() => {
    if (splitMode !== "equal" || splitDetails.length === 0) return;

    const n = splitDetails.length;
    const total = Number(amount || 0);
    const equalAmount = n ? +(total / n).toFixed(2) : 0;
    const equalPercent = n ? +(100 / n).toFixed(2) : 0;

    setSplitDetails((prev) =>
      prev.map((s) => ({
        ...s,
        amount: equalAmount,
        percent: equalPercent,
      }))
    );
  }, [splitMode, amount, splitDetails.length]);

  useEffect(() => {
    if (!splitDetails.length) return;

    if (splitMode === "percent") {
      setSplitDetails((prev) =>
        prev.map((s) => ({
          ...s,
          percent: 0, // ✅ reset
          amount: 0,
        }))
      );
    }

    if (splitMode === "exact") {
      setSplitDetails((prev) =>
        prev.map((s) => ({
          ...s,
          amount: 0, // ✅ reset
          percent: 0,
        }))
      );
    }
  }, [splitMode]);

  const updatePercent = (idx, percent) => {
    const val = Number(percent || 0);
    const total = Number(amount || 0);

    setSplitDetails((prev) =>
      prev.map((s, i) => {
        const p = i === idx ? val : Number(s.percent || 0);
        return {
          ...s,
          percent: p,
          amount: +((p / 100) * total).toFixed(2),
        };
      })
    );
  };

  const updateExact = (idx, amt) => {
    const val = Number(amt || 0);
    setSplitDetails((cur) =>
      cur.map((s, i) => (i === idx ? { ...s, amount: val } : s))
    );
  };

  const totalSplit =
    splitMode === "percent"
      ? splitDetails.reduce((s, d) => s + Number(d.percent || 0), 0)
      : splitDetails.reduce((s, d) => s + Number(d.amount || 0), 0);

  const isSplitValid =
    splitMode === "percent"
      ? Math.abs(totalSplit - 100) < 0.01
      : Math.abs(totalSplit - Number(amount || 0)) < 0.01;

  return {
    splitMode,
    setSplitMode,
    splitDetails,
    updatePercent,
    updateExact,
    totalSplit,
    isSplitValid,
    setSplitDetails,
  };
}
