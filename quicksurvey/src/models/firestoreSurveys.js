/**
 * quicksurvey-builder가 Firestore의 surveys 컬렉션에 설문 전체를 동기화해두고,
 * published 필드로 노출 여부를 켠다. 여기서는 published == true인 문서만
 * 실시간으로 구독해서, 빌더에서 노출을 켜고 끄는 순간 이 목록도 바로 바뀐다.
 *
 * firebase.js/firebase-firestore.js는 동적 import로 불러온다 — firebaseConfig.js가
 * 아직 비어 있거나 네트워크가 막혀 있어도(오프라인 환경 등) CDN import 실패가
 * 전체 모듈 그래프를 깨뜨리지 않고 그냥 "구독 없음"으로 안전하게 넘어가게 한다.
 *
 * onChange에 null이 오면 "Firebase 설정이 안 되어 있거나 연결할 수 없음"을 뜻하고,
 * 빈 배열([])이 오면 "연결은 됐지만 노출 중인 설문이 없음"을 뜻한다 — 둘을 구분해야
 * 화면에 다른 안내를 보여줄 수 있다.
 *
 * @param {(surveys: Array<{ surveyId: string, title: string, questions: Array<Object>, rules: Array<Object> }> | null) => void} onChange
 * @returns {() => void} unsubscribe (구독 준비가 끝나기 전엔 빈 함수)
 */
export function subscribePublishedSurveys(onChange) {
  let unsubscribe = () => {};

  (async () => {
    let firestoreModule;
    let firebaseModule;
    try {
      [firestoreModule, firebaseModule] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'),
        import('../firebase.js'),
      ]);
    } catch (err) {
      console.warn('Firestore 모듈을 불러오지 못했습니다 (오프라인이거나 CDN 차단). 노출 설문 없이 동작합니다.', err);
      onChange(null);
      return;
    }

    const { db, isFirebaseConfigured } = firebaseModule;
    if (!isFirebaseConfigured || !db) {
      onChange(null);
      return;
    }

    const { collection, onSnapshot, query, where } = firestoreModule;
    const q = query(collection(db, 'surveys'), where('published', '==', true));

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const surveys = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            surveyId: data.surveyId || docSnap.id,
            title: data.title || docSnap.id,
            questions: Array.isArray(data.questions) ? data.questions : [],
            rules: [],
            startDate: typeof data.startDate === 'string' ? data.startDate : null,
            endDate: typeof data.endDate === 'string' ? data.endDate : null,
            rewardPoint: typeof data.rewardPoint === 'number' ? data.rewardPoint : 100,
            completeMessage:
              typeof data.completeMessage === 'string' && data.completeMessage
                ? data.completeMessage
                : '설문에 참여해주셔서 감사합니다!',
          };
        });
        onChange(surveys);
      },
      (err) => {
        console.error('Firestore 구독 실패:', err);
        onChange([]);
      },
    );
  })();

  return () => unsubscribe();
}
