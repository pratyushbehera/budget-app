import React, { useState } from "react";
import { Modal } from "../../../shared/components/Modal";
import { useToast } from "../../../contexts/ToastContext";
import { useInviteMember } from "../../../services/groupApi";

const InviteMemberModal = ({ groupId, onClose }) => {
  const [email, setEmail] = useState("");
  const invite = useInviteMember(groupId);
  const { addToast } = useToast();

  const handleSubmit = () => {
    if (!email) {
      addToast({
        type: "error",
        title: "Email required",
        message: "Please enter an email address",
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
            message: "Member has been invited",
          });
          onClose();
        },
        onError: (err) => {
          addToast({
            type: "error",
            title: "Failed",
            message: err?.message || "Failed to send invite",
          });
        },
      }
    );
  };

  return (
    <Modal title="Invite Member" onClose={onClose}>
      <div className="space-y-4">
        <input
          type="email"
          className="input-field"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Send Invite
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteMemberModal;
