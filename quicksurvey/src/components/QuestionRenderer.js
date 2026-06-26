import { renderChoiceQuestion } from './ChoiceQuestion.js';
import { renderLikertQuestion } from './LikertQuestion.js';
import { renderOpenTextQuestion } from './OpenTextQuestion.js';
import { renderMatrixQuestion } from './MatrixQuestion.js';
import { renderNumericQuestion } from './NumericQuestion.js';
import { renderStarRatingQuestion } from './StarRatingQuestion.js';
import { renderNpsQuestion } from './NpsQuestion.js';
import { renderImageChoiceQuestion } from './ImageChoiceQuestion.js';
import { renderRankingQuestion } from './RankingQuestion.js';
import { renderEmojiReactionQuestion } from './EmojiReactionQuestion.js';
import { renderYesNoQuestion } from './YesNoQuestion.js';
import { renderVsMatchQuestion } from './VsMatchQuestion.js';
import { renderDropdownQuestion } from './DropdownQuestion.js';
import { renderContactConsentQuestion } from './ContactConsentQuestion.js';
import { renderSliderQuestion } from './SliderQuestion.js';

/**
 * question.type에 따라 적절한 컴포넌트로 분기
 *
 * 새 문항 타입을 추가할 땐 이 switch문에 case만 추가하면 됨.
 * 각 하위 컴포넌트는 question/value/onChange만 다루고
 * 설문 흐름(분기, 진행률)은 알지 못함 — 관심사 분리.
 *
 * @param {import('../models/question.js').QuestionBase} question
 * @param {*} value
 * @param {(value: any) => void} onChange
 * @returns {HTMLElement}
 */
export function renderQuestion(question, value, onChange) {
  switch (question.type) {
    case 'single_choice':
    case 'multiple_choice':
      return renderChoiceQuestion(question, value, onChange);

    case 'likert_scale':
      return renderLikertQuestion(question, value, onChange);

    case 'open_text':
      return renderOpenTextQuestion(question, value, onChange);

    case 'matrix':
      return renderMatrixQuestion(question, value, onChange);

    case 'numeric':
      return renderNumericQuestion(question, value, onChange);

    case 'star_rating':
      return renderStarRatingQuestion(question, value, onChange);

    case 'nps':
      return renderNpsQuestion(question, value, onChange);

    case 'image_choice':
      return renderImageChoiceQuestion(question, value, onChange);

    case 'ranking':
      return renderRankingQuestion(question, value, onChange);

    case 'emoji_reaction':
      return renderEmojiReactionQuestion(question, value, onChange);

    case 'yes_no':
      return renderYesNoQuestion(question, value, onChange);

    case 'vs_match':
      return renderVsMatchQuestion(question, value, onChange);

    case 'dropdown':
      return renderDropdownQuestion(question, value, onChange);

    case 'contact_consent':
      return renderContactConsentQuestion(question, value, onChange);

    case 'slider':
      return renderSliderQuestion(question, value, onChange);

    default: {
      const fallback = document.createElement('div');
      fallback.className = 'question question--unsupported';
      fallback.textContent = `지원하지 않는 문항 타입입니다: ${question.type}`;
      return fallback;
    }
  }
}
