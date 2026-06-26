import { getResponseLogs, getSurveyStats } from './responseLog.js';

/**
 * 영업 활용 레퍼런스 리포트
 *
 * 광고주에게 "이 설문은 며칠 운영, 몇 명 참여, 문항별 응답 분포가 이렇다"를
 * 보여줄 수 있는 형태로 응답 로그를 집계한다.
 *
 * @param {Object} survey - { meta, questions }
 * @returns {{
 *   surveyId: string,
 *   startDate: string,
 *   endDate: string,
 *   exposureLocation: string,
 *   totalParticipants: number,
 *   questionSummaries: Array<{ questionId: string, title: string, type: string, distribution: Array<{ label: string, count: number }> }>
 * }}
 */
export function buildSurveyReport(survey) {
  const { meta, questions } = survey;
  const logs = getResponseLogs(meta.surveyId);
  const { totalParticipants } = getSurveyStats(meta.surveyId);

  const sorted = [...questions].sort((a, b) => a.order - b.order);
  const questionSummaries = sorted.map((question) => ({
    questionId: question.id,
    title: question.title,
    type: question.type,
    distribution: buildDistribution(question, logs),
  }));

  return {
    surveyId: meta.surveyId,
    startDate: meta.startDate,
    endDate: meta.endDate,
    exposureLocation: meta.exposureLocation,
    totalParticipants,
    questionSummaries,
  };
}

function buildDistribution(question, logs) {
  const answers = logs
    .map((log) => log.answers[question.id])
    .filter((value) => value !== undefined && value !== null && value !== '');

  switch (question.type) {
    case 'single_choice': {
      const counts = new Map(question.options.map((opt) => [opt.id, 0]));
      for (const value of answers) {
        if (counts.has(value)) counts.set(value, counts.get(value) + 1);
      }
      return question.options.map((opt) => ({ label: opt.label, count: counts.get(opt.id) ?? 0 }));
    }

    case 'multiple_choice': {
      const counts = new Map(question.options.map((opt) => [opt.id, 0]));
      for (const value of answers) {
        const selected = Array.isArray(value) ? value : [];
        for (const optId of selected) {
          if (counts.has(optId)) counts.set(optId, counts.get(optId) + 1);
        }
      }
      return question.options.map((opt) => ({ label: opt.label, count: counts.get(opt.id) ?? 0 }));
    }

    case 'likert_scale': {
      const counts = new Map();
      for (let v = question.scaleMin; v <= question.scaleMax; v++) counts.set(v, 0);
      for (const value of answers) {
        if (counts.has(value)) counts.set(value, counts.get(value) + 1);
      }
      return [...counts.entries()].map(([scaleValue, count]) => ({ label: String(scaleValue), count }));
    }

    case 'open_text':
      return [{ label: '응답 수', count: answers.length }];

    case 'matrix':
    case 'numeric':
    case 'contact_consent':
      return [{ label: '응답 수', count: answers.length }];

    case 'image_choice':
    case 'emoji_reaction':
    case 'dropdown': {
      const counts = new Map(question.options.map((opt) => [opt.id, 0]));
      for (const value of answers) {
        if (counts.has(value)) counts.set(value, counts.get(value) + 1);
      }
      return question.options.map((opt) => ({ label: opt.label, count: counts.get(opt.id) ?? 0 }));
    }

    case 'yes_no': {
      const counts = { yes: 0, no: 0 };
      for (const value of answers) {
        if (value === 'yes' || value === 'no') counts[value] += 1;
      }
      return [
        { label: question.yesLabel, count: counts.yes },
        { label: question.noLabel, count: counts.no },
      ];
    }

    case 'vs_match': {
      const counts = { A: 0, B: 0 };
      for (const value of answers) {
        if (value === 'A' || value === 'B') counts[value] += 1;
      }
      return [
        { label: question.optionA.label, count: counts.A },
        { label: question.optionB.label, count: counts.B },
      ];
    }

    case 'star_rating': {
      const counts = new Map();
      for (let v = 1; v <= question.maxStars; v++) counts.set(v, 0);
      for (const value of answers) {
        if (counts.has(value)) counts.set(value, counts.get(value) + 1);
      }
      return [...counts.entries()].map(([star, count]) => ({ label: `${star}★`, count }));
    }

    case 'nps': {
      const counts = new Map();
      for (let v = 0; v <= 10; v++) counts.set(v, 0);
      for (const value of answers) {
        if (counts.has(value)) counts.set(value, counts.get(value) + 1);
      }
      return [...counts.entries()].map(([score, count]) => ({ label: String(score), count }));
    }

    case 'ranking':
      return [{ label: '응답 수', count: answers.length }];

    case 'slider':
      return [{ label: '응답 수', count: answers.length }];

    default:
      return [];
  }
}
