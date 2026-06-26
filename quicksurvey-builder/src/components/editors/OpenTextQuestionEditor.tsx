import type { OpenTextQuestion } from '../../models/question';

interface OpenTextQuestionEditorProps {
  question: OpenTextQuestion;
  onChange: (next: OpenTextQuestion) => void;
}

export function OpenTextQuestionEditor({ question, onChange }: OpenTextQuestionEditorProps) {
  return (
    <div className="editor-fields">
      <label>
        최대 글자 수
        <input
          type="number"
          min={1}
          value={question.maxLength}
          onChange={(e) => onChange({ ...question, maxLength: Number(e.target.value) })}
        />
      </label>
      <label className="editor-fields__checkbox">
        <input
          type="checkbox"
          checked={question.multiline}
          onChange={(e) => onChange({ ...question, multiline: e.target.checked })}
        />
        여러 줄 입력 허용
      </label>
    </div>
  );
}
