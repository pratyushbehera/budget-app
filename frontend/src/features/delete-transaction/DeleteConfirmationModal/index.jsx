import { useApp } from "../../../app/store";
import { transactionAPI } from "../../../shared/api";
import { offlineStorage } from "../../../shared/lib/offline-storage";
import { Modal, Button } from "../../../shared/ui";

export function DeleteConfirmationModal() {
  const { state, actions } = useApp();
  const { isDeleteModalOpen, transactionToDeleteId } = state;

  const handleConfirmDelete = async () => {
    if (!transactionToDeleteId) return;

    try {
      // Create authenticated fetch function
      const authFetch = async (url, options = {}) => {
        const token = state.userToken;
        const headers = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
          actions.logoutUser();
          throw new Error("Unauthorized: Please log in again.");
        }

        return response;
      };

      await transactionAPI.delete(authFetch, transactionToDeleteId);

      // Update local state
      actions.removeTransaction(transactionToDeleteId);

      // Close modal
      actions.setDeleteModalOpen(false);
      actions.setTransactionToDeleteId(null);

      // Try to sync offline actions if online
      if (navigator.onLine) {
        // Sync logic would go here
      } else {
        // Store action for offline sync
        offlineStorage.saveOfflineAction({
          type: "removeTransaction",
          payload: { id: transactionToDeleteId },
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);

      // Store offline and update UI optimistically
      offlineStorage.saveOfflineAction({
        type: "removeTransaction",
        payload: { id: transactionToDeleteId },
      });
      actions.removeTransaction(transactionToDeleteId);

      // Close modal
      actions.setDeleteModalOpen(false);
      actions.setTransactionToDeleteId(null);

      console.log("Transaction deletion saved offline.");
    }
  };

  const handleClose = () => {
    actions.setDeleteModalOpen(false);
    actions.setTransactionToDeleteId(null);
  };

  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={handleClose}
      title="Confirm Delete"
      size="sm"
    >
      <div className="text-center">
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this transaction? This action cannot
          be undone.
        </p>

        <div className="flex space-x-3 justify-center">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
