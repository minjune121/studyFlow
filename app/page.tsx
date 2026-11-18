'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckSquare,
  HelpCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Plus,
} from 'lucide-react';
import mockData from '@/data/mockData.json';
import { Card } from '@/components/Card';
import { Badge, BadgeVariant } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';

export default function DashboardPage() {
  const [tasks, setTasks] = useState(mockData.tasks);
  const { courses, questions, user } = mockData;

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const pendingTasksCount = tasks.filter((t) => !t.isCompleted).length;
  const urgentTasksCount = tasks.filter((t) => !t.isCompleted && t.status === 'urgent').length;
  const pendingQuestionsCount = questions.filter((q) => q.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* 1. Top Header & Academic Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-on-surface tracking-tight leading-[1.25]">
            반가워요, {user.name}님! 👋
          </h1>
          <p className="text-[14px] text-on-surface-variant font-medium mt-1">
            오늘 확인해야 할 마감 임박 과제가 <span className="text-error font-bold">{urgentTasksCount}건</span> 있습니다.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            <span>새 학습 질문 등록</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-lg bg-primary-container text-primary flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              학기 평균 진도율
            </p>
            <p className="text-[22px] font-bold text-on-surface mt-0.5">
              {user.averageProgress}%
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-lg bg-secondary-container text-secondary flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              수강 중인 과목
            </p>
            <p className="text-[22px] font-bold text-on-surface mt-0.5">
              {courses.length}개 강좌 <span className="text-[13px] font-medium text-on-surface-variant">({courses.reduce((acc, c) => acc + c.credits, 0)}학점)</span>
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-lg bg-error-container text-error flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              남은 할 일 / 과제
            </p>
            <p className="text-[22px] font-bold text-on-surface mt-0.5">
              {pendingTasksCount}건 <span className="text-[12px] font-semibold text-error">(긴급 {urgentTasksCount})</span>
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 rounded-lg bg-tertiary-container text-tertiary flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              대기 중인 Q&A
            </p>
            <p className="text-[22px] font-bold text-on-surface mt-0.5">
              {pendingQuestionsCount}건 <span className="text-[12px] font-medium text-on-surface-variant">답변 대기</span>
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Main Dashboard Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 강의 진행률 (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-semibold text-on-surface">
                수강 강의 진행률
              </h2>
              <p className="text-[13px] text-on-surface-variant">
                과목별 온라인 VOD 및 강의 진도를 확인하세요.
              </p>
            </div>
            <Link
              href="/courses"
              className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1"
            >
              전체 보기 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Card key={course.id} className="hover:border-primary/40 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-primary bg-primary-container px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <span className="text-[12px] font-medium text-on-surface-variant">
                      {course.type} · {course.credits}학점
                    </span>
                  </div>
                  {course.isOnline ? (
                    <Badge variant="info">
                      <PlayCircle className="w-3 h-3" />
                      VOD 비대면
                    </Badge>
                  ) : (
                    <Badge variant="neutral">오프라인</Badge>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="text-[16px] font-bold text-on-surface leading-snug">
                    {course.name}
                  </h3>
                  <p className="text-[13px] text-on-surface-variant mt-0.5">
                    {course.professor} · {course.schedule}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-on-surface-variant font-medium">
                      강의 진도 ({course.completedLectures}/{course.totalLectures}강)
                    </span>
                    <span className="font-bold text-on-surface">{course.progress}%</span>
                  </div>
                  <ProgressBar progress={course.progress} color={course.color} size="md" />
                </div>

                <div className="mt-4 pt-3 border-t border-[#eff4ff] flex items-center justify-between text-[12px] text-on-surface-variant">
                  <span className="truncate max-w-[200px]" title={course.recentTopic}>
                    📌 {course.recentTopic}
                  </span>
                  <Link
                    href={`/courses`}
                    className="text-primary font-semibold hover:underline shrink-0 ml-2"
                  >
                    학습하기 →
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Q&A 질문함 미리보기 */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[18px] font-semibold text-on-surface">
                  최근 강의 Q&A
                </h2>
                <p className="text-[13px] text-on-surface-variant">
                  교수님과 조교님의 실시간 답변 현황입니다.
                </p>
              </div>
              <Link
                href="/questions"
                className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1"
              >
                전체 질문 <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {questions.map((q) => (
                <Card key={q.id} className="p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-primary">
                        [{q.courseName}]
                      </span>
                      <span className="text-[11px] text-outline">{q.createdAt}</span>
                    </div>
                    <Badge variant={q.status === 'answered' ? 'success' : 'warning'}>
                      {q.statusLabel}
                    </Badge>
                  </div>

                  <h4 className="text-[14px] font-semibold text-on-surface mt-2 hover:text-primary transition-colors cursor-pointer">
                    {q.title}
                  </h4>
                  <p className="text-[13px] text-on-surface-variant line-clamp-1 mt-1">
                    {q.content}
                  </p>

                  {q.lastReply && (
                    <div className="mt-3 p-2.5 rounded-md bg-surface-low border border-[#eff4ff] text-[12px] text-on-surface-variant">
                      <p className="line-clamp-1">
                        <span className="font-semibold text-primary">💬 답변: </span>
                        {q.lastReply}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 할 일 및 마감 임박 (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-on-surface">
              할 일 & 과제 마감
            </h2>
            <span className="text-[12px] font-semibold text-on-surface-variant">
              {tasks.filter((t) => !t.isCompleted).length}개 남음
            </span>
          </div>

          <Card className="divide-y divide-[#eff4ff] p-0 overflow-hidden">
            {tasks.map((task) => {
              const badgeVariant: BadgeVariant =
                task.isCompleted
                  ? 'neutral'
                  : task.status === 'urgent'
                  ? 'urgent'
                  : task.status === 'warning'
                  ? 'warning'
                  : 'neutral';

              return (
                <div
                  key={task.id}
                  className={`p-4 flex items-start gap-3 transition-colors ${
                    task.isCompleted ? 'bg-surface/50 opacity-60' : 'hover:bg-surface-low'
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-0.5 text-outline hover:text-primary transition-colors shrink-0"
                    title={task.isCompleted ? '완료 취소' : '완료하기'}
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-success fill-success/10" />
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-outline-variant hover:border-primary transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-on-surface-variant">
                        {task.courseName}
                      </span>
                      <span className="text-[10px] text-outline">· {task.category}</span>
                    </div>

                    <p
                      className={`text-[13px] font-medium text-on-surface mt-1 leading-snug ${
                        task.isCompleted ? 'line-through text-outline' : ''
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      <span className="text-[11px] text-outline flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <Badge variant={badgeVariant}>{task.dDay}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>

          {/* Quick Notice Card */}
          <div className="p-4 rounded-lg bg-surface-container border border-[#dbe7ff]">
            <div className="flex items-center gap-2 text-primary font-bold text-[13px]">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span>중간고사 & 출석 점검 알림</span>
            </div>
            <p className="text-[12px] text-on-surface-variant mt-2 leading-relaxed">
              전자출결 누락 방지를 위해 이번 주 금요일까지 VOD 수강을 완료해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
