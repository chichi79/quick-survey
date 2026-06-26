import type { ImageChoiceQuestion, ImageOption } from '../../models/question';

let counter = 1;
function genId(): string {
  return `opt-${Date.now()}-${counter++}`;
}

interface ImageChoiceQuestionEditorProps {
  question: ImageChoiceQuestion;
  onChange: (next: ImageChoiceQuestion) => void;
}

export function ImageChoiceQuestionEditor({ question, onChange }: ImageChoiceQuestionEditorProps) {
  const updateOption = (id: string, patch: Partial<ImageOption>) => {
    onChange({
      ...question,
      options: question.options.map((opt) => (opt.id === id ? { ...opt, ...patch } : opt)),
    });
  };

  const addOption = () => {
    const newOption: ImageOption = { id: genId(), label: `옵션 ${question.options.length + 1}`, imageUrl: '' };
    onChange({ ...question, options: [...question.options, newOption] });
  };

  const removeOption = (id: string) => {
    onChange({ ...question, options: question.options.filter((opt) => opt.id !== id) });
  };

  return (
    <div className="editor-fields">
      <div className="editor-fields__options">
        <span className="editor-fields__label">옵션 (이미지 URL + 라벨)</span>
        {question.options.map((opt) => (
          <div key={opt.id} className="editor-fields__image-option">
            <input
              type="text"
              placeholder="라벨"
              value={opt.label}
              onChange={(e) => updateOption(opt.id, { label: e.target.value })}
            />
            <input
              type="text"
              placeholder="이미지 URL"
              value={opt.imageUrl}
              onChange={(e) => updateOption(opt.id, { imageUrl: e.target.value })}
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
