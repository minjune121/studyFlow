'use client';

import React from 'react';
import { Bell, Calendar, Search, User } from 'lucide-react';
import mockData from '@/data/mockData.json';

export function Topbar() {
  const { user } = mockData;

  return (
    <header className="h-[64px] fixed top-0 right-0 left-[240px] bg-white/90 backdrop-blur-md border-b border-[#eff4ff] z-20 flex items-center justify-between px-8">
      {/* Search / Info Bar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="강의명, 과제, 질문 검색..."
            className="w-[280px] pl-9 pr-4 py-1.5 text-[13px] bg-surface-low border border-[#eff4ff] rounded-md focus:outline-none focus:border-primary/50 text-on-surface placeholder:text-outline"
          />
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-[12px] font-medium text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-md">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>{user.semester}</span>
        </div>
      </div>

      {/* Action & Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-md text-on-surface-variant hover:bg-surface-low transition-colors"
          title="알림"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-white" />
        </button>

        {/* User Chip */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#eff4ff]">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[13px]">
            {user.name[0]}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[13px] font-semibold text-on-surface leading-tight">
              {user.name}
            </p>
            <p className="text-[11px] text-on-surface-variant font-medium">
              {user.major}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
