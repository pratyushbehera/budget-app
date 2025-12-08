import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const PendingInviteBanner = ({ pendingCount }) => {
  const [visible, setVisible] = useState(true);

  if (!pendingCount || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="rounded-2xl p-4 border shadow bg-gradient-to-r
                   from-green-600 to-green-300 text-white mb-4 mx-4 sm:mx-0"
      >
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Icon Tile */}
            <div className="w-10 h-10 rounded-xl shadow bg-white/20 flex items-center justify-center">
              <Bell className="text-white w-6 h-6" />
            </div>

            <div>
              <p className="text-lg font-semibold">Pending Group Invites</p>
              <p className="text-sm opacity-90">
                You have {pendingCount} pending invite
                {pendingCount > 1 ? "s" : ""}. Review them now!
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/groups"
            className="text-sm font-medium bg-white text-orange-700 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            View Invites
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
