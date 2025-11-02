import React, { useState } from 'react';
import { useUpdateProfile, useCurrentUser } from '../services/authApi';
import { useNotification } from '../contexts/NotificationContext';

export function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const { addNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Populate form when user data loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Remove password if empty (don't update it)
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await updateProfileMutation.mutateAsync(updateData);
      
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.',
      });
      
      // Clear password field
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Failed to update profile.',
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Profile Settings
      </h1>
      
      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input-field mt-1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input-field mt-1"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field mt-1"
            required
            autoComplete="email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field mt-1"
            placeholder="Enter new password"
            autoComplete="current-password"
          />
        </div>
        
        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="btn-primary w-full md:w-auto"
        >
          {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}