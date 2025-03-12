import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateMMCCInfo } from '@/store/authSlice';

interface MMCCVerificationProps {
  onVerified: () => void;
  onCancel: () => void;
}

export default function MMCCVerification({ onVerified, onCancel }: MMCCVerificationProps) {
  const dispatch = useAppDispatch();
  const [mmccId, setMMCCId] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [type, setType] = useState<'patient' | 'caregiver' | 'minor'>('patient');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate MMCC ID format (example: P03F-1783-82E8-87DE)
    const mmccFormat = /^[PCM]\d{2}[A-Z]-\d{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!mmccFormat.test(mmccId)) {
      setError('Invalid MMCC ID format');
      return;
    }

    // Validate expiration date is in the future
    const expDate = new Date(expirationDate);
    if (expDate <= new Date()) {
      setError('MMCC card has expired');
      return;
    }

    // In a real application, this would make an API call to verify the MMCC ID
    // For now, we'll simulate verification
    dispatch(updateMMCCInfo({
      id: mmccId,
      expirationDate,
      type,
      isVerified: true
    }));

    onVerified();
  };

  return (
    <div className="bg-grass-bg-light p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">MMCC Verification Required</h2>
      <p className="text-gray-400 mb-4">
        Delivery orders require a valid Maryland Medical Cannabis Commission (MMCC) card.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">MMCC ID</label>
          <input
            type="text"
            value={mmccId}
            onChange={(e) => setMMCCId(e.target.value.toUpperCase())}
            placeholder="P03F-1783-82E8-87DE"
            className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expiration Date</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Card Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'patient' | 'caregiver' | 'minor')}
            className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
          >
            <option value="patient">Patient</option>
            <option value="caregiver">Caregiver</option>
            <option value="minor">Minor</option>
          </select>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-grass-primary hover:bg-grass-primary-light text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Verify
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 