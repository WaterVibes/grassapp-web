'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';

export default function Account() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/sign-in');
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <Link
              href="/"
              className="p-2 hover:text-grass-primary transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold">Account</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Menu */}
        <div className="space-y-4">
          <Link
            href="/account/grasspass"
            className="flex items-center justify-between p-4 bg-grass-bg-light rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-grass-primary">🌿</span>
              <span>Manage GrassPass</span>
            </div>
            <ArrowLeftIcon className="w-5 h-5 rotate-180" />
          </Link>

          <Link
            href="/account/rewards"
            className="flex items-center justify-between p-4 bg-grass-bg-light rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span>🎁</span>
              <span>My Rewards</span>
            </div>
            <ArrowLeftIcon className="w-5 h-5 rotate-180" />
          </Link>

          <Link
            href="/account/saved"
            className="flex items-center justify-between p-4 bg-grass-bg-light rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span>❤️</span>
              <span>Saved Stores</span>
            </div>
            <ArrowLeftIcon className="w-5 h-5 rotate-180" />
          </Link>

          <Link
            href="/account/profile"
            className="flex items-center justify-between p-4 bg-grass-bg-light rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span>👤</span>
              <span>My Profile</span>
            </div>
            <ArrowLeftIcon className="w-5 h-5 rotate-180" />
          </Link>

          <Link
            href="/account/help"
            className="flex items-center justify-between p-4 bg-grass-bg-light rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span>💬</span>
              <span>Get Help</span>
            </div>
            <ArrowLeftIcon className="w-5 h-5 rotate-180" />
          </Link>

          <Link
            href="/account/gift-card"
            className="flex items-center justify-between p-4 bg-grass-bg-light rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span>🎁</span>
              <span>Gift Card</span>
            </div>
            <ArrowLeftIcon className="w-5 h-5 rotate-180" />
          </Link>

          <Link
            href="/account/refer"
            className="flex items-center justify-between p-4 bg-grass-bg-light rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span>👥</span>
              <span>Refer Friends, Get $10</span>
            </div>
            <ArrowLeftIcon className="w-5 h-5 rotate-180" />
          </Link>
        </div>

        {/* Account Settings Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <Link
              href="/account/personal-info"
              className="flex items-center justify-between p-4 bg-grass-bg-light rounded-lg"
            >
              <div>
                <div className="font-medium">Personal Information</div>
                <div className="text-sm text-gray-400">Change your account information</div>
              </div>
              <ArrowLeftIcon className="w-5 h-5 rotate-180" />
            </Link>

            <Link
              href="/account/payment"
              className="flex items-center justify-between p-4 bg-grass-bg-light rounded-lg"
            >
              <div>
                <div className="font-medium">Payment</div>
                <div className="text-sm text-gray-400">Manage payment methods and GrassApp Credits</div>
              </div>
              <ArrowLeftIcon className="w-5 h-5 rotate-180" />
            </Link>

            <Link
              href="/account/address"
              className="flex items-center justify-between p-4 bg-grass-bg-light rounded-lg"
            >
              <div>
                <div className="font-medium">Address</div>
                <div className="text-sm text-gray-400">Add or remove a delivery address</div>
              </div>
              <ArrowLeftIcon className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 