import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "../../../contexts/ToastContext";
import { Modal } from "../../../shared/components/Modal";
import { useUpdateGroup } from "../../../services/groupApi";
import { FormInput } from "../../../shared/components/FormInput";

const groupSchema = yup.object().shape({
  name: yup.string().required("Group name is required"),
  description: yup.string().required("Description is required"),
});

export const EditGroup = ({ group, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        description: group.description,
      });
    }
  }, [group, reset]);

  const { mutateAsync: editGroup, isPending } = useUpdateGroup(group?._id);
  const { addToast } = useToast();

  const onSubmit = async (data) => {
    try {
      await editGroup(
        { group: { name: data.name, description: data.description } },
        {
          onSuccess: () => {
            addToast({
              type: "success",
              title: "Success",
              message: "Group updated successfully.",
            });
            onClose();
          },
          onError: (err) => {
            addToast({
              type: "error",
              title: "Failure",
              message: err?.message || "Error updating group.",
            });
          },
        }
      );
    } catch (err) {
      addToast({
        type: "error",
        title: "Failure",
        message: err.message || "Failed to update group.",
      });
      onClose();
    }
  };

  return (
    <Modal title="Edit Group" onClose={onClose}>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Group Name"
          placeholder="Group name"
          error={errors.name}
          {...register("name")}
        />

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Description
          </label>
          <textarea
            placeholder="Group description"
            className={`input-field ${errors.description ? "border-red-500" : ""}`}
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

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
