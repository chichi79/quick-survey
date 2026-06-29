import { useState } from 'react';
import { useProjectStore } from './state/useProjectStore';
import { ProjectListView } from './components/projects/ProjectListView';
import { ProjectDetailView } from './components/projects/ProjectDetailView';
import { SurveyEditorView } from './components/projects/SurveyEditorView';
import { TrashView } from './components/projects/TrashView';

type View =
  | { screen: 'project-list' }
  | { screen: 'trash' }
  | { screen: 'project-detail'; projectId: string }
  | { screen: 'survey-editor'; projectId: string; surveyId: string };

function App() {
  const {
    projects,
    surveys,
    trashedProjects,
    trashedSurveys,
    saveStatus,
    addProject,
    renameProject,
    removeProject,
    restoreProject,
    permanentlyDeleteProject,
    addSurvey,
    duplicateSurvey,
    removeSurvey,
    restoreSurvey,
    permanentlyDeleteSurvey,
    updateSurveyQuestions,
    updateSurveySettings,
    togglePublished,
    copyQuestionToSurvey,
    getSurveysByProject,
  } = useProjectStore();

  const [view, setView] = useState<View>({ screen: 'project-list' });

  if (view.screen === 'trash') {
    return (
      <TrashView
        projects={trashedProjects}
        surveys={trashedSurveys}
        onBack={() => setView({ screen: 'project-list' })}
        onRestoreProject={restoreProject}
        onPermanentlyDeleteProject={permanentlyDeleteProject}
        onRestoreSurvey={restoreSurvey}
        onPermanentlyDeleteSurvey={permanentlyDeleteSurvey}
      />
    );
  }

  if (view.screen === 'project-list') {
    return (
      <ProjectListView
        projects={projects}
        onSelectProject={(projectId) => setView({ screen: 'project-detail', projectId })}
        onCreateProject={addProject}
        onRenameProject={renameProject}
        onRemoveProject={removeProject}
        onOpenTrash={() => setView({ screen: 'trash' })}
        trashCount={trashedProjects.length + trashedSurveys.length}
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
        onOpenTrash={() => setView({ screen: 'trash' })}
        trashCount={trashedProjects.length + trashedSurveys.length}
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
        onDuplicateSurvey={duplicateSurvey}
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
        onDuplicateSurvey={duplicateSurvey}
        onRemoveSurvey={removeSurvey}
        onTogglePublished={togglePublished}
      />
    );
  }

  return (
    <SurveyEditorView
      project={project}
      survey={survey}
      otherSurveys={surveys.filter((s) => s.id !== survey.id)}
      saveStatus={saveStatus}
      onChangeQuestions={updateSurveyQuestions}
      onTogglePublished={togglePublished}
      onUpdateSettings={updateSurveySettings}
      onCopyQuestionToSurvey={copyQuestionToSurvey}
      onBack={() => setView({ screen: 'project-detail', projectId: project.id })}
    />
  );
}

export default App;
