import type { RankingQuestion } from '../../models/question';

interface RankingQuestionPreviewProps {
  question: RankingQuestion;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export function RankingQuestionPreview({ question, value, onChange }: RankingQuestionPreviewProps) {
  const interactive = Boolean(onChange);
  const order = value && value.length === question.items.length ? value : question.items.map((item) => item.id);
  const itemsById = new Map(question.items.map((item) => [item.id, item]));

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    onChange?.(next);
  };

  return (
    <ol className="preview-ranking">
      {order.map((itemId, index) => {
        const item = itemsById.get(itemId);
        if (!item) return null;
        return (
          <li key={item.id} className="preview-ranking__item">
            <span className="preview-ranking__rank">{index + 1}</span>
            <span className="preview-ranking__label">{item.label}</span>
            {interactive ? (
              <span className="preview-ranking__controls">
                <button type="button" disabled={index === 0} onClick={() => move(index, -1)}>
                  ↑
                </button>
                <button type="button" disabled={index === order.length - 1} onClick={() => move(index, 1)}>
                  ↓
                </button>
              </span>
            ) : (
              <span className="preview-ranking__handle">⠿</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
