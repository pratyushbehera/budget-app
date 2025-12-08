import React from "react";
import { User, Shield, XCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { useRemoveMember, useLeaveGroup } from "../../services/groupApi";
import { useNotification } from "../../contexts/NotificationContext";

const GroupMembers = ({ members, owner, isAdmin, groupId }) => {
  const user = useSelector((s) => s.auth.user);
  const { addNotification } = useNotification();
  const { mutateAsync: removeMember } = useRemoveMember(groupId);
  const { mutateAsync: leaveGroup } = useLeaveGroup(groupId);

  const removeHandler = (member) => {
    removeMember(
      { memberId: member?._id },
      {
        onSuccess: () => {
          addNotification({
            type: "success",
            title: "Success",
            message: "Member removed successfully.",
          });
        },
        onError: (err) => {
          addNotification({
            type: "error",
            title: "Failure",
            message: err?.message || "Error deleting member.",
          });
        },
      }
    );
  };

  const leaveHandler = () => {
    leaveGroup(null, {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Success",
          message: "Member removed successfully.",
        });

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      },
      onError: (err) => {
        addNotification({
          type: "error",
          title: "Failure",
          message: err?.message || "Error deleting member.",
        });
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 border dark:border-gray-800">
      <h2 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
        Members
      </h2>

      <div className="space-y-3">
        {members.map((m) => {
          const userObj = m.userId;
          const isYou = userObj?._id === user._id;
          return (
            <div
              key={m.email}
              className="flex items-center justify-between rounded-lg px-3 py-3 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <User
                  size={22}
                  className="text-primary-600 dark:text-primary-400"
                />

                <div className="flex flex-col">
                  <p className="font-semibold text-gray-700 dark:text-gray-200">
                    {userObj?.firstName || m.email.split("@")[0]}
                    {isYou && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                        You
                      </span>
                    )}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {m.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                {userObj?._id === owner && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded flex items-center gap-1">
                    <Shield size={12} /> Admin
                  </span>
                )}

                {!isAdmin && isYou && (
                  <button
                    className="text-red-500 text-xs"
                    onClick={() => leaveHandler()}
                  >
                    Leave
                  </button>
                )}
                {m.status === "pending" && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                    Pending
                  </span>
                )}

                {isAdmin && !isYou && (
                  <button
                    className="text-red-500 text-xs flex items-center gap-1"
                    onClick={() => removeHandler(m.userId)}
                  >
                    <XCircle size={14} />{" "}
                    {m.status === "pending" ? "Cancel Invite" : "Remove"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupMembers;
