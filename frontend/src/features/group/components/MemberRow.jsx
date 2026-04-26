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
      className="flex items-center justify-between rounded-2xl p-4 
                 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 
                 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 group"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-12 h-12 rounded-2xl border-2 border-white dark:border-gray-700 shadow-sm object-cover transition-transform group-hover:scale-110"
          />
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-300 font-black text-lg shadow-sm group-hover:scale-110 transition-transform">
            {initials}
          </div>
        )}

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <p className="font-black text-gray-900 dark:text-white tracking-tight">
              {userObj?.firstName || email.split("@")[0]}
            </p>
            {isYou && (
              <span className="text-[10px] font-black uppercase tracking-widest bg-primary-50 text-primary-600 px-2 py-0.5 rounded-lg border border-primary-100">
                You
              </span>
            )}
          </div>

          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-tight">{email}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {userObj?._id === owner && (
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-emerald-100">
            <Shield size={12} strokeWidth={3} /> Admin
          </span>
        )}

        {member.status === "pending" && (
          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg border border-amber-100">
            Pending
          </span>
        )}

        {!isAdmin && isYou && (
          <button
            className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95"
            onClick={onLeave}
            title="Leave group"
          >
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        )}

        {isAdmin && !isYou && (
          <button
            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-rose-500 hover:text-white transition-all active:scale-95"
            onClick={() => onRemove(userObj)}
            title={member.status === "pending" ? "Cancel Invite" : "Remove member"}
          >
            <XCircle size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MemberRow;
