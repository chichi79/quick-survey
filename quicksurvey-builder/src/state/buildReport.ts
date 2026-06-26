import type { Question } from '../models/question';
import type { SurveyResponse } from './firestoreSync';

export interface QuestionDistributionItem {
  label: string;
  count: number;
}

export interface QuestionSummary {
  questionId: string;
  title: string;
  distribution: QuestionDistributionItem[];
}

function answersFor(questionId: string, responses: SurveyResponse[]): unknown[] {
  return responses
    .map((r) => r.answers[questionId])
    .filter((v) => v !== undefined && v !== null && v !== '');
}

/** quicksurvey의 models/report.js와 같은 집계 규칙을, 빌더의 Question 스키마에 맞춰 옮긴 것. */
function buildDistribution(question: Question, responses: SurveyResponse[]): QuestionDistributionItem[] {
  const answers = answersFor(question.id, responses);

  switch (question.type) {
    case 'single_choice':
    case 'image_choice':
    case 'dropdown': {
      const counts = new Map(question.options.map((opt) => [opt.id, 0]));
      for (const value of answers) {
        if (typeof value === 'string' && counts.has(value)) counts.set(value, (counts.get(value) ?? 0) + 1);
      }
      return question.options.map((opt) => ({ label: opt.label, count: counts.get(opt.id) ?? 0 }));
    }

    case 'emoji_reaction': {
      const counts = new Map(question.options.map((opt) => [opt.id, 0]));
      for (const value of answers) {
        if (typeof value === 'string' && counts.has(value)) counts.set(value, (counts.get(value) ?? 0) + 1);
      }
      return question.options.map((opt) => ({ label: `${opt.emoji} ${opt.label}`, count: counts.get(opt.id) ?? 0 }));
    }

    case 'multiple_choice': {
      const counts = new Map(question.options.map((opt) => [opt.id, 0]));
      for (const value of answers) {
        const selected = Array.isArray(value) ? value : [];
        for (const optId of selected) {
          if (counts.has(optId)) counts.set(optId, (counts.get(optId) ?? 0) + 1);
        }
      }
      return question.options.map((opt) => ({ label: opt.label, count: counts.get(opt.id) ?? 0 }));
    }

    case 'likert_scale': {
      const counts = new Map<number, number>();
      for (let v = question.scaleMin; v <= question.scaleMax; v++) counts.set(v, 0);
      for (const value of answers) {
        if (typeof value === 'number' && counts.has(value)) counts.set(value, (counts.get(value) ?? 0) + 1);
      }
      return [...counts.entries()].map(([v, count]) => ({ label: String(v), count }));
    }

    case 'star_rating': {
      const counts = new Map<number, number>();
      for (let v = 1; v <= question.maxStars; v++) counts.set(v, 0);
      for (const value of answers) {
        if (typeof value === 'number' && counts.has(value)) counts.set(value, (counts.get(value) ?? 0) + 1);
      }
      return [...counts.entries()].map(([v, count]) => ({ label: `${v}★`, count }));
    }

    case 'nps': {
      const counts = new Map<number, number>();
      for (let v = 0; v <= 10; v++) counts.set(v, 0);
      for (const value of answers) {
        if (typeof value === 'number' && counts.has(value)) counts.set(value, (counts.get(value) ?? 0) + 1);
      }
      return [...counts.entries()].map(([v, count]) => ({ label: String(v), count }));
    }

    case 'yes_no': {
      let yes = 0;
      let no = 0;
      for (const value of answers) {
        if (value === 'yes') yes += 1;
        else if (value === 'no') no += 1;
      }
      return [
        { label: question.yesLabel, count: yes },
        { label: question.noLabel, count: no },
      ];
    }

    case 'vs_match': {
      let a = 0;
      let b = 0;
      for (const value of answers) {
        if (value === 'A') a += 1;
        else if (value === 'B') b += 1;
      }
      return [
        { label: question.optionA.label, count: a },
        { label: question.optionB.label, count: b },
      ];
    }

    // 주관식/매트릭스/숫자합계/순위/슬라이더/개인정보 수집형은 옵션별 집계가
    // 아니라 자유 입력이라, quicksurvey 쪽 report.js와 동일하게 "응답 수"만 보여준다.
    default:
      return [{ label: '응답 수', count: answers.length }];
  }
}

export function buildQuestionSummaries(questions: Question[], responses: SurveyResponse[]): QuestionSummary[] {
  return [...questions]
    .sort((a, b) => a.order - b.order)
    .map((question) => ({
      questionId: question.id,
      title: question.title || '(제목 없음)',
      distribution: buildDistribution(question, responses),
    }));
}
