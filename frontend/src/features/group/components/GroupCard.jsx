import React from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { gradientPalette } from "../../../shared/constants/constants";

const gradientKeys = Object.keys(gradientPalette);

const GroupCard = ({ group, isAdmin }) => {
  const gradient =
    gradientPalette[gradientKeys[group.name.length % gradientKeys.length]];

  return (
    <Link to={`/groups/${group._id}`} className="block group cursor-pointer perspective">
      <div
        className={`relative h-48 overflow-hidden rounded-[2.5rem] p-8 text-white shadow-xl shadow-current/10 
                   bg-gradient-to-br ${gradient} transition-all duration-500 group-hover:scale-[1.03] group-hover:-rotate-1 active:scale-95`}
      >
        {/* Decorative Background Icon */}
        <Users
          className="absolute -right-6 -bottom-6 w-32 h-32 opacity-20 text-white transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12"
          strokeWidth={1}
        />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-tighter leading-tight capitalize">
              {group.name}
            </h3>
            {group.description && (
              <p className="text-sm mt-2 opacity-80 font-medium line-clamp-2 max-w-[80%]">
                {group.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest border border-white/10">
              {isAdmin ? "Administrator" : "Member"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
