import { useState } from 'react';

const DEFAULT_BASE_URL = 'https://quick-survey-view.vercel.app';

function buildEmbedSnippet(baseUrl: string, surveyId: string): string {
  const src = `${baseUrl.replace(/\/$/, '')}/?surveyId=${encodeURIComponent(surveyId)}`;
  // 기사 우측 모듈 같은 좁은 영역에 맞춘 기본 크기. 모듈 안에서는 "크게 보기"를 누르면
  // 같은 URL이 새 탭에서 풀페이지로 열린다 (iframe 밖이라 자동으로 압축 스타일이 빠짐).
  return `<iframe src="${src}" width="300" height="400" frameborder="0"></iframe>`;
}

interface ShareButtonProps {
  defaultSurveyId: string;
}

export function ShareButton({ defaultSurveyId }: ShareButtonProps) {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [surveyId, setSurveyId] = useState(defaultSurveyId);
  const [copied, setCopied] = useState(false);

  const snippet = buildEmbedSnippet(baseUrl, surveyId);
  const surveyIdMismatch = surveyId !== defaultSurveyId;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="share-button share-button--inline">
      <div className="share-button__panel share-button__panel--inline">
        <div className="share-button__content">
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
          <textarea className="share-button__snippet" readOnly value={snippet} rows={2} />
          <button type="button" onClick={handleCopy}>
            {copied ? '복사됨!' : '코드 복사'}
          </button>
          {surveyIdMismatch && (
            <p className="share-button__warning">
              ⚠ 기본값({defaultSurveyId})과 달라요. quicksurvey의 Firestore 연동 surveyId와 같아야 응답
              화면이 열립니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
