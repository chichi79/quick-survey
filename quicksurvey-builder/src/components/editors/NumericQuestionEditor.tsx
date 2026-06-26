import type { NumericQuestion } from '../../models/question';

let counter = 1;
function genId(): string {
  return `item-${Date.now()}-${counter++}`;
}

interface NumericQuestionEditorProps {
  question: NumericQuestion;
  onChange: (next: NumericQuestion) => void;
}

export function NumericQuestionEditor({ question, onChange }: NumericQuestionEditorProps) {
  const updateItem = (id: string, label: string) => {
    onChange({ ...question, items: question.items.map((item) => (item.id === id ? { ...item, label } : item)) });
  };

  const addItem = () => {
    onChange({ ...question, items: [...question.items, { id: genId(), label: `항목 ${question.items.length + 1}` }] });
  };

  const removeItem = (id: string) => {
    onChange({ ...question, items: question.items.filter((item) => item.id !== id) });
  };

  return (
    <div className="editor-fields">
      <div className="editor-fields__options">
        <span className="editor-fields__label">항목</span>
        {question.items.map((item) => (
          <div key={item.id} className="editor-fields__option-row">
            <input type="text" value={item.label} onChange={(e) => updateItem(item.id, e.target.value)} />
            <button type="button" onClick={() => removeItem(item.id)} disabled={question.items.length <= 1}>
              삭제
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem}>
          + 항목 추가
        </button>
      </div>

      <label>
        합계 목표값 (비우면 제한 없음)
        <input
          type="number"
          value={question.targetSum ?? ''}
          onChange={(e) =>
            onChange({ ...question, targetSum: e.target.value === '' ? null : Number(e.target.value) })
          }
        />
      </label>
    </div>
  );
}
