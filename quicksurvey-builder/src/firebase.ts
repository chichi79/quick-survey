import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase 프로젝트 설정값은 .env.local에 VITE_FIREBASE_* 로 넣는다 (.env.example 참고).
 * .env.local은 .gitignore의 *.local 패턴에 걸려 커밋되지 않는다.
 *
 * 지금은 인증 없는 선행개발 프로토타입이라 Firestore 보안 규칙을 테스트 모드(완전 공개
 * 읽기/쓰기)로 둔다 — 실제 운영 데이터는 절대 넣지 말 것.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
