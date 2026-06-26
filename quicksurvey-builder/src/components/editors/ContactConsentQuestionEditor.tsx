import type { ContactConsentQuestion } from '../../models/question';

interface ContactConsentQuestionEditorProps {
  question: ContactConsentQuestion;
  onChange: (next: ContactConsentQuestion) => void;
}

export function ContactConsentQuestionEditor({ question, onChange }: ContactConsentQuestionEditorProps) {
  return (
    <div className="editor-fields">
      <span className="editor-fields__label">수집 항목</span>
      <label className="editor-fields__checkbox">
        <input
          type="checkbox"
          checked={question.collectName}
          onChange={(e) => onChange({ ...question, collectName: e.target.checked })}
        />
        이름
      </label>
      <label className="editor-fields__checkbox">
        <input
          type="checkbox"
          checked={question.collectPhone}
          onChange={(e) => onChange({ ...question, collectPhone: e.target.checked })}
        />
        연락처
      </label>
      <label className="editor-fields__checkbox">
        <input
          type="checkbox"
          checked={question.collectEmail}
          onChange={(e) => onChange({ ...question, collectEmail: e.target.checked })}
        />
        이메일
      </label>
      <label>
        개인정보 수집·이용 동의 문구
        <textarea
          value={question.consentText}
          onChange={(e) => onChange({ ...question, consentText: e.target.value })}
        />
      </label>
    </div>
  );
}
