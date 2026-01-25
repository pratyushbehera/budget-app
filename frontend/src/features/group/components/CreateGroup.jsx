import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateGroup } from "../../../services/groupApi";
import { useToast } from "../../../contexts/ToastContext";
import { Modal } from "../../../shared/components/Modal";
import { FormInput } from "../../../shared/components/FormInput";

const groupSchema = yup.object().shape({
  name: yup.string().required("Group name is required"),
  description: yup.string(),
});

const CreateGroupModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(groupSchema),
  });

  const createGroup = useCreateGroup();
  const { addToast } = useToast();

  const onSubmit = (data) => {
    createGroup.mutate(
      { name: data.name, description: data.description, members: [] },
      {
        onSuccess: () => {
          addToast({
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
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Group Name"
          placeholder="E.g., Goa Trip, Office Lunch"
          error={errors.name}
          {...register("name")}
        />

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Description (optional)
          </label>
          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder="A short description..."
            {...register("description")}
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
