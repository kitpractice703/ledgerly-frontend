# 💰 Ledgerly — Frontend

> **개발 기간:** 2026.03 ~
>
> **한 줄 소개:** React + MUI 기반 가계부 SPA — 대시보드·예산 관리·리포트 시각화를 제공하는 프론트엔드 프로젝트
>
> **🔗 라이브 데모:** https://ledgerly-kit.netlify.app
>
> **🔗 백엔드 저장소:** https://github.com/kitpractice703/ledgerly-backend

---

## 1. 프로젝트 소개

**Ledgerly**는 개인 수입·지출을 카테고리별로 관리하고, 예산 초과 여부를 실시간으로 파악할 수 있는 가계부 서비스입니다.  
백엔드([ledgerly-backend](https://github.com/kitpractice703/ledgerly-backend))와 완전히 분리된 **SPA(Single Page Application)** 구조로, JWT 토큰 기반 인증을 통해 API와 통신합니다.  
컴포넌트 설계보다 **인증 흐름 설계**, **페이지별 커스텀 훅 분리**, **UX 완성도**에 집중했습니다.

---

## 2. 기술 스택 (Tech Stack)

| 구분 | 기술 |
|------|------|
| Language | JavaScript (ES2022+) |
| Framework | React 18 |
| Build Tool | Vite 8 |
| UI Library | MUI (Material UI) v9 |
| Routing | React Router DOM v7 |
| Chart | Recharts |
| HTTP Client | Axios |
| Deployment | Netlify |

---

## 3. 프로젝트 구조

```
src/
├── api/
│   └── axios.js              # Axios 인스턴스 (baseURL, 인터셉터)
├── components/
│   ├── AppLayout/            # 사이드바 + 콘텐츠 레이아웃
│   └── PrivateRoute/         # 인증 보호 라우트
├── pages/
│   ├── public/               # 비로그인 페이지 (Landing, Login, Register, ...)
│   └── private/              # 로그인 전용 페이지 (Dashboard, Budget, Report, ...)
│       └── XxxPage/
│           ├── XxxPage.jsx   # UI 컴포넌트
│           └── useXxx.js     # 상태·API 로직 분리 (커스텀 훅)
└── styles/
    └── theme.js              # MUI 글로벌 테마
```

각 페이지는 `Page.jsx`(UI)와 `usePage.js`(로직) 두 파일로 분리하여 관심사를 명확히 구분했습니다.

---

## 4. 핵심 기능 및 설계 디테일

### ✅ JWT 기반 인증 흐름

- 로그인 성공 시 JWT 토큰과 사용자 정보를 `localStorage`에 저장합니다.
- `PrivateRoute` 컴포넌트가 `localStorage`의 토큰 유무를 확인하여 미인증 접근 시 랜딩 페이지(`/`)로 리다이렉트합니다.
- Axios 인스턴스에 `Authorization: Bearer <token>` 헤더를 자동으로 주입하는 요청 인터셉터를 설정했습니다.

### ✅ 대시보드

- 선택한 연·월의 총 수입, 총 지출, 잔액을 요약 카드로 표시합니다.
- 해당 월의 거래 내역 테이블과 예산별 진행률 바를 함께 보여줍니다.
- 이전/다음 달 네비게이션 버튼으로 월을 이동할 수 있습니다.

### ✅ 리포트 시각화 (Recharts)

- **연간 요약 카드:** 총 수입, 총 지출, 순이익, 저축률을 상단에 표시합니다.
- **월별 트렌드 바 차트:** 연간 12개월의 수입·지출을 BarChart로 시각화합니다.
- **카테고리별 파이 차트:** 선택한 월의 수입 또는 지출을 카테고리별 비율로 표시합니다. 각 항목에 퍼센트 레이블과 금액이 함께 표시됩니다.

### ✅ 카테고리 관리 (기본/개인 분리)

- 서버에서 내려오는 `default: true` 필드를 기준으로 기본 카테고리와 개인 카테고리를 분리하여 표시합니다.
- 기본 카테고리는 잠금 뱃지(`기본`)를 표시하고 수정·삭제 버튼을 숨깁니다.
- 개인 카테고리는 인라인 수정이 가능합니다.

### ✅ 예산 관리

- 카테고리별 월 예산을 등록·수정·삭제할 수 있습니다.
- 각 예산 항목에 실제 지출 대비 진행률 바와 초과 여부(Exceeded)를 시각적으로 표시합니다.

### ✅ 반응형 레이아웃

- MUI `useMediaQuery`를 활용하여 데스크톱에서는 고정 사이드바, 모바일에서는 햄버거 메뉴 + 드로어로 전환됩니다.

---

## 5. 트러블 슈팅 (Trouble Shooting)

### 🚨 Issue 1: 이전 달 이동 시 자동 로그아웃 현상

- **원인:** `useDashboard.js`의 API 호출 `.catch()` 블록에 `navigate('/login')`이 등록되어 있어, 401 외 다른 에러(네트워크 오류, 쿼리 파라미터 문제 등)에서도 강제 로그아웃이 발생했습니다.
- **해결:** `.catch(() => navigate('/login'))`을 `.catch(() => {})`로 변경. 401 처리는 Axios 인터셉터에서 일괄 처리하도록 책임을 분리했습니다.

---

### 🚨 Issue 2: 내 프로필 이메일 항목이 빈 값으로 표시

- **원인:** 로그인 성공 응답에서 `email`을 `localStorage`에 저장하는 로직이 누락되어 있었습니다. `useProfile.js`가 초기값을 `localStorage.getItem('email')`에서 읽지만 값이 없는 상태였습니다.
- **해결:** `useLogin.js`의 로그인 성공 핸들러에 `localStorage.setItem('email', data.email)` 추가.

---

### 🚨 Issue 3: pages 폴더 가독성 저하

- **원인:** 페이지가 늘어나면서 `pages/` 하위에 10개 이상의 디렉터리가 flat하게 나열되어 공개 페이지와 인증 전용 페이지의 구분이 불명확했습니다.
- **해결:** `pages/public/`(비로그인 접근 가능)과 `pages/private/`(로그인 필요)로 분리. `PrivateRoute` 적용 범위도 구조적으로 명확해졌습니다.
