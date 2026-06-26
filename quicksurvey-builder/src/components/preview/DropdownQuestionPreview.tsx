import type { DropdownQuestion } from '../../models/question';

interface DropdownQuestionPreviewProps {
  question: DropdownQuestion;
  value?: string;
  onChange?: (value: string) => void;
}

export function DropdownQuestionPreview({ question, value, onChange }: DropdownQuestionPreviewProps) {
  const interactive = Boolean(onChange);

  return (
    <select
      className="preview-dropdown"
      disabled={!interactive}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="" disabled>
        {question.placeholder}
      </option>
      {question.options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
