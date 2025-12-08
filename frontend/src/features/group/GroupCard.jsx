import React from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { gradientPalette } from "../../shared/constants/constants";

const gradientKeys = Object.keys(gradientPalette);

const GroupCard = ({ group, isAdmin }) => {
  const gradient =
    gradientPalette[gradientKeys[group.name.length % gradientKeys.length]];

  return (
    <Link to={`/groups/${group._id}`} className="block cursor-pointer">
      <div
        className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-md bg-gradient-to-r ${gradient}`}
      >
        <Users
          className="absolute -right-3 -bottom-3 w-20 h-20 opacity-15 text-white"
          strokeWidth={1.5}
        />

        <h3 className="text-lg font-semibold">{group.name}</h3>

        {group.description && (
          <p className="text-sm mt-1 opacity-90">{group.description}</p>
        )}

        <div className="mt-3 text-xs opacity-80">
          {isAdmin ? "You manage this group" : "Member"}
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
