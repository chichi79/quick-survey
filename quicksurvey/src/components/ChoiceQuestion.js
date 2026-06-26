/**
 * 단일/복수 선택 문항 렌더링
 * @param {import('../models/question.js').QuestionBase} question
 * @param {string|string[]|null} value - 현재 선택된 값
 * @param {(value: string|string[]) => void} onChange
 * @returns {HTMLElement}
 */
export function renderChoiceQuestion(question, value, onChange) {
  const isMultiple = question.type === 'multiple_choice';
  const selected = new Set(
    isMultiple ? (Array.isArray(value) ? value : []) : value ? [value] : []
  );

  const wrapper = document.createElement('div');
  wrapper.className = 'question question--choice';

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

  if (isMultiple && question.maxSelect) {
    const hint = document.createElement('p');
    hint.className = 'question__hint';
    hint.textContent = `최대 ${question.maxSelect}개까지 선택 가능합니다.`;
    wrapper.appendChild(hint);
  }

  const optionList = document.createElement('div');
  optionList.className = 'option-list';

  question.options.forEach((opt) => {
    const label = document.createElement('label');
    label.className = 'option-item';

    const input = document.createElement('input');
    input.type = isMultiple ? 'checkbox' : 'radio';
    input.name = question.id;
    input.value = opt.id;
    input.checked = selected.has(opt.id);

    input.addEventListener('change', () => {
      if (isMultiple) {
        if (input.checked) {
          if (question.maxSelect && selected.size >= question.maxSelect) {
            input.checked = false;
            return;
          }
          selected.add(opt.id);
        } else {
          selected.delete(opt.id);
        }
        onChange(Array.from(selected));
      } else {
        onChange(opt.id);
      }
    });

    const text = document.createElement('span');
    text.className = 'option-item__label';
    text.textContent = opt.label;

    label.appendChild(input);
    label.appendChild(text);

    if (opt.imageUrl) {
      const img = document.createElement('img');
      img.src = opt.imageUrl;
      img.alt = opt.label;
      img.className = 'option-item__image';
      label.appendChild(img);
    }

    optionList.appendChild(label);
  });

  if (question.allowOther) {
    const otherLabel = document.createElement('label');
    otherLabel.className = 'option-item option-item--other';
    const otherInput = document.createElement('input');
    otherInput.type = 'text';
    otherInput.placeholder = '기타 (직접 입력)';
    otherInput.addEventListener('input', (e) => {
      onChange(isMultiple ? Array.from(selected) : e.target.value);
    });
    otherLabel.appendChild(otherInput);
    optionList.appendChild(otherLabel);
  }

  wrapper.appendChild(optionList);
  return wrapper;
}
