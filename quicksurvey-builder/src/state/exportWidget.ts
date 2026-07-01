import type { Survey } from '../models/project';
import type { Question } from '../models/question';

interface FirebaseConfig {
  projectId: string;
  apiKey: string;
}

const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  projectId: 'quick-survey-670fa',
  apiKey: 'AIzaSyAACnPhKeuVnTVnN0OWFN-KoKCnUqASLJY',
};

function renderQuestionJS(q: Question): string {
  switch (q.type) {
    case 'single_choice':
    case 'multiple_choice': {
      const inputType = q.type === 'single_choice' ? 'radio' : 'checkbox';
      const optionsCode = q.options
        .map(
          (o) =>
            `{ id: ${JSON.stringify(o.id)}, label: ${JSON.stringify(o.label)} }`,
        )
        .join(', ');
      const allowOther = q.allowOther ? 'true' : 'false';
      return `renderChoice(wrap, ${JSON.stringify(q.id)}, ${JSON.stringify(inputType)}, [${optionsCode}], ${allowOther})`;
    }
    case 'open_text': {
      const multiline = q.multiline ? 'true' : 'false';
      return `renderOpenText(wrap, ${JSON.stringify(q.id)}, ${multiline}, ${q.maxLength})`;
    }
    case 'likert_scale':
      return `renderLikert(wrap, ${JSON.stringify(q.id)}, ${q.scaleMin}, ${q.scaleMax}, ${JSON.stringify(q.minLabel)}, ${JSON.stringify(q.maxLabel)})`;
    case 'yes_no':
      return `renderYesNo(wrap, ${JSON.stringify(q.id)}, ${JSON.stringify(q.yesLabel)}, ${JSON.stringify(q.noLabel)})`;
    case 'nps':
      return `renderNps(wrap, ${JSON.stringify(q.id)}, ${JSON.stringify(q.minLabel)}, ${JSON.stringify(q.maxLabel)})`;
    case 'star_rating':
      return `renderStarRating(wrap, ${JSON.stringify(q.id)}, ${q.maxStars})`;
    case 'dropdown': {
      const optionsCode = q.options
        .map((o) => `{ id: ${JSON.stringify(o.id)}, label: ${JSON.stringify(o.label)} }`)
        .join(', ');
      return `renderDropdown(wrap, ${JSON.stringify(q.id)}, [${optionsCode}], ${JSON.stringify(q.placeholder)})`;
    }
    case 'slider':
      return `renderSlider(wrap, ${JSON.stringify(q.id)}, ${q.min}, ${q.max}, ${q.step}, ${JSON.stringify(q.minLabel)}, ${JSON.stringify(q.maxLabel)}, ${JSON.stringify(q.unit)})`;
    case 'emoji_reaction': {
      const optionsCode = q.options
        .map((o) => `{ id: ${JSON.stringify(o.id)}, emoji: ${JSON.stringify(o.emoji)}, label: ${JSON.stringify(o.label)} }`)
        .join(', ');
      return `renderEmojiReaction(wrap, ${JSON.stringify(q.id)}, [${optionsCode}])`;
    }
    case 'vs_match':
      return `renderVsMatch(wrap, ${JSON.stringify(q.id)}, ${JSON.stringify({ id: q.optionA.id, label: q.optionA.label, imageUrl: q.optionA.imageUrl ?? '' })}, ${JSON.stringify({ id: q.optionB.id, label: q.optionB.label, imageUrl: q.optionB.imageUrl ?? '' })})`;
    default:
      return `renderUnsupported(wrap, ${JSON.stringify((q as Question).type)})`;
  }
}

