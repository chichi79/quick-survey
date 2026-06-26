import { useState } from 'react';
import { useProjectStore } from './state/useProjectStore';
import { ProjectListView } from './components/projects/ProjectListView';
import { ProjectDetailView } from './components/projects/ProjectDetailView';
import { SurveyEditorView } from './components/projects/SurveyEditorView';

type View =
  | { screen: 'project-list' }
  | { screen: 'project-detail'; projectId: string }
  | { screen: 'survey-editor'; projectId: string; surveyId: string };

function App() {
  const {
    projects,
    saveStatus,
    addProject,
    renameProject,
    removeProject,
    addSurvey,
    removeSurvey,
    updateSurveyQuestions,
    updateSurveySettings,
    togglePublished,
    getSurveysByProject,
  } = useProjectStore();

  const [view, setView] = useState<View>({ screen: 'project-list' });

  if (view.screen === 'project-list') {
    return (
      <ProjectListView
        projects={projects}
        onSelectProject={(projectId) => setView({ screen: 'project-detail', projectId })}
        onCreateProject={addProject}
        onRenameProject={renameProject}
        onRemoveProject={(projectId) => {
          removeProject(projectId);
          setView({ screen: 'project-list' });
        }}
      />
    );
  }

  const project = projects.find((p) => p.id === view.projectId);
  if (!project) {
    return (
      <ProjectListView
        projects={projects}
        onSelectProject={(projectId) => setView({ screen: 'project-detail', projectId })}
        onCreateProject={addProject}
        onRenameProject={renameProject}
        onRemoveProject={removeProject}
      />
    );
  }

  if (view.screen === 'project-detail') {
    const projectSurveys = getSurveysByProject(project.id);
    return (
      <ProjectDetailView
        project={project}
        surveys={projectSurveys}
        onBack={() => setView({ screen: 'project-list' })}
        onCreateSurvey={(title, kind, initialType) => addSurvey(project.id, title, kind, initialType)}
        onSelectSurvey={(surveyId) => setView({ screen: 'survey-editor', projectId: project.id, surveyId })}
        onRemoveSurvey={removeSurvey}
        onTogglePublished={togglePublished}
      />
    );
  }

  const survey = getSurveysByProject(project.id).find((s) => s.id === view.surveyId);
  if (!survey) {
    return (
      <ProjectDetailView
        project={project}
        surveys={getSurveysByProject(project.id)}
        onBack={() => setView({ screen: 'project-list' })}
        onCreateSurvey={(title, kind, initialType) => addSurvey(project.id, title, kind, initialType)}
        onSelectSurvey={(surveyId) => setView({ screen: 'survey-editor', projectId: project.id, surveyId })}
        onRemoveSurvey={removeSurvey}
        onTogglePublished={togglePublished}
      />
    );
  }

  return (
    <SurveyEditorView
      project={project}
      survey={survey}
      saveStatus={saveStatus}
      onChangeQuestions={updateSurveyQuestions}
      onTogglePublished={togglePublished}
      onUpdateSettings={updateSurveySettings}
      onBack={() => setView({ screen: 'project-detail', projectId: project.id })}
    />
  );
}

export default App;
