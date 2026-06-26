/**
 * 슬라이더형 문항 렌더링
 * @param {import('../models/question.js').QuestionBase} question
 * @param {number|null} value
 * @param {(value: number) => void} onChange
 * @returns {HTMLElement}
 */
export function renderSliderQuestion(question, value, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'question question--slider';

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

  const sliderWrap = document.createElement('div');
  sliderWrap.className = 'slider-question';

  const initial = value ?? Math.round((question.min + question.max) / 2);

  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(question.min);
  input.max = String(question.max);
  input.step = String(question.step);
  input.value = String(initial);
  input.className = 'slider-question__input';

  const labels = document.createElement('div');
  labels.className = 'slider-question__labels';
  const minSpan = document.createElement('span');
  minSpan.textContent = question.minLabel || question.min;
  const valueSpan = document.createElement('span');
  valueSpan.className = 'slider-question__value';
  valueSpan.textContent = `${input.value}${question.unit}`;
  const maxSpan = document.createElement('span');
  maxSpan.textContent = question.maxLabel || question.max;

  input.addEventListener('input', () => {
    valueSpan.textContent = `${input.value}${question.unit}`;
    onChange(Number(input.value));
  });

  labels.appendChild(minSpan);
  labels.appendChild(valueSpan);
  labels.appendChild(maxSpan);

  sliderWrap.appendChild(input);
  sliderWrap.appendChild(labels);
  wrapper.appendChild(sliderWrap);

  onChange(Number(input.value));

  return wrapper;
}
