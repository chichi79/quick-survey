/**
 * 숫자 합계형 문항 렌더링 (항목별 숫자 입력, 합계가 targetSum과 일치해야 함)
 * @param {import('../models/question.js').QuestionBase} question
 * @param {Record<string, number>} value - { [itemId]: number }
 * @param {(value: Record<string, number>) => void} onChange
 * @returns {HTMLElement}
 */
export function renderNumericQuestion(question, value, onChange) {
  const answers = { ...(value || {}) };

  const wrapper = document.createElement('div');
  wrapper.className = 'question question--numeric';

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

  const list = document.createElement('div');
  list.className = 'numeric-list';

  const sumLabel = document.createElement('p');
  sumLabel.className = 'numeric-list__sum';

  const updateSum = () => {
    const sum = Object.values(answers).reduce((acc, n) => acc + (Number(n) || 0), 0);
    sumLabel.textContent =
      question.targetSum != null ? `합계: ${sum} / ${question.targetSum}` : `합계: ${sum}`;
  };

  question.items.forEach((item) => {
    const row = document.createElement('label');
    row.className = 'numeric-list__row';

    const text = document.createElement('span');
    text.className = 'numeric-list__label';
    text.textContent = item.label;

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'numeric-list__input';
    input.value = answers[item.id] ?? '';
    input.min = '0';
    input.addEventListener('input', () => {
      answers[item.id] = input.value === '' ? 0 : Number(input.value);
      updateSum();
      onChange({ ...answers });
    });

    row.appendChild(text);
    row.appendChild(input);
    list.appendChild(row);
  });

  updateSum();

  wrapper.appendChild(list);
  wrapper.appendChild(sumLabel);
  return wrapper;
}
