import { useState } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { useAcceptInvite } from "../services/groupApi";
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
    <div className="min-h-screen max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">
            Money Groups
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium tracking-tight">
            Manage your shared budgets and invites
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary flex items-center gap-3 group px-8"
        >
          <Plus
            size={24}
            strokeWidth={3}
            className="group-hover:rotate-90 transition-transform"
          />
          <span className="text-lg">New Group</span>
        </button>
      </div>

      {/* PENDING INVITES */}
      {pendingGroups.length > 0 && (
        <section className="space-y-6 animate-slide-in">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-secondary-500">
              Pending Invites
            </h2>
            <div className="h-px flex-1 bg-secondary-100 dark:bg-secondary-900/30"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingGroups.map((g) => (
              <div
                key={g._id}
                className="relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-500/20 
                         bg-gradient-to-br from-emerald-500 to-teal-600 transition-transform hover:scale-[1.02]"
              >
                <div className="absolute -right-6 -bottom-6 opacity-20 text-white">
                  <Plus size={140} strokeWidth={1} />
                </div>

                <div className="relative z-10 space-y-4">
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter capitalize">
                      {g.name}
                    </h3>
                    <p className="text-sm mt-1 opacity-90 font-medium">
                      {g.description ||
                        "You've been invited to join this budget group."}
                    </p>
                  </div>

                  <p className="text-xs font-black uppercase tracking-widest bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
                    From:{" "}
                    {g.members.find((m) => m.userId === g.createdBy)?.email ||
                      "FinPal User"}
                  </p>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() =>
                        acceptInvite.mutate({ groupId: g._id, reject: true })
                      }
                      className="flex-1 py-3 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest transition-all border border-white/10"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => acceptInvite.mutate(g._id)}
                      className="flex-1 py-3 h-12 rounded-2xl bg-white text-emerald-600 hover:bg-emerald-50 text-xs font-black uppercase tracking-widest transition-all shadow-lg"
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

      {/* Main Content Sections */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Tab
            active={activeTab}
            onChange={setActiveTab}
            tabs={[
              { label: "My Groups", value: "owner" },
              { label: "Joined", value: "member" },
            ]}
          />
        </div>

        <section className="animate-fade-in">
          {activeTab === "owner" ? (
            createdGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 bg-gray-50 dark:bg-gray-900/20 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
                <p className="text-xl font-bold text-gray-400">
                  You haven&apos;t created any groups yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {createdGroups.map((g) => (
                  <GroupCard key={g._id} group={g} isAdmin />
                ))}
              </div>
            )
          ) : memberGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-gray-50 dark:bg-gray-900/20 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
              <p className="text-xl font-bold text-gray-400">
                You haven&apos;t joined any groups yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {memberGroups.map((g) => (
                <GroupCard key={g._id} group={g} />
              ))}
            </div>
          )}
        </section>
      </div>

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
    </div>
  );
};
export default GroupsPage;
