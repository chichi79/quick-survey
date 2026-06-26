/**
 * 예/아니오 문항 렌더링
 * @param {import('../models/question.js').QuestionBase} question
 * @param {'yes'|'no'|null} value
 * @param {(value: 'yes'|'no') => void} onChange
 * @returns {HTMLElement}
 */
export function renderYesNoQuestion(question, value, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'question question--yes-no';

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

  const buttons = document.createElement('div');
  buttons.className = 'yes-no-buttons';

  const yesBtn = document.createElement('button');
  yesBtn.type = 'button';
  yesBtn.className = 'yes-no-buttons__button yes-no-buttons__button--yes';
  yesBtn.textContent = question.yesLabel;
  if (value === 'yes') yesBtn.classList.add('is-selected');

  const noBtn = document.createElement('button');
  noBtn.type = 'button';
  noBtn.className = 'yes-no-buttons__button yes-no-buttons__button--no';
  noBtn.textContent = question.noLabel;
  if (value === 'no') noBtn.classList.add('is-selected');

  yesBtn.addEventListener('click', () => {
    yesBtn.classList.add('is-selected');
    noBtn.classList.remove('is-selected');
    onChange('yes');
  });
  noBtn.addEventListener('click', () => {
    noBtn.classList.add('is-selected');
    yesBtn.classList.remove('is-selected');
    onChange('no');
  });

  buttons.appendChild(yesBtn);
  buttons.appendChild(noBtn);
  wrapper.appendChild(buttons);
  return wrapper;
}
