'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { updateUser } from '@/store/authSlice';

interface PersonalInfoForm {
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  notifications: {
    email: boolean;
    sms: boolean;
    promotions: boolean;
    orderUpdates: boolean;
    deliveryAlerts: boolean;
  };
}

export default function PersonalInfo() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<PersonalInfoForm>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    birthdate: '',
    notifications: {
      email: true,
      sms: true,
      promotions: true,
      orderUpdates: true,
      deliveryAlerts: true
    }
  });

  const handleInputChange = (field: keyof Omit<PersonalInfoForm, 'notifications'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationToggle = (field: keyof PersonalInfoForm['notifications']) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field]
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(updateUser({
        name: formData.name,
        email: formData.email
      }));
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      birthdate: '',
      notifications: {
        email: true,
        sms: true,
        promotions: true,
        orderUpdates: true,
        deliveryAlerts: true
      }
    });
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-lg border-b border-grass-primary/20 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:text-grass-primary transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Personal Info</h1>
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={isSaving}
              className="text-grass-primary hover:text-grass-primary-light disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Contact Information */}
        <div className="bg-grass-bg-light rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                />
              ) : (
                <div className="text-white">{formData.name}</div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                />
              ) : (
                <div className="text-white">{formData.email}</div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(123) 456-7890"
                  className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                />
              ) : (
                <div className="text-white">{formData.phone || 'Not provided'}</div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => handleInputChange('birthdate', e.target.value)}
                  className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                />
              ) : (
                <div className="text-white">{formData.birthdate || 'Not provided'}</div>
              )}
            </div>
          </div>
        </div>

        {/* MMCC Information */}
        <div className="bg-grass-bg-light rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">MMCC Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">MMCC ID</label>
              <div className="text-white">{user?.mmcc?.id || 'Not verified'}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Card Type</label>
              <div className="text-white">{user?.mmcc?.type || 'Not specified'}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Expiration Date</label>
              <div className="text-white">
                {user?.mmcc?.expirationDate ? 
                  new Date(user.mmcc.expirationDate).toLocaleDateString() : 
                  'Not provided'
                }
              </div>
            </div>
            {user?.mmcc?.isVerified ? (
              <div className="px-3 py-1 bg-grass-primary/20 text-grass-primary inline-block rounded-full text-sm">
                ✓ Verified
              </div>
            ) : (
              <button
                onClick={() => router.push('/account/verify-mmcc')}
                className="w-full bg-grass-primary text-white py-2 rounded-lg hover:bg-grass-primary-light transition-colors"
              >
                Verify MMCC Card
              </button>
            )}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-grass-bg-light rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-400">Receive updates via email</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={() => handleNotificationToggle('email')}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-grass-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-gray-400">Receive updates via text message</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications.sms}
                  onChange={() => handleNotificationToggle('sms')}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-grass-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Promotional Updates</div>
                <div className="text-sm text-gray-400">Receive deals and special offers</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications.promotions}
                  onChange={() => handleNotificationToggle('promotions')}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-grass-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Order Updates</div>
                <div className="text-sm text-gray-400">Status changes and confirmations</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications.orderUpdates}
                  onChange={() => handleNotificationToggle('orderUpdates')}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-grass-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Delivery Alerts</div>
                <div className="text-sm text-gray-400">Real-time delivery status</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications.deliveryAlerts}
                  onChange={() => handleNotificationToggle('deliveryAlerts')}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-grass-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        {isEditing && (
          <button
            onClick={handleCancel}
            className="w-full mt-6 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </main>
  );
} 