/**
 * 영업 레퍼런스 리포트 화면
 * @param {ReturnType<import('../models/report.js').buildSurveyReport>} report
 * @param {string} surveyTitle
 * @returns {HTMLElement}
 */
export function renderReportView(report, surveyTitle) {
  const wrap = document.createElement('div');
  wrap.className = 'report-view';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = '영업 레퍼런스 리포트';
  wrap.appendChild(title);

  const surveyName = document.createElement('h2');
  surveyName.className = 'report-view__survey-title';
  surveyName.textContent = surveyTitle;
  wrap.appendChild(surveyName);

  const summary = document.createElement('dl');
  summary.className = 'report-view__summary';
  appendSummaryRow(summary, '운영 기간', `${report.startDate} ~ ${report.endDate}`);
  appendSummaryRow(summary, '참여자 수', `${report.totalParticipants}명`);
  appendSummaryRow(summary, '노출 위치', report.exposureLocation);
  wrap.appendChild(summary);

  const questionsTitle = document.createElement('h3');
  questionsTitle.className = 'report-view__section-title';
  questionsTitle.textContent = '문항별 응답 분포';
  wrap.appendChild(questionsTitle);

  for (const summaryItem of report.questionSummaries) {
    wrap.appendChild(renderQuestionSummary(summaryItem));
  }

  return wrap;
}

function appendSummaryRow(dl, label, value) {
  const dt = document.createElement('dt');
  dt.textContent = label;
  const dd = document.createElement('dd');
  dd.textContent = value;
  dl.appendChild(dt);
  dl.appendChild(dd);
}

function renderQuestionSummary(summaryItem) {
  const card = document.createElement('div');
  card.className = 'report-question-card';

  const title = document.createElement('p');
  title.className = 'report-question-card__title';
  title.textContent = summaryItem.title || '(제목 없음)';
  card.appendChild(title);

  const totalCount = summaryItem.distribution.reduce((sum, item) => sum + item.count, 0);

  const list = document.createElement('div');
  list.className = 'report-question-card__bars';

  for (const item of summaryItem.distribution) {
    const row = document.createElement('div');
    row.className = 'report-bar-row';

    const label = document.createElement('span');
    label.className = 'report-bar-row__label';
    label.textContent = item.label;

    const track = document.createElement('div');
    track.className = 'report-bar-row__track';
    const fill = document.createElement('div');
    fill.className = 'report-bar-row__fill';
    const percent = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
    fill.style.width = `${percent}%`;
    track.appendChild(fill);

    const count = document.createElement('span');
    count.className = 'report-bar-row__count';
    count.textContent = `${item.count}건`;

    row.appendChild(label);
    row.appendChild(track);
    row.appendChild(count);
    list.appendChild(row);
  }

  card.appendChild(list);
  return card;
}
