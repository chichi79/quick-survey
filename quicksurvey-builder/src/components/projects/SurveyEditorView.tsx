import { useState } from 'react';
import { useSurveyBuilder } from '../../state/useSurveyBuilder';
import { QuestionList } from '../QuestionList';
import { QuestionEditor } from '../QuestionEditor';
import { PreviewPane } from '../preview/PreviewPane';
import { ExposurePreview } from '../preview/ExposurePreview';
import { CollectTabView } from './CollectTabView';
import { MetricTabView } from './MetricTabView';
import type { Project, Survey } from '../../models/project';
import type { Question } from '../../models/question';
import type { SaveStatus } from '../../state/useProjectStore';

type EditorTab = 'edit' | 'collect' | 'metric';

interface SurveyEditorViewProps {
  project: Project;
  survey: Survey;
  saveStatus: SaveStatus;
  onChangeQuestions: (surveyId: string, questions: Question[]) => void;
  onTogglePublished: (surveyId: string) => void;
  onUpdateSettings: (
    surveyId: string,
    patch: { startDate: string | null; endDate: string | null; rewardPoint: number; completeMessage: string },
  ) => void;
  onBack: () => void;
}

export function SurveyEditorView({
  project,
  survey,
  saveStatus,
  onChangeQuestions,
  onTogglePublished,
  onUpdateSettings,
  onBack,
}: SurveyEditorViewProps) {
  const {
    questions,
    selectedId,
    selectedQuestion,
    selectQuestion,
    addQuestion,
    updateQuestion,
    removeQuestion,
    moveQuestion,
    duplicateQuestion,
    reorderQuestion,
  } = useSurveyBuilder(survey.questions, (next) => onChangeQuestions(survey.id, next));

  const [isExposureOpen, setIsExposureOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>('edit');

  const handleEditorChange = (next: Question) => {
    updateQuestion(next.id, () => next);
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__breadcrumb">
          <img src="/favicon.svg" alt="" className="app-header__logo app-header__logo--compact" />
          <a className="app-header__project" onClick={onBack}>
            {project.name}
          </a>
          <span className="app-header__sep">/</span>
          <span className="app-header__title">{survey.title}</span>
        </div>
        <div className="app-header__actions">
          <span className={`app-header__status ${saveStatus === 'saving' ? 'is-saving' : ''}`}>
            {saveStatus === 'saving' ? '저장 중…' : '자동 저장 완료'}
          </span>
        </div>
      </header>
      <div className="app-tabs">
        <span
          className={`app-tabs__item ${activeTab === 'edit' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          편집
        </span>
        <span className="app-tabs__sep">›</span>
        <span
          className={`app-tabs__item ${activeTab === 'collect' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('collect')}
        >
          수집
        </span>
        <span className="app-tabs__sep">›</span>
        <span
          className={`app-tabs__item ${activeTab === 'metric' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('metric')}
        >
          메트릭
        </span>
      </div>

      {activeTab === 'edit' && (
        <main className="app-body">
          <QuestionList
            questions={questions}
            selectedId={selectedId}
            onSelect={selectQuestion}
            onAdd={addQuestion}
            onRemove={removeQuestion}
            onMove={moveQuestion}
            onDuplicate={duplicateQuestion}
            onReorder={reorderQuestion}
            locked={survey.kind === 'single'}
          />
          <div className="app-canvas">
            <div className="preview-mode-toggle">
              <span className="preview-mode-toggle__title">편집 미리보기</span>
              <button type="button" onClick={() => setIsExposureOpen(true)}>
                노출 미리보기
              </button>
            </div>
            <PreviewPane questions={questions} selectedId={selectedId} onSelectQuestion={selectQuestion} />
          </div>
          <QuestionEditor question={selectedQuestion} onChange={handleEditorChange} />
        </main>
      )}

      {activeTab === 'collect' && (
        <CollectTabView survey={survey} onTogglePublished={onTogglePublished} onUpdateSettings={onUpdateSettings} />
      )}

      {activeTab === 'metric' && <MetricTabView survey={survey} />}

      {isExposureOpen && (
        <div className="modal-backdrop" onClick={() => setIsExposureOpen(false)}>
          <div className="modal-panel modal-panel--exposure" onClick={(e) => e.stopPropagation()}>
            <div className="modal-panel__header">
              <h3>노출 미리보기</h3>
              <button type="button" className="modal-panel__close" onClick={() => setIsExposureOpen(false)}>
                ✕
              </button>
            </div>
            <ExposurePreview questions={questions} />
          </div>
        </div>
      )}
    </div>
  );
}
