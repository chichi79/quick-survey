/**
 * 순위 선택형 문항 렌더링 (위/아래 버튼으로 순서 변경)
 * @param {import('../models/question.js').QuestionBase} question
 * @param {string[]|null} value - item id 순서대로 배열
 * @param {(value: string[]) => void} onChange
 * @returns {HTMLElement}
 */
export function renderRankingQuestion(question, value, onChange) {
  let order = Array.isArray(value) && value.length === question.items.length
    ? [...value]
    : question.items.map((item) => item.id);

  const wrapper = document.createElement('div');
  wrapper.className = 'question question--ranking';

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

  const list = document.createElement('ol');
  list.className = 'ranking-list';

  const itemsById = new Map(question.items.map((item) => [item.id, item]));

  const render = () => {
    list.innerHTML = '';
    order.forEach((itemId, index) => {
      const item = itemsById.get(itemId);
      const li = document.createElement('li');
      li.className = 'ranking-list__item';

      const label = document.createElement('span');
      label.className = 'ranking-list__label';
      label.textContent = item.label;
      li.appendChild(label);

      const controls = document.createElement('div');
      controls.className = 'ranking-list__controls';

      const upBtn = document.createElement('button');
      upBtn.type = 'button';
      upBtn.textContent = '↑';
      upBtn.disabled = index === 0;
      upBtn.addEventListener('click', () => {
        [order[index - 1], order[index]] = [order[index], order[index - 1]];
        render();
        onChange([...order]);
      });

      const downBtn = document.createElement('button');
      downBtn.type = 'button';
      downBtn.textContent = '↓';
      downBtn.disabled = index === order.length - 1;
      downBtn.addEventListener('click', () => {
        [order[index + 1], order[index]] = [order[index], order[index + 1]];
        render();
        onChange([...order]);
      });

      controls.appendChild(upBtn);
      controls.appendChild(downBtn);
      li.appendChild(controls);
      list.appendChild(li);
    });
  };
  render();
  onChange([...order]);

  wrapper.appendChild(list);
  return wrapper;
}
