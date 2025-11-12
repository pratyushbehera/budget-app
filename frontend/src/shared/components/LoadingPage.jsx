export const LoadingPage = ({ page }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
      <span className="text-gray-600 dark:text-gray-300">
        Loading {page}...
      </span>
    </div>
  </div>
);
