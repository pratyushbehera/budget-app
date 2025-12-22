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

  // equal auto-calculation
  useEffect(() => {
    if (splitMode === "equal" && splitDetails.length > 0) {
      const n = splitDetails.length;
      const equal = n > 0 ? (Number(amount || 0) / n).toFixed(2) : "0.00";
      setSplitDetails((prev) => prev.map((s) => ({ ...s, amount: equal })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splitMode, amount, splitDetails.length]);

  const updatePercent = (idx, percent) => {
    const val = Number(percent || 0);
    setSplitDetails((cur) =>
      cur.map((s, i) =>
        i === idx
          ? {
              ...s,
              percent: val,
              amount: ((val / 100) * Number(amount || 0)).toFixed(2),
            }
          : s
      )
    );
  };

  const updateExact = (idx, amt) => {
    const val = Number(amt || 0);
    setSplitDetails((cur) =>
      cur.map((s, i) => (i === idx ? { ...s, amount: val } : s))
    );
  };

  const totalSplit = splitDetails.reduce(
    (sum, s) => sum + Number(s.amount || 0),
    0
  );
  const isSplitValid = Math.abs(totalSplit - Number(amount || 0)) < 0.01;

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
