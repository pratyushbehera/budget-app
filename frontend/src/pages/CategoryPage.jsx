import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useSelector } from "react-redux";

export function CategoyPage() {
  const {
    category: data,
    loading: isLoading,
    error,
  } = useSelector((state) => state.category);

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [editCategory, setEditCategory] = useState(null);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-6 px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Category
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>

        {/* Scrollable Table */}
        <div className="card overflow-x-auto max-h-[65vh] border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Category</th>
                <th className="px-4 py-2 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data?.map((cat) => {
                return (
                  <tr
                    key={cat._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${"border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"}`}
                      >
                        {cat.name}
                      </span>
                    </td>

                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setEditCategory(cat)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteCategory(cat)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* 
      {showAddModal && (
        <AddTransaction onClose={() => setShowAddModal(false)} />
      )}

      {editTx && (
        <EditTransaction transaction={editTx} onClose={() => setEditTx(null)} />
      )}

      {deleteTarget && (
        <DeleteTransaction
          transaction={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )} */}
    </div>
  );
}
