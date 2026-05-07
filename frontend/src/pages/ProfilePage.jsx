import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUpdateProfile, useGenerateDeveloperKey } from "../services/authApi";
import { useToast } from "../contexts/ToastContext";
import { Modal } from "../shared/components/Modal";
import { Pencil, Terminal, Copy, Check, Key } from "lucide-react";
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
      (val) => !val || val.length >= 6,
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
          args: [
            "-y",
            "mcp-remote",
            "https://finpal-mcp-production.up.railway.app/api/mcp/sse",
          ],
          env: {
            API_TOKEN: devKey || "YOUR_DEVELOPER_KEY_HERE",
          },
        },
      },
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
    <div className="bg-white/80 dark:bg-gray-950/60 backdrop-blur-2xl rounded-[2.5rem] mt-8 p-10 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none animate-slide-in-bottom">
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
        <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 rotate-3">
          <Terminal size={32} className="text-white" />
        </div>
        <div>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
            Developer Access
          </h3>
          <p className="text-lg text-gray-400 dark:text-gray-500 font-medium tracking-tight">
            Connect FinPal to Claude AI via MCP
          </p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-3xl p-6 mb-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Key size={80} />
        </div>
        <p className="text-sm text-amber-900 dark:text-amber-200 font-medium leading-relaxed relative z-10 flex items-start gap-3">
          <Key className="shrink-0 mt-0.5 text-amber-500" size={20} />
          <span>
            Generate a long-lived API key to allow external tools like Claude
            Desktop to access your data.
            <strong className="font-black text-amber-600 dark:text-amber-400">
              {" "}
              Keep this key private!
            </strong>{" "}
            It grants full access to your account for one year.
          </span>
        </p>
      </div>

      {!devKey ? (
        <button
          className="btn-primary flex items-center gap-3 px-8 py-4 text-xl font-black rounded-2xl shadow-2xl shadow-primary-500/30 transition-all active:scale-95"
          onClick={handleGenerateKey}
          disabled={generateKeyMutation.isPending}
        >
          {generateKeyMutation.isPending
            ? "Generating..."
            : "Generate Developer Key"}
        </button>
      ) : (
        <div className="space-y-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
              Your Secret API Key
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                readOnly
                value={devKey}
                className="flex-1 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 p-4 text-sm font-mono tracking-tight text-primary-500"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(devKey);
                  addToast({
                    type: "success",
                    title: "Key Copied",
                    message: "Key copied to clipboard.",
                  });
                }}
                className="p-4 rounded-2xl bg-gray-900 text-white hover:bg-black transition-colors shadow-lg"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
            <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter mb-6">
              Claude Desktop Setup
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-gray-900 dark:text-white shrink-0">
                    1
                  </span>
                  <p>
                    Open <code>claude_desktop_config.json</code> in your
                    Application Support folder.
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-gray-900 dark:text-white shrink-0">
                    2
                  </span>
                  <p>
                    Paste the configuration snippet below into the{" "}
                    <code>mcpServers</code> section.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-gray-900 dark:text-white shrink-0">
                    3
                  </span>
                  <p>Restart Claude Desktop to enable the integration.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <pre className="p-8 rounded-[2rem] bg-gray-900 text-primary-400 text-xs overflow-x-auto font-mono leading-relaxed shadow-inner">
                {JSON.stringify(
                  {
                    mcpServers: {
                      finpal: {
                        command: "npx",
                        args: [
                          "-y",
                          "mcp-remote",
                          "https://finpal-mcp.up.railway.app/api/mcp/sse",
                        ],
                        env: {
                          API_URL: "https://budget-app-be.vercel.app",
                          API_TOKEN: devKey,
                        },
                      },
                    },
                  },
                  null,
                  2,
                )}
              </pre>
              <button
                onClick={copyConfig}
                className="absolute top-6 right-6 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl border border-white/10 flex items-center gap-3 transition-all font-black uppercase tracking-widest text-[10px]"
              >
                {copied ? (
                  <Check size={16} className="text-emerald-400" />
                ) : (
                  <Copy size={16} />
                )}
                <span>Copy Config</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary-500 transition-colors"
              onClick={handleGenerateKey}
            >
              Regenerate developer credentials
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
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

  const { avatarUrl, loading: avatarLoading } = useGravatar(user?.email, {
    size: 200,
    defaultType: "retro",
  });

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
https://finpal.com/join

