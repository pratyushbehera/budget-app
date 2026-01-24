import React from "react";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { useGroupActivity } from "../../../services/groupApi";

const GroupActivityList = ({ groupId }) => {
  const { data: activities, isLoading } = useGroupActivity(groupId);
  const currentUser = useSelector((s) => s.auth.user);

  if (isLoading)
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border dark:border-gray-800">
        <p className="text-gray-600 dark:text-gray-400 italic">
          Loading activity...
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
        return { label: "Invite", cls: "bg-blue-100 text-blue-700" };
      case "transaction":
      case "transaction_deleted":
      case "transaction_edited":
        return { label: "Transaction", cls: "bg-emerald-100 text-emerald-700" };
      case "removed":
        return { label: "Removed", cls: "bg-red-100 text-red-700" };
      case "left":
        return { label: "Left Group", cls: "bg-orange-100 text-orange-700" };
      case "settle":
        return { label: "Settlement", cls: "bg-purple-100 text-purple-700" };
      default:
        return { label: "Activity", cls: "bg-gray-200 text-gray-600" };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl shadow p-6 border dark:border-gray-800">
      <h2 className="font-semibold text-md text-gray-800 dark:text-white mb-5">
        Activity
      </h2>

      {!activities.length && (
        <p className="text-gray-500 dark:text-gray-600">No activity yet.</p>
      )}

      <div className="space-y-4 max-h-[30vh] overflow-scroll">
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
              className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 
                          hover:shadow-md transition-all"
            >
              {/* Gradient Icon Tile */}
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 
                              flex items-center justify-center shadow-sm"
              >
                <Bell size={20} className="text-white" />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-medium ${cls}`}
                  >
                    {label}
                  </span>
                </div>

                <p className="text-sm text-gray-800 dark:text-gray-600">
                  {text}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(act.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupActivityList;
