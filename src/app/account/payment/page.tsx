'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ACHAccount {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  lastFour: string;
  isDefault: boolean;
}

interface CryptoWallet {
  id: string;
  type: 'BTC' | 'ETH' | 'USDC';
  address: string;
  isDefault: boolean;
}

const MOCK_ACH_ACCOUNTS: ACHAccount[] = [
  {
    id: '1',
    bankName: 'Chase Bank',
    accountType: 'checking',
    lastFour: '4567',
    isDefault: true
  }
];

const MOCK_CRYPTO_WALLETS: CryptoWallet[] = [
  {
    id: '1',
    type: 'ETH',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    isDefault: true
  }
];

const SUPPORTED_CRYPTO = [
  { type: 'BTC', name: 'Bitcoin', icon: '₿' },
  { type: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { type: 'USDC', name: 'USD Coin', icon: '$' }
];

export default function Payment() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ach' | 'crypto'>('ach');
  const [showAddACH, setShowAddACH] = useState(false);
  const [showAddCrypto, setShowAddCrypto] = useState(false);
  const [achAccounts, setAchAccounts] = useState<ACHAccount[]>(MOCK_ACH_ACCOUNTS);
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>(MOCK_CRYPTO_WALLETS);

  // New ACH account form state
  const [newACH, setNewACH] = useState({
    bankName: '',
    accountType: 'checking' as const,
    routingNumber: '',
    accountNumber: ''
  });

  // New crypto wallet form state
  const [newCrypto, setNewCrypto] = useState({
    type: 'BTC' as const,
    address: ''
  });

  const handleAddACH = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: ACHAccount = {
      id: Math.random().toString(),
      bankName: newACH.bankName,
      accountType: newACH.accountType,
      lastFour: newACH.accountNumber.slice(-4),
      isDefault: achAccounts.length === 0
    };
    setAchAccounts([...achAccounts, newAccount]);
    setShowAddACH(false);
    setNewACH({ bankName: '', accountType: 'checking', routingNumber: '', accountNumber: '' });
  };

  const handleAddCrypto = (e: React.FormEvent) => {
    e.preventDefault();
    const newWallet: CryptoWallet = {
      id: Math.random().toString(),
      type: newCrypto.type,
      address: newCrypto.address,
      isDefault: cryptoWallets.length === 0
    };
    setCryptoWallets([...cryptoWallets, newWallet]);
    setShowAddCrypto(false);
    setNewCrypto({ type: 'BTC', address: '' });
  };

  const handleRemoveACH = (id: string) => {
    setAchAccounts(achAccounts.filter(account => account.id !== id));
  };

  const handleRemoveCrypto = (id: string) => {
    setCryptoWallets(cryptoWallets.filter(wallet => wallet.id !== id));
  };

  const handleSetDefaultACH = (id: string) => {
    setAchAccounts(accounts =>
      accounts.map(account => ({
        ...account,
        isDefault: account.id === id
      }))
    );
  };

  const handleSetDefaultCrypto = (id: string) => {
    setCryptoWallets(wallets =>
      wallets.map(wallet => ({
        ...wallet,
        isDefault: wallet.id === id
      }))
    );
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
            <h1 className="text-xl font-bold">Payment Methods</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Payment Method Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('ach')}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'ach'
                ? 'bg-grass-primary text-white'
                : 'bg-grass-bg-light text-gray-400 hover:text-white'
            }`}
          >
            ACH Transfer
          </button>
          <button
            onClick={() => setActiveTab('crypto')}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'crypto'
                ? 'bg-grass-primary text-white'
                : 'bg-grass-bg-light text-gray-400 hover:text-white'
            }`}
          >
            Cryptocurrency
          </button>
        </div>

        {/* ACH Section */}
        {activeTab === 'ach' && (
          <div className="space-y-4">
            {/* ACH Accounts List */}
            {achAccounts.map(account => (
              <div
                key={account.id}
                className="bg-grass-bg-light rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {account.bankName}
                    {account.isDefault && (
                      <span className="text-xs bg-grass-primary/20 text-grass-primary px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} •••• {account.lastFour}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!account.isDefault && (
                    <>
                      <button
                        onClick={() => handleSetDefaultACH(account.id)}
                        className="p-2 text-grass-primary hover:text-grass-primary-light transition-colors"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveACH(account.id)}
                        className="p-2 text-red-500 hover:text-red-400 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Add ACH Account Button */}
            {!showAddACH && (
              <button
                onClick={() => setShowAddACH(true)}
                className="w-full py-4 rounded-xl border-2 border-dashed border-grass-primary/20 text-grass-primary hover:bg-grass-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Add Bank Account
              </button>
            )}

            {/* Add ACH Account Form */}
            {showAddACH && (
              <form onSubmit={handleAddACH} className="bg-grass-bg-light rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={newACH.bankName}
                    onChange={(e) => setNewACH({ ...newACH, bankName: e.target.value })}
                    className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Account Type</label>
                  <select
                    value={newACH.accountType}
                    onChange={(e) => setNewACH({ ...newACH, accountType: e.target.value as 'checking' | 'savings' })}
                    className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Routing Number</label>
                  <input
                    type="text"
                    value={newACH.routingNumber}
                    onChange={(e) => setNewACH({ ...newACH, routingNumber: e.target.value })}
                    className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                    pattern="[0-9]{9}"
                    maxLength={9}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={newACH.accountNumber}
                    onChange={(e) => setNewACH({ ...newACH, accountNumber: e.target.value })}
                    className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                    pattern="[0-9]{4,17}"
                    maxLength={17}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddACH(false)}
                    className="flex-1 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-grass-primary rounded-lg hover:bg-grass-primary-light transition-colors"
                  >
                    Add Account
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Crypto Section */}
        {activeTab === 'crypto' && (
          <div className="space-y-4">
            {/* Crypto Wallets List */}
            {cryptoWallets.map(wallet => (
              <div
                key={wallet.id}
                className="bg-grass-bg-light rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {SUPPORTED_CRYPTO.find(c => c.type === wallet.type)?.name}
                    {wallet.isDefault && (
                      <span className="text-xs bg-grass-primary/20 text-grass-primary px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 font-mono">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!wallet.isDefault && (
                    <>
                      <button
                        onClick={() => handleSetDefaultCrypto(wallet.id)}
                        className="p-2 text-grass-primary hover:text-grass-primary-light transition-colors"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveCrypto(wallet.id)}
                        className="p-2 text-red-500 hover:text-red-400 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Add Crypto Wallet Button */}
            {!showAddCrypto && (
              <button
                onClick={() => setShowAddCrypto(true)}
                className="w-full py-4 rounded-xl border-2 border-dashed border-grass-primary/20 text-grass-primary hover:bg-grass-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Add Crypto Wallet
              </button>
            )}

            {/* Add Crypto Wallet Form */}
            {showAddCrypto && (
              <form onSubmit={handleAddCrypto} className="bg-grass-bg-light rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Cryptocurrency</label>
                  <select
                    value={newCrypto.type}
                    onChange={(e) => setNewCrypto({ ...newCrypto, type: e.target.value as 'BTC' | 'ETH' | 'USDC' })}
                    className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                  >
                    {SUPPORTED_CRYPTO.map(crypto => (
                      <option key={crypto.type} value={crypto.type}>
                        {crypto.icon} {crypto.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Wallet Address</label>
                  <input
                    type="text"
                    value={newCrypto.address}
                    onChange={(e) => setNewCrypto({ ...newCrypto, address: e.target.value })}
                    className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none font-mono"
                    placeholder="0x..."
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddCrypto(false)}
                    className="flex-1 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-grass-primary rounded-lg hover:bg-grass-primary-light transition-colors"
                  >
                    Add Wallet
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 