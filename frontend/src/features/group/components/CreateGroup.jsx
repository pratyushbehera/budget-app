import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateGroup } from "../../../services/groupApi";
import { useToast } from "../../../contexts/ToastContext";
import Button from "@/shared/system/Button";
import Modal from "@/shared/system/Modal";
import Input from "@/shared/system/FormField/Input";
import Textarea from "@/shared/system/FormField/TextArea";

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
      { name: data.groupName, description: data.description, members: [] },
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
  console.log("xxx", errors);
  return (
    <Modal onClose={onClose}>
      <Modal.Header>Create Group</Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Input
            label="Group Name"
            required
            placeholder="E.g., Goa Trip, Office Lunch"
            error={errors?.name?.message}
            {...register("groupName")}
          />

          <Textarea
            label="Description (optional)"
            rows={3}
            placeholder="A short description..."
            {...register("description")}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" size="sm">
            Create
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CreateGroupModal;
