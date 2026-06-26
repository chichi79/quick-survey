import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createProject, createSurvey, type Project, type Survey, type SurveyKind } from '../models/project';
import { createQuestionByType, type Question, type QuestionType } from '../models/question';
import {
  deleteProjectFromFirestore,
  deleteSurveyFromFirestore,
  subscribeRemoteProjects,
  subscribeRemoteSurveys,
  syncProjectToFirestore,
  syncSurveyToFirestore,
} from './firestoreSync';
import { isFirebaseConfigured } from '../firebase';

const PROJECTS_KEY = 'quicksurvey_builder_projects';
const SURVEYS_KEY = 'quicksurvey_builder_surveys';

export type SaveStatus = 'saving' | 'saved';

function readFromStorage<T>(key: string): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * 과거 버전(genId가 새로고침마다 카운터를 1로 리셋하던 시절)에 저장된 설문에
 * id가 중복된 문항이 남아있을 수 있다 — 같은 id를 가진 문항이 둘 이상이면
 * 선택 상태/스크롤 동기화가 뒤섞이므로, 불러올 때 중복된 뒤쪽 항목의 id를 다시 부여한다.
 */
/** 과거 버전에는 kind 필드가 없었으므로, 없으면 '여러 문항 설문'으로 간주한다. */
function withSurveyKindDefault(surveys: Survey[]): Survey[] {
  return surveys.map((survey) => (survey.kind ? survey : { ...survey, kind: 'multi' as SurveyKind }));
}

/** 과거 버전에는 published 필드가 없었으므로, 없으면 비노출(false)로 간주한다. */
function withPublishedDefault(surveys: Survey[]): Survey[] {
  return surveys.map((survey) => (survey.published === undefined ? { ...survey, published: false } : survey));
}

/** 과거 버전에는 기간/리워드 필드가 없었으므로, 없으면 "제한 없음 + 기본 리워드"로 간주한다. */
function withScheduleDefaults(surveys: Survey[]): Survey[] {
  return surveys.map((survey) => ({
    ...survey,
    startDate: survey.startDate ?? null,
    endDate: survey.endDate ?? null,
    rewardPoint: survey.rewardPoint ?? 100,
    completeMessage: survey.completeMessage ?? '설문에 참여해주셔서 감사합니다!',
  }));
}

