export const LoadingPage = ({ page }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-950 animate-fade-in">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-100 dark:border-primary-900/30 rounded-3xl animate-pulse"></div>
        <div className="absolute inset-0 w-16 h-16 border-t-4 border-primary-500 rounded-3xl animate-spin"></div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
          FinPal is loading...
        </h2>
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] opacity-70">
          Preparing your {page}
        </p>
      </div>
    </div>
  </div>
);
