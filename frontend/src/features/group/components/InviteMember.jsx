import { useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
import { useInviteMember } from "../../../services/groupApi";

import Button from "@/shared/system/Button";
import Modal from "@/shared/system/Modal";
import Input from "@/shared/system/FormField/Input";

const InviteMemberModal = ({ groupId, onClose }) => {
  const [email, setEmail] = useState("");
  const invite = useInviteMember(groupId);
  const { addToast } = useToast();

  const handleSubmit = () => {
    if (!email) {
      addToast({
        type: "error",
        title: "Email Required",
        message: "Please enter a valid email address.",
      });
      return;
    }

    invite.mutate(
      { email },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            title: "Invite Sent",
            message: `Invitation successfully sent to ${email}.`,
          });
          onClose();
        },
        onError: (err) => {
          addToast({
            type: "error",
            title: "Failed",
            message: err?.message || "Failed to send invitation.",
          });
        },
      }
    );
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header>Invite Member</Modal.Header>
      <Modal.Body>
        <Input
          label="Email Recipient"
          id="email"
          placeholder="johndoe@email.com"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          helperText="They'll receive an email to join your group."
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={handleSubmit}
          size="sm"
          isLoading={invite.isPending}
        >
          {invite.isPending ? "Sending..." : "Send Invite"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InviteMemberModal;
