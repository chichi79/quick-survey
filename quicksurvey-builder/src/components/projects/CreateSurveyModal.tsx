import { useState } from 'react';
import { createQuestionByType, QUESTION_TYPE_LABELS, type QuestionType } from '../../models/question';
import type { SurveyKind } from '../../models/project';
import { QuestionPreviewBody } from '../preview/QuestionPreviewBody';

const ALL_TYPES: QuestionType[] = [
  'single_choice',
  'multiple_choice',
  'likert_scale',
  'open_text',
  'matrix',
  'numeric',
  'star_rating',
  'nps',
  'image_choice',
  'ranking',
  'emoji_reaction',
  'yes_no',
  'vs_match',
  'dropdown',
  'contact_consent',
  'slider',
];

type Step = 'kind' | 'pick-type' | 'title';

interface CreateSurveyModalProps {
  onClose: () => void;
  onCreate: (title: string, kind: SurveyKind, initialType?: QuestionType) => void;
}

export function CreateSurveyModal({ onClose, onCreate }: CreateSurveyModalProps) {
  const [step, setStep] = useState<Step>('kind');
  const [kind, setKind] = useState<SurveyKind | null>(null);
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const [title, setTitle] = useState('');

  const handleSelectKind = (next: SurveyKind) => {
    setKind(next);
    setStep(next === 'single' ? 'pick-type' : 'title');
  };

  const handleSelectType = (type: QuestionType) => {
    setSelectedType(type);
    setStep('title');
  };

  const handleCreate = () => {
    const trimmed = title.trim();
    if (!trimmed || !kind) return;
    onCreate(trimmed, kind, kind === 'single' ? selectedType ?? undefined : undefined);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-panel__header">
          <h3>새 설문 만들기</h3>
          <button type="button" className="modal-panel__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {step === 'kind' && (
          <div className="survey-kind-grid">
            <button type="button" className="survey-kind-card" onClick={() => handleSelectKind('single')}>
              <span className="survey-kind-card__icon">1</span>
              <span className="survey-kind-card__title">단일 문항 설문</span>
              <span className="survey-kind-card__desc">문항 1개로 빠르게 묻고 결과를 보여주는 형태</span>
            </button>
            <button type="button" className="survey-kind-card" onClick={() => handleSelectKind('multi')}>
              <span className="survey-kind-card__icon">≡</span>
              <span className="survey-kind-card__title">여러 문항 설문</span>
              <span className="survey-kind-card__desc">여러 문항을 자유롭게 추가/구성하는 형태</span>
            </button>
          </div>
        )}

        {step === 'pick-type' && (
          <>
            <p className="modal-panel__hint">어떤 문항 타입으로 만들지 미리보기를 보고 골라주세요.</p>
            <div className="question-type-grid">
              {ALL_TYPES.map((type) => {
                const sample = createQuestionByType(type, 0);
                return (
                  <button
                    key={type}
                    type="button"
                    className="question-type-card"
                    onClick={() => handleSelectType(type)}
                  >
                    <div className="question-type-card__thumb">
                      <QuestionPreviewBody question={sample} />
                    </div>
                    <span className="question-type-card__label">{QUESTION_TYPE_LABELS[type]}</span>
                  </button>
                );
              })}
            </div>
            <div className="modal-panel__footer">
              <button type="button" onClick={() => setStep('kind')}>
                ← 뒤로
              </button>
            </div>
          </>
        )}

        {step === 'title' && (
          <div className="survey-title-step">
            {kind === 'single' && selectedType && (
              <p className="modal-panel__hint">
                선택한 문항 타입: <strong>{QUESTION_TYPE_LABELS[selectedType]}</strong>
              </p>
            )}
            <label>
              설문 제목
              <input
                type="text"
                autoFocus
                value={title}
                placeholder="새 설문 제목"
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                }}
              />
            </label>
            <div className="modal-panel__footer">
              <button type="button" onClick={() => setStep(kind === 'single' ? 'pick-type' : 'kind')}>
                ← 뒤로
              </button>
              <button type="button" disabled={!title.trim()} onClick={handleCreate}>
                만들기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
