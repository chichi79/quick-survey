import { useState } from 'react';
import type { Survey } from '../models/project';
import { generateWidgetSnippet } from '../state/exportWidget';

const DEFAULT_BASE_URL = 'https://quick-survey-view.vercel.app';

function buildEmbedSnippet(baseUrl: string, surveyId: string): string {
  const src = `${baseUrl.replace(/\/$/, '')}/?surveyId=${encodeURIComponent(surveyId)}`;
  return `<iframe src="${src}" width="300" height="400" frameborder="0"></iframe>`;
}

type Tab = 'iframe' | 'widget';

interface ShareButtonProps {
  defaultSurveyId: string;
  survey?: Survey;
}

export function ShareButton({ defaultSurveyId, survey }: ShareButtonProps) {
  const [tab, setTab] = useState<Tab>('iframe');
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [surveyId, setSurveyId] = useState(defaultSurveyId);
  const [copied, setCopied] = useState(false);

  const iframeSnippet = buildEmbedSnippet(baseUrl, surveyId);
  const widgetSnippet = survey ? generateWidgetSnippet(survey) : '';
  const surveyIdMismatch = surveyId !== defaultSurveyId;

  const handleCopy = async () => {
    const text = tab === 'iframe' ? iframeSnippet : widgetSnippet;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="share-button share-button--inline">
      <div className="share-button__panel share-button__panel--inline">
        <div className="share-button__content">
          <div className="share-button__tabs">
            <button
              type="button"
              className={`share-button__tab${tab === 'iframe' ? ' is-active' : ''}`}
              onClick={() => setTab('iframe')}
            >
              아이프레임
            </button>
            <button
              type="button"
              className={`share-button__tab${tab === 'widget' ? ' is-active' : ''}`}
              onClick={() => setTab('widget')}
            >
              독립 위젯
            </button>
          </div>

          {tab === 'iframe' && (
            <>
              <div className="share-button__row">
                <label>
                  설문 서비스 URL
                  <input type="text" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
                </label>
                <label>
                  설문 ID (surveyId)
                  <input type="text" value={surveyId} onChange={(e) => setSurveyId(e.target.value)} />
                </label>
              </div>
              <textarea className="share-button__snippet" readOnly value={iframeSnippet} rows={2} />
              {surveyIdMismatch && (
                <p className="share-button__warning">
                  ⚠ 기본값({defaultSurveyId})과 달라요. quicksurvey의 Firestore 연동 surveyId와 같아야 응답
                  화면이 열립니다.
                </p>
              )}
            </>
          )}

          {tab === 'widget' && (
            <>
              <p className="share-button__hint">
                레거시 HTML에 아래 코드를 그대로 붙여넣으면 해당 위치에 설문이 렌더링됩니다.
                외부 라이브러리 의존성이 없는 순수 HTML/CSS/JS입니다.
              </p>
              {!survey && (
                <p className="share-button__warning">설문 데이터를 불러오는 중입니다.</p>
              )}
              {survey && (
                <textarea className="share-button__snippet" readOnly value={widgetSnippet} rows={8} />
              )}
            </>
          )}

          <button type="button" onClick={handleCopy}>
            {copied ? '복사됨!' : '코드 복사'}
          </button>
        </div>
      </div>
    </div>
  );
}
