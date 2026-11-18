import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  progress,
  color = '#4f46e5',
  showLabel = false,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  const sizeHeights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-[12px] font-medium text-on-surface-variant">
          <span>진도율</span>
          <span className="font-semibold text-on-surface">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-[#e5edff] rounded-full overflow-hidden ${sizeHeights[size]}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
