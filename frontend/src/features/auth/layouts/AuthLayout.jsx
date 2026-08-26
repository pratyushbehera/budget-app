import Typography from "@/shared/system/Typography";

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="bg-white dark:bg-gray-950 overflow-hidden">
      {/* Content */}
      <main className="">
        <div className="w-full max-w-lg space-y-10">
          {/* Title Section */}
          <div className="text-center">
            <Typography variant="h1" align="center">
              {title}
            </Typography>
            {subtitle}
          </div>

          {/* Form Container */}
          <div>{children}</div>

          {/* Footer Section */}
          {footer && (
            <div className="text-sm text-center text-gray-400 dark:text-gray-500 tracking-widest">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
