import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { useAddTransaction } from "../../../services/transactionApi";
import { Modal } from "../../../shared/components/Modal";
import { useToast } from "../../../contexts/ToastContext";
import { uid } from "../../../shared/utils/generateUid";
import { useGroup } from "../../../services/groupApi";
import { useCreateRecurringRules } from "../../../services/recurringApi";
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

export const AddTransaction = ({ onClose, groupId: defaultGroupId }) => {
  const { user: currentUser } = useSelector((s) => s.auth);
  const { category: categoryList, loading: isCatLoading } = useSelector(
    (s) => s.category
  );
  const { groups = [], loading: isGroupLoading } = useSelector(
    (s) => s.group || {}
  );

  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: "",
      categoryId: "",
      amount: "",
      notes: "",
      groupId: defaultGroupId || "",
      paidBy: currentUser?._id || "",
    },
  });

  const formValues = watch();

  // Custom updater for complex components (GroupSection/SplitSection) calling updateFormField
  const updateFormField = (eOrObj) => {
    if (!eOrObj) return;
    if (eOrObj.target && eOrObj.target.name) {
      const { name, value } = eOrObj.target;
      setValue(name, value);
    } else if (typeof eOrObj === "object" && "name" in eOrObj) {
      setValue(eOrObj.name, eOrObj.value);
    }
  };

  const { data: selectedGroup } = useGroup(formValues.groupId, {
    enabled: !!formValues.groupId,
  });

  const {
    splitMode,
    setSplitMode,
    splitDetails,
    updatePercent,
    updateExact,
    totalSplit,
    isSplitValid,
  } = useSplitCalculation(formValues.amount, selectedGroup?.members || []);

  const { mutateAsync: addTx, isPending } = useAddTransaction();
  const { addToast } = useToast();
  const { mutateAsync: addRecurringRule } = useCreateRecurringRules();

  const onSubmit = async (data) => {
    // Custom validation for Group/Split
    if (data.groupId && !isSplitValid) {
      addToast({
        type: "error",
        title: "Split mismatch",
        message: "Split amounts do not add up to total.",
      });
      return;
    }

    const transaction = {
      id: uid(),
      date: data.date,
      category: categoryList.find((c) => c._id === data.categoryId)?.name,
      categoryId: data.categoryId,
      amount: Number(data.amount),
      notes: data.notes,
    };

    if (data.groupId) {
      transaction.groupId = data.groupId;
      transaction.paidBy = data.paidBy;
      transaction.splitDetails = splitDetails.map((s) => ({
        userId: s.userId,
        email: s.email,
        shareAmount: Number(s.amount),
      }));
    }

    if (isRecurring) {
      await addRecurringRule(
        {
          title: categoryList.find((c) => c._id === data.categoryId)?.name,
          type: categoryList
            .find((c) => c._id === data.categoryId)
            ?.type.toLowerCase(),
          amount: data.amount,
          category: categoryList.find((c) => c._id === data.categoryId)?.name,
          categoryId: data.categoryId,
          frequency,
          startDate: data.date,
          groupId: data.groupId || null,
        },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              title: "Recurring set",
              message:
                "Recurring transaction created. Please approve it from dashboard.",
            });

            onClose();
          },
          onError: () => {
            addToast({
              type: "error",
              title: "Error creating Recurring set",
              message: "Recurring transaction creation failed",
            });

            onClose();
          },
        }
      );

      return;
    }

    try {
      await addTx(
        { transaction },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              title: "Success",
              message: "Transaction added successfully.",
            });
            onClose();
          },
          onError: (err) =>
            addToast({
              type: "error",
              title: "Error",
              message: err?.message || "Failed to add transaction.",
            }),
        }
      );
    } catch (err) {
      addToast({
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
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Transaction Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Transaction Details
            </h3>

            <FormInput
              label="Date"
              id="transaction-date"
              type="date"
              error={errors.date}
              {...register("date")}
            />

            <div className="space-y-2 mt-3">
              <label
                htmlFor="categoryId"
                className="text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Category
              </label>
              <select
                id="categoryId"
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
              id="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              error={errors.amount}
              {...register("amount")}
            />

            <div className="space-y-2 mt-3">
              <label
                htmlFor="notes"
                className="text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Notes
              </label>
              <textarea
                id="notes"
                className="input-field resize-none"
                rows={3}
                placeholder="Optional"
                {...register("notes")}
              />
            </div>
          </div>

          {/* Group section (separate card) */}
          <GroupSection
            groups={groups}
            form={formValues}
            updateFormField={updateFormField}
            disabled={!!defaultGroupId}
          />

          {/* Split section (only when group exists) */}
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

          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              Make this recurring
            </label>
          </div>

          {isRecurring && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="input-field"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500">Starts on</label>
                <input
                  type="date"
                  value={formValues.date}
                  disabled
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
