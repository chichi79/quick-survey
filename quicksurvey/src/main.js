import { renderMissionList } from './components/MissionCard.js';
import { createMissionCard } from './models/missionCard.js';
import { mountSurvey } from './components/SurveyContainer.js';
import { renderReportView } from './components/ReportView.js';
import { demoMissionCards, demoSurvey } from './demoData.js';
import { getRespondentProfile } from './models/respondent.js';
import { createResponseLogEntry, saveResponseLog, getResponseLogs } from './models/responseLog.js';
import { buildSurveyReport } from './models/report.js';
import { subscribePublishedSurveys } from './models/firestoreSurveys.js';
import { syncResponseToFirestore } from './models/firestoreResponses.js';

const app = document.getElementById('app');

// 빌더가 Firestore에 노출(published) 처리한 설문들의 실시간 캐시.
// 구독 콜백이 갱신할 때마다 홈 화면이 떠 있으면 바로 다시 그린다.
// isFirebaseConfigured는 첫 콜백이 올 때까지 null(아직 모름) 상태다.
let publishedSurveys = [];
let isFirebaseConfigured = null;
let isHomeVisible = false;
let hasRoutedInitially = false;

/**
 * 노출 기간을 기준으로 미션 카드 상태를 정한다 — quicksurvey 노출이 ON이면
 * 목록에서 숨기지 않고, 아직 시작 전이면 "예정"으로 딤드, 기간이 지났으면
 * "종료"로 보여준다.
 * @param {string|null} startDate
 * @param {string|null} endDate
 * @returns {'upcoming'|'closed'|'available'}
 */
function getSurveyCardStatus(startDate, endDate) {
  const today = new Date().toISOString().slice(0, 10);
  if (startDate && today < startDate) return 'upcoming';
  if (endDate && today > endDate) return 'closed';
  return 'available';
}

/**
 * 데모 설문 + Firestore에서 노출 중인 설문들 중 surveyId로 하나를 찾는다.
 * 기간이 지났는지는 여기서 거르지 않는다 — 호출하는 쪽(목록 카드 구성/임베드 진입)이
 * 상황에 맞게 getSurveyCardStatus로 판단한다.
 *
 * @param {string} surveyId
 * @returns {{ meta: Object, questions: Array<Object>, rules: Array<Object> } | null}
 */
function getSurveyById(surveyId) {
  if (surveyId === demoSurvey.meta.surveyId) return demoSurvey;

  const found = publishedSurveys.find((s) => s.surveyId === surveyId);
  if (!found) return null;

  return {
    meta: {
      surveyId: found.surveyId,
      title: found.title,
      startDate: found.startDate,
      endDate: found.endDate,
      rewardPoint: found.rewardPoint,
      completeMessage: found.completeMessage,
      exposureLocation: '퀵서베이 빌더 → Firestore 실시간 연동 (예시)',
    },
    questions: found.questions,
    rules: found.rules,
  };
}

/**
 * Firestore에서 노출 중인 설문들을 데모 미션 카드와 같은 형태의 카드로 바꾼다.
 * 노출 기간이 지났거나 아직 시작 전인 설문은 목록에서 제외한다.
 */
function buildPublishedMissionCards() {
  return publishedSurveys.map((survey) =>
    createMissionCard({
      id: survey.surveyId,
      type: 'survey',
      title: survey.title,
      rewardPoint: survey.rewardPoint,
      estimatedMinutes: Math.max(1, Math.round(survey.questions.length / 2)),
      status: getSurveyCardStatus(survey.startDate, survey.endDate),
      actionUrl: `?surveyId=${encodeURIComponent(survey.surveyId)}`,
    }),
  );
}

function renderHome() {
  isHomeVisible = true;
  app.innerHTML = '';

  const cards = buildPublishedMissionCards();

  app.appendChild(renderTopbar());

  const main = document.createElement('main');
  main.className = 'home';

  const surveySection = document.createElement('section');
  surveySection.className = 'home-section';

  const surveySectionHeader = document.createElement('div');
  surveySectionHeader.className = 'home-section__header';

  const surveySectionTitle = document.createElement('h2');
  surveySectionTitle.className = 'home-section__title';
  surveySectionTitle.textContent = '오픈된 설문';

  const surveySectionCount = document.createElement('span');
  surveySectionCount.className = 'home-section__count';
  surveySectionCount.textContent = `${cards.length}`;

  surveySectionHeader.appendChild(surveySectionTitle);
  surveySectionHeader.appendChild(surveySectionCount);

  const surveySectionDesc = document.createElement('p');
  surveySectionDesc.className = 'home-section__desc';
  surveySectionDesc.textContent = '퀵서베이 빌더에서 노출 ON 한 설문이 실시간으로 표시됩니다.';

  const list = document.createElement('div');
  list.className = 'mission-list';

  surveySection.appendChild(surveySectionHeader);
  surveySection.appendChild(surveySectionDesc);
  surveySection.appendChild(list);

  const demoSection = document.createElement('section');
  demoSection.className = 'home-section home-section--muted';

  const demoSectionHeader = document.createElement('div');
  demoSectionHeader.className = 'home-section__header';
  const demoSectionTitle = document.createElement('h2');
  demoSectionTitle.className = 'home-section__title';
  demoSectionTitle.textContent = '데모';
  demoSectionHeader.appendChild(demoSectionTitle);

  const reportLink = document.createElement('a');
  reportLink.className = 'home-section__link';
  reportLink.textContent = '영업 레퍼런스 리포트 보기 →';
  reportLink.addEventListener('click', renderReportScreen);

  demoSection.appendChild(demoSectionHeader);
  demoSection.appendChild(reportLink);

  main.appendChild(surveySection);
  main.appendChild(demoSection);
  app.appendChild(main);

  renderMissionList(list, cards, (card) => {
    navigateToSurvey(card.id);
  });
}

