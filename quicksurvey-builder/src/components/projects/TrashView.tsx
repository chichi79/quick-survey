import type { Project, Survey } from '../../models/project';

interface TrashViewProps {
  projects: Project[];
  surveys: Survey[];
  onBack: () => void;
  onRestoreProject: (projectId: string) => void;
  onPermanentlyDeleteProject: (projectId: string) => void;
  onRestoreSurvey: (surveyId: string) => void;
  onPermanentlyDeleteSurvey: (surveyId: string) => void;
}

export function TrashView({
  projects,
  surveys,
  onBack,
  onRestoreProject,
  onPermanentlyDeleteProject,
  onRestoreSurvey,
  onPermanentlyDeleteSurvey,
}: TrashViewProps) {
  return (
    <div className="project-list-page">
      <header className="app-header">
        <div className="app-header__breadcrumb">
          <img src="/favicon.svg" alt="" className="app-header__logo app-header__logo--compact" />
          <a className="app-header__project" onClick={onBack}>
            프로젝트
          </a>
          <span className="app-header__sep">/</span>
          <span className="app-header__title">휴지통</span>
        </div>
      </header>

      <div className="project-list-page__body">
        <p className="trash-view__hint">삭제된 프로젝트/설문은 영구 삭제 전까지 여기서 복구할 수 있습니다.</p>

        <section className="trash-view__section">
          <h3>프로젝트</h3>
          <ul className="trash-view__list">
            {projects.map((project) => (
              <li key={project.id} className="trash-view__item">
                <span className="trash-view__name">{project.name}</span>
                <div className="trash-view__actions">
                  <button type="button" onClick={() => onRestoreProject(project.id)}>
                    복구
                  </button>
                  <button
                    type="button"
                    className="survey-list__delete"
                    onClick={() => {
                      if (window.confirm(`"${project.name}" 프로젝트를 영구 삭제하시겠습니까? 되돌릴 수 없습니다.`)) {
                        onPermanentlyDeleteProject(project.id);
                      }
                    }}
                  >
                    영구 삭제
                  </button>
                </div>
              </li>
            ))}
            {projects.length === 0 && <li className="project-list-page__empty">휴지통이 비어있습니다.</li>}
          </ul>
        </section>

        <section className="trash-view__section">
          <h3>설문</h3>
          <ul className="trash-view__list">
            {surveys.map((survey) => (
              <li key={survey.id} className="trash-view__item">
                <span className="trash-view__name">{survey.title}</span>
                <div className="trash-view__actions">
                  <button type="button" onClick={() => onRestoreSurvey(survey.id)}>
                    복구
                  </button>
                  <button
                    type="button"
                    className="survey-list__delete"
                    onClick={() => {
                      if (window.confirm(`"${survey.title}" 설문을 영구 삭제하시겠습니까? 되돌릴 수 없습니다.`)) {
                        onPermanentlyDeleteSurvey(survey.id);
                      }
                    }}
                  >
                    영구 삭제
                  </button>
                </div>
              </li>
            ))}
            {surveys.length === 0 && <li className="project-list-page__empty">휴지통이 비어있습니다.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
