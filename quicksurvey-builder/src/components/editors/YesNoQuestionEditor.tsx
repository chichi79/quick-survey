import type { YesNoQuestion } from '../../models/question';

interface YesNoQuestionEditorProps {
  question: YesNoQuestion;
  onChange: (next: YesNoQuestion) => void;
}

export function YesNoQuestionEditor({ question, onChange }: YesNoQuestionEditorProps) {
  return (
    <div className="editor-fields">
      <label>
        '예' 버튼 라벨
        <input
          type="text"
          value={question.yesLabel}
          onChange={(e) => onChange({ ...question, yesLabel: e.target.value })}
        />
      </label>
      <label>
        '아니오' 버튼 라벨
        <input
          type="text"
          value={question.noLabel}
          onChange={(e) => onChange({ ...question, noLabel: e.target.value })}
        />
      </label>
    </div>
  );
}
