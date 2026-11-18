'use client';

import React, { useState } from 'react';
import mockData from '@/data/mockData.json';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import {
  PlayCircle,
  Clock,
  MapPin,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Lock,
  BookOpen,
  CheckSquare,
  Award,
  X,
  Volume2,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  FileText,
  Download,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface Lecture {
  id: string;
  week: number;
  title: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  summary?: string;
  materials?: string[];
}

interface CourseBreakdown {
  attendance: { rate: number; current: number; total: number; label: string };
  assignment: { rate: number; current: number; total: number; label: string };
  exam: { rate: number; score: string; label: string };
}

interface EnhancedCourse {
  id: string;
  code: string;
  name: string;
  professor: string;
  credits: number;
  type: string;
  schedule: string;
  location: string;
  progress: number;
  totalLectures: number;
  completedLectures: number;
  color: string;
  recentTopic: string;
  isOnline?: boolean;
  breakdown: CourseBreakdown;
  lectures: Lecture[];
}

const COURSE_ENRICHMENT: Record<
  string,
  { breakdown: CourseBreakdown; lectures: Lecture[] }
> = {
  'cs-101': {
    breakdown: {
      attendance: { rate: 95, current: 19, total: 20, label: '정상 (1회 결석)' },
      assignment: { rate: 80, current: 4, total: 5, label: '4/5 제출 완료' },
      exam: { rate: 92, score: '중간고사 92점', label: '상위 10%' },
    },
    lectures: [
      {
        id: 'cs101-1',
        week: 1,
        title: '강의 오리엔테이션 및 C/C++ 포인터 메모리 구조 복습',
        duration: '48분',
        status: 'completed',
        summary: '메모리 할당 방식과 포인터 연산, 동적 할당의 원리를 복습합니다.',
        materials: ['1주차_교안_포인터.pdf', 'pointer_basics.c'],
      },
      {
        id: 'cs101-2',
        week: 2,
        title: '단일/이중 연결 리스트(Linked List) 구현과 시간복잡도',
        duration: '52분',
        status: 'completed',
        summary: '노드 삽입, 삭제 및 포인터 조작을 통한 연결 구조를 다룹니다.',
        materials: ['2주차_연결리스트.pdf', 'linked_list_impl.cpp'],
      },
      {
        id: 'cs101-3',
        week: 3,
        title: '스택(Stack)과 큐(Queue) 구조 및 계산기 수식 파싱 응용',
        duration: '50분',
        status: 'completed',
        summary: 'LIFO와 FIFO 특성을 이해하고 후위 표기법 수식 계산기를 구현합니다.',
        materials: ['3주차_스택큐.pdf'],
      },
      {
        id: 'cs101-4',
        week: 4,
        title: '이진 탐색 트리(Binary Search Tree) 탐색과 삽입/삭제 알고리즘',
        duration: '55분',
        status: 'completed',
        summary: '이진 탐색 트리의 기본 특성과 최악 시간복잡도 문제를 다룹니다.',
        materials: ['4주차_이진탐색트리.pdf'],
      },
      {
        id: 'cs101-5',
        week: 5,
        title: '균형 이진 트리: AVL Tree 단일/이중 회전 연산 메커니즘',
        duration: '54분',
        status: 'completed',
        summary: 'LL, RR, LR, RL 회전을 통해 트리의 높이 균형을 유지하는 원리입니다.',
        materials: ['5주차_AVL_Tree.pdf', 'avl_rotations.cpp'],
      },
      {
        id: 'cs101-6',
        week: 6,
        title: 'Red-Black Tree 속성과 삽입/삭제 시의 색상 재조정(Recoloring)',
        duration: '58분',
        status: 'completed',
        summary: '5가지 레드-블랙 트리 특성과 노드 회전 및 삼촌 노드 검사 로직을 학습합니다.',
        materials: ['6주차_RedBlackTree.pdf'],
      },
      {
        id: 'cs101-7',
        week: 7,
        title: 'B-Tree & B+ Tree 다원 탐색 트리와 대용량 디스크 인덱스',
        duration: '60분',
        status: 'in-progress',
        summary: '데이터베이스 및 파일 시스템에서 B-Tree가 블록 I/O를 최소화하는 구조를 학습합니다.',
        materials: ['7주차_BTree_심화.pdf', 'btree_visualizer.zip'],
      },
      {
        id: 'cs101-8',
        week: 8,
        title: '그래프(Graph) 인접 리스트/행렬 표현과 최단 경로 알고리즘',
        duration: '50분',
        status: 'scheduled',
        summary: 'Dijkstra 및 Floyd-Warshall 알고리즘의 구현과 복잡도 분석입니다.',
        materials: ['8주차_그래프_예습자료.pdf'],
      },
    ],
  },
  'cs-102': {
    breakdown: {
      attendance: { rate: 90, current: 18, total: 20, label: '정상 (2회 결석)' },
      assignment: { rate: 75, current: 3, total: 4, label: '3/4 제출 완료' },
      exam: { rate: 85, score: '중간고사 85점', label: '상위 25%' },
    },
    lectures: [
      {
        id: 'cs102-1',
        week: 1,
        title: '운영체제 발전 역사와 컴퓨터 시스템 구조 및 시스템 콜',
        duration: '45분',
        status: 'completed',
        summary: '커널 모드와 사용자 모드 전환, 트랩과 인터럽트 메커니즘을 배웁니다.',
        materials: ['1주차_OS_개요.pdf'],
      },
      {
        id: 'cs102-2',
        week: 2,
        title: '프로세스와 스레드(Thread), PCB와 컨텍스트 스위칭 오버헤드',
        duration: '50분',
        status: 'completed',
        summary: '프로세스 상태 전이 모델과 스레드 풀 모델의 장단점을 비교합니다.',
        materials: ['2주차_프로세스_스레드.pdf'],
      },
      {
        id: 'cs102-3',
        week: 3,
        title: 'CPU 스케줄링 알고리즘: FCFS, SJF, Round Robin 및 다단계 피드백 큐',
        duration: '53분',
        status: 'completed',
        summary: '스케줄링 평가 기준과 각 알고리즘의 평균 대기 시간 분석입니다.',
        materials: ['3주차_CPU스케줄링.pdf', 'scheduling_sim.c'],
      },
      {
        id: 'cs102-4',
        week: 4,
        title: '동기화와 임계 구역 문제: 뮤텍스(Mutex), 세마포어(Semaphore)',
        duration: '56분',
        status: 'completed',
        summary: 'Peterson 알고리즘, 세마포어 P/V 연산, 생산자-소비자 문제를 해결합니다.',
        materials: ['4주차_프로세스동기화.pdf'],
      },
      {
        id: 'cs102-5',
        week: 5,
        title: '교착 상태(Deadlock) 4가지 조건과 은행원 알고리즘(Banker\'s)',
        duration: '52분',
        status: 'completed',
        summary: '안전 상태 검사와 교착 상태 회피 기법을 계산해 봅니다.',
        materials: ['5주차_데드락.pdf'],
      },
      {
        id: 'cs102-6',
        week: 6,
        title: '가상 메모리 관리: 페이징(Paging)과 TLB 캐시 미스 분석',
        duration: '58분',
        status: 'in-progress',
        summary: '2단계 페이징, 인버티드 페이지 테이블과 TLB 히트율 계산을 다룹니다.',
        materials: ['6주차_가상메모리_페이징.pdf'],
      },
      {
        id: 'cs102-7',
        week: 7,
        title: '페이지 교체 알고리즘(FIFO, LRU, LFU, Clock)과 쓰레싱 현상',
        duration: '48분',
        status: 'scheduled',
        summary: '워킹셋 모델과 지역성(Locality)을 고려한 페이지 교체 기법입니다.',
        materials: ['7주차_페이지교체.pdf'],
      },
    ],
  },
  'cs-103': {
    breakdown: {
      attendance: { rate: 100, current: 16, total: 16, label: '개근 (VOD 100%)' },
      assignment: { rate: 100, current: 4, total: 4, label: '과제 전회 완벽 제출' },
      exam: { rate: 95, score: '실습 과제 96점', label: '상위 5%' },
    },
    lectures: [
      {
        id: 'cs103-1',
        week: 1,
        title: '모던 웹 프론트엔드 환경 구축 & TypeScript 5 필수 문법',
        duration: '45분',
        status: 'completed',
        summary: '제네릭, 유니온 타입, 유틸리티 타입과 strict 모드 설정.',
        materials: ['1주차_TS_설정.pdf'],
      },
      {
        id: 'cs103-2',
        week: 2,
        title: 'React 18 렌더링 파이프라인, Hooks 심화 및 상태 설계 패턴',
        duration: '52분',
        status: 'completed',
        summary: 'useEffect 종속성 관리, useMemo/useCallback 최적화 기법.',
        materials: ['2주차_React_Hooks.pdf'],
      },
      {
        id: 'cs103-3',
        week: 3,
        title: 'Next.js 14 App Router 구조 및 Nested Layouts 실전',
        duration: '55분',
        status: 'completed',
        summary: '폴더 기반 라우팅, loading.tsx, error.tsx, template 구성.',
        materials: ['3주차_Nextjs_AppRouter.pdf'],
      },
      {
        id: 'cs103-4',
        week: 4,
        title: 'React Server Components(RSC) 아키텍처와 Streaming SSR',
        duration: '50분',
        status: 'completed',
        summary: '클라이언트 번들 축소 및 Suspense를 활용한 점진적 렌더링.',
        materials: ['4주차_RSC_Streaming.pdf'],
      },
      {
        id: 'cs103-5',
        week: 5,
        title: 'Next.js Server Actions 데이터 뮤테이션과 revalidatePath 활용',
        duration: '54분',
        status: 'completed',
        summary: '별도 API 엔드포인트 없이 폼 제출 및 온디맨드 캐시 무효화 구현.',
        materials: ['5주차_ServerActions.pdf'],
      },
      {
        id: 'cs103-6',
        week: 6,
        title: 'Tailwind CSS 디자인 시스템 및 반응형 UI 컴포넌트 라이브러리 제작',
        duration: '48분',
        status: 'in-progress',
        summary: 'CVA(class-variance-authority)와 Tailwind 조합으로 재사용성 극대화.',
        materials: ['6주차_Tailwind_시스템.pdf', 'components_starter.zip'],
      },
    ],
  },
  'ge-101': {
    breakdown: {
      attendance: { rate: 85, current: 12, total: 14, label: '출석 양호' },
      assignment: { rate: 66, current: 2, total: 3, label: '2/3 제출' },
      exam: { rate: 78, score: '에세이 평가 80점', label: 'B+' },
    },
    lectures: [
      {
        id: 'ge101-1',
        week: 1,
        title: '기술 결정론과 기술 사회론: 인류와 공학 윤리의 진화',
        duration: '42분',
        status: 'completed',
        summary: '공학자의 윤리적 책임과 역사적 기술 재난 사례 고찰.',
        materials: ['1주차_기술윤리_서론.pdf'],
      },
      {
        id: 'ge101-2',
        week: 2,
        title: '인공지능 알고리즘의 편향성과 공정성(Fairness in AI)',
        duration: '46분',
        status: 'completed',
        summary: '채용, 대출 심사 알고리즘의 차별 사례와 법적 규제 움직임.',
        materials: ['2주차_AI편향성.pdf'],
      },
      {
        id: 'ge101-3',
        week: 3,
        title: '빅데이터 수집과 개인정보 자기결정권, GDPR 규제 체계',
        duration: '44분',
        status: 'in-progress',
        summary: '익명화 기술의 한계와 데이터 주권 보호 정책 비교.',
        materials: ['3주차_데이터프라이버시.pdf'],
      },
      {
        id: 'ge101-4',
        week: 4,
        title: '생성형 인공지능(GenAI)과 저작권 침해 분쟁 및 가이드라인',
        duration: '45분',
        status: 'scheduled',
        summary: '학습 데이터 저작권과 생성물의 지식재산권 인정 기준 토론.',
        materials: ['4주차_저작권_토론발제.pdf'],
      },
    ],
  },
};

export default function CoursesPage() {
  const { courses } = mockData;

  // Track expanded syllabus per course
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({
    'cs-101': true, // Open first course by default
  });

  // Track active preview lecture for VOD modal
  const [activeModal, setActiveModal] = useState<{
    course: EnhancedCourse;
    lecture: Lecture;
  } | null>(null);

  // VOD player simulated states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [playedSeconds, setPlayedSeconds] = useState(342); // simulated current time (5m 42s)
  const totalDurationSeconds = 3120; // 52 minutes

  const toggleExpand = (courseId: string) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const getEnhancedCourse = (course: (typeof courses)[0]): EnhancedCourse => {
    const enrichment = COURSE_ENRICHMENT[course.id] || {
      breakdown: {
        attendance: { rate: course.progress, current: 15, total: 16, label: '양호' },
        assignment: { rate: course.progress, current: 3, total: 4, label: '진행중' },
        exam: { rate: course.progress, score: '평가 예정', label: '준비중' },
      },
      lectures: [
        {
          id: `${course.id}-1`,
          week: 1,
          title: `${course.name} 기초 오리엔테이션`,
          duration: '45분',
          status: 'completed',
          summary: '강의 소개 및 한 학기 로드맵 안내',
          materials: ['강의계획서.pdf'],
        },
      ],
    };

    return {
      ...course,
      breakdown: enrichment.breakdown,
      lectures: enrichment.lectures,
    };
  };

  const openVodModal = (course: EnhancedCourse, lecture?: Lecture) => {
    const targetLecture =
      lecture ||
      course.lectures.find((l) => l.status === 'in-progress') ||
      course.lectures[0];
    setActiveModal({
      course,
      lecture: targetLecture,
    });
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-on-surface">수강 강의 관리</h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            수강 중인 과목의 진도율, 세부 항목별(출석·과제·시험) 성취도 및 VOD 강의를 확인하세요.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-on-surface-variant font-medium bg-[#f0f4ff] px-3 py-1.5 rounded-lg border border-[#dbeafe]">
            총 <span className="font-bold text-primary">{courses.length}개</span> 수강 중 · 11학점
          </span>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        {courses.map((rawCourse) => {
          const course = getEnhancedCourse(rawCourse);
          const isExpanded = !!expandedCourses[course.id];

          return (
            <Card key={course.id} className="p-6 transition-all duration-200">
              {/* Course Top Info */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-bold text-primary bg-primary-container px-2.5 py-0.5 rounded">
                      {course.code}
                    </span>
                    <span className="text-[13px] text-on-surface-variant font-medium">
                      {course.type} · {course.credits}학점
                    </span>
                    {course.isOnline ? (
                      <Badge variant="info">
                        <PlayCircle className="w-3.5 h-3.5" />
                        온라인 VOD
                      </Badge>
                    ) : (
                      <Badge variant="neutral">오프라인 강의</Badge>
                    )}
                  </div>
                  <h2 className="text-[22px] font-bold text-on-surface">
                    {course.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <button
                    onClick={() => openVodModal(course)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm active:scale-95"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>강의실 입장 & VOD 재생</span>
                  </button>
                </div>
              </div>

              {/* Meta details bar */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[13px] text-on-surface-variant bg-surface-low p-3.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-outline" />
                  <span className="font-medium text-on-surface">{course.professor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-outline" />
                  <span>{course.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-outline" />
                  <span>{course.schedule}</span>
                </div>
              </div>

              {/* Overall Progress Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-semibold text-on-surface flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-primary" />
                    전체 강의 진도율 ({course.completedLectures} / {course.totalLectures}강 완료)
                  </span>
                  <span className="font-bold text-primary text-[15px]">{course.progress}%</span>
                </div>
                <ProgressBar progress={course.progress} color={course.color} size="lg" />
              </div>

              {/* Progress Breakdown: 출석, 과제, 시험 */}
              <div className="mt-5 pt-4 border-t border-[#eff4ff]">
                <h3 className="text-[13px] font-bold text-on-surface mb-3 flex items-center gap-1.5">
                  <span>항목별 성취도 분석</span>
                  <span className="text-[11px] text-outline font-normal">(출석 · 과제 · 시험)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* 출석 현황 */}
                  <div className="bg-[#f8faff] border border-[#e2e8f0] p-3 rounded-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[12px] mb-1.5">
                      <span className="font-semibold text-on-surface flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        출석률
                      </span>
                      <span className="font-bold text-emerald-600">
                        {course.breakdown.attendance.rate}%
                      </span>
                    </div>
                    <ProgressBar
                      progress={course.breakdown.attendance.rate}
                      color="#10b981"
                      size="sm"
                    />
                    <div className="mt-2 flex justify-between text-[11px] text-on-surface-variant">
                      <span>{course.breakdown.attendance.current}/{course.breakdown.attendance.total}회</span>
                      <span className="text-emerald-700 font-medium">{course.breakdown.attendance.label}</span>
                    </div>
                  </div>

                  {/* 과제 현황 */}
                  <div className="bg-[#f8faff] border border-[#e2e8f0] p-3 rounded-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[12px] mb-1.5">
                      <span className="font-semibold text-on-surface flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-primary" />
                        과제 제출
                      </span>
                      <span className="font-bold text-primary">
                        {course.breakdown.assignment.rate}%
                      </span>
                    </div>
                    <ProgressBar
                      progress={course.breakdown.assignment.rate}
                      color="#4f46e5"
                      size="sm"
                    />
                    <div className="mt-2 flex justify-between text-[11px] text-on-surface-variant">
                      <span>{course.breakdown.assignment.current}/{course.breakdown.assignment.total}회</span>
                      <span className="text-primary font-medium">{course.breakdown.assignment.label}</span>
                    </div>
                  </div>

                  {/* 시험 현황 */}
                  <div className="bg-[#f8faff] border border-[#e2e8f0] p-3 rounded-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[12px] mb-1.5">
                      <span className="font-semibold text-on-surface flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        시험/평가
                      </span>
                      <span className="font-bold text-amber-600">
                        {course.breakdown.exam.rate}%
                      </span>
                    </div>
                    <ProgressBar
                      progress={course.breakdown.exam.rate}
                      color="#f59e0b"
                      size="sm"
                    />
                    <div className="mt-2 flex justify-between text-[11px] text-on-surface-variant">
                      <span>{course.breakdown.exam.score}</span>
                      <span className="text-amber-700 font-medium">{course.breakdown.exam.label}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Syllabus Toggle Bar */}
              <div className="mt-5 pt-4 border-t border-[#eff4ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[12px] text-on-surface-variant truncate">
                  최근 학습: <strong className="text-on-surface">{course.recentTopic}</strong>
                </span>

                <button
                  onClick={() => toggleExpand(course.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-primary hover:bg-primary-container/40 rounded-md transition-colors self-start sm:self-auto"
                >
                  <span>
                    {isExpanded ? '주차별 강의 목록 접기' : `주차별 강의 계획 및 VOD 목록 (${course.lectures.length}강)`}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expandable Syllabus / Lecture List */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-dashed border-[#dbeafe] space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-bold text-on-surface">
                      주차별 커리큘럼 및 VOD 재생 목록
                    </span>
                    <span className="text-[12px] text-outline">
                      클릭 시 VOD 플레이어 미리보기가 실행됩니다
                    </span>
                  </div>

                  <div className="space-y-2">
                    {course.lectures.map((lecture) => {
                      const isCompleted = lecture.status === 'completed';
                      const isInProgress = lecture.status === 'in-progress';

                      return (
                        <div
                          key={lecture.id}
                          onClick={() => openVodModal(course, lecture)}
                          className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isInProgress
                              ? 'bg-primary-container/20 border-primary/40 hover:border-primary'
                              : isCompleted
                              ? 'bg-surface hover:bg-surface-low border-[#e2e8f0]'
                              : 'bg-surface-low/50 border-[#edf2f7] opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : isInProgress ? (
                                <PlayCircle className="w-5 h-5 text-primary animate-pulse" />
                              ) : (
                                <Lock className="w-4 h-4 text-outline mt-0.5" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#eff4ff] text-primary">
                                  {lecture.week}주차
                                </span>
                                <h4 className="text-[14px] font-bold text-on-surface">
                                  {lecture.title}
                                </h4>
                              </div>
                              {lecture.summary && (
                                <p className="text-[12px] text-on-surface-variant mt-1 line-clamp-1">
                                  {lecture.summary}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            <span className="text-[12px] text-outline flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {lecture.duration}
                            </span>
                            {isCompleted ? (
                              <Badge variant="success">학습 완료</Badge>
                            ) : isInProgress ? (
                              <Badge variant="primary">학습 진행 중</Badge>
                            ) : (
                              <Badge variant="neutral">예정</Badge>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openVodModal(course, lecture);
                              }}
                              className="px-2.5 py-1 text-[12px] font-semibold text-primary bg-primary-container rounded hover:bg-primary hover:text-white transition-colors"
                            >
                              재생
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* VOD Lecture Playback Preview Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-[#e2e8f0] flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-surface-low">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 bg-primary text-white text-[11px] font-bold rounded">
                  {activeModal.course.code}
                </span>
                <div>
                  <h3 className="text-[16px] font-bold text-on-surface">
                    {activeModal.course.name} · {activeModal.lecture.week}주차
                  </h3>
                  <p className="text-[12px] text-on-surface-variant">
                    {activeModal.lecture.title} ({activeModal.lecture.duration})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg hover:bg-[#e2e8f0] text-outline hover:text-on-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Video Player & Info */}
            <div className="overflow-y-auto">
              {/* Simulated Video Canvas */}
              <div className="relative aspect-video bg-neutral-950 flex flex-col justify-between p-4 group select-none">
                {/* Top overlay */}
                <div className="flex justify-between items-center text-white/80 text-[12px] z-10">
                  <span className="bg-black/60 px-2.5 py-1 rounded backdrop-blur font-medium">
                    StudyFlow HD VOD Player · 1080p 60fps
                  </span>
                  <span className="bg-emerald-500/80 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                    LIVE SYNC
                  </span>
                </div>

                {/* Center Big Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="pointer-events-auto p-4 rounded-full bg-primary/90 text-white shadow-lg hover:scale-110 hover:bg-primary transition-all duration-200"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 fill-current" />
                    ) : (
                      <Play className="w-8 h-8 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Video Watermark & Lecture Info in frame */}
                <div className="absolute bottom-16 left-6 text-white/90 drop-shadow pointer-events-none">
                  <p className="text-[14px] font-bold text-white/90">
                    {activeModal.lecture.week}주차: {activeModal.lecture.title}
                  </p>
                  <p className="text-[12px] text-white/70">
                    담당교수: {activeModal.course.professor} · 진도 반영 시스템 가동 중
                  </p>
                </div>

                {/* Bottom Controls Bar */}
                <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 z-10 space-y-2">
                  {/* Progress scrubber */}
                  <div className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden group/bar">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${(playedSeconds / totalDurationSeconds) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between text-white text-[12px]">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="hover:text-primary transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current" />
                        )}
                      </button>
                      <button
                        onClick={() => setPlayedSeconds((prev) => Math.max(0, prev - 10))}
                        className="hover:text-primary transition-colors flex items-center gap-0.5 text-[11px]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> 10초
                      </button>
                      <span className="text-[11px] font-mono text-white/80">
                        {formatTime(playedSeconds)} / {formatTime(totalDurationSeconds)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const speeds = [1.0, 1.25, 1.5, 2.0];
                          const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                          setPlaybackSpeed(speeds[nextIdx]);
                        }}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-bold"
                      >
                        {playbackSpeed}x 속도
                      </button>
                      <Volume2 className="w-4 h-4 hover:text-primary cursor-pointer" />
                      <Maximize2 className="w-4 h-4 hover:text-primary cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lecture Material & Summary Notes */}
              <div className="p-6 space-y-5">
                <div>
                  <h4 className="text-[15px] font-bold text-on-surface">
                    강의 요약 및 학습 목표
                  </h4>
                  <p className="text-[13px] text-on-surface-variant mt-1.5 leading-relaxed bg-[#f8faff] p-3.5 rounded-lg border border-[#e2e8f0]">
                    {activeModal.lecture.summary ||
                      '해당 강의의 세부 핵심 개념과 실습 예제를 확인하며 학습을 완료하세요.'}
                  </p>
                </div>

                {activeModal.lecture.materials && activeModal.lecture.materials.length > 0 && (
                  <div>
                    <h4 className="text-[13px] font-bold text-on-surface mb-2 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-primary" />
                      강의 첨부 학습 자료 ({activeModal.lecture.materials.length}개)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeModal.lecture.materials.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-[#e2e8f0] bg-surface hover:bg-surface-low text-[12px]"
                        >
                          <span className="truncate font-medium text-on-surface">{file}</span>
                          <button className="flex items-center gap-1 text-primary hover:underline ml-2 shrink-0 font-semibold">
                            <Download className="w-3.5 h-3.5" />
                            다운로드
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-[#e2e8f0] bg-surface-low flex items-center justify-between">
              <span className="text-[12px] text-outline">
                💡 재생 진도율이 80% 이상 충족 시 출석이 자동 인정됩니다.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    alert('강의 진도가 100% 완료 처리되었습니다.');
                    setActiveModal(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white text-[13px] font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  학습 완료 처리
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-surface text-on-surface border border-outline-variant/40 text-[13px] font-semibold rounded-lg hover:bg-surface-low transition-colors"
                >
                  창 닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
