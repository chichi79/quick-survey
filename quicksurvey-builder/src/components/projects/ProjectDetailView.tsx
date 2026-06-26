import { useState } from 'react';
import type { Project, Survey, SurveyKind } from '../../models/project';
import type { QuestionType } from '../../models/question';
import { CreateSurveyModal } from './CreateSurveyModal';

interface ProjectDetailViewProps {
  project: Project;
  surveys: Survey[];
  onBack: () => void;
  onCreateSurvey: (title: string, kind: SurveyKind, initialType?: QuestionType) => void;
  onSelectSurvey: (surveyId: string) => void;
  onRemoveSurvey: (surveyId: string) => void;
  onTogglePublished: (surveyId: string) => void;
}

const KIND_LABEL: Record<SurveyKind, string> = {
  single: '단일 문항',
  multi: '여러 문항',
};

export function ProjectDetailView({
  project,
  surveys,
  onBack,
  onCreateSurvey,
  onSelectSurvey,
  onRemoveSurvey,
  onTogglePublished,
}: ProjectDetailViewProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreate = (title: string, kind: SurveyKind, initialType?: QuestionType) => {
    onCreateSurvey(title, kind, initialType);
    setIsCreateOpen(false);
  };

  return (
    <div className="project-detail-page">
      <header className="app-header">
        <div className="app-header__breadcrumb">
          <img src="/favicon.svg" alt="" className="app-header__logo app-header__logo--compact" />
          <a className="app-header__project" onClick={onBack}>
            프로젝트
          </a>
          <span className="app-header__sep">/</span>
          <span className="app-header__title">{project.name}</span>
        </div>
      </header>

      <div className="project-detail-page__body">
        <div className="project-list-page__create">
          <button type="button" onClick={() => setIsCreateOpen(true)}>
            + 새 설문 만들기
          </button>
        </div>

        <ul className="survey-list">
          {surveys.map((survey) => (
            <li key={survey.id} className="survey-list__item">
              <span className="survey-list__title">{survey.title}</span>
              <span className="survey-list__badge">{KIND_LABEL[survey.kind]}</span>
              <span className="survey-list__count">{survey.questions.length}개 문항</span>
              <label className="survey-list__publish-toggle" title="quicksurvey 목록에 노출">
                <input
                  type="checkbox"
                  checked={survey.published}
                  onChange={() => onTogglePublished(survey.id)}
                />
                {survey.published ? 'quicksurvey 노출 ON' : 'quicksurvey 노출 OFF'}
              </label>
              <div className="survey-list__actions">
                <button type="button" onClick={() => onSelectSurvey(survey.id)}>
                  편집
                </button>
                <button
                  type="button"
                  className="survey-list__delete"
                  onClick={() => {
                    if (window.confirm(`"${survey.title}" 설문을 삭제하시겠습니까?`)) {
                      onRemoveSurvey(survey.id);
                    }
                  }}
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
          {surveys.length === 0 && <li className="project-list-page__empty">설문을 만들어보세요.</li>}
        </ul>
      </div>

      {isCreateOpen && <CreateSurveyModal onClose={() => setIsCreateOpen(false)} onCreate={handleCreate} />}
    </div>
  );
}
