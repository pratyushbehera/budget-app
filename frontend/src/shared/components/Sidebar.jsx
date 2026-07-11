import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  X,
  TicketCheck,
  Group,
} from "lucide-react";
import Button from "@/shared/system/Button";

import Typography from "@/shared/system/Typography";

export const Sidebar = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const { groups, loading: isGroupLoading } = useSelector(
    (state) => state.group,
  );

  const acceptedGroups = groups?.filter((grp) => {
    const member = grp.members?.find((m) => m.userId === user?._id);
    return member && member.status !== "pending";
  });

  return (
    <>
      {/* Sidebar */}
       <aside
      className="
        hidden
        md:flex
        fixed
        left-0
        top-0
        bottom-0
        w-[18rem]
        flex-col
        border-r
        border-gray-200
        bg-white
        dark:border-gray-800
        dark:bg-gray-950
      "
    >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20">
                <img
                  src="/icon-192x192.png"
                  alt="FinPal Logo"
                  className="w-7 h-7 object-contain brightness-0 invert"
                />
              </div>
              <Typography
                variant="h2"
                className="text-primary-500 tracking-tighter"
              >
                Finpal
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Close menu"
                className="md:hidden border hover:text-tertiary-500"
                onClick={onClose}
                leftIcon={<X size={20} />}
              ></Button>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto space-y-2 py-2">
            {[
              { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
              { to: "/transactions", icon: CreditCard, label: "Transactions" },
              { to: "/plan", icon: FileText, label: "Budget Plan" },
              { to: "/groups", icon: Group, label: "Money Groups" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group
                  ${
                    window.location.pathname === item.to
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                <item.icon
                  size={22}
                  className={`transition-transform duration-300 group-hover:scale-110 ${
                    window.location.pathname === item.to
                      ? "text-white"
                      : "text-gray-400 group-hover:text-primary-500"
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </Link>
            ))}

            {/* Groups Section */}
            {!isGroupLoading && acceptedGroups?.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                <Typography
                  variant="h4"
                  className="uppercase tracking-[0.2em] text-[16px]"
                >
                  Your Groups
                </Typography>
                <div className="space-y-1">
                  {acceptedGroups?.map((grp) => (
                    <Link
                      key={grp?._id}
                      to={`/groups/${grp?._id}`}
                      onClick={onClose}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all group
                        ${
                          window.location.pathname.includes(grp?._id)
                            ? "bg-secondary-500 text-white shadow-lg shadow-secondary-500/20"
                            : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      <TicketCheck
                        size={20}
                        className={`${
                          window.location.pathname.includes(grp?._id)
                            ? "text-white"
                            : "text-gray-400 group-hover:text-secondary-500"
                        }`}
                      />
                      <span className="text-sm truncate tracking-tight">
                        {grp.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>
      </aside>

      
    </>
  );
};
