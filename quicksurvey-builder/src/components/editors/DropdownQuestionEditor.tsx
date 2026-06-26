import type { ChoiceOption, DropdownQuestion } from '../../models/question';

let counter = 1;
function genId(): string {
  return `opt-${Date.now()}-${counter++}`;
}

interface DropdownQuestionEditorProps {
  question: DropdownQuestion;
  onChange: (next: DropdownQuestion) => void;
}

export function DropdownQuestionEditor({ question, onChange }: DropdownQuestionEditorProps) {
  const updateOption = (id: string, patch: Partial<ChoiceOption>) => {
    onChange({
      ...question,
      options: question.options.map((opt) => (opt.id === id ? { ...opt, ...patch } : opt)),
    });
  };

  const addOption = () => {
    const newOption: ChoiceOption = { id: genId(), label: `옵션 ${question.options.length + 1}` };
    onChange({ ...question, options: [...question.options, newOption] });
  };

  const removeOption = (id: string) => {
    onChange({ ...question, options: question.options.filter((opt) => opt.id !== id) });
  };

  return (
    <div className="editor-fields">
      <label>
        placeholder 텍스트
        <input
          type="text"
          value={question.placeholder}
          onChange={(e) => onChange({ ...question, placeholder: e.target.value })}
        />
      </label>
      <div className="editor-fields__options">
        <span className="editor-fields__label">옵션</span>
        {question.options.map((opt) => (
          <div key={opt.id} className="editor-fields__option-row">
            <input
              type="text"
              value={opt.label}
              onChange={(e) => updateOption(opt.id, { label: e.target.value })}
            />
            <button type="button" onClick={() => removeOption(opt.id)} disabled={question.options.length <= 1}>
              삭제
            </button>
          </div>
        ))}
        <button type="button" onClick={addOption}>
          + 옵션 추가
        </button>
      </div>
    </div>
  );
}
