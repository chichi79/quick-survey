import { renderQuestion } from './QuestionRenderer.js';
import { renderProgressBar } from './ProgressBar.js';
import { getNextQuestionId } from '../models/skipLogic.js';
import { validateAnswer } from '../models/question.js';

/**
 * 설문 전체 흐름을 제어하는 컨테이너.
 *
 * 문항 컴포넌트(QuestionRenderer 하위)는 흐름을 모르고,
 * 이 컨테이너가 "분기 로직 + 진행률 + 다음/이전"을 전부 책임진다.
 * → 응답자 화면 / 제작도구 미리보기에서 동일하게 재사용 가능.
 *
 * @param {HTMLElement} mountEl - 렌더링할 대상 엘리먼트
 * @param {Object} survey
 * @param {import('../models/question.js').QuestionBase[]} survey.questions
 * @param {import('../models/skipLogic.js').SkipLogicRule[]} survey.rules
 * @param {(answers: Record<string, any>) => void} onComplete
 */
export function mountSurvey(mountEl, survey, onComplete) {
  const { questions, rules = [] } = survey;
  const sorted = [...questions].sort((a, b) => a.order - b.order);

  const state = {
    currentId: sorted[0]?.id ?? null,
    answers: {},
    history: [], // 뒤로가기용 방문 기록
  };

  function getQuestionById(id) {
    return sorted.find((q) => q.id === id);
  }

  function render() {
    mountEl.innerHTML = '';

    if (!state.currentId) {
      onComplete(state.answers);
      return;
    }

    const question = getQuestionById(state.currentId);
    if (!question) {
      onComplete(state.answers);
      return;
    }

    const container = document.createElement('div');
    container.className = 'survey-container';

    const currentIndex = sorted.findIndex((q) => q.id === question.id);
    container.appendChild(renderProgressBar(currentIndex + 1, sorted.length));

    const errorBox = document.createElement('p');
    errorBox.className = 'survey-container__error';

    const questionEl = renderQuestion(
      question,
      state.answers[question.id],
      (value) => {
        state.answers[question.id] = value;
        errorBox.textContent = '';
      }
    );
    container.appendChild(questionEl);
    container.appendChild(errorBox);

    const nav = document.createElement('div');
    nav.className = 'nav-controls';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'nav-controls__prev';
    prevBtn.textContent = '이전';
    prevBtn.disabled = state.history.length === 0;
    prevBtn.addEventListener('click', () => {
      const prevId = state.history.pop();
      if (prevId) {
        state.currentId = prevId;
        render();
      }
    });

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'nav-controls__next';
    nextBtn.textContent = currentIndex === sorted.length - 1 ? '완료' : '다음';
    nextBtn.addEventListener('click', () => {
      const { valid, message } = validateAnswer(question, state.answers[question.id]);
      if (!valid) {
        errorBox.textContent = message;
        return;
      }

      const nextId = getNextQuestionId(question.id, state.answers, rules, sorted);
      state.history.push(question.id);
      state.currentId = nextId;
      render();
    });

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    container.appendChild(nav);

    mountEl.appendChild(container);
  }

  render();
}
