/**
 * 별점 평가형 문항 렌더링
 * @param {import('../models/question.js').QuestionBase} question
 * @param {number|null} value
 * @param {(value: number) => void} onChange
 * @returns {HTMLElement}
 */
export function renderStarRatingQuestion(question, value, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'question question--star-rating';

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

  const stars = document.createElement('div');
  stars.className = 'star-rating';

  let current = value || 0;

  const render = () => {
    stars.innerHTML = '';
    for (let i = 1; i <= question.maxStars; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'star-rating__star';
      if (i <= current) btn.classList.add('is-filled');
      btn.textContent = '★';
      btn.addEventListener('click', () => {
        current = i;
        render();
        onChange(current);
      });
      stars.appendChild(btn);
    }
  };
  render();

  wrapper.appendChild(stars);
  return wrapper;
}
