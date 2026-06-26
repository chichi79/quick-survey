import { useState } from 'react';
import type { Question } from '../../models/question';
import { validateAnswer } from '../../models/validateAnswer';
import { QuestionPreviewBody } from './QuestionPreviewBody';
import { SingleQuestionResult } from './SingleQuestionResult';

interface ExposurePreviewProps {
  questions: Question[];
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="exposure-progress">
      <div className="exposure-progress__track">
        <div className="exposure-progress__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="exposure-progress__label">
        {current} / {total}
      </span>
    </div>
  );
}

function SurveyPlayer({
  questions,
  currentIndex,
  answers,
  onAnswerChange,
  onPrev,
  onNext,
  onRestart,
}: {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, unknown>;
  onAnswerChange: (questionId: string, value: unknown) => void;
  onPrev: () => void;
  onNext: () => void;
  onRestart: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const isComplete = currentIndex >= questions.length;

  if (isComplete) {
    if (questions.length === 1) {
      return (
        <SingleQuestionResult question={questions[0]} value={answers[questions[0].id]} onRestart={onRestart} />
      );
    }
    return (
      <div className="exposure-frame__complete">
        <div className="exposure-frame__complete-emoji">🎉</div>
        <p>설문에 참여해주셔서 감사합니다!</p>
        <button type="button" onClick={onRestart}>
          처음부터 다시 보기
        </button>
      </div>
    );
  }

  const question = questions[currentIndex];

  const handleNext = () => {
    const result = validateAnswer(question, answers[question.id]);
    if (!result.valid) {
      setError(result.message ?? '응답을 확인해주세요.');
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <>
      {questions.length > 1 && <ProgressBar current={currentIndex + 1} total={questions.length} />}
      <h3>
        {question.title || '(제목 없음)'}
        {question.required && <span className="preview-required">*</span>}
      </h3>
      {question.description && <p className="preview-description">{question.description}</p>}
      <QuestionPreviewBody
        question={question}
        value={answers[question.id]}
        onChange={(value) => {
          onAnswerChange(question.id, value);
          setError(null);
        }}
      />
      {error && <p className="exposure-frame__error">{error}</p>}
      <div className="exposure-frame__nav">
        <button
          type="button"
          onClick={() => {
            setError(null);
            onPrev();
          }}
          disabled={currentIndex === 0}
        >
          이전
        </button>
        <button type="button" className="exposure-frame__nav-next" onClick={handleNext}>
          {currentIndex === questions.length - 1 ? '완료' : '다음'}
        </button>
      </div>
    </>
  );
}

type ExposureTab = 'module' | 'full';

export function ExposurePreview({ questions }: ExposurePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tab, setTab] = useState<ExposureTab>('module');
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  if (questions.length === 0) {
    return (
      <div className="exposure-preview">
        <p className="preview-pane__empty">문항을 추가하면 노출 미리보기가 표시됩니다.</p>
      </div>
    );
  }

  const handlePrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));
  const handleNext = () => setCurrentIndex((i) => Math.min(i + 1, questions.length));
  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
  };
  const handleAnswerChange = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="exposure-preview">
      <div className="exposure-tabs">
        <button type="button" className={tab === 'module' ? 'is-active' : ''} onClick={() => setTab('module')}>
          모듈형 (300×400)
        </button>
        <button type="button" className={tab === 'full' ? 'is-active' : ''} onClick={() => setTab('full')}>
          전체 페이지형
        </button>
      </div>

      {tab === 'module' ? (
        <div className="exposure-frame exposure-frame--module">
          <span className="exposure-frame__label">기사 우측 모듈 등에 임베드될 때</span>
          <div className="exposure-frame__box exposure-frame__box--module">
            <div className="exposure-frame__chrome exposure-frame__chrome--widget">
              <span className="exposure-frame__chrome-dot" />
              위젯 모듈
            </div>
            <div className="exposure-frame__body">
              <SurveyPlayer
                questions={questions}
                currentIndex={currentIndex}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onPrev={handlePrev}
                onNext={handleNext}
                onRestart={handleRestart}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="exposure-frame exposure-frame--full">
          <span className="exposure-frame__label">"크게 보기"로 새 탭에서 열렸을 때</span>
          <div className="exposure-frame__box exposure-frame__box--full">
            <div className="exposure-frame__chrome exposure-frame__chrome--browser">
              <span className="exposure-frame__chrome-dot exposure-frame__chrome-dot--red" />
              <span className="exposure-frame__chrome-dot exposure-frame__chrome-dot--yellow" />
              <span className="exposure-frame__chrome-dot exposure-frame__chrome-dot--green" />
              <span className="exposure-frame__chrome-url">quicksurvey.example/?surveyId=...</span>
            </div>
            <div className="exposure-frame__body exposure-frame__body--full">
              <SurveyPlayer
                questions={questions}
                currentIndex={currentIndex}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onPrev={handlePrev}
                onNext={handleNext}
                onRestart={handleRestart}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
