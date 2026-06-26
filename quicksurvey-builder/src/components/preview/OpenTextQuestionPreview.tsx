import type { OpenTextQuestion } from '../../models/question';

interface OpenTextQuestionPreviewProps {
  question: OpenTextQuestion;
  value?: string;
  onChange?: (value: string) => void;
}

export function OpenTextQuestionPreview({ question, value, onChange }: OpenTextQuestionPreviewProps) {
  const interactive = Boolean(onChange);

  return question.multiline ? (
    <textarea
      className="preview-textarea"
      placeholder={`최대 ${question.maxLength}자`}
      maxLength={question.maxLength}
      disabled={!interactive}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ) : (
    <input
      type="text"
      className="preview-input"
      placeholder={`최대 ${question.maxLength}자`}
      maxLength={question.maxLength}
      disabled={!interactive}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
