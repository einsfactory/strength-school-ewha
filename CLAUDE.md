# 근력학교 이화 - 프로젝트 가이드

## 목업 변경 시 GitHub 배포 규칙

목업(mockups/) 파일에 변경사항이 생기면 **반드시** 아래 절차를 실행한다:

1. 변경 내용을 커밋한다
2. `main` 브랜치에 push하여 GitHub Pages 자동 배포를 트리거한다
3. 배포 URL: https://einsfactory.github.io/strength-school-ewha/

이 규칙은 목업 작업이 완료될 때마다 매번 수행한다. 사용자에게 확인 없이 자동 실행한다.

## 목업-Plan 동기화 규칙

목업(mockups/) 파일에 변경사항이 생길 때마다, 해당 변경 내용을 Plan 문서(`docs/01-plan/features/strength-school-ewha.plan.md`)에 반영한다.

- UI 구조, 레이아웃, 컴포넌트 변경 → FR (Functional Requirements) 설명 업데이트
- 새로운 기능 추가 → 새 FR 항목 추가
- 화면 흐름 변경 → 9. 화면 구성 섹션 업데이트
- 데이터 관련 변경 → 8. 데이터 모델 섹션 업데이트
- Version History에 변경 내역 추가 (버전 넘버 0.1 단위 증가)

## 프로젝트 구조

```
mockups/          # HTML/CSS/JS 프로토타입
  login.html          # 로그인 화면
  dashboard.html      # 홈 대시보드 (수강생)
  class-status.html   # 수업현황 (출석달력)
  substitute.html     # 대체수강 신청
  holding.html        # 홀딩 신청
  profile.html        # 프로필 설정
  admin-dashboard.html  # 트레이너 대시보드
  admin-timetable.html  # 정규반 시간표 (수강생 검색/모달)
docs/
  01-plan/        # 기획서
  02-design/      # 설계서 (예정)
fonts/            # 커스텀 폰트 (CarmenSans, TYPE졸업식)
```

## UI 개발 규칙

- **UI 작업 시 반드시 `frontend-design` 스킬을 사용한다** (`/frontend-design`)
- 새로운 화면 생성, 기존 화면의 레이아웃/컴포넌트 변경, 디자인 개선 등 모든 UI 관련 작업에 적용
- 이 규칙은 mockups/ 폴더의 HTML/CSS/JS 작업과 향후 Next.js 컴포넌트 작업 모두에 해당

## 디자인 시스템

- 테마: 다크 퍼플-로즈 페미닌 그라데이션
- 본문 폰트: CarmenSans
- 타이틀 폰트: TYPE졸업식
- UI 스타일: 글래스모피즘 카드, 모바일 퍼스트
- 언어: 한국어 UI
- 레벨 색상: 초급=연두색, 중급=연보라색, 고급=보라색, 입학생=투명+점선
