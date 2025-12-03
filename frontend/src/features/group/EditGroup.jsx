import { useState, useEffect } from "react";
import { useNotification } from "../../contexts/NotificationContext";
import { Modal } from "../../shared/components/Modal";
import { useUpdateGroup } from "../../services/groupApi";

export const EditGroup = ({ group, onClose }) => {
  useEffect(() => {
    setForm({ ...group });
  }, [group]);
  const { mutateAsync: editGroup, isPending } = useUpdateGroup(group?._id);
  const { addNotification } = useNotification();

  const [form, setForm] = useState();

  const setFormValue = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const groupData = { ...form };
      if (!groupData.name || !groupData.description) {
        addNotification({
          type: "error",
          title: "Validation error",
          message: "Please fill required fields.",
        });
        return;
      }

      const group = {
        name: form.name,
        description: form.description,
      };

      await editGroup(
        { group },
        {
          onSuccess: () => {
            addNotification({
              type: "success",
              title: "Success",
              message: "Group updated successfully.",
            });
            onClose();
          },
          onError: (err) => {
            addNotification({
              type: "error",
              title: "Failure",
              message: err?.message || "Error updating group.",
            });
          },
        }
      );
    } catch (err) {
      addNotification({
        type: "error",
        title: "Failure",
        message: err.message || "Failed to update group.",
      });
      onClose();
    }
  };

  return (
    <Modal title="Edit Group" onClose={onClose}>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          id="group-name"
          name="name"
          value={form?.name}
          onChange={setFormValue}
          placeholder="Group name"
          className="input-field"
        />
        <textarea
          placeholder="Group description"
          name="description"
          value={form?.description}
          onChange={setFormValue}
          className="input-field"
        />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
};
