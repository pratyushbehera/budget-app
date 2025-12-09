import React from "react";
import { useGravatar } from "../hooks/useGravatar";

export const AvatarBubble = ({ email, name }) => {
  const { avatarUrl } = useGravatar(email, {
    size: 80,
    checkExistence: true,
  });

  const initials = (name || email || "?").substring(0, 1).toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow">
      {avatarUrl ? (
        <img src={avatarUrl} className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-800 dark:text-gray-300 font-semibold">
          {initials}
        </span>
      )}
    </div>
  );
};
