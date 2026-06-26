/**
 * 매트릭스(행 x 열) 문항 렌더링
 * @param {import('../models/question.js').QuestionBase} question
 * @param {Record<string, string>} value - { [rowId]: columnId }
 * @param {(value: Record<string, string>) => void} onChange
 * @returns {HTMLElement}
 */
export function renderMatrixQuestion(question, value, onChange) {
  const answers = { ...(value || {}) };

  const wrapper = document.createElement('div');
  wrapper.className = 'question question--matrix';

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

  const table = document.createElement('table');
  table.className = 'matrix-table';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  headRow.appendChild(document.createElement('th'));
  question.columns.forEach((col) => {
    const th = document.createElement('th');
    th.textContent = col.label;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  question.rows.forEach((row) => {
    const tr = document.createElement('tr');
    const rowTh = document.createElement('th');
    rowTh.scope = 'row';
    rowTh.textContent = row.label;
    tr.appendChild(rowTh);

    question.columns.forEach((col) => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `${question.id}__${row.id}`;
      input.checked = answers[row.id] === col.id;
      input.addEventListener('change', () => {
        answers[row.id] = col.id;
        onChange({ ...answers });
      });
      td.appendChild(input);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  wrapper.appendChild(table);
  return wrapper;
}
