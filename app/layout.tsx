import './globals.css';
import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';

export const metadata: Metadata = {
  title: 'StudyFlow - 올인원 대학생 학습 관리 시스템',
  description: '강의 진행률 · 할 일 · 질문을 한 화면에서 체계적으로 관리하는 학습관리 웹앱',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-surface text-on-surface antialiased">
        <Sidebar />
        <Topbar />
        <main className="ml-[240px] pt-[64px] min-h-screen">
          <div className="max-w-[1440px] mx-auto p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
