import React, { useState } from "react";
import { Edit, Trash2, LogOut, UserPlus, Plus } from "lucide-react";
import { EditGroup } from "./EditGroup";
import { useDeleteGroup, useLeaveGroup } from "../../services/groupApi";
import { useSelector } from "react-redux";
import InviteMemberModal from "./InviteMember";
import { AddTransaction } from "../transactions/components/AddTransaction";

const GroupHeader = ({ group, isAdmin }) => {
  const [editGroup, setEditGroup] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const deleteGroup = useDeleteGroup(group._id);
  const leaveGroup = useLeaveGroup(group._id);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {group.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {group.description}
        </p>
      </div>

      <div className="flex gap-3 items-center">
        {isAdmin && (
          <>
            <button
              className="btn-secondary"
              onClick={() => setInviteModal(true)}
            >
              <UserPlus size={18} />
            </button>
            <button
              className="btn-secondary"
              onClick={() => setEditGroup(true)}
              title="Edit group"
            >
              <Edit size={18} />
            </button>

            <button
              className="btn-secondary text-red-500"
              onClick={() => deleteGroup.mutate()}
              title="Delete group"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}

        {!isAdmin && (
          <button
            className="btn-secondary text-red-500"
            onClick={() => leaveGroup.mutate()}
          >
            <LogOut size={18} />
          </button>
        )}

        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          {" "}
          <Plus size={18} /> Add Transaction
        </button>
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
        <AddTransaction onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default GroupHeader;
