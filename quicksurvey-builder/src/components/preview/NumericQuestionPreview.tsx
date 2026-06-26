import type { NumericQuestion } from '../../models/question';

interface NumericQuestionPreviewProps {
  question: NumericQuestion;
  value?: Record<string, number>;
  onChange?: (value: Record<string, number>) => void;
}

export function NumericQuestionPreview({ question, value, onChange }: NumericQuestionPreviewProps) {
  const interactive = Boolean(onChange);
  const answers = value ?? {};

  return (
    <div className="preview-numeric">
      {question.items.map((item) => (
        <div key={item.id} className="preview-numeric__row">
          <span>{item.label}</span>
          <input
            type="number"
            className="preview-input preview-numeric__input"
            disabled={!interactive}
            value={answers[item.id] ?? ''}
            onChange={(e) =>
              onChange?.({ ...answers, [item.id]: e.target.value === '' ? 0 : Number(e.target.value) })
            }
          />
        </div>
      ))}
      {question.targetSum != null && (
        <p className="preview-numeric__target">합계 목표: {question.targetSum}</p>
      )}
    </div>
  );
}
