import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "../../../contexts/ToastContext";
import { useEditTransaction } from "../../../services/transactionApi";
import { useGroup } from "../../../services/groupApi";

import { GroupSection } from "./GroupSection";
import { SplitSection } from "./SplitSection";
import { useSplitCalculation } from "../hooks/useSplitCalculation";
import Button from "@/shared/system/Button";
import Modal from "@/shared/system/Modal";
import Input from "@/shared/system/FormField/Input";
import Textarea from "@/shared/system/FormField/TextArea";
import Select from "@/shared/system/FormField/Select";
import Typography from "@/shared/system/Typography";

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
  }, [
    selectedGroup,
    transaction,
    formValues?.amount,
    setSplitDetails,
    setSplitMode,
  ]);

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
    <Modal onClose={onClose} size="2xl">
      <Modal.Header>Edit Transaction</Modal.Header>
      <form className="overflow-y-auto" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          {/* ---------------- Transaction Fields ---------------- */}
          <div>
            <Typography variant="h6" role="heading">
              Transaction Details
            </Typography>
            <div className="flex gap-4">
              <Input
                label="Date"
                id="edit-date"
                type="date"
                required
                error={errors?.date?.message}
                {...register("date")}
              />

              <Select
                label="Category"
                required
                placeholder="Select a category"
                options={categoryList.map((cat) => ({
                  label: cat.name,
                  value: cat._id,
                }))}
                error={errors?.categoryId?.message}
                {...register("categoryId")}
              />
            </div>
            <Input
              label="Amount"
              id="edit-amount"
              required
              placeholder="0.00"
              step="0.01"
              error={errors?.amount?.message}
              {...register("amount")}
            />

            <div className="space-y-2 mt-3">
              <Textarea
                label="Notes"
                id="edit-notes"
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
        </Modal.Body>
        {/* ---------------- Actions ---------------- */}

        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit" isLoading={isPending}>
            {isPending ? "Saving..." : "Update"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
