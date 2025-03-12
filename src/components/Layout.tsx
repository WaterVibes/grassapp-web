'use client';

import React, { type ReactNode } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { CartButton } from './cart/CartButton';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps): React.ReactElement => {
  return (
    <div className="min-h-screen bg-grass-bg text-white">
      <nav className="fixed top-0 w-full bg-grass-bg-light border-b border-grass-primary/20 backdrop-blur-lg z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            GrassApp
          </div>
          <div className="flex items-center gap-4">
            <CartButton />
            <button className="lg:hidden p-2 text-white hover:text-grass-accent transition-colors">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-16 container mx-auto px-4 pb-20 lg:pb-4">
        {children}
      </main>

      {/* Bottom navigation for mobile */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-grass-bg-light border-t border-grass-primary/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-around">
          {/* We'll add navigation items here later */}
        </div>
      </nav>
    </div>
  );
};

export default Layout; 