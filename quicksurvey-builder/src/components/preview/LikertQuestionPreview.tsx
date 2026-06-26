import type { LikertQuestion } from '../../models/question';

interface LikertQuestionPreviewProps {
  question: LikertQuestion;
  value?: number;
  onChange?: (value: number) => void;
}

export function LikertQuestionPreview({ question, value, onChange }: LikertQuestionPreviewProps) {
  const points = [];
  for (let v = question.scaleMin; v <= question.scaleMax; v++) {
    points.push(v);
  }
  const interactive = Boolean(onChange);

  return (
    <div className="preview-likert">
      <div className="preview-likert__labels">
        <span>{question.minLabel}</span>
        <span>{question.maxLabel}</span>
      </div>
      <div className="preview-likert__scale">
        {points.map((v) => (
          <label key={v} className="preview-likert__point">
            <input
              type="radio"
              name={question.id}
              disabled={!interactive}
              checked={value === v}
              onChange={() => onChange?.(v)}
            />
            {v}
          </label>
        ))}
      </div>
    </div>
  );
}
