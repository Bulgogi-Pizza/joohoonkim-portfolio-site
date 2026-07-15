# 디자인 개편 스펙 — joohoonkim.site

날짜: 2026-07-15
상태: 승인된 방향 기반 구현 진행 중 (페이지 단위 검토 체크포인트)

## 목표

"젊은 과학자 — 신세대적이지만 전문적인" 분위기로 방문자 페이지 전체를 개편한다.
밋밋함 제거, 빈 공간 축소, 컴포넌트 개성 부여, 글씨체 교체가 핵심이다.

## 범위와 제약

- 대상: 방문자 페이지 전체 (Home, Research, CV, Publications, Awards, Talks, Media) + Navbar/Footer. Admin 제외.
- **백엔드 스키마 변경 없음.** 프론트엔드는 현재 API가 반환하는 필드만 렌더링한다. 새 콘텐츠 필드를 요구하는 디자인 금지.
- 장식용 가짜 데이터(좌표, 일련번호 등) 금지. 모노스페이스 라벨은 실제 데이터(연도·개수·소속)에만 사용.

## 확정된 디자인 방향 (시안 + 구현 반복으로 확정)

브라우저 시안 비교와 Home 구현 반복을 통해 사용자가 확정한 최종 방향은 **"절도있는 고대비 에디토리얼"**이다:

