import React from 'react';

export type BadgeVariant = 'urgent' | 'warning' | 'success' | 'info' | 'primary' | 'secondary' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    urgent: 'bg-[#fee2e2] text-[#ef4444] border-[#ef4444]/30',
    warning: 'bg-[#fef3c7] text-[#b45309] border-[#f59e0b]/30',
    success: 'bg-[#d1fae5] text-[#047857] border-[#10b981]/30',
    info: 'bg-[#e0f2fe] text-[#0369a1] border-[#0284c7]/30',
    primary: 'bg-[#e0e7ff] text-[#3730a3] border-[#4f46e5]/30',
    secondary: 'bg-[#eef2ff] text-[#312e81] border-[#6366f1]/30',
    neutral: 'bg-surface-low text-on-surface-variant border-outline-variant/40',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[9999px] text-[11px] font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
