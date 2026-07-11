import Typography from "@/shared/system/Typography";

export const FloatingBrand = () => {
  return (
    <div
      className="
        fixed
        left-[42%]
        top-4
        z-[60]
        -translate-x-1/2
        md:hidden
      "
    >
      <div
        className="
          flex
          items-center
          justify-center
          rounded-full
          border
          border-gray-200/80
          bg-white/85
          p-1.5
          pr-3
          shadow-lg
          shadow-gray-900/5
          backdrop-blur-xl
          dark:border-gray-800/80
          dark:bg-gray-900/85
          dark:shadow-black/20
        "
      >
        <div className="flex items-center gap-1">
          <div className="p-2 bg-primary-500 rounded-full shadow-lg shadow-primary-500/20">
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
      </div>
    </div>
  );
};
