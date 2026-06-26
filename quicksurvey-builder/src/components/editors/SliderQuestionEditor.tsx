import type { SliderQuestion } from '../../models/question';

interface SliderQuestionEditorProps {
  question: SliderQuestion;
  onChange: (next: SliderQuestion) => void;
}

export function SliderQuestionEditor({ question, onChange }: SliderQuestionEditorProps) {
  return (
    <div className="editor-fields">
      <label>
        최솟값
        <input
          type="number"
          value={question.min}
          onChange={(e) => onChange({ ...question, min: Number(e.target.value) })}
        />
      </label>
      <label>
        최댓값
        <input
          type="number"
          value={question.max}
          onChange={(e) => onChange({ ...question, max: Number(e.target.value) })}
        />
      </label>
      <label>
        단위 (step)
        <input
          type="number"
          min={1}
          value={question.step}
          onChange={(e) => onChange({ ...question, step: Number(e.target.value) })}
        />
      </label>
      <label>
        최소값 라벨
        <input
          type="text"
          value={question.minLabel}
          onChange={(e) => onChange({ ...question, minLabel: e.target.value })}
        />
      </label>
      <label>
        최대값 라벨
        <input
          type="text"
          value={question.maxLabel}
          onChange={(e) => onChange({ ...question, maxLabel: e.target.value })}
        />
      </label>
      <label>
        단위 표시 (예: %, 점)
        <input
          type="text"
          value={question.unit}
          onChange={(e) => onChange({ ...question, unit: e.target.value })}
        />
      </label>
    </div>
  );
}
