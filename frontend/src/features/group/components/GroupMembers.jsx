import React from "react";
import { useSelector } from "react-redux";
import { useRemoveMember, useLeaveGroup } from "../../../services/groupApi";
import { useNotification } from "../../../contexts/NotificationContext";
import MemberRow from "./MemberRow";

const GroupMembers = ({ members, owner, isAdmin, groupId }) => {
  const user = useSelector((s) => s.auth.user);
  const { addNotification } = useNotification();
  const { mutateAsync: removeMember } = useRemoveMember(groupId);
  const { mutateAsync: leaveGroup } = useLeaveGroup(groupId);

  const removeHandler = (member) => {
    removeMember(
      { memberId: member?._id },
      {
        onSuccess: () =>
          addNotification({
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
        addNotification({
          type: "success",
          title: "Success",
          message: "You left the group.",
        });
        setTimeout(() => (window.location.href = "/dashboard"), 500);
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl shadow p-6 border dark:border-gray-800">
      <h2 className="font-semibold mb-4 text-md text-gray-800 dark:text-white">
        Members
      </h2>

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
