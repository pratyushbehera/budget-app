import React from "react";
import { useSelector } from "react-redux";
import { useRemoveMember, useLeaveGroup } from "../../../services/groupApi";
import { useToast } from "../../../contexts/ToastContext";
import MemberRow from "./MemberRow";

const GroupMembers = ({ members, owner, isAdmin, groupId }) => {
  const user = useSelector((s) => s.auth.user);
  const { addToast } = useToast();
  const { mutateAsync: removeMember } = useRemoveMember(groupId);
  const { mutateAsync: leaveGroup } = useLeaveGroup(groupId);

  const removeHandler = (member) => {
    removeMember(
      { memberId: member?._id },
      {
        onSuccess: () =>
          addToast({
            type: "success",
            title: "Success",
            message: "Member removed successfully.",
          }),
      }
    );
  };

  const leaveHandler = () => {
    leaveGroup(null, {
      onSuccess: () => {
        addToast({
          type: "success",
          title: "Success",
          message: "You left the group.",
        });
        setTimeout(() => (window.location.href = "/dashboard"), 500);
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-950/40 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none p-8 border border-gray-100 dark:border-gray-800 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
          Group Members
        </h2>
        <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {members.length} Total
        </span>
      </div>

      <div className="space-y-4">
        {members.map((m) => (
          <MemberRow
            key={m.email}
            member={m}
            owner={owner}
            isAdmin={isAdmin}
            onRemove={removeHandler}
            onLeave={leaveHandler}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupMembers;
