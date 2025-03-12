'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Sign up:', { fullName, email, password });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Back Button */}
      <div className="p-4">
        <button 
          onClick={() => router.back()}
          className="text-white hover:text-grass-primary transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/GrassAppLogo.png"
            alt="GrassApp Logo"
            width={200}
            height={80}
            priority
          />
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-grass-primary text-white py-3 rounded-lg font-medium hover:bg-grass-primary-light transition-colors"
          >
            Sign Up
          </button>
        </form>

        {/* Social Sign Up */}
        <div className="mt-8 w-full max-w-md">
          <p className="text-center text-gray-400 mb-4">Or Sign Up with</p>
          <div className="grid grid-cols-3 gap-4">
            <button className="flex items-center justify-center bg-white rounded-lg p-3">
              <Image src="/apple-logo.png" alt="Apple" width={24} height={24} />
            </button>
            <button className="flex items-center justify-center bg-white rounded-lg p-3">
              <Image src="/google-logo.png" alt="Google" width={24} height={24} />
            </button>
            <button className="flex items-center justify-center bg-white rounded-lg p-3">
              <Image src="/facebook-logo.png" alt="Facebook" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* Sign In Link */}
        <p className="mt-8 text-gray-400">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="text-grass-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
} 