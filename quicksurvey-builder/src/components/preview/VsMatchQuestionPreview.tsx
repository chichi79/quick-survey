import type { VsMatchQuestion } from '../../models/question';

interface VsMatchQuestionPreviewProps {
  question: VsMatchQuestion;
  value?: 'A' | 'B';
  onChange?: (value: 'A' | 'B') => void;
}

export function VsMatchQuestionPreview({ question, value, onChange }: VsMatchQuestionPreviewProps) {
  const interactive = Boolean(onChange);

  return (
    <div className="preview-vs-match">
      <button
        type="button"
        className={`preview-vs-match__card ${value === 'A' ? 'is-selected' : ''}`}
        disabled={!interactive}
        onClick={() => onChange?.('A')}
      >
        <div className="preview-vs-match__thumb">
          {question.optionA.imageUrl ? (
            <img src={question.optionA.imageUrl} alt={question.optionA.label} />
          ) : (
            <span>이미지 없음</span>
          )}
        </div>
        <span>{question.optionA.label}</span>
      </button>
      <span className="preview-vs-match__vs">VS</span>
      <button
        type="button"
        className={`preview-vs-match__card ${value === 'B' ? 'is-selected' : ''}`}
        disabled={!interactive}
        onClick={() => onChange?.('B')}
      >
        <div className="preview-vs-match__thumb">
          {question.optionB.imageUrl ? (
            <img src={question.optionB.imageUrl} alt={question.optionB.label} />
          ) : (
            <span>이미지 없음</span>
          )}
        </div>
        <span>{question.optionB.label}</span>
      </button>
    </div>
  );
}
