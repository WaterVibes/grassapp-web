'use client';

import { useState } from 'react';
import { KeyIcon } from '@heroicons/react/24/outline';

interface ApiKeyConfigProps {
  onSave: (apiKey: string) => void;
  isConfigured: boolean;
}

export function ApiKeyConfig({ onSave, isConfigured }: ApiKeyConfigProps) {
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(!isConfigured);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      setIsEditing(false);
    }
  };

  if (!isEditing && isConfigured) {
    return (
      <div className="flex items-center justify-between p-4 bg-grass-bg-light rounded-xl border border-grass-primary/20">
        <div className="flex items-center gap-2">
          <KeyIcon className="w-5 h-5 text-grass-primary" />
          <span className="text-white">API Key Configured</span>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-grass-primary hover:text-grass-primary-light transition-colors"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-grass-bg-light rounded-xl border border-grass-primary/20">
        <h3 className="text-lg font-semibold mb-2">Weedmaps API Configuration</h3>
        <p className="text-sm text-gray-400 mb-4">
          Enter your Weedmaps API key to access dispensary data.
        </p>
        <div className="space-y-2">
          <label htmlFor="apiKey" className="block text-sm font-medium">
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 bg-grass-bg border border-grass-primary/20 rounded-lg focus:outline-none focus:border-grass-primary transition-colors"
            placeholder="Enter your Weedmaps API key"
            required
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-grass-primary hover:bg-grass-primary-light text-white py-2 px-4 rounded-lg transition-colors"
          >
            Save API Key
          </button>
        </div>
      </div>
    </form>
  );
} 