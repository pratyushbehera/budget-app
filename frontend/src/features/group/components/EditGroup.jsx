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
    <Modal title="Group Settings" onClose={onClose}>
      <form className="space-y-6 pt-4" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Display Name"
          placeholder="e.g. Vacation 2024"
          error={errors.name}
          {...register("name")}
        />

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
            About this Group
          </label>
          <textarea
            placeholder="What's this group for?"
            rows={4}
            className={`input-field min-h-[120px] resize-none ${errors.description ? "border-rose-500 bg-rose-50/10" : "bg-gray-50/50 dark:bg-gray-800/20"}`}
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs font-bold text-rose-500 px-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            type="button" 
            className="px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" 
            onClick={onClose}
          >
            Go Back
          </button>
          <button 
            type="submit" 
            className="btn-primary px-8" 
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
