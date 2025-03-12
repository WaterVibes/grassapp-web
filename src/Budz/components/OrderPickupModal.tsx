import React, { useEffect, useState } from 'react';
import { OrderAssignment } from '../../types/buddy';

interface OrderPickupModalProps {
  dispensary: {
    name: string;
    image: string;
  };
  onAccept: () => void;
  onDecline: () => void;
  onTimeout?: () => void;
}

export const OrderPickupModal: React.FC<OrderPickupModalProps> = ({
  dispensary,
  onAccept,
  onDecline,
  onTimeout
}) => {
  const [isMuted, setIsMuted] = useState(() => {
    // Initialize from localStorage, default to false if not set
    const saved = localStorage.getItem('orderNotificationsMuted');
    return saved ? JSON.parse(saved) : false;
  });

  // Save mute preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('orderNotificationsMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  // Play notification sound when modal appears (if not muted)
  useEffect(() => {
    if (!isMuted) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(error => {
        console.warn('Error playing notification sound:', error);
      });
    }
  }, [isMuted]);

  // Auto-dismiss timer
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Order pickup modal timed out');
      onTimeout?.();
      onDecline();
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [onTimeout, onDecline]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] p-4">
      <div className="w-full max-w-md bg-black rounded-3xl border border-green-500 p-6 flex flex-col items-center animate-fade-in">
        <div className="w-full flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white text-center flex-1">
            Order Ready for Pick Up
          </h2>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-green-500/10 rounded-full transition-colors"
            title={isMuted ? "Unmute notifications" : "Mute notifications"}
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400">
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z" />
                <path d="M18.44 12c0-1.088.304-2.1.832-2.963a.75.75 0 00-1.283-.774A6.99 6.99 0 0016.99 12c0 1.32.366 2.549 1 3.738a.75.75 0 101.283-.775A5.49 5.49 0 0118.44 12z" />
                <path d="M21.39 11.04a.75.75 0 00-1.08-1.037 8.99 8.99 0 01-.188.186.75.75 0 001.068 1.052 10.492 10.492 0 00.2-.2z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
          <img
            src={dispensary.image}
            alt={dispensary.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/dispensary-default.jpg';
            }}
          />
        </div>

        <h3 className="text-xl text-white font-semibold mb-4">
          {dispensary.name}
        </h3>

        {/* Timer indicator */}
        <div className="w-full h-1 bg-gray-800 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-green-500 animate-timer" 
            style={{
              animation: 'timer 10s linear forwards'
            }}
          />
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={onAccept}
            className="w-full bg-transparent border-2 border-green-500 hover:bg-green-500/10 text-white rounded-full py-3 px-6 font-semibold transition-colors"
          >
            Accept
          </button>
          
          <button
            onClick={onDecline}
            className="w-full bg-transparent border-2 border-green-500 hover:bg-green-500/10 text-white rounded-full py-3 px-6 font-semibold transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}; 