/**
 * 응답자 메타데이터
 *
 * 실제 로그인/인증 시스템이 붙기 전까지의 임시 방편 — 디바이스는 User-Agent로 판별하고,
 * 연령대/성별은 데모용으로 세션당 한 번 생성해 고정한다(같은 세션 내 여러 설문에 응답해도
 * 동일 응답자로 취급).
 *
 * @typedef {Object} RespondentProfile
 * @property {string} respondentId
 * @property {'pc'|'mobile'} device
 * @property {string} ageGroup - '10s'|'20s'|'30s'|'40s'|'50s+'
 * @property {'male'|'female'} gender
 */

const SESSION_KEY = 'quicksurvey_respondent_profile';

const AGE_GROUPS = ['10s', '20s', '30s', '40s', '50s+'];
const GENDERS = ['male', 'female'];

/**
 * User-Agent 기반 PC/모바일 판별
 * @returns {'pc'|'mobile'}
 */
export function detectDevice() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  return /Mobi|Android|iPhone|iPad/i.test(ua) ? 'mobile' : 'pc';
}

function generateRespondentId() {
  return `resp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * 데모용 응답자 프로필을 sessionStorage에서 가져오거나, 없으면 새로 생성해 저장한다.
 * @returns {RespondentProfile}
 */
export function getRespondentProfile() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (raw) {
    return JSON.parse(raw);
  }

  const profile = {
    respondentId: generateRespondentId(),
    device: detectDevice(),
    ageGroup: pickRandom(AGE_GROUPS),
    gender: pickRandom(GENDERS),
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  return profile;
}