Try it out and share your feedback! 📊
#BudgetTracker #SaveMoney
`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "FinPal App",
          text: shareText,
          url: "https://finpal.com/join",
        });
      } catch (err) {
        // quiet
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
      message: "Ready to share with your crew!",
    });
  };

  if (isLoading) return <LoadingPage page="profile" />;

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10 space-y-12 animate-fade-in relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
            Settings
          </h1>
          <p className="text-xl text-gray-400 dark:text-gray-500 font-medium tracking-tight mt-4">
            Manage your digital footprint and preferences
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white/80 dark:bg-gray-950/60 backdrop-blur-2xl rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none animate-slide-in-bottom">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            {avatarLoading ? (
              <div className="w-40 h-40 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse border-4 border-white dark:border-gray-900"></div>
            ) : (
              <img
                src={avatarUrl || "/default-avatar.png"}
                alt={user?.firstName}
                className="w-40 h-40 rounded-full border-8 border-white dark:border-gray-950 shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
              {user?.firstName} {user?.lastName}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="text-lg font-medium text-gray-400 dark:text-gray-500">
                {user?.email}
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                verified account
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-3 px-8 py-4 text-lg font-black rounded-2xl shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
          >
            <Pencil size={20} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Appearance Control */}
        <div className="bg-white/80 dark:bg-gray-950/60 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none animate-slide-in-bottom">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                Appearance
              </h3>
              <p className="text-gray-400 dark:text-gray-500 font-medium tracking-tight">
                Switch between light and dark themes
              </p>
            </div>
          </div>
          <div className="p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
              System Theme
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Invite Friends */}
        <div className="bg-white/80 dark:bg-gray-950/60 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none animate-slide-in-bottom">
          <div className="space-y-1 mb-6">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
              Spread the Word
            </h3>
            <p className="text-gray-400 dark:text-gray-500 font-medium tracking-tight">
              Invite friends to simplify their finances
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <textarea
                readOnly
                value={shareText}
                className="w-full min-h-[120px] resize-none rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30 p-6 text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed shadow-inner"
              />
              <button
                onClick={copyToClipboard}
                className="btn-secondary absolute top-4 right-4 p-3 rounded-xl shadow-lg hover:scale-110 transition-transform"
              >
                <Copy size={16} className="text-primary-500" />
              </button>
            </div>

            <div className="flex gap-4">
              <button
                className="flex-1 btn-primary py-4 rounded-2xl text-lg font-black shadow-lg shadow-primary-500/20"
                onClick={handleShare}
              >
                Fast Share
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#25D366] text-white hover:scale-105 transition-transform shadow-lg shadow-[#25D366]/20 flex items-center justify-center font-black uppercase tracking-widest text-[10px]"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <DeveloperSettings />

      {/* Edit Modal */}
      {isModalOpen && (
        <Modal title="Refine Profile" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="First Name"
                id="firstName"
                placeholder="John"
                error={errors.firstName}
                {...register("firstName")}
              />

              <FormInput
                label="Last Name"
                id="lastName"
                placeholder="Doe"
                error={errors.lastName}
                {...register("lastName")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                Account Email (Primary)
              </label>
              <input
                type="email"
                disabled
                className="input-field bg-gray-50/30 dark:bg-gray-800/20 text-gray-400 italic cursor-not-allowed"
                {...register("email")}
              />
            </div>

            <FormInput
              label="Reset Security Key"
              id="password"
              type="password"
              placeholder="Leave blank to keep current"
              autoComplete="new-password"
              error={errors.password}
              {...register("password")}
            />

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                className="px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Go Back
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="btn-primary px-10"
              >
                {updateProfileMutation.isPending
                  ? "Syncing..."
                  : "Apply Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
