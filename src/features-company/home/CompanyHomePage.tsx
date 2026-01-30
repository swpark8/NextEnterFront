import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CompanyJobPostingCard, {
  JobPostingData,
} from "../components/CompanyJobPostingCard";
import { getJobPostings, JobPostingListResponse } from "../../api/job";

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
      title: "공고 등록",
      description: "채용 정보 관리",
      features: ["공고 작성", "지원자 확인", "공고 수정/삭제"],
      path: "/company/jobs",
      color: "from-blue-500 to-blue-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: "talent",
      title: "인재 검색",
      description: "인재 풀 검색",
      features: ["조건별 검색", "이력서 열람", "스크랩 관리"],
      path: "/company/talent-search",
      color: "from-indigo-500 to-indigo-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: "applicants",
      title: "지원자 관리",
      description: "지원 현황 및 분석",
      features: ["지원자 목록", "적합도 분석", "기업의 요청"],
      path: "/company/applicants",
      color: "from-violet-500 to-violet-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      id: "mypage",
      title: "마이페이지",
      description: "회사 정보 수정 및 관리",
      features: ["회사 프로필", "계정 설정", "알림 설정"],
      path: "/company/mypage",
      color: "from-slate-500 to-slate-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: "credit",
      title: "크레딧",
      description: "크레딧 충전 및 관리",
      features: ["크레딧 충전", "사용 내역", "충전 혜택"],
      path: "/company/credit",
      color: "from-emerald-500 to-emerald-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  // 기업 공고 목록 조회
  useEffect(() => {
    const fetchCompanyJobs = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 API 호출 시작: companyId =", user.companyId);

        // ✅ /api/jobs/list를 사용하고 클라이언트에서 필터링
        const response = await getJobPostings({ size: 1000 }); // 전체 조회
        const myJobs = response.content.filter(
          (job: JobPostingListResponse) => job.companyId === user.companyId,
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
  }, [user]); // ✅ user를 의존성에 추가 - 새로고침 시에도 user 로드되면 데이터 가져옴

  const handleJobDetailClick = (jobId: number) => {
    handleProtectedNavigation(`/company/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-white">
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

      {/* 서비스 카드 섹션 - 대기업 스타일 */}
      <div className="px-4 py-12 mx-auto max-w-7xl">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">서비스 바로가기</h2>
          <p className="text-gray-600">NextEnter가 제공하는 전문 채용 솔루션을 경험하세요</p>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-16">
          {services.slice(0, 3).map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setActiveService(service.id);
                handleProtectedNavigation(service.path);
              }}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-left border border-gray-100"
            >
              {/* 그라데이션 배경 */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color}`}></div>
              
              <div className="p-8">
                {/* 아이콘 */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                
                {/* 제목 */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                
                {/* 설명 */}
                <p className="text-sm text-gray-600 mb-4">
                  {service.description}
                </p>
                
                {/* 기능 목록 */}
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-500">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color} mr-2`}></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                {/* 화살표 아이콘 */}
                <div className="mt-6 flex items-center text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                  바로가기
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* 하단 2개 카드 */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {services.slice(3).map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setActiveService(service.id);
                handleProtectedNavigation(service.path);
              }}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-left border border-gray-100"
            >
              {/* 그라데이션 배경 */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color}`}></div>
              
              <div className="p-8">
                {/* 아이콘 */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                
                {/* 제목 */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                
                {/* 설명 */}
                <p className="text-sm text-gray-600 mb-4">
                  {service.description}
                </p>
                
                {/* 기능 목록 */}
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-500">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color} mr-2`}></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                {/* 화살표 아이콘 */}
                <div className="mt-6 flex items-center text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                  바로가기
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 등록된 공고 섹션 */}
        <div>
          <h2 className="mb-6 text-xl font-bold">등록된 공고</h2>

          {loading ? (
            <div className="py-12 text-center text-gray-500">로딩 중...</div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">{error}</div>
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
