import React from "react";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { useGroupActivity } from "../../services/groupApi";

const GroupActivityList = ({ groupId }) => {
  const { data: activities, isLoading } = useGroupActivity(groupId);
  const currentUser = useSelector((s) => s.auth.user);

  if (isLoading) return <div>Loading activity...</div>;

  const getActorName = (a) =>
    a.actorId?._id === currentUser._id
      ? "You"
      : a.actorId?.firstName || a.actorId?.email;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border dark:border-gray-800">
      <h2 className="font-semibold mb-3">Activity</h2>

      <div className="space-y-3">
        {!activities.length && (
          <div className="text-gray-500">No activity yet.</div>
        )}
        {activities.map((act) => {
          const actor = getActorName(act);

          let text = "";
          if (act.type === "invite")
            text = `${actor} invited ${act.data.email}`;
          if (act.type === "transaction")
            text = `${actor} added a transaction of ₹${act.data.amount}`;
          if (act.type === "removed") text = `${actor} removed a member`;
          if (act.type === "left") text = `${actor} left the group`;
          if (act.type === "settle")
            text = `${actor} settled ₹${act.data.amount}`;

          return (
            <div
              key={act._id}
              className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <Bell
                className="text-primary-600 dark:text-primary-400"
                size={18}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {text}
                </p>
                <p className="text-xs text-gray-400">
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
