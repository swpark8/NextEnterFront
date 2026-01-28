# 병합 충돌 해결 가이드 (Walkthrough)

## 개요
`CompanyHomePage.tsx` 및 `App.tsx`의 병합 충돌을 성공적으로 해결했으며, 요청하신 대로 `ApplicantDetailPage.tsx` 의 로직을 업데이트했습니다.

## 변경 사항

### 1. `CompanyHomePage.tsx`
- **해결 방식**: `origin/jinkyu` 버전 채택 (필터링된 채용 공고 목록).
- **상세 내용**: 클라이언트 측 필터링을 사용하여 현재 로그인한 기업의 공고만 표시되도록 강제했습니다.
- **참조**: [CompanyHomePage.tsx](src/features-company/home/CompanyHomePage.tsx)

### 2. `App.tsx`
- **해결 방식**: `origin/jinkyu` 버전 채택 (`/offers/interview` 경로).
- **상세 내용**: 면접 제안을 위한 일관된 라우팅 구조를 유지했습니다.
- **참조**: [App.tsx](src/App.tsx)

### 3. `ApplicantDetailPage.tsx`
- **업데이트**: 불합격(REJECTED)된 지원자에게도 다시 제안 가능하도록 변경.
- **상세 내용**:
  - **버튼**: `disabled` 조건에서 `REJECTED` 상태를 제거하여 버튼을 활성화했습니다.
  - **핸들러**: `handleInterviewOffer` 함수에서는 여전히 합격(ACCEPTED)된 지원자에 대한 중복 제안을 방지합니다 (안전장치).
- **참조**: [ApplicantDetailPage.tsx](src/features-company/applicants/ApplicantDetailPage.tsx)

## 검증 결과
- [x] 충돌 해결 완료.
- [x] 린트 오류 수정 완료 (import 관련).
- [ ] 빌드 검증 (커밋 완료 후 진행 예정).
