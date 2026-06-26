import type { EmojiReactionQuestion } from '../../models/question';

interface EmojiReactionQuestionPreviewProps {
  question: EmojiReactionQuestion;
  value?: string;
  onChange?: (value: string) => void;
}

export function EmojiReactionQuestionPreview({ question, value, onChange }: EmojiReactionQuestionPreviewProps) {
  const interactive = Boolean(onChange);

  return (
    <div className="preview-emoji-options">
      {question.options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`preview-emoji-option ${value === opt.id ? 'is-selected' : ''}`}
          disabled={!interactive}
          onClick={() => onChange?.(opt.id)}
        >
          <span className="preview-emoji-option__emoji">{opt.emoji}</span>
          <span className="preview-emoji-option__label">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