export function generateWidgetSnippet(survey: Survey, config: FirebaseConfig = DEFAULT_FIREBASE_CONFIG): string {
  const questionsSetup = survey.questions
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((q) => {
      const required = q.required ? 'true' : 'false';
      return `
  (function() {
    var wrap = createQuestion(root, ${JSON.stringify(q.id)}, ${JSON.stringify(q.title)}, ${JSON.stringify(q.description || '')}, ${required});
    ${renderQuestionJS(q)};
  })();`;
    })
    .join('');

  return `<!-- QuickSurvey 위젯: ${survey.title} (${survey.id}) -->
<div id="qs-widget-${survey.id}"></div>
<script>
(function() {
  var SURVEY_ID = ${JSON.stringify(survey.id)};
  var SURVEY_TITLE = ${JSON.stringify(survey.title)};
  var COMPLETE_MESSAGE = ${JSON.stringify(survey.completeMessage)};
  var FIREBASE_PROJECT_ID = ${JSON.stringify(config.projectId)};
  var FIREBASE_API_KEY = ${JSON.stringify(config.apiKey)};
  var REQUIRED_QUESTIONS = ${JSON.stringify(
    survey.questions.filter((q) => q.required).map((q) => q.id),
  )};

  /* ── 스타일 주입 ── */
  if (!document.getElementById('qs-widget-style')) {
    var style = document.createElement('style');
    style.id = 'qs-widget-style';
    style.textContent = [
      '.qs-widget { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 15px; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px 16px; }',
      '.qs-widget__title { font-size: 18px; font-weight: 700; margin: 0 0 20px; }',
      '.qs-question { margin-bottom: 28px; }',
      '.qs-question__title { font-size: 14px; font-weight: 600; margin: 0 0 4px; }',
      '.qs-question__required { color: #e03; margin-left: 2px; }',
      '.qs-question__desc { font-size: 13px; color: #666; margin: 0 0 10px; }',
      '.qs-choice-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }',
      '.qs-choice-item label { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; transition: border-color .15s; }',
      '.qs-choice-item label:hover { border-color: #5b6af0; }',
      '.qs-choice-item input[type=radio]:checked + span, .qs-choice-item input[type=checkbox]:checked + span { font-weight: 600; }',
      '.qs-open-text { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; resize: vertical; }',
      '.qs-open-text:focus { outline: none; border-color: #5b6af0; }',
      '.qs-likert { display: flex; gap: 6px; align-items: flex-end; }',
      '.qs-likert__labels { display: flex; justify-content: space-between; font-size: 11px; color: #888; margin-top: 4px; }',
      '.qs-likert__btn { flex: 1; padding: 8px 4px; border: 1px solid #ddd; border-radius: 6px; background: #fff; cursor: pointer; font-size: 13px; text-align: center; transition: background .15s, border-color .15s; }',
      '.qs-likert__btn.is-selected { background: #5b6af0; color: #fff; border-color: #5b6af0; }',
      '.qs-yesno { display: flex; gap: 10px; }',
      '.qs-yesno__btn { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background: #fff; cursor: pointer; font-size: 14px; transition: background .15s, border-color .15s; }',
      '.qs-yesno__btn.is-selected { background: #5b6af0; color: #fff; border-color: #5b6af0; }',
      '.qs-nps { display: flex; gap: 4px; flex-wrap: wrap; }',
      '.qs-nps__btn { width: 40px; height: 40px; border: 1px solid #ddd; border-radius: 6px; background: #fff; cursor: pointer; font-size: 13px; font-weight: 600; transition: background .15s; }',
      '.qs-nps__btn.is-selected { background: #5b6af0; color: #fff; border-color: #5b6af0; }',
      '.qs-nps__labels { display: flex; justify-content: space-between; font-size: 11px; color: #888; margin-top: 6px; }',
      '.qs-stars { display: flex; gap: 6px; }',
      '.qs-star { font-size: 28px; cursor: pointer; opacity: .3; transition: opacity .1s; }',
      '.qs-star.is-active { opacity: 1; }',
      '.qs-dropdown { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; background: #fff; }',
      '.qs-slider-wrap { display: flex; flex-direction: column; gap: 6px; }',
      '.qs-slider { width: 100%; }',
      '.qs-slider-val { font-weight: 600; font-size: 14px; }',
      '.qs-slider-labels { display: flex; justify-content: space-between; font-size: 11px; color: #888; }',
      '.qs-emoji-list { display: flex; gap: 12px; flex-wrap: wrap; }',
      '.qs-emoji-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 14px; border: 1px solid #ddd; border-radius: 10px; background: #fff; cursor: pointer; font-size: 12px; transition: border-color .15s; }',
      '.qs-emoji-btn .qs-emoji-icon { font-size: 26px; }',
      '.qs-emoji-btn.is-selected { border-color: #5b6af0; background: #f0f1ff; }',
      '.qs-vs { display: flex; gap: 12px; align-items: stretch; }',
      '.qs-vs__btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 12px; border: 2px solid #ddd; border-radius: 12px; background: #fff; cursor: pointer; font-size: 14px; font-weight: 600; transition: border-color .15s, background .15s; }',
      '.qs-vs__btn img { width: 100%; max-height: 100px; object-fit: cover; border-radius: 8px; }',
      '.qs-vs__divider { display: flex; align-items: center; font-size: 13px; font-weight: 700; color: #aaa; padding: 0 2px; }',
      '.qs-vs__btn.is-selected { border-color: #5b6af0; background: #f0f1ff; }',
      '.qs-submit { display: block; width: 100%; padding: 13px; background: #5b6af0; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 8px; }',
      '.qs-submit:hover { background: #4a59df; }',
      '.qs-submit:disabled { background: #aaa; cursor: default; }',
      '.qs-complete { text-align: center; padding: 40px 20px; font-size: 16px; color: #333; }',
      '.qs-error { color: #e03; font-size: 12px; margin-top: 6px; display: none; }',
      '.qs-error.is-visible { display: block; }',
    ].join('\\n');
    document.head.appendChild(style);
  }

  /* ── DOM 헬퍼 ── */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function createQuestion(root, qId, title, desc, required) {
    var wrap = el('div', 'qs-question');
    wrap.dataset.qId = qId;
    var titleEl = el('p', 'qs-question__title');
    titleEl.appendChild(document.createTextNode(title));
    if (required) {
      var star = el('span', 'qs-question__required', ' *');
      titleEl.appendChild(star);
    }
    wrap.appendChild(titleEl);
    if (desc) wrap.appendChild(el('p', 'qs-question__desc', desc));
    var errEl = el('p', 'qs-error');
    errEl.dataset.errFor = qId;
    root.appendChild(wrap);
    root.appendChild(errEl);
    return wrap;
  }

  /* ── 문항 렌더러 ── */
  function renderChoice(wrap, qId, inputType, options, allowOther) {
    var list = el('ul', 'qs-choice-list');
    options.forEach(function(opt) {
      var li = el('li', 'qs-choice-item');
      var lbl = el('label');
      var inp = document.createElement('input');
      inp.type = inputType;
      inp.name = 'qs-' + qId;
      inp.value = opt.id;
      var span = el('span', '', opt.label);
      lbl.appendChild(inp);
      lbl.appendChild(span);
      li.appendChild(lbl);
      list.appendChild(li);
    });
    if (allowOther) {
      var li2 = el('li', 'qs-choice-item');
      var lbl2 = el('label');
      var inp2 = document.createElement('input');
      inp2.type = inputType;
      inp2.name = 'qs-' + qId;
      inp2.value = '__other__';
      var otherInput = el('input');
      otherInput.type = 'text';
      otherInput.placeholder = '직접 입력';
      otherInput.className = 'qs-open-text';
      otherInput.style.marginTop = '4px';
      otherInput.dataset.otherId = qId;
      lbl2.appendChild(inp2);
      lbl2.appendChild(el('span', '', '기타 '));
      li2.appendChild(lbl2);
      li2.appendChild(otherInput);
      list.appendChild(li2);
    }
    wrap.appendChild(list);
  }

  function renderOpenText(wrap, qId, multiline, maxLength) {
    var inp;
    if (multiline) {
      inp = document.createElement('textarea');
      inp.rows = 4;
    } else {
      inp = document.createElement('input');
      inp.type = 'text';
    }
    inp.className = 'qs-open-text';
    inp.dataset.qId = qId;
    if (maxLength) inp.maxLength = maxLength;
    wrap.appendChild(inp);
  }

  function renderLikert(wrap, qId, scaleMin, scaleMax, minLabel, maxLabel) {
    var row = el('div', 'qs-likert');
    for (var i = scaleMin; i <= scaleMax; i++) {
      (function(val) {
        var btn = el('button', 'qs-likert__btn', String(val));
        btn.type = 'button';
        btn.dataset.qId = qId;
        btn.dataset.val = val;
        btn.addEventListener('click', function() {
          row.querySelectorAll('.qs-likert__btn').forEach(function(b) { b.classList.remove('is-selected'); });
          btn.classList.add('is-selected');
        });
        row.appendChild(btn);
      })(i);
    }
    wrap.appendChild(row);
    if (minLabel || maxLabel) {
      var labels = el('div', 'qs-likert__labels');
      labels.appendChild(el('span', '', minLabel));
      labels.appendChild(el('span', '', maxLabel));
      wrap.appendChild(labels);
    }
  }

  function renderYesNo(wrap, qId, yesLabel, noLabel) {
    var row = el('div', 'qs-yesno');
    [{ v: 'yes', l: yesLabel }, { v: 'no', l: noLabel }].forEach(function(item) {
      var btn = el('button', 'qs-yesno__btn', item.l);
      btn.type = 'button';
      btn.dataset.qId = qId;
      btn.dataset.val = item.v;
      btn.addEventListener('click', function() {
        row.querySelectorAll('.qs-yesno__btn').forEach(function(b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
      });
      row.appendChild(btn);
    });
    wrap.appendChild(row);
  }

  function renderNps(wrap, qId, minLabel, maxLabel) {
    var row = el('div', 'qs-nps');
    for (var i = 0; i <= 10; i++) {
      (function(val) {
        var btn = el('button', 'qs-nps__btn', String(val));
        btn.type = 'button';
        btn.dataset.qId = qId;
        btn.dataset.val = val;
        btn.addEventListener('click', function() {
          row.querySelectorAll('.qs-nps__btn').forEach(function(b) { b.classList.remove('is-selected'); });
          btn.classList.add('is-selected');
        });
        row.appendChild(btn);
      })(i);
    }
    wrap.appendChild(row);
    if (minLabel || maxLabel) {
      var labels = el('div', 'qs-nps__labels');
      labels.appendChild(el('span', '', minLabel));
      labels.appendChild(el('span', '', maxLabel));
      wrap.appendChild(labels);
    }
  }

  function renderStarRating(wrap, qId, maxStars) {
    var row = el('div', 'qs-stars');
    row.dataset.qId = qId;
    row.dataset.val = '0';
    for (var i = 1; i <= maxStars; i++) {
      (function(val) {
        var star = el('span', 'qs-star', '★');
        star.dataset.val = val;
        star.addEventListener('click', function() {
          row.dataset.val = val;
          row.querySelectorAll('.qs-star').forEach(function(s, idx) {
            s.classList.toggle('is-active', idx < val);
          });
        });
        row.appendChild(star);
      })(i);
    }
    wrap.appendChild(row);
  }

  function renderDropdown(wrap, qId, options, placeholder) {
    var sel = document.createElement('select');
    sel.className = 'qs-dropdown';
    sel.dataset.qId = qId;
    var def = el('option', '', placeholder);
    def.value = '';
    sel.appendChild(def);
    options.forEach(function(opt) {
      var o = el('option', '', opt.label);
      o.value = opt.id;
      sel.appendChild(o);
    });
    wrap.appendChild(sel);
  }

  function renderSlider(wrap, qId, min, max, step, minLabel, maxLabel, unit) {
    var sliderWrap = el('div', 'qs-slider-wrap');
    var valEl = el('span', 'qs-slider-val', String(Math.round((min + max) / 2)) + (unit ? ' ' + unit : ''));
    var inp = document.createElement('input');
    inp.type = 'range';
    inp.className = 'qs-slider';
    inp.min = min;
    inp.max = max;
    inp.step = step;
    inp.value = Math.round((min + max) / 2);
    inp.dataset.qId = qId;
    inp.addEventListener('input', function() {
      valEl.textContent = inp.value + (unit ? ' ' + unit : '');
    });
    sliderWrap.appendChild(valEl);
    sliderWrap.appendChild(inp);
    if (minLabel || maxLabel) {
      var labels = el('div', 'qs-slider-labels');
      labels.appendChild(el('span', '', minLabel));
      labels.appendChild(el('span', '', maxLabel));
      sliderWrap.appendChild(labels);
    }
    wrap.appendChild(sliderWrap);
  }

  function renderEmojiReaction(wrap, qId, options) {
    var row = el('div', 'qs-emoji-list');
    options.forEach(function(opt) {
      var btn = el('button', 'qs-emoji-btn');
      btn.type = 'button';
      btn.dataset.qId = qId;
      btn.dataset.val = opt.id;
      btn.appendChild(el('span', 'qs-emoji-icon', opt.emoji));
      btn.appendChild(el('span', '', opt.label));
      btn.addEventListener('click', function() {
        row.querySelectorAll('.qs-emoji-btn').forEach(function(b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
      });
      row.appendChild(btn);
    });
    wrap.appendChild(row);
  }

  function renderVsMatch(wrap, qId, optA, optB) {
    var row = el('div', 'qs-vs');
    row.dataset.qId = qId;
    [optA, optB].forEach(function(opt, idx) {
      var btn = el('button', 'qs-vs__btn');
      btn.type = 'button';
      btn.dataset.qId = qId;
      btn.dataset.val = opt.id;
      if (opt.imageUrl) {
        var img = document.createElement('img');
        img.src = opt.imageUrl;
        img.alt = opt.label;
        btn.appendChild(img);
      }
      btn.appendChild(el('span', '', opt.label));
      btn.addEventListener('click', function() {
        row.querySelectorAll('.qs-vs__btn').forEach(function(b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        row.dataset.val = opt.id;
      });
      row.appendChild(btn);
      if (idx === 0) row.appendChild(el('div', 'qs-vs__divider', 'VS'));
    });
    wrap.appendChild(row);
  }

  function renderUnsupported(wrap, type) {
    wrap.appendChild(el('p', '', '[' + type + ' 문항은 위젯에서 지원되지 않습니다]'));
  }

  /* ── 응답 수집 ── */
  function collectAnswers(root) {
    var answers = {};
    root.querySelectorAll('[data-q-id]').forEach(function(el) {
      var qId = el.dataset.qId;
      var tag = el.tagName.toLowerCase();

      if (tag === 'div' && el.classList.contains('qs-yesno')) {
        var sel = el.querySelector('.qs-yesno__btn.is-selected');
        if (sel) answers[qId] = sel.dataset.val;
      } else if (tag === 'div' && el.classList.contains('qs-nps')) {
        var sel2 = el.querySelector('.qs-nps__btn.is-selected');
        if (sel2) answers[qId] = Number(sel2.dataset.val);
      } else if (tag === 'div' && el.classList.contains('qs-likert')) {
        var sel3 = el.querySelector('.qs-likert__btn.is-selected');
        if (sel3) answers[qId] = Number(sel3.dataset.val);
      } else if (tag === 'div' && el.classList.contains('qs-stars')) {
        var v = Number(el.dataset.val);
        if (v > 0) answers[qId] = v;
      } else if (tag === 'div' && el.classList.contains('qs-vs')) {
        if (el.dataset.val) answers[qId] = el.dataset.val;
      } else if (tag === 'div' && el.classList.contains('qs-emoji-list')) {
        var sel4 = el.querySelector('.qs-emoji-btn.is-selected');
        if (sel4) answers[qId] = sel4.dataset.val;
      } else if (tag === 'textarea' || (tag === 'input' && el.type === 'text')) {
        if (el.value.trim()) answers[qId] = el.value.trim();
      } else if (tag === 'input' && el.type === 'range') {
        answers[qId] = Number(el.value);
      } else if (tag === 'select') {
        if (el.value) answers[qId] = el.value;
      }
    });

    /* radio/checkbox는 name="qs-{qId}" 기준으로 따로 수집 */
    var seen = {};
    root.querySelectorAll('input[type=radio]:checked, input[type=checkbox]:checked').forEach(function(inp) {
      var qId = inp.name.replace('qs-', '');
      if (inp.value === '__other__') {
        var otherInput = root.querySelector('[data-other-id="' + qId + '"]');
        var otherVal = otherInput ? otherInput.value.trim() : '';
        if (inp.type === 'radio') {
          answers[qId] = otherVal || '기타';
        } else {
          if (!seen[qId]) { seen[qId] = []; }
          if (otherVal) seen[qId].push(otherVal);
        }
      } else {
        if (inp.type === 'radio') {
          answers[qId] = inp.value;
        } else {
          if (!seen[qId]) seen[qId] = [];
          seen[qId].push(inp.value);
        }
      }
    });
    Object.keys(seen).forEach(function(qId) { answers[qId] = seen[qId]; });
    return answers;
  }

  /* ── 유효성 검사 ── */
  function validate(root, answers) {
    var errors = [];
    REQUIRED_QUESTIONS.forEach(function(qId) {
      var val = answers[qId];
      var isEmpty = val == null || val === '' || (Array.isArray(val) && val.length === 0);
      var errEl = root.querySelector('[data-err-for="' + qId + '"]');
      if (isEmpty) {
        errors.push(qId);
        if (errEl) { errEl.textContent = '필수 항목입니다.'; errEl.classList.add('is-visible'); }
      } else {
        if (errEl) errEl.classList.remove('is-visible');
      }
    });
    return errors.length === 0;
  }

  /* ── Firestore REST API 제출 ── */
  function toFirestoreValue(v) {
    if (Array.isArray(v)) {
      return { arrayValue: { values: v.map(function(item) { return toFirestoreValue(item); }) } };
    }
    if (typeof v === 'number') return { integerValue: String(v) };
    return { stringValue: String(v) };
  }

  function submitToFirestore(surveyId, answers, onSuccess, onError) {
    var docId = 'qs-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    var fields = { surveyId: { stringValue: surveyId }, submittedAt: { stringValue: new Date().toISOString() } };
    var answerFields = {};
    Object.keys(answers).forEach(function(k) { answerFields[k] = toFirestoreValue(answers[k]); });
    fields.answers = { mapValue: { fields: answerFields } };
    var url = 'https://firestore.googleapis.com/v1/projects/' + FIREBASE_PROJECT_ID + '/databases/(default)/documents/responses?documentId=' + encodeURIComponent(docId) + '&key=' + FIREBASE_API_KEY;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: fields }),
    }).then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      onSuccess();
    }).catch(function(err) {
      console.error('QuickSurvey 위젯 제출 오류:', err);
      onError();
    });
  }

  /* ── 렌더링 시작 ── */
  var container = document.getElementById('qs-widget-${survey.id}');
  if (!container) return;
  var root = el('div', 'qs-widget');
  root.appendChild(el('p', 'qs-widget__title', SURVEY_TITLE));
  container.appendChild(root);

${questionsSetup}

  var submitBtn = el('button', 'qs-submit', '제출하기');
  submitBtn.type = 'button';
  root.appendChild(submitBtn);

  submitBtn.addEventListener('click', function() {
    var answers = collectAnswers(root);
    if (!validate(root, answers)) return;
    submitBtn.disabled = true;
    submitBtn.textContent = '제출 중...';
    submitToFirestore(SURVEY_ID, answers, function() {
      root.innerHTML = '<div class="qs-complete">' + COMPLETE_MESSAGE + '</div>';
    }, function() {
      submitBtn.disabled = false;
      submitBtn.textContent = '제출하기';
      alert('제출에 실패했습니다. 잠시 후 다시 시도해주세요.');
    });
  });
})();
<\/script>`;
}
