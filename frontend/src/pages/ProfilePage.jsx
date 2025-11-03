import React, { useState, useEffect } from "react";
import { useUpdateProfile, useCurrentUser } from "../services/authApi";
import { useNotification } from "../contexts/NotificationContext";
import { Modal } from "../shared/components/Modal";
import { Pencil } from "lucide-react";
import { useGravatar } from "../shared/hooks/useGravatar";

export function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const { addNotification } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Gravatar image for user's email
  const { avatarUrl, loading: avatarLoading } = useGravatar(user?.email, {
    size: 120,
    defaultType: "retro",
  });

  // Populate form once user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updateData = { ...formData };
      if (!updateData.password) delete updateData.password;

      await updateProfileMutation.mutateAsync(updateData);

      addNotification({
        type: "success",
        title: "Profile Updated",
        message: "Your profile has been updated successfully.",
      });

      setFormData((prev) => ({ ...prev, password: "" }));
      setIsModalOpen(false);
    } catch (err) {
      addNotification({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update profile.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-300">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-10 px-6 lg:px-8">
      {/* Profile Header */}
      <div className="card p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-col items-center">
          {avatarLoading ? (
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          ) : (
            <img
              src={avatarUrl || "/default-avatar.png"}
              alt="Profile avatar"
              className="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-700 shadow"
            />
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
        </div>

        <button
          className="btn-secondary flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Pencil size={16} />
          Edit Profile
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <Modal title="Edit Profile" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field mt-1"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter new password"
                autoComplete="current-password"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="btn-primary"
              >
                {updateProfileMutation.isPending ? "Updating..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
