import type { LikertQuestion } from '../../models/question';

interface LikertQuestionEditorProps {
  question: LikertQuestion;
  onChange: (next: LikertQuestion) => void;
}

export function LikertQuestionEditor({ question, onChange }: LikertQuestionEditorProps) {
  return (
    <div className="editor-fields">
      <label>
        최솟값
        <input
          type="number"
          value={question.scaleMin}
          onChange={(e) => onChange({ ...question, scaleMin: Number(e.target.value) })}
        />
      </label>
      <label>
        최댓값
        <input
          type="number"
          value={question.scaleMax}
          onChange={(e) => onChange({ ...question, scaleMax: Number(e.target.value) })}
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
    </div>
  );
}
