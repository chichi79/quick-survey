import type { NpsQuestion } from '../../models/question';

interface NpsQuestionEditorProps {
  question: NpsQuestion;
  onChange: (next: NpsQuestion) => void;
}

export function NpsQuestionEditor({ question, onChange }: NpsQuestionEditorProps) {
  return (
    <div className="editor-fields">
      <label>
        최소값 라벨 (0점)
        <input
          type="text"
          value={question.minLabel}
          onChange={(e) => onChange({ ...question, minLabel: e.target.value })}
        />
      </label>
      <label>
        최대값 라벨 (10점)
        <input
          type="text"
          value={question.maxLabel}
          onChange={(e) => onChange({ ...question, maxLabel: e.target.value })}
        />
      </label>
    </div>
  );
}
