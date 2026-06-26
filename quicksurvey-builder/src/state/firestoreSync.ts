import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import type { Project, Survey } from '../models/project';

const SURVEYS_COLLECTION = 'surveys';
const PROJECTS_COLLECTION = 'projects';
const RESPONSES_COLLECTION = 'responses';

export interface SurveyResponse {
  id: string;
  answers: Record<string, unknown>;
  submittedAt: string;
}

/**
 * quicksurvey가 실시간으로 구독하는 surveys 컬렉션에 설문 전체를 업서트한다.
 * published 여부와 무관하게 항상 동기화해두고, quicksurvey 쪽에서
 * `where('published', '==', true)` 쿼리로 노출 여부를 가른다.
 */
export async function syncSurveyToFirestore(survey: Survey): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await setDoc(doc(db, SURVEYS_COLLECTION, survey.id), {
      surveyId: survey.id,
      projectId: survey.projectId,
      title: survey.title,
      kind: survey.kind,
      questions: survey.questions,
      published: survey.published,
      startDate: survey.startDate,
      endDate: survey.endDate,
      rewardPoint: survey.rewardPoint,
      completeMessage: survey.completeMessage,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Firestore 동기화 실패:', err);
  }
}

export async function deleteSurveyFromFirestore(surveyId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await deleteDoc(doc(db, SURVEYS_COLLECTION, surveyId));
  } catch (err) {
    console.error('Firestore 삭제 실패:', err);
  }
}

/**
 * 프로젝트는 surveys와 달리 quicksurvey가 구독하지 않지만, 빌더를 여는
 * 모든 브라우저/프로필이 같은 프로젝트 목록을 보게 하려고 동일하게 동기화한다.
 */
export async function syncProjectToFirestore(project: Project): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await setDoc(doc(db, PROJECTS_COLLECTION, project.id), {
      projectId: project.id,
      name: project.name,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Firestore 프로젝트 동기화 실패:', err);
  }
}

export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
  } catch (err) {
    console.error('Firestore 프로젝트 삭제 실패:', err);
  }
}

function timestampToIso(value: unknown): string {
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
}

/**
 * 다른 브라우저/프로필에서 만든 프로젝트도 보이게 하려고 projects 컬렉션
 * 전체를 실시간 구독한다. Firebase가 설정되지 않은 환경에서는 그냥 빈 구독.
 */
export function subscribeRemoteProjects(onChange: (projects: Project[]) => void): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  const unsubscribe = onSnapshot(
    collection(db, PROJECTS_COLLECTION),
    (snapshot) => {
      const projects: Project[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const updatedAt = timestampToIso(data.updatedAt);
        return {
          id: typeof data.projectId === 'string' ? data.projectId : docSnap.id,
          name: typeof data.name === 'string' ? data.name : '(이름 없음)',
          createdAt: updatedAt,
        };
      });
      onChange(projects);
    },
    (err) => {
      console.error('Firestore 프로젝트 구독 실패:', err);
      onChange([]);
    },
  );
  return unsubscribe;
}

/**
 * 다른 브라우저/프로필에서 만든 설문도 보이게 하려고 surveys 컬렉션 전체를
 * 실시간 구독한다 (quicksurvey 쪽 구독과 달리 published 여부를 가리지 않음).
 */
export function subscribeRemoteSurveys(onChange: (surveys: Survey[]) => void): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  const unsubscribe = onSnapshot(
    collection(db, SURVEYS_COLLECTION),
    (snapshot) => {
      const surveys: Survey[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const updatedAt = timestampToIso(data.updatedAt);
        return {
          id: typeof data.surveyId === 'string' ? data.surveyId : docSnap.id,
          projectId: data.projectId,
          title: data.title,
          kind: data.kind === 'single' ? 'single' : 'multi',
          questions: Array.isArray(data.questions) ? data.questions : [],
          published: Boolean(data.published),
          startDate: typeof data.startDate === 'string' ? data.startDate : null,
          endDate: typeof data.endDate === 'string' ? data.endDate : null,
          rewardPoint: typeof data.rewardPoint === 'number' ? data.rewardPoint : 100,
          completeMessage:
            typeof data.completeMessage === 'string' && data.completeMessage
              ? data.completeMessage
              : '설문에 참여해주셔서 감사합니다!',
          createdAt: updatedAt,
          updatedAt,
        };
      });
      onChange(surveys);
    },
    (err) => {
      console.error('Firestore 설문 구독 실패:', err);
      onChange([]);
    },
  );
  return unsubscribe;
}

/**
 * quicksurvey가 응답을 받을 때마다 responses 컬렉션에 올려두는 응답 원본을
 * 해당 surveyId 기준으로 실시간 구독한다 — "메트릭" 탭이 이걸로 응답 수/문항별
 * 분포를 집계한다.
 */
export function subscribeRemoteResponses(
  surveyId: string,
  onChange: (responses: SurveyResponse[]) => void,
): () => void {
  if (!isFirebaseConfigured || !db) return () => {};
  const q = query(collection(db, RESPONSES_COLLECTION), where('surveyId', '==', surveyId));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const responses: SurveyResponse[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          answers: typeof data.answers === 'object' && data.answers ? data.answers : {},
          submittedAt: typeof data.submittedAt === 'string' ? data.submittedAt : timestampToIso(data.createdAt),
        };
      });
      onChange(responses);
    },
    (err) => {
      console.error('Firestore 응답 구독 실패:', err);
      onChange([]);
    },
  );
  return unsubscribe;
}
