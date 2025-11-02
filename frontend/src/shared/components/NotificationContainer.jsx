import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border-l-4 animate-slide-in ${
            notification.type === 'error'
              ? 'bg-red-50 border-red-500 text-red-800'
              : notification.type === 'warning'
              ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
              : notification.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-800'
              : 'bg-blue-50 border-blue-500 text-blue-800'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{notification.title}</h4>
              {notification.message && (
                <p className="text-sm mt-1">{notification.message}</p>
              )}
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}