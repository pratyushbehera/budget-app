import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGroup } from "../services/groupApi";
import { useSelector } from "react-redux";
import GroupHeader from "../features/group/components/GroupHeader";
import GroupSummary from "../features/group/components/GroupSummary";
import GroupMembers from "../features/group/components/GroupMembers";
import GroupTransactions from "../features/group/components/GroupTransactions";
import GroupActivityList from "../features/group/components/GroupActivityList";
import { LoadingPage } from "../shared/components/LoadingPage";

const GroupPage = () => {
  const { groupId } = useParams();
  const user = useSelector((s) => s.auth.user);
  const { data: group, isLoading, isError } = useGroup(groupId);
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    if (user && group) {
      setAdmin(group?.createdBy === user?._id);
    }
  }, [group, user]);

  if (isLoading) {
    return <LoadingPage page="group" />;
  }

  if (isError || !group) {
    return (
      <div className="p-4 text-red-500">Failed to load group details.</div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <GroupHeader group={group} isAdmin={isAdmin} />
      <GroupSummary group={group} groupId={groupId} />
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
        <GroupMembers
          members={group.members}
          owner={group.createdBy}
          isAdmin={isAdmin}
          groupId={groupId}
        />
        <GroupTransactions group={group} groupId={groupId} />
        <GroupActivityList groupId={groupId} />
      </div>
    </div>
  );
};

export default GroupPage;
