# 퀵서베이 FE 선행개발 (응답자 화면 데모)

대행사 제휴(트랙 A) / 자체 제작도구(트랙 B) 결정과 무관하게 재사용 가능한
**응답자 화면 컴포넌트**와 **공통 미션 카드 UI**를 Vanilla JS로 구현한 데모입니다.

## 실행 방법

브라우저에서 ES Module(`import`)을 쓰기 때문에 `index.html`을 더블클릭해서
바로 열면 CORS 에러가 납니다. 로컬 서버로 띄워서 확인해주세요.

```bash
# 방법 1: npm 스크립트 (serve 패키지 사용)
npm run dev

# 방법 2: Python이 있다면
python3 -m http.server 5173

# 방법 3: VSCode의 "Live Server" 확장
```

서버를 띄운 뒤 브라우저에서 `http://localhost:5173` 접속.

## 폴더 구조

```
quicksurvey/
├── index.html              앱 진입점 HTML
├── src/
│   ├── main.js              화면 전환 로직 (목록 → 설문 → 완료)
│   ├── demoData.js          데모용 미션 카드 / 샘플 설문 데이터
│   ├── styles.css           전체 스타일
│   ├── models/              데이터 모델 (UI와 분리된 순수 로직)
│   │   ├── question.js       문항 타입 정의 + 응답 검증
│   │   ├── skipLogic.js      분기 규칙 + 다음 문항 계산
│   │   └── missionCard.js    범용 리워드 미션 카드 모델
│   └── components/          DOM을 그리는 함수들
│       ├── MissionCard.js        미션 카드 + 리스트
│       ├── QuestionRenderer.js   문항 타입별 분기 (핵심 분기점)
│       ├── ChoiceQuestion.js     단일/복수 선택
│       ├── LikertQuestion.js     척도/평점
│       ├── OpenTextQuestion.js   주관식
│       ├── ProgressBar.js        진행률 바
│       └── SurveyContainer.js    전체 흐름 제어 (분기+진행률+네비게이션)
```

## 설계 원칙

- **문항 컴포넌트는 흐름을 모른다** — `ChoiceQuestion`, `LikertQuestion` 등은
  `question / value / onChange`만 받는다. 분기·진행률·다음 문항 계산은
  전부 `SurveyContainer`가 책임진다. 이렇게 분리해두면 어떤 대행사 API와
  연동하든 문항 컴포넌트는 그대로 재사용 가능하다.

- **미션 카드는 타입으로 확장한다** — `RewardMissionCard`는 `type` 필드
  (`survey` / `ad_view` / `app_install` ...)만 다르고 카드 형태는 동일하다.
  1단계(연애폴/퀵서베이)에서 만든 카드 UI가 2단계(오퍼월) 전체 그리드에도
  그대로 재사용되도록 설계했다.

- **Skip Logic은 문항에 내장하지 않는다** — 분기 규칙은 `SkipLogicRule[]`로
  별도 관리하고, `getNextQuestionId()`가 현재 응답 + 규칙을 받아 다음 문항을
  계산하는 순수 함수로 동작한다.

## 현재 구현 범위 / 미구현

| 구현됨 | 미구현 (후순위) |
|---|---|
| 단일/복수 선택 | 매트릭스 (행×열) |
| 척도(Likert) | 순위 선택 (Ranking, 드래그) |
| 주관식 | 이미지/카드 선택 |
| Skip Logic 분기 | 테마(브랜드 커스터마이징) — `models`에 인터페이스만 정의됨 |
| 미션 카드 + 리스트 | 어뷰징 방지 로직 (응답시간 계측 등) |
| 진행률 바 / 이전·다음 네비게이션 | 리워드 적립 실제 연동 (현재는 데모 alert/하드코딩) |

## 데모 흐름

1. `index.html` 접속 → 미션 카드 목록 표시
2. "여름휴가, 어디로 떠나고 싶나요?" 카드 클릭 → 샘플 설문 시작
3. Q1에서 "아니오" 선택 시 Q2(척도)를 건너뛰고 Q3(주관식)으로 분기되는 것 확인
4. 완료 화면에서 콘솔(`console.log`)에 실제 응답 데이터 출력 확인
