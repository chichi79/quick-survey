/**
 * 문항 타입 정의
 * @typedef {'single_choice'|'multiple_choice'|'likert_scale'|'open_text'|'matrix'} QuestionType
 */

/**
 * 모든 문항이 공유하는 베이스 필드
 * @typedef {Object} QuestionBase
 * @property {string} id
 * @property {QuestionType} type
 * @property {string} title
 * @property {string} [description]
 * @property {boolean} required
 * @property {number} order
 */

/**
 * 단일/복수 선택 문항 생성
 * @param {Object} params
 * @returns {Object}
 */
export function createChoiceQuestion({
  id,
  type = 'single_choice',
  title,
  description = '',
  required = true,
  order = 0,
  options = [],
  maxSelect = null,
  allowOther = false,
}) {
  return {
    id,
    type, // 'single_choice' | 'multiple_choice'
    title,
    description,
    required,
    order,
    options, // [{ id, label, imageUrl? }]
    maxSelect,
    allowOther,
  };
}

/**
 * 척도/평점(Likert) 문항 생성
 */
export function createLikertQuestion({
  id,
  title,
  description = '',
  required = true,
  order = 0,
  scaleMin = 1,
  scaleMax = 5,
  minLabel = '',
  maxLabel = '',
}) {
  return {
    id,
    type: 'likert_scale',
    title,
    description,
    required,
    order,
    scaleMin,
    scaleMax,
    minLabel,
    maxLabel,
  };
}

/**
 * 주관식 문항 생성
 */
export function createOpenTextQuestion({
  id,
  title,
  description = '',
  required = true,
  order = 0,
  maxLength = 200,
  multiline = false,
}) {
  return {
    id,
    type: 'open_text',
    title,
    description,
    required,
    order,
    maxLength,
    multiline,
  };
}

/**
 * 매트릭스 문항 생성 (행 × 열)
 */
export function createMatrixQuestion({
  id,
  title,
  description = '',
  required = true,
  order = 0,
  rows = [],
  columns = [],
}) {
  return {
    id,
    type: 'matrix',
    title,
    description,
    required,
    order,
    rows, // [{ id, label }]
    columns, // [{ id, label }]
  };
}

/**
 * 문항 응답 유효성 검사
 * @param {Object} question
 * @param {*} value
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateAnswer(question, value) {
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
      return (value !== null && value !== undefined)
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
      const answered = question.rows.every((row) => value[row.id] != null);
      return answered ? { valid: true } : { valid: false, message: '모든 항목에 응답해주세요.' };
    }

    case 'numeric': {
      if (!value || typeof value !== 'object') {
        return { valid: false, message: '모든 항목에 값을 입력해주세요.' };
      }
      if (question.targetSum != null) {
        const sum = Object.values(value).reduce((acc, n) => acc + (Number(n) || 0), 0);
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
      if (!value || !value.agreed) {
        return { valid: false, message: '개인정보 수집·이용에 동의해주세요.' };
      }
      if (question.collectName && !value.name?.trim()) {
        return { valid: false, message: '이름을 입력해주세요.' };
      }
      if (question.collectPhone && !value.phone?.trim()) {
        return { valid: false, message: '연락처를 입력해주세요.' };
      }
      if (question.collectEmail && !value.email?.trim()) {
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
