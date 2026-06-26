/**
 * 주관식 문항 렌더링
 * @param {import('../models/question.js').QuestionBase} question
 * @param {string} value
 * @param {(value: string) => void} onChange
 * @returns {HTMLElement}
 */
export function renderOpenTextQuestion(question, value, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'question question--open-text';

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

  const input = question.multiline
    ? document.createElement('textarea')
    : document.createElement('input');

  if (!question.multiline) input.type = 'text';
  input.className = 'open-text__input';
  input.value = value || '';
  input.maxLength = question.maxLength || 200;
  input.placeholder = '답변을 입력해주세요';

  const counter = document.createElement('span');
  counter.className = 'open-text__counter';
  const updateCounter = () => {
    counter.textContent = `${input.value.length} / ${question.maxLength}`;
  };
  updateCounter();

  input.addEventListener('input', () => {
    updateCounter();
    onChange(input.value);
  });

  wrapper.appendChild(input);
  wrapper.appendChild(counter);

  return wrapper;
}
