import type { ContactConsentQuestion } from '../../models/question';

export interface ContactConsentAnswer {
  name?: string;
  phone?: string;
  email?: string;
  agreed: boolean;
}

interface ContactConsentQuestionPreviewProps {
  question: ContactConsentQuestion;
  value?: ContactConsentAnswer;
  onChange?: (value: ContactConsentAnswer) => void;
}

export function ContactConsentQuestionPreview({ question, value, onChange }: ContactConsentQuestionPreviewProps) {
  const interactive = Boolean(onChange);
  const answer: ContactConsentAnswer = value ?? { name: '', phone: '', email: '', agreed: false };

  return (
    <div className="preview-contact-consent">
      {question.collectName && (
        <label className="preview-contact-consent__field">
          이름
          <input
            type="text"
            disabled={!interactive}
            placeholder="이름을 입력해주세요"
            value={answer.name ?? ''}
            onChange={(e) => onChange?.({ ...answer, name: e.target.value })}
          />
        </label>
      )}
      {question.collectPhone && (
        <label className="preview-contact-consent__field">
          연락처
          <input
            type="text"
            disabled={!interactive}
            placeholder="010-0000-0000"
            value={answer.phone ?? ''}
            onChange={(e) => onChange?.({ ...answer, phone: e.target.value })}
          />
        </label>
      )}
      {question.collectEmail && (
        <label className="preview-contact-consent__field">
          이메일
          <input
            type="text"
            disabled={!interactive}
            placeholder="example@email.com"
            value={answer.email ?? ''}
            onChange={(e) => onChange?.({ ...answer, email: e.target.value })}
          />
        </label>
      )}
      <label className="preview-contact-consent__agree">
        <input
          type="checkbox"
          disabled={!interactive}
          checked={answer.agreed}
          onChange={(e) => onChange?.({ ...answer, agreed: e.target.checked })}
        />
        <span>{question.consentText}</span>
      </label>
    </div>
  );
}
