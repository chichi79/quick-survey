import type { MatrixQuestion } from '../../models/question';

let counter = 1;
function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${counter++}`;
}

interface MatrixQuestionEditorProps {
  question: MatrixQuestion;
  onChange: (next: MatrixQuestion) => void;
}

export function MatrixQuestionEditor({ question, onChange }: MatrixQuestionEditorProps) {
  const updateRow = (id: string, label: string) => {
    onChange({ ...question, rows: question.rows.map((r) => (r.id === id ? { ...r, label } : r)) });
  };
  const addRow = () => {
    onChange({ ...question, rows: [...question.rows, { id: genId('row'), label: `행 ${question.rows.length + 1}` }] });
  };
  const removeRow = (id: string) => {
    onChange({ ...question, rows: question.rows.filter((r) => r.id !== id) });
  };

  const updateColumn = (id: string, label: string) => {
    onChange({
      ...question,
      columns: question.columns.map((c) => (c.id === id ? { ...c, label } : c)),
    });
  };
  const addColumn = () => {
    onChange({
      ...question,
      columns: [...question.columns, { id: genId('col'), label: `열 ${question.columns.length + 1}` }],
    });
  };
  const removeColumn = (id: string) => {
    onChange({ ...question, columns: question.columns.filter((c) => c.id !== id) });
  };

  return (
    <div className="editor-fields">
      <div className="editor-fields__options">
        <span className="editor-fields__label">행</span>
        {question.rows.map((row) => (
          <div key={row.id} className="editor-fields__option-row">
            <input type="text" value={row.label} onChange={(e) => updateRow(row.id, e.target.value)} />
            <button type="button" onClick={() => removeRow(row.id)} disabled={question.rows.length <= 1}>
              삭제
            </button>
          </div>
        ))}
        <button type="button" onClick={addRow}>
          + 행 추가
        </button>
      </div>

      <div className="editor-fields__options">
        <span className="editor-fields__label">열</span>
        {question.columns.map((col) => (
          <div key={col.id} className="editor-fields__option-row">
            <input type="text" value={col.label} onChange={(e) => updateColumn(col.id, e.target.value)} />
            <button type="button" onClick={() => removeColumn(col.id)} disabled={question.columns.length <= 1}>
              삭제
            </button>
          </div>
        ))}
        <button type="button" onClick={addColumn}>
          + 열 추가
        </button>
      </div>
    </div>
  );
}