/**
 * 설문별로 북마크/공유 가능한 URL이 남도록, 목록에서 카드를 클릭할 때도
 * 임베드 진입(renderEmbedEntry)과 똑같이 주소창에 ?surveyId=를 반영한다.
 * @param {string} surveyId
 */
function navigateToSurvey(surveyId) {
  history.pushState({}, '', `?surveyId=${encodeURIComponent(surveyId)}`);
  renderEmbedEntry(surveyId);
}

/** 목록으로 돌아갈 때 주소창의 ?surveyId=도 같이 지운다. */
function navigateToHome() {
  history.pushState({}, '', window.location.pathname);
  renderHome();
}

/**
 * 진짜 iframe 안에서 떠 있는지 여부.
 * 같은 ?surveyId= URL이라도 iframe 안이면 좁은 모듈(300x400)에 맞춘 압축 UI +
 * "크게 보기" 버튼을 보여주고, 새 탭으로 열렸을 때는(= 크게 보기를 누른 상태)
 * 평범한 풀페이지로 보여준다.
 */
function isRunningInIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/**
 * iframe 임베드 모드에서만 상단에 "크게 보기" 링크를 붙인다 — 같은 URL을
 * 새 탭으로 열면 iframe이 아니게 되므로 자동으로 풀페이지 모드가 된다.
 */
function appendExpandBar(container, embed) {
  if (!embed) return;
  const bar = document.createElement('div');
  bar.className = 'embed-expand-bar';

  const link = document.createElement('a');
  link.className = 'embed-expand-bar__link';
  link.textContent = '크게 보기 ↗';
  link.addEventListener('click', () => {
    window.open(window.location.href, '_blank');
  });

  bar.appendChild(link);
  container.appendChild(bar);
}

function renderSurveyScreen(survey, { embed = false } = {}) {
  isHomeVisible = false;
  app.innerHTML = '';
  appendExpandBar(app, embed);

  const mount = document.createElement('div');
  app.appendChild(mount);

  mountSurvey(mount, survey, (answers) => {
    const { surveyId } = survey.meta;
    const respondent = getRespondentProfile();
    const logEntry = createResponseLogEntry({ surveyId, answers, respondent });
    saveResponseLog(logEntry);
    void syncResponseToFirestore(logEntry);

    // 개발 확인용: 해당 설문에 누적된 응답 원본 로그를 테이블로 출력
    console.table(getResponseLogs(surveyId));

    renderCompleteScreen(answers, {
      embed,
      rewardPoint: survey.meta.rewardPoint,
      completeMessage: survey.meta.completeMessage,
    });
  });
}

/**
 * URL의 ?surveyId= 로 미션 목록을 거치지 않고 바로 설문 화면으로 진입한다.
 * 뉴스 기사 우측 모듈 같은 곳에 iframe으로 끼워넣을 때 쓰는 경로 —
 * 예: http://localhost:5180/?surveyId=survey-002
 *
 * @param {string} requestedSurveyId
 */
function renderEmbedEntry(requestedSurveyId) {
  const survey = getSurveyById(requestedSurveyId);

  if (!survey) {
    isHomeVisible = false;
    app.innerHTML = '';
    const message = document.createElement('p');
    message.className = 'import-box__status import-box__status--error';
    message.textContent = `설문을 찾을 수 없습니다 (surveyId: ${requestedSurveyId}). 빌더에서 "quicksurvey 노출"이 켜져 있는지 확인해주세요.`;
    app.appendChild(message);
    return;
  }

  const cardStatus = getSurveyCardStatus(survey.meta.startDate, survey.meta.endDate);
  if (cardStatus !== 'available') {
    isHomeVisible = false;
    app.innerHTML = '';
    const message = document.createElement('p');
    message.className = 'import-box__status import-box__status--error';
    const reason = cardStatus === 'upcoming' ? '아직 시작 전인 설문입니다.' : '종료된 설문입니다.';
    message.textContent = `${reason} (노출 기간: ${survey.meta.startDate ?? '제한 없음'} ~ ${survey.meta.endDate ?? '제한 없음'})`;
    app.appendChild(message);
    return;
  }

  const embed = isRunningInIframe();
  if (embed) {
    document.body.classList.add('is-embed');
  }
  renderSurveyScreen(survey, { embed });
}

