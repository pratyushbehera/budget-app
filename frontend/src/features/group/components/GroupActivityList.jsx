import React from "react";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { useGroupActivity } from "../../../services/groupApi";

const GroupActivityList = ({ groupId }) => {
  const { data: activities, isLoading } = useGroupActivity(groupId);
  const currentUser = useSelector((s) => s.auth.user);

  if (isLoading)
    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-900/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 animate-pulse">
        <p className="text-center text-gray-400 font-black uppercase tracking-widest text-xs">
          Loading activity feed...
        </p>
      </div>
    );

  const getActorName = (a) =>
    a.actorId?._id === currentUser._id
      ? "You"
      : a.actorId?.firstName || a.actorId?.email;

  const getTypeBadge = (type) => {
    switch (type) {
      case "invite":
        return {
          label: "Invite",
          cls: "bg-blue-50 text-blue-600 border-blue-100",
        };
      case "transaction":
      case "transaction_deleted":
      case "transaction_edited":
        return {
          label: "Money",
          cls: "bg-emerald-50 text-emerald-600 border-emerald-100",
        };
      case "removed":
        return {
          label: "System",
          cls: "bg-rose-50 text-rose-600 border-rose-100",
        };
      case "left":
        return {
          label: "Exit",
          cls: "bg-orange-50 text-orange-600 border-orange-100",
        };
      case "settle":
        return {
          label: "Settlement",
          cls: "bg-purple-50 text-purple-600 border-purple-100",
        };
      default:
        return {
          label: "Update",
          cls: "bg-gray-100 text-gray-600 border-gray-200",
        };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950/40 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 animate-fade-in">
      <div className="flex items-center gap-4 p-8">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
          Timeline
        </h2>
        <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Activity
        </span>
      </div>

      {!activities.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            <Bell size={32} className="text-gray-300" />
          </div>
          <p className="text-lg font-black text-gray-400 tracking-tight">
            Quiet so far
          </p>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
            Updates will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {activities.map((act) => {
            const actor = getActorName(act);
            const { label, cls } = getTypeBadge(act.type);

            let text = "";
            if (act.type === "invite")
              text = `${actor} invited ${act.data.email}`;
            if (act.type === "transaction")
              text = `${actor} added a transaction of ₹${act.data.amount}`;
            if (act.type === "removed") text = `${actor} removed a member`;
            if (act.type === "left") text = `${actor} left the group`;
            if (act.type === "settle")
              text = `${actor} settled ₹${act.data.amount}`;
            if (act.type === "transaction_deleted")
              text = `${actor} deleted a transaction of ₹${act.data.amount}`;
            if (act.type === "transaction_edited")
              text = `${actor} edited a transaction`;

            return (
              <div
                key={act._id}
                className="group flex flex-col gap-3 p-5 rounded-[2rem] bg-gray-50/50 dark:bg-gray-950/40 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all duration-300 lg:mx-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 transition-transform group-hover:rotate-6">
                      <Bell
                        size={24}
                        className="text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${cls}`}
                      >
                        {label}
                      </span>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2">
                        {new Date(act.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-tight px-1">
                  {text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupActivityList;
