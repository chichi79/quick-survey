import type { StarRatingQuestion } from '../../models/question';

interface StarRatingQuestionPreviewProps {
  question: StarRatingQuestion;
  value?: number;
  onChange?: (value: number) => void;
}

export function StarRatingQuestionPreview({ question, value, onChange }: StarRatingQuestionPreviewProps) {
  const stars = Array.from({ length: question.maxStars }, (_, i) => i + 1);
  const interactive = Boolean(onChange);
  const current = value ?? 0;

  return (
    <div className="preview-stars">
      {stars.map((n) =>
        interactive ? (
          <button
            key={n}
            type="button"
            className={`preview-stars__star preview-stars__star--button ${n <= current ? 'is-filled' : ''}`}
            onClick={() => onChange?.(n)}
          >
            {n <= current ? '★' : '☆'}
          </button>
        ) : (
          <span key={n} className="preview-stars__star">
            ☆
          </span>
        ),
      )}
    </div>
  );
}
