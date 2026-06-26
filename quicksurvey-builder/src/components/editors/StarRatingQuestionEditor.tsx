import type { StarRatingQuestion } from '../../models/question';

interface StarRatingQuestionEditorProps {
  question: StarRatingQuestion;
  onChange: (next: StarRatingQuestion) => void;
}

export function StarRatingQuestionEditor({ question, onChange }: StarRatingQuestionEditorProps) {
  return (
    <div className="editor-fields">
      <label>
        별 개수
        <input
          type="number"
          min={2}
          max={10}
          value={question.maxStars}
          onChange={(e) => onChange({ ...question, maxStars: Number(e.target.value) })}
        />
      </label>
    </div>
  );
}
