import type { Question } from '../models/question';
import { ChoiceQuestionEditor } from './editors/ChoiceQuestionEditor';
import { LikertQuestionEditor } from './editors/LikertQuestionEditor';
import { OpenTextQuestionEditor } from './editors/OpenTextQuestionEditor';
import { MatrixQuestionEditor } from './editors/MatrixQuestionEditor';
import { NumericQuestionEditor } from './editors/NumericQuestionEditor';
import { StarRatingQuestionEditor } from './editors/StarRatingQuestionEditor';
import { NpsQuestionEditor } from './editors/NpsQuestionEditor';
import { ImageChoiceQuestionEditor } from './editors/ImageChoiceQuestionEditor';
import { RankingQuestionEditor } from './editors/RankingQuestionEditor';
import { EmojiReactionQuestionEditor } from './editors/EmojiReactionQuestionEditor';
import { YesNoQuestionEditor } from './editors/YesNoQuestionEditor';
import { VsMatchQuestionEditor } from './editors/VsMatchQuestionEditor';
import { DropdownQuestionEditor } from './editors/DropdownQuestionEditor';
import { ContactConsentQuestionEditor } from './editors/ContactConsentQuestionEditor';
import { SliderQuestionEditor } from './editors/SliderQuestionEditor';

interface QuestionEditorProps {
  question: Question | null;
  onChange: (next: Question) => void;
}

export function QuestionEditor({ question, onChange }: QuestionEditorProps) {
  if (!question) {
    return (
      <div className="panel question-editor">
        <h2>문항 편집</h2>
        <p className="question-editor__empty">왼쪽에서 문항을 추가하거나 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="panel question-editor">
      <h2>문항 편집</h2>

      <div className="editor-fields">
        <label>
          제목
          <input
            type="text"
            value={question.title}
            onChange={(e) => onChange({ ...question, title: e.target.value })}
          />
        </label>
        <label>
          설명
          <input
            type="text"
            value={question.description}
            onChange={(e) => onChange({ ...question, description: e.target.value })}
          />
        </label>
        <label className="editor-fields__checkbox">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onChange({ ...question, required: e.target.checked })}
          />
          필수 응답
        </label>
      </div>

      <hr />

      {(() => {
        switch (question.type) {
          case 'single_choice':
          case 'multiple_choice':
            return <ChoiceQuestionEditor question={question} onChange={onChange} />;
          case 'likert_scale':
            return <LikertQuestionEditor question={question} onChange={onChange} />;
          case 'open_text':
            return <OpenTextQuestionEditor question={question} onChange={onChange} />;
          case 'matrix':
            return <MatrixQuestionEditor question={question} onChange={onChange} />;
          case 'numeric':
            return <NumericQuestionEditor question={question} onChange={onChange} />;
          case 'star_rating':
            return <StarRatingQuestionEditor question={question} onChange={onChange} />;
          case 'nps':
            return <NpsQuestionEditor question={question} onChange={onChange} />;
          case 'image_choice':
            return <ImageChoiceQuestionEditor question={question} onChange={onChange} />;
          case 'ranking':
            return <RankingQuestionEditor question={question} onChange={onChange} />;
          case 'emoji_reaction':
            return <EmojiReactionQuestionEditor question={question} onChange={onChange} />;
          case 'yes_no':
            return <YesNoQuestionEditor question={question} onChange={onChange} />;
          case 'vs_match':
            return <VsMatchQuestionEditor question={question} onChange={onChange} />;
          case 'dropdown':
            return <DropdownQuestionEditor question={question} onChange={onChange} />;
          case 'contact_consent':
            return <ContactConsentQuestionEditor question={question} onChange={onChange} />;
          case 'slider':
            return <SliderQuestionEditor question={question} onChange={onChange} />;
        }
      })()}
    </div>
  );
}
