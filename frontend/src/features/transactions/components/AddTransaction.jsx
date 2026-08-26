import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { useAddTransaction } from "../../../services/transactionApi";
import { useToast } from "../../../contexts/ToastContext";
import { uid } from "../../../shared/utils/generateUid";
import { useGroup } from "../../../services/groupApi";
import { useCreateRecurringRules } from "../../../services/recurringApi";
import { GroupSection } from "./GroupSection";
import { SplitSection } from "./SplitSection";
import { useSplitCalculation } from "../hooks/useSplitCalculation";
import Button from "@/shared/system/Button";
import Modal from "@/shared/system/Modal";
import Input from "@/shared/system/FormField/Input";
import Textarea from "@/shared/system/FormField/TextArea";
import Checkbox from "@/shared/system/FormField/CheckBox";
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
    <Modal onClose={onClose} size="2xl">
      <Modal.Header>Add Transaction</Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
        <Modal.Body>
          {isCatLoading || isGroupLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {/* Transaction Details */}
              <div>
                <Typography variant="h6" role="heading">
                  Transaction Details
                </Typography>

                <div className="flex gap-4">
                  <Input
                    label="Date"
                    id="transaction-date"
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
                  id="amount"
                  required
                  placeholder="0.00"
                  step="0.01"
                  error={errors?.amount?.message}
                  {...register("amount")}
                />

                <div className="space-y-2 mt-3">
                  <Textarea
                    id="notes"
                    label="Notes"
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
                <Checkbox
                  label="Make this recurring"
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
              </div>

              {isRecurring && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Select
                    label="Frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="Choose a frequency"
                    options={[
                      { label: "Monthly", value: "monthly" },
                      { label: "Weekly", value: "weekly" },
                    ]}
                  />

                  <Input
                    label="Starts on"
                    id="starts"
                    required
                    value={formValues.date}
                  />
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" isLoading={isPending} type="submit">
            {isPending ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
