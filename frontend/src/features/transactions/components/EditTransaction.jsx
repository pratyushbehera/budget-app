// EditTransaction.jsx

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal } from "../../../shared/components/Modal";
import { useToast } from "../../../contexts/ToastContext";
import { useEditTransaction } from "../../../services/transactionApi";
import { useGroup } from "../../../services/groupApi";

import { GroupSection } from "./GroupSection";
import { SplitSection } from "./SplitSection";
import { useSplitCalculation } from "../hooks/useSplitCalculation";
import { FormInput } from "../../../shared/components/FormInput";

const transactionSchema = yup.object().shape({
  date: yup.string().required("Date is required"),
  categoryId: yup.string().required("Category is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  notes: yup.string(),
});

export const EditTransaction = ({ transaction, onClose }) => {
  const { category: categoryList, loading: isCatLoading } = useSelector(
    (s) => s.category
  );
  const { groups = [] } = useSelector((s) => s.group || {});
  const { addToast } = useToast();
  const { mutateAsync: editTx, isPending } = useEditTransaction();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      date: "",
      category: "",
      categoryId: "",
      amount: "",
      notes: "",
      groupId: "",
      paidBy: "",
    },
  });

  const formValues = watch();

  // Flexible updater for custom components
  const updateFormField = (eOrObj) => {
    if (!eOrObj) return;

    if (eOrObj.target?.name) {
      const { name, value } = eOrObj.target;
      setValue(name, value);
    } else if (eOrObj.name) {
      setValue(eOrObj.name, eOrObj.value);
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

    reset({
      ...transaction,
      categoryId,
      groupId: transaction.groupId || "",
      paidBy: transaction.paidBy || transaction.userId,
    });
  }, [transaction, categoryList, reset]);

  const { data: selectedGroup } = useGroup(formValues?.groupId, {
    enabled: !!formValues?.groupId,
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
  } = useSplitCalculation(formValues?.amount, selectedGroup?.members);

  // Initialize split details when editing
  useEffect(() => {
    if (!selectedGroup || !formValues?.amount || !transaction?.splitDetails)
      return;

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
    const total = Number(formValues.amount);
    const equalAmt = total / initialized.length;

    const isEqual = initialized.every(
      (itm) => Math.abs(itm.amount - equalAmt) < 0.01
    );

    if (isEqual) return setSplitMode("equal");

    const percentSum = initialized.reduce((sum, s) => sum + s.percent, 0);
    if (Math.abs(percentSum - 100) < 1) return setSplitMode("percent");

    setSplitMode("exact");
  }, [selectedGroup, transaction, formValues?.amount, setSplitDetails, setSplitMode]);

  if (isCatLoading) return "Loading...";

  // -------------------------
  // Submit Handler
  // -------------------------
  const onSubmit = async (data) => {
    const updates = {
      date: data.date,
      categoryId: data.categoryId,
      category: categoryList.find((ct) => ct._id === data.categoryId)?.name,
      amount: Number(data.amount),
      notes: data.notes,
    };

    if (data.groupId) {
      if (!isSplitValid) {
        addToast({
          type: "error",
          title: "Invalid split",
          message: "Split values must total the transaction amount.",
        });
        return;
      }

      updates.groupId = data.groupId;
      updates.paidBy = data.paidBy;
      updates.splitDetails = splitDetails.map((s) => ({
        userId: s.userId,
        email: s.email,
        shareAmount: Number(s.amount),
      }));
    }

    try {
      await editTx(
        { id: transaction.id, updates },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              title: "Updated",
              message: "Transaction updated successfully.",
            });
            onClose();
          },
          onError: (err) =>
            addToast({
              type: "error",
              title: "Error updating",
              message: err?.message || "Something went wrong.",
            }),
        }
      );
    } catch (err) {
      addToast({
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
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* ---------------- Transaction Fields ---------------- */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Transaction Details
          </h3>

          <FormInput
            label="Date"
            id="edit-date"
            type="date"
            error={errors.date}
            {...register("date")}
          />

          <div className="space-y-2 mt-3">
            <label
              htmlFor="edit-category"
              className="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Category
            </label>
            <select
              id="edit-category"
              className={`input-field ${errors.categoryId ? "border-red-500" : ""
                }`}
              {...register("categoryId")}
            >
              <option value="">Select Category</option>
              {categoryList?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <FormInput
            label="Amount"
            id="edit-amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            error={errors.amount}
            {...register("amount")}
          />

          <div className="space-y-2 mt-3">
            <label
              htmlFor="edit-notes"
              className="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Notes
            </label>
            <textarea
              id="edit-notes"
              className="input-field resize-none"
              rows={3}
              placeholder="Optional"
              {...register("notes")}
            />
          </div>
        </div>

        {/* ---------------- Group Section ---------------- */}
        <GroupSection
          groups={groups}
          form={formValues}
          updateFormField={updateFormField}
          disabled={false}
        />

        {/* ---------------- Split Section ---------------- */}
        {formValues.groupId && selectedGroup && (
          <SplitSection
            splitMode={splitMode}
            setSplitMode={setSplitMode}
            splitDetails={splitDetails}
            updatePercent={updatePercent}
            updateExact={updateExact}
            isSplitValid={isSplitValid}
            totalSplit={totalSplit}
            amount={formValues.amount}
            selectedGroup={selectedGroup}
            paidBy={formValues.paidBy}
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
