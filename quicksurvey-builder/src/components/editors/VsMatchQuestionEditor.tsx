import type { VsMatchOption, VsMatchQuestion } from '../../models/question';

interface VsMatchQuestionEditorProps {
  question: VsMatchQuestion;
  onChange: (next: VsMatchQuestion) => void;
}

export function VsMatchQuestionEditor({ question, onChange }: VsMatchQuestionEditorProps) {
  const updateOption = (key: 'optionA' | 'optionB', patch: Partial<VsMatchOption>) => {
    onChange({ ...question, [key]: { ...question[key], ...patch } });
  };

  return (
    <div className="editor-fields">
      <div className="editor-fields__options">
        <span className="editor-fields__label">A 후보</span>
        <div className="editor-fields__image-option">
          <input
            type="text"
            placeholder="라벨"
            value={question.optionA.label}
            onChange={(e) => updateOption('optionA', { label: e.target.value })}
          />
          <input
            type="text"
            placeholder="이미지 URL (선택)"
            value={question.optionA.imageUrl ?? ''}
            onChange={(e) => updateOption('optionA', { imageUrl: e.target.value })}
          />
        </div>
        <span className="editor-fields__label">B 후보</span>
        <div className="editor-fields__image-option">
          <input
            type="text"
            placeholder="라벨"
            value={question.optionB.label}
            onChange={(e) => updateOption('optionB', { label: e.target.value })}
          />
          <input
            type="text"
            placeholder="이미지 URL (선택)"
            value={question.optionB.imageUrl ?? ''}
            onChange={(e) => updateOption('optionB', { imageUrl: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
