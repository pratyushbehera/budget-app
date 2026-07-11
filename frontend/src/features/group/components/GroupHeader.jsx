import { useState } from "react";
import { Edit, Trash2, LogOut, UserPlus, Plus } from "lucide-react";
import { EditGroup } from "./EditGroup";
import { useDeleteGroup, useLeaveGroup } from "../../../services/groupApi";
import InviteMemberModal from "./InviteMember";
import { AddTransaction } from "../../transactions/components/AddTransaction";

import Button from "@/shared/system/Button";
import PageHeading from "../../../shared/components/PageHeading";

const GroupHeader = ({ group, isAdmin }) => {
  const [editGroup, setEditGroup] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const deleteGroup = useDeleteGroup(group._id);
  const leaveGroup = useLeaveGroup(group._id);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in">
      <PageHeading
        title={group.name}
        subtitle={group.description || "Shared budget and expenses"}
      />

      <div className="flex flex-wrap gap-3 items-center">
        {isAdmin && (
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-transparent border dark:border-gray-800/40 p-1.5 rounded-2xl">
            <Button
              size="icon-sm"
              variant="ghost"
              className="hover:text-primary-500"
              title="Invite member"
              onClick={() => setInviteModal(true)}
            >
              <UserPlus size={20} strokeWidth={2.5} />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="hover:text-primary-500"
              onClick={() => setEditGroup(true)}
              title="Edit group"
            >
              <Edit size={20} strokeWidth={2.5} />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="hover:text-rose-500"
              onClick={() => deleteGroup.mutate()}
              title="Delete group"
            >
              <Trash2 size={20} strokeWidth={2.5} />
            </Button>
            {!isAdmin && (
              <Button
                size="icon-sm"
                variant="tertiary"
                onClick={() => leaveGroup.mutate()}
                title="Leave group"
              >
                <LogOut size={22} strokeWidth={2} />
              </Button>
            )}
          </div>
        )}

        <Button
          size="md"
          variant="primary"
          className="btn-primary flex items-center gap-3 group px-8"
          onClick={() => setShowAddModal(true)}
        >
          <Plus
            size={24}
            strokeWidth={3}
            className="group-hover:rotate-90 transition-transform"
          />
          <span className="text-lg">Add Transaction</span>
        </Button>
      </div>

      {editGroup && (
        <EditGroup group={group} onClose={() => setEditGroup(false)} />
      )}

      {inviteModal && (
        <InviteMemberModal
          groupId={group._id}
          onClose={() => setInviteModal(false)}
        />
      )}

      {showAddModal && (
        <AddTransaction
          onClose={() => setShowAddModal(false)}
          groupId={group._id}
        />
      )}
    </div>
  );
};

export default GroupHeader;
