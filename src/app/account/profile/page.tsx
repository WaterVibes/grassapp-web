'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { ArrowLeftIcon, CameraIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { updateUser } from '@/store/authSlice';
import Image from 'next/image';

export default function Profile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    if (user) {
      dispatch(updateUser({
        ...user,
        ...formData
      }));
      setIsEditing(false);
    }
  };

  const handlePhotoChange = () => {
    // In a real app, this would open a file picker and handle image upload
    console.log('Change photo');
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
            <h1 className="text-xl font-bold">My Profile</h1>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="text-sm font-medium text-grass-primary hover:text-grass-primary-light transition-colors"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={user?.photoUrl || "/default-avatar.png"}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            {isEditing && (
              <button
                onClick={handlePhotoChange}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-grass-primary text-white hover:bg-grass-primary-light transition-colors"
              >
                <CameraIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="font-semibold text-xl">{user?.name}</span>
            {user?.mmcc?.isVerified && (
              <CheckBadgeIcon className="w-6 h-6 text-grass-primary" />
            )}
          </div>
          <div className="text-sm text-gray-400">Member since 2024</div>
        </div>

        {/* Personal Information */}
        <div className="bg-grass-bg-light rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grass-primary"
                />
              ) : (
                <div className="text-white">{user?.name}</div>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grass-primary"
                />
              ) : (
                <div className="text-white">{user?.email}</div>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grass-primary"
                />
              ) : (
                <div className="text-white">{user?.phone || 'Not provided'}</div>
              )}
            </div>
          </div>
        </div>

        {/* MMCC Information */}
        <div className="bg-grass-bg-light rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">MMCC Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">MMCC ID</label>
              <div className="text-white flex items-center gap-2">
                {user?.mmcc?.id}
                {user?.mmcc?.isVerified && (
                  <span className="text-xs bg-grass-primary/20 text-grass-primary px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Card Type</label>
              <div className="text-white capitalize">{user?.mmcc?.type || 'Not specified'}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Expiration Date</label>
              <div className="text-white">
                {user?.mmcc?.expirationDate ? new Date(user.mmcc.expirationDate).toLocaleDateString() : 'Not specified'}
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="bg-grass-bg-light rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Account Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-black rounded-lg">
              <div className="text-2xl font-bold text-grass-primary">{user?.grassPoints || 0}</div>
              <div className="text-sm text-gray-400">GrassPoints</div>
            </div>
            <div className="text-center p-4 bg-black rounded-lg">
              <div className="text-2xl font-bold text-grass-primary">
                {user?.grassPass ? 'Active' : 'None'}
              </div>
              <div className="text-sm text-gray-400">GrassPass Status</div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-4">
          <button
            onClick={() => router.push('/account/change-password')}
            className="w-full bg-grass-bg-light text-white py-3 rounded-xl font-medium hover:bg-grass-bg-light/80 transition-colors"
          >
            Change Password
          </button>
          <button
            onClick={() => router.push('/auth/sign-in')}
            className="w-full bg-red-500/10 text-red-500 py-3 rounded-xl font-medium hover:bg-red-500/20 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
} 