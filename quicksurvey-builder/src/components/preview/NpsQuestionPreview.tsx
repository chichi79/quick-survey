import type { NpsQuestion } from '../../models/question';

interface NpsQuestionPreviewProps {
  question: NpsQuestion;
  value?: number;
  onChange?: (value: number) => void;
}

export function NpsQuestionPreview({ question, value, onChange }: NpsQuestionPreviewProps) {
  const points = Array.from({ length: 11 }, (_, i) => i);
  const interactive = Boolean(onChange);

  return (
    <div className="preview-nps">
      <div className="preview-nps__scale">
        {points.map((n) => (
          <label key={n} className="preview-nps__point">
            <input
              type="radio"
              name={question.id}
              disabled={!interactive}
              checked={value === n}
              onChange={() => onChange?.(n)}
            />
            {n}
          </label>
        ))}
      </div>
      <div className="preview-likert__labels">
        <span>{question.minLabel}</span>
        <span>{question.maxLabel}</span>
      </div>
    </div>
  );
}
