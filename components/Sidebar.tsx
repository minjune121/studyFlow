'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  HelpCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: '대시보드', href: '/', icon: LayoutDashboard },
  { name: '강의 진행률', href: '/courses', icon: BookOpen },
  { name: '할 일 & 마감', href: '/tasks', icon: CheckSquare },
  { name: '질문 & 답변', href: '/questions', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] fixed top-0 bottom-0 left-0 bg-white border-r border-[#eff4ff] flex flex-col z-30">
      {/* Brand Header */}
      <div className="h-[64px] flex items-center px-6 border-b border-[#eff4ff]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-on-surface tracking-tight flex items-center gap-1">
              StudyFlow
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-outline tracking-wider uppercase">
          학습 관리
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-[14px] font-medium transition-colors ${
                isActive
                  ? 'bg-primary-container text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-low hover:text-on-surface'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#eff4ff]">
        <div className="p-3 rounded-lg bg-surface-low border border-[#eff4ff]">
          <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">
            2024-2학기 재학 중
          </p>
          <p className="text-[13px] font-semibold text-on-surface mt-0.5">
            컴퓨터공학과 20241082
          </p>
          <div className="mt-2 pt-2 border-t border-[#dbe7ff] flex justify-between items-center text-[11px] text-on-surface-variant">
            <span>목표 학점</span>
            <span className="font-bold text-primary">18학점 (6과목)</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
