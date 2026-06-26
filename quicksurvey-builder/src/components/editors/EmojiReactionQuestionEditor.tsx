import type { EmojiOption, EmojiReactionQuestion } from '../../models/question';

let counter = 1;
function genId(): string {
  return `emoji-${Date.now()}-${counter++}`;
}

interface EmojiReactionQuestionEditorProps {
  question: EmojiReactionQuestion;
  onChange: (next: EmojiReactionQuestion) => void;
}

export function EmojiReactionQuestionEditor({ question, onChange }: EmojiReactionQuestionEditorProps) {
  const updateOption = (id: string, patch: Partial<EmojiOption>) => {
    onChange({
      ...question,
      options: question.options.map((opt) => (opt.id === id ? { ...opt, ...patch } : opt)),
    });
  };

  const addOption = () => {
    const newOption: EmojiOption = { id: genId(), emoji: '🙂', label: '새 반응' };
    onChange({ ...question, options: [...question.options, newOption] });
  };

  const removeOption = (id: string) => {
    onChange({ ...question, options: question.options.filter((opt) => opt.id !== id) });
  };

  return (
    <div className="editor-fields">
      <div className="editor-fields__options">
        <span className="editor-fields__label">이모지 반응</span>
        {question.options.map((opt) => (
          <div key={opt.id} className="editor-fields__emoji-option">
            <input
              type="text"
              className="editor-fields__emoji-input"
              value={opt.emoji}
              onChange={(e) => updateOption(opt.id, { emoji: e.target.value })}
            />
            <input
              type="text"
              placeholder="라벨"
              value={opt.label}
              onChange={(e) => updateOption(opt.id, { label: e.target.value })}
            />
            <button type="button" onClick={() => removeOption(opt.id)} disabled={question.options.length <= 2}>
              삭제
            </button>
          </div>
        ))}
        <button type="button" onClick={addOption}>
          + 반응 추가
        </button>
      </div>
    </div>
  );
}
