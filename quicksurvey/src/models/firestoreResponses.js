/**
 * quicksurvey-builder의 "메트릭" 탭이 실시간으로 집계할 수 있도록, 응답 한 건이
 * 저장될 때마다 Firestore의 responses 컬렉션에도 같이 올려둔다.
 *
 * firebase.js/firebase-firestore.js는 동적 import로 불러온다 — firestoreSurveys.js와
 * 같은 이유로, CDN/네트워크가 막혀 있어도 응답 저장(saveResponseLog) 자체는 항상
 * 로컬에서 성공해야 하고 Firestore 동기화 실패는 조용히 무시한다.
 *
 * @param {import('./responseLog.js').ResponseLogEntry} entry
 */
export async function syncResponseToFirestore(entry) {
  let firestoreModule;
  let firebaseModule;
  try {
    [firestoreModule, firebaseModule] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'),
      import('../firebase.js'),
    ]);
  } catch (err) {
    console.warn('Firestore 모듈을 불러오지 못해 응답 동기화를 건너뜁니다.', err);
    return;
  }

  const { db, isFirebaseConfigured } = firebaseModule;
  if (!isFirebaseConfigured || !db) return;

  const { collection, doc, setDoc, serverTimestamp } = firestoreModule;
  try {
    await setDoc(doc(collection(db, 'responses'), entry.id), {
      surveyId: entry.surveyId,
      answers: entry.answers,
      submittedAt: entry.submittedAt,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Firestore 응답 동기화 실패:', err);
  }
}
