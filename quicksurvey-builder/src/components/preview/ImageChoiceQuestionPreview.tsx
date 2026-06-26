import type { ImageChoiceQuestion } from '../../models/question';

interface ImageChoiceQuestionPreviewProps {
  question: ImageChoiceQuestion;
  value?: string;
  onChange?: (value: string) => void;
}

export function ImageChoiceQuestionPreview({ question, value, onChange }: ImageChoiceQuestionPreviewProps) {
  const interactive = Boolean(onChange);

  return (
    <div className="preview-image-options">
      {question.options.map((opt) => (
        <label
          key={opt.id}
          className={`preview-image-option ${value === opt.id ? 'is-selected' : ''}`}
        >
          <div className="preview-image-option__thumb">
            {opt.imageUrl ? <img src={opt.imageUrl} alt={opt.label} /> : <span>이미지 없음</span>}
          </div>
          <span>{opt.label}</span>
          <input
            type="radio"
            name={question.id}
            disabled={!interactive}
            checked={value === opt.id}
            onChange={() => onChange?.(opt.id)}
          />
        </label>
      ))}
    </div>
  );
}
