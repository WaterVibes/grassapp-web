import { SVGProps } from 'react';

export function CannabisIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22V18" />
      <path d="M12 18C8 18 4 14 4 10C4 6 7 3 11 3C13.5 3 15 4 16 5" />
      <path d="M12 18C16 18 20 14 20 10C20 6 17 3 13 3C10.5 3 9 4 8 5" />
      <path d="M12 18C9 18 6 15 6 12C6 9 8 7 11 7C12.5 7 14 8 14 9" />
      <path d="M12 18C15 18 18 15 18 12C18 9 16 7 13 7C11.5 7 10 8 10 9" />
      <path d="M12 18C10.5 18 9 16.5 9 14.5C9 12.5 10 11 12 11C13 11 14 12 14 13" />
      <path d="M12 18C13.5 18 15 16.5 15 14.5C15 12.5 14 11 12 11C11 11 10 12 10 13" />
    </svg>
  );
} 