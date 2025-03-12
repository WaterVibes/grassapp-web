'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/authSlice';

export default function BudzAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mmccId: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Mock login for demo
        if (formData.email === 'driver@budzz.com' && formData.password === 'driver123') {
          dispatch(login({
            id: 'driver-1',
            name: 'John Driver',
            email: formData.email,
            photoUrl: '/default-avatar.png',
            grassPoints: 0,
            mmcc: {
              id: formData.mmccId || 'P03F-1783-82E8-87DE',
              expirationDate: '2025-12-31',
              type: 'patient',
              isVerified: true
            },
            deliveryAddresses: [],
            defaultAddressIndex: 0,
            yearToDateEarnings: 0,
            total_deliveries: 0,
            status: 'offline',
            rating: 5.0
          }));
          router.push('/budz');
        } else {
          setError('Invalid credentials');
        }
      } else {
        // Handle signup logic here
        console.log('Sign up:', formData);
        // For demo, automatically log in after signup
        router.push('/budz');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-grass-primary">
            Budzz
            <span className="inline-block ml-2 transform -rotate-45">🌿</span>
          </h1>
        </div>

        <h2 className="text-2xl font-bold mb-8">
          {isLogin ? 'Welcome back, Buddy!' : 'Join the Budzz Team'}
        </h2>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
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
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label htmlFor="mmccId" className="block text-sm font-medium text-gray-400 mb-1">
                  MMCC ID
                </label>
                <input
                  id="mmccId"
                  type="text"
                  value={formData.mmccId}
                  onChange={(e) => handleInputChange('mmccId', e.target.value)}
                  className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                  required={!isLogin}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                  required={!isLogin}
                />
              </div>
            </>
          )}

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-grass-primary text-white py-3 rounded-lg font-medium hover:bg-grass-primary-light transition-colors"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <p className="mt-8 text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-grass-primary hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
} 