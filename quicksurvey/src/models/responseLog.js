/**
 * 응답 원본(Raw) 로그
 *
 * 집계(합계)만 남기면 "누가 찍었는지"는 복원이 불가능하므로, 응답 한 건 한 건을
 * row 단위로 저장해 나중에 다른 기준으로 재집계/재분석할 수 있게 한다.
 *
 * @typedef {Object} ResponseLogEntry
 * @property {string} id
 * @property {string} surveyId
 * @property {string} submittedAt - ISO 8601
 * @property {Record<string, any>} answers - { questionId: value }
 * @property {import('./respondent.js').RespondentProfile} respondent
 */

const STORAGE_KEY = 'quicksurvey_response_logs';

function generateLogId() {
  return `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readAllLogs() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeAllLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

/**
 * @param {{ surveyId: string, answers: Record<string, any>, respondent: import('./respondent.js').RespondentProfile }} params
 * @returns {ResponseLogEntry}
 */
export function createResponseLogEntry({ surveyId, answers, respondent }) {
  return {
    id: generateLogId(),
    surveyId,
    submittedAt: new Date().toISOString(),
    answers,
    respondent,
  };
}

/**
 * @param {ResponseLogEntry} entry
 */
export function saveResponseLog(entry) {
  const logs = readAllLogs();
  logs.push(entry);
  writeAllLogs(logs);
}

/**
 * @param {string} surveyId
 * @returns {ResponseLogEntry[]}
 */
export function getResponseLogs(surveyId) {
  return readAllLogs().filter((log) => log.surveyId === surveyId);
}

/**
 * @param {string} surveyId
 * @returns {{ totalParticipants: number }}
 */
export function getSurveyStats(surveyId) {
  return {
    totalParticipants: getResponseLogs(surveyId).length,
  };
}