function renderReportScreen() {
  isHomeVisible = false;
  app.innerHTML = '';

  const survey = demoSurvey;
  const surveyCard = demoMissionCards.find((card) => card.id === survey.meta.surveyId);
  const report = buildSurveyReport(survey);

  app.appendChild(renderReportView(report, surveyCard?.title ?? survey.meta.surveyId));

  const back = document.createElement('a');
  back.className = 'back-link';
  back.textContent = '목록으로 돌아가기';
  back.addEventListener('click', navigateToHome);
  app.appendChild(back);
}

/**
 * 상단 고정 바: 서비스 이름 + 빌더 ↔ Firestore 연동 상태를 작은 점/배지로 보여준다.
 * 이 페이지는 퀵서베이 빌더에서 "quicksurvey 노출"을 켠 설문만 보여준다
 * (데모용 가짜 미션 카드는 더 이상 섞지 않는다).
 */
function renderTopbar() {
  const bar = document.createElement('header');
  bar.className = 'home-topbar';

  const brand = document.createElement('div');
  brand.className = 'home-topbar__brand';

  const icon = document.createElement('img');
  icon.className = 'home-topbar__icon';
  icon.src = '/favicon.svg';
  icon.alt = '';

  const logo = document.createElement('span');
  logo.className = 'home-topbar__logo';
  logo.textContent = '퀵서베이';

  brand.appendChild(icon);
  brand.appendChild(logo);

  const status = document.createElement('span');
  status.className = 'home-topbar__status';
  if (isFirebaseConfigured === false) {
    status.classList.add('home-topbar__status--error');
    status.textContent = '● 빌더 연동 안 됨';
  } else if (isFirebaseConfigured === null) {
    status.classList.add('home-topbar__status--pending');
    status.textContent = '● 연동 확인 중';
  } else {
    status.classList.add('home-topbar__status--ok');
    status.textContent = `● 빌더 연동됨`;
  }

  bar.appendChild(brand);
  bar.appendChild(status);
  return bar;
}

/** 현재 주소창(?surveyId=)을 보고 홈/설문 화면 중 무엇을 그릴지 정한다. */
function routeFromLocation() {
  const requestedSurveyId = new URLSearchParams(window.location.search).get('surveyId');
  if (requestedSurveyId) {
    renderEmbedEntry(requestedSurveyId);
  } else {
    renderHome();
  }
}

function routeInitial() {
  if (hasRoutedInitially) return;
  hasRoutedInitially = true;
  routeFromLocation();
}

// 브라우저 뒤로/앞으로 가기로도 홈 ↔ 설문 화면이 주소창과 맞게 다시 그려지게 한다.
window.addEventListener('popstate', () => {
  if (hasRoutedInitially) routeFromLocation();
});

subscribePublishedSurveys((surveys) => {
  isFirebaseConfigured = surveys !== null;
  publishedSurveys = surveys ?? [];
  if (!hasRoutedInitially) {
    routeInitial();
  } else if (isHomeVisible) {
    renderHome();
  }
});

function renderCompleteScreen(
  answers,
  { embed = false, rewardPoint = 100, completeMessage = '설문에 참여해주셔서 감사합니다!' } = {},
) {
  isHomeVisible = false;
  app.innerHTML = '';
  appendExpandBar(app, embed);

  const wrap = document.createElement('div');
  wrap.className = 'survey-complete';

  const emoji = document.createElement('div');
  emoji.className = 'survey-complete__emoji';
  emoji.textContent = '🎉';

  const title = document.createElement('p');
  title.className = 'survey-complete__title';
  title.textContent = completeMessage;

  const reward = document.createElement('p');
  reward.className = 'survey-complete__reward';
  reward.textContent = `+${rewardPoint.toLocaleString()}P 적립 완료`;

  wrap.appendChild(emoji);
  wrap.appendChild(title);
  wrap.appendChild(reward);

  if (!embed) {
    const back = document.createElement('a');
    back.className = 'back-link';
    back.textContent = '목록으로 돌아가기';
    back.addEventListener('click', navigateToHome);
    wrap.appendChild(back);
  }

  app.appendChild(wrap);

  // 개발 확인용: 콘솔에 실제 응답 데이터 출력
  console.log('survey answers:', answers);
}
