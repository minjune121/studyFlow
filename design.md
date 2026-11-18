---
name: StudyFlow
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5edff'
  surface-container-high: '#dbe7ff'
  surface-container-highest: '#cbdbf5'
  on-surface: '#0d1b2a'
  on-surface-variant: '#414754'
  outline: '#727785'
  outline-variant: '#c2c7d6'
  primary: '#4f46e5'
  primary-container: '#e0e7ff'
  on-primary: '#ffffff'
  on-primary-container: '#3730a3'
  secondary: '#6366f1'
  secondary-container: '#eef2ff'
  on-secondary: '#ffffff'
  on-secondary-container: '#312e81'
  tertiary: '#0284c7'
  tertiary-container: '#e0f2fe'
  on-tertiary: '#ffffff'
  on-tertiary-container: '#0369a1'
  error: '#ef4444'
  error-container: '#fee2e2'
  on-error: '#ffffff'
  on-error-container: '#b91c1c'
  warning: '#f59e0b'
  warning-container: '#fef3c7'
  on-warning: '#ffffff'
  on-warning-container: '#b45309'
  success: '#10b981'
  success-container: '#d1fae5'
  on-success: '#ffffff'
  on-success-container: '#047857'

typography:
  font-family:
    primary: 'Plus Jakarta Sans', 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif
    mono: 'JetBrains Mono', 'Fira Code', monospace
  scale:
    display:
      size: '28px'
      weight: '700'
      line-height: '1.25'
    headline:
      size: '22px'
      weight: '700'
      line-height: '1.3'
    title:
      size: '18px'
      weight: '600'
      line-height: '1.4'
    body:
      size: '14px'
      weight: '400'
      line-height: '1.5'
    body-medium:
      size: '14px'
      weight: '500'
      line-height: '1.5'
    label:
      size: '12px'
      weight: '600'
      line-height: '1.4'
    caption:
      size: '11px'
      weight: '500'
      line-height: '1.4'

shape:
  roundness: '8px'
  border-radius:
    sm: '4px'
    md: '8px'
    lg: '12px'
    xl: '16px'
    full: '9999px'

elevation:
  card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)'
  popover: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
  dropdown: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'

components:
  layout:
    sidebar-width: '240px'
    topbar-height: '64px'
    content-max-width: '1440px'
  card:
    bg: '#ffffff'
    border: '1px solid #eff4ff'
    radius: '8px'
    padding: '20px'
---

# StudyFlow Design System Guide

## 1. Visual Language & Principles
- **Clarity & Academic Focus**: 학습 진행도(진도율, 학점, 잔여 시간)를 최우선으로 시각화하며, 시각적 노이즈를 최소화한 카드 기반 미니멀리즘을 유지합니다.
- **Calm Indigo Aesthetics**: 눈의 피로를 낮추는 라이트 블루 배경(`surface: #f8f9ff`)과 지적인 신뢰감을 주는 인디고 액센트(`primary: #4f46e5`)를 메인 테마로 활용합니다.
- **Standard SaaS Shell**: 좌측 영구 고정 사이드바(240px)와 글로벌 상단 헤더(64px)를 기준으로 본문 작업 공간을 규격화합니다.

## 2. Status Color Rules
- **긴급 / D-Day 마감 임박**: `#ef4444` (Error / Urgent Badge)
- **진행 중 / 퀴즈 예정 / 주의**: `#f59e0b` (Warning / In-Progress)
- **완료 / 채점 완료 / 출석 성공**: `#10b981` (Success)
- **비대면 VOD / 참고 자료**: `#0284c7` (Tertiary / Info)
