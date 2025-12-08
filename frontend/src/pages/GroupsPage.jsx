import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { useGroups, useAcceptInvite } from "../services/groupApi";
import GroupCard from "../features/group/components/GroupCard";
import CreateGroupModal from "../features/group/components/CreateGroup";
import Tab from "../shared/components/Tab";

const GroupsPage = () => {
  const { user } = useSelector((s) => s.auth);
  const { groups, loading: isLoading} = useSelector(
    (state) => state.group
  );
  const acceptInvite = useAcceptInvite();
  const [showCreate, setShowCreate] = useState(false);

  const [activeTab, setActiveTab] = useState("owner");

  if (isLoading) return <div className="p-6">Loading groups...</div>;

  // Split groups by status
  const pendingGroups = groups.filter((g) => {
    const member = g.members.find((m) => m.email === user?.email);
    return member && member.status === "pending";
  });

  const acceptedGroups = groups.filter((g) => {
    const member = g.members.find((m) => m.email === user?.email);
    return member && member.status === "accepted";
  });

  const createdGroups = acceptedGroups.filter((g) => g.createdBy === user?._id);
  const memberGroups = acceptedGroups.filter((g) => g.createdBy !== user?._id);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Groups
        </h1>

        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Create Group
        </button>
      </div>

      {/* Tabs */}
      <Tab
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { label: "Owner", value: "owner" },
          { label: "Member", value: "member" },
        ]}
      />

      {/* PENDING INVITES */}
      {pendingGroups.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-yellow-600">
            Pending Invites
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pendingGroups.map((g) => (
              <div
                key={g._id}
                className="rounded-xl border border-yellow-300 bg-yellow-50 p-4 dark:bg-yellow-900/20"
              >
                <h3 className="text-lg font-semibold">{g.name}</h3>
                <p className="text-sm opacity-70 mt-1">
                  {g.description || "No description"}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    Invite Pending
                  </span>

                  <button
                    onClick={() => acceptInvite.mutate({ groupId: g._id })}
                    className="btn-primary text-sm"
                  >
                    Accept Invite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* OWNER TAB */}
      {activeTab === "owner" && (
        <section>
          {createdGroups.length === 0 ? (
            <p className="text-gray-500 mt-6">You don't own any groups yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {createdGroups.map((g) => (
                <GroupCard key={g._id} group={g} isAdmin />
              ))}
            </div>
          )}
        </section>
      )}

      {/* MEMBER TAB */}
      {activeTab === "member" && (
        <section>
          {memberGroups.length === 0 ? (
            <p className="text-gray-500 mt-6">
              You are not part of any groups yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {memberGroups.map((g) => (
                <GroupCard key={g._id} group={g} />
              ))}
            </div>
          )}
        </section>
      )}

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
    </div>
  );
};

export default GroupsPage;
