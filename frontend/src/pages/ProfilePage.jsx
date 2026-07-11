import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUpdateProfile, useGenerateDeveloperKey } from "../services/authApi";
import { useToast } from "../contexts/ToastContext";
import { Pencil, Terminal, Copy, Check, Key } from "lucide-react";
import { useGravatar } from "../shared/hooks/useGravatar";
import { useSelector } from "react-redux";
import { LoadingPage } from "../shared/components/LoadingPage";
import { ThemeToggle } from "../features/dashboard/components/ThemeToggle";
import Button from "@/shared/system/Button";
import Modal from "@/shared/system/Modal";
import Input from "@/shared/system/FormField/Input";
import Textarea from "@/shared/system/FormField/TextArea";
import PageHeading from "../shared/components/PageHeading";
import Typography from "@/shared/system/Typography";

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
          <Typography variant="h3">Developer Access</Typography>
          <Typography variant="subtitle1">
            Connect FinPal to Claude AI via MCP
          </Typography>
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
        <Button
          variant="primary"
          size="sm"
          onClick={handleGenerateKey}
          isLoading={generateKeyMutation.isPending}
        >
          {generateKeyMutation.isPending
            ? "Generating..."
            : "Generate Developer Key"}
        </Button>
      ) : (
        <div className="space-y-10">
          <div className="flex gap-3">
            <Input
              label="Your Secret API Key"
              type="text"
              className="font-mono tracking-tight"
              readOnly
              value={devKey}
            />
            <Button
              size="icon-md"
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(devKey);
                addToast({
                  type: "success",
                  title: "Key Copied",
                  message: "Key copied to clipboard.",
                });
              }}
              className="hover:text-primary-500 border mt-8"
            >
              <Copy size={20} strokeWidth={2} />
            </Button>
          </div>

          <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
            <Typography variant="h4">Claude Desktop Setup</Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Typography
                    variant="subtitle1"
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"
                  >
                    1
                  </Typography>
                  <Typography variant="body2">
                    Open <code>claude_desktop_config.json</code> in your
                    Application Support folder.
                  </Typography>
                </div>
                <div className="flex gap-4">
                  <Typography
                    variant="subtitle1"
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"
                  >
                    2
                  </Typography>
                  <Typography variant="body2">
                    Paste the configuration snippet below into the{" "}
                    <code>mcpServers</code> section.
                  </Typography>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Typography
                    variant="subtitle1"
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"
                  >
                    3
                  </Typography>
                  <Typography variant="body2">
                    Restart Claude Desktop to enable the integration.
                  </Typography>
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
              <Button
                size="sm"
                variant="ghost"
                onClick={copyConfig}
                className="absolute top-6 right-6 border hover:text-primary-500 hover:border-primary-500"
                leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
              >
                Copy Config
              </Button>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              variant="primary"
              size="sm"
              className="uppercase tracking-[0.2em]"
              onClick={handleGenerateKey}
            >
              Regenerate developer credentials
            </Button>
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
    <div className="min-h-screen max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Page Header */}
      <PageHeading
        title="Settings"
        subtitle="Manage your digital footprint and preferences"
      />

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
            <Typography variant="h2">
              {user?.firstName} {user?.lastName}
            </Typography>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <Typography variant="body1">{user?.email}</Typography>
              {/* //TODO: Badge */}
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                verified account
              </span>
            </div>
          </div>
          <Button
            size="md"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Pencil size={16} />}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Appearance Control */}
        <div className="bg-white/80 dark:bg-gray-950/60 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none animate-slide-in-bottom">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <Typography variant="h3">Appearance</Typography>
              <Typography variant="subtitle1">
                Switch between light and dark themes
              </Typography>
            </div>
          </div>
          <div className="p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <Typography variant="label">System Theme</Typography>
            <ThemeToggle />
          </div>
        </div>

        {/* Invite Friends */}
        <div className="bg-white/80 dark:bg-gray-950/60 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none animate-slide-in-bottom">
          <div className="space-y-1 mb-6">
            <Typography variant="h3">Spread the Word</Typography>
            <Typography variant="subtitle1">
              Invite friends to simplify their finances
            </Typography>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <Textarea readOnly value={shareText} className="h-[150px]" />
              <Button
                size="icon-sm"
                variant="secondary"
                onClick={copyToClipboard}
                leftIcon={<Copy size={16} className="text-primary-500" />}
                className="absolute top-4 right-4"
              ></Button>
            </div>

            <div className="flex gap-4">
              <Button size="lg" variant="primary" onClick={handleShare}>
                Fast Share
              </Button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#25D366] text-white hover:scale-105 transition-transform shadow-lg shadow-[#25D366]/20 flex items-center justify-center font-black uppercase tracking-widest text-[10px]"
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
        <Modal onClose={() => setIsModalOpen(false)}>
          <Modal.Header>Refine Profile</Modal.Header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body>
              <Input
                label="First Name"
                id="firstName"
                placeholder="John"
                required
                error={errors?.firstName?.message}
                {...register("firstName")}
              />
              <Input
                label="Last Name"
                id="lastName"
                placeholder="Doe"
                required
                error={errors?.lastName?.message}
                {...register("lastName")}
              />

              <Input
                label="Account Email (Primary)"
                id="email"
                placeholder="johndoe@email.com"
                disabled
                {...register("email")}
              />

              <Input
                label="Reset Security Key"
                id="password"
                type="password"
                placeholder="Leave blank to keep current"
                autoComplete="new-password"
                error={errors?.password?.message}
                {...register("password")}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                size="sm"
                isLoading={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending
                  ? "Syncing..."
                  : "Apply Changes"}
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      )}
    </div>
  );
}
