import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "../../../contexts/ToastContext";
import { useUpdateGroup } from "../../../services/groupApi";
import Button from "@/shared/system/Button";
import Modal from "@/shared/system/Modal";
import Input from "@/shared/system/FormField/Input";
import Textarea from "@/shared/system/FormField/TextArea";

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
    <Modal onClose={onClose}>
      <Modal.Header>Group Settings</Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Input
            label="Group Name"
            required
            placeholder="e.g. Vacation 2024"
            error={errors?.name?.message}
            {...register("name")}
          />

          <div className="space-y-2">
            <Textarea
              label="About this Group"
              placeholder="What's this group for?"
              required
              rows={4}
              error={errors?.description?.message}
              {...register("description")}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            size="sm"
            isLoading={isPending}
          >
            {isPending ? "Updating..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