1. **베이스**: A2 "절제된 스위스" — 순수 흰 배경, 볼드 그로테스크 타이포, 모노 라벨
2. **금지**: 그라디언트, 컬러 도트 마커, 알약(rounded-full) 배지·필터, 원형 아이콘 칩, 이모지 — "아기자기한 포인트" 일절 금지 (사용자 명시 지시)
3. **섹션 헤더**: 2px 잉크 룰 + 볼드 타이틀 + 우측 모노 카운트 (SectionHeader, `inverted` 변형 있음)
4. **기하**: 카드 radius 4px, 칩 3px — 각진 형태. 호버는 미세 이동(-0.5px) + 보더가 잉크로 스냅
5. **입체감**: 레이어드 엘리베이션 그림자 유지 (다크에서는 카드 배경 대비 + 보더로 대체)
6. **활성 상태**: 검정 잉크 블록(bg-ink) 통일. 필터 칩은 각진 대문자 모노
7. **내비게이션**: 대문자 모노스페이스 메뉴(tracking 0.14em) + 활성 항목 2px 잉크 밑줄
8. **반전 밴드**: Home Cover Arts는 풀블리드 잉크 배경 밴드 (흰→검정→흰 페이지 리듬)
9. **포인트 컬러**: 단일 accent(#1d4ed8/#6b8cff) **확정** — 링크·킥커·연도 라벨에만 사용. (혼합 파랑·그라디언트 실험 후 사용자 결정으로 폐기)
10. **Home 배경**: 라우트 전체에 오로라 글로우 3개(우상단·좌중단·우하단, CSS-only). 격자·파티클·네트워크 효과는 실험 후 폐기
11. **Research 탭**: 좌측 스티키 사이드바 내비게이션 + 우측 본문
12. **다크모드**: 유지

## 디자인 토큰 (tailwind.config.js)

| 토큰 | 라이트 | 다크 |
|---|---|---|
| 페이지 배경 `paper` | #ffffff | `dark.bg` #0b0d12 |
| 카드 배경 `card` | #ffffff | `dark.card` #12151c |
| 본문 `ink` | #16181d | `dark.ink` #e8eaf0 |
| 보조 `ink-2` | #4b5261 | `dark.ink-2` #9aa3b3 |
| 희미 `ink-3` | #6b7280 | `dark.ink-3` #7d8598 |
| 선 `line` | #e8e9e4 | `dark.line` rgba(255,255,255,.08) |
| 포인트 `accent` | #1d4ed8 | `dark.accent` #6b8cff |

- 그림자: `shadow-elev` = `0 1px 2px rgba(22,24,29,.05), 0 4px 12px rgba(22,24,29,.06)`, `shadow-elev-hover` = `0 2px 4px rgba(22,24,29,.05), 0 16px 32px rgba(22,24,29,.12)`
- 기존 `brand`/`glass` 토큰은 제거하고 위 토큰으로 대체 (사용처 함께 수정).

## 폰트 (버그 수정 포함)

- 제목 `font-heading`: Space Grotesk / 본문 `font-sans`: Inter / 라벨 `font-mono`: IBM Plex Mono
- next/font(google)로 로드하고 CSS 변수(`--font-inter`, `--font-space-grotesk`, `--font-plex-mono`)를 tailwind `fontFamily`에 연결한다.
  - 현재 버그: tailwind.config.js가 변수 대신 폰트 이름('Inter', 'Outfit')을 직접 참조해 로드된 웹폰트가 적용되지 않음 (배포 사이트 computed style로 확인).
- Outfit 제거.

## 공유 컴포넌트 (components/ui/)

1. `SectionHeader` — 2px 잉크 룰 + 좌측 볼드 제목(font-heading) + 모노 카운트 + 옵션 우측 액션 링크 + `inverted` 변형(어두운 밴드용). 기존 "가운데 제목 + 파란 밑줄 바" 패턴 전면 교체.
2. `Card` — 엘리베이션 카드(radius 4px). `href`/`onClick` 주면 인터랙티브(호버 시 보더 잉크 스냅), `topBar`로 상단 2px 잉크 바.
3. `MonoLabel` — 모노스페이스 대문자 소형 라벨 (연도, 카운트, 킥커). `color: accent | muted`.
4. `Tag` — 각진(3px) 대문자 모노 태그. `active` 시 잉크 블록.

## 밀도

- 섹션 세로 패딩 `py-24` → `py-14` 수준으로 축소.
- 콘텐츠 최대폭 `max-w-6xl`로 통일. Research 페이지의 `lg:px-40` 제거.

## 페이지별 적용

- **Navbar**: 로고 font-heading, 활성 항목 accent, 스크롤 시 blur + hairline. 드롭다운 카드화(elevation).
- **Footer**: hairline 상단선 + 모노 소형 카피라이트.
- **Home Hero**: 배경 블롭 그라디언트 제거(순수 흰 배경). 좌 텍스트(제목 highlight만 accent, CTA: ink 필 버튼 + 고스트 버튼) / 우 Featured 캐러셀 유지(elevation 카드로 재스타일). `min-h-screen` 축소로 빈 공간 감소.
- **Home Research Areas**: SectionHeader + 카드 상단 2px ink 바 + elevation. 카드 전체 클릭.
- **Home Cover Arts**: 마퀴 유지, 카드 elevation 재스타일, 오버레이 색 accent 통일.
- **Home Publications**: 연도 모노 라벨 + hairline 리스트 행. 상위 5개 유지.
- **Research/[slug]**: 좌 사이드바(sticky, 분야 목록 + "RESEARCH · NN" 모노 라벨) + 우 본문. 마크다운 prose 크기 정상화(현재 h1 5xl 과대). 모바일에서는 사이드바를 가로 스크롤 칩으로 변환.
- **Publications / CV / Awards / Talks / Media**: 동일 토큰·컴포넌트 적용. 세부는 각 페이지 구현 시점에 현재 코드를 읽고 패턴을 적용.

## 진행 방식

- 순서: 기반(토큰+폰트+ui 컴포넌트+Navbar/Footer) → Home → Research → 나머지 페이지.
- **페이지 하나 완성될 때마다 사용자에게 알리고 디자인 검토 후 다음 페이지 진행.** (사용자 요청)
- 검증: 로컬 dev 서버를 운영 API(https://api.joohoonkim.site)에 연결해 실데이터로 라이트/다크/모바일 확인.

## 검증 기준

- 모든 방문자 페이지에서 기존 brand/glass/blue-600/indigo/sky 하드코딩이 토큰으로 대체됨
- 라이트/다크 모두에서 텍스트 대비 확보, 폰트가 실제로 Space Grotesk/Inter/IBM Plex Mono로 렌더링됨 (computed style 확인)
- 백엔드 API 호출·스키마 변경 없음 (diff에 fetch URL/필드 변경 없음)
