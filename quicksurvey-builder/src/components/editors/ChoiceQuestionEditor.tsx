import type { ChoiceOption, ChoiceQuestion } from '../../models/question';

let optionCounter = 1;
function genOptionId(): string {
  return `opt-${Date.now()}-${optionCounter++}`;
}

interface ChoiceQuestionEditorProps {
  question: ChoiceQuestion;
  onChange: (next: ChoiceQuestion) => void;
}

export function ChoiceQuestionEditor({ question, onChange }: ChoiceQuestionEditorProps) {
  const updateOption = (id: string, label: string) => {
    onChange({
      ...question,
      options: question.options.map((opt) => (opt.id === id ? { ...opt, label } : opt)),
    });
  };

  const addOption = () => {
    const newOption: ChoiceOption = { id: genOptionId(), label: `옵션 ${question.options.length + 1}` };
    onChange({ ...question, options: [...question.options, newOption] });
  };

  const removeOption = (id: string) => {
    onChange({ ...question, options: question.options.filter((opt) => opt.id !== id) });
  };

  return (
    <div className="editor-fields">
      <label>
        문항 유형
        <select
          value={question.type}
          onChange={(e) =>
            onChange({ ...question, type: e.target.value as ChoiceQuestion['type'] })
          }
        >
          <option value="single_choice">단일 선택</option>
          <option value="multiple_choice">복수 선택</option>
        </select>
      </label>

      <div className="editor-fields__options">
        <span className="editor-fields__label">옵션</span>
        {question.options.map((opt) => (
          <div key={opt.id} className="editor-fields__option-row">
            <input
              type="text"
              value={opt.label}
              onChange={(e) => updateOption(opt.id, e.target.value)}
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

      {question.type === 'multiple_choice' && (
        <label>
          최대 선택 개수 (비우면 무제한)
          <input
            type="number"
            min={1}
            value={question.maxSelect ?? ''}
            onChange={(e) =>
              onChange({
                ...question,
                maxSelect: e.target.value === '' ? null : Number(e.target.value),
              })
            }
          />
        </label>
      )}

      <label className="editor-fields__checkbox">
        <input
          type="checkbox"
          checked={question.allowOther}
          onChange={(e) => onChange({ ...question, allowOther: e.target.checked })}
        />
        '기타' 항목 허용
      </label>
    </div>
  );
}
