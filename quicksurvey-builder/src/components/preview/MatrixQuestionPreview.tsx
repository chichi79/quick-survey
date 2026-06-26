import type { MatrixQuestion } from '../../models/question';

interface MatrixQuestionPreviewProps {
  question: MatrixQuestion;
  value?: Record<string, string>;
  onChange?: (value: Record<string, string>) => void;
}

export function MatrixQuestionPreview({ question, value, onChange }: MatrixQuestionPreviewProps) {
  const interactive = Boolean(onChange);
  const answers = value ?? {};

  return (
    <table className="preview-matrix">
      <thead>
        <tr>
          <th />
          {question.columns.map((col) => (
            <th key={col.id}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {question.rows.map((row) => (
          <tr key={row.id}>
            <td>{row.label}</td>
            {question.columns.map((col) => (
              <td key={col.id}>
                <input
                  type="radio"
                  name={`${question.id}-${row.id}`}
                  disabled={!interactive}
                  checked={answers[row.id] === col.id}
                  onChange={() => onChange?.({ ...answers, [row.id]: col.id })}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
