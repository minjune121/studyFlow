'use client';

import React, { useState, useMemo } from 'react';
import mockData from '@/data/mockData.json';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  X,
  HelpCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  Send,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface QuestionItem {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  content: string;
  createdAt: string;
  status: 'answered' | 'pending';
  statusLabel: string;
  repliesCount: number;
  lastReply: string | null;
  tag?: string;
}

export default function QuestionsPage() {
  const { courses, questions: initialQuestions } = mockData;

  // Local state for questions (supports creating new questions)
  const [questions, setQuestions] = useState<QuestionItem[]>(
    initialQuestions as QuestionItem[]
  );

  // Filters
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseId, setNewCourseId] = useState<string>(courses[0]?.id || '');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('개념 질문');
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Course filter
      if (selectedCourseId !== 'all' && q.courseId !== selectedCourseId) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && q.status !== selectedStatus) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = q.title.toLowerCase().includes(query);
        const inContent = q.content.toLowerCase().includes(query);
        const inCourse = q.courseName.toLowerCase().includes(query);
        const inReply = q.lastReply ? q.lastReply.toLowerCase().includes(query) : false;
        if (!inTitle && !inContent && !inCourse && !inReply) {
          return false;
        }
      }
      return true;
    });
  }, [questions, selectedCourseId, selectedStatus, searchQuery]);

  // Handle Form Submit
  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('질문 제목을 입력해 주세요.');
      return;
    }
    if (!newContent.trim()) {
      setFormError('질문 내용을 입력해 주세요.');
      return;
    }

    const courseObj = courses.find((c) => c.id === newCourseId) || courses[0];

    const newQuestion: QuestionItem = {
      id: `q-${Date.now()}`,
      courseId: courseObj.id,
      courseName: courseObj.name,
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: '방금 전',
      status: 'pending',
      statusLabel: '답변 대기',
      repliesCount: 0,
      lastReply: null,
      tag: newTag,
    };

    setQuestions((prev) => [newQuestion, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setFormError('');
    setSuccessToast(`[${courseObj.name}] 질문이 성공적으로 등록되었습니다!`);

    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const answeredCount = questions.filter((q) => q.status === 'answered').length;
  const pendingCount = questions.filter((q) => q.status === 'pending').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg border border-emerald-500 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-[13px] font-semibold">{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-on-surface">강의 Q&A 질문함</h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            수강 과목별 질문을 등록하고 담당 교수님 및 조교님의 공식 답변을 실시간으로 확인하세요.
          </p>
        </div>
        <button
          onClick={() => {
            setFormError('');
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>질문 작성하기</span>
        </button>
      </div>

      {/* Filter and Search Bar Section */}
      <Card className="p-4 space-y-4">
        {/* Search query bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="질문 제목, 질문 내용, 과목명 또는 교수 답변 키워드를 검색하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-[14px] bg-surface-low border border-[#dbeafe] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-on-surface placeholder:text-outline"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-full hover:bg-surface-low"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Row: Course pills & Status filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-[#eff4ff]">
          {/* Course filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[12px] font-bold text-on-surface-variant shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-primary" /> 과목:
            </span>
            <button
              onClick={() => setSelectedCourseId('all')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all shrink-0 ${
                selectedCourseId === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-low text-on-surface-variant hover:bg-[#e0e7ff]'
              }`}
            >
              전체 과목 ({questions.length})
            </button>
            {courses.map((course) => {
              const count = questions.filter((q) => q.courseId === course.id).length;
              const isSelected = selectedCourseId === course.id;
              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-low text-on-surface-variant hover:bg-[#e0e7ff]'
                  }`}
                >
                  {course.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[12px] font-bold text-on-surface-variant mr-1">상태:</span>
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 text-[12px] font-semibold rounded-md border ${
                selectedStatus === 'all'
                  ? 'bg-primary-container text-primary border-primary/30'
                  : 'bg-surface text-on-surface-variant border-[#e2e8f0]'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedStatus('answered')}
              className={`px-2.5 py-1 text-[12px] font-semibold rounded-md border ${
                selectedStatus === 'answered'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                  : 'bg-surface text-on-surface-variant border-[#e2e8f0]'
              }`}
            >
              답변 완료 ({answeredCount})
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-2.5 py-1 text-[12px] font-semibold rounded-md border ${
                selectedStatus === 'pending'
                  ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold'
                  : 'bg-surface text-on-surface-variant border-[#e2e8f0]'
              }`}
            >
              답변 대기 ({pendingCount})
            </button>
          </div>
        </div>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#dbeafe] p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center mx-auto text-primary">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-[16px] font-bold text-on-surface">
              일치하는 질문이 없습니다
            </h3>
            <p className="text-[13px] text-on-surface-variant max-w-sm mx-auto">
              검색어나 필터 조건을 변경하거나, 새로운 질문을 첫 번째로 등록해 보세요.
            </p>
            <button
              onClick={() => {
                setSelectedCourseId('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-1.5 text-[12px] font-semibold text-primary hover:underline"
            >
              모든 필터 초기화
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <Card key={q.id} className="p-5 hover:border-primary/40 transition-all">
              {/* Question Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[12px] font-bold text-primary bg-primary-container px-2.5 py-0.5 rounded">
                    {q.courseName}
                  </span>
                  {q.tag && (
                    <span className="text-[11px] font-medium text-on-surface-variant bg-surface-low px-2 py-0.5 rounded">
                      #{q.tag}
                    </span>
                  )}
                  <span className="text-[12px] text-outline flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {q.createdAt}
                  </span>
                </div>
                <Badge variant={q.status === 'answered' ? 'success' : 'warning'}>
                  {q.status === 'answered' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  {q.statusLabel}
                </Badge>
              </div>

              {/* Title & Content */}
              <h3 className="text-[17px] font-bold text-on-surface mt-3">
                {q.title}
              </h3>
              <p className="text-[14px] text-on-surface-variant mt-2 leading-relaxed whitespace-pre-line">
                {q.content}
              </p>

              {/* Reply Section */}
              {q.lastReply ? (
                <div className="mt-4 p-4 rounded-xl bg-surface-low border border-[#eff4ff]">
                  <div className="flex items-center justify-between text-primary text-[12px] font-bold mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>교수 / 조교 공식 답변</span>
                    </div>
                    <span className="text-[11px] text-outline font-normal">
                      답변 수 {q.repliesCount}개
                    </span>
                  </div>
                  <p className="text-[13px] text-on-surface leading-relaxed whitespace-pre-line">
                    {q.lastReply}
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-3 rounded-lg bg-[#fffbeb] border border-[#fef3c7] text-[12px] text-amber-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    아직 등록된 답변이 없습니다. 교수님 또는 조교님이 질문을 확인하는 중입니다. (통상 24시간 이내 답변)
                  </span>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Interactive Question Creation Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-[#e2e8f0] flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-surface-low">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-container rounded-lg text-primary">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-on-surface">새 질문 작성</h3>
                  <p className="text-[12px] text-on-surface-variant">
                    수강 중인 과목을 선택하고 궁금한 점을 질문해 주세요.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#e2e8f0] text-outline hover:text-on-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateQuestion} className="p-6 space-y-4 overflow-y-auto">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[13px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Course Select */}
              <div>
                <label className="block text-[13px] font-bold text-on-surface mb-1.5">
                  수강 과목 선택 <span className="text-red-500">*</span>
                </label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[14px] bg-surface-low border border-[#dbeafe] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-on-surface"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      [{course.code}] {course.name} ({course.professor})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag / Category */}
              <div>
                <label className="block text-[13px] font-bold text-on-surface mb-1.5">
                  질문 분류
                </label>
                <div className="flex flex-wrap gap-2">
                  {['개념 질문', '실습/코드 오류', '과제/시험 문의', '강의자료 요청', '기타'].map(
                    (tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setNewTag(tag)}
                        className={`px-3 py-1 rounded-md text-[12px] font-semibold border transition-all ${
                          newTag === tag
                            ? 'bg-primary text-white border-primary'
                            : 'bg-surface text-on-surface-variant border-[#e2e8f0] hover:bg-surface-low'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Question Title */}
              <div>
                <label className="block text-[13px] font-bold text-on-surface mb-1.5">
                  질문 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="질문의 요점을 명확히 작성해 주세요 (예: B-Tree 분할 알고리즘 문의)"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (formError) setFormError('');
                  }}
                  className="w-full px-3.5 py-2.5 text-[14px] bg-surface-low border border-[#dbeafe] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-on-surface placeholder:text-outline"
                />
              </div>

              {/* Question Content */}
              <div>
                <label className="block text-[13px] font-bold text-on-surface mb-1.5">
                  질문 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="문제가 발생하는 주차, 코드 내용, 시도해 본 해결 방법 등을 구체적으로 남겨주시면 더 빠르고 정확한 답변을 받을 수 있습니다."
                  value={newContent}
                  onChange={(e) => {
                    setNewContent(e.target.value);
                    if (formError) setFormError('');
                  }}
                  className="w-full px-3.5 py-2.5 text-[14px] bg-surface-low border border-[#dbeafe] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-on-surface placeholder:text-outline leading-relaxed"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[13px] font-semibold text-on-surface-variant bg-surface hover:bg-surface-low border border-[#e2e8f0] rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>질문 등록하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
