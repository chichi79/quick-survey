import type { Question } from './question';

export type SurveyKind = 'single' | 'multi';

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export interface Survey {
  id: string;
  projectId: string;
  title: string;
  kind: SurveyKind;
  questions: Question[];
  /** true면 quicksurvey 쪽으로 내보내는 "노출 설문" 목록에 포함된다. */
  published: boolean;
  /** YYYY-MM-DD, null이면 제한 없음. quicksurvey는 이 기간 밖이면 노출 목록에서 숨기고 "마감"으로 안내한다. */
  startDate: string | null;
  endDate: string | null;
  /** 응답 완료 화면에 보여줄 리워드 포인트/안내 문구. */
  rewardPoint: number;
  completeMessage: string;
  createdAt: string;
  updatedAt: string;
}

let counter = 1;
function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${counter++}`;
}

export function createProject(name: string): Project {
  return {
    id: genId('project'),
    name,
    createdAt: new Date().toISOString(),
  };
}

export function createSurvey(projectId: string, title: string, kind: SurveyKind = 'multi'): Survey {
  const now = new Date().toISOString();
  return {
    id: genId('survey'),
    projectId,
    title,
    kind,
    questions: [],
    published: false,
    startDate: null,
    endDate: null,
    rewardPoint: 100,
    completeMessage: '설문에 참여해주셔서 감사합니다!',
    createdAt: now,
    updatedAt: now,
  };
}
