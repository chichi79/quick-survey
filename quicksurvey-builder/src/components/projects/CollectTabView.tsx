import { useState } from 'react';
import { ShareButton } from '../ShareButton';
import type { Survey } from '../../models/project';

interface CollectTabViewProps {
  survey: Survey;
  onTogglePublished: (surveyId: string) => void;
  onUpdateSettings: (
    surveyId: string,
    patch: { startDate: string | null; endDate: string | null; rewardPoint: number; completeMessage: string },
  ) => void;
}

export function CollectTabView({ survey, onTogglePublished, onUpdateSettings }: CollectTabViewProps) {
  const [startDate, setStartDate] = useState(survey.startDate ?? '');
  const [endDate, setEndDate] = useState(survey.endDate ?? '');
  const [rewardPoint, setRewardPoint] = useState(String(survey.rewardPoint));
  const [completeMessage, setCompleteMessage] = useState(survey.completeMessage);

  const dateRangeInvalid = Boolean(startDate && endDate && startDate > endDate);

  const handleSave = () => {
    if (dateRangeInvalid) return;
    onUpdateSettings(survey.id, {
      startDate: startDate || null,
      endDate: endDate || null,
      rewardPoint: Number(rewardPoint) || 0,
      completeMessage: completeMessage.trim() || '설문에 참여해주셔서 감사합니다!',
    });
  };

  return (
    <div className="collect-tab">
      <section className="collect-tab__section">
        <h3>노출</h3>
        <label className="survey-list__publish-toggle" title="quicksurvey 목록에 노출">
          <input type="checkbox" checked={survey.published} onChange={() => onTogglePublished(survey.id)} />
          {survey.published ? 'quicksurvey 노출 ON' : 'quicksurvey 노출 OFF'}
        </label>
      </section>

      <section className="collect-tab__section">
        <h3>수집 기간 / 리워드</h3>
        <div className="survey-settings">
          <div className="survey-settings__row">
            <label>
              노출 시작일
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label>
              노출 종료일
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
          </div>
          {dateRangeInvalid && <p className="survey-settings__error">종료일은 시작일보다 같거나 이후여야 합니다.</p>}
          <p className="modal-panel__hint">
            비워두면 기간 제한 없이 "quicksurvey 노출"이 ON인 동안 계속 보입니다. 기간을 벗어나면
            quicksurvey 목록에서 자동으로 숨겨지고 "마감"으로 안내됩니다.
          </p>

          <label>
            리워드 포인트
            <input type="number" min={0} value={rewardPoint} onChange={(e) => setRewardPoint(e.target.value)} />
          </label>

          <label>
            완료 화면 안내 문구
            <textarea value={completeMessage} onChange={(e) => setCompleteMessage(e.target.value)} rows={2} />
          </label>

          <div className="collect-tab__save">
            <button type="button" disabled={dateRangeInvalid} onClick={handleSave}>
              저장
            </button>
          </div>
        </div>
      </section>

      <section className="collect-tab__section">
        <h3>임베드 코드</h3>
        <div className="collect-tab__share">
          <ShareButton defaultSurveyId={survey.id} survey={survey} />
        </div>
      </section>
    </div>
  );
}
