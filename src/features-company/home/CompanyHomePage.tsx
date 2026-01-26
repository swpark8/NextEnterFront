import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CompanyJobPostingCard, {
  JobPostingData,
} from "../components/CompanyJobPostingCard";
import { getCompanyJobPostings, getJobPostings, JobPostingListResponse } from "../../api/job";

export default function CompanyHomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeService, setActiveService] = useState<string>("");
  const [jobPostings, setJobPostings] = useState<JobPostingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      id: "mypage",
      icon: "🏢",
      title: "마이페이지",
      description: "회사 정보 수정 및 관리",
      features: ["크레딧 충전", "사용 내역", "충전 혜택"],
      path: "/company/mypage",
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

  // 기업 공고 목록 조회
  useEffect(() => {
    const fetchCompanyJobs = async () => {
      if (!user?.companyId) {
        console.log("⚠️ companyId가 없습니다:", user);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log("🔄 API 호출 시작: companyId =", user.companyId);
        
        // ✅ /api/jobs/list를 사용하고 클라이언트에서 필터링
        const response = await getJobPostings({ size: 1000 }); // 전체 조회
        const myJobs = response.content.filter(
          (job: JobPostingListResponse) => job.companyId === user.companyId
        );
        
        console.log("✅ API 응답 받음:", myJobs);
        setJobPostings(myJobs);
      } catch (err: any) {
        console.error("❌ 공고 목록 조회 실패:", err);
        console.error("상태 코드:", err.response?.status);
        console.error("에러 메시지:", err.response?.data);
        setError("공고를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyJobs();
  }, [user?.companyId]);

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
          
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              로딩 중...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">
              {error}
            </div>
          ) : jobPostings.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              등록된 공고가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {jobPostings.map((job) => (
                <CompanyJobPostingCard
                  key={job.jobId}
                  job={job}
                  onDetailClick={handleJobDetailClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
