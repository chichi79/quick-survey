import type { Question } from '../../models/question';
import { buildDummyResult } from '../../models/dummyResult';

interface SingleQuestionResultProps {
  question: Question;
  value: unknown;
  onRestart: () => void;
}

export function SingleQuestionResult({ question, value, onRestart }: SingleQuestionResultProps) {
  const result = buildDummyResult(question, value);

  if (!result) {
    return (
      <div className="exposure-frame__complete">
        <div className="exposure-frame__complete-emoji">🎉</div>
        <p>응답해주셔서 감사합니다!</p>
        <button type="button" onClick={onRestart}>
          처음부터 다시 보기
        </button>
      </div>
    );
  }

  return (
    <div className="single-result">
      <p className="single-result__hint">
        응답해주셔서 감사합니다! 지금까지 <strong>{result.totalParticipants}명</strong>이 참여했어요. (예시 데이터)
      </p>
      <div className="single-result__bars">
        {result.bars.map((bar) => (
          <div key={bar.label} className={`single-result__row ${bar.mine ? 'is-mine' : ''}`}>
            <div className="single-result__row-head">
              <span className="single-result__label">
                {bar.label}
                {bar.mine && <span className="single-result__mine-tag">내 응답</span>}
              </span>
              <span className="single-result__percent">{bar.percent}%</span>
            </div>
            <div className="single-result__track">
              <div className="single-result__fill" style={{ width: `${bar.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={onRestart}>
        처음부터 다시 보기
      </button>
    </div>
  );
}
