import { useState } from "react";
import { Calendar, IndianRupee } from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";
import {
  useApproveRecurring,
  useSkipRecurring,
} from "../../../services/recurringApi";
import Button from "@/shared/system/Button";
import Input from "@/shared/system/FormField/Input";

export function PendingRecurringRow({ item }) {
  const [amount, setAmount] = useState(item.amount);
  const [date, setDate] = useState(item.dueDate);

  const { addToast } = useToast();
  const approveMutation = useApproveRecurring();
  const skipMutation = useSkipRecurring();

  const handleApprove = () => {
    approveMutation.mutate(
      {
        id: item._id,
        amount: amount ?? item.amount,
        date: date ?? item.dueDate,
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            title: "Recurring Approved",
            message: `${item.title || "Transaction"} has been added.`,
          });
        },
        onError: (err) => {
          addToast({
            type: "error",
            title: "Approval Failed",
            message:
              err?.response?.data?.message ||
              err.message ||
              "Something went wrong",
          });
        },
      }
    );
  };

  const handleSkip = () => {
    skipMutation.mutate(item._id, {
      onSuccess: () => {
        addToast({
          type: "warning",
          title: "Recurring Skipped",
          message: `${item.title || "Transaction"} was skipped.`,
        });
      },
      onError: (err) => {
        addToast({
          type: "error",
          title: "Skip Failed",
          message:
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong",
        });
      },
    });
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg">
      {/* Left: Title */}
      <div className="flex-1 min-w-[160px]">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {item.title || "Recurring transaction"}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Original: {item.dueDate}
        </p>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-1">
        <IndianRupee className="w-3 h-3 text-gray-500" />
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-24 h-8 text-sm"
        />
      </div>

      {/* Date */}
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="h-8 text-sm w-36"
      />

      {/* Actions */}
      <div className="flex gap-1">
        <Button
          onClick={handleApprove}
          isLoading={approveMutation.isPending}
          size="sm"
        >
          {approveMutation.isPending ? "Saving..." : "Approve"}
        </Button>

        <Button onClick={handleSkip} variant="secondary" size="sm">
          Skip
        </Button>
      </div>
    </div>
  );
}
