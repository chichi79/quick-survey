import type { SliderQuestion } from '../../models/question';

interface SliderQuestionPreviewProps {
  question: SliderQuestion;
  value?: number;
  onChange?: (value: number) => void;
}

export function SliderQuestionPreview({ question, value, onChange }: SliderQuestionPreviewProps) {
  const interactive = Boolean(onChange);
  const mid = Math.round((question.min + question.max) / 2);
  const current = value ?? mid;

  return (
    <div className="preview-slider">
      <input
        type="range"
        disabled={!interactive}
        min={question.min}
        max={question.max}
        step={question.step}
        value={current}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
      <div className="preview-slider__labels">
        <span>{question.minLabel || question.min}</span>
        <span className="preview-slider__value">
          {current}
          {question.unit}
        </span>
        <span>{question.maxLabel || question.max}</span>
      </div>
    </div>
  );
}
