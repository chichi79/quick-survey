import { createMissionCard } from './models/missionCard.js';
import {
  createChoiceQuestion,
  createLikertQuestion,
  createOpenTextQuestion,
} from './models/question.js';
import { createSkipLogicRule } from './models/skipLogic.js';

/**
 * 메인 노출용 미션 카드 목록 (1단계: 연애폴 + 2단계 대비 오퍼월 타입 혼합 예시)
 */
export const demoMissionCards = [
  createMissionCard({
    id: 'survey-001',
    type: 'survey',
    title: '오늘의 연애 고민, 그 선택은?',
    rewardPoint: 50,
    estimatedMinutes: 1,
    status: 'available',
    actionUrl: '#survey-001',
  }),
  createMissionCard({
    id: 'survey-002',
    type: 'survey',
    title: '여름휴가, 어디로 떠나고 싶나요?',
    rewardPoint: 300,
    estimatedMinutes: 3,
    status: 'available',
    actionUrl: '#survey-002',
  }),
  createMissionCard({
    id: 'survey-003',
    type: 'survey',
    title: '최근 본 영화 만족도 조사',
    rewardPoint: 200,
    estimatedMinutes: 2,
    status: 'completed',
    actionUrl: '#survey-003',
  }),
  createMissionCard({
    id: 'ad-001',
    type: 'ad_view',
    title: '광고 보고 포인트 받기',
    rewardPoint: 30,
    status: 'closed',
    actionUrl: '#',
  }),
];

/**
 * 샘플 설문: 단일선택 → (분기) → 척도 / 주관식
 *
 * survey-002 카드를 클릭하면 이 설문이 뜨는 데모 흐름.
 * - Q1에서 "예"를 고르면 Q2(척도)로,
 *   "아니오"를 고르면 Q3(주관식)으로 바로 분기.
 */
export const demoSurvey = {
  meta: {
    surveyId: 'survey-002',
    startDate: '2026-06-01',
    endDate: '2026-06-07',
    exposureLocation: '연예기사 하단',
    rewardPoint: 300,
    completeMessage: '설문에 참여해주셔서 감사합니다!',
  },
  questions: [
    createChoiceQuestion({
      id: 'q1',
      type: 'single_choice',
      title: '최근 한 달 내 여행 계획이 있으신가요?',
      required: true,
      order: 0,
      options: [
        { id: 'yes', label: '예' },
        { id: 'no', label: '아니오' },
      ],
    }),
    createLikertQuestion({
      id: 'q2',
      title: '여행 계획에 대한 기대감은 어느 정도인가요?',
      required: true,
      order: 1,
      scaleMin: 1,
      scaleMax: 5,
      minLabel: '전혀 기대 안 됨',
      maxLabel: '매우 기대됨',
    }),
    createOpenTextQuestion({
      id: 'q3',
      title: '여행 계획이 없는 이유를 알려주세요.',
      required: false,
      order: 2,
      maxLength: 100,
      multiline: true,
    }),
  ],
  rules: [
    createSkipLogicRule({
      id: 'rule-1',
      sourceQuestionId: 'q1',
      operator: 'equals',
      value: 'no',
      action: 'skip_to',
      targetQuestionId: 'q3',
    }),
  ],
};
