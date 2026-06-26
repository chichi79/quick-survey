import type { ChoiceQuestion } from '../../models/question';

interface ChoiceQuestionPreviewProps {
  question: ChoiceQuestion;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
}

export function ChoiceQuestionPreview({ question, value, onChange }: ChoiceQuestionPreviewProps) {
  const inputType = question.type === 'single_choice' ? 'radio' : 'checkbox';
  const isMultiple = question.type === 'multiple_choice';
  const selected = new Set(isMultiple ? (Array.isArray(value) ? value : []) : value ? [value as string] : []);
  const interactive = Boolean(onChange);

  const handleToggle = (optId: string) => {
    if (!onChange) return;
    if (isMultiple) {
      const next = new Set(selected);
      if (next.has(optId)) next.delete(optId);
      else {
        if (question.maxSelect && next.size >= question.maxSelect) return;
        next.add(optId);
      }
      onChange(Array.from(next));
    } else {
      onChange(optId);
    }
  };

  return (
    <div className="preview-options">
      {question.options.map((opt) => (
        <label key={opt.id} className="preview-option">
          <input
            type={inputType}
            name={question.id}
            disabled={!interactive}
            checked={selected.has(opt.id)}
            onChange={() => handleToggle(opt.id)}
          />
          {opt.label}
        </label>
      ))}
      {question.allowOther && (
        <label className="preview-option">
          <input type={inputType} name={question.id} disabled />
          기타
        </label>
      )}
    </div>
  );
}
