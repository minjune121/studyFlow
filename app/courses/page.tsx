import React from 'react';
import mockData from '@/data/mockData.json';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import { PlayCircle, Clock, MapPin, User } from 'lucide-react';

export default function CoursesPage() {
  const { courses } = mockData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-on-surface">수강 강의 관리</h1>
        <p className="text-[14px] text-on-surface-variant mt-1">
          수강 중인 과목의 진도율, VOD 학습 상태 및 강의 일정을 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[12px] font-bold text-primary bg-primary-container px-2.5 py-0.5 rounded">
                  {course.code}
                </span>
                <span className="ml-2 text-[13px] text-on-surface-variant font-medium">
                  {course.type} · {course.credits}학점
                </span>
                <h2 className="text-[20px] font-bold text-on-surface mt-2">
                  {course.name}
                </h2>
              </div>
              {course.isOnline ? (
                <Badge variant="info">
                  <PlayCircle className="w-3.5 h-3.5" />
                  온라인 VOD
                </Badge>
              ) : (
                <Badge variant="neutral">오프라인 강의</Badge>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-[13px] text-on-surface-variant bg-surface-low p-3 rounded-md">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-outline" />
                <span>{course.professor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-outline" />
                <span>{course.location}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <Clock className="w-4 h-4 text-outline" />
                <span>{course.schedule}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-medium text-on-surface-variant">
                  강의 진도율 ({course.completedLectures} / {course.totalLectures}강 완료)
                </span>
                <span className="font-bold text-primary">{course.progress}%</span>
              </div>
              <ProgressBar progress={course.progress} color={course.color} size="lg" />
            </div>

            <div className="mt-5 pt-4 border-t border-[#eff4ff] flex items-center justify-between">
              <span className="text-[12px] text-on-surface-variant truncate max-w-[280px]">
                최근 진도: {course.recentTopic}
              </span>
              <button className="px-4 py-1.5 bg-primary text-white text-[13px] font-semibold rounded-md hover:bg-primary/90 transition-colors">
                강의실 입장
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
