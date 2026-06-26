import { useEffect, useState } from 'react';
import { subscribeRemoteResponses, type SurveyResponse } from '../../state/firestoreSync';
import { buildQuestionSummaries } from '../../state/buildReport';
import { isFirebaseConfigured } from '../../firebase';
import type { Survey } from '../../models/project';

interface MetricTabViewProps {
  survey: Survey;
}

export function MetricTabView({ survey }: MetricTabViewProps) {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeRemoteResponses(survey.id, setResponses);
    return unsubscribe;
  }, [survey.id]);

  const summaries = buildQuestionSummaries(survey.questions, responses);

  return (
    <div className="metric-tab">
      <section className="metric-tab__section">
        <h3>응답 현황</h3>
        <p className="metric-tab__total">총 응답 {responses.length.toLocaleString()}건</p>
        {!isFirebaseConfigured && (
          <p className="modal-panel__hint">
            Firestore 연동이 설정되지 않아 응답을 집계할 수 없습니다. firebaseConfig를 채워주세요.
          </p>
        )}
      </section>

      {summaries.map((summary) => {
        const total = summary.distribution.reduce((sum, item) => sum + item.count, 0);
        return (
          <section key={summary.questionId} className="metric-tab__section">
            <h3>{summary.title}</h3>
            {total === 0 ? (
              <p className="modal-panel__hint">아직 응답이 없습니다.</p>
            ) : (
              <ul className="metric-tab__distribution">
                {summary.distribution.map((item) => {
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                  return (
                    <li key={item.label} className="metric-tab__bar-row">
                      <span className="metric-tab__bar-label">{item.label}</span>
                      <div className="metric-tab__bar-track">
                        <div className="metric-tab__bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="metric-tab__bar-count">
                        {item.count} ({pct}%)
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
