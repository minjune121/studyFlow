'use client';

import React from 'react';
import mockData from '@/data/mockData.json';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { MessageSquare, Plus } from 'lucide-react';

export default function QuestionsPage() {
  const { questions } = mockData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-on-surface">강의 Q&A 질문함</h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            교수님과 조교님께 질문하고 답변을 실시간으로 확인하세요.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span>질문 작성하기</span>
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <Card key={q.id} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-primary bg-primary-container px-2 py-0.5 rounded">
                  {q.courseName}
                </span>
                <span className="text-[12px] text-outline">{q.createdAt}</span>
              </div>
              <Badge variant={q.status === 'answered' ? 'success' : 'warning'}>
                {q.statusLabel}
              </Badge>
            </div>

            <h3 className="text-[16px] font-bold text-on-surface mt-2.5">{q.title}</h3>
            <p className="text-[14px] text-on-surface-variant mt-1.5 leading-relaxed">
              {q.content}
            </p>

            {q.lastReply ? (
              <div className="mt-4 p-4 rounded-lg bg-surface-low border border-[#eff4ff]">
                <div className="flex items-center gap-1.5 text-primary text-[12px] font-bold mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>교수 / 조교 답변</span>
                </div>
                <p className="text-[13px] text-on-surface leading-relaxed">
                  {q.lastReply}
                </p>
              </div>
            ) : (
              <div className="mt-4 text-[12px] text-outline italic">
                ⏳ 아직 등록된 답변이 없습니다. 교수님이 확인 중입니다.
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
