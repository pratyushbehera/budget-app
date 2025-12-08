import React, { useState } from "react";
import { useAddTransaction } from "../../../services/transactionApi";
import { Modal } from "../../../shared/components/Modal";
import { useNotification } from "../../../contexts/NotificationContext";
import { uid } from "../../../shared/utils/generateUid";
import { useSelector } from "react-redux";
import { useGroup } from "../../../services/groupApi";

import { GroupSection } from "./GroupSection";
import { SplitSection } from "./SplitSection";
import { useSplitCalculation } from "../hooks/useSplitCalculation";

export const AddTransaction = ({ onClose, groupId: defaultGroupId }) => {
  const { user: currentUser } = useSelector((s) => s.auth);
  const { category: categoryList, loading: isCatLoading } = useSelector(
    (s) => s.category
  );
  const { groups = [], loading: isGroupLoading } = useSelector(
    (s) => s.group || {}
  );

  // flexible form updater - accepts event or { name, value } object
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    categoryId: "",
    amount: "",
    notes: "",
    groupId: defaultGroupId || "",
    paidBy: currentUser?._id || "",
  });

  const updateFormField = (eOrObj) => {
    if (!eOrObj) return;
    if (eOrObj.target && eOrObj.target.name) {
      const { name, value } = eOrObj.target;
      setForm((f) => ({ ...f, [name]: value }));
    } else if (typeof eOrObj === "object" && "name" in eOrObj) {
      setForm((f) => ({ ...f, [eOrObj.name]: eOrObj.value }));
    }
  };

  const { data: selectedGroup } = useGroup(form.groupId, {
    enabled: !!form.groupId,
  });

  const {
    splitMode,
    setSplitMode,
    splitDetails,
    updatePercent,
    updateExact,
    totalSplit,
    isSplitValid,
  } = useSplitCalculation(form.amount, selectedGroup?.members || []);

  const { mutateAsync: addTx, isPending } = useAddTransaction();
  const { addNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.categoryId) {
      addNotification({
        type: "error",
        title: "Validation error",
        message: "Please fill category and amount.",
      });
      return;
    }

    if (form.groupId && !isSplitValid) {
      addNotification({
        type: "error",
        title: "Split mismatch",
        message: "Split amounts do not add up to total.",
      });
      return;
    }

    const transaction = {
      id: uid(),
      date: form.date,
      category: categoryList.find((c) => c._id === form.categoryId)?.name,
      categoryId: form.categoryId,
      amount: Number(form.amount),
      notes: form.notes,
    };

    if (form.groupId) {
      transaction.groupId = form.groupId;
      transaction.paidBy = form.paidBy;
      transaction.splitDetails = splitDetails.map((s) => ({
        userId: s.userId,
        email: s.email,
        shareAmount: Number(s.amount),
      }));
    }

    try {
      await addTx(
        { transaction },
        {
          onSuccess: () => {
            addNotification({
              type: "success",
              title: "Success",
              message: "Transaction added successfully.",
            });
            onClose();
          },
          onError: (err) =>
            addNotification({
              type: "error",
              title: "Error",
              message: err?.message || "Failed to add transaction.",
            }),
        }
      );
    } catch (err) {
      addNotification({
        type: "error",
        title: "Error",
        message: err?.message || "Failed to add transaction.",
      });
    }
  };

  return (
    <Modal title="Add Transaction" onClose={onClose}>
      {isCatLoading || isGroupLoading ? (
        <div>Loading...</div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Transaction Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Transaction Details
            </h3>

            <div className="space-y-2">
              <label
                htmlFor="transaction-date"
                className="text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Date
              </label>
              <input
                id="transaction-date"
                name="date"
                type="date"
                value={form.date}
                onChange={updateFormField}
                className="input-field"
              />
            </div>

            <div className="space-y-2 mt-3">
              <label
                htmlFor="categoryId"
                className="text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={updateFormField}
                className="input-field"
              >
                <option value="">Select Category</option>
                {categoryList?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 mt-3">
              <label
                htmlFor="amount"
                className="text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                value={form.amount}
                onChange={updateFormField}
                className="input-field"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2 mt-3">
              <label
                htmlFor="notes"
                className="text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={updateFormField}
                className="input-field resize-none"
                rows={3}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Group section (separate card) */}
          <GroupSection
            groups={groups}
            form={form}
            updateFormField={updateFormField}
            disabled={!!defaultGroupId}
          />

          {/* Split section (only when group exists) */}
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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
