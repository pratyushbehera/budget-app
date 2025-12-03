import { Edit } from "lucide-react";
import React, { useState } from "react";
import { EditGroup } from "./EditGroup";

const GroupHeader = ({ group }) => {
  const [editGroup, setEditGroup] = useState(null);
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {group.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {group.description || "No description provided"}
        </p>
      </div>
      <div className="flex gap-4">
        <button className="btn-secondary" onClick={() => setEditGroup(group)}>
          <Edit />
        </button>
        <button className="btn-primary">+ Add Transaction</button>
      </div>

      {editGroup && (
        <EditGroup group={group} onClose={() => setEditGroup(null)} />
      )}
    </div>
  );
};

export default GroupHeader;
