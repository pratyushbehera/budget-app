import React from "react";
import { User } from "lucide-react";

const GroupMembers = ({ members }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 border dark:border-gray-800">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
        Members
      </h2>

      <div className="space-y-2">
        {members.map((m) => {
          const user = m.userId;

          return (
            <div
              key={m.email}
              className="flex items-center justify-between rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center gap-2">
                <User
                  size={18}
                  className="text-primary-600 dark:text-primary-400"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">
                    {user?.firstName || m.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {m.email}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  m.status === "accepted"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {m.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupMembers;
