import React from 'react';
import { cn } from '@/lib/utils';

interface CustomSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export function CustomSpinner({ 
  size = 60, 
  color = '#B8C1EC', 
  className 
}: CustomSpinnerProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="custom-spinner"
      >
        {/* L shape */}
        <path
          d="M30 20 L30 70 L60 70"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* M shape */}
        <path
          d="M65 20 L65 70 M65 30 L75 50 L85 30 M85 30 L85 70"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Quotation marks */}
        <path
          d="M60 15 L65 20 M70 15 L75 20"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}