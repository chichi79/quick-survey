import type { YesNoQuestion } from '../../models/question';

interface YesNoQuestionPreviewProps {
  question: YesNoQuestion;
  value?: 'yes' | 'no';
  onChange?: (value: 'yes' | 'no') => void;
}

export function YesNoQuestionPreview({ question, value, onChange }: YesNoQuestionPreviewProps) {
  const interactive = Boolean(onChange);

  return (
    <div className="preview-yes-no">
      <button
        type="button"
        className={`preview-yes-no__button preview-yes-no__button--yes ${value === 'yes' ? 'is-selected' : ''}`}
        disabled={!interactive}
        onClick={() => onChange?.('yes')}
      >
        {question.yesLabel}
      </button>
      <button
        type="button"
        className={`preview-yes-no__button preview-yes-no__button--no ${value === 'no' ? 'is-selected' : ''}`}
        disabled={!interactive}
        onClick={() => onChange?.('no')}
      >
        {question.noLabel}
      </button>
    </div>
  );
}
