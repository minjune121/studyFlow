'use client';

import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_STYLES = {
  sm: {
    tab: 'px-2.5 py-1 text-[12px] gap-1.5',
    badge: 'text-[10px] px-1.5 py-0.2',
  },
  md: {
    tab: 'px-3.5 py-1.5 text-[13px] gap-2',
    badge: 'text-[11px] px-2 py-0.5',
  },
  lg: {
    tab: 'px-4 py-2 text-[14px] gap-2.5',
    badge: 'text-[12px] px-2.5 py-0.5',
  },
};

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  size = 'md',
  className = '',
}: TabsProps) {
  const sizeConfig = SIZE_STYLES[size];

  if (variant === 'segmented') {
    return (
      <div
        role="tablist"
        className={`inline-flex items-center p-1 bg-surface-low rounded-[8px] border border-[#eff4ff] ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`flex items-center justify-center font-medium rounded-[6px] transition-all ${
                sizeConfig.tab
              } ${
                tab.disabled
                  ? 'opacity-40 cursor-not-allowed text-outline'
                  : isActive
                  ? 'bg-white text-primary shadow-card font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/50'
              }`}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full font-semibold ${sizeConfig.badge} ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div
        role="tablist"
        className={`flex items-center gap-6 border-b border-[#eff4ff] ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`flex items-center pb-2.5 -mb-px font-medium border-b-2 transition-colors ${
                sizeConfig.tab
              } ${
                tab.disabled
                  ? 'opacity-40 cursor-not-allowed border-transparent text-outline'
                  : isActive
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant/60'
              }`}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full font-semibold ${sizeConfig.badge} ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-low text-on-surface-variant'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: 'pills'
  return (
    <div
      role="tablist"
      className={`flex flex-wrap items-center gap-1.5 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`flex items-center font-medium rounded-[8px] transition-colors border ${
              sizeConfig.tab
            } ${
              tab.disabled
                ? 'opacity-40 cursor-not-allowed border-transparent text-outline'
                : isActive
                ? 'bg-primary text-white border-primary shadow-sm font-semibold'
                : 'bg-white border-[#eff4ff] text-on-surface-variant hover:bg-surface-low hover:text-on-surface'
            }`}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`rounded-full font-semibold ${sizeConfig.badge} ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-low text-on-surface-variant'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
