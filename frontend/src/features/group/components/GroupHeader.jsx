import React, { useState } from "react";
import { Edit, Trash2, LogOut, UserPlus, Plus } from "lucide-react";
import { EditGroup } from "./EditGroup";
import { useDeleteGroup, useLeaveGroup } from "../../../services/groupApi";
import InviteMemberModal from "./InviteMember";
import { AddTransaction } from "../../transactions/components/AddTransaction";

const GroupHeader = ({ group, isAdmin }) => {
  const [editGroup, setEditGroup] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const deleteGroup = useDeleteGroup(group._id);
  const leaveGroup = useLeaveGroup(group._id);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in">
      <div className="space-y-3">
        <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none capitalize">
          {group.name}
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium tracking-tight">
          {group.description || "Shared budget and expenses"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {isAdmin && (
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/40 p-1.5 rounded-2xl">
            <button
              className="p-3 rounded-xl text-gray-500 hover:text-primary-500 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50"
              onClick={() => setInviteModal(true)}
              title="Invite member"
            >
              <UserPlus size={20} strokeWidth={2.5} />
            </button>
            <button
              className="p-3 rounded-xl text-gray-500 hover:text-primary-500 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50"
              onClick={() => setEditGroup(true)}
              title="Edit group"
            >
              <Edit size={20} strokeWidth={2.5} />
            </button>
            <button
              className="p-3 rounded-xl text-gray-500 hover:text-rose-500 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50"
              onClick={() => deleteGroup.mutate()}
              title="Delete group"
            >
              <Trash2 size={20} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {!isAdmin && (
          <button
            className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
            onClick={() => leaveGroup.mutate()}
            title="Leave group"
          >
            <LogOut size={22} strokeWidth={2.5} />
          </button>
        )}

        <button
          className="btn-primary flex items-center gap-3 group px-8"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
          <span className="text-lg">Add Transaction</span>
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
        <AddTransaction
          onClose={() => setShowAddModal(false)}
          groupId={group._id}
        />
      )}
    </div>
  );
};

export default GroupHeader;
