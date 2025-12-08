// EditTransaction.jsx

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "../../../shared/components/Modal";
import { useNotification } from "../../../contexts/NotificationContext";
import { useEditTransaction } from "../../../services/transactionApi";
import { useGroup } from "../../../services/groupApi";

import { GroupSection } from "./GroupSection";
import { SplitSection } from "./SplitSection";
import { useSplitCalculation } from "../hooks/useSplitCalculation";

export const EditTransaction = ({ transaction, onClose }) => {
  const { category: categoryList, loading: isCatLoading } = useSelector(
    (s) => s.category
  );
  const { groups = [] } = useSelector((s) => s.group || {});
  const { addNotification } = useNotification();
  const { mutateAsync: editTx, isPending } = useEditTransaction();

  const [form, setForm] = useState(null);

  // flexible updater — supports event or {name, value}
  const updateFormField = (eOrObj) => {
    if (!eOrObj) return;

    if (eOrObj.target?.name) {
      const { name, value } = eOrObj.target;
      setForm((f) => ({ ...f, [name]: value }));
    } else if (eOrObj.name) {
      setForm((f) => ({ ...f, [eOrObj.name]: eOrObj.value }));
    }
  };

  // Load initial form
  useEffect(() => {
    if (!transaction || !categoryList) return;

    let categoryId = transaction.categoryId;
    if (!categoryId) {
      categoryId = categoryList.find(
        (ct) => ct.name === transaction.category
      )?._id;
    }

    setForm({
      ...transaction,
      categoryId,
      groupId: transaction.groupId || "",
      paidBy: transaction.paidBy || transaction.userId,
    });
  }, [transaction, categoryList]);

  const { data: selectedGroup } = useGroup(form?.groupId, {
    enabled: !!form?.groupId,
  });

  // Split calculation hook
  const {
    splitMode,
    setSplitMode,
    splitDetails,
    updatePercent,
    updateExact,
    totalSplit,
    isSplitValid,
    setSplitDetails,
  } = useSplitCalculation(form?.amount, selectedGroup?.members);

  // Initialize split details when editing
  useEffect(() => {
    if (!selectedGroup || !form?.amount || !transaction?.splitDetails) return;

    const initialized = selectedGroup.members.map((m) => {
      const existing = transaction.splitDetails.find(
        (s) => s.userId === m.userId?._id || s.email === m.email
      );

      return {
        userId: m.userId?._id || null,
        email: m.email,
        percent: 0,
        amount: existing?.shareAmount || 0,
      };
    });

    setSplitDetails(initialized);

    // Detect mode
    const total = Number(form.amount);
    const equalAmt = total / initialized.length;

    const isEqual = initialized.every(
      (itm) => Math.abs(itm.amount - equalAmt) < 0.01
    );

    if (isEqual) return setSplitMode("equal");

    const percentSum = initialized.reduce((sum, s) => sum + s.percent, 0);
    if (Math.abs(percentSum - 100) < 1) return setSplitMode("percent");

    setSplitMode("exact");
  }, [selectedGroup, transaction, form?.amount]);

  if (isCatLoading || !form) return "Loading...";

  // -------------------------
  // Submit Handler
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.categoryId) {
      addNotification({
        type: "error",
        title: "Validation error",
        message: "Category & Amount are required.",
      });
      return;
    }

    const updates = {
      date: form.date,
      categoryId: form.categoryId,
      category: categoryList.find((ct) => ct._id === form.categoryId)?.name,
      amount: Number(form.amount),
      notes: form.notes,
    };

    if (form.groupId) {
      if (!isSplitValid) {
        addNotification({
          type: "error",
          title: "Invalid split",
          message: "Split values must total the transaction amount.",
        });
        return;
      }

      updates.groupId = form.groupId;
      updates.paidBy = form.paidBy;
      updates.splitDetails = splitDetails.map((s) => ({
        userId: s.userId,
        email: s.email,
        shareAmount: Number(s.amount),
      }));
    }

    try {
      await editTx(
        { id: form.id, updates },
        {
          onSuccess: () => {
            addNotification({
              type: "success",
              title: "Updated",
              message: "Transaction updated successfully.",
            });
            onClose();
          },
          onError: (err) =>
            addNotification({
              type: "error",
              title: "Error updating",
              message: err?.message || "Something went wrong.",
            }),
        }
      );
    } catch (err) {
      addNotification({
        type: "error",
        title: "Failure",
        message: err?.message || "Failed to update transaction.",
      });
    }
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <Modal title="Edit Transaction" onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* ---------------- Transaction Fields ---------------- */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Transaction Details
          </h3>

          {/* Date */}
          <div className="space-y-2">
            <label
              htmlFor="edit-date"
              className="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Date
            </label>
            <input
              id="edit-date"
              name="date"
              type="date"
              className="input-field"
              value={form.date}
              onChange={updateFormField}
            />
          </div>

          {/* Category */}
          <div className="space-y-2 mt-3">
            <label
              htmlFor="edit-category"
              className="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Category
            </label>
            <select
              id="edit-category"
              name="categoryId"
              className="input-field"
              value={form.categoryId}
              onChange={updateFormField}
            >
              <option value="">Select Category</option>
              {categoryList?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-2 mt-3">
            <label
              htmlFor="edit-amount"
              className="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Amount
            </label>
            <input
              id="edit-amount"
              type="number"
              name="amount"
              className="input-field"
              value={form.amount}
              onChange={updateFormField}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2 mt-3">
            <label
              htmlFor="edit-notes"
              className="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Notes
            </label>
            <textarea
              id="edit-notes"
              name="notes"
              className="input-field resize-none"
              rows={3}
              value={form.notes}
              onChange={updateFormField}
              placeholder="Optional"
            />
          </div>
        </div>

        {/* ---------------- Group Section ---------------- */}
        <GroupSection
          groups={groups}
          form={form}
          updateFormField={updateFormField}
          disabled={false} // editing allows changing group
        />

        {/* ---------------- Split Section ---------------- */}
        {form.groupId && selectedGroup && (
          <SplitSection
            splitMode={splitMode}
            setSplitMode={setSplitMode}
            splitDetails={splitDetails}
            updatePercent={updatePercent}
            updateExact={updateExact}
            isSplitValid={isSplitValid}
            totalSplit={totalSplit}
            amount={form.amount}
            selectedGroup={selectedGroup}
            paidBy={form.paidBy}
            onPaidByChange={updateFormField}
          />
        )}

        {/* ---------------- Actions ---------------- */}
        <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
