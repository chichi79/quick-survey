import { useState } from 'react';
import type { Project } from '../../models/project';
import { isFirebaseConfigured } from '../../firebase';
import { ProjectIntroDiagram } from './ProjectIntroDiagram';

type SortOrder = 'name' | 'recent';

interface ProjectListViewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onCreateProject: (name: string) => void;
  onRenameProject: (projectId: string, name: string) => void;
  onRemoveProject: (projectId: string) => void;
  onOpenTrash: () => void;
  trashCount: number;
}

export function ProjectListView({
  projects,
  onSelectProject,
  onCreateProject,
  onRenameProject,
  onRemoveProject,
  onOpenTrash,
  trashCount,
}: ProjectListViewProps) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');

  const visibleProjects = projects
    .filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) =>
      sortOrder === 'name' ? a.name.localeCompare(b.name) : b.createdAt.localeCompare(a.createdAt),
    );

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditingName(project.name);
  };

  const commitEditing = () => {
    const name = editingName.trim();
    if (editingId && name) onRenameProject(editingId, name);
    setEditingId(null);
  };

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
        <button type="button" className="app-header__trash" onClick={onOpenTrash}>
          휴지통{trashCount > 0 ? ` (${trashCount})` : ''}
        </button>
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

        <div className="project-list-page__filters">
          <input
            type="text"
            placeholder="프로젝트 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as SortOrder)}>
            <option value="recent">최근 생성순</option>
            <option value="name">이름순</option>
          </select>
        </div>

        <div className="project-list-page__grid">
          {visibleProjects.map((project) => (
            <div key={project.id} className="project-card" onClick={() => editingId !== project.id && onSelectProject(project.id)}>
              {editingId === project.id ? (
                <input
                  type="text"
                  className="project-card__name-input"
                  value={editingName}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitEditing();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onBlur={commitEditing}
                />
              ) : (
                <span className="project-card__name">{project.name}</span>
              )}
              <div className="project-card__actions">
                <button
                  type="button"
                  className="project-card__rename"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(project);
                  }}
                >
                  이름 수정
                </button>
                <button
                  type="button"
                  className="project-card__delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`"${project.name}" 프로젝트를 삭제하시겠습니까? 안의 설문도 모두 삭제됩니다.`)) {
                      onRemoveProject(project.id);
                    }
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
          {visibleProjects.length === 0 && (
            <p className="project-list-page__empty">
              {projects.length === 0 ? '프로젝트를 만들어보세요.' : '검색 결과가 없습니다.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
