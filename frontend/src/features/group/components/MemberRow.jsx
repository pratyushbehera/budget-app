import React from "react";
import { Shield, XCircle, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { useGravatar } from "../../../shared/hooks/useGravatar";

const MemberRow = ({ member, owner, isAdmin, onRemove, onLeave }) => {
  const user = useSelector((s) => s.auth.user);

  const userObj = member.userId;
  const email = member.email;
  const isYou = userObj?._id === user._id;

  const { avatarUrl } = useGravatar(email, {
    size: 100,
    defaultType: "retro",
    checkExistence: true,
  });

  const initials = (userObj?.firstName || email[0])
    .substring(0, 1)
    .toUpperCase();

  return (
    <div
      className="flex items-center justify-between rounded-xl px-4 py-3 
                 bg-gray-50 dark:bg-gray-850 hover:shadow-sm transition-all"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
            {initials}
          </div>
        )}

        <div>
          <p className="font-medium text-gray-500 dark:text-gray-800 flex items-center gap-2">
            {userObj?.firstName || email.split("@")[0]}
            {isYou && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md">
                You
              </span>
            )}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-800">{email}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {userObj?._id === owner && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Shield size={12} /> Admin
          </span>
        )}

        {member.status === "pending" && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md">
            Pending
          </span>
        )}

        {!isAdmin && isYou && (
          <button
            className="text-red-500 text-xs flex items-center gap-1 hover:underline"
            onClick={onLeave}
          >
            <LogOut size={14} /> Leave
          </button>
        )}

        {isAdmin && !isYou && (
          <button
            className="text-red-500 text-xs flex items-center gap-1 hover:underline"
            onClick={() => onRemove(userObj)}
          >
            <XCircle size={14} />
            {member.status === "pending" ? "Cancel Invite" : "Remove"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MemberRow;
