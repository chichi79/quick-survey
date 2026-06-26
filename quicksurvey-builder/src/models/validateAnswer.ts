import type { Question } from './question';

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * quicksurvey(응답자 데모)의 validateAnswer와 동일한 규칙을 빌더 노출 미리보기에서도 적용한다.
 * 실제 응답 화면과 미리보기가 "필수 응답" 기준에서 다르게 보이지 않도록 로직을 맞춰둔다.
 */
export function validateAnswer(question: Question, value: unknown): ValidationResult {
  if (!question.required) return { valid: true };

  switch (question.type) {
    case 'single_choice':
      return value ? { valid: true } : { valid: false, message: '응답을 선택해주세요.' };

    case 'multiple_choice': {
      if (!Array.isArray(value) || value.length === 0) {
        return { valid: false, message: '하나 이상 선택해주세요.' };
      }
      if (question.maxSelect && value.length > question.maxSelect) {
        return { valid: false, message: `최대 ${question.maxSelect}개까지 선택 가능합니다.` };
      }
      return { valid: true };
    }

    case 'likert_scale':
      return value !== null && value !== undefined
        ? { valid: true }
        : { valid: false, message: '응답을 선택해주세요.' };

    case 'open_text': {
      if (!value || !String(value).trim()) {
        return { valid: false, message: '응답을 입력해주세요.' };
      }
      if (question.maxLength && String(value).length > question.maxLength) {
        return { valid: false, message: `최대 ${question.maxLength}자까지 입력 가능합니다.` };
      }
      return { valid: true };
    }

    case 'matrix': {
      if (!value || typeof value !== 'object') {
        return { valid: false, message: '모든 항목에 응답해주세요.' };
      }
      const answered = question.rows.every((row) => (value as Record<string, unknown>)[row.id] != null);
      return answered ? { valid: true } : { valid: false, message: '모든 항목에 응답해주세요.' };
    }

    case 'numeric': {
      if (!value || typeof value !== 'object') {
        return { valid: false, message: '모든 항목에 값을 입력해주세요.' };
      }
      if (question.targetSum != null) {
        const sum = Object.values(value as Record<string, number>).reduce(
          (acc, n) => acc + (Number(n) || 0),
          0,
        );
        if (sum !== question.targetSum) {
          return { valid: false, message: `합계가 ${question.targetSum}이 되어야 합니다.` };
        }
      }
      return { valid: true };
    }

    case 'star_rating':
      return value ? { valid: true } : { valid: false, message: '별점을 선택해주세요.' };

    case 'nps':
      return value !== null && value !== undefined
        ? { valid: true }
        : { valid: false, message: '점수를 선택해주세요.' };

    case 'image_choice':
    case 'emoji_reaction':
    case 'dropdown':
      return value ? { valid: true } : { valid: false, message: '응답을 선택해주세요.' };

    case 'ranking':
      return Array.isArray(value) && value.length === question.items.length
        ? { valid: true }
        : { valid: false, message: '순위를 정해주세요.' };

    case 'yes_no':
      return value === 'yes' || value === 'no'
        ? { valid: true }
        : { valid: false, message: '응답을 선택해주세요.' };

    case 'vs_match':
      return value === 'A' || value === 'B'
        ? { valid: true }
        : { valid: false, message: '한쪽을 선택해주세요.' };

    case 'contact_consent': {
      const answer = value as { name?: string; phone?: string; email?: string; agreed?: boolean } | undefined;
      if (!answer || !answer.agreed) {
        return { valid: false, message: '개인정보 수집·이용에 동의해주세요.' };
      }
      if (question.collectName && !answer.name?.trim()) {
        return { valid: false, message: '이름을 입력해주세요.' };
      }
      if (question.collectPhone && !answer.phone?.trim()) {
        return { valid: false, message: '연락처를 입력해주세요.' };
      }
      if (question.collectEmail && !answer.email?.trim()) {
        return { valid: false, message: '이메일을 입력해주세요.' };
      }
      return { valid: true };
    }

    case 'slider':
      return value !== null && value !== undefined
        ? { valid: true }
        : { valid: false, message: '값을 선택해주세요.' };

    default:
      return { valid: true };
  }
}
