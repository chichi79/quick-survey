import type { Question } from './question';

export interface ResultBar {
  label: string;
  percent: number;
  mine: boolean;
}

export interface DummyResult {
  totalParticipants: number;
  bars: ResultBar[];
}

/**
 * 노출 미리보기에서 "응답 즉시 결과 보여주기"를 시연하기 위한 가짜 집계 결과.
 * 실제 운영 데이터가 없는 빌더 단계이므로, 문항 id 기반의 결정적 의사난수로
 * 매번 같은 결과가 나오게 하고, 내가 고른 항목의 비중을 살짝 띄워 그럴듯하게 보여준다.
 */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pseudoRandom(seed: string): number {
  return (hash(seed) % 1000) / 1000;
}

function buildOptionResult(
  questionId: string,
  options: { id: string; label: string }[],
  selectedIds: Set<string>,
): DummyResult {
  const totalParticipants = 80 + (hash(questionId) % 400);

  const raw = options.map((opt) => {
    const base = 8 + pseudoRandom(`${questionId}:${opt.id}`) * 30;
    const weight = selectedIds.has(opt.id) ? base + 25 : base;
    return { opt, weight };
  });
  const totalWeight = raw.reduce((sum, r) => sum + r.weight, 0) || 1;

  return {
    totalParticipants,
    bars: raw.map((r) => ({
      label: r.opt.label,
      percent: Math.round((r.weight / totalWeight) * 100),
      mine: selectedIds.has(r.opt.id),
    })),
  };
}

function buildScaleResult(questionId: string, min: number, max: number, selected: number | null): DummyResult {
  const options = [];
  for (let v = min; v <= max; v++) options.push({ id: String(v), label: String(v) });
  return buildOptionResult(questionId, options, new Set(selected != null ? [String(selected)] : []));
}

export function buildDummyResult(question: Question, value: unknown): DummyResult | null {
  switch (question.type) {
    case 'single_choice':
    case 'image_choice':
    case 'emoji_reaction':
    case 'dropdown':
      return buildOptionResult(question.id, question.options, new Set(value ? [value as string] : []));

    case 'multiple_choice':
      return buildOptionResult(
        question.id,
        question.options,
        new Set(Array.isArray(value) ? (value as string[]) : []),
      );

    case 'yes_no':
      return buildOptionResult(
        question.id,
        [
          { id: 'yes', label: question.yesLabel },
          { id: 'no', label: question.noLabel },
        ],
        new Set(value ? [value as string] : []),
      );

    case 'vs_match':
      return buildOptionResult(
        question.id,
        [
          { id: 'A', label: question.optionA.label },
          { id: 'B', label: question.optionB.label },
        ],
        new Set(value ? [value as string] : []),
      );

    case 'likert_scale':
      return buildScaleResult(question.id, question.scaleMin, question.scaleMax, value as number | null);

    case 'star_rating':
      return buildScaleResult(question.id, 1, question.maxStars, value as number | null);

    case 'nps':
      return buildScaleResult(question.id, 0, 10, value as number | null);

    default:
      return null;
  }
}
