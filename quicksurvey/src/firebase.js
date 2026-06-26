import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { firebaseConfig } from './firebaseConfig.js';

/**
 * 빌더와 같은 Firestore 프로젝트를 본다 — firebaseConfig.js를 채우면 바로 연결된다.
 * 인증 없는 선행개발 프로토타입이라 Firestore 보안 규칙을 테스트 모드(완전 공개
 * 읽기/쓰기)로 둔다 — 실제 운영 데이터는 절대 넣지 말 것.
 */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
