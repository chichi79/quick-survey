/**
 * 드롭다운 선택형 문항 렌더링
 * @param {import('../models/question.js').QuestionBase} question
 * @param {string|null} value - 선택된 옵션 id
 * @param {(value: string) => void} onChange
 * @returns {HTMLElement}
 */
export function renderDropdownQuestion(question, value, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'question question--dropdown';

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

  const select = document.createElement('select');
  select.className = 'dropdown-select';

  const placeholderOpt = document.createElement('option');
  placeholderOpt.value = '';
  placeholderOpt.textContent = question.placeholder || '선택해주세요';
  placeholderOpt.disabled = true;
  placeholderOpt.selected = !value;
  select.appendChild(placeholderOpt);

  question.options.forEach((opt) => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.id;
    optionEl.textContent = opt.label;
    optionEl.selected = value === opt.id;
    select.appendChild(optionEl);
  });

  select.addEventListener('change', () => {
    onChange(select.value);
  });

  wrapper.appendChild(select);
  return wrapper;
}
