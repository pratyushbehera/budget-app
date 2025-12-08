import { useEffect, useState } from "react";
import { useAddTransaction } from "../../../services/transactionApi";
import { Modal } from "../../../shared/components/Modal";
import { useNotification } from "../../../contexts/NotificationContext";
import { uid } from "../../../shared/utils/generateUid";
import { useSelector } from "react-redux";
import { useGroup } from "../../../services/groupApi";

export const AddTransaction = ({ onClose }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const {
    category: categoryList,
    loading: isLoading,
    error,
  } = useSelector((state) => state.category);
  const { groups, loading: isGroupLoading } = useSelector(
    (state) => state.group
  );

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
    amount: "0",
    notes: "",
    groupId: "",
    paidBy: currentUser?._id,
    splitDetails: [],
  });

  const { mutateAsync: addTx, isPending } = useAddTransaction();
  const { data: selectedGroup } = useGroup(form.groupId, {
    enabled: !!form.groupId,
  });

  const [splitMode, setSplitMode] = useState("equal");
  const [splitDetails, setSplitDetails] = useState([]);

  const { addNotification } = useNotification();

  const setFormValue = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const transactionData = { ...form };
      if (
        !transactionData.amount ||
        !transactionData.categoryId ||
        !transactionData.notes
      ) {
        addNotification({
          type: "error",
          title: "Validation error",
          message: "Please fill category, amount, notes.",
        });
        return;
      }

      const transaction = {
        id: uid(),
        date: form.date,
        category: categoryList?.find((ct) => ct._id === form.categoryId)?.name,
        categoryId: form.categoryId,
        amount: form.amount,
        notes: form.notes,
      };

      if (form.groupId && !isSplitValid) {
        addNotification({
          type: "error",
          title: "Invalid Split",
          message: "Split amounts do not add up to total.",
        });
        return;
      }

      if (form.groupId) {
        transaction.groupId = form.groupId;
        transaction.paidBy = form.paidBy;
        transaction.splitDetails = splitDetails.map((s) => ({
          userId: s.userId,
          email: s.email,
          shareAmount: Number(s.amount),
        }));
      }

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
          onError: (err) => {
            addNotification({
              type: "error",
              title: "Failure",
              message: err?.message || "Error adding transaction.",
            });
          },
        }
      );
    } catch (err) {
      addNotification({
        type: "error",
        title: "Failure",
        message: err.message || "Failed to add transaction.",
      });
      onClose();
    }
  };

  useEffect(() => {
    if (error) {
      addNotification({
        type: "error",
        title: "Something went wrong",
        message: "Please try again after sometime.",
      });
      onClose();
    }
  }, [error]);

  useEffect(() => {
    if (selectedGroup) {
      const initial = selectedGroup.members.map((m) => ({
        userId: m.userId?._id || null,
        email: m.email,
        percent: 0,
        amount: 0,
      }));
      setSplitDetails(initial);
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (splitMode === "equal" && form.amount) {
      const n = splitDetails.length;
      const equalShare = (Number(form.amount) / n).toFixed(2);

      setSplitDetails((prev) =>
        prev.map((s) => ({ ...s, amount: equalShare }))
      );
    }
  }, [splitMode, form.amount]);

  const totalSplit = splitDetails.reduce(
    (sum, s) => sum + Number(s.amount || 0),
    0
  );

  const isSplitValid = Math.abs(totalSplit - Number(form.amount)) < 0.01;

  return (
    <Modal title="Add Transaction" onClose={onClose}>
      {isLoading && isGroupLoading ? (
        "Loading..."
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Section heading */}
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Transaction Details
          </h3>

          {/* Date */}
          <div className="space-y-1.5">
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
              onChange={setFormValue}
              className="input-field focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
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
              onChange={setFormValue}
              className="input-field focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select category</option>
              {categoryList?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label
              htmlFor="amount"
              className="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Amount
            </label>
            <input
              id="amount"
              type="number"
              name="amount"
              value={form.amount}
              onChange={setFormValue}
              className="input-field focus:ring-2 focus:ring-primary-500"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="group"
              className="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Group
            </label>
            <select
              id="group"
              name="groupId"
              value={form.groupId}
              onChange={setFormValue}
              className="input-field"
            >
              <option value="">No Group</option>
              {groups.map((g) => (
                <option key={g._id || g.id} value={g._id || g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            {form.groupId && selectedGroup && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2">
                <h3 className="font-medium text-gray-700 dark:text-gray-200">
                  Split Details
                </h3>
                <select
                  name="paidBy"
                  className="input-field"
                  value={form.paidBy}
                  onChange={setFormValue}
                >
                  {selectedGroup.members.map((m) => (
                    <option value={m.userId?._id} key={m.email}>
                      {m.userId?.firstName || m.email}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    className={`px-2 py-1 rounded text-sm ${
                      splitMode === "equal"
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                    onClick={() => setSplitMode("equal")}
                  >
                    Equal
                  </button>

                  <button
                    type="button"
                    className={`px-2 py-1 rounded text-sm ${
                      splitMode === "percent"
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                    onClick={() => setSplitMode("percent")}
                  >
                    %
                  </button>

                  <button
                    type="button"
                    className={`px-2 py-1 rounded text-sm ${
                      splitMode === "exact"
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                    onClick={() => setSplitMode("exact")}
                  >
                    Exact
                  </button>
                </div>

                {splitMode === "percent" &&
                  splitDetails.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{s.email}</span>
                      <span>
                        <input
                          type="number"
                          value={s.percent}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSplitDetails((cur) =>
                              cur.map((x, i) =>
                                i === idx
                                  ? {
                                      ...x,
                                      percent: val,
                                      amount: (
                                        (val / 100) *
                                        form.amount
                                      ).toFixed(2),
                                    }
                                  : x
                              )
                            );
                          }}
                          className="w-20 p-1 rounded bg-gray-100 dark:bg-gray-700"
                        />
                        %
                      </span>
                    </div>
                  ))}
                {splitMode === "exact" &&
                  splitDetails.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{s.email}</span>
                      <input
                        type="number"
                        value={s.amount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSplitDetails((cur) =>
                            cur.map((x, i) =>
                              i === idx ? { ...x, amount: val } : x
                            )
                          );
                        }}
                        className="w-24 p-1 rounded bg-gray-100 dark:bg-gray-700"
                      />
                    </div>
                  ))}

                {!isSplitValid && (
                  <div className="text-xs text-red-500 mt-1">
                    Split total must equal the transaction amount (Current:{" "}
                    {totalSplit})
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Notes */}
          <div className="space-y-1.5">
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
              onChange={setFormValue}
              className="input-field resize-none focus:ring-2 focus:ring-primary-500"
              placeholder="Optional"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800 mt-6">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
