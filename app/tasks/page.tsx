'use client';

import React, { useState } from 'react';
import mockData from '@/data/mockData.json';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { CheckCircle2, Clock, Plus } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockData.tasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-on-surface">할 일 & 과제 관리</h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            강의별 과제, 온라인 퀴즈 및 제출 마감 일정을 관리하세요.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-[13px] font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span>할 일 추가</span>
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleTask(task.id)}
                className="text-outline hover:text-primary transition-colors"
              >
                {task.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-success fill-success/10" />
                ) : (
                  <div className="w-6 h-6 rounded-md border-2 border-outline-variant hover:border-primary transition-colors" />
                )}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-primary">
                    {task.courseName}
                  </span>
                  <span className="text-[11px] text-outline">[{task.category}]</span>
                </div>
                <p
                  className={`text-[15px] font-semibold text-on-surface mt-0.5 ${
                    task.isCompleted ? 'line-through text-outline' : ''
                  }`}
                >
                  {task.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[12px] text-on-surface-variant flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-outline" />
                {new Date(task.dueDate).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <Badge
                variant={
                  task.isCompleted
                    ? 'neutral'
                    : task.status === 'urgent'
                    ? 'urgent'
                    : task.status === 'warning'
                    ? 'warning'
                    : 'neutral'
                }
              >
                {task.dDay}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