function dedupeQuestionIds(surveys: Survey[]): Survey[] {
  return surveys.map((survey) => {
    const seen = new Set<string>();
    let changed = false;
    const questions = survey.questions.map((q) => {
      if (!seen.has(q.id)) {
        seen.add(q.id);
        return q;
      }
      changed = true;
      const newId = `${q.id}-dedup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      seen.add(newId);
      return { ...q, id: newId };
    });
    return changed ? { ...survey, questions } : survey;
  });
}

/**
 * 로컬(이 브라우저)과 Firestore에서 받아온 원격 목록을 id 기준으로 합친다.
 * 한쪽에만 있으면 그대로 채택. 둘 다에 있으면 로컬을 우선한다 — 프로젝트는
 * 생성 이후 거의 바뀌지 않으므로 "같은 id면 로컬"이어도 충돌이 생길 일이 없다.
 */
function mergeById<T extends { id: string }>(local: T[], remote: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of remote) map.set(item.id, item);
  for (const item of local) map.set(item.id, item);
  return [...map.values()];
}

/**
 * 설문은 계속 편집되므로 "로컬이 항상 이긴다"면 다른 브라우저에서 고친 내용이
 * Firestore 동기화가 끝난 뒤에도 안 보일 수 있다. updatedAt을 비교해서 더 최신인
 * 쪽을 채택한다 — 방금 이 브라우저에서 타이핑한 직후에는 로컬 updatedAt이 더 최신이라
 * Firestore 쓰기가 끝나기 전까지도 화면이 깜빡이지 않고, 다른 브라우저의 변경은
 * 그쪽 Firestore 쓰기가 완료되는 즉시(서버 타임스탬프가 더 최신이므로) 반영된다.
 */
function mergeSurveys(local: Survey[], remote: Survey[]): Survey[] {
  const map = new Map<string, Survey>();
  for (const item of remote) map.set(item.id, item);
  for (const item of local) {
    const existing = map.get(item.id);
    if (!existing || item.updatedAt >= existing.updatedAt) {
      map.set(item.id, item);
    }
  }
  return [...map.values()];
}

export function useProjectStore() {
  const [localProjects, setLocalProjects] = useState<Project[]>(() => readFromStorage<Project>(PROJECTS_KEY));
  const [localSurveys, setLocalSurveys] = useState<Survey[]>(() =>
    withScheduleDefaults(
      withPublishedDefault(withSurveyKindDefault(dedupeQuestionIds(readFromStorage<Survey>(SURVEYS_KEY)))),
    ),
  );
  const [remoteProjects, setRemoteProjects] = useState<Project[]>([]);
  const [remoteSurveys, setRemoteSurveys] = useState<Survey[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const revertTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const projects = useMemo(() => mergeById(localProjects, remoteProjects), [localProjects, remoteProjects]);
  const surveys = useMemo(() => mergeSurveys(localSurveys, remoteSurveys), [localSurveys, remoteSurveys]);

  const markSavedSoon = useCallback(() => {
    if (revertTimer.current) clearTimeout(revertTimer.current);
    revertTimer.current = setTimeout(() => setSaveStatus('saved'), 400);
  }, []);

  const markDirty = useCallback(() => {
    setSaveStatus('saving');
  }, []);

  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(localProjects));
    markSavedSoon();
  }, [localProjects, markSavedSoon]);

  useEffect(() => {
    localStorage.setItem(SURVEYS_KEY, JSON.stringify(localSurveys));
    markSavedSoon();
  }, [localSurveys, markSavedSoon]);

  /**
   * localStorage는 이 브라우저(프로필) 안에서만 보이므로, 다른 브라우저/프로필이
   * 만든 프로젝트·설문도 다 같이 보이게 하려고 Firestore의 projects/surveys
   * 컬렉션을 실시간으로 구독해서 로컬 목록과 병합한다.
   */
  useEffect(() => {
    const unsubscribeProjects = subscribeRemoteProjects(setRemoteProjects);
    const unsubscribeSurveys = subscribeRemoteSurveys(setRemoteSurveys);
    return () => {
      unsubscribeProjects();
      unsubscribeSurveys();
    };
  }, []);

  /**
   * 이 브라우저에서 만들거나 바꾼 프로젝트/설문을 Firestore로 올려보낸다.
   * 타이핑마다 쓰기가 일어나지 않도록 짧게 디바운스한다. 삭제는 removeProject/
   * removeSurvey에서 즉시 처리하므로 여기서는 업서트만 한다.
   */
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const timer = setTimeout(() => {
      for (const project of localProjects) void syncProjectToFirestore(project);
    }, 500);
    return () => clearTimeout(timer);
  }, [localProjects]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const timer = setTimeout(() => {
      for (const survey of localSurveys) void syncSurveyToFirestore(survey);
    }, 500);
    return () => clearTimeout(timer);
  }, [localSurveys]);

  const addProject = useCallback((name: string) => {
    markDirty();
    const project = createProject(name);
    setLocalProjects((prev) => [...prev, project]);
    return project;
  }, [markDirty]);

  const removeProject = useCallback((projectId: string) => {
    markDirty();
    setLocalProjects((prev) => prev.filter((p) => p.id !== projectId));
    setLocalSurveys((prev) => prev.filter((s) => s.projectId !== projectId));
    void deleteProjectFromFirestore(projectId);
    for (const survey of surveys) {
      if (survey.projectId === projectId) void deleteSurveyFromFirestore(survey.id);
    }
  }, [markDirty, surveys]);

  const addSurvey = useCallback(
    (projectId: string, title: string, kind: SurveyKind = 'multi', initialType?: QuestionType) => {
      markDirty();
      const survey = createSurvey(projectId, title, kind);
      if (kind === 'single' && initialType) {
        survey.questions = [createQuestionByType(initialType, 0)];
      }
      setLocalSurveys((prev) => [...prev, survey]);
      return survey;
    },
    [markDirty],
  );

  const removeSurvey = useCallback((surveyId: string) => {
    markDirty();
    setLocalSurveys((prev) => prev.filter((s) => s.id !== surveyId));
    void deleteSurveyFromFirestore(surveyId);
  }, [markDirty]);

  /**
   * 다른 브라우저에서 만들어 원격으로만 존재하는 설문을 이 브라우저에서 처음
   * 편집할 때는, 로컬 목록에 없으니 그냥 map으로 덮어쓸 수 없다 — 합쳐진
   * 현재 값(surveys)을 가져와 로컬에 새로 추가하면서 patch를 적용한다.
   */
  const applyToSurvey = useCallback(
    (surveyId: string, updater: (s: Survey) => Survey) => {
      markDirty();
      setLocalSurveys((prevLocal) => {
        if (prevLocal.some((s) => s.id === surveyId)) {
          return prevLocal.map((s) => (s.id === surveyId ? updater(s) : s));
        }
        const fromMerged = surveys.find((s) => s.id === surveyId);
        if (!fromMerged) return prevLocal;
        return [...prevLocal, updater(fromMerged)];
      });
    },
    [markDirty, surveys],
  );

  const renameSurvey = useCallback(
    (surveyId: string, title: string) => {
      applyToSurvey(surveyId, (s) => ({ ...s, title, updatedAt: new Date().toISOString() }));
    },
    [applyToSurvey],
  );

  const updateSurveyQuestions = useCallback(
    (surveyId: string, questions: Question[]) => {
      applyToSurvey(surveyId, (s) => ({ ...s, questions, updatedAt: new Date().toISOString() }));
    },
    [applyToSurvey],
  );

  const updateSurveySettings = useCallback(
    (
      surveyId: string,
      patch: Partial<Pick<Survey, 'startDate' | 'endDate' | 'rewardPoint' | 'completeMessage'>>,
    ) => {
      applyToSurvey(surveyId, (s) => ({ ...s, ...patch, updatedAt: new Date().toISOString() }));
    },
    [applyToSurvey],
  );

  const togglePublished = useCallback(
    (surveyId: string) => {
      applyToSurvey(surveyId, (s) => ({ ...s, published: !s.published, updatedAt: new Date().toISOString() }));
    },
    [applyToSurvey],
  );

  const getSurveysByProject = useCallback(
    (projectId: string) => surveys.filter((s) => s.projectId === projectId),
    [surveys],
  );

  return {
    projects,
    surveys,
    saveStatus,
    addProject,
    removeProject,
    addSurvey,
    removeSurvey,
    renameSurvey,
    updateSurveyQuestions,
    updateSurveySettings,
    togglePublished,
    getSurveysByProject,
  };
}
