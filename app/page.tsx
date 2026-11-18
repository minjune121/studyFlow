'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Filter,
  X,
  Calendar,
  Sparkles,
  AlertCircle,
  Trash2,
  Check,
  GraduationCap,
} from 'lucide-react';
import mockData from '@/data/mockData.json';
import { Card } from '@/components/Card';
import { Badge, BadgeVariant } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';

type CourseFilterType = 'all' | 'major' | 'general' | 'online';
type TaskFilterType = 'all' | 'urgent' | 'in_progress' | 'completed';

interface TaskItem {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  dueDate: string;
  dDay: string;
  status: string;
  category: string;
  isCompleted: boolean;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(mockData.tasks);
  const { courses, questions, user } = mockData;

  // Filter States
  const [courseFilter, setCourseFilter] = useState<CourseFilterType>('all');
  const [taskFilter, setTaskFilter] = useState<TaskFilterType>('all');

  // Quick Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskCourseId, setTaskCourseId] = useState(courses[0]?.id || '');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('과제');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<'urgent' | 'warning' | 'normal'>('warning');
  const [formError, setFormError] = useState('');

  // Set default due date when modal opens (tomorrow 23:59)
  useEffect(() => {
    if (isTaskModalOpen && !taskDueDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 0, 0);
      const iso = tomorrow.toISOString().slice(0, 16);
      setTaskDueDate(iso);
    }
  }, [isTaskModalOpen, taskDueDate]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTaskModalOpen) {
        setIsTaskModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen]);

  // Task Toggle
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.isCompleted;
          return {
            ...t,
            isCompleted: nextCompleted,
            dDay: nextCompleted ? '완료' : t.dDay === '완료' ? 'D-Day' : t.dDay,
            status: nextCompleted ? 'success' : t.status === 'success' ? 'normal' : t.status,
          };
        }
        return t;
      })
    );
  };

  // Task Delete
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Add Task Handler
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setFormError('할 일 또는 과제명을 입력해 주세요.');
      return;
    }

    const selectedCourse = courses.find((c) => c.id === taskCourseId);
    const courseName = selectedCourse ? selectedCourse.name : '기타/자율학습';

    // Calculate D-Day
    let calculatedDDay = 'D-Day';
    if (taskDueDate) {
      const now = new Date();
      const due = new Date(taskDueDate);
      const diffTime = due.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        calculatedDDay = `D-${diffDays}`;
      } else if (diffDays === 0) {
        calculatedDDay = 'D-Day';
      } else {
        calculatedDDay = `D+${Math.abs(diffDays)}`;
      }
    }

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      courseId: taskCourseId || 'general',
      courseName,
      title: taskTitle.trim(),
      dueDate: taskDueDate || new Date().toISOString(),
      dDay: calculatedDDay,
      status: taskPriority,
      category: taskCategory,
      isCompleted: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsTaskModalOpen(false);
    setTaskTitle('');
    setFormError('');
  };

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (courseFilter === 'major') return course.type.includes('전공');
      if (courseFilter === 'general') return course.type.includes('교양');
      if (courseFilter === 'online') return !!course.isOnline;
      return true;
    });
  }, [courses, courseFilter]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (taskFilter === 'urgent') {
        return !task.isCompleted && (task.status === 'urgent' || task.dDay === 'D-1' || task.dDay === 'D-Day');
      }
      if (taskFilter === 'in_progress') {
        return !task.isCompleted && task.status !== 'urgent';
      }
      if (taskFilter === 'completed') {
        return task.isCompleted;
      }
      return true;
    });
  }, [tasks, taskFilter]);

  // Computed Metrics
  const pendingTasksCount = tasks.filter((t) => !t.isCompleted).length;
  const urgentTasksCount = tasks.filter((t) => !t.isCompleted && (t.status === 'urgent' || t.dDay === 'D-1')).length;
  const inProgressTasksCount = tasks.filter((t) => !t.isCompleted && t.status !== 'urgent').length;
  const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
  const pendingQuestionsCount = questions.filter((q) => q.status === 'pending').length;
  const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
  const majorCredits = courses.filter((c) => c.type.includes('전공')).reduce((acc, c) => acc + c.credits, 0);
  const generalCredits = courses.filter((c) => c.type.includes('교양')).reduce((acc, c) => acc + c.credits, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Top Header & Academic Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[26px] md:text-[28px] font-bold text-on-surface tracking-tight leading-[1.25]">
              반가워요, {user.name}님! 👋
            </h1>
            <span className="text-[12px] font-semibold text-primary bg-primary-container/80 px-2.5 py-0.5 rounded-full border border-primary/20">
              {user.semester}
            </span>
          </div>
          <p className="text-[14px] text-on-surface-variant font-medium mt-1">
            오늘 확인해야 할 마감 임박 과제가{' '}
            <span className="text-error font-bold">{urgentTasksCount}건</span> 있습니다. 이번 주 목표를 달성해 보세요!
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-[13px] font-semibold rounded-md hover:bg-primary/90 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>새 할 일 등록</span>
          </button>
          <Link
            href="/questions"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-lowest text-on-surface text-[13px] font-semibold rounded-md border border-[#eff4ff] hover:bg-surface-low transition-colors shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-tertiary" />
            <span>학습 Q&A 이동</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards with Trend Indicators & Progress Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: 학기 평균 진도율 */}
        <Card className="p-4 flex flex-col justify-between hover:border-primary/30 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-primary flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success-container/70 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +4.5% 전주 대비
              </span>
            </div>
            <div className="mt-3">
              <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                학기 평균 진도율
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-[24px] font-bold text-on-surface">
                  {user.averageProgress}%
                </p>
                <span className="text-[11px] font-medium text-on-surface-variant">
                  (목표 90%)
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#eff4ff]">
            <ProgressBar progress={user.averageProgress} color="#4f46e5" size="sm" />
            <p className="text-[11px] text-on-surface-variant mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary shrink-0" />
              <span>목표 달성 순항 중 · 기말 대비 +12% 필요</span>
            </p>
          </div>
        </Card>

        {/* KPI 2: 수강 중인 과목 */}
        <Card className="p-4 flex flex-col justify-between hover:border-secondary/30 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-secondary-container text-secondary flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded-full">
                이수율 61%
              </span>
            </div>
            <div className="mt-3">
              <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                수강 중인 과목
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-[24px] font-bold text-on-surface">
                  {courses.length}개 강좌
                </p>
                <span className="text-[13px] font-semibold text-on-surface-variant">
                  ({totalCredits}학점)
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#eff4ff]">
            <div className="flex justify-between items-center text-[11px] text-on-surface-variant font-medium mb-1">
              <span>전공 {majorCredits}학점</span>
              <span>교양 {generalCredits}학점</span>
            </div>
            <ProgressBar progress={Math.round((totalCredits / user.targetCredits) * 100)} color="#6366f1" size="sm" />
            <p className="text-[11px] text-on-surface-variant mt-2 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-secondary shrink-0" />
              <span>목표 {user.targetCredits}학점 중 {totalCredits}학점 편성 (잔여 7학점)</span>
            </p>
          </div>
        </Card>

        {/* KPI 3: 남은 할 일 / 과제 */}
        <Card className="p-4 flex flex-col justify-between hover:border-error/30 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-error-container text-error flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              {urgentTasksCount > 0 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-error bg-error-container px-2 py-0.5 rounded-full animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  긴급 {urgentTasksCount}건
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success-container px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                  마감 여유
                </span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                남은 할 일 / 과제
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-[24px] font-bold text-on-surface">
                  {pendingTasksCount}건
                </p>
                <span className="text-[12px] font-medium text-on-surface-variant">
                  / 총 {tasks.length}건
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#eff4ff]">
            <ProgressBar
              progress={tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0}
              color={urgentTasksCount > 0 ? '#ef4444' : '#10b981'}
              size="sm"
            />
            <p className="text-[11px] text-on-surface-variant mt-2 flex items-center justify-between">
              <span>진행 완료율 {tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0}%</span>
              <span className="text-error font-semibold">이번 주 마감 2건</span>
            </p>
          </div>
        </Card>

        {/* KPI 4: 대기 중인 Q&A */}
        <Card className="p-4 flex flex-col justify-between hover:border-tertiary/30 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-tertiary-container text-tertiary flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-tertiary bg-tertiary-container px-2 py-0.5 rounded-full">
                답변율 67%
              </span>
            </div>
            <div className="mt-3">
              <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                대기 중인 Q&A
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-[24px] font-bold text-on-surface">
                  {pendingQuestionsCount}건
                </p>
                <span className="text-[12px] font-medium text-on-surface-variant">
                  답변 대기
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#eff4ff]">
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>평균 응답 소요 시간</span>
              <span className="font-bold text-tertiary">4.2시간</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-2 truncate">
              최근: [웹 프론트엔드] 교수 답변 완료
            </p>
          </div>
        </Card>
      </div>

      {/* Academic Smart Coaching Insight Banner */}
      <div className="p-4 rounded-lg bg-surface-low border border-[#dbe7ff] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-on-surface">
              금주 학업 인사이트 & 코칭 브리핑
            </h4>
            <p className="text-[12px] text-on-surface-variant mt-0.5">
              💡 <span className="font-semibold text-error">[자료구조]</span> 과제 제출이 24시간 남았습니다. <span className="font-semibold text-primary">[웹 프론트엔드]</span> 진도율(92%)은 학과 상위 5%로 우수하게 진행 중입니다!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold px-2 py-1 bg-surface-lowest text-primary rounded border border-[#eff4ff]">
            출석률 100%
          </span>
          <span className="text-[11px] font-semibold px-2 py-1 bg-surface-lowest text-on-surface-variant rounded border border-[#eff4ff]">
            평점 4.1 / 4.5
          </span>
        </div>
      </div>

      {/* 3. Main Dashboard Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: 수강 강의 진행률 (8 Cols on LG, full on MD/Tablet) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header & Course Filter Tabs */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
                className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                강의 전체 보기 <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Course Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setCourseFilter('all')}
                className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all whitespace-nowrap ${
                  courseFilter === 'all'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                전체 ({courses.length})
              </button>
              <button
                onClick={() => setCourseFilter('major')}
                className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all whitespace-nowrap ${
                  courseFilter === 'major'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                전공 ({courses.filter((c) => c.type.includes('전공')).length})
              </button>
              <button
                onClick={() => setCourseFilter('general')}
                className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all whitespace-nowrap ${
                  courseFilter === 'general'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                교양 ({courses.filter((c) => c.type.includes('교양')).length})
              </button>
              <button
                onClick={() => setCourseFilter('online')}
                className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all whitespace-nowrap ${
                  courseFilter === 'online'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                온라인 VOD ({courses.filter((c) => c.isOnline).length})
              </button>
            </div>
          </div>

          {/* Courses Card Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:border-primary/40 transition-all flex flex-col justify-between">
                  <div>
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
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#eff4ff] flex items-center justify-between text-[12px] text-on-surface-variant">
                    <span className="truncate max-w-[190px] sm:max-w-[210px]" title={course.recentTopic}>
                      📌 {course.recentTopic}
                    </span>
                    <Link
                      href="/courses"
                      className="text-primary font-semibold hover:underline shrink-0 ml-2 inline-flex items-center gap-0.5"
                    >
                      학습하기 →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-surface-low border-dashed">
              <BookOpen className="w-8 h-8 text-outline mx-auto mb-2 opacity-50" />
              <p className="text-[14px] font-medium text-on-surface-variant">
                선택한 필터 조건에 해당하는 강좌가 없습니다.
              </p>
              <button
                onClick={() => setCourseFilter('all')}
                className="mt-3 text-[12px] font-semibold text-primary hover:underline"
              >
                전체 강좌 보기
              </button>
            </Card>
          )}

          {/* Q&A 질문함 미리보기 */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[18px] font-semibold text-on-surface">
                  최근 강의 Q&A
                </h2>
                <p className="text-[13px] text-on-surface-variant">
                  교수님과 조교님의 실시간 질의응답 현황입니다.
                </p>
              </div>
              <Link
                href="/questions"
                className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1"
              >
                전체 질문 ({questions.length}) <ArrowRight className="w-3.5 h-3.5" />
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

        {/* Right Column: 할 일 및 마감 임박 (4 Cols on LG, full on MD/Tablet) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-semibold text-on-surface">
                  할 일 & 과제 마감
                </h2>
                <span className="text-[12px] font-medium text-on-surface-variant">
                  미완료 <span className="font-bold text-primary">{pendingTasksCount}</span> / 총 {tasks.length}건
                </span>
              </div>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-md text-[12px] font-semibold transition-colors"
                title="새 과제 / 할 일 추가"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>추가</span>
              </button>
            </div>

            {/* Task Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setTaskFilter('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all whitespace-nowrap ${
                  taskFilter === 'all'
                    ? 'bg-on-surface text-white'
                    : 'bg-surface-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                전체 ({tasks.length})
              </button>
              <button
                onClick={() => setTaskFilter('urgent')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all whitespace-nowrap ${
                  taskFilter === 'urgent'
                    ? 'bg-error text-white'
                    : 'bg-surface-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                마감임박 ({urgentTasksCount})
              </button>
              <button
                onClick={() => setTaskFilter('in_progress')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all whitespace-nowrap ${
                  taskFilter === 'in_progress'
                    ? 'bg-warning text-white'
                    : 'bg-surface-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                진행중 ({inProgressTasksCount})
              </button>
              <button
                onClick={() => setTaskFilter('completed')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all whitespace-nowrap ${
                  taskFilter === 'completed'
                    ? 'bg-success text-white'
                    : 'bg-surface-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                완료 ({completedTasksCount})
              </button>
            </div>
          </div>

          {/* Tasks List */}
          {filteredTasks.length > 0 ? (
            <Card className="divide-y divide-[#eff4ff] p-0 overflow-hidden shadow-card">
              {filteredTasks.map((task) => {
                const badgeVariant: BadgeVariant = task.isCompleted
                  ? 'neutral'
                  : task.status === 'urgent'
                  ? 'urgent'
                  : task.status === 'warning'
                  ? 'warning'
                  : 'neutral';

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 flex items-start gap-3 transition-colors group ${
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
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-primary truncate max-w-[140px]">
                          {task.courseName}
                        </span>
                        <span className="text-[10px] text-outline">· {task.category}</span>
                      </div>

                      <p
                        className={`text-[13px] font-medium text-on-surface mt-1 leading-snug break-words ${
                          task.isCompleted ? 'line-through text-outline' : ''
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1 gap-2">
                        <span className="text-[11px] text-outline flex items-center gap-1 truncate">
                          <Clock className="w-3 h-3 shrink-0" />
                          {new Date(task.dueDate).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge variant={badgeVariant}>{task.dDay}</Badge>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-outline/40 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                            title="할 일 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Card>
          ) : (
            <Card className="p-6 text-center bg-surface-low border-dashed">
              <CheckSquare className="w-7 h-7 text-outline mx-auto mb-2 opacity-50" />
              <p className="text-[13px] font-medium text-on-surface-variant">
                해당 조건의 할 일 / 과제가 없습니다.
              </p>
              <button
                onClick={() => setTaskFilter('all')}
                className="mt-2 text-[12px] font-semibold text-primary hover:underline"
              >
                전체 목록 보기
              </button>
            </Card>
          )}

          {/* Quick Notice Card */}
          <div className="p-4 rounded-lg bg-surface-container border border-[#dbe7ff]">
            <div className="flex items-center gap-2 text-primary font-bold text-[13px]">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
              <span>중간고사 & 출석 점검 알림</span>
            </div>
            <p className="text-[12px] text-on-surface-variant mt-2 leading-relaxed">
              전자출결 누락 방지를 위해 이번 주 금요일까지 VOD 수강을 완료해 주세요.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Quick Task Addition Modal Dialog */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-[12px] border border-[#eff4ff] shadow-popover max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#eff4ff]">
              <div>
                <h3 className="text-[18px] font-bold text-on-surface">
                  새 할 일 / 과제 등록
                </h3>
                <p className="text-[12px] text-on-surface-variant mt-0.5">
                  수강 과목의 과제, 퀴즈, 시험 일정을 등록해 관리하세요.
                </p>
              </div>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-outline hover:text-on-surface p-1 rounded-md hover:bg-surface-low transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              {formError && (
                <div className="p-2.5 rounded bg-error-container text-error text-[12px] font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Course Selector */}
              <div>
                <label className="block text-[12px] font-semibold text-on-surface mb-1">
                  관련 과목 <span className="text-error">*</span>
                </label>
                <select
                  value={taskCourseId}
                  onChange={(e) => setTaskCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] rounded-md border border-[#c2c7d6] bg-white text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      [{course.code}] {course.name} ({course.type})
                    </option>
                  ))}
                  <option value="general">기타 / 자율 학습</option>
                </select>
              </div>

              {/* Task Title */}
              <div>
                <label className="block text-[12px] font-semibold text-on-surface mb-1">
                  과제 / 할 일 명 <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: B-Tree 구현 실습 보고서 제출"
                  value={taskTitle}
                  onChange={(e) => {
                    setTaskTitle(e.target.value);
                    if (formError) setFormError('');
                  }}
                  className="w-full px-3 py-2 text-[13px] rounded-md border border-[#c2c7d6] bg-white text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>

              {/* Category Pills */}
              <div>
                <label className="block text-[12px] font-semibold text-on-surface mb-1">
                  카테고리 분류
                </label>
                <div className="flex flex-wrap gap-2">
                  {['과제', '퀴즈', '프로젝트', '시험', '학습'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTaskCategory(cat)}
                      className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                        taskCategory === cat
                          ? 'bg-primary text-white font-semibold'
                          : 'bg-surface-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date & Time */}
              <div>
                <label className="block text-[12px] font-semibold text-on-surface mb-1">
                  마감 일시
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] rounded-md border border-[#c2c7d6] bg-white text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Urgency / Priority */}
              <div>
                <label className="block text-[12px] font-semibold text-on-surface mb-1">
                  우선순위 & 긴급도
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTaskPriority('urgent')}
                    className={`p-2 rounded-md border text-[12px] font-semibold text-center transition-colors ${
                      taskPriority === 'urgent'
                        ? 'border-error bg-error-container text-error'
                        : 'border-[#eff4ff] bg-surface-low text-on-surface-variant hover:border-error/40'
                    }`}
                  >
                    긴급 (D-1/당일)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaskPriority('warning')}
                    className={`p-2 rounded-md border text-[12px] font-semibold text-center transition-colors ${
                      taskPriority === 'warning'
                        ? 'border-warning bg-warning-container text-warning'
                        : 'border-[#eff4ff] bg-surface-low text-on-surface-variant hover:border-warning/40'
                    }`}
                  >
                    주의 (D-3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaskPriority('normal')}
                    className={`p-2 rounded-md border text-[12px] font-semibold text-center transition-colors ${
                      taskPriority === 'normal'
                        ? 'border-primary bg-primary-container text-primary'
                        : 'border-[#eff4ff] bg-surface-low text-on-surface-variant hover:border-primary/40'
                    }`}
                  >
                    일반 / 여유
                  </button>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-[#eff4ff] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 text-[13px] font-semibold text-on-surface-variant bg-surface-low hover:bg-surface-container rounded-md transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 rounded-md transition-colors shadow-sm"
                >
                  할 일 추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
