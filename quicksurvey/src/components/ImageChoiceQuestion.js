/**
 * 이미지 선택형 문항 렌더링 (단일 선택)
 * @param {import('../models/question.js').QuestionBase} question
 * @param {string|null} value - 선택된 옵션 id
 * @param {(value: string) => void} onChange
 * @returns {HTMLElement}
 */
export function renderImageChoiceQuestion(question, value, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'question question--image-choice';

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

  const grid = document.createElement('div');
  grid.className = 'image-choice-grid';

  question.options.forEach((opt) => {
    const label = document.createElement('label');
    label.className = 'image-choice-option';
    if (value === opt.id) label.classList.add('is-selected');

    const thumb = document.createElement('div');
    thumb.className = 'image-choice-option__thumb';
    if (opt.imageUrl) {
      const img = document.createElement('img');
      img.src = opt.imageUrl;
      img.alt = opt.label;
      thumb.appendChild(img);
    } else {
      thumb.textContent = '이미지 없음';
    }

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = question.id;
    input.value = opt.id;
    input.checked = value === opt.id;
    input.addEventListener('change', () => {
      grid.querySelectorAll('.image-choice-option').forEach((el) => el.classList.remove('is-selected'));
      label.classList.add('is-selected');
      onChange(opt.id);
    });

    const text = document.createElement('span');
    text.textContent = opt.label;

    label.appendChild(thumb);
    label.appendChild(text);
    label.appendChild(input);
    grid.appendChild(label);
  });

  wrapper.appendChild(grid);
  return wrapper;
}
