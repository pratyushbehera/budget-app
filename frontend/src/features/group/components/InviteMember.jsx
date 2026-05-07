import { useState } from "react";
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
      },
    );
  };

  return (
    <Modal title="Invite Member" onClose={onClose}>
      <div className="space-y-8 pt-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
            Email Recipient
          </label>
          <input
            type="email"
            className="input-field bg-gray-50/50 dark:bg-gray-800/20 text-lg py-4 placeholder:text-gray-300"
            placeholder="e.g. friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-[10px] font-medium text-gray-400 px-1">
            They&apos;ll receive an email to join your group.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            className="px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:white transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn-primary px-8"
            onClick={handleSubmit}
            disabled={invite.isPending}
          >
            {invite.isPending ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteMemberModal;
