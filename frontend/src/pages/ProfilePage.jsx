import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUpdateProfile, useGenerateDeveloperKey } from "../services/authApi";
import { useToast } from "../contexts/ToastContext";
import { Modal } from "../shared/components/Modal";
import { Pencil, Terminal, Copy, Check, ExternalLink, Key } from "lucide-react";
import { useGravatar } from "../shared/hooks/useGravatar";
import { useSelector } from "react-redux";
import { LoadingPage } from "../shared/components/LoadingPage";
import { FormInput } from "../shared/components/FormInput";
import { ThemeToggle } from "../features/dashboard/components/ThemeToggle";

const profileSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .test(
      "len",
      "Password must be at least 6 characters",
      (val) => !val || val.length >= 6
    ),
});

function DeveloperSettings() {
  const [devKey, setDevKey] = useState("");
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  const generateKeyMutation = useGenerateDeveloperKey();

  const handleGenerateKey = async () => {
    try {
      const response = await generateKeyMutation.mutateAsync();
      setDevKey(response.token);
      addToast({
        type: "success",
        title: "Key Generated",
        message: "A new long-lived developer key has been created.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Generation Failed",
        message: err.message || "Could not generate key.",
      });
    }
  };

  const copyConfig = async () => {
    const config = {
      mcpServers: {
        finpal: {
          command: "npx",
          args: ["-y", "mcp-remote", "https://budget-app-sigma-taupe.vercel.app/api/mcp/sse"],
          env: {
            API_TOKEN: devKey || "YOUR_DEVELOPER_KEY_HERE"
          }
        }
      }
    };
    await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      type: "success",
      title: "Config Copied",
      message: "Claude Desktop configuration copied to clipboard.",
    });
  };

  return (
    <div className="card mt-6 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <Terminal size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Developer Settings (MCP)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Connect FinPal to Claude AI using the Model Context Protocol.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 mb-6">
        <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <Key className="shrink-0 mt-0.5" size={16} />
          <span>
            Generate a long-lived API key to allow external tools like Claude Desktop to access your data.
            <strong> Keep this key private!</strong> It grants full access to your account for 1 year.
          </span>
        </p>
      </div>

      {!devKey ? (
        <button
          className="btn-primary flex items-center gap-2"
          onClick={handleGenerateKey}
          disabled={generateKeyMutation.isPending}
        >
          {generateKeyMutation.isPending ? "Generating..." : "Generate Developer Key"}
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
              Your Developer Key
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={devKey}
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 text-sm font-mono"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(devKey);
                  addToast({ type: "success", title: "Key Copied", message: "Key copied to clipboard." });
                }}
                className="btn-secondary px-3"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Claude Desktop Setup
            </h4>
            <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4 list-decimal pl-4">
              <li>Install Claude Desktop on your computer.</li>
              <li>Open <code>~/Library/Application Support/Claude/claude_desktop_config.json</code> (macOS).</li>
              <li>Paste the configuration snippet below into the <code>mcpServers</code> section.</li>
              <li>Restart Claude Desktop.</li>
            </ol>

            <div className="relative group">
              <pre className="p-4 rounded-lg bg-gray-900 text-gray-100 text-xs overflow-x-auto font-mono">
                {JSON.stringify({
                  mcpServers: {
                    finpal: {
                      command: "npx",
                      args: ["-y", "mcp-remote", "https://finpal-mcp.vercel.app/api/mcp/sse"],
                      env: {
                        API_URL: "https://budget-app-be.vercel.app",
                        API_TOKEN: devKey
                      }
                    }
                  }
                }, null, 2)}
              </pre>
              <button
                onClick={copyConfig}
                className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-700 flex items-center gap-2 transition-colors"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                <span className="text-[10px] uppercase font-bold tracking-tight">Copy JSON</span>
              </button>
            </div>
          </div>

          <button
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            onClick={handleGenerateKey}
          >
            Regenerate key (replaces existing)
          </button>
        </div>
      )}
    </div>
  );
}

export function ProfilePage() {
  const { user, loading: isLoading } = useSelector((state) => state.auth);
  const updateProfileMutation = useUpdateProfile();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // Gravatar image for user's email
  const { avatarUrl, loading: avatarLoading } = useGravatar(user?.email, {
    size: 120,
    defaultType: "retro",
  });

  // Populate form once user data is available
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const updateData = { ...data };
      if (!updateData.password) delete updateData.password;

      await updateProfileMutation.mutateAsync(updateData);

      addToast({
        type: "success",
        title: "Profile Updated",
        message: "Your profile has been updated successfully.",
      });

      reset((prev) => ({ ...prev, password: "" }));
      setIsModalOpen(false);
    } catch (err) {
      addToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update profile.",
      });
    }
  };

  const shareText = `🎉 FinPal App is LIVE!

Want to take control of your daily spending? 💸
Track expenses, set budgets, and save smarter—all in one app.

👉 Join here:
https://budget-app-sigma-taupe.vercel.app

Try it out and share your feedback! 📊
#BudgetTracker #SaveMoney

💡 Tip: Bookmark the link for easy access. Let’s build better financial habits together!
`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "FinPal App",
          text: shareText,
          url: "https://budget-app-sigma-taupe.vercel.app",
        });
      } catch (err) {
        // user cancelled – ignore
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareText);
    addToast({
      type: "success",
      title: "Copied",
      message: "Invite message copied to clipboard.",
    });
  };

  if (isLoading) {
    return <LoadingPage page="profile" />;
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
          className="btn-primary flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Pencil size={16} />
          Edit Profile
        </button>
      </div>

      {/* Settings */}
      <div className="card mt-6 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Appearance
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Customize the look and feel of the app
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Invite & Share */}
      <div className="card mt-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Invite friends to FinPal
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Help your friends track expenses and build better money habits.
        </p>

        <textarea
          readOnly
          value={shareText}
          className="mt-4 w-full min-h-[160px] resize-none rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 text-sm text-gray-800 dark:text-gray-200"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn-primary" onClick={handleShare}>
            Share
          </button>

          <button className="btn-secondary" onClick={copyToClipboard}>
            Copy message
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <DeveloperSettings />

      {/* Edit Modal */}
      {isModalOpen && (
        <Modal title="Edit Profile" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                id="firstName"
                placeholder="Enter first name"
                error={errors.firstName}
                {...register("firstName")}
              />

              <FormInput
                label="Last Name"
                id="lastName"
                placeholder="Enter last name"
                error={errors.lastName}
                {...register("lastName")}
              />
            </div>

            <FormInput
              label="Email"
              id="email"
              type="email"
              disabled
              error={errors.email}
              {...register("email")}
            />

            <FormInput
              label="New Password (leave blank to keep current)"
              id="password"
              type="password"
              placeholder="Enter new password"
              autoComplete="new-password"
              error={errors.password}
              {...register("password")}
            />

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
