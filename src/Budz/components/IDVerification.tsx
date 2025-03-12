'use client';

import React, { useState } from 'react';
import { Patient } from '../../types/buddy';

interface IDVerificationProps {
  patient: Patient;
  onVerificationComplete: (success: boolean) => void;
}

export const IDVerification: React.FC<IDVerificationProps> = ({
  patient,
  onVerificationComplete
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'initial' | 'scanning' | 'confirming'>('initial');
  const [scannedId, setScannedId] = useState<string>('');

  const handleScanStart = () => {
    setIsScanning(true);
    setVerificationStep('scanning');
    // Simulate ID scanning
    setTimeout(() => {
      setScannedId(patient.mmccId);
      setVerificationStep('confirming');
      setIsScanning(false);
    }, 2000);
  };

  const handleVerification = (verified: boolean) => {
    onVerificationComplete(verified);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">MMCC ID Verification</h2>
        
        {verificationStep === 'initial' && (
          <div>
            <p className="text-gray-300 mb-4">
              Please verify the patient's MMCC ID before proceeding with the delivery.
            </p>
            <button
              onClick={handleScanStart}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold"
            >
              Scan MMCC ID
            </button>
          </div>
        )}

        {verificationStep === 'scanning' && (
          <div className="text-center">
            <div className="animate-pulse mb-4">
              <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-300">Scanning ID...</p>
          </div>
        )}

        {verificationStep === 'confirming' && (
          <div>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-gray-300 mb-2">Scanned MMCC ID:</p>
              <p className="text-white font-mono text-lg">{scannedId}</p>
            </div>
            <p className="text-gray-300 mb-4">
              Does the scanned ID match the patient's MMCC ID?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleVerification(false)}
                className="bg-red-500 text-white py-3 rounded-lg font-semibold"
              >
                No, Retry
              </button>
              <button
                onClick={() => handleVerification(true)}
                className="bg-green-500 text-white py-3 rounded-lg font-semibold"
              >
                Yes, Verify
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 