import Typography from "@/shared/system/Typography";

const LOGO_URL = "/logo.png";

export function Hero() {
  return (
    <div
      className="
        relative
        flex
        flex-col
        items-center
        lg:flex-1
        lg:py-12
      "
    >
      {/* Brand */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-6 lg:pt-8">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="FinPal logo"
            className="h-12 w-12 lg:h-14 lg:w-14"
          />

          <Typography
            variant="h1"
            className="text-3xl lg:text-4xl font-black tracking-tight"
          >
            FinPal
          </Typography>
        </div>
      </header>

      {/* Hero content */}
      <div
        className="
          relative
          z-10
          flex
          flex-1
          flex-col
          items-center
          lg:items-start
          w-full
          max-w-2xl
          px-6
          lg:px-8
          py-8
          lg:py-12
          space-y-4
          lg:space-y-5
        "
      >
        <div
          className="
            inline-flex
            px-4
            py-1.5
            bg-primary-100
            dark:bg-primary-900/40
            text-primary-600
            dark:text-primary-400
            rounded-full
            text-xs
            font-black
            uppercase
            tracking-[0.2em]
          "
        >
          The Future of Personal Finance
        </div>

        <Typography
          variant="h1"
          className="
            text-5xl
            lg:text-7xl
            font-black
            tracking-tighter
            leading-[0.92]
            text-center
            lg:text-left
          "
        >
          Take Control
          <br />
          <span className="text-primary-500">of Your Money</span>
        </Typography>

        <Typography
          variant="subtitle1"
          align="center"
          className="text-lg lg:text-2xl lg:text-left"
        >
          Master your spending, crush your goals, and build lasting wealth with
          the most expressive budget tracker ever built.
        </Typography>
      </div>
    </div>
  );
}
