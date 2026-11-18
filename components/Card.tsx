import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function Card({
  children,
  className = '',
  headerAction,
  title,
  subtitle,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white border border-[#eff4ff] rounded-[8px] p-5 shadow-card ${className}`}
      {...props}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#eff4ff]">
          <div>
            {title && (
              <h3 className="text-[18px] font-semibold text-on-surface leading-[1.4]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[12px] text-on-surface-variant font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
