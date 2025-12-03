import React from "react";
import { useParams } from "react-router-dom";
import { useGroup } from "../services/groupApi";
import GroupHeader from "../features/group/GroupHeader";
import GroupMembers from "../features/group/GroupMembers";
import GroupSummary from "../features/group/GroupSummary";
import GroupTransactions from "../features/group/GroupTransactions";

const GroupPage = () => {
  const { groupId } = useParams();

  const { data: group, isLoading, isError } = useGroup(groupId);

  if (isLoading) {
    return (
      <div className="p-4 animate-pulse text-gray-500">Loading group...</div>
    );
  }

  if (isError || !group) {
    return (
      <div className="p-4 text-red-500">Failed to load group details.</div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <GroupHeader group={group} />
      <GroupMembers members={group.members} />

      <GroupSummary groupId={groupId} />
      <GroupTransactions groupId={groupId} />
    </div>
  );
};

export default GroupPage;
