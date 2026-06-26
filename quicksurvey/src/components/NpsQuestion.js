/**
 * NPS(0~10점) 문항 렌더링
 * @param {import('../models/question.js').QuestionBase} question
 * @param {number|null} value
 * @param {(value: number) => void} onChange
 * @returns {HTMLElement}
 */
export function renderNpsQuestion(question, value, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'question question--nps';

  const title = document.createElement('h2');
  title.className = 'question__title';
  title.textContent = question.title;
  if (question.required) {
    const mark = document.createElement('span');
    mark.className = 'question__required';
    mark.textContent = ' *';
    title.appendChild(mark);
  }
  wrapper.appendChild(title);

  if (question.description) {
    const desc = document.createElement('p');
    desc.className = 'question__description';
    desc.textContent = question.description;
    wrapper.appendChild(desc);
  }

  const scaleWrap = document.createElement('div');
  scaleWrap.className = 'nps-scale';

  const buttons = document.createElement('div');
  buttons.className = 'nps-scale__buttons';

  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nps-scale__button';
    btn.textContent = String(i);
    if (value === i) btn.classList.add('is-selected');
    btn.addEventListener('click', () => {
      buttons.querySelectorAll('.nps-scale__button').forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      onChange(i);
    });
    buttons.appendChild(btn);
  }
  scaleWrap.appendChild(buttons);

  const labels = document.createElement('div');
  labels.className = 'nps-scale__labels';
  const min = document.createElement('span');
  min.textContent = question.minLabel || '';
  const max = document.createElement('span');
  max.textContent = question.maxLabel || '';
  labels.appendChild(min);
  labels.appendChild(max);
  scaleWrap.appendChild(labels);

  wrapper.appendChild(scaleWrap);
  return wrapper;
}
