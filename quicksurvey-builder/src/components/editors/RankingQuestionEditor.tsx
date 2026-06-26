import type { RankingQuestion } from '../../models/question';

let counter = 1;
function genId(): string {
  return `item-${Date.now()}-${counter++}`;
}

interface RankingQuestionEditorProps {
  question: RankingQuestion;
  onChange: (next: RankingQuestion) => void;
}

export function RankingQuestionEditor({ question, onChange }: RankingQuestionEditorProps) {
  const updateItem = (id: string, label: string) => {
    onChange({ ...question, items: question.items.map((item) => (item.id === id ? { ...item, label } : item)) });
  };

  const addItem = () => {
    onChange({ ...question, items: [...question.items, { id: genId(), label: `항목 ${question.items.length + 1}` }] });
  };

  const removeItem = (id: string) => {
    onChange({ ...question, items: question.items.filter((item) => item.id !== id) });
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= question.items.length) return;
    const next = [...question.items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange({ ...question, items: next });
  };

  return (
    <div className="editor-fields">
      <div className="editor-fields__options">
        <span className="editor-fields__label">순위 항목 (기본 순서)</span>
        {question.items.map((item, index) => (
          <div key={item.id} className="editor-fields__option-row">
            <input type="text" value={item.label} onChange={(e) => updateItem(item.id, e.target.value)} />
            <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0}>
              ↑
            </button>
            <button type="button" onClick={() => moveItem(index, 1)} disabled={index === question.items.length - 1}>
              ↓
            </button>
            <button type="button" onClick={() => removeItem(item.id)} disabled={question.items.length <= 2}>
              삭제
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem}>
          + 항목 추가
        </button>
      </div>
    </div>
  );
}
