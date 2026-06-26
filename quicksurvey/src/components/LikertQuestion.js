/**
 * 척도(Likert) 문항 렌더링
 * @param {import('../models/question.js').QuestionBase} question
 * @param {number|null} value
 * @param {(value: number) => void} onChange
 * @returns {HTMLElement}
 */
export function renderLikertQuestion(question, value, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'question question--likert';

  const title = document.createElement('h2');
  title.className = 'question__title';
  title.textContent = question.title;
  wrapper.appendChild(title);

  if (question.description) {
    const desc = document.createElement('p');
    desc.className = 'question__description';
    desc.textContent = question.description;
    wrapper.appendChild(desc);
  }

  const scaleWrap = document.createElement('div');
  scaleWrap.className = 'likert-scale';

  if (question.minLabel) {
    const minSpan = document.createElement('span');
    minSpan.className = 'likert-scale__label likert-scale__label--min';
    minSpan.textContent = question.minLabel;
    scaleWrap.appendChild(minSpan);
  }

  const buttons = document.createElement('div');
  buttons.className = 'likert-scale__buttons';

  for (let i = question.scaleMin; i <= question.scaleMax; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'likert-scale__button';
    btn.textContent = String(i);
    btn.setAttribute('aria-pressed', String(value === i));
    if (value === i) btn.classList.add('is-selected');

    btn.addEventListener('click', () => {
      buttons.querySelectorAll('.likert-scale__button').forEach((b) => {
        b.classList.remove('is-selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-selected');
      btn.setAttribute('aria-pressed', 'true');
      onChange(i);
    });

    buttons.appendChild(btn);
  }

  scaleWrap.appendChild(buttons);

  if (question.maxLabel) {
    const maxSpan = document.createElement('span');
    maxSpan.className = 'likert-scale__label likert-scale__label--max';
    maxSpan.textContent = question.maxLabel;
    scaleWrap.appendChild(maxSpan);
  }

  wrapper.appendChild(scaleWrap);
  return wrapper;
}
