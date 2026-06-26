import { useState } from 'react';
import type { Project } from '../../models/project';
import { isFirebaseConfigured } from '../../firebase';
import { ProjectIntroDiagram } from './ProjectIntroDiagram';

interface ProjectListViewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onCreateProject: (name: string) => void;
  onRemoveProject: (projectId: string) => void;
}

export function ProjectListView({
  projects,
  onSelectProject,
  onCreateProject,
  onRemoveProject,
}: ProjectListViewProps) {
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    onCreateProject(name);
    setNewName('');
  };

  return (
    <div className="project-list-page">
      <header className="app-header">
        <div className="app-header__brand">
          <img src="/favicon.svg" alt="" className="app-header__logo" />
          <span className="app-header__brand-name">퀵서베이 빌더</span>
        </div>
      </header>

      <div className="project-list-page__body">
        <section className="project-list-page__intro">
          <ProjectIntroDiagram />
          <div>
            <h2>프로젝트</h2>
            <p>
              비슷한 설문을 묶어서 관리하는 단위예요. 캠페인이나 시즌처럼 운영 단위로 프로젝트를
              만들고, 그 안에 설문을 여러 개 추가해서 관리해보세요.
            </p>
          </div>
        </section>

        {!isFirebaseConfigured && (
          <p className="project-list-page__publish-warning">
            ⚠ Firebase 설정이 안 되어 있어 quicksurvey와 실시간 연동이 꺼져 있습니다.
            .env.local에 VITE_FIREBASE_* 값을 채우고 다시 시작해주세요.
          </p>
        )}
        <div className="project-list-page__create">
          <input
            type="text"
            placeholder="새 프로젝트 이름"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
            }}
          />
          <button type="button" onClick={handleCreate} disabled={!newName.trim()}>
            + 새 프로젝트
          </button>
        </div>

        <div className="project-list-page__grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card" onClick={() => onSelectProject(project.id)}>
              <span className="project-card__name">{project.name}</span>
              <button
                type="button"
                className="project-card__delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveProject(project.id);
                }}
              >
                삭제
              </button>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="project-list-page__empty">프로젝트를 만들어보세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}
