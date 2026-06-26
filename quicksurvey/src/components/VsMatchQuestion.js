/**
 * VS 대결형 문항 렌더링
 * @param {import('../models/question.js').QuestionBase} question
 * @param {'A'|'B'|null} value
 * @param {(value: 'A'|'B') => void} onChange
 * @returns {HTMLElement}
 */
export function renderVsMatchQuestion(question, value, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'question question--vs-match';

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

  const row = document.createElement('div');
  row.className = 'vs-match';

  const makeCard = (option, key) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'vs-match__card';
    if (value === key) card.classList.add('is-selected');

    const thumb = document.createElement('div');
    thumb.className = 'vs-match__thumb';
    if (option.imageUrl) {
      const img = document.createElement('img');
      img.src = option.imageUrl;
      img.alt = option.label;
      thumb.appendChild(img);
    } else {
      thumb.textContent = '이미지 없음';
    }

    const label = document.createElement('span');
    label.textContent = option.label;

    card.appendChild(thumb);
    card.appendChild(label);
    card.addEventListener('click', () => {
      row.querySelectorAll('.vs-match__card').forEach((el) => el.classList.remove('is-selected'));
      card.classList.add('is-selected');
      onChange(key);
    });
    return card;
  };

  row.appendChild(makeCard(question.optionA, 'A'));
  const vs = document.createElement('span');
  vs.className = 'vs-match__vs';
  vs.textContent = 'VS';
  row.appendChild(vs);
  row.appendChild(makeCard(question.optionB, 'B'));

  wrapper.appendChild(row);
  return wrapper;
}
