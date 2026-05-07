import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { LoadingPage } from "../shared/components/LoadingPage";

export default function CategoryPage() {
  const {
    category: data,
    loading: isLoading,
    error,
  } = useSelector((state) => state.category);

  const [,setShowAddModal] = useState(false);
  const [, setDeleteCategory] = useState(null);
  const [, setEditCategory] = useState(null);

  if (isLoading) return <LoadingPage page="categories" />;
  if (error) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="text-6xl font-black text-rose-500 tracking-tighter">Oops!</div>
      <p className="text-xl text-gray-400 font-medium">{error.message}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-10 space-y-8 sm:space-y-10 animate-fade-in relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
 
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 sm:px-0">
        <div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
            Categories
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 dark:text-gray-500 font-medium tracking-tight mt-2 sm:mt-4">
            Organize your transactions with precision
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center gap-3 px-8 py-4 text-base sm:text-lg font-black rounded-2xl shadow-xl shadow-primary-500/20 active:scale-95 transition-all w-full md:w-auto"
        >
          <Plus size={20} />
          <span>New Category</span>
        </button>
      </div>
 
      {/* Categories Table Card */}
      <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-2xl rounded-2xl sm:rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden animate-slide-in-bottom">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-4 sm:px-10 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Label</th>
                <th className="px-4 sm:px-10 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {data?.map((cat) => (
                <tr
                  key={cat._id}
                  className="group hover:bg-gray-50/50 dark:hover:bg-primary-500/5 transition-colors"
                >
                  <td className="px-4 sm:px-10 py-4 sm:py-6">
                    <span className="inline-flex items-center px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-black tracking-tight bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800 shadow-sm transition-transform origin-left">
                      {cat.name}
                    </span>
                  </td>

                  <td className="px-4 sm:px-10 py-4 sm:py-6">
                    <div className="flex justify-center gap-2 sm:gap-3">
                      <button
                        onClick={() => setEditCategory(cat)}
                        className="p-2 sm:p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:bg-primary-500 hover:text-white transition-all hover:scale-110"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteCategory(cat)}
                        className="p-2 sm:p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:bg-rose-500 hover:text-white transition-all hover:scale-110"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
