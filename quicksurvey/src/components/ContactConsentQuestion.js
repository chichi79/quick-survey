/**
 * 개인정보 수집형 문항 렌더링 (이름/연락처/이메일 + 동의 체크박스)
 * @param {import('../models/question.js').QuestionBase} question
 * @param {{ name?: string, phone?: string, email?: string, agreed: boolean }|null} value
 * @param {(value: Object) => void} onChange
 * @returns {HTMLElement}
 */
export function renderContactConsentQuestion(question, value, onChange) {
  const answer = { name: '', phone: '', email: '', agreed: false, ...(value || {}) };

  const wrapper = document.createElement('div');
  wrapper.className = 'question question--contact-consent';

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

  const fields = document.createElement('div');
  fields.className = 'contact-consent-fields';

  const addField = (key, labelText, placeholder) => {
    const label = document.createElement('label');
    label.className = 'contact-consent-fields__field';
    const span = document.createElement('span');
    span.textContent = labelText;
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    input.value = answer[key];
    input.addEventListener('input', () => {
      answer[key] = input.value;
      onChange({ ...answer });
    });
    label.appendChild(span);
    label.appendChild(input);
    fields.appendChild(label);
  };

  if (question.collectName) addField('name', '이름', '이름을 입력해주세요');
  if (question.collectPhone) addField('phone', '연락처', '010-0000-0000');
  if (question.collectEmail) addField('email', '이메일', 'example@email.com');

  wrapper.appendChild(fields);

  const agreeLabel = document.createElement('label');
  agreeLabel.className = 'contact-consent-agree';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = answer.agreed;
  checkbox.addEventListener('change', () => {
    answer.agreed = checkbox.checked;
    onChange({ ...answer });
  });
  const text = document.createElement('span');
  text.textContent = question.consentText;
  agreeLabel.appendChild(checkbox);
  agreeLabel.appendChild(text);
  wrapper.appendChild(agreeLabel);

  return wrapper;
}
