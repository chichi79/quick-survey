/**
 * 이모지 반응형 문항 렌더링 (단일 선택)
 * @param {import('../models/question.js').QuestionBase} question
 * @param {string|null} value - 선택된 옵션 id
 * @param {(value: string) => void} onChange
 * @returns {HTMLElement}
 */
export function renderEmojiReactionQuestion(question, value, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'question question--emoji-reaction';

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
  list.className = 'emoji-reaction-list';

  question.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'emoji-reaction-option';
    if (value === opt.id) btn.classList.add('is-selected');

    const emoji = document.createElement('span');
    emoji.className = 'emoji-reaction-option__emoji';
    emoji.textContent = opt.emoji;

    const label = document.createElement('span');
    label.className = 'emoji-reaction-option__label';
    label.textContent = opt.label;

    btn.appendChild(emoji);
    btn.appendChild(label);

    btn.addEventListener('click', () => {
      list.querySelectorAll('.emoji-reaction-option').forEach((el) => el.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      onChange(opt.id);
    });

    list.appendChild(btn);
  });

  wrapper.appendChild(list);
  return wrapper;
}
