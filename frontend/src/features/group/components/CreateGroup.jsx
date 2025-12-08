import React, { useState } from "react";
import { useCreateGroup } from "../../../services/groupApi";
import { useNotification } from "../../../contexts/NotificationContext";
import { Modal } from "../../../shared/components/Modal";

const CreateGroupModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const createGroup = useCreateGroup();
  const { addNotification } = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      addNotification({
        type: "error",
        title: "Validation error",
        message: "Group name is required",
      });
      return;
    }

    createGroup.mutate(
      { name, description: desc, members: [] },
      {
        onSuccess: () => {
          addNotification({
            type: "success",
            title: "Success",
            message: "Group created successfully",
          });
          onClose();
        },
      }
    );
  };

  return (
    <Modal title="Create Group" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Group Name
          </label>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., Goa Trip, Office Lunch"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Description (optional)
          </label>
          <textarea
            className="input-field resize-none"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            placeholder="A short description..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGroupModal;
