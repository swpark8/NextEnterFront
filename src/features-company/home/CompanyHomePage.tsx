import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CompanyJobPostingCard, {
  JobPostingData,
} from "../components/CompanyJobPostingCard";

export default function CompanyHomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeService, setActiveService] = useState<string>("");

  // 로그인 필요한 페이지 이동 처리
  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/company/login");
      return;
    }
    navigate(path);
  };

  const services = [
    {
      id: "announcement",
      icon: "📄",
      title: "공고 등록",
      description: "채용 정보 관리",
      features: ["공고 작성", "지원자 확인", "공고 수정/삭제"],
      path: "/company/jobs",
    },
    {
      id: "talent",
      icon: "👥",
      title: "인재 검색",
      description: "인재 풀 검색",
      features: ["조건별 검색", "이력서 열람", "스크랩 관리"],
      path: "/company/talent-search",
    },
    {
      id: "applicants",
      icon: "📂",
      title: "지원자 관리",
      description: "지원 현황 및 분석",
      features: ["지원자 목록", "적합도 분석", "면접 제안"],
      path: "/company/applicants",
    },
    {
      id: "credit",
      icon: "🏢",
      title: "마이페이지",
      description: "회사 정보 수정 및 관리",
      features: ["크레딧 충전", "사용 내역", "충전 혜택"],
      path: "/company/credit",
    },
    {
      id: "credit",
      icon: "💳",
      title: "크레딧",
      description: "크레딧 충전 및 관리",
      features: ["크레딧 충전", "사용 내역", "충전 혜택"],
      path: "/company/credit",
    },
  ];

  // TODO: 나중에 API로 데이터 받아오기
  const jobPostings: JobPostingData[] = [
    {
      id: 1,
      badge: "프리미엄 급구 추천",
      badgeColor: "orange",
      title: "시니어 프론트엔드 개발자",
      description: "React, TypeScript 경험 5년 이상 | 월급 500만원 이상",
      tags: [
        "5년 이상 경력 필수",
        "React, TypeScript 전문가",
        "대규모 프로젝트 경험",
        "팀 리딩 경험 우대",
        "혁신적인 UI/UX 구현 능력",
      ],
      company: "테크 스타트업 A사",
      period: "급구 + 상시채용",
      salary: "연봉 6,000만원",
    },
    {
      id: 2,
      badge: "인기 급상승",
      badgeColor: "orange",
      title: "백엔드 개발자 (Node.js)",
      description: "Node.js, Express 기반 API 개발 | 3년 이상 경력",
      tags: [
        "3년 이상 실무 경험",
        "RESTful API 설계 및 구현",
        "데이터베이스 최적화 경험",
        "MSA 아키텍처 이해",
      ],
      company: "핀테크 기업 B사",
      period: "상시채용",
      salary: "연봉 5,000만원",
    },
    {
      id: 3,
      badge: "원격근무 가능",
      badgeColor: "purple",
      title: "풀스택 개발자",
      description: "React + Spring Boot 풀스택 | 경력 무관",
      tags: [
        "신입/경력 모두 가능",
        "React 및 Spring Boot 경험",
        "원격근무 주 2일 가능",
        "유연한 근무 환경",
        "성장 지향적인 팀 문화",
      ],
      company: "이커머스 C사",
      period: "상시채용",
      salary: "연봉 4,500만원",
    },
  ];

  const handleJobDetailClick = (jobId: number) => {
    handleProtectedNavigation(`/company/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 배너 */}
      <div className="py-8 text-white bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="px-4 mx-auto text-center max-w-7xl">
          <h1 className="mb-2 text-3xl font-bold">
            더 나은 인재를 구하기 위한 플랫폼
          </h1>
          <p className="text-purple-100">
            NextEnter에서 최고의 인재를 찾아보세요
          </p>
        </div>
      </div>

      {/* 서비스 카드 섹션 */}
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <h2 className="mb-6 text-xl font-bold">서비스 바로가기</h2>
        <div className="grid grid-cols-5 gap-4 mb-8">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setActiveService(service.id);
                handleProtectedNavigation(service.path);
              }}
              className={`p-6 bg-white border-2 rounded-xl hover:shadow-lg transition text-left ${
                activeService === service.id
                  ? "border-purple-500"
                  : "border-gray-200"
              }`}
            >
              <div className="mb-2 text-4xl">{service.icon}</div>
              <h3 className="mb-1 text-lg font-bold">{service.title}</h3>
              <p className="mb-3 text-sm text-gray-600">
                {service.description}
              </p>
              <div className="space-y-1 text-xs text-gray-500">
                {service.features.map((feature, idx) => (
                  <div key={idx}>• {feature}</div>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* 등록된 공고 섹션 */}
        <div>
          <h2 className="mb-6 text-xl font-bold">등록된 공고</h2>
          <div className="grid grid-cols-3 gap-6">
            {jobPostings.map((job) => (
              <CompanyJobPostingCard
                key={job.id}
                job={job}
                onDetailClick={handleJobDetailClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
