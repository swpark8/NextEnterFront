// src/features-company/navigation-menu/data/companyMenuData.ts

export const companyNavigationMenuData = {
  jobs: {
    id: "jobs",
    title: "채용공고 관리",
    items: [
      { id: "jobs-sub-1", label: "공고 목록" },
      { id: "jobs-sub-2", label: "공고 등록" },
    ],
  },
  applicants: {
    id: "applicants",
    title: "지원자 관리",
    items: [
      { id: "applicants-sub-1", label: "지원자 목록" },
      // { id: "applicants-sub-2", label: "적합도 분석" },
    ],
  },
  talent: {
    id: "talent",
    title: "인재 검색",
    items: [
      { id: "talent-sub-1", label: "인재 검색" },
      { id: "talent-sub-2", label: "스크랩 인재" },
    ],
  },
  credit: {
    id: "credit",
    title: "크레딧",
    items: [
      { id: "credit-sub-1", label: "크레딧 관리" },
      { id: "credit-sub-2", label: "크레딧 충전" },
    ],
  },
};
