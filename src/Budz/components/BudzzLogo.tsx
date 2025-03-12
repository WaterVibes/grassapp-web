import React from 'react';

export const BudzzLogo: React.FC = () => {
  return (
    <svg
      width="200"
      height="80"
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="200" height="80" rx="8" fill="transparent" />
      
      {/* Text */}
      <text
        x="100"
        y="50"
        fontFamily="Arial"
        fontSize="48"
        fontWeight="bold"
        fill="#22C55E"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Budzz
      </text>
      
      {/* Leaf Icon */}
      <path
        d="M160 30C160 30 150 40 150 50C150 55.5228 154.477 60 160 60C165.523 60 170 55.5228 170 50C170 40 160 30 160 30Z"
        fill="#22C55E"
      />
    </svg>
  );
}; 