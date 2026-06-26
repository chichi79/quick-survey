/**
 * 분기 규칙
 * @typedef {Object} SkipLogicRule
 * @property {string} id
 * @property {string} sourceQuestionId
 * @property {{ operator: 'equals'|'not_equals'|'includes'|'greater_than', value: string|number }} condition
 * @property {'skip_to'|'end_survey'} action
 * @property {string} [targetQuestionId]
 */

/**
 * 조건 평가
 */
function evaluateCondition(answerValue, condition) {
  const { operator, value } = condition;

  switch (operator) {
    case 'equals':
      return answerValue === value;
    case 'not_equals':
      return answerValue !== value;
    case 'includes':
      return Array.isArray(answerValue) && answerValue.includes(value);
    case 'greater_than':
      return Number(answerValue) > Number(value);
    default:
      return false;
  }
}

/**
 * 현재 문항 응답과 분기 규칙을 바탕으로 다음 문항 ID를 계산
 *
 * @param {string} currentId - 현재 문항 ID
 * @param {Record<string, any>} answers - 전체 응답 { questionId: value }
 * @param {SkipLogicRule[]} rules
 * @param {Array<{id:string, order:number}>} allQuestions - order 기준 정렬되어 있지 않아도 됨
 * @returns {string|null} 다음 문항 ID, 더 이상 없으면 null
 */
export function getNextQuestionId(currentId, answers, rules, allQuestions) {
  const sorted = [...allQuestions].sort((a, b) => a.order - b.order);
  const currentIndex = sorted.findIndex((q) => q.id === currentId);

  // 1. 현재 문항에 해당하는 규칙이 있는지 확인
  const matchedRule = rules.find((rule) => {
    if (rule.sourceQuestionId !== currentId) return false;
    return evaluateCondition(answers[currentId], rule.condition);
  });

  if (matchedRule) {
    if (matchedRule.action === 'end_survey') return null;
    if (matchedRule.action === 'skip_to') return matchedRule.targetQuestionId;
  }

  // 2. 규칙 없으면 order 기준 다음 문항
  const next = sorted[currentIndex + 1];
  return next ? next.id : null;
}

/**
 * 새 규칙 생성 헬퍼
 */
export function createSkipLogicRule({
  id,
  sourceQuestionId,
  operator = 'equals',
  value,
  action = 'skip_to',
  targetQuestionId = null,
}) {
  return {
    id,
    sourceQuestionId,
    condition: { operator, value },
    action,
    targetQuestionId,
  };
}
