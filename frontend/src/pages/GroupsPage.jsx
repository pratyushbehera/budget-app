import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { useGroups, useAcceptInvite } from "../services/groupApi";
import GroupCard from "../features/group/components/GroupCard";
import CreateGroupModal from "../features/group/components/CreateGroup";
import Tab from "../shared/components/Tab";
import { LoadingPage } from "../shared/components/LoadingPage";

const GroupsPage = () => {
  const { user } = useSelector((s) => s.auth);
  const { groups, loading: isLoading } = useSelector((state) => state.group);
  const acceptInvite = useAcceptInvite();
  const [showCreate, setShowCreate] = useState(false);

  const [activeTab, setActiveTab] = useState("owner");

  if (isLoading) return <LoadingPage page="group" />;

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

      {/* PENDING INVITES */}
      {pendingGroups.length > 0 && (
        <section>
          <h2 className="text-md font-semibold mb-3 text-yellow-600">
            Pending Invites
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pendingGroups.map((g) => (
              <div
                key={g._id}
                className="relative overflow-hidden rounded-2xl p-5 text-white shadow-md 
                         bg-gradient-to-r from-teal-500 to-green-600"
              >
                {/* Background Icon */}
                <div className="absolute -right-3 -bottom-3 opacity-20 text-white">
                  <Plus size={90} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold">{g.name}</h3>

                <p className="text-sm mt-1 opacity-90">
                  {g.description || "No description provided"}
                </p>

                {/* Invited By */}
                <p className="mt-2 text-xs opacity-90">
                  Invited by:{" "}
                  <span className="font-semibold">
                    {g.members.find((m) => m.userId === g.createdBy)?.email ||
                      "Unknown"}
                  </span>
                </p>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    Invite Pending
                  </span>

                  <div className="flex gap-2">
                    {/* Reject Invite */}
                    <button
                      onClick={() =>
                        acceptInvite.mutate({ groupId: g._id, reject: true })
                      }
                      className="px-3 py-1.5 rounded-md bg-red-600 text-white text-xs hover:bg-red-700"
                    >
                      Reject
                    </button>

                    {/* Accept Invite */}
                    <button
                      onClick={() => acceptInvite.mutate(g._id)}
                      className="z-10 px-3 py-1.5 rounded-md bg-white text-orange-700 text-xs font-medium 
                               hover:bg-gray-100"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tabs */}
      <Tab
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { label: "Owner", value: "owner" },
          { label: "Member", value: "member" },
        ]}
      />

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
